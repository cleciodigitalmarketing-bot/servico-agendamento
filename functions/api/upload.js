import { json, requireAdmin, safeName } from './_utils.js';

export async function onRequestPost({ request, env }) {
  const denied = requireAdmin(request, env); if (denied) return denied;
  const slot = Number(request.headers.get('x-ad-slot'));
  const type = request.headers.get('content-type') || 'application/octet-stream';
  const length = Number(request.headers.get('content-length') || 0);
  if (![0,1,2].includes(slot)) return json({ error: 'Espaço publicitário inválido.' }, 400);
  if (!type.startsWith('video/')) return json({ error: 'Somente arquivos de vídeo são permitidos.' }, 415);
  if (length > 80 * 1024 * 1024) return json({ error: 'O vídeo ultrapassa o limite de 80 MB.' }, 413);
  const name = safeName(request.headers.get('x-file-name') || 'video.mp4');
  const ext = (name.split('.').pop() || 'mp4').toLowerCase();
  const id = crypto.randomUUID();
  const key = `ads/slot-${slot}/${Date.now()}-${id}.${ext}`;
  await env.AD_VIDEOS.put(key, request.body, { httpMetadata: { contentType: type, cacheControl: 'public, max-age=31536000, immutable' }, customMetadata: { originalName: name, slot: String(slot) } });
  const current = await env.DB.prepare('SELECT COALESCE(MAX(position), -1) + 1 AS next_position FROM ad_media WHERE slot = ?').bind(slot).first();
  await env.DB.prepare('INSERT INTO ad_media (id,object_key,slot,file_name,content_type,size_bytes,position,active) VALUES (?,?,?,?,?,?,?,1)').bind(id, key, slot, name, type, length, Number(current?.next_position || 0)).run();
  return json({ key: id, name, type, size: length, url: `/api/ad-media/${id}` }, 201);
}
