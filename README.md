# AgendaPro Marketplace SaaS - versão Cloudflare sem erro npm

Esta versão foi criada para evitar erro do Cloudflare Pages com `npm clean-install`.
Não usa React, Vite nem bibliotecas externas. É HTML/CSS/JS puro, mas mantém layout moderno, 3D, marketplace, dashboards e agendamentos.

## Configuração no Cloudflare Pages

- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: deixe vazio
- Build system version: Version 3

## Logins de teste

Área de suporte:
- usuário: `suporte`
- senha: `admin123`

Prestadores:
- usuário: `bella`
- senha: `123456`

- usuário: `barbeiro`
- senha: `123456`

## Recursos

- Vitrine pública de empresas/autônomos
- Login separado para prestador
- Login separado para suporte
- Suporte cria logins dos clientes
- Dashboard individual do prestador
- Cadastro, edição e remoção de produtos/serviços
- Logo, banner, cor e WhatsApp por prestador
- Agendamento com status aguardando/confimado
- Confirmação, edição, remoção e WhatsApp do cliente
- Notificação via WhatsApp do prestador ao criar agendamento
- Resolução real das imagens enviadas
- Totalmente responsivo

Observação: esta versão usa `localStorage` para demonstração. Para virar SaaS real com vários clientes e dados salvos em nuvem, o próximo passo é conectar Supabase.
