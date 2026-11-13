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
  return 'assets/layered/man/'+kind+'/'+hex.slice(1)+'.svg?v=46-exp10';
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

/* Registration in the common 1086×1448 coordinate system.
   The original templates had different garment edges; the neutral backdrop
   prevents those old edges from showing beside our independent vector shapes. */
const MAN_LAYER_REGISTRATION={
  shirt:{dx:3,dy:-29,sx:0.99,sy:1},
  jacket:{dx:9,dy:-17,sx:1,sy:1.005},
  shoes:{dx:0,dy:0,sx:1,sy:1},
  tie:{dx:0,dy:-35,sx:1,sy:1},
  scarf:{dx:6,dy:-12,sx:1,sy:1}
};
const manSkinImageCache=new WeakMap();
function manRegisteredPoint(kind,pt){
  const t=MAN_LAYER_REGISTRATION[kind];if(!t)return pt;
  return [543+(pt[0]-543-t.dx)/t.sx,190+(pt[1]-190-t.dy)/t.sy];
}
function manApplyRegistration(ctx,kind){
  const t=MAN_LAYER_REGISTRATION[kind];if(!t)return;
  ctx.translate(543+t.dx,190+t.dy);ctx.scale(t.sx,t.sy);ctx.translate(-543,-190);
}
function manProtectedSkin(base){
  if(manSkinImageCache.has(base.base))return manSkinImageCache.get(base.base);
  const mask=document.createElement('canvas');mask.width=TEMPLATE_SIZE.w;mask.height=TEMPLATE_SIZE.h;
  const mc=mask.getContext('2d');
  if(base.skin)mc.drawImage(base.skin,0,0,mask.width,mask.height);
  if(base.hair)mc.drawImage(base.hair,0,0,mask.width,mask.height);
  const layer=document.createElement('canvas');layer.width=mask.width;layer.height=mask.height;
  const lc=layer.getContext('2d');lc.drawImage(base.base,0,0,layer.width,layer.height);
  lc.globalCompositeOperation='destination-in';lc.drawImage(mask,0,0);
  manSkinImageCache.set(base.base,layer);return layer;
}
function manDrawCleanBody(ctx,base){
  // Do not keep any baked-in white shirt or jacket outlines underneath the
  // new independent garments: they are the source of the doubled/sfasati edges.
  // Restore the illustrated face, hair, arms, fingers and their black contours.
  ctx.fillStyle='#ffffff';
  ctx.fillRect(0,0,TEMPLATE_SIZE.w,TEMPLATE_SIZE.h);
  ctx.drawImage(manProtectedSkin(base),0,0);
  if(base.skin)editorialBodyTint(ctx,base.skin,dressState.skin,.96);
  if(base.hair)editorialBodyTint(ctx,base.hair,dressState.hair,.85);
}
function manCutShirtNeck(ctx){
  // Hollow shirt neckline: the bare neck in the underlying model remains visible.
  // evenodd excludes the center neck opening, but not the pointed collar outlines.
  ctx.beginPath();ctx.rect(0,0,TEMPLATE_SIZE.w,TEMPLATE_SIZE.h);
  ctx.moveTo(516,183);ctx.lineTo(569,183);
  ctx.lineTo(564,201);ctx.lineTo(548,225);ctx.lineTo(536,225);
  ctx.lineTo(519,204);ctx.closePath();
  ctx.clip('evenodd');
}
function manFullShoePath(){
  // Traced from the actual man-tee-trousers source illustration at 1086×1448.
  // The rear shoe is partially behind the front trouser leg; the forward shoe
  // includes its entire toe cap and sole to y=1251.
  const p=new Path2D();
  p.moveTo(471,1002);
  p.bezierCurveTo(477,1005,486,1011,495,1014);
  p.bezierCurveTo(503,1009,509,999,514,992);
  p.bezierCurveTo(522,1020,518,1054,516,1070);
  p.bezierCurveTo(514,1090,508,1116,500,1126);
  p.bezierCurveTo(486,1130,475,1125,469,1115);
  p.bezierCurveTo(459,1103,463,1078,466,1063);
  p.bezierCurveTo(468,1049,468,1015,471,1002);
  p.closePath();
  p.moveTo(528,1148);
  p.bezierCurveTo(543,1143,560,1148,564,1159);
  p.bezierCurveTo(579,1179,575,1198,578,1215);
  p.lineTo(577,1237);
  p.bezierCurveTo(574,1247,557,1251,540,1251);
  p.bezierCurveTo(520,1251,502,1247,501,1238);
  p.bezierCurveTo(500,1224,500,1209,503,1197);
  p.bezierCurveTo(504,1174,506,1157,528,1148);
  p.closePath();
  return p;
}
function manDrawFullShoes(ctx,base){
  // First draw a complete colored silhouette, then multiply the original
  // shoe illustration into it. White fabric retains its color, dark laces,
  // stitching and the curved outsole remain crisp and fully visible.
  const p=manFullShoePath();
  const cfg=pieceSettings('shoes');
  ctx.save();ctx.clip(p);
  if(denimFill(ctx,'shoes'))ctx.fillRect(0,0,TEMPLATE_SIZE.w,TEMPLATE_SIZE.h);
  else if(cfg.type!=='solid'&&cfg.type!=='draw'){
    const tile=makeFabricTile('shoes'),pattern=ctx.createPattern(tile,'repeat');
    ctx.fillStyle=pattern||dressState.shoeColor;
    ctx.fillRect(0,0,TEMPLATE_SIZE.w,TEMPLATE_SIZE.h);
  }else{
    ctx.fillStyle=dressState.shoeColor;
    ctx.fillRect(0,0,TEMPLATE_SIZE.w,TEMPLATE_SIZE.h);
  }
  // The mask is a hard boundary: a fabric pattern can never spill past the shoe.
  for(const stroke of dressState.strokes.shoes||[]){
    if(!stroke.points?.length)continue;
    ctx.strokeStyle=stroke.color;ctx.fillStyle=stroke.color;ctx.lineCap='round';
    ctx.lineJoin='round';ctx.lineWidth=stroke.size*3.6;
    if(stroke.points.length===1){
      ctx.beginPath();ctx.arc(stroke.points[0][0],stroke.points[0][1],stroke.size*1.8,0,2*Math.PI);ctx.fill();
    }else{
      ctx.beginPath();ctx.moveTo(...stroke.points[0]);
      for(const pt of stroke.points.slice(1))ctx.lineTo(...pt);
      ctx.stroke();
    }
  }
  ctx.globalCompositeOperation='multiply';
  ctx.drawImage(base.base,0,0,TEMPLATE_SIZE.w,TEMPLATE_SIZE.h);
  ctx.restore();
}

async function drawLayeredMan() {
  const nonce=++manLayerRenderNonce,look=dressState.top;
  const baseKey='man-tee-trousers';
  // The tee base contains a real round neck and no shirt collar, even under a jacket.
  const items=manLayerGarments();
  const [base,colors,details]=await Promise.all([
    loadEditorialLook(baseKey),
    Promise.all(items.map(item=>manLayerImage(item.kind,outfitColor(item.piece)))),
    Promise.all(items.map(item=>manLoadSvgImage('assets/layered/man/'+item.kind+'/details.svg?v=46-exp10')))
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
  // Keep the accepted T-shirt-only drawing untouched. All other male looks
  // use a clean, common body instead of a base carrying an old drawn outfit.
  if(dressState.top==='tee'){
    ctx.fillStyle='#ffffff';ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.drawImage(base.base,0,0,canvas.width,canvas.height);
    if(base.skin)editorialBodyTint(ctx,base.skin,dressState.skin,.96);
    if(base.hair)editorialBodyTint(ctx,base.hair,dressState.hair,.85);
  }else{
    manDrawCleanBody(ctx,base);
  }
  for(let n=0;n<items.length;n++){
    const item=items[n],mask=colors[n];
    // A short-sleeved tee stays below the jacket: clip its outer sleeves away
    // from the open blazer front without modifying or recoloring the garment file.
    const underJacket=item.piece==='top'&&hasJacket();
    ctx.save();
    if(underJacket){
      ctx.beginPath();
      ctx.moveTo(477,185);ctx.lineTo(616,185);
      ctx.lineTo(643,344);ctx.lineTo(605,552);
      ctx.lineTo(469,552);ctx.lineTo(437,344);
      ctx.closePath();ctx.clip();
    }
    manApplyRegistration(ctx,item.kind);
    if(item.kind==='shirt'){ctx.save();manCutShirtNeck(ctx);}
    ctx.drawImage(mask,0,0,canvas.width,canvas.height);
    const overlay=manLayerPatternOverlay(item.piece,mask);
    if(overlay)ctx.drawImage(overlay,0,0);
    if(item.kind==='shirt')ctx.restore();
    ctx.drawImage(details[n],0,0,canvas.width,canvas.height);
    ctx.restore();
  }
  // Hands and forearms are already tinted on the body UNDER the sleeves.
  // Never paint them again here: that used to create detached, pale hands and
  // falsely place them above the jacket or shirt cuffs.
  ctx.save();
  manApplyRegistration(ctx,'shoes');
  manDrawFullShoes(ctx,base);
  ctx.restore();
  // The original 1238px crop hid the toe/outsole; keep it only below 1280px.
  ctx.save();ctx.fillStyle='#ffffff';
  ctx.fillRect(0,1280,TEMPLATE_SIZE.w,TEMPLATE_SIZE.h-1280);
  ctx.restore();
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
    if(maskPixel(image,manRegisteredPoint(item.kind,point))===true)return item.piece;
  }
  return null;
}
