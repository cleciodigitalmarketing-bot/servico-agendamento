# AgendaPro Marketplace SaaS

Sistema web de agendamento em formato SaaS para alugar para empresas e autônomos.

## O que foi atualizado

- Página principal em formato de vitrine/marketplace.
- Lista lateral com empresas/autônomos cadastrados.
- Ao clicar em uma empresa, aparece a vitrine própria dela com logo, banners, descrição, serviços/produtos, valores e fotos.
- O público escolhe um produto/serviço e solicita agendamento.
- O agendamento entra como **Aguardando confirmação** em laranja.
- Área do prestador separada da página principal.
- Área de suporte separada para criação de logins dos clientes.
- Cada prestador acessa apenas o próprio dashboard.
- Dashboard do prestador permite:
  - visualizar agendamentos;
  - confirmar agendamento;
  - editar agendamento;
  - remover agendamento;
  - mandar WhatsApp para o cliente;
  - cadastrar/editar/remover produtos ou serviços;
  - inserir foto, valor, categoria e descrição;
  - inserir logo, banners, cores e WhatsApp do estabelecimento.
- Ao cliente solicitar agendamento, o sistema abre o WhatsApp do prestador com a mensagem pronta contendo nome, serviço, data e horário.
- Uploads exibem resolução real da imagem enviada e recomendação de tamanho.
- Logo configurada para preencher toda a moldura com `object-fit: cover`, evitando espaço branco.
- Layout moderno, colorido, responsivo, com glassmorphism e detalhes 3D.

## Acessos de teste

### Área de suporte
- Usuário: `suporte`
- Senha: `123456`

### Prestador 1
- Usuário: `bella`
- Senha: `123456`

### Prestador 2
- Usuário: `prime`
- Senha: `123456`

## Deploy no Cloudflare Pages

- Framework preset: `Vite`
- Build command: `npm run build`
- Build output directory: `dist`

## Importante

Esta versão usa `localStorage`, ideal para protótipo, apresentação comercial e demonstração.
Para transformar em SaaS real com dados online para vários clientes, o próximo passo é integrar com Supabase, autenticação real e armazenamento de imagens.

Para envio 100% automático de WhatsApp sem abrir janela, será necessário integrar a API oficial do WhatsApp Business ou outro provedor autorizado.
