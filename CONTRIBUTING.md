# Contribuindo com o SECOMP 2026.2

Agradecemos as contribuições para a galeria do minicurso **Do “Preciso disso” ao Deploy:
Como uma necessidade vira software?**. Este documento apresenta o fluxo recomendado para
configurar o projeto, desenvolver e enviar alterações.

## Pré-requisitos

- [Git](https://git-scm.com/)
- [Bun](https://bun.sh/) instalado
- [MongoDB](https://www.mongodb.com/) local ou uma instância do MongoDB Atlas para executar o
  backend

## Configuração local

1. Clone o repositório oficial:

   ```bash
   git clone https://github.com/seal-ufpe/secomp-2026.2.git
   cd secomp-2026.2
   ```

2. Instale as dependências do frontend:

   ```bash
   cd apps/frontend
   bun install
   ```

3. Em outro terminal, instale as dependências do backend:

   ```bash
   cd apps/backend
   bun install
   ```

4. Configure os arquivos `.env` a partir dos exemplos disponíveis em
   [`apps/backend/.env.example`](./apps/backend/.env.example) e no diretório do frontend.
   Para desenvolvimento sem MongoDB Atlas, o backend pode usar `USE_FAKE_DB=1`, conforme
   descrito no [README do backend](./apps/backend/README.md).

## Executar os serviços

No frontend:

```bash
cd apps/frontend
bun run dev
```

O frontend ficará disponível em [http://localhost:3000](http://localhost:3000).

No backend:

```bash
cd apps/backend
bun run dev
```

O endpoint de saúde do backend é [http://localhost:4000/health](http://localhost:4000/health),
conforme a porta definida na configuração local. Pelo Nginx, a API utiliza o prefixo `/api`.

## Validar alterações

Execute os comandos no serviço que foi alterado:

```bash
bun run lint
bun run typecheck
bun run test
```

No frontend, também é possível executar:

```bash
bun run build
bun run test:e2e
```

Antes de abrir um pull request, confirme que os testes relevantes passam e que não foram
incluídos segredos, tokens ou arquivos `.env`.

## Abrir um pull request

1. Crie uma branch a partir da branch principal:

   ```bash
   git checkout -b minha-feature
   ```

2. Faça as alterações e valide o serviço afetado.
3. Registre um commit com uma mensagem objetiva:

   ```bash
   git add .
   git commit -m "Descrição clara da mudança"
   ```

4. Envie a branch para o seu fork:

   ```bash
   git push origin minha-feature
   ```

5. Abra um pull request no repositório
   [`seal-ufpe/secomp-2026.2`](https://github.com/seal-ufpe/secomp-2026.2/pulls),
   descrevendo o que foi alterado e como a mudança foi validada.

## Documentação de deploy

Para criar e publicar um projeto, consulte os tutoriais na pasta [`tutorial`](./tutorial):

- [Criar uma conta no Lovable](./tutorial/README-LOVABLE.md)
- [Criar uma conta na Vercel](./tutorial/README-VERCEL.md)
- [Integrar Lovable e Vercel](./tutorial/README-INTEGRACAO.md)

Após publicar, cadastre a URL pública na
[galeria da SECOMP](https://secomp-2026-2.vercel.app/).

## Equipe de colaboração

- Ana Clara
- Amanda Trinity
- Gabriel Cássio
- Luiz Miguel
