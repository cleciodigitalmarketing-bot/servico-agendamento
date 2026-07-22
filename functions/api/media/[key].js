import { json, requireAdmin } from '../_utils.js';
export async function onRequestDelete({ params, request, env }) {
  const denied = requireAdmin(request, env); if (denied) return denied;
  const id = params.key;
  const row = await env.DB.prepare('SELECT object_key FROM ad_media WHERE id = ?').bind(id).first();
  if (row) await env.AD_VIDEOS.delete(row.object_key);
  await env.DB.prepare('DELETE FROM ad_media WHERE id = ?').bind(id).run();
  return json({ ok: true });
}
