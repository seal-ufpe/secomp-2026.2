import type { Metadata } from 'next';
import './globals.css';
import { FooterBar } from '@/components/layout/footer-bar';
import { TopNav } from '@/components/layout/top-nav';

export const metadata: Metadata = {
  title: 'Galeria do Minicurso de Deploy',
  description: 'Projetos publicados pelos participantes do minicurso.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <TopNav />
        {children}
        <FooterBar />
      </body>
    </html>
  );
}
