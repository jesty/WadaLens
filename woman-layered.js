'use strict';
// Independent female Wada garment layers: 159 original precolored SVGs per item.
const USE_LAYERED_WOMAN_RENDER=true;
const WOMAN_LAYER_VERSION='46-exp12-sneakers';
const WOMAN_LAYER_REGISTRATION={
  tee:{dx:0,dy:0,sx:1,sy:1},shirt:{dx:0,dy:0,sx:1,sy:1},
  jacket:{dx:0,dy:0,sx:1,sy:1},trousers:{dx:0,dy:0,sx:1,sy:1},
  skirt:{dx:0,dy:0,sx:1,sy:1},shoes:{dx:0,dy:0,sx:1,sy:1},
  tie:{dx:0,dy:0,sx:1,sy:1},scarf:{dx:0,dy:0,sx:1,sy:1}
};
function womanDemoActive(){return new URLSearchParams(location.search).get('womanDemo')==='1'&&dressState.gender==='woman'&&dressState.top==='shirt-jacket';}
let womanRenderNonce=0;
const womanImageCache=new Map(),womanTemplateCache=new Map(),womanBodyCache=new WeakMap();
function womanLayerActive(){
 return USE_LAYERED_WOMAN_RENDER&&dressState.gender==='woman'&&
  ['tee','shirt','tee-jacket','shirt-jacket'].includes(dressState.top)&&
  ['trousers','skirt-knee'].includes(dressState.bottom);
}
function womanLayerGarments(){
 const top=dressState.top.startsWith('shirt')?'shirt':'tee';
 const bottom=isSkirt()?'skirt':'trousers';
 const items=[{kind:bottom,piece:'bottom'},{kind:top,piece:'top'}];
 if(hasJacket())items.push({kind:'jacket',piece:'jacket'});
 if(dressState.neck==='tie'&&top==='shirt')items.push({kind:'tie',piece:'neck'});
 if(dressState.neck==='scarf')items.push({kind:'scarf',piece:'neck'});
 items.push({kind:'shoes',piece:'shoes'});
 return items;
}
function womanLayerAnchor(kind){
 if(kind==='shoes')return [543,1150];
 if(kind==='trousers'||kind==='skirt')return [543,555];
 if(kind==='tie'||kind==='scarf')return [543,245];
 return [543,310];
}
function womanApplyRegistration(ctx,kind){
 const t=WOMAN_LAYER_REGISTRATION[kind];if(!t)return;
 const [x,y]=womanLayerAnchor(kind);
 ctx.translate(x+t.dx,y+t.dy);ctx.scale(t.sx,t.sy);ctx.translate(-x,-y);
}
function womanInversePoint(kind,p){
 const t=WOMAN_LAYER_REGISTRATION[kind];if(!t)return p;
 const [x,y]=womanLayerAnchor(kind);
 return [x+(p[0]-x-t.dx)/t.sx,y+(p[1]-y-t.dy)/t.sy];
}
function womanLayerAsset(kind,hex){
 return 'assets/layered/woman/'+kind+'/'+hex.slice(1)+'.svg?v='+WOMAN_LAYER_VERSION;
}
function womanLayerImage(kind,color){
 const hex=String(color||'#ffffff').toLowerCase(),key=kind+':'+hex;
 if(!/^#[0-9a-f]{6}$/.test(hex))return Promise.reject(new Error('Invalid garment color'));
 if(womanImageCache.has(key))return womanImageCache.get(key);
 const promise=(async()=>{
   // Use one crisp sneaker silhouette for every Wada shade instead of the old boot-like shoe masks.
   // The SVG retains a replaceable fill, so palette and custom colors behave identically.
   if(kind!=='shoes'&&palette.some(c=>c.hex.toLowerCase()===hex))return manLoadSvgImage(womanLayerAsset(kind,hex));
   if(!womanTemplateCache.has(kind))womanTemplateCache.set(kind,
     fetch(kind==='shoes'?'assets/layered/woman/shoes/sneaker-base.svg?v='+WOMAN_LAYER_VERSION:womanLayerAsset(kind,'#ffb3f0')).then(r=>{
       if(!r.ok)throw Error('Missing female SVG '+kind);return r.text();
     }));
   const src=(await womanTemplateCache.get(kind)).replace('fill="#ffb3f0"','fill="'+hex+'"');
   return manLoadSvgImage(URL.createObjectURL(new Blob([src],{type:'image/svg+xml'})),true);
 })();
 womanImageCache.set(key,promise);promise.catch(()=>womanImageCache.delete(key));
 return promise;
}
function womanProtectedBody(base){
 if(womanBodyCache.has(base.base))return womanBodyCache.get(base.base);
 const mask=document.createElement('canvas');
 mask.width=TEMPLATE_SIZE.w;mask.height=TEMPLATE_SIZE.h;
 const mc=mask.getContext('2d');
 if(base.skin)mc.drawImage(base.skin,0,0,TEMPLATE_SIZE.w,TEMPLATE_SIZE.h);
 if(base.hair)mc.drawImage(base.hair,0,0,TEMPLATE_SIZE.w,TEMPLATE_SIZE.h);
 const body=document.createElement('canvas');body.width=TEMPLATE_SIZE.w;body.height=TEMPLATE_SIZE.h;
 const c=body.getContext('2d');c.drawImage(base.base,0,0,TEMPLATE_SIZE.w,TEMPLATE_SIZE.h);
 c.globalCompositeOperation='destination-in';c.drawImage(mask,0,0);
 womanBodyCache.set(base.base,body);return body;
}
async function drawLayeredWoman(){
 const nonce=++womanRenderNonce,top=dressState.top,bottom=dressState.bottom;
 const baseKey=isSkirt()?'woman-tee-skirt-knee':'woman-tee-trousers';
 const items=womanLayerGarments();
 const [base,colors,details]=await Promise.all([
   loadEditorialLook(baseKey),
   Promise.all(items.map(x=>womanLayerImage(x.kind,outfitColor(x.piece)))),
   Promise.all(items.map(x=>manLoadSvgImage(
     'assets/layered/woman/'+x.kind+'/'+(x.kind==='shoes'?'sneaker-details.svg':'details.svg')+'?v='+WOMAN_LAYER_VERSION)))
 ]);
 if(nonce!==womanRenderNonce||!womanLayerActive()||top!==dressState.top||bottom!==dressState.bottom)return;
 const preview=document.getElementById('dressPreview');
 let canvas=preview.querySelector('canvas');
 if(!canvas){
   preview.replaceChildren();canvas=document.createElement('canvas');
   canvas.className='fashion-template';canvas.setAttribute('role','img');preview.append(canvas);
   canvas.addEventListener('pointerdown',templatePointerDown);
   canvas.addEventListener('pointermove',templatePointerMove);
   canvas.addEventListener('pointerup',templatePointerUp);
   canvas.addEventListener('pointercancel',templatePointerUp);
 }
 canvas.width=TEMPLATE_SIZE.w;canvas.height=TEMPLATE_SIZE.h;
 const ctx=canvas.getContext('2d');
 ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);
 ctx.drawImage(womanProtectedBody(base),0,0);
 if(base.skin)editorialBodyTint(ctx,base.skin,dressState.skin,.96);
 if(base.hair)editorialBodyTint(ctx,base.hair,dressState.hair,.85);
 for(let i=0;i<items.length;i++){
   const item=items[i],mask=colors[i];ctx.save();womanApplyRegistration(ctx,item.kind);
   ctx.drawImage(mask,0,0,canvas.width,canvas.height);
   // Same existing dynamic polka dots, stripes, denim, fabrics and Free Draw.
   // Every overlay is clipped to this garment silhouette, never the base.
   const pattern=manLayerPatternOverlay(item.piece,mask);
   if(pattern)ctx.drawImage(pattern,0,0);
   ctx.drawImage(details[i],0,0,canvas.width,canvas.height);
   ctx.restore();
 }
 canvas.setAttribute('aria-label','Woman outfit with independent precolored clothing layers');
 preview.classList.toggle('draw-active',garmentPaintMode);
 document.getElementById('dressStatus').textContent=
   'Experimental woman renderer · precolored independent layers · clipped fabric patterns';
}
async function womanLayerHitTest(pt){
 if(!womanLayerActive())return null;
 for(const item of womanLayerGarments().slice().reverse()){
  try{
   const image=await womanLayerImage(item.kind,outfitColor(item.piece));
   if(maskPixel(image,womanInversePoint(item.kind,pt))===true)return item.piece;
  }catch(err){console.warn('Female garment hit test:',err);}
 }
 return null;
}
