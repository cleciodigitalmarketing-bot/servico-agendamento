# Sistema Web de Agendamento Marketplace SaaS

Versão corrigida para deploy no Cloudflare Pages.

## Configuração no Cloudflare Pages

- Framework preset: Vite
- Build command: npm run build
- Build output directory: dist
- Root directory: deixe vazio se os arquivos estiverem na raiz do repositório. Se você subir a pasta inteira, use: agendamento-web-pro

## Correção aplicada

O arquivo `package-lock.json` foi removido porque estava fazendo o Cloudflare usar `npm clean-install`, gerando erro de instalação. Também foram fixadas versões estáveis das dependências e adicionada uma `.npmrc` apontando para o registro público do npm.

## Logins de teste

Área de Suporte:
- Usuário: suporte
- Senha: 123456

Prestadores criados pelo suporte aparecem no login do prestador.
