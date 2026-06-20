# Sistema Web de Agendamento SaaS 3D

Projeto React + Vite pronto para publicar no GitHub e fazer deploy no Cloudflare Pages.

## Recursos incluídos

- Layout elegante, colorido, responsivo e com detalhes 3D.
- Formulário do cliente para solicitar agendamento.
- Painel do cliente mostrando status em laranja: **Aguardando confirmação**.
- Painel privado do prestador com login e senha.
- Lista de agendamentos pendentes para confirmação.
- Botão **Confirmar agendamento** que muda o status para verde: **Confirmado**.
- Botão de WhatsApp com mensagem pronta para avisar o cliente.
- Cadastro de novos serviços com nome, valor, categoria, descrição e imagem opcional.
- Personalização para SaaS: nome da empresa, segmento, logo, cores e banners de propaganda.
- Dados salvos no navegador usando `localStorage`.

## Login de demonstração

Usuário: `admin`
Senha: `123456`

> Para uso comercial real com vários empreendedores, o ideal é conectar Supabase/Firebase para salvar dados em banco, criar autenticação real e separar cada empresa por tenant.

## Como rodar no computador

```bash
npm install
npm run dev
```

## Deploy no Cloudflare Pages

1. Envie este projeto para um repositório no GitHub.
2. No Cloudflare Pages, clique em **Create a project**.
3. Escolha o repositório.
4. Configure:
   - Framework preset: `Vite`
   - Build command: `npm run build`
   - Build output directory: `dist`
5. Clique em **Save and Deploy**.

## Observação importante

Esta versão é frontend demonstrativa e funcional no navegador. Para vender como SaaS para vários clientes, a próxima etapa recomendada é integrar:

- Supabase Auth para login seguro.
- Banco Supabase para empresas, serviços, banners e agendamentos.
- Controle multi-tenant por empresa/assinante.
- Notificações reais via WhatsApp API ou link wa.me.
