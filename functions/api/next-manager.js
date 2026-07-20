// Cloudflare Pages Function — GET /api/next-manager
// Hands out an ever-increasing counter so the frontend can round-robin
// leads across TEAM/ROTATION entries in index.html for clients whose
// country has no dedicated manager. Requires a KV namespace bound to
// this project as ROTATION_KV (Pages project -> Settings -> Functions
// -> KV namespace bindings).
export async function onRequestGet({ env }) {
  let current = 0;
  try {
    const raw = await env.ROTATION_KV.get('counter');
    current = raw ? parseInt(raw, 10) || 0 : 0;
  } catch (e) {}

  const next = current + 1;
  try {
    await env.ROTATION_KV.put('counter', String(next));
  } catch (e) {}

  return new Response(JSON.stringify({ index: next }), {
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' }
  });
}
