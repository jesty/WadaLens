'use strict';
// Offline fallback for the 159 original hexadecimal colors.
const SOURCE=`Hermosa Pink|#ffb3f0
Corinthian Pink|#ffa6d9
Cameo Pink|#e6adcf
Fawn|#d1b0b3
Light Brown Drab|#b08699
Coral Red|#ff7399
Fresh Color|#ff788c
Grenadine Pink|#ff616b
Eosine Pink|#ff5ec4
Spinel Red|#ff4dc9
Old Rose|#d94d99
Eugenia Red A|#ed3d66
Eugenia Red B|#e62e73
Raw Sienna|#b85e00
Vinaceous Tawny|#c74300
Jasper Red|#fa2b00
Spectrum Red|#f20000
Red Orange|#e81900
Etruscan Red|#c9303e
Burnt Sienna|#a93400
Ochre Red|#a7374b
Scarlet|#d50c42
Carmine|#d60036
Indian Lake|#cc1a97
Rosolanc Purple|#b319ab
Pomegranite Purple|#b90078
Hydrangea Red|#9e194d
Brick Red|#a32100
Carmine Red|#a10b2b
Pompeian Red|#a90636
Red|#a10045
Brown|#6c2b11
Hay's Russet|#681916
Vandyke Red|#740909
Pansy Purple|#6f0043
Pale Burnt Lake|#730f1f
Violet Red|#3d0079
Vistoris Lake|#5c2c45
Sulpher Yellow|#f5f5b8
Pale Lemon Yellow|#fff59e
Naples Yellow|#faed8f
Ivory Buff|#ebd999
Seashell Pink|#ffcfc4
Light Pinkish Cinnamon|#ffbf99
Pinkish Cinnamon|#f2ad78
Cinnamon Buff|#ffbf6e
Cream Yellow|#ffb852
Golden Yellow|#fa9442
Vinaceous Cinnamon|#f59994
Ochraceous Salmon|#d99e73
Isabella Color|#c3a55c
Maple|#c2975a
Olive Buff|#bcd382
Ecru|#c0b490
Yellow|#ffff00
Lemon Yellow|#f2ff26
Apricot Yellow|#ffe600
Pyrite Yellow|#c4bf33
Olive Ocher|#d1bd19
Yellow Ocher|#e0b81f
Orange Yellow|#ffab00
Yellow Orange|#ff8c00
Apricot Orange|#ff7340
Orange|#ff5200
Peach Red|#ff3319
English Red|#de4500
Cinnamon Rufous|#c2612c
Orange Rufous|#c05200
Sulphine Yellow|#baa600
Khaki|#b68400
Citron Yellow|#a6d40d
Citrine|#a3ad00
Buffy Citrine|#888d2a
Dark Citrine|#7e8743
Light Grayish Olive|#76844e
Krongbergs Green|#759243
Olive|#718600
Orange Citrine|#8c6510
Sudan Brown|#9b5348
Olive Green|#58771e
Light Brownish Olive|#706934
Deep Grayish Olive|#505423
Pale Raw Umber|#5e4017
Sepia|#503d00
Madder Brown|#651300
Mars Brown Tobacco|#522000
Vandyke Brown|#362304
Turquoise Green|#b5ffc2
Glaucous Green|#b3e8c2
Dark Greenish Glaucous|#b3d9a3
Yellow Green|#a6ff47
Light Green Yellow|#bdf226
Night Green|#7aff00
Olive Yellow|#99b333
Artemesia Green|#65a98f
Andover Green|#5c8a73
Rainette Green|#85b857
Chromium Green|#66ab56
Pistachio Green|#56aa69
Sea Green|#33ff7d
Benzol Green|#00d973
Light Porcelain Green|#23c17c
Green|#40c945
Dull Viridian Green|#19cc33
Oil Green|#6ea900
Diamine Green|#1b8e13
Cossack Green|#328e13
Lincoln Green|#405416
Blackish Olive|#324e2a
Deep Slate Olive|#172713
Nile Blue|#bfffe6
Pale King's Blue|#abf5ed
Light Glaucous Blue|#a6e6db
Salvia Blue|#96bfe6
Cobalt Green|#94ff94
Calamine Blue|#80ffcc
Venice Green|#6bffb3
Cerulian Blue|#29bdad
Peacock Blue|#00cf91
Green Blue|#2dbc94
Olympic Blue|#4f8fe6
Blue|#0d75ff
Antwarp Blue|#008aa1
Helvetia Blue|#0057ba
Dark Medici Blue|#417777
Dusky Green|#00592e
Deep Lyons Blue|#0024cc
Violet Blue|#202d85
Vandar Poel's Blue|#003e83
Dark Tyrian Blue|#0d2b52
Dull Violet Black|#06004f
Deep Indigo|#000831
Deep Slate Green|#0f261f
Grayish Lavender A|#b8b8ff
Grayish Lavender B|#bfabcc
Laelia Pink|#cc85d1
Lilac|#b875eb
Eupatorium Purple|#bf36e0
Light Mauve|#9161f2
Aconite Violet|#9c52f2
Dull Blue Violet|#6e66d4
Dark Soft Violet|#4d52de
Blue Violet|#4733ff
Purple Drab|#754260
Deep Violet / Plumbeous|#5c7287
Veronia Purple|#7e3075
Dark Slate Purple|#53225c
Taupe Brown|#6b2e63
Violet Carmine|#531745
Violet|#2619d1
Red Violet|#3400a3
Cotinga Purple|#340059
Dusky Madder Violet|#2d0060
White|#ffffff
Neutral Gray|#b5d1cc
Mineral Gray|#9fc2b2
Warm Gray|#9cb29e
Slate Color|#1b3644
Black|#000000`;
let palette=SOURCE.trim().split('\n').map(line=>{const [name,hex]=line.split('|');return {name,hex:hex.toLowerCase(),lab:hexToLab(hex)}});
const canvas=document.getElementById('canvas'),ctx=canvas.getContext('2d',{willReadFrequently:true});const photo=document.getElementById('photo'),target=document.getElementById('target');
let hasImage=false,mode='dominante',point=null,selected=null,selectingGray=false,grayPoint=null,grayGains=null,lastRgb=null;
function rgbToLab(rgb){let [r,g,b]=rgb.map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4});let x=(r*.4124564+g*.3575761+b*.1804375)/.95047,y=(r*.2126729+g*.7151522+b*.0721750),z=(r*.0193339+g*.1191920+b*.9503041)/1.08883;let f=t=>t>.008856?Math.cbrt(t):(7.787037*t+16/116);return [116*f(y)-16,500*(f(x)-f(y)),200*(f(y)-f(z))]}
function hexToRgb(h){return [1,3,5].map(i=>parseInt(h.slice(i,i+2),16))}function hexToLab(h){return rgbToLab(hexToRgb(h))}function rgbToHex(rgb){return '#'+rgb.map(v=>Math.round(Math.max(0,Math.min(255,v))).toString(16).padStart(2,'0')).join('')}
function dist(a,b){return Math.hypot(a[0]-b[0],a[1]-b[1],a[2]-b[2])}
let historicalCombinations=new Map(),combinationDataReady=false,combinationLoadError=false;
let secondColors=[],secondCombinations=new Map(),currentVolume='1';
function getActivePalette(){return currentVolume==='1'?palette:currentVolume==='2'?secondColors:palette.concat(secondColors)}
function volumeForColor(c){return c.volume===2?2:1}
function loadVolume2(data){
 let sourceColors=[],groups=new Map();
 if(Array.isArray(data))data={colors:data};
 if(Array.isArray(data.colors)){
  sourceColors=data.colors.filter(c=>c&&typeof c.name==='string'&&/^#[0-9a-f]{6}$/i.test(c.hex||'')).map(c=>({name:c.name,hex:c.hex.toLowerCase(),lab:hexToLab(c.hex),volume:2,combinations:Array.isArray(c.combinations)?c.combinations.filter(Number.isInteger):[]}));
  sourceColors.forEach(c=>c.combinations.forEach(id=>{if(!groups.has(id))groups.set(id,[]);groups.get(id).push(c)}));
 }
 if(Array.isArray(data.palettes)){
  data.palettes.forEach(p=>{if(!p||!(typeof p.id==='number'||typeof p.id==='string')||!Array.isArray(p.colors))return;const colors=p.colors.filter(c=>c&&typeof c.name==='string'&&/^#[0-9a-f]{6}$/i.test(c.hex||'')).map(c=>({name:c.name,hex:c.hex.toLowerCase(),lab:hexToLab(c.hex),volume:2}));if(colors.length>=2){groups.set(p.id,colors);colors.forEach(c=>{let found=sourceColors.find(x=>x.name===c.name&&x.hex===c.hex);if(!found){found={...c,combinations:[]};sourceColors.push(found)}if(!found.combinations.includes(p.id))found.combinations.push(p.id)})}})
 }
 groups=new Map([...groups].filter(([,colors])=>colors.length>=2));
 if(!sourceColors.length||!groups.size)throw Error('No usable colors and combinations in this JSON.');
 secondColors=sourceColors;secondCombinations=groups;
 /* Volume 2 import controls intentionally hidden. */
 try{localStorage.setItem('wadaLensVolume2',JSON.stringify(data))}catch(e){}
 if(lastRgb)render(lastRgb)
}

function installHistoricalColors(records){
 if(!Array.isArray(records))return false;
 let valid=records.filter(c=>c && typeof c.name==='string' && /^#[0-9a-f]{6}$/i.test(c.hex||'') && Array.isArray(c.combinations));
 if(valid.length<150)return false;
 const byName=new Map(valid.map(c=>[c.name.toLowerCase(),c]));
 // Keep the original color HEX values whenever available.
 palette=palette.map(c=>{let matched=byName.get(c.name.toLowerCase());return {...c,combinations:matched?matched.combinations:[]}});
 const groups=new Map();
 palette.forEach(c=>c.combinations.forEach(id=>{if(!Number.isInteger(id)||id<1||id>348)return;if(!groups.has(id))groups.set(id,[]);groups.get(id).push(c)}));
 historicalCombinations=new Map([...groups.entries()].filter(([,colors])=>colors.length>=2&&colors.length<=4).sort((a,b)=>a[0]-b[0]));
 combinationDataReady=historicalCombinations.size>300;
 if(selected)renderCombinations();
 return combinationDataReady;
}
async function loadOriginal(){
 try{let saved=localStorage.getItem('wadaLensHistoricalCombinationsV1');if(saved)installHistoricalColors(JSON.parse(saved))}catch(e){}
 const sources=['https://sanzo-wada.dmbk.io/assets/colors.json','https://raw.githubusercontent.com/mattdesl/dictionary-of-colour-combinations/master/colors.json'];
 for(const url of sources){
  try{
   const response=await fetch(url,{mode:'cors'});if(!response.ok)throw new Error('HTTP '+response.status);
   const json=await response.json();const records=Array.isArray(json)?json:Array.isArray(json.colors)?json.colors:null;
   if(!records)throw new Error('Unexpected JSON format');
   // The original source determines the swatch RGB/HEX values, even when metadata is absent.
   if(url===sources[0]){let p=records.filter(c=>c.hex&&c.name).map(c=>({name:c.name,hex:c.hex.toLowerCase(),lab:hexToLab(c.hex),combinations:Array.isArray(c.combinations)?c.combinations:[]}));if(p.length>=150)palette=p}
   if(installHistoricalColors(records)){try{localStorage.setItem('wadaLensHistoricalCombinationsV1',JSON.stringify(records.map(c=>({name:c.name,hex:c.hex,combinations:c.combinations}))))}catch(e){}break}
  }catch(e){console.info('Color dataset unavailable:',url,e.message)}
 }
 combinationLoadError=!combinationDataReady;
 if(hasImage)analyse()
 else renderCombinations();
}loadOriginal();
function resizeImage(img){let limit=900,scale=Math.min(1,limit/Math.max(img.width,img.height));canvas.width=Math.max(1,Math.round(img.width*scale));canvas.height=Math.max(1,Math.round(img.height*scale));ctx.drawImage(img,0,0,canvas.width,canvas.height);hasImage=true;mode='dominante';point=null;selectingGray=false;grayPoint=null;grayGains=null;document.getElementById('grayTarget').classList.remove('visible');photo.classList.remove('pick-gray');document.getElementById('grayBtn').textContent='◉ Select gray card';document.getElementById('grayReset').disabled=true;document.getElementById('grayStatus').textContent='Photo loaded. Tap “Select gray card”, then tap the center of the gray card in the photo.';target.classList.remove('visible');photo.classList.add('has-photo');analyse()}
function takeFile(file){if(!file)return;if(!file.type.startsWith('image/')){alert('Please select an image file.');return}let url=URL.createObjectURL(file),img=new Image();img.onload=()=>{resizeImage(img);URL.revokeObjectURL(url)};img.onerror=()=>{alert('Unable to open this photo. Try JPEG or PNG.');URL.revokeObjectURL(url)};img.src=url}
function samplePatch(pixels,x,y,radius){let vals=[[],[],[]],w=canvas.width,h=canvas.height,cx=Math.round(x*w),cy=Math.round(y*h);for(let iy=Math.max(0,cy-radius);iy<Math.min(h,cy+radius);iy+=2)for(let ix=Math.max(0,cx-radius);ix<Math.min(w,cx+radius);ix+=2){if((ix-cx)**2+(iy-cy)**2>radius*radius)continue;let n=(iy*w+ix)*4;if(pixels[n+3]<220)continue;for(let c=0;c<3;c++)vals[c].push(pixels[n+c])}return vals.map(a=>{a.sort((a,b)=>a-b);let start=Math.floor(a.length*.15),end=Math.ceil(a.length*.85),slice=a.slice(start,end);return slice.reduce((s,v)=>s+v,0)/Math.max(1,slice.length)})}
function computeGrayCalibration(){if(!grayPoint)return;let raw=ctx.getImageData(0,0,canvas.width,canvas.height).data;let radius=Math.max(5,Math.round(Math.min(canvas.width,canvas.height)*.035));let ref=samplePatch(raw,grayPoint.x,grayPoint.y,radius);let min=Math.min(...ref),max=Math.max(...ref);if(min<15||max>247){document.getElementById('grayStatus').textContent='The card appears too dark, overexposed or shadowed. Try another photo or select a different area.';grayGains=null;return}let luma=ref.reduce((a,b)=>a+b,0)/3;grayGains=ref.map(c=>Math.max(.55,Math.min(1.8,luma/Math.max(1,c))));document.getElementById('grayStatus').textContent='Calibration active. Gray-card sample: RGB '+ref.map(Math.round).join(' / ')+'. Now tap a uniform area of fabric.';document.getElementById('grayReset').disabled=false;document.getElementById('correction').checked=false}
function correctPixels(pixels){if(grayGains){const out=new Uint8ClampedArray(pixels);for(let i=0;i<out.length;i+=4)for(let c=0;c<3;c++)out[i+c]=Math.min(255,out[i+c]*grayGains[c]);return out}if(!document.getElementById('correction').checked)return pixels;const sums=[0,0,0];let n=0;for(let i=0;i<pixels.length;i+=4){for(let c=0;c<3;c++)sums[c]+=pixels[i+c];n++}const av=sums.map(v=>v/n),gray=av.reduce((a,b)=>a+b,0)/3,scale=av.map(v=>Math.min(1.45,Math.max(.7,gray/Math.max(1,v))));const out=new Uint8ClampedArray(pixels);for(let i=0;i<out.length;i+=4)for(let c=0;c<3;c++)out[i+c]=Math.min(255,out[i+c]*scale[c]);return out}
function analyse(){if(!hasImage)return;let raw=ctx.getImageData(0,0,canvas.width,canvas.height),px=correctPixels(raw.data);let rgb;if(mode==='zona'&&point){let x=Math.round(point.x*canvas.width),y=Math.round(point.y*canvas.height),radius=Math.max(5,Math.round(Math.min(canvas.width,canvas.height)*.045));rgb=samplePatch(px,point.x,point.y,radius);}else{ // k-means in Lab: largest perceptual cluster among non-extreme pixels
let samples=[];let stride=Math.max(2,Math.ceil(Math.sqrt(canvas.width*canvas.height/10000)));for(let y=0;y<canvas.height;y+=stride)for(let x=0;x<canvas.width;x+=stride){let i=(y*canvas.width+x)*4;if(px[i+3]<180)continue;let color=[px[i],px[i+1],px[i+2]],lab=rgbToLab(color);if(lab[0]<5||lab[0]>97)continue;samples.push({rgb:color,lab})}if(!samples.length){rgb=[px[0],px[1],px[2]]}else{let k=Math.min(6,samples.length),centers=[samples[0].lab];for(let c=1;c<k;c++){let best=samples[0],max=-1;for(let s of samples){let d=Math.min(...centers.map(v=>dist(v,s.lab)));if(d>max){max=d;best=s}}centers.push(best.lab.slice())}let groups=[];for(let iteration=0;iteration<9;iteration++){groups=Array.from({length:k},()=>({n:0,lab:[0,0,0],rgb:[0,0,0]}));for(let s of samples){let ci=0,md=Infinity;for(let j=0;j<k;j++){let d=dist(s.lab,centers[j]);if(d<md){md=d;ci=j}}let g=groups[ci];g.n++;for(let c=0;c<3;c++){g.lab[c]+=s.lab[c];g.rgb[c]+=s.rgb[c]}}centers=groups.map((g,i)=>g.n?g.lab.map(v=>v/g.n):centers[i])}groups.sort((a,b)=>b.n-a.n);rgb=groups[0].rgb.map(v=>v/groups[0].n)}}render(rgb)}
function render(rgb){lastRgb=rgb.slice();const hex=rgbToHex(rgb),lab=rgbToLab(rgb),ranks=getActivePalette().map(c=>({...c,d:dist(c.lab,lab)})).sort((a,b)=>a.d-b.d),top=ranks[0];if(!top){document.getElementById('status').textContent='No colors loaded in this volume. Import Volume 2 JSON or switch back to Volume 1.';return}if(!selected||selected.name!==top.name)comboPage=0;selected=top;if(dressComboId!==null && (!(volumeForColor(top)===2?secondCombinations:historicalCombinations).has(dressComboId)||!(volumeForColor(top)===2?secondCombinations:historicalCombinations).get(dressComboId).some(c=>c.name===top.name))){document.getElementById('dressSection').classList.remove('visible');dressComboId=null}document.getElementById('results').classList.add('show');document.getElementById('analysisLabel').textContent=mode==='wada'?'Wada color selected':mode==='zona'?'Selected area':'Dominant color';document.getElementById('photoSwatch').style.background=hex;document.getElementById('wadaSwatch').style.background=top.hex;document.getElementById('photoName').textContent=mode==='wada'?'Selected Wada color':mode==='zona'?'Sampled area':'Dominant shade';document.getElementById('wadaName').textContent=top.name;document.getElementById('photoHex').textContent=hex.toUpperCase();document.getElementById('wadaHex').textContent=top.hex.toUpperCase();let wrap=document.getElementById('matches');wrap.replaceChildren();ranks.slice(1,5).forEach(item=>{let el=document.createElement('div');el.className='match';let chip=document.createElement('div');chip.className='chip';chip.style.background=item.hex;let mid=document.createElement('div'),name=document.createElement('strong'),sub=document.createElement('small'),d=document.createElement('span');name.textContent=item.name;sub.textContent=item.hex.toUpperCase();d.className='dist';d.textContent='ΔE '+item.d.toFixed(1);mid.append(name,sub);el.append(chip,mid,d);wrap.append(el)});document.getElementById('status').textContent='Closest match: ΔE '+top.d.toFixed(1)+' · '+getActivePalette().length+' colors compared.';renderCombinations()}
let comboPage=0;const COMBO_PAGE_SIZE=8;
function renderCombinations(){
 const grid=document.getElementById('combinationGrid'),note=document.getElementById('combinationNote'),count=document.getElementById('combinationCount'),more=document.getElementById('combinationMore');
 if(!grid)return;grid.replaceChildren();more.hidden=true;
 if(!selected){count.textContent='—';note.textContent='Choose a fabric color to see its historical palettes.';return}
 if(volumeForColor(selected)===1&&!combinationDataReady){count.textContent='Unavailable';note.textContent=combinationLoadError?'Could not load Wada’s historical combination data. Connect to the internet and reload; colors can still be matched offline.':'Loading the 348 original Wada combinations…';return}
 const size=document.getElementById('combinationSize').value;
 const ids=selected.combinations||[];
 const combMap=volumeForColor(selected)===2?secondCombinations:historicalCombinations;
 const palettes=ids.map(id=>({id,colors:combMap.get(id)})).filter(p=>p.colors && (size==='all'||p.colors.length===Number(size)));
 count.textContent=palettes.length+' palette'+(palettes.length===1?'':'s');
 document.getElementById('combinationIntro').textContent='Wada combinations (Vol. '+volumeForColor(selected)+') featuring '+selected.name+' ('+selected.hex.toUpperCase()+').';
 note.textContent=palettes.length?volumeForColor(selected)===2?'Palettes from imported Volume 2 dataset; verify the source. Colors are screen approximations.':'Historical Volume 1 combinations; screen colors are approximations.':'No historical combinations of this size include the selected shade.';
 palettes.slice(0,(comboPage+1)*COMBO_PAGE_SIZE).forEach(({id,colors})=>{
  const card=document.createElement('article');card.className='combination-card';
  const title=document.createElement('div');title.className='combination-title';title.textContent='Vol. '+volumeForColor(selected)+' · Combination #'+id+' · '+colors.length+' colors';
  const stripe=document.createElement('div');stripe.className='combination-stripe';stripe.setAttribute('aria-hidden','true');
  const rows=document.createElement('div');rows.className='combination-colors';
  colors.forEach(c=>{
   const bar=document.createElement('span');bar.style.backgroundColor=c.hex;stripe.append(bar);
   const item=document.createElement('div');item.className='combination-color'+(c.name===selected.name?' current':'');
   const chip=document.createElement('span');chip.className='chip';chip.style.backgroundColor=c.hex;
   const desc=document.createElement('div'),name=document.createElement('span'),hex=document.createElement('small');name.textContent=c.name;hex.textContent=c.hex.toUpperCase();desc.append(name,hex);item.append(chip,desc);rows.append(item)
  });const action=document.createElement('button');action.type='button';action.className='dress-main-button';action.textContent='Dress Me · Try this palette';action.setAttribute('aria-label','Dress Me with Wada combination '+id);action.onclick=()=>openDressMe(id,colors);card.append(title,stripe,rows);card.append(action);grid.append(card)
 });
 more.hidden=palettes.length<=(comboPage+1)*COMBO_PAGE_SIZE;
}
document.getElementById('combinationSize').addEventListener('change',()=>{comboPage=0;renderCombinations()});
document.getElementById('combinationMore').addEventListener('click',()=>{comboPage++;renderCombinations()});
document.getElementById('cameraBtn').onclick=()=>document.getElementById('camera').click();document.getElementById('uploadBtn').onclick=()=>document.getElementById('upload').click();['camera','upload'].forEach(id=>document.getElementById(id).addEventListener('change',e=>{takeFile(e.target.files[0]);e.target.value=''}));photo.addEventListener('click',e=>{if(!hasImage)return;let box=canvas.getBoundingClientRect(),x=(e.clientX-box.left)/box.width,y=(e.clientY-box.top)/box.height;if(x<0||x>1||y<0||y>1)return; // canvas rendered with object-fit contain: account for letterboxing
let ratio=Math.min(box.width/canvas.width,box.height/canvas.height),w=canvas.width*ratio,h=canvas.height*ratio,ox=(box.width-w)/2,oy=(box.height-h)/2;let px=(e.clientX-box.left-ox)/w,py=(e.clientY-box.top-oy)/h;if(px<0||px>1||py<0||py>1)return;if(selectingGray){grayPoint={x:px,y:py};selectingGray=false;photo.classList.remove('pick-gray');document.getElementById('grayBtn').textContent='◉ Recalibrate gray card';let gt=document.getElementById('grayTarget');gt.style.left=(e.clientX-photo.getBoundingClientRect().left)+'px';gt.style.top=(e.clientY-photo.getBoundingClientRect().top)+'px';gt.classList.add('visible');computeGrayCalibration();analyse();return}point={x:px,y:py};mode='zona';target.style.left=(e.clientX-photo.getBoundingClientRect().left)+'px';target.style.top=(e.clientY-photo.getBoundingClientRect().top)+'px';target.classList.add('visible');analyse()});document.getElementById('correction').onchange=analyse;document.getElementById('copyBtn').onclick=async()=>{if(!selected)return;let value=selected.name+' '+selected.hex.toUpperCase();try{await navigator.clipboard.writeText(value);document.getElementById('copyBtn').textContent='✓ Copied';setTimeout(()=>document.getElementById('copyBtn').textContent='Copy Wada color',1500)}catch{prompt('Copy color:',value)}};if('serviceWorker'in navigator&&location.protocol==='https:')navigator.serviceWorker.register('./sw.js?v=30.0').catch(()=>{});

// First-run guide stored locally; can be reopened with Help.
const overlay=document.getElementById('guideOverlay'),helpBtn=document.getElementById('helpBtn'),guideClose=document.getElementById('guideClose');
function showGuide(){overlay.classList.remove('hidden');guideClose.focus()}
function hideGuide(){overlay.classList.add('hidden');try{localStorage.setItem('wadaLensFabricGuideV1','seen')}catch(e){}helpBtn.focus()}
helpBtn.addEventListener('click',showGuide);guideClose.addEventListener('click',hideGuide);overlay.addEventListener('click',e=>{if(e.target===overlay)hideGuide()});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!overlay.classList.contains('hidden'))hideGuide()});
try{if(localStorage.getItem('wadaLensFabricGuideV1')!=='seen')showGuide()}catch(e){showGuide()}
document.getElementById('grayBtn').addEventListener('click',()=>{if(!hasImage){document.getElementById('grayStatus').textContent='First take or upload a photo showing both the fabric and the gray card.';return}selectingGray=true;photo.classList.add('pick-gray');document.getElementById('grayStatus').textContent='Tap the CENTER of the gray card in the photo. Avoid edges, shadows and reflections.'});
document.getElementById('grayReset').addEventListener('click',()=>{grayPoint=null;grayGains=null;selectingGray=false;photo.classList.remove('pick-gray');document.getElementById('grayTarget').classList.remove('visible');document.getElementById('grayBtn').textContent='◉ Select gray card';document.getElementById('grayReset').disabled=true;document.getElementById('grayStatus').textContent='Calibration removed. You can select the gray card again.';analyse()});
document.getElementById('correction').addEventListener('change',()=>{if(grayGains&&document.getElementById('correction').checked){grayGains=null;grayPoint=null;document.getElementById('grayTarget').classList.remove('visible');document.getElementById('grayReset').disabled=true;document.getElementById('grayStatus').textContent='Gray-world correction enabled: gray-card calibration has been disabled.';analyse()}});


// Dress Me: editorial raster templates and modular garment masks, with Wada colors and patterns.
let dressComboId=null,dressColors=[];
const SHOE_STYLE_FIXED='sneakers';
const dressState={gender:'man',top:'tee',bottom:'trousers',colors:{top:0,jacket:1,bottom:1,tights:0,neck:0},skin:'#d6a27a',hair:'#4a3426',shoeStyle:SHOE_STYLE_FIXED,shoeColor:'#ffffff',tightsColor:null,showTights:false,neck:'none',patterns:{},strokes:{}};
const dressTops={
 man:[['tee','T-shirt'],['tee-jacket','T-shirt + jacket'],['shirt','Shirt'],['shirt-jacket','Shirt + jacket']],
 woman:[['tee','T-shirt'],['tee-jacket','T-shirt + jacket'],['shirt','Shirt'],['shirt-jacket','Shirt + jacket']]
};
const dressBottoms={
 man:[['trousers','Trousers']],
 woman:[['trousers','Trousers'],['skirt-knee','Knee-length skirt']]
};
const SHOE_COLORS=[{name:'White',hex:'#ffffff'},{name:'Black',hex:'#181818'},{name:'Leather',hex:'#98613c'},{name:'Beige',hex:'#d8c3a2'}];
const HAIR_COLORS=[{name:'Black',hex:'#171412'},{name:'Dark brown',hex:'#4a3426'},{name:'Medium brown',hex:'#72513c'},{name:'Light brown',hex:'#9a7452'},{name:'Dark blonde',hex:'#aa8b54'},{name:'Blonde',hex:'#d7b56d'},{name:'Auburn',hex:'#914b2d'},{name:'Silver',hex:'#c9c5bf'}];
const TIGHTS_EXTRAS=[{name:'White',hex:'#ffffff'},{name:'Black',hex:'#181818'}];
function isSkirt(){return dressState.bottom.startsWith('skirt-')}
function hasJacket(){return dressState.top.endsWith('jacket')}
function dressPieces(){return ['top',...(hasJacket()?['jacket']:[]),'bottom',...(dressState.gender==='woman'&&isSkirt()?['tights']:[]),...(dressState.neck!=='none'?['neck']:[])]}
function dressColor(piece){const item=dressColors[dressState.colors[piece]%dressColors.length];return item?item.hex:'#999999'}
function pieceSettings(piece){return dressState.patterns[piece]||(dressState.patterns[piece]={type:'solid',size:10,angle:0,dotSize:10,accent:Math.min(1,dressColors.length-1),brush:8})}
function makePattern(defs,piece){const setting=pieceSettings(piece);if(setting.type==='solid'||setting.type==='draw')return dressColor(piece);const base=dressColor(piece),accent=dressColors[setting.accent%dressColors.length]?.hex||base;const size=Math.max(3,setting.size),pattern=svgElt('pattern',{id:'fabric-'+piece,patternUnits:'userSpaceOnUse',width:setting.type==='dots'?Math.max(12,setting.dotSize*2.8):size*2,height:setting.type==='dots'?Math.max(12,setting.dotSize*2.8):size*2,patternTransform:'rotate('+setting.angle+')'});if(setting.type==='stripes'){pattern.append(svgElt('rect',{width:size*2,height:size*2,fill:base}),svgElt('rect',{width:size,height:size*2,fill:accent}))}else if(setting.type==='checks'){pattern.append(svgElt('rect',{width:size*2,height:size*2,fill:base}));for(const [x,y] of [[0,0],[size,size]])pattern.append(svgElt('rect',{x,y,width:size,height:size,fill:accent}))}else{const spacing=Math.max(12,setting.dotSize*2.8);pattern.setAttribute('width',spacing);pattern.setAttribute('height',spacing);pattern.append(svgElt('rect',{width:spacing,height:spacing,fill:base}),svgElt('circle',{cx:spacing/2,cy:spacing/2,r:setting.dotSize/2,fill:accent}))}defs.append(pattern);return 'url(#fabric-'+piece+')'}
function svgElt(tag,attributes){const el=document.createElementNS('http://www.w3.org/2000/svg',tag);Object.entries(attributes).forEach(([name,value])=>el.setAttribute(name,String(value)));return el}
function openDressMe(id,colors){dressComboId=id;dressColors=colors.slice();dressState.colors={top:0,jacket:Math.min(1,colors.length-1),bottom:Math.min(1,colors.length-1),tights:0,neck:0};dressState.tightsColor=null;dressState.showTights=false;dressState.neck='none';const section=document.getElementById('dressSection');section.classList.add('visible');document.getElementById('dressCombinationLabel').textContent='Vol. '+(selected?volumeForColor(selected):1)+' · Combination #'+id;const bars=document.getElementById('dressPalette');bars.replaceChildren();dressColors.forEach(c=>{const bar=document.createElement('span');bar.style.backgroundColor=c.hex;bar.title=c.name+' · '+c.hex.toUpperCase();bars.append(bar)});refreshDressTops();refreshDressBottoms();refreshShoeOptions();refreshNeckOptions();activePiece='top';renderDress();section.scrollIntoView({behavior:'smooth',block:'start'})}
function refreshDressTops(){const sel=document.getElementById('dressTop'),current=dressState.top;sel.replaceChildren();dressTops[dressState.gender].forEach(([id,label])=>{const opt=document.createElement('option');opt.value=id;opt.textContent=label;sel.append(opt)});const fallback=dressState.gender==='woman'?'tee':'tee';dressState.top=dressTops[dressState.gender].some(o=>o[0]===current)?current:fallback;sel.value=dressState.top}
function refreshDressBottoms(){const sel=document.getElementById('dressBottom'),current=dressState.bottom;sel.replaceChildren();dressBottoms[dressState.gender].forEach(([id,label])=>{const opt=document.createElement('option');opt.value=id;opt.textContent=label;sel.append(opt)});const fallback=dressState.gender==='woman'?'skirt-knee':'trousers';dressState.bottom=dressBottoms[dressState.gender].some(o=>o[0]===current)?current:fallback;sel.value=dressState.bottom}
function refreshShoeOptions(){
 const select=document.getElementById('dressShoes');
 dressState.shoeStyle=SHOE_STYLE_FIXED;
 if(!select)return;
 select.replaceChildren();
 const opt=document.createElement('option');
 opt.value=SHOE_STYLE_FIXED;
 opt.textContent='Classic shoes';
 select.append(opt);
 select.value=SHOE_STYLE_FIXED;
 select.disabled=true;
 const field=select.closest('label, .dress-field');
 if(field)field.classList.add('hidden');
}
function refreshShoeColorButtons(){
 const group=document.getElementById('shoeColors');if(!group)return;group.replaceChildren();
 // Standard shoe shades and the actual colors from the selected Wada combination.
 const shoePalette=[...SHOE_COLORS,...dressColors.filter(c=>!SHOE_COLORS.some(base=>base.hex.toLowerCase()===c.hex.toLowerCase()))];
 shoePalette.forEach(c=>{const b=document.createElement('button');b.type='button';b.className='dress-color-btn';b.style.background=c.hex;b.title=c.name+' · '+c.hex.toUpperCase();b.setAttribute('aria-label','Shoes: '+c.name);b.setAttribute('aria-pressed',String(dressState.shoeColor.toLowerCase()===c.hex.toLowerCase()));b.addEventListener('click',()=>{dressState.shoeColor=c.hex;renderDress()});group.append(b)});
 const chosen=shoePalette.find(c=>c.hex.toLowerCase()===dressState.shoeColor.toLowerCase());
 document.getElementById('shoeColorName').textContent=chosen?chosen.name+' · '+chosen.hex.toUpperCase():'White';
}
function refreshHairColorButtons(){
 const group=document.getElementById('hairColors');if(!group)return;group.replaceChildren();
 HAIR_COLORS.forEach(c=>{const b=document.createElement('button');b.type='button';b.className='dress-color-btn';b.style.background=c.hex;b.title=c.name;b.setAttribute('aria-label','Hair color '+c.name);b.setAttribute('aria-pressed',String(dressState.hair===c.hex));b.addEventListener('click',()=>{dressState.hair=c.hex;drawOutfit();refreshHairColorButtons()});group.append(b)});
 document.getElementById('hairColorName').textContent=HAIR_COLORS.find(c=>c.hex===dressState.hair)?.name||'Dark brown';
}
function renderDress(){if(!dressColors.length)return;const controls=document.getElementById('dressColorControls');controls.replaceChildren();const pieceLabels={top:'Top / inner layer',jacket:'Jacket',bottom:'Bottom',tights:'Tights / stockings',neck:'Neck accessory'};dressPieces().forEach(piece=>{const line=document.createElement('div');line.className='dress-color-row';const title=document.createElement('p');title.className='dress-color-title';title.textContent=pieceLabels[piece];const buttons=document.createElement('div');buttons.className='dress-color-options';(piece==='tights'?dressColors.concat(TIGHTS_EXTRAS):dressColors).forEach((c,i)=>{const b=document.createElement('button');b.type='button';b.className='dress-color-btn';b.style.backgroundColor=c.hex;b.title=c.name+' · '+c.hex.toUpperCase();b.setAttribute('aria-label',pieceLabels[piece]+': '+c.name);b.setAttribute('aria-pressed',String(piece==='tights'?(i<dressColors.length?!dressState.tightsColor&&dressState.colors.tights===i:dressState.tightsColor===c.hex):dressState.colors[piece]===i));b.addEventListener('click',()=>{if(piece==='tights'&&i>=dressColors.length){dressState.tightsColor=c.hex;dressState.showTights=true}else{dressState.colors[piece]=i;if(piece==='tights'){dressState.tightsColor=null;dressState.showTights=true}}renderDress()});buttons.append(b)});const selectedColor=piece==='tights'&&dressState.tightsColor?TIGHTS_EXTRAS.find(c=>c.hex===dressState.tightsColor):dressColors[dressState.colors[piece]]||dressColors[0];const choice=document.createElement('p');choice.className='dress-color-choice';choice.textContent=selectedColor.name+' · '+selectedColor.hex.toUpperCase();line.append(title,buttons,choice);controls.append(line)});refreshShoeColorButtons();refreshHairColorButtons();refreshPatternPanel();drawOutfit()}
// Editorial raster templates: transparent garment apertures + independent grayscale ink overlay.
const TEMPLATE_SIZE={w:1086,h:1448};
const templateAssets={};
const TEMPLATE_PARTS={man:['top','bottom','shoes'],woman:['top','jacket','bottom','shoes']};
const TEMPLATE_BOXES={man:{top:[262,1286,420,1366],bottom:[464,1286,622,1366],shoes:[666,1286,822,1366]},woman:{top:[168,1257,325,1343],jacket:[365,1257,522,1343],bottom:[562,1257,719,1343],shoes:[759,1257,916,1343]}};
function loadTemplate(gender){
 if(templateAssets[gender])return templateAssets[gender];
 const keys=['overlay','skin','hair','shoes-ink',...(gender==='woman'?['tights']:[]),...TEMPLATE_PARTS[gender]];
 const assets={},ready=Promise.all(keys.map(key=>new Promise((resolve,reject)=>{
  const image=new Image();image.onload=()=>{assets[key]=image;resolve()};image.onerror=()=>reject(Error('Cannot load figure asset '+gender+'/'+key));image.src='assets/'+gender+'-'+key+'.png?v=15-no-readback';
 }))).then(()=>assets);
 templateAssets[gender]=ready;
 return ready;
}
function outfitColor(piece){return piece==='shoes'?dressState.shoeColor:piece==='tights'?(dressState.tightsColor||dressColor('tights')):dressColor(piece)}
function hexChannels(hex){return [1,3,5].map(i=>parseInt(hex.slice(i,i+2),16))}
const inkCache=new Map();
function recoloredInk(assets){
 // Render using Canvas compositing ONLY. Reading image pixels with getImageData()
 // would throw a SecurityError when Chrome opens this PWA from file://.
 const cacheKey=[dressState.gender,dressState.skin,dressState.hair,dressState.showTights?dressState.tightsColor||'palette':'bare',dressState.colors.tights].join(':');
 if(inkCache.has(cacheKey))return inkCache.get(cacheKey);
 const w=TEMPLATE_SIZE.w,h=TEMPLATE_SIZE.h;
 const result=document.createElement('canvas');result.width=w;result.height=h;
 const ctx=result.getContext('2d');
 ctx.drawImage(assets.overlay,0,0,w,h);
 for(const [kind,color] of [['skin',dressState.skin],['hair',dressState.hair],...(dressState.gender==='woman'&&isSkirt()&&dressState.showTights?[['tights',dressState.tightsColor||dressColor('tights')]]:[])]){
  const tinted=document.createElement('canvas');tinted.width=w;tinted.height=h;
  const t=tinted.getContext('2d');
  t.fillStyle=color;t.fillRect(0,0,w,h);
  t.globalCompositeOperation='destination-in';t.drawImage(assets[kind],0,0,w,h);
  t.globalCompositeOperation='source-over';
  // Multiply keeps the dark original ink; opacity keeps the drawn skin shadows.
  ctx.save();ctx.globalCompositeOperation='multiply';ctx.globalAlpha=kind==='hair'?.9:.72;
  ctx.drawImage(tinted,0,0);ctx.restore();
 }
 if(inkCache.size>12)inkCache.clear();inkCache.set(cacheKey,result);
 return result;
}
function makeFabricTile(piece){
 const s=pieceSettings(piece),unit=Math.max(5,s.size*3.6),dots=Math.max(4,s.dotSize*3.6);
 const tile=document.createElement('canvas');let sz=Math.ceil(s.type==='dots'?dots*2.8:unit*2);sz=Math.min(280,Math.max(18,sz));tile.width=sz;tile.height=sz;
 const t=tile.getContext('2d'),base=outfitColor(piece),accent=dressColors[s.accent%dressColors.length]?.hex||base;
 t.fillStyle=base;t.fillRect(0,0,sz,sz);t.fillStyle=accent;
 if(s.type==='stripes')t.fillRect(0,0,sz/2,sz);
 else if(s.type==='checks'){t.fillRect(0,0,sz/2,sz/2);t.fillRect(sz/2,sz/2,sz/2,sz/2)}
 else if(s.type==='dots'){t.beginPath();t.arc(sz/2,sz/2,dots/2,0,Math.PI*2);t.fill()}
 return tile;
}
function paintGarment(ctx,assets,piece){
 const w=TEMPLATE_SIZE.w,h=TEMPLATE_SIZE.h,settings=pieceSettings(piece);
 const layer=document.createElement('canvas');layer.width=w;layer.height=h;const c=layer.getContext('2d');
 if(settings.type==='solid'||settings.type==='draw'){
  c.fillStyle=outfitColor(piece);c.fillRect(0,0,w,h);
 }else{
  const tile=makeFabricTile(piece),pattern=c.createPattern(tile,'repeat');
  if(pattern&&pattern.setTransform){const angle=Number(settings.angle)*Math.PI/180;const mat=new DOMMatrix([Math.cos(angle),Math.sin(angle),-Math.sin(angle),Math.cos(angle),0,0]);pattern.setTransform(mat)}
  c.fillStyle=pattern||outfitColor(piece);c.fillRect(0,0,w,h);
 }
 const strokes=dressState.strokes[piece]||[];
 strokes.forEach(st=>{if(!st.points.length)return;c.strokeStyle=st.color;c.fillStyle=st.color;c.lineWidth=st.size*3.6;c.lineJoin='round';c.lineCap='round';if(st.points.length===1){c.beginPath();c.arc(st.points[0][0],st.points[0][1],st.size*1.8,0,Math.PI*2);c.fill()}else{c.beginPath();c.moveTo(...st.points[0]);st.points.slice(1).forEach(pt=>c.lineTo(...pt));c.stroke()}});
 c.globalCompositeOperation='destination-in';c.drawImage(assets[piece],0,0,w,h);
 ctx.drawImage(layer,0,0);
}
let renderNonce=0;
async function drawEditorialOriginal(){
 const current=++renderNonce,gender=dressState.gender,preview=document.getElementById('dressPreview');
 try{
  const assets=await loadTemplate(gender);
  if(current!==renderNonce)return;
  let canvas=preview.querySelector('canvas');
  if(!canvas){preview.replaceChildren();canvas=document.createElement('canvas');canvas.className='fashion-template';canvas.setAttribute('role','img');preview.append(canvas);canvas.addEventListener('pointerdown',templatePointerDown);canvas.addEventListener('pointermove',templatePointerMove);canvas.addEventListener('pointerup',templatePointerUp);canvas.addEventListener('pointercancel',templatePointerUp)}
  canvas.width=TEMPLATE_SIZE.w;canvas.height=TEMPLATE_SIZE.h;
  canvas.setAttribute('aria-label',gender==='man'?'Man in T-shirt, trousers and shoes':'Woman in shirt, jacket, skirt and shoes');
  const c=canvas.getContext('2d');c.fillStyle='#fff';c.fillRect(0,0,canvas.width,canvas.height);
  // Paint the complete model first: even an outfit-layer failure cannot erase the face.
  c.drawImage(recoloredInk(assets),0,0);
  TEMPLATE_PARTS[gender].forEach(piece=>paintGarment(c,assets,piece));
  c.drawImage(recoloredInk(assets),0,0);
  drawNeckLayer(c,gender);
  const swatches=TEMPLATE_BOXES[gender];
  for(const [piece,[x1,y1,x2,y2]] of Object.entries(swatches)){
   c.fillStyle=outfitColor(piece);c.fillRect(x1+4,y1+4,x2-x1-8,y2-y1-8);
  }
  preview.classList.toggle('draw-active',pieceSettings(activePiece).type==='draw');
  document.getElementById('dressStatus').textContent='v15 · Illustrated template · '+(gender==='man'?'T-shirt + trousers':'Shirt + jacket + knee-length skirt');
 }catch(error){document.getElementById('dressStatus').textContent='Figure error: '+error.message;console.error(error)}
}

/* Modular croquis: 50 outfits, assembled from garment-shaped vector masks over the original illustrated face and limbs. */
let modularNonce=0;
function isOriginalLook(){return ((dressState.gender==='man'&&dressState.top==='tee'&&dressState.bottom==='trousers')||(dressState.gender==='woman'&&dressState.top==='shirt-jacket'&&dressState.bottom==='skirt-knee'))}
function pathFrom(d){return new Path2D(d)}
function renderPiecePath(ctx,part,paths,addLines=[]){
 const setting=pieceSettings(part),w=TEMPLATE_SIZE.w,h=TEMPLATE_SIZE.h;
 const mask=document.createElement('canvas');mask.width=w;mask.height=h;const mc=mask.getContext('2d');
 mc.fillStyle='#fff';for(const p of paths)mc.fill(p);
 const layer=document.createElement('canvas');layer.width=w;layer.height=h;const lc=layer.getContext('2d');
 if(setting.type==='solid'||setting.type==='draw'){lc.fillStyle=outfitColor(part);lc.fillRect(0,0,w,h)}
 else {const tile=makeFabricTile(part),pat=lc.createPattern(tile,'repeat');if(pat&&pat.setTransform){const a=Number(setting.angle)*Math.PI/180;pat.setTransform(new DOMMatrix([Math.cos(a),Math.sin(a),-Math.sin(a),Math.cos(a),0,0]))}lc.fillStyle=pat||outfitColor(part);lc.fillRect(0,0,w,h)}
 for(const st of dressState.strokes[part]||[]){if(!st.points.length)continue;lc.strokeStyle=st.color;lc.fillStyle=st.color;lc.lineWidth=st.size*3.6;lc.lineJoin='round';lc.lineCap='round';lc.beginPath();lc.moveTo(...st.points[0]);if(st.points.length===1){lc.arc(st.points[0][0],st.points[0][1],st.size*1.8,0,Math.PI*2);lc.fill()}else{st.points.slice(1).forEach(pt=>lc.lineTo(...pt));lc.stroke()}}
 lc.globalCompositeOperation='destination-in';lc.drawImage(mask,0,0);ctx.drawImage(layer,0,0);
 ctx.save();ctx.strokeStyle='#4f4943';ctx.lineWidth=2.8;ctx.lineCap='round';ctx.lineJoin='round';paths.forEach(p=>ctx.stroke(p));ctx.restore();
 ctx.save();ctx.strokeStyle='#413d3980';ctx.lineWidth=1.7;for(const p of addLines)ctx.stroke(p);ctx.restore();
}
function bodyPartFromInk(ctx,assets,key){
 const temp=document.createElement('canvas');temp.width=TEMPLATE_SIZE.w;temp.height=TEMPLATE_SIZE.h;
 const tc=temp.getContext('2d');tc.drawImage(recoloredInk(assets),0,0);tc.globalCompositeOperation='destination-in';tc.drawImage(assets[key],0,0);ctx.drawImage(temp,0,0);
}
function clothingPaths(gender){
 const female=gender==='woman',top=dressState.top,bottom=dressState.bottom,long=['long-tee','shirt','shirt-jacket'].includes(top),collared=['shirt','shirt-jacket'].includes(top),jacket=hasJacket();
 const center=female?538:536;
 const topY=female?207:208,waistY=female?422:517;
 const shL=female?433:432,shR=female?642:653;
 const sleeveY=long?(female?560:550):(female?304:337);
 const cuffL=shL-47,cuffR=shR+47;
 const neckL=center-35,neckR=center+35;
 const mainTop=pathFrom(`M${shL+21} ${topY} Q${shL-24} ${topY+14} ${shL-38} ${topY+49} L${cuffL} ${sleeveY} L${shL+27} ${sleeveY+8} L${shL+38} ${topY+125} Q${shL+44} ${waistY-55} ${center-(female?72:100)} ${waistY} Q${center} ${waistY+12} ${center+(female?72:100)} ${waistY} Q${shR-44} ${waistY-55} ${shR-38} ${topY+125} L${shR-27} ${sleeveY+8} L${cuffR} ${sleeveY} L${shR+38} ${topY+49} Q${shR+24} ${topY+14} ${shR-21} ${topY} L${neckR} ${topY} Q${center} ${topY+56} ${neckL} ${topY} Z`);
 const lines=[];
 if(collared){lines.push(pathFrom(`M${neckL} ${topY} L${center} ${topY+51} L${neckR} ${topY}`));lines.push(pathFrom(`M${center} ${topY+51} L${center} ${waistY}`));}
 else lines.push(pathFrom(`M${neckL} ${topY} Q${center} ${topY+43} ${neckR} ${topY}`));
 const shapes={top:[mainTop],topLines:lines,jacket:[],jacketLines:[],bottom:[],bottomLines:[]};
 if(jacket){
  const left=pathFrom(`M${shL+18} ${topY-5} L${center-40} ${topY-8} L${center-17} ${topY+82} L${center-47} ${waistY+18} L${center-(female?115:130)} ${waistY+25} L${shL+21} ${topY+132} L${cuffL-20} ${topY+343} L${cuffL-51} ${topY+335} L${shL-32} ${topY+38} Z`);
  const right=pathFrom(`M${shR-18} ${topY-5} L${center+40} ${topY-8} L${center+17} ${topY+82} L${center+47} ${waistY+18} L${center+(female?115:130)} ${waistY+25} L${shR-21} ${topY+132} L${cuffR+20} ${topY+343} L${cuffR+51} ${topY+335} L${shR+32} ${topY+38} Z`);
  shapes.jacket=[left,right];shapes.jacketLines=[pathFrom(`M${center-40} ${topY-8} L${center-6} ${topY+85} L${center-42} ${topY+121}`),pathFrom(`M${center+40} ${topY-8} L${center+6} ${topY+85} L${center+42} ${topY+121}`)];
 }
 if(bottom.startsWith('skirt')){
  const sy=female?422:517,wide=bottom==='skirt-wide-long',narrow=bottom==='skirt-narrow-long';
  const hemY=bottom==='skirt-short'?700:bottom==='skirt-knee'?805:bottom==='skirt-narrow-long'?1035:1058;
  const hemHalf=wide?210:narrow?112:bottom==='skirt-knee'?142:115;
  const waistHalf=female?100:120;
  shapes.bottom=[pathFrom(`M${center-waistHalf} ${sy} Q${center} ${sy-12} ${center+waistHalf} ${sy} ${narrow?`Q${center+120} ${sy+120} ${center+hemHalf} ${hemY}`:`Q${center+hemHalf-30} ${sy+140} ${center+hemHalf} ${hemY}`} Q${center} ${hemY+13} ${center-hemHalf} ${hemY} ${narrow?`Q${center-120} ${sy+120} ${center-waistHalf} ${sy}`:`Q${center-hemHalf+30} ${sy+140} ${center-waistHalf} ${sy}`} Z`)];
  shapes.bottomLines=[pathFrom(`M${center-waistHalf+5} ${sy+13} Q${center} ${sy+27} ${center+waistHalf-5} ${sy+13}`)];
  if(wide){shapes.bottomLines.push(pathFrom(`M${center-50} ${sy+45} Q${center-85} ${sy+210} ${center-116} ${hemY-18}`),pathFrom(`M${center+50} ${sy+45} Q${center+85} ${sy+210} ${center+116} ${hemY-18}`))}
 }else {
  const py=female?422:517,hy=bottom==='shorts'?(female?713:745):(female?1158:1169),crotch=py+115;
  const half=female?101:116,ankle=bottom==='shorts'?51:bottom==='jeans'?40:33;
  const leftX=center-(female?55:53),rightX=center+(female?55:53);
  const left=pathFrom(`M${center-half} ${py} Q${center-44} ${py-17} ${center} ${py-8} L${center-15} ${crotch} Q${center-40} ${hy-190} ${leftX+ankle} ${hy} L${leftX-ankle} ${hy} Q${center-half-4} ${hy-300} ${center-half+7} ${crotch-38} Z`);
  const right=pathFrom(`M${center} ${py-8} Q${center+44} ${py-17} ${center+half} ${py} L${center+half-7} ${crotch-38} Q${center+half+4} ${hy-300} ${rightX+ankle} ${hy} L${rightX-ankle} ${hy} Q${center+40} ${hy-190} ${center+15} ${crotch} Z`);
  shapes.bottom=[left,right];shapes.bottomLines=[pathFrom(`M${center-half+16} ${py+22} Q${center} ${py+38} ${center+half-16} ${py+22}`),pathFrom(`M${center} ${py+9} L${center} ${crotch-12}`)];
  if(bottom==='jeans')shapes.bottomLines.push(pathFrom(`M${center-half+21} ${py+33} L${center-half+24} ${py+83}`),pathFrom(`M${center+half-21} ${py+33} L${center+half-24} ${py+83}`));
 }
 return shapes;
}
function drawNeckLayer(ctx,gender){
 if(dressState.neck==='none')return;
 const female=gender==='woman';
 const jacket=hasJacket();
 const collared=['shirt','shirt-jacket'].includes(dressState.top);
 const x=female?538:536;
 const y=collared?(female?(jacket?216:221):(jacket?225:230)):(female?(jacket?214:220):(jacket?222:228));
 let paths=[],details=[];
 if(dressState.neck==='tie'){
  const knot=female?14:16, shoulder=female?8:10, len=female?(jacket?152:145):(jacket?174:166), blade=female?14:16;
  paths=[pathFrom(`M${x-knot} ${y+13} L${x} ${y} L${x+knot} ${y+13} L${x+shoulder} ${y+36} L${x+blade} ${y+len-18} L${x} ${y+len} L${x-blade} ${y+len-18} L${x-shoulder} ${y+36} Z`)];
  details=[pathFrom(`M${x-knot} ${y+13} L${x} ${y+35} L${x+knot} ${y+13}`),pathFrom(`M${x} ${y+34} L${x} ${y+len-6}`)];
 }else{
  const loopHalf=female?(jacket?54:48):(jacket?52:46);
  const wrapDrop=female?28:26;
  const tailA=female?(jacket?104:92):(jacket?96:84);
  const tailB=female?(jacket?84:72):(jacket?78:66);
  const tailSpread=female?24:20;
  paths=[
   pathFrom(`M${x-loopHalf} ${y+10} Q${x} ${y-12} ${x+loopHalf} ${y+10} L${x+loopHalf-10} ${y+wrapDrop} Q${x+16} ${y+18} ${x} ${y+30} Q${x-16} ${y+18} ${x-loopHalf+10} ${y+wrapDrop} Z`),
   pathFrom(`M${x-8} ${y+24} L${x-tailSpread-8} ${y+tailA} L${x-2} ${y+tailA+14} L${x+8} ${y+42} Z`),
   pathFrom(`M${x+6} ${y+26} L${x+tailSpread+12} ${y+tailB} L${x+4} ${y+tailB+12} L${x-2} ${y+40} Z`)
  ];
  details=[
   pathFrom(`M${x-loopHalf+8} ${y+18} Q${x} ${y+2} ${x+loopHalf-8} ${y+18}`),
   pathFrom(`M${x-2} ${y+40} L${x-tailSpread+2} ${y+tailA+2}`),
   pathFrom(`M${x+4} ${y+40} L${x+tailSpread+4} ${y+tailB+1}`)
  ];
 }
 renderPiecePath(ctx,'neck',paths,details);
 // Floating accessory color chip at the top right of the template.
 ctx.save();ctx.fillStyle='#ffffffee';ctx.fillRect(819,255,218,83);ctx.strokeStyle='#b0aba4';ctx.lineWidth=2;ctx.strokeRect(830,266,196,59);ctx.fillStyle=outfitColor('neck');ctx.fillRect(836,272,185,47);ctx.font='22px system-ui';ctx.textAlign='center';ctx.fillStyle='#504a44';ctx.fillText(dressState.neck==='tie'?'TIE':'SCARF',928,355);ctx.restore();
}
async function drawModularOutfit(){
 const current=++modularNonce,gender=dressState.gender,preview=document.getElementById('dressPreview');
 const assets=await loadTemplate(gender);if(current!==modularNonce)return;
 let canvas=preview.querySelector('canvas');
 if(!canvas){preview.replaceChildren();canvas=document.createElement('canvas');canvas.className='fashion-template';canvas.setAttribute('role','img');preview.append(canvas);canvas.addEventListener('pointerdown',templatePointerDown);canvas.addEventListener('pointermove',templatePointerMove);canvas.addEventListener('pointerup',templatePointerUp);canvas.addEventListener('pointercancel',templatePointerUp)}
 canvas.width=TEMPLATE_SIZE.w;canvas.height=TEMPLATE_SIZE.h;
 const c=canvas.getContext('2d');c.fillStyle='#fff';c.fillRect(0,0,canvas.width,canvas.height);
 // FACE FIX: preserve the complete editorial illustration as the underlying layer.
 // The garment areas of this transparent overlay have been cut out; face, hair,
 // arms and hands remain visible even if a component-mask draw fails in Chrome.
 c.drawImage(recoloredInk(assets),0,0,TEMPLATE_SIZE.w,TEMPLATE_SIZE.h);
 // Reapply the skin in its own layer to protect it from garment fills.
 bodyPartFromInk(c,assets,'skin');
 const shapes=clothingPaths(gender);
 if(dressState.bottom==='shorts'){
  // Legs beneath shorts, supported for both models.
  c.fillStyle=dressState.skin;c.strokeStyle='#796e63';c.lineWidth=2.2;
  const cx=gender==='man'?535:537, y=gender==='man'?740:710;
  for(let side of [-1,1]){const xx=cx+side*55;c.beginPath();c.moveTo(xx-34,y);c.bezierCurveTo(xx-29,860,xx-26,1040,xx-25,1170);c.lineTo(xx+18,1170);c.bezierCurveTo(xx+22,1040,xx+26,870,xx+34,y);c.closePath();c.fill();c.stroke()}
 }
 if(gender==='woman'&&isSkirt()&&dressState.showTights){
  const tights=document.createElement('canvas');tights.width=TEMPLATE_SIZE.w;tights.height=TEMPLATE_SIZE.h;
  const tc=tights.getContext('2d');tc.fillStyle=dressState.tightsColor||dressColor('tights');tc.fillRect(0,0,tights.width,tights.height);tc.globalCompositeOperation='destination-in';tc.drawImage(assets.tights,0,0);c.drawImage(tights,0,0);
 }
 renderPiecePath(c,'bottom',shapes.bottom,shapes.bottomLines);
 renderPiecePath(c,'top',shapes.top,shapes.topLines);
 if(hasJacket())renderPiecePath(c,'jacket',shapes.jacket,shapes.jacketLines);
 drawNeckLayer(c,gender);
 // Restore the original face, arms and hairstyle on top of clothing.
 bodyPartFromInk(c,assets,'skin');bodyPartFromInk(c,assets,'hair');
 const shoeLayer=document.createElement('canvas');shoeLayer.width=TEMPLATE_SIZE.w;shoeLayer.height=TEMPLATE_SIZE.h;
 const sc=shoeLayer.getContext('2d');sc.fillStyle=dressState.shoeColor;sc.fillRect(0,0,shoeLayer.width,shoeLayer.height);sc.globalCompositeOperation='destination-in';sc.drawImage(assets.shoes,0,0);c.drawImage(shoeLayer,0,0);
 // Retain ink outlines of the original shoes even when their fill is white.
 c.drawImage(assets['shoes-ink'],0,0);
 const swatches=TEMPLATE_BOXES[gender];
 for(const [part,[x1,y1,x2,y2]] of Object.entries(swatches)){c.fillStyle=outfitColor(part);c.fillRect(x1+4,y1+4,x2-x1-8,y2-y1-8)}
 canvas.setAttribute('aria-label',gender+' fashion figure with '+dressState.top+' and '+dressState.bottom);
 preview.classList.toggle('draw-active',pieceSettings(activePiece).type==='draw');
 document.getElementById('dressStatus').textContent='Simple preview · '+dressState.top.replaceAll('-',' ')+' + '+dressState.bottom.replaceAll('-',' ');
}
// V16: individually drawn fashion croquis, no rectangular garment geometry.
// Each illustration has its own masks for the garments that actually appear.
const EDITORIAL_LOOKS = {
 'man|tee|shorts':'man-tee-shorts',
 'man|long-tee|trousers':'man-long-tee-trousers',
 'man|tee-jacket|trousers':'man-tee-jacket-trousers',
 'man|shirt|jeans':'man-shirt-jeans',
 'woman|shirt-jacket|trousers':'woman-shirt-jacket-trousers',
 'woman|tee-jacket|trousers':'woman-shirt-jacket-trousers',
 'woman|long-tee|skirt-knee':'woman-long-tee-skirt-knee',
 'woman|tee-jacket|skirt-knee':'woman-tee-jacket-skirt-knee',
 'woman|shirt|jeans':'woman-shirt-jeans',

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
 'man-tee-shorts':{"top": [268, 1292, 148, 71], "bottom": [472, 1292, 148, 71], "shoes": [674, 1292, 148, 71]},
 'man-long-tee-trousers':{"top": [267, 1291, 149, 71], "bottom": [472, 1291, 148, 71], "shoes": [674, 1291, 149, 71]},
 'man-tee-jacket-trousers':{"top": [189, 1292, 147, 70], "jacket": [384, 1292, 144, 70], "bottom": [569, 1292, 145, 70], "shoes": [756, 1292, 146, 70]},
 'man-shirt-jeans':{"top": [268, 1291, 148, 72], "bottom": [472, 1291, 149, 72], "shoes": [673, 1291, 148, 72]},
 'woman-shirt-jacket-trousers':{"top": [172, 1262, 146, 77], "jacket": [371, 1262, 146, 77], "bottom": [569, 1262, 146, 77], "shoes": [768, 1262, 145, 77]},
 'woman-long-tee-skirt-knee':{"top": [254, 1261, 150, 77], "bottom": [472, 1261, 149, 77], "shoes": [689, 1261, 150, 77]},
 'woman-tee-jacket-skirt-knee':{"top": [183, 1262, 140, 75], "jacket": [377, 1262, 139, 75], "bottom": [571, 1262, 139, 75], "shoes": [764, 1262, 139, 75]},
 'woman-shirt-jeans':{"top": [256, 1262, 148, 77], "bottom": [470, 1262, 148, 77], "shoes": [683, 1262, 148, 77]},

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
 return new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=()=>reject(new Error('Unable to load '+path));image.src='assets/editorial/'+path+'?v=29.0'})
}
function loadEditorialLook(key){
 if(editorialAssetCache.has(key))return editorialAssetCache.get(key);
 const pieces=Object.keys(editorialSwatches[key]);
 const images={};
 const tasks=[[key+'.png','base'],...pieces.map(p=>[key+'-'+p+'-mask.png',p]),[key+'-skin-mask.png','skin'],[key+'-hair-mask.png','hair']];
 const ready=Promise.all(tasks.map(async ([file,id])=>{
  try{images[id]=await loadEditorialPicture(file)}
  catch(error){if(id==='base')throw error;console.warn('Optional illustration layer unavailable:',file,error);images[id]=null}
 })).then(()=>images);
 editorialAssetCache.set(key,ready);
 ready.catch(()=>editorialAssetCache.delete(key));
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
function editorialBodyTint(ctx,mask,color,opacity=0.96){
 // Tint with the alpha of the skin/hair mask, not a full-canvas rectangle.
 // Paint as a near-opaque replacement so every tone, including very light
 // selections, is visibly different from the baked-in skin in the illustration.
 const layer=document.createElement('canvas');layer.width=TEMPLATE_SIZE.w;layer.height=TEMPLATE_SIZE.h;
 const c=layer.getContext('2d');
 c.fillStyle=color;c.fillRect(0,0,layer.width,layer.height);
 c.globalCompositeOperation='destination-in';c.drawImage(mask,0,0,TEMPLATE_SIZE.w,TEMPLATE_SIZE.h);
 c.globalCompositeOperation='source-over';
 ctx.save();ctx.globalCompositeOperation='source-over';ctx.globalAlpha=opacity;
 ctx.drawImage(layer,0,0);ctx.restore();
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
 const c=canvas.getContext('2d');c.fillStyle='#ffffff';c.fillRect(0,0,TEMPLATE_SIZE.w,TEMPLATE_SIZE.h);c.drawImage(assets.base,0,0,TEMPLATE_SIZE.w,TEMPLATE_SIZE.h);
 // Recolor only near-neutral fabric pixels; preserve the original croquis strokes.
 const pieces=Object.keys(editorialSwatches[key]).filter(p=>p!=='shoes');
 for(const piece of pieces)if(assets[piece])c.drawImage(editorialColoredLayer(piece,assets[piece]),0,0);
 if(assets.shoes)c.drawImage(editorialColoredLayer('shoes',assets.shoes),0,0);
 // The base image remains in full: eyes, nose, hair, hands and natural folds.
 if(assets.skin)editorialBodyTint(c,assets.skin,dressState.skin,.96);else console.warn('Skin mask missing for',key);
 if(assets.hair)editorialBodyTint(c,assets.hair,dressState.hair,.85);
 if(dressState.neck!=='none')drawNeckLayer(c,dressState.gender);
 const boxes=editorialSwatches[key];
 for(const [p,[x,y,w,h]] of Object.entries(boxes)){
  c.fillStyle=outfitColor(p);c.fillRect(x,y,w,h);
 }
 canvas.setAttribute('aria-label','Illustrated '+key.replaceAll('-',' ')+' with colorable clothing');
 preview.classList.toggle('draw-active',pieceSettings(activePiece).type==='draw');
 document.getElementById('dressStatus').textContent='Illustrated template · '+key.replaceAll('-',' ')+' · skin tone: '+(document.getElementById('dressSkin')?.selectedOptions[0]?.textContent||dressState.skin);
}

async function drawOutfit(){
 try{
  if(activeEditorialKey()){modularNonce++;renderNonce++;await drawNewEditorial()}
  else{editorialRenderNonce++;renderNonce++;await drawModularOutfit()}
 }catch(e){console.error(e);document.getElementById('dressStatus').textContent='Template unavailable, using simple fallback: '+e.message;editorialRenderNonce++;renderNonce++;await drawModularOutfit()}
}

let drawingPointer=null;
function canvasCoordinates(e){const rect=e.currentTarget.getBoundingClientRect();return [(e.clientX-rect.left)*TEMPLATE_SIZE.w/rect.width,(e.clientY-rect.top)*TEMPLATE_SIZE.h/rect.height]}
function templatePointerDown(e){
 const pt=canvasCoordinates(e),boxes=activeEditorialKey()?Object.fromEntries(Object.entries(editorialSwatches[activeEditorialKey()]).map(([piece,[x,y,w,h]])=>[piece,[x,y,x+w,y+h]])):TEMPLATE_BOXES[dressState.gender];
 for(const [piece,[x1,y1,x2,y2]] of Object.entries(boxes)){if(pt[0]>=x1&&pt[0]<=x2&&pt[1]>=y1&&pt[1]<=y2){if(piece==='shoes'){document.getElementById('shoeColors').scrollIntoView({behavior:'smooth',block:'center'});return}activePiece=piece;renderDress();return}}
 if(pieceSettings(activePiece).type!=='draw'||!(activeEditorialKey()?Object.keys(editorialSwatches[activeEditorialKey()]):TEMPLATE_PARTS[dressState.gender]).includes(activePiece))return;
 e.preventDefault();e.currentTarget.setPointerCapture(e.pointerId);
 const cfg=pieceSettings(activePiece);
 drawingPointer={id:e.pointerId,piece:activePiece};
 const st={color:dressColors[cfg.accent%dressColors.length]?.hex||'#000000',size:cfg.brush,points:[pt]};
 (dressState.strokes[activePiece]||(dressState.strokes[activePiece]=[])).push(st);
 drawOutfit();
}
function templatePointerMove(e){if(!drawingPointer||drawingPointer.id!==e.pointerId)return;e.preventDefault();const pt=canvasCoordinates(e),ss=dressState.strokes[drawingPointer.piece];if(ss?.length){ss[ss.length-1].points.push(pt);drawOutfit()}}
function templatePointerUp(e){if(drawingPointer?.id!==e.pointerId)return;drawingPointer=null;drawOutfit()}
function refreshNeckOptions(){const sel=document.getElementById('dressNeck'),valid=['shirt','shirt-jacket'].includes(dressState.top)?'tie':'scarf';if(dressState.neck!=='none'&&dressState.neck!==valid)dressState.neck=valid;sel.replaceChildren();for(const [value,label] of [['none','None'],[valid,valid==='tie'?'Tie':'Scarf']]){const opt=document.createElement('option');opt.value=value;opt.textContent=label;sel.append(opt)}sel.value=dressState.neck}
for(const id of ['dressGender','dressTop','dressBottom','dressSkin'])document.getElementById(id).addEventListener('change',e=>{const key={dressGender:'gender',dressTop:'top',dressBottom:'bottom',dressSkin:'skin'}[id];dressState[key]=e.target.value;if(key==='gender'){refreshDressTops();refreshDressBottoms();refreshShoeOptions()}if(key==='top')refreshNeckOptions();dressState.shoeStyle=SHOE_STYLE_FIXED;if(!dressPieces().includes(activePiece))activePiece='top';renderDress()});
document.getElementById('dressNeck').addEventListener('change',e=>{dressState.neck=e.target.value;if(!dressPieces().includes(activePiece))activePiece='top';renderDress()});
const dressShoesEl=document.getElementById('dressShoes');if(dressShoesEl)dressShoesEl.addEventListener('change',e=>{dressState.shoeStyle=e.target.value;drawOutfit()});
document.getElementById('dressReset').addEventListener('click',()=>{dressState.gender='man';dressState.top='tee';dressState.bottom='trousers';dressState.colors={top:0,jacket:Math.min(1,dressColors.length-1),bottom:Math.min(1,dressColors.length-1),tights:0,neck:0};dressState.skin='#d6a27a';dressState.hair='#4a3426';dressState.tightsColor=null;dressState.showTights=false;dressState.neck='none';dressState.shoeStyle=SHOE_STYLE_FIXED;dressState.shoeColor='#ffffff';dressState.patterns={};dressState.strokes={};activePiece='top';document.getElementById('dressSkin').value=dressState.skin;document.getElementById('dressGender').value=dressState.gender;refreshDressTops();refreshDressBottoms();refreshShoeOptions();refreshNeckOptions();renderDress();document.getElementById('dressStatus').textContent='Outfit reset.'});
document.getElementById('dressSave').addEventListener('click',()=>{const canvas=document.querySelector('#dressPreview canvas');if(!canvas)return;canvas.toBlob(file=>{if(!file)return;const url=URL.createObjectURL(file),a=document.createElement('a');a.href=url;a.download='wada-dress-me-template-'+dressState.gender+'.png';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);document.getElementById('dressStatus').textContent='Outfit PNG exported.'},'image/png')});

// Collection picker and verified Volume 2 data import.

let activePiece='top',ongoingStroke=null;
function refreshPatternPanel(){if(!dressColors.length)return;const sel=document.getElementById('patternPiece'),pcs=dressPieces();if(!pcs.includes(activePiece))activePiece=pcs[0];sel.replaceChildren();const labels={top:'Top / inner layer',jacket:'Jacket',bottom:'Bottom',tights:'Tights / stockings',neck:'Neck accessory'};pcs.forEach(pc=>{const o=document.createElement('option');o.value=pc;o.textContent=labels[pc];sel.append(o)});sel.value=activePiece;const settings=pieceSettings(activePiece);for(const [id,v] of [['patternType',settings.type],['patternSize',settings.size],['patternAngle',settings.angle],['dotSize',settings.dotSize],['brushSize',settings.brush]])document.getElementById(id).value=v;
 for(const [id,v] of [['patternSizeText',settings.size],['dotSizeText',settings.dotSize],['brushSizeText',settings.brush]])document.getElementById(id).textContent=v+' px';
 // Only display settings that apply to the selected pattern.
 const pattern= settings.type;
 for(const [control,visible] of [
  ['patternSize', pattern==='stripes'||pattern==='checks'],
  ['patternAngle', pattern==='stripes'||pattern==='checks'],
  ['dotSize', pattern==='dots'],
  ['brushSize', pattern==='draw']
 ]){
  const label=document.getElementById(control).closest('label');
  if(label) label.classList.toggle('hidden',!visible);
 }
 for(const button of ['drawUndo','drawClear'])document.getElementById(button).classList.toggle('hidden',pattern!=='draw');

 document.getElementById('patternHint').textContent=settings.type==='draw'?'Draw with your finger or stylus on the garment. Undo and Clear affect only the selected garment.':settings.type==='solid'?'Solid garment color is selected above.':settings.type==='dots'?'Choose an accent color and adjust dot diameter.':'Choose an accent color and adjust stripe/check size and direction.';
 const sw=document.getElementById('patternSwatches');sw.replaceChildren();dressColors.forEach((c,i)=>{const b=document.createElement('button');b.type='button';b.className='studio-swatch';b.style.background=c.hex;b.title=c.name;b.setAttribute('aria-label','Pattern color '+c.name);b.setAttribute('aria-pressed',String(settings.accent===i));b.onclick=()=>{settings.accent=i;renderDress()};sw.append(b)})
}
document.getElementById('patternPiece').addEventListener('change',e=>{activePiece=e.target.value;renderDress()});
for(const [id,key] of [['patternType','type'],['patternSize','size'],['patternAngle','angle'],['dotSize','dotSize'],['brushSize','brush']])document.getElementById(id).addEventListener('input',e=>{pieceSettings(activePiece)[key]=['type'].includes(key)?e.target.value:Number(e.target.value);renderDress()});
document.getElementById('drawUndo').addEventListener('click',()=>{(dressState.strokes[activePiece]||[]).pop();drawOutfit()});
document.getElementById('drawClear').addEventListener('click',()=>{dressState.strokes[activePiece]=[];drawOutfit()});


// Direct Wada color selection: an alternative to photographing fabric.
// Use the same result pipeline so historical combinations and Dress Me behave identically.
(function installWadaColorPicker(){
 const toggle=document.getElementById('wadaPickerToggle');
 const panel=document.getElementById('wadaPickerPanel');
 const search=document.getElementById('wadaColorSearch');
 const grid=document.getElementById('wadaColorGrid');
 const count=document.getElementById('wadaColorCount');
 if(!toggle||!panel||!search||!grid||!count)return;
 function paintPicker(){
  const query=search.value.trim().toLocaleLowerCase();
  const matching=palette.filter(c=>c.name.toLocaleLowerCase().includes(query)||c.hex.includes(query));
  count.textContent=matching.length+' of '+palette.length+' original Wada colors';
  grid.replaceChildren();
  for(const color of matching){
   const option=document.createElement('button');option.type='button';option.className='wada-color-option';
   option.title=color.name+' · '+color.hex.toUpperCase();
   option.setAttribute('aria-label','Select '+color.name+', '+color.hex.toUpperCase());
   option.setAttribute('aria-pressed',String(mode==='wada'&&selected?.name===color.name));
   const chip=document.createElement('span');chip.className='wada-color-dot';chip.style.backgroundColor=color.hex;
   const name=document.createElement('span');name.className='wada-color-name';name.textContent=color.name;
   option.append(chip,name);
   option.addEventListener('click',()=>{
    mode='wada';
    render(hexToRgb(color.hex));
    document.getElementById('status').textContent='Selected directly from the Wada palette: '+color.name+' · '+color.hex.toUpperCase();
    panel.classList.add('hidden');toggle.setAttribute('aria-expanded','false');
    toggle.textContent='◉  Wada color: '+color.name;
    document.getElementById('results').scrollIntoView({behavior:'smooth',block:'start'});
   });
   grid.append(option);
  }
 }
 toggle.addEventListener('click',()=>{const show=panel.classList.contains('hidden');panel.classList.toggle('hidden',!show);toggle.setAttribute('aria-expanded',String(show));if(show){paintPicker();search.focus()}});
 search.addEventListener('input',paintPicker);
})();
