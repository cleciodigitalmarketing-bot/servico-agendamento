# AgendaPro Business — Cloudflare R2 + D1

Projeto responsivo com carrosséis publicitários. Os vídeos são armazenados no Cloudflare R2 e os títulos, ordem e metadados ficam no Cloudflare D1.

## Recursos adicionados

- Upload de vários vídeos em cada um dos 3 espaços publicitários.
- Reprodução sequencial automática e repetição contínua.
- Armazenamento permanente no R2, disponível em todos os dispositivos.
- Cadastro dos metadados e da ordem no D1.
- Upload e exclusão protegidos pela variável secreta `ADMIN_UPLOAD_TOKEN`.
- Limite de 80 MB por vídeo no painel e na API.
- Entrega dos vídeos por Pages Functions com suporte a requisições de intervalo.

## Configuração resumida

1. Crie um bucket R2 chamado `agendapro-videos`.
2. Crie um banco D1 chamado `agendapro-db`.
3. Execute `migrations/0001_ads.sql` no console do D1.
4. No projeto Pages, crie os bindings:
   - R2: `AD_VIDEOS` → `agendapro-videos`
   - D1: `DB` → `agendapro-db`
5. Em **Settings > Variables and Secrets**, crie o segredo `ADMIN_UPLOAD_TOKEN` com uma chave forte.
6. Use o comando de build `npm run build` e o diretório de saída `dist`.
7. Publique o projeto. Ao enviar o primeiro vídeo, o painel solicitará a mesma chave definida em `ADMIN_UPLOAD_TOKEN`.

## Desenvolvimento local opcional

Copie `wrangler.toml.example` para `wrangler.toml`, preencha o ID do D1 e execute:

```bash
npm install
npm run build
npx wrangler d1 migrations apply agendapro-db --remote
npx wrangler pages dev dist --d1=DB --r2=AD_VIDEOS
```

Para desenvolvimento local, configure o segredo conforme a documentação do Wrangler ou use o painel Cloudflare no ambiente publicado.
