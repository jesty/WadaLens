const CACHE='wada-lens-v30-github-pages';
const FILES=['./','./index.html','./app.js?v=30.0','./manifest.webmanifest','./icon.svg','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
for(const gender of ['man','woman']){
 for(const part of ['overlay','skin','hair','shoes-ink','top','bottom','shoes',...(gender==='woman'?['jacket','tights']:[])]){
  FILES.push('./assets/'+gender+'-'+part+'.png?v=30.0');
 }
}
// Dedicated editorial images and masks are available offline after installation.
for(const id of ['man-tee-shorts','man-long-tee-trousers','man-tee-jacket-trousers','man-shirt-jeans','woman-shirt-jacket-trousers','woman-long-tee-skirt-knee','woman-tee-jacket-skirt-knee','woman-shirt-jeans','man-tee-trousers','man-shirt-trousers','man-shirt-jacket-trousers','woman-shirt-jacket-skirt-knee','woman-shirt-skirt-knee','woman-tee-skirt-knee','woman-tee-trousers','woman-shirt-trousers']){
 FILES.push('./assets/editorial/'+id+'.png?v=30.0');
 const pieces=id.includes('jacket')?['top','jacket','bottom','shoes']:['top','bottom','shoes'];
 for(const p of [...pieces,'skin','hair'])FILES.push('./assets/editorial/'+id+'-'+p+'-mask.png?v=30.0');
}
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)));self.skipWaiting()});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);if(url.origin!==location.origin)return;
 if(event.request.mode==='navigate'||url.pathname.endsWith('/app.js')||url.pathname.endsWith('/index.html')){
  event.respondWith(fetch(event.request).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy))}return response}).catch(()=>caches.match(event.request).then(response=>response||caches.match('./index.html'))));
 }else{
  event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy))}return response})));
 }
});
