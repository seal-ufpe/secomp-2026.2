# Tutorial: criando uma conta na Vercel

A Vercel hospeda aplicações web e cria uma URL pública para cada deploy. Este passo a passo
mostra como criar a conta e publicar um projeto a partir de um repositório Git.

## 1. Criar a conta

1. Acesse [vercel.com/signup](https://vercel.com/signup).
2. Selecione **Continue with GitHub** (recomendado para importar repositórios) ou outra opção
   disponível.
3. Autorize a integração com GitHub quando solicitado.
4. No painel da Vercel, confirme o nome do seu time.

## 2. Importar e configurar o projeto

1. Clique em **Add New...** e depois em **Project**.
2. Selecione o repositório que contém o projeto. Se ele não aparecer, clique em **Adjust GitHub
   App Permissions** e autorize o repositório.
3. Confira o framework detectado e o diretório raiz.
4. Adicione somente as variáveis de ambiente necessárias em **Environment Variables**. Nunca
   coloque segredos no código ou no README.
5. Clique em **Deploy**.

## 3. Conferir o deploy

1. Aguarde a conclusão do build.
2. Abra **Visit** para acessar a URL pública.
3. Teste as rotas principais e o comportamento em uma janela anônima.
4. Use **Settings > Domains** se quiser adicionar um domínio próprio.

Novos commits na branch configurada geram novos deploys automaticamente. A aba **Deployments**
permite consultar o histórico e voltar para uma versão anterior.

## 4. Postar na galeria da SECOMP

1. Acesse [secomp-2026-2.vercel.app](https://secomp-2026-2.vercel.app/).
2. Clique em **Novo projeto**.
3. Cole a URL pública criada pela Vercel e preencha os dados do projeto.
4. Selecione a origem correspondente e publique.
