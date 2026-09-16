
const CACHE='BPX-1.0.2';
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(['./','./index.html','./style.css','./app.js','./update.js','./manifest.json'])));});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{const ks=await caches.keys();await Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)));await self.clients.claim();const cs=await self.clients.matchAll({type:'window'});cs.forEach(c=>c.postMessage({type:'NEW_VERSION'}));})());});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(fetch(e.request).then(r=>{caches.open(CACHE).then(c=>c.put(e.request,r.clone()));return r;}).catch(()=>caches.match(e.request)));});
