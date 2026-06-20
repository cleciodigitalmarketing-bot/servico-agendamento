# Sistema Web de Agendamento - AgendaPro 3D

Projeto criado em React + Vite, pronto para publicar no GitHub e fazer deploy no Cloudflare Pages.

## Recursos

- Layout elegante, profissional, colorido e responsivo
- Detalhes visuais com profundidade 3D
- Formulário de agendamento
- Lista de agendamentos salva no navegador via LocalStorage
- Botão para confirmar agendamento
- Botão para chamar cliente no WhatsApp
- Cards de serviços e painel com contadores

## Como rodar no computador

```bash
npm install
npm run dev
```

## Como fazer deploy no Cloudflare Pages

1. Envie este projeto para um repositório no GitHub.
2. No Cloudflare, vá em **Workers & Pages** > **Create application** > **Pages**.
3. Conecte o GitHub e selecione o repositório.
4. Configure assim:
   - Framework preset: **Vite**
   - Build command: `npm run build`
   - Build output directory: `dist`
5. Clique em **Save and Deploy**.

## Observação

Este projeto é frontend puro. Os agendamentos ficam salvos no navegador do usuário. Para uso comercial com login, banco de dados e painel administrativo online, integre com Supabase ou Firebase.
