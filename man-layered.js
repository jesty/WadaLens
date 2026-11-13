'use strict';
// Experimental male-only renderer: 159 precolored transparent SVG assets per garment.
// Main branch and all female outfits continue using the existing editorial renderer.
const USE_LAYERED_MAN_RENDER = true;
let manLayerRenderNonce = 0;
const manLayerImageCache = new Map();
const manLayerTemplateCache = new Map();

function manLayerActive() {
  return USE_LAYERED_MAN_RENDER && dressState.gender === 'man' &&
    dressState.bottom === 'trousers' &&
    ['tee','tee-jacket','shirt','shirt-jacket'].includes(dressState.top);
}
function manLayerGarments() {
  const top = dressState.top.startsWith('shirt') ? 'shirt' : 'tee';
  const garments = [
    {kind:top,piece:'top'},
    {kind:'trousers',piece:'bottom'},
    ...(hasJacket() ? [{kind:'jacket',piece:'jacket'}] : []),
  ];
  if(dressState.neck==='tie' && top==='shirt')garments.push({kind:'tie',piece:'neck'});
  if(dressState.neck==='scarf')garments.push({kind:'scarf',piece:'neck'});
  return garments;
}
function manLayerPath(kind,hex) {
  return 'assets/layered/man/'+kind+'/'+hex.slice(1)+'.svg?v=45-exp1';
}
function manLoadSvgImage(url,temporary=false) {
  if(!temporary && manLayerImageCache.has(url))return manLayerImageCache.get(url);
  const promise = new Promise((resolve,reject)=>{
    const img=new Image();
    img.onload=()=>{if(temporary)URL.revokeObjectURL(url);resolve(img)};
    img.onerror=()=>{if(temporary)URL.revokeObjectURL(url);reject(new Error('Unable to load layer '+url))};
    img.src=url;
  });
  if(!temporary)manLayerImageCache.set(url,promise);
  return promise;
}
async function manLayerImage(kind,color) {
  const hex=String(color||'#ffffff').toLowerCase();
  if(!/^#[a-f0-9]{6}$/.test(hex))throw new Error('Invalid garment color '+hex);
  // Precolored asset for all 159 original Wada colors; custom / imported colors
  // are built from the same exact silhouette without editing the base illustration.
  if(palette.some(c=>c.hex.toLowerCase()===hex))
    return manLoadSvgImage(manLayerPath(kind,hex));
  const key=kind+':'+hex;
  if(manLayerImageCache.has(key))return manLayerImageCache.get(key);
  const promise=(async()=>{
    if(!manLayerTemplateCache.has(kind))manLayerTemplateCache.set(kind,
      fetch(manLayerPath(kind,'#ffb3f0')).then(r=>{if(!r.ok)throw new Error('SVG template unavailable');return r.text()}));
    const template=await manLayerTemplateCache.get(kind);
    const svg=template.replace('fill="#ffb3f0"','fill="'+hex+'"');
    const url=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml'}));
    return manLoadSvgImage(url,true);
  })();
  manLayerImageCache.set(key,promise);
  return promise;
}
function manLayerPatternOverlay(piece,mask) {
  const cfg=pieceSettings(piece),strokes=dressState.strokes[piece]||[];
  const hasDenim=dressState.denim[piece]!==undefined && dressState.denim[piece]!==null;
  if(!hasDenim && (cfg.type==='solid'||cfg.type==='draw') && !strokes.length)return null;
  const layer=document.createElement('canvas');layer.width=TEMPLATE_SIZE.w;layer.height=TEMPLATE_SIZE.h;
  const c=layer.getContext('2d');
  if(hasDenim && denimFill(c,piece)){
    c.fillRect(0,0,layer.width,layer.height);
  }else if(cfg.type!=='solid' && cfg.type!=='draw'){
    const tile=makeFabricTile(piece),pat=c.createPattern(tile,'repeat');
    if(pat?.setTransform){const angle=Number(cfg.angle)*Math.PI/180;
      pat.setTransform(new DOMMatrix([Math.cos(angle),Math.sin(angle),-Math.sin(angle),Math.cos(angle),0,0]));}
    c.fillStyle=pat||outfitColor(piece);c.fillRect(0,0,layer.width,layer.height);
  }
  for(const st of strokes){
    if(!st.points?.length)continue;
    c.strokeStyle=st.color;c.fillStyle=st.color;c.lineCap='round';c.lineJoin='round';c.lineWidth=st.size*3.6;
    if(st.points.length===1){c.beginPath();c.arc(st.points[0][0],st.points[0][1],st.size*1.8,0,Math.PI*2);c.fill()}
    else{c.beginPath();c.moveTo(...st.points[0]);for(const pt of st.points.slice(1))c.lineTo(...pt);c.stroke()}
  }
  c.globalCompositeOperation='destination-in';
  c.drawImage(mask,0,0,layer.width,layer.height);
  return layer;
}
async function drawLayeredMan() {
  const nonce=++manLayerRenderNonce,look=dressState.top;
  const baseKey=look.startsWith('shirt')?(hasJacket()?'man-shirt-jacket-trousers':'man-shirt-trousers'):'man-tee-trousers';
  // The tee base contains a real round neck and no shirt collar, even under a jacket.
  const items=manLayerGarments();
  const [base,colors,details]=await Promise.all([
    loadEditorialLook(baseKey),
    Promise.all(items.map(item=>manLayerImage(item.kind,outfitColor(item.piece)))),
    Promise.all(items.map(item=>manLoadSvgImage('assets/layered/man/'+item.kind+'/details.svg?v=45-exp1')))
  ]);
  if(nonce!==manLayerRenderNonce || !manLayerActive() || look!==dressState.top)return;
  const preview=document.getElementById('dressPreview');
  let canvas=preview.querySelector('canvas');
  if(!canvas){
    preview.replaceChildren();canvas=document.createElement('canvas');
    canvas.className='fashion-template';canvas.setAttribute('role','img');
    preview.append(canvas);
    for(const event of ['pointerdown','pointermove','pointerup','pointercancel']){
      canvas.addEventListener(event, {pointerdown:templatePointerDown,pointermove:templatePointerMove,
        pointerup:templatePointerUp,pointercancel:templatePointerUp}[event]);
    }
  }
  canvas.width=TEMPLATE_SIZE.w;canvas.height=TEMPLATE_SIZE.h;
  const ctx=canvas.getContext('2d');
  ctx.fillStyle='#ffffff';ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.drawImage(base.base,0,0,canvas.width,canvas.height);
  for(let n=0;n<items.length;n++){
    const item=items[n],mask=colors[n];
    // A short-sleeved tee stays below the jacket: clip its outer sleeves away
    // from the open blazer front without modifying or recoloring the garment file.
    const underJacket=item.piece==='top'&&hasJacket();
    if(underJacket){
      ctx.save();ctx.beginPath();
      ctx.moveTo(477,192);ctx.lineTo(612,192);
      ctx.lineTo(640,343);ctx.lineTo(587,534);
      ctx.lineTo(481,534);ctx.lineTo(440,343);
      ctx.closePath();ctx.clip();
    }
    ctx.drawImage(mask,0,0,canvas.width,canvas.height);
    const overlay=manLayerPatternOverlay(item.piece,mask);
    if(overlay)ctx.drawImage(overlay,0,0);
    ctx.drawImage(details[n],0,0,canvas.width,canvas.height);
    if(underJacket)ctx.restore();
  }
  if(base.shoes)ctx.drawImage(editorialColoredLayer('shoes',base.shoes),0,0);
  if(base.skin)editorialBodyTint(ctx,base.skin,dressState.skin,.96);
  if(base.hair)editorialBodyTint(ctx,base.hair,dressState.hair,.85);
  hideOutfitSwatches(ctx);
  canvas.setAttribute('aria-label','Experimental modular male outfit with precolored garment layers');
  preview.classList.toggle('draw-active',garmentPaintMode);
  document.getElementById('dressStatus').textContent=
    'Experimental man renderer · individual transparent precolored layers · patterns clipped per garment';
}
async function manLayerHitTest(point){
  if(!manLayerActive())return null;
  const garmentItems=manLayerGarments().slice().reverse();
  for(const item of garmentItems){
    const image=await manLayerImage(item.kind,outfitColor(item.piece));
    if(maskPixel(image,point)===true)return item.piece;
  }
  return null;
}
