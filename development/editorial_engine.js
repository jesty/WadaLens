// V16: individually drawn fashion croquis, no rectangular garment geometry.
// Each illustration has its own masks for the garments that actually appear.
const EDITORIAL_LOOKS = {
 'man|tee|trousers':'man-tee-trousers',
 'man|shirt|trousers':'man-shirt-trousers',
 'man|shirt-jacket|trousers':'man-shirt-jacket-trousers',
 'woman|shirt-jacket|skirt-knee':'woman-shirt-jacket-skirt-knee',
 'woman|shirt|skirt-knee':'woman-shirt-skirt-knee',
 'woman|tee|skirt-knee':'woman-tee-skirt-knee',
 'woman|tee|trousers':'woman-tee-trousers',
 'woman|shirt|trousers':'woman-shirt-trousers'
};
const editorialAssetCache = new Map();
const editorialSwatches = {
 'man-tee-trousers':{'top':[266,1289,151,75],'bottom':[468,1289,151,75],'shoes':[670,1289,149,75]},
 'man-shirt-trousers':{'top':[265,1290,152,74],'bottom':[469,1290,152,74],'shoes':[671,1290,151,74]},
 'man-shirt-jacket-trousers':{'top':[185,1290,152,75],'jacket':[380,1290,148,75],'bottom':[565,1290,148,75],'shoes':[751,1290,152,75]},
 'woman-shirt-jacket-skirt-knee':{'top':[172,1260,149,81],'jacket':[369,1260,150,81],'bottom':[566,1260,150,81],'shoes':[763,1260,150,81]},
 'woman-shirt-skirt-knee':{'top':[234,1260,156,81],'bottom':[465,1260,156,81],'shoes':[695,1260,157,81]},
 'woman-tee-skirt-knee':{'top':[251,1260,152,80],'bottom':[467,1260,152,80],'shoes':[683,1260,152,80]},
 'woman-tee-trousers':{'top':[234,1261,154,80],'bottom':[466,1261,155,80],'shoes':[699,1261,154,80]},
 'woman-shirt-trousers':{'top':[254,1260,152,81],'bottom':[468,1260,151,81],'shoes':[681,1260,151,81]}
};
function activeEditorialKey(){return EDITORIAL_LOOKS[[dressState.gender,dressState.top,dressState.bottom].join('|')]||null}
function loadEditorialPicture(path){
 return new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=()=>reject(new Error('Unable to load '+path));image.src='assets/editorial/'+path+'?v=16.1'})
}
function loadEditorialLook(key){
 if(editorialAssetCache.has(key))return editorialAssetCache.get(key);
 const pieces=Object.keys(editorialSwatches[key]);
 const images={};
 const tasks=[[key+'.png','base'],...pieces.map(p=>[key+'-'+p+'-mask.png',p]),[key+'-skin-mask.png','skin'],[key+'-hair-mask.png','hair']];
 const ready=Promise.all(tasks.map(async ([file,id])=>{images[id]=await loadEditorialPicture(file)})).then(()=>images);
 editorialAssetCache.set(key,ready);
 return ready;
}
function editorialColoredLayer(piece,mask){
 const layer=document.createElement('canvas');layer.width=TEMPLATE_SIZE.w;layer.height=TEMPLATE_SIZE.h;
 const c=layer.getContext('2d');
 const settings=pieceSettings(piece),base=outfitColor(piece);
 if(settings.type==='solid'||settings.type==='draw'){
  c.fillStyle=base;c.fillRect(0,0,layer.width,layer.height);
 }else{
  const tile=makeFabricTile(piece),pat=c.createPattern(tile,'repeat');
  if(pat?.setTransform){const angle=Number(settings.angle)*Math.PI/180;pat.setTransform(new DOMMatrix([Math.cos(angle),Math.sin(angle),-Math.sin(angle),Math.cos(angle),0,0]))}
  c.fillStyle=pat||base;c.fillRect(0,0,layer.width,layer.height);
 }
 for(const st of dressState.strokes[piece]||[]){
  if(!st.points?.length)continue;
  c.strokeStyle=st.color;c.fillStyle=st.color;c.lineCap='round';c.lineJoin='round';c.lineWidth=st.size*3.6;
  if(st.points.length===1){c.beginPath();c.arc(st.points[0][0],st.points[0][1],st.size*1.8,0,Math.PI*2);c.fill()}
  else{c.beginPath();c.moveTo(...st.points[0]);for(const p of st.points.slice(1))c.lineTo(...p);c.stroke()}
 }
 c.globalCompositeOperation='destination-in';c.drawImage(mask,0,0,layer.width,layer.height);
 return layer;
}
function editorialBodyTint(ctx,mask,color,opacity=0.7){
 const layer=document.createElement('canvas');layer.width=TEMPLATE_SIZE.w;layer.height=TEMPLATE_SIZE.h;
 const c=layer.getContext('2d');c.fillStyle=color;c.fillRect(0,0,layer.width,layer.height);
 c.globalCompositeOperation='destination-in';c.drawImage(mask,0,0);
 ctx.save();ctx.globalAlpha=opacity;ctx.drawImage(layer,0,0);ctx.restore();
}
let editorialRenderNonce=0;
async function drawNewEditorial(){
 const nonce=++editorialRenderNonce,key=activeEditorialKey(),preview=document.getElementById('dressPreview');
 if(!key)return;
 const assets=await loadEditorialLook(key);
 if(nonce!==editorialRenderNonce||activeEditorialKey()!==key)return;
 let canvas=preview.querySelector('canvas');
 if(!canvas){preview.replaceChildren();canvas=document.createElement('canvas');canvas.className='fashion-template';canvas.setAttribute('role','img');preview.append(canvas);canvas.addEventListener('pointerdown',templatePointerDown);canvas.addEventListener('pointermove',templatePointerMove);canvas.addEventListener('pointerup',templatePointerUp);canvas.addEventListener('pointercancel',templatePointerUp)}
 canvas.width=TEMPLATE_SIZE.w;canvas.height=TEMPLATE_SIZE.h;
 const c=canvas.getContext('2d');c.drawImage(assets.base,0,0);
 // Recolor only near-neutral fabric pixels; preserve the original croquis strokes.
 const pieces=Object.keys(editorialSwatches[key]).filter(p=>p!=='shoes');
 for(const piece of pieces)c.drawImage(editorialColoredLayer(piece,assets[piece]),0,0);
 c.drawImage(editorialColoredLayer('shoes',assets.shoes),0,0);
 // The base image remains in full: eyes, nose, hair, hands and natural folds.
 editorialBodyTint(c,assets.skin,dressState.skin,.85);
 editorialBodyTint(c,assets.hair,dressState.hair,.82);
 if(dressState.neck!=='none')drawNeckLayer(c,dressState.gender);
 const boxes=editorialSwatches[key];
 for(const [p,[x,y,w,h]] of Object.entries(boxes)){
  c.fillStyle=outfitColor(p);c.fillRect(x,y,w,h);
 }
 canvas.setAttribute('aria-label','Illustrated '+key.replaceAll('-',' ')+' with colorable clothing');
 preview.classList.toggle('draw-active',pieceSettings(activePiece).type==='draw');
 document.getElementById('dressStatus').textContent='Illustrated template · '+key.replaceAll('-',' ')+' · individually masked garments';
}
