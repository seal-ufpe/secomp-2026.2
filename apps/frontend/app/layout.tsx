import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Template Bun",
  description: "Frontend starter built with Next.js, React and shadcn/ui.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
