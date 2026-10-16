'use client';

import { useState } from 'react';
import { BlockText } from '@/components/ui/block-text';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AdminPage() {
  const [logged, setLogged] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  async function login() {
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (!response.ok) {
      setError('Senha inválida.');
      return;
    }
    setLogged(true);
  }
  return (
    <main className="container max-w-xl py-12">
      <BlockText>Administração</BlockText>
      {logged ? (
        <div className="mt-8 border-2 border-neon bg-magenta p-8">
          <h2 className="text-2xl font-black text-neon">Painel protegido</h2>
          <p className="mt-3">Gerencie projetos e auditoria pelo painel.</p>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          <div>
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          {error && <p role="alert">{error}</p>}
          <Button onClick={login}>Entrar</Button>
        </div>
      )}
    </main>
  );
}
