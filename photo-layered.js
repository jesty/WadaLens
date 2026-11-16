'use strict';
// Experimental photo fabric view. It never changes the original illustrated assets.
// Each pre-generated photo is clipped to precisely the SAME garment alpha silhouette
// as the layered illustrated renderer, so registration and overlaps are preserved.
let photoLayerView=false;
let photoLayerRenderNonce=0;
const photoLayerImages=new Map(),photoLayerBoxes=new WeakMap();
const PHOTO_LAYERS_VERSION='photo-layer-v2-5';

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
// Bounds are determined without getImageData: CDN-hosted assets can taint
// canvases on preview hosts even while displaying normally.
const PHOTO_LAYER_TARGET_BOXES={
 man:{tee:[374,195,382,354],shirt:[374,175,382,410],jacket:[357,169,402,465],
 trousers:[421,527,275,686],tie:[504,193,83,355],scarf:[441,185,211,220],shoes:[470,1030,150,245]},
 woman:{tee:[390,186,308,349],shirt:[385,176,330,410],jacket:[356,165,392,466],
 trousers:[426,516,255,711],skirt:[432,400,208,400],tie:[504,193,83,355],
 scarf:[445,182,206,228],shoes:[465,1035,155,230]}
};
const PHOTO_LAYER_SOURCE_INSETS={
 tee:[.08,.07,.84,.76],shirt:[.10,.07,.80,.79],jacket:[.04,.07,.92,.84],
 trousers:[.19,.06,.62,.88],skirt:[.14,.08,.72,.76],
 tie:[.30,.10,.40,.82],scarf:[.10,.08,.80,.82],shoes:[.07,.14,.86,.73]
};
function photoLayerBounds(image,kind,isMask,gender){
 const w=image.naturalWidth||image.width,h=image.naturalHeight||image.height;
 if(!w||!h)return null;
 if(isMask){
  const box=PHOTO_LAYER_TARGET_BOXES[gender]?.[kind];
  if(!box)throw new Error('No registration box for '+gender+' '+kind);
  return {x:box[0],y:box[1],width:box[2],height:box[3]};
 }
 const inset=PHOTO_LAYER_SOURCE_INSETS[kind]||[0,0,1,1];
 return {x:Math.round(inset[0]*w),y:Math.round(inset[1]*h),
  width:Math.round(inset[2]*w),height:Math.round(inset[3]*h)};
}
function photoLayerTexture(mask,photo,hex,piece,kind,gender){
 const w=TEMPLATE_SIZE.w,h=TEMPLATE_SIZE.h;
 const dest=photoLayerBounds(mask,kind,true,gender),crop=photoLayerBounds(photo,kind,false,gender);
 if(!dest||!crop)return null;
 const cfg=pieceSettings(piece);
 const isDenim=dressState.denim[piece]!=null;
 const hasPrint=cfg.type!=='solid'&&cfg.type!=='draw';
 const layer=document.createElement('canvas');layer.width=w;layer.height=h;
 const c=layer.getContext('2d');

 // Reuse the photo as a light-and-shadow source, but not as an opaque cover
 // on top of the selected print. This keeps prints visible on realistic folds.
 const photograph=document.createElement('canvas');photograph.width=w;photograph.height=h;
 const p=photograph.getContext('2d');
 p.drawImage(photo,crop.x,crop.y,crop.width,crop.height,
  dest.x,dest.y,dest.width,dest.height);

 let patterned=false;
 if(isDenim){
  patterned=denimFill(c,piece);
  if(patterned)c.fillRect(0,0,w,h);
 }
 if(!patterned&&hasPrint){
  const tile=makeFabricTile(piece),pattern=c.createPattern(tile,'repeat');
  if(pattern?.setTransform){
   const a=(Number(cfg.angle)||0)*Math.PI/180;
   pattern.setTransform(new DOMMatrix([Math.cos(a),Math.sin(a),-Math.sin(a),Math.cos(a),0,0]));
  }
  c.fillStyle=pattern||hex;c.fillRect(0,0,w,h);
  patterned=true;
 }

 if(patterned){
  // Pattern/denim stays underneath the photographic volume. A soft grayscale
  // multiply pass restores creases without suppressing printed motifs.
  const light=document.createElement('canvas');light.width=w;light.height=h;
  const lc=light.getContext('2d');
  lc.filter='grayscale(1) contrast(.85) brightness(1.45)';
  lc.drawImage(photograph,0,0);
  lc.filter='none';
  c.save();c.globalCompositeOperation='multiply';c.globalAlpha=.27;
  c.drawImage(light,0,0);
  c.restore();
 }else{
  // Unprinted photographic garment: keep the selected Wada hue and folds.
  c.drawImage(photograph,0,0);
  c.save();c.globalCompositeOperation='color';c.globalAlpha=.98;
  c.fillStyle=hex;c.fillRect(dest.x,dest.y,dest.width,dest.height);c.restore();
 }
 // Final alpha is ALWAYS the original independent, registered garment mask.
 // No readback is needed (also works with cross-origin preview hosting).
 c.globalCompositeOperation='destination-in';
 c.drawImage(mask,0,0,w,h);
 c.globalCompositeOperation='source-over';

 // Free Draw strokes are separate foreground ink, not part of the print
 // background. Clip them independently to avoid painting outside the garment.
 const strokes=dressState.strokes[piece]||[];
 if(strokes.length){
  const ink=document.createElement('canvas');ink.width=w;ink.height=h;
  const ic=ink.getContext('2d');ic.lineCap='round';ic.lineJoin='round';
  for(const stroke of strokes){
   if(!stroke.points?.length)continue;
   ic.strokeStyle=stroke.color;ic.fillStyle=stroke.color;
   ic.lineWidth=stroke.size*3.6;
   if(stroke.points.length===1){
    ic.beginPath();ic.arc(stroke.points[0][0],stroke.points[0][1],stroke.size*1.8,0,Math.PI*2);ic.fill();
   }else{
    ic.beginPath();ic.moveTo(...stroke.points[0]);
    for(const pt of stroke.points.slice(1))ic.lineTo(...pt);
    ic.stroke();
   }
  }
  ic.globalCompositeOperation='destination-in';ic.drawImage(mask,0,0,w,h);
  c.drawImage(ink,0,0);
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
  const layer=photoLayerTexture(mask,photo,hex,item.piece,item.kind,woman?'woman':'man');
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
