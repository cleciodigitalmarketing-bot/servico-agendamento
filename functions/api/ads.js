import { json, requireAdmin } from './_utils.js';

const defaults = [
  ['Divulgue sua empresa', 'Sua marca em destaque para novos clientes.'],
  ['Anuncie seus produtos', 'Espaço premium para campanhas e promoções.'],
  ['Publicidade premium', 'Vídeos em um espaço vertical de alta visibilidade.'],
];

export async function onRequestGet({ env }) {
  try {
    const slots = await env.DB.prepare('SELECT slot, title, subtitle FROM ad_slots ORDER BY slot').all();
    const media = await env.DB.prepare('SELECT id, slot, file_name, content_type, size_bytes, position FROM ad_media WHERE active = 1 ORDER BY slot, position, created_at').all();
    const ads = defaults.map(([title, subtitle], slot) => ({ slot, title, subtitle, mediaItems: [] }));
    for (const row of slots.results || []) ads[row.slot] = { ...ads[row.slot], ...row, mediaItems: ads[row.slot]?.mediaItems || [] };
    for (const row of media.results || []) {
      if (!ads[row.slot]) continue;
      ads[row.slot].mediaItems.push({ key: row.id, name: row.file_name, type: row.content_type, size: row.size_bytes, url: `/api/ad-media/${row.id}` });
    }
    return json({ ads }, 200, { 'cache-control': 'no-store' });
  } catch (error) {
    return json({ error: 'D1 ainda não configurado ou migração não executada.', detail: String(error) }, 500);
  }
}

export async function onRequestPut({ request, env }) {
  const denied = requireAdmin(request, env); if (denied) return denied;
  const body = await request.json();
  if (!Array.isArray(body.ads)) return json({ error: 'Formato inválido.' }, 400);
  const statements = body.ads.slice(0, 3).map((ad, slot) => env.DB.prepare(`INSERT INTO ad_slots (slot,title,subtitle,updated_at) VALUES (?,?,?,datetime('now')) ON CONFLICT(slot) DO UPDATE SET title=excluded.title, subtitle=excluded.subtitle, updated_at=datetime('now')`).bind(slot, String(ad.title || ''), String(ad.subtitle || '')));
  await env.DB.batch(statements);
  return json({ ok: true });
}
