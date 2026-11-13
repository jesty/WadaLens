'use strict';
// Independent female Wada garment layers: 159 original precolored SVGs per item.
const USE_LAYERED_WOMAN_RENDER=true;
const WOMAN_LAYER_VERSION='46-exp18-hollow-shirt-neck';
const WOMAN_SNEAKER_BASE_SVG="<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"1086\" height=\"1448\" viewBox=\"0 0 1086 1448\">\n<!-- Independent complete closed sneakers, extending beneath the trouser cuffs to hide bare feet. Both fill attributes are recolored together. -->\n<path d=\"M524 1049 Q536 1042 552 1048 Q568 1054 572 1071 L576 1110 Q574 1149 574 1178 Q584 1185 589 1198 L590 1213 Q582 1229 568 1236 Q545 1240 529 1225 Q520 1217 518 1200 L522 1172 Q525 1123 520 1080 Q519 1058 524 1049 Z\" fill=\"#ffb3f0\"/>\n<path d=\"M483 1071 Q491 1062 504 1066 Q520 1066 531 1075 Q541 1089 540 1107 L535 1130 Q529 1145 514 1152 Q495 1151 480 1138 Q474 1128 476 1112 Q478 1082 483 1071 Z\" fill=\"#ffb3f0\"/>\n</svg>";
const WOMAN_SNEAKER_DETAILS_SVG="<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"1086\" height=\"1448\" viewBox=\"0 0 1086 1448\">\n<g stroke-linecap=\"round\" stroke-linejoin=\"round\" fill=\"none\">\n <path d=\"M524 1049 Q536 1042 552 1048 Q568 1054 572 1071 L576 1110 Q574 1149 574 1178 Q584 1185 589 1198 L590 1213 Q582 1229 568 1236 Q545 1240 529 1225 Q520 1217 518 1200 L522 1172 Q525 1123 520 1080 Q519 1058 524 1049 Z M483 1071 Q491 1062 504 1066 Q520 1066 531 1075 Q541 1089 540 1107 L535 1130 Q529 1145 514 1152 Q495 1151 480 1138 Q474 1128 476 1112 Q478 1082 483 1071 Z\" stroke=\"#25282d\" stroke-width=\"2.5\"/>\n <!-- Rear/top sneaker: continuous padded collar and fully closed quarter -->\n <path d=\"M523 1057 Q541 1052 567 1065 M526 1067 Q544 1063 568 1075 M523 1077 Q540 1083 567 1084\" stroke=\"#3c3b41\" stroke-width=\"2\"/>\n <path d=\"M533 1080 Q533 1125 537 1168 Q535 1180 529 1192 M558 1088 Q566 1134 562 1173\" stroke=\"#33383c\" stroke-width=\"2\"/>\n <path d=\"M537 1089 L557 1096 M537 1103 L559 1109 M537 1117 L560 1123 M539 1132 L561 1138 M540 1147 L562 1152 M540 1161 L561 1167\" stroke=\"#f5f2eb\" stroke-width=\"4\"/>\n <path d=\"M537 1089 L557 1096 M537 1103 L559 1109 M537 1117 L560 1123 M539 1132 L561 1138 M540 1147 L562 1152 M540 1161 L561 1167\" stroke=\"#30343a\" stroke-width=\".9\"/>\n <path d=\"M522 1184 Q541 1191 570 1180 M530 1210 Q548 1223 575 1212\" stroke=\"#30343a\" stroke-width=\"2\"/>\n <path d=\"M519 1207 Q527 1233 548 1239 Q570 1245 584 1227 L590 1212\" stroke=\"#f6f3e9\" stroke-width=\"6.2\"/>\n <path d=\"M519 1207 Q527 1233 548 1239 Q570 1245 584 1227 L590 1212\" stroke=\"#25282d\" stroke-width=\"1.6\"/>\n <!-- Front/side sneaker: no exposed instep, side wall, heel or opening -->\n <path d=\"M485 1077 Q501 1071 526 1083 M486 1086 Q505 1082 532 1094 M485 1090 Q482 1114 488 1125\" stroke=\"#34373b\" stroke-width=\"2\"/>\n <path d=\"M492 1092 Q498 1111 503 1132 M521 1093 Q525 1110 519 1134\" stroke=\"#37383d\" stroke-width=\"2\"/>\n <path d=\"M492 1096 L522 1101 M492 1103 L522 1109 M494 1111 L521 1117 M496 1119 L519 1125\" stroke=\"#f5f2eb\" stroke-width=\"3.8\"/>\n <path d=\"M492 1096 L522 1101 M492 1103 L522 1109 M494 1111 L521 1117 M496 1119 L519 1125\" stroke=\"#30343a\" stroke-width=\".8\"/>\n <path d=\"M477 1122 Q485 1144 505 1151 Q523 1159 536 1132\" stroke=\"#f6f3e9\" stroke-width=\"5.8\"/>\n <path d=\"M477 1122 Q485 1144 505 1151 Q523 1159 536 1132\" stroke=\"#25282d\" stroke-width=\"1.7\"/>\n</g></svg>";
function womanInlineSvgImage(svg){
 return manLoadSvgImage(URL.createObjectURL(new Blob([svg],{type:'image/svg+xml'})),true);
}

const WOMAN_LAYER_REGISTRATION={
  tee:{dx:0,dy:0,sx:1,sy:1},shirt:{dx:-7,dy:-35,sx:1,sy:1},
  jacket:{dx:-2,dy:-21,sx:1,sy:1},trousers:{dx:0,dy:0,sx:1,sy:1},
  skirt:{dx:0,dy:0,sx:1,sy:1},shoes:{dx:0,dy:0,sx:1,sy:1},
  tie:{dx:0,dy:0,sx:1,sy:1},scarf:{dx:0,dy:-19,sx:1,sy:1}
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
   if(kind==='shoes')return womanInlineSvgImage(WOMAN_SNEAKER_BASE_SVG.replaceAll('fill="#ffb3f0"','fill="'+hex+'"'));
   if(palette.some(c=>c.hex.toLowerCase()===hex))return manLoadSvgImage(womanLayerAsset(kind,hex));
   if(!womanTemplateCache.has(kind))womanTemplateCache.set(kind,
     fetch(kind==='shoes'?'assets/layered/woman/shoes/sneaker-base.svg?v='+WOMAN_LAYER_VERSION:womanLayerAsset(kind,'#ffb3f0')).then(r=>{
       if(!r.ok)throw Error('Missing female SVG '+kind);return r.text();
     }));
   const src=(await womanTemplateCache.get(kind)).replaceAll('fill="#ffb3f0"','fill="'+hex+'"');
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

function womanRepairFace(ctx,base){
 // The editorial skin aperture is incomplete around facial highlights and edges.
 // Expand its head-only alpha slightly, then tint using MULTIPLY: white gaps
 // become skin while the original nose, eyes, mouth and linework stay visible.
 if(!base.skin)return;
 const mask=document.createElement('canvas');
 mask.width=TEMPLATE_SIZE.w;mask.height=210;
 const m=mask.getContext('2d');
 m.save();m.beginPath();m.rect(0,0,TEMPLATE_SIZE.w,210);m.clip();
 for(const [dx,dy] of [[0,0],[-10,0],[10,0],[0,-10],[0,10],[-7,-7],[7,-7],[-7,7],[7,7]]){
   m.drawImage(base.skin,dx,dy,TEMPLATE_SIZE.w,TEMPLATE_SIZE.h);
 }
 m.restore();
 const color=document.createElement('canvas');color.width=TEMPLATE_SIZE.w;color.height=210;
 const c=color.getContext('2d');c.fillStyle=dressState.skin;c.fillRect(0,0,color.width,color.height);
 c.globalCompositeOperation='destination-in';c.drawImage(mask,0,0);c.globalCompositeOperation='source-over';
 ctx.save();ctx.globalCompositeOperation='multiply';
 ctx.drawImage(color,0,0);ctx.restore();
}

function womanCutShirtNeck(ctx){
 // A transparent V opening between the two female collar wings.
 // Coordinates are in the native shirt SVG space; registration is already applied.
 // An even-odd clipping path excludes the cloth over the underlying skin.
 ctx.beginPath();
 ctx.rect(0,0,TEMPLATE_SIZE.w,TEMPLATE_SIZE.h);
 ctx.moveTo(526,199);
 ctx.lineTo(562,199);
 ctx.lineTo(559,216);
 ctx.lineTo(551,255);
 ctx.lineTo(545,255);
 ctx.lineTo(530,216);
 ctx.closePath();
 ctx.clip('evenodd');
}

function womanDrawTeeWaistBridge(ctx){
 // The original T-shirt's scalloped hem leaves a white strip at the trouser waist.
 // Draw a narrow underlap before the actual shirt artwork, matching its selected
 // solid/denim/pattern fabric without affecting garment registration or hit testing.
 ctx.save();
 ctx.beginPath();
 ctx.moveTo(477,406);ctx.lineTo(605,405);
 ctx.lineTo(608,455);ctx.quadraticCurveTo(545,464,477,451);
 ctx.closePath();ctx.clip();
 const settings=pieceSettings('top');
 if(denimFill(ctx,'top'))ctx.fillRect(472,403,142,65);
 else if(settings.type==='solid'||settings.type==='draw'){
   ctx.fillStyle=outfitColor('top');ctx.fillRect(472,403,142,65);
 }else{
   const tile=makeFabricTile('top'),pat=ctx.createPattern(tile,'repeat');
   if(pat?.setTransform){
     const angle=Number(settings.angle)*Math.PI/180;
     pat.setTransform(new DOMMatrix([Math.cos(angle),Math.sin(angle),-Math.sin(angle),Math.cos(angle),0,0]));
   }
   ctx.fillStyle=pat||outfitColor('top');ctx.fillRect(472,403,142,65);
 }
 ctx.restore();
}

async function drawLayeredWoman(){
 const nonce=++womanRenderNonce,top=dressState.top,bottom=dressState.bottom;
 const baseKey=isSkirt()?'woman-tee-skirt-knee':'woman-tee-trousers';
 const items=womanLayerGarments();
 const [base,colors,details]=await Promise.all([
   loadEditorialLook(baseKey),
   Promise.all(items.map(x=>womanLayerImage(x.kind,outfitColor(x.piece)))),
   Promise.all(items.map(x=>x.kind==='shoes'?womanInlineSvgImage(WOMAN_SNEAKER_DETAILS_SVG):manLoadSvgImage(
     'assets/layered/woman/'+x.kind+'/details.svg?v='+WOMAN_LAYER_VERSION)))
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
 // The skin/hair aperture masks omit tiny face pixels. Restore the original
 // complete illustrated head BEFORE tinting it, so white mask holes disappear.
 // Stop above the garments: no baked-in shirt or jacket is reintroduced.
 ctx.drawImage(base.base,0,0,TEMPLATE_SIZE.w,193,0,0,TEMPLATE_SIZE.w,193);
 womanRepairFace(ctx,base);
 if(base.skin)editorialBodyTint(ctx,base.skin,dressState.skin,.96);
 if(base.hair)editorialBodyTint(ctx,base.hair,dressState.hair,.85);
 for(let i=0;i<items.length;i++){
   const item=items[i],mask=colors[i];ctx.save();womanApplyRegistration(ctx,item.kind);
   if(item.kind==='tee')womanDrawTeeWaistBridge(ctx);
   if(item.kind==='shirt')womanCutShirtNeck(ctx);
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
