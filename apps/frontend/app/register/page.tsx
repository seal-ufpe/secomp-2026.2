"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BlockText } from "@/components/ui/block-text";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { createProject } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const result = await createProject(Object.fromEntries(form) as Parameters<typeof createProject>[0]);
      if (result.error) { setError(result.error.message); return; }
      if (result.editToken) { try { localStorage.setItem("editToken", result.editToken); } catch { /* storage may be disabled */ } }
      setDone(true);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Não foi possível cadastrar.");
    }
  }
  return <main className="container max-w-2xl py-12"><BlockText>Cadastrar projeto</BlockText>{done ? <div className="mt-8 border-2 border-neon bg-magenta p-8"><h2 className="text-2xl font-black text-neon">Projeto cadastrado!</h2><Button className="mt-6" onClick={() => router.push("/")}>Ver galeria</Button></div> : <form className="mt-8 space-y-5" onSubmit={submit}>
    <div><Label htmlFor="title">Título</Label><Input id="title" name="title" minLength={3} maxLength={60} required /></div>
    <div><Label htmlFor="authorName">Seu nome</Label><Input id="authorName" name="authorName" minLength={2} maxLength={60} required /></div>
    <div><Label htmlFor="origin">Origem</Label><Select id="origin" name="origin" required><option value="lovable">Lovable</option><option value="base44">Base44</option></Select></div>
    <div><Label htmlFor="description">Descrição (opcional)</Label><Input id="description" name="description" maxLength={140} /></div>
    <div><Label htmlFor="url">Link Vercel</Label><Input id="url" name="url" type="url" placeholder="https://seu-projeto.vercel.app" required /></div>
    <div><Label htmlFor="courseCode">Código do minicurso</Label><Input id="courseCode" name="courseCode" required /></div>
    <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px]" />
    {error && <p role="alert" className="border-2 border-neon bg-magenta p-3">{error}</p>}<Button type="submit">Publicar projeto</Button>
  </form>}</main>;
}
