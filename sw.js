// ハウスのようす — service worker
// - 画面（index.html・アイコンなど）だけを端末に置く。電波が無くても画面は開ける
// - ハウスの値・箱数・病害虫（Supabase）は端末に置かない。いつも最新を取りに行く
// - 画面は「まずネット → だめなら端末の分」。直したら次に開いたときに新しい画面になる
// - GitHub Pages はブラウザに 10 分ためさせるので、いつもサーバーに確かめる（no-cache。変わっていなければ小さい返事で済む）
// 画面のファイルを増やしたら SHELL に足し、CACHE の版を上げる
const CACHE = 'family-house-v6';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL.map((u) => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  const url = new URL(req.url);
  // 同じサイトの GET だけ扱う（Supabase などはそのまま通す）
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;
  e.respondWith(
    fetch(req, { cache: 'no-cache' })
      .then((res) => {
        if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
        return res;
      })
      .catch(() => caches.match(req).then((hit) => hit || (req.mode === 'navigate' ? caches.match('./index.html') : Response.error())))
  );
});
