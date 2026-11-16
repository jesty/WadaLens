'use strict';
// Experimental photo fabric view. It never changes the original illustrated assets.
// Each pre-generated photo is clipped to precisely the SAME garment alpha silhouette
// as the layered illustrated renderer, so registration and overlaps are preserved.
let photoLayerView=false;
let photoLayerRenderNonce=0;
const photoLayerImages=new Map(),photoLayerBoxes=new WeakMap();
const PHOTO_LAYERS_VERSION='photo-layer-v2-1';

function photoLayerImage(kind){
 const name=kind;
 const path='assets/photorealistic-layers/'+name+'.webp?v='+PHOTO_LAYERS_VERSION;
 if(!photoLayerImages.has(path)){
  const promise=new Promise((resolve,reject)=>{
   const image=new Image();
   image.onload=()=>resolve(image);
   image.onerror=()=>reject(new Error('Could not load photorealistic '+name));
   image.src=path;
  });
  photoLayerImages.set(path,promise);
  promise.catch(()=>photoLayerImages.delete(path));
 }
 return photoLayerImages.get(path);
}
function photoLayerBounds(image){
 if(photoLayerBoxes.has(image))return photoLayerBoxes.get(image);
 const w=image.naturalWidth||image.width,h=image.naturalHeight||image.height;
 const cvs=document.createElement('canvas');cvs.width=w;cvs.height=h;
 const cx=cvs.getContext('2d',{willReadFrequently:true});
 cx.drawImage(image,0,0,w,h);
 const pixels=cx.getImageData(0,0,w,h).data;
 let left=w,right=-1,top=h,bottom=-1;
 const step=w>600?3:1;
 for(let y=0;y<h;y+=step)for(let x=0;x<w;x+=step){
  if(pixels[(y*w+x)*4+3]<32)continue;
  left=Math.min(left,x);right=Math.max(right,x);
  top=Math.min(top,y);bottom=Math.max(bottom,y);
 }
 const bounds=right<0?null:{x:Math.max(0,left-step),y:Math.max(0,top-step),
  width:Math.min(w,right+step)-Math.max(0,left-step),
  height:Math.min(h,bottom+step)-Math.max(0,top-step)};
 photoLayerBoxes.set(image,bounds);
 return bounds;
}
function photoLayerTexture(mask,photo,hex,piece){
 const w=TEMPLATE_SIZE.w,h=TEMPLATE_SIZE.h;
 const dest=photoLayerBounds(mask),crop=photoLayerBounds(photo);
 if(!dest||!crop)return null;
 const layer=document.createElement('canvas');layer.width=w;layer.height=h;
 const c=layer.getContext('2d');
 // Scale the pre-generated garment photograph into the already registered
 // SVG silhouette. The photograph supplies folds/shading, the SVG supplies alpha.
 c.drawImage(photo,crop.x,crop.y,crop.width,crop.height,
  dest.x,dest.y,dest.width,dest.height);
 // Recolor the photograph but keep its highlights, texture and shadows.
 // Clipping LAST guarantees the color blend cannot paint a background rectangle.
 c.save();c.globalCompositeOperation='color';c.globalAlpha=.98;
 c.fillStyle=hex;c.fillRect(dest.x,dest.y,dest.width,dest.height);c.restore();
 c.globalCompositeOperation='destination-in';c.drawImage(mask,0,0,w,h);
 c.globalCompositeOperation='source-over';
 // The existing editor can still apply stripes, dots, denim, and free drawing.
 if(piece!=='shoes'){
  const pattern=manLayerPatternOverlay(piece,mask);
  if(pattern)c.drawImage(pattern,0,0,w,h);
 }
 return layer;
}
function photoLayerRefreshButton(){
 const b=document.getElementById('photoLayerToggle');
 if(!b)return;
 b.textContent=photoLayerView?'Illustrated view':'Photographic view';
 b.setAttribute('aria-pressed',String(photoLayerView));
 b.title=photoLayerView?'Switch back to the original illustrated model':'Show pre-generated photographic garment layers';
}
function photoLayerMaleShoeMask(){
 // Use the exact same shoe silhouette path as the illustrated male renderer.
 const mask=document.createElement('canvas');mask.width=TEMPLATE_SIZE.w;mask.height=TEMPLATE_SIZE.h;
 const c=mask.getContext('2d');c.fillStyle='#fff';c.fill(manFullShoePath());
 return Promise.resolve(mask);
}
async function drawPhotographicLayered(){
 const nonce=++photoLayerRenderNonce;
 const woman=dressState.gender==='woman';
 const active=woman?womanLayerActive():manLayerActive();
 if(!active)throw new Error('No layered garment renderer for this model');
 // Draw the unchanged face, hands, skin, hair and bottom-most outfit first.
 if(woman)await drawLayeredWoman();else await drawLayeredMan();
 if(nonce!==photoLayerRenderNonce||!photoLayerView||dressState.gender!==(woman?'woman':'man'))return;
 const items=woman?womanLayerGarments():manLayerGarments();
 const relevant=woman?items:[...items,{kind:'shoes',piece:'shoes'}];
 const data=await Promise.all(relevant.map(async item=>{
  const hex=item.kind==='shoes'?dressState.shoeColor:outfitColor(item.piece);
  const [mask,photo]=await Promise.all([
   woman?womanLayerImage(item.kind,hex):
    item.kind==='shoes'?photoLayerMaleShoeMask():manLayerImage(item.kind,hex),
   photoLayerImage(item.kind)
  ]);
  return {item,mask,photo,hex};
 }));
 if(nonce!==photoLayerRenderNonce||!photoLayerView||dressState.gender!==(woman?'woman':'man'))return;
 const canvas=document.querySelector('#dressPreview canvas');
 if(!canvas)return;
 const c=canvas.getContext('2d');
 for(const {item,mask,photo,hex} of data){
  const layer=photoLayerTexture(mask,photo,hex,item.piece);
  if(!layer)continue;
  c.save();
  if(woman)womanApplyRegistration(c,item.kind);
  else{
   if(item.piece==='top'&&hasJacket()){
    c.beginPath();c.moveTo(477,185);c.lineTo(616,185);c.lineTo(643,344);
    c.lineTo(605,552);c.lineTo(469,552);c.lineTo(437,344);c.closePath();c.clip();
   }
   manApplyRegistration(c,item.kind);
  }
  if(item.kind==='shirt'){
   if(woman)womanCutShirtNeck(c);else manCutShirtNeck(c);
  }
  if(item.kind==='shoes')c.globalAlpha=.7;
  c.drawImage(layer,0,0,canvas.width,canvas.height);
  c.restore();
 }
 canvas.setAttribute('aria-label','Photographically textured independent '+dressState.gender+' garments');
 document.getElementById('dressStatus').textContent=
  'Photographic view · independent alpha-clipped clothing images · experimental';
}
