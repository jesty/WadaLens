'use strict';
// Independent female Wada garment layers: 159 original precolored SVGs per item.
const USE_LAYERED_WOMAN_RENDER=true;
const WOMAN_LAYER_VERSION='46-exp19-polished-sneakers';
const WOMAN_SNEAKER_BASE_SVG="<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"1086\" height=\"1448\" viewBox=\"0 0 1086 1448\">\n<!-- Polished low-top sneakers matching the approved preview. Both shoes share one replaceable Wada fill. -->\n<path d=\"M481 1063 C488 1054 502 1053 513 1059 C527 1062 535 1075 536 1088 L538 1110 C539 1126 531 1140 519 1150 C508 1160 490 1155 478 1143 C469 1133 472 1118 474 1102 L476 1081 C477 1073 479 1067 481 1063 Z\" fill=\"#ffb3f0\"/>\n<path d=\"M526 1047 C535 1039 549 1039 560 1046 C569 1053 576 1066 578 1084 L577 1141 L581 1176 C590 1185 595 1204 593 1219 C592 1235 576 1246 556 1248 C537 1249 522 1241 516 1228 C512 1218 514 1203 517 1188 L521 1145 L520 1082 C518 1066 520 1055 526 1047 Z\" fill=\"#ffb3f0\"/>\n</svg>";
const WOMAN_SNEAKER_DETAILS_SVG="<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"1086\" height=\"1448\" viewBox=\"0 0 1086 1448\">\n<!-- Cleaner round-toe, full-coverage sneakers: rear shoe first, front shoe above. -->\n<g fill=\"none\" stroke=\"#272527\" stroke-linejoin=\"round\" stroke-linecap=\"round\">\n<!-- Rear outsole: subtle cream rubber, crisp outline -->\n<path d=\"M474 1127 Q484 1151 503 1156 Q522 1161 535 1134\" stroke=\"#faf6ed\" stroke-width=\"8\"/>\n<path d=\"M474 1127 Q484 1151 503 1156 Q522 1161 535 1134\" stroke-width=\"2.2\"/>\n<!-- Rear rounded toe panel and quarter -->\n<path d=\"M478 1104 Q476 1131 495 1140 Q509 1147 523 1134 M480 1081 Q476 1102 484 1115 M530 1085 Q536 1106 529 1118\" stroke-width=\"1.9\"/>\n<path d=\"M485 1071 Q489 1059 504 1063 Q520 1068 527 1081 Q528 1090 523 1097 M485 1082 Q500 1074 524 1090\" stroke-width=\"2.5\"/>\n<!-- Rear lace channel and tongue -->\n<path d=\"M490 1088 Q497 1104 496 1121 M515 1090 Q519 1106 514 1123\" stroke-width=\"2\"/>\n<path d=\"M491 1091 L515 1096 M490 1099 L515 1104 M491 1107 L514 1112 M493 1115 L513 1120\" stroke=\"#f8f2e9\" stroke-width=\"4\"/>\n<path d=\"M491 1091 L515 1096 M490 1099 L515 1104 M491 1107 L514 1112 M493 1115 L513 1120\" stroke-width=\".9\"/>\n<!-- Front clean toe/sole: cream rim under toe -->\n<path d=\"M516 1213 Q517 1241 542 1248 Q565 1253 582 1238 Q593 1230 593 1212\" stroke=\"#faf6ed\" stroke-width=\"9\"/>\n<path d=\"M516 1213 Q517 1241 542 1248 Q565 1253 582 1238 Q593 1230 593 1212\" stroke-width=\"2.2\"/>\n<!-- Front continuous upper, side panels and rounded toe cap -->\n<path d=\"M526 1047 C535 1039 549 1039 560 1046 C569 1053 576 1066 578 1084 L577 1141 L581 1176 C590 1185 595 1204 593 1219 C592 1235 576 1246 556 1248 C537 1249 522 1241 516 1228 C512 1218 514 1203 517 1188 L521 1145 L520 1082 C518 1066 520 1055 526 1047 Z\" stroke-width=\"2.4\"/>\n<path d=\"M524 1090 Q521 1140 523 1180 C522 1192 519 1200 517 1211 M572 1097 Q576 1138 574 1182 C581 1194 587 1206 591 1214\" stroke-width=\"1.9\"/>\n<path d=\"M520 1206 C532 1190 541 1183 548 1181 C559 1188 580 1195 589 1214\" stroke-width=\"2.1\"/>\n<path d=\"M530 1217 Q555 1234 582 1219\" stroke-width=\"1.6\" opacity=\".6\"/>\n<!-- Padded collar, clear tongue and shoe opening -->\n<path d=\"M528 1054 Q539 1044 555 1050 Q567 1055 572 1074 M533 1062 Q542 1057 554 1061 Q564 1064 567 1076\" stroke-width=\"2.5\"/>\n<path d=\"M535 1072 Q536 1112 536 1167 M561 1074 Q567 1114 563 1168\" stroke-width=\"1.7\"/>\n<!-- Front laces: spaced across the instep like the men's sneaker -->\n<path d=\"M537 1082 L559 1087 M537 1095 L560 1100 M538 1108 L561 1113 M538 1121 L562 1126 M539 1134 L562 1139 M539 1147 L561 1152 M540 1160 L561 1165\" stroke=\"#f8f2e9\" stroke-width=\"4\"/>\n<path d=\"M537 1082 L559 1087 M537 1095 L560 1100 M538 1108 L561 1113 M538 1121 L562 1126 M539 1134 L562 1139 M539 1147 L561 1152 M540 1160 L561 1165\" stroke-width=\".9\"/>\n</g>\n</svg>"
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
 editorialFaceInk(ctx,base);
 if(base.hair)editorialHairTint(ctx,base.hair,base.skin,dressState.hair);
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
