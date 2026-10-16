# Tutorial: integrando Lovable e Vercel

Esta integração usa o Lovable para criar e editar o projeto e a Vercel para gerar o deploy
público. O fluxo depende de um repositório GitHub conectado ao projeto.

## Pré-requisitos

- Uma conta no [Lovable](https://lovable.dev/).
- Uma conta na [Vercel](https://vercel.com/), conectada ao GitHub.
- Um projeto no Lovable com o repositório GitHub sincronizado.

## 1. Conectar o Lovable ao GitHub

1. Abra o projeto no Lovable.
2. Use a opção de conectar ou sincronizar com o GitHub.
3. Autorize o acesso e escolha **Create repository** para criar um repositório novo, ou selecione
   um repositório existente.
4. Faça um commit das alterações e confira o código diretamente no GitHub.

## 2. Importar o repositório na Vercel

1. Acesse o [painel da Vercel](https://vercel.com/dashboard).
2. Clique em **Add New... > Project** e importe o repositório sincronizado pelo Lovable.
3. Confira o diretório raiz, o comando de build e as variáveis de ambiente.
4. Clique em **Deploy** e aguarde o build.
5. Copie a URL pública exibida pela Vercel.

## 3. Manter o fluxo funcionando

1. Edite o projeto no Lovable.
2. Revise o preview e sincronize a alteração com o GitHub.
3. Confirme que o commit chegou à branch configurada na Vercel.
4. A Vercel iniciará um novo deploy automaticamente. Valide a URL após a conclusão.

Se o deploy falhar, consulte os logs em **Deployments**, corrija o erro no Lovable ou no
repositório e publique novamente. Nunca versione chaves de API; cadastre-as nas variáveis de
ambiente da Vercel.

## 4. Publicar na galeria

Quando a URL estiver funcionando, acesse [secomp-2026-2.vercel.app](https://secomp-2026-2.vercel.app/)
e clique em **Novo projeto**. Informe a URL da Vercel, selecione a origem correta e publique
para que o projeto apareça na galeria da SECOMP.
