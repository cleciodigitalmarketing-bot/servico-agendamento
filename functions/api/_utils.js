export function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', ...headers },
  });
}

export function requireAdmin(request, env) {
  const expected = env.ADMIN_UPLOAD_TOKEN;
  const auth = request.headers.get('authorization') || '';
  if (!expected) return json({ error: 'ADMIN_UPLOAD_TOKEN não foi configurado.' }, 500);
  if (auth !== `Bearer ${expected}`) return json({ error: 'Chave administrativa inválida.' }, 401);
  return null;
}

export function safeName(value = 'video.mp4') {
  return decodeURIComponent(value).replace(/[^a-zA-Z0-9._ -]/g, '_').slice(0, 120) || 'video.mp4';
}
