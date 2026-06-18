export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const q = url.searchParams.get('q');
  const by = url.searchParams.get('by') || 'name-desc';

  if (!q || q.length < 2) {
    return new Response(JSON.stringify({ error: 'query too short' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const aurUrl = `https://aur.archlinux.org/rpc/v5/search/${encodeURIComponent(q)}?by=${by}`;

  try {
    const res = await fetch(aurUrl, {
      headers: { 'User-Agent': 'aur-search-app/1.0' },
    });
    const data = await res.json();

    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=60',
      },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'AUR APIへの接続に失敗しました' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
