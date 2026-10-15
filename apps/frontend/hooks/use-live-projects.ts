"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type LiveProject = {
  _id: string;
  title: string;
  authorName: string;
  origin: "lovable" | "base44";
  createdAt: string;
  [key: string]: unknown;
};

export function useLiveProjects() {
  const [projects, setProjects] = useState<LiveProject[]>([]);
  const [connectionState, setConnectionState] = useState<"live" | "reconnecting" | "polling">("reconnecting");
  const eventSource = useRef<EventSource | null>(null);
  const pollTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const load = useCallback(async () => {
    const response = await fetch("/api/projects");
    if (!response.ok) throw new Error("Falha ao carregar projetos");
    const data = (await response.json()) as { items: LiveProject[] };
    setProjects((current) => {
      const merged = new Map(current.map((project) => [project._id, project]));
      data.items.forEach((project) => merged.set(project._id, project));
      return [...merged.values()].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
    });
  }, []);

  useEffect(() => {
    void load();
    const open = () => {
      eventSource.current?.close();
      const source = new EventSource("/api/projects/stream");
      eventSource.current = source;
      source.onopen = () => {
        setConnectionState("live");
        if (pollTimer.current) clearInterval(pollTimer.current);
      };
      source.onmessage = (event) => {
        const change = JSON.parse(event.data) as { _id: string; deleted?: boolean };
        setProjects((current) => {
          if (change.deleted) return current.filter((project) => project._id !== change._id);
          const next = current.filter((project) => project._id !== change._id);
          return [...next, change as LiveProject].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
        });
      };
      source.onerror = () => {
        setConnectionState("polling");
        source.close();
        if (!pollTimer.current) pollTimer.current = setInterval(() => void load(), 5000);
        window.setTimeout(open, 30_000);
      };
    };
    open();
    return () => {
      eventSource.current?.close();
      if (pollTimer.current) clearInterval(pollTimer.current);
    };
  }, [load]);

  return useMemo(() => ({ projects, connectionState }), [projects, connectionState]);
}
