/* POLYGLOT AI service worker — offline app shell + data */
const VERSION = "pa-v1.0.0";
const ASSETS = ["./","index.html","app.css","manifest.webmanifest","js/core.js","js/vocab.js","js/skills.js","js/ai.js","js/pages.js",
  "data/languages.json","data/vocab.json","data/grammar.json","data/content.json","data/scenarios.json",
  "icons/icon-192.png","icons/icon-512.png","icons/apple-touch-icon.png","icons/favicon-32.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const req = e.request; if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) { // fonts: cache-first, best effort
    e.respondWith(caches.match(req).then(r => r || fetch(req).then(res => { const cp = res.clone(); caches.open(VERSION).then(c => c.put(req, cp)); return res; }).catch(() => r)));
    return;
  }
  // network-first so updates arrive, fallback to cache offline
  e.respondWith(fetch(req).then(res => { if (res.ok) { const cp = res.clone(); caches.open(VERSION).then(c => c.put(req, cp)); } return res; })
    .catch(() => caches.match(req, { ignoreSearch:true }).then(r => r || caches.match("index.html"))));
});
