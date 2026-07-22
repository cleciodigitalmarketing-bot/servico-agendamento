export async function onRequestGet({ params, request, env }) {
  const id = params.key;
  const row = await env.DB.prepare('SELECT object_key FROM ad_media WHERE id = ? AND active = 1').bind(id).first();
  if (!row) return new Response('Vídeo não encontrado.', { status: 404 });
  const object = await env.AD_VIDEOS.get(row.object_key, { range: request.headers });
  if (!object) return new Response('Vídeo não encontrado.', { status: 404 });
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('etag', object.httpEtag);
  headers.set('accept-ranges', 'bytes');
  headers.set('cache-control', 'public, max-age=3600');
  if (object.range) {
    const offset = object.range.offset ?? 0;
    const length = object.range.length ?? object.size;
    headers.set('content-range', `bytes ${offset}-${offset + length - 1}/${object.size}`);
    headers.set('content-length', String(length));
    return new Response(object.body, { status: 206, headers });
  }
  headers.set('content-length', String(object.size));
  return new Response(object.body, { headers });
}
