# Sistema Web de Agendamento SaaS 3D

Projeto React + Vite pronto para GitHub e Cloudflare Pages.

## Recursos incluídos

- Layout elegante, colorido, 3D e totalmente responsivo.
- Cliente solicita agendamento pelo formulário.
- Status do cliente fica em laranja: **Aguardando confirmação**.
- Painel do prestador com login e senha.
- Prestador visualiza agendamentos pendentes e confirmados.
- Prestador pode confirmar, editar, remover e mandar mensagem no WhatsApp do cliente.
- Quando confirmado, o painel do cliente muda para verde: **Confirmado**.
- Cadastro, edição e remoção de serviços.
- Serviço com nome, valor, categoria, descrição e imagem opcional.
- Personalização de nome da empresa, segmento, cores, logo e banners.
- Logo ajustada automaticamente para preencher a moldura sem deformar.
- Campo para WhatsApp do prestador.
- Ao cliente finalizar o agendamento, o sistema abre o WhatsApp do prestador com a mensagem pronta contendo cliente, serviço, data e horário.

## Login do prestador

Usuário: `admin`  
Senha: `123456`

## Como rodar localmente

```bash
npm install
npm run dev
```

## Como gerar build

```bash
npm run build
```

## Deploy no Cloudflare Pages

Configurações recomendadas:

- Framework preset: `Vite`
- Build command: `npm run build`
- Build output directory: `dist`
- Node.js version: 20 ou superior

## Observação importante sobre WhatsApp

Esta versão é estática e funciona sem banco de dados, usando `localStorage` do navegador.

Por segurança, navegadores não permitem envio silencioso/automático de WhatsApp sem ação do usuário ou sem API oficial. Por isso, ao agendar, o sistema abre o WhatsApp Web/App do prestador com a mensagem pronta.

Para envio 100% automático em produção SaaS, será necessário integrar uma API oficial de WhatsApp, por exemplo:

- WhatsApp Cloud API da Meta
- Twilio WhatsApp
- Z-API, Evolution API ou outra solução homologada

## Próximo passo recomendado para SaaS real

Para alugar para vários empreendedores, o ideal é evoluir este projeto com:

- Supabase para banco de dados
- Login individual por empreendedor
- Tabela de empresas/clientes
- Tabela de serviços por empresa
- Tabela de agendamentos por empresa
- API de WhatsApp integrada

## Atualização: resolução correta das imagens

O painel do prestador agora informa automaticamente a resolução real de cada imagem enviada:

- Logo: mostra largura x altura em pixels, nome do arquivo, tipo e tamanho.
- Banner: mostra resolução enviada e recomenda formato horizontal.
- Imagem de serviço: mostra resolução enviada e recomenda formato quadrado ou horizontal.

Tamanhos recomendados:

- Logo: 800 x 800 px ou 1000 x 1000 px, preferencialmente PNG com fundo transparente.
- Banner: 1600 x 600 px ou 1920 x 720 px.
- Serviço: 1080 x 1080 px para card quadrado ou 1200 x 800 px para imagem horizontal.

A logo continua sendo ajustada automaticamente para preencher a moldura sem deformar.
