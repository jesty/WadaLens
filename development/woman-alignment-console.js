/* Paste this entire file into Chrome DevTools Console on the EXPERIMENTAL WOMAN branch.
   Use the woman outfit picker to make the piece visible before adjusting it. */
(() => {
  if(typeof WOMAN_LAYER_REGISTRATION==='undefined' || typeof drawOutfit!=='function'){
    console.error('Apri Wada Lens dal branch sperimentale con il renderer donna.');return;
  }
  document.getElementById('wada-woman-alignment-debug')?.remove();
  const reg=WOMAN_LAYER_REGISTRATION,storageKey='wadaWomanCalibrationV1';
  try{
    const saved=JSON.parse(localStorage.getItem(storageKey)||'{}');
    for(const [k,v] of Object.entries(saved))
      if(reg[k])for(const a of ['dx','dy','sx','sy'])
        if(Number.isFinite(v[a]))reg[k][a]=v[a];
  }catch(e){console.warn('Calibration restore skipped',e)}
  const names={jacket:'Giacca',shirt:'Camicia',tee:'T-shirt',trousers:'Pantaloni',
    skirt:'Gonna',shoes:'Scarpe',tie:'Cravatta',scarf:'Foulard'};
  const config=[
    ['dx','Orizzontale',-150,150,1],
    ['dy','Verticale',-150,150,1],
    ['sx','Larghezza',0.65,1.45,0.005],
    ['sy','Altezza',0.65,1.45,0.005]
  ];
  const panel=document.createElement('div');panel.id='wada-woman-alignment-debug';
  panel.style.cssText='position:fixed;right:16px;top:16px;width:300px;max-width:90vw;max-height:85vh;overflow:auto;z-index:2147483647;background:#fff;color:#222;padding:15px;border-radius:12px;border:1px solid #aaa;box-shadow:0 8px 28px #0005;font:13px Arial,sans-serif';
  panel.innerHTML='<header style="display:flex;justify-content:space-between;align-items:center;gap:12px"><b>Wada Lens · Donna · Allineamento</b><button id="ww-close">✕</button></header><p>Seleziona un capo già visibile sul figurino.</p><select id="ww-piece" style="width:100%;padding:8px"></select><div id="ww-controls" style="margin-top:12px"></div><div style="display:flex;gap:6px"><button id="ww-copy" style="padding:8px;flex:1">Copia coordinate</button><button id="ww-reset" style="padding:8px">Reset capo</button></div><p style="font-size:11px;color:#666;margin-bottom:0">I valori restano salvati in questo browser. Le modifiche non aggiornano GitHub.</p>';
  document.body.append(panel);
  const selector=panel.querySelector('#ww-piece'),controls=panel.querySelector('#ww-controls');
  for(const [kind,label] of Object.entries(names)){
    const option=document.createElement('option');option.value=kind;option.textContent=label;selector.add(option);
  }
  const initial=Object.fromEntries(Object.keys(reg).map(k=>[k,{...reg[k]}]));
  const persist=()=>{try{localStorage.setItem(storageKey,JSON.stringify(reg))}catch(e){}drawOutfit()};
  const build=()=>{
    const piece=reg[selector.value];controls.replaceChildren();
    for(const [key,title,min,max,step] of config){
      const row=document.createElement('div');row.style.cssText='margin-bottom:12px';
      const label=document.createElement('label');label.textContent=title;label.style.cssText='display:block;margin-bottom:3px;font-weight:600';
      const line=document.createElement('div');line.style.cssText='display:flex;align-items:center;gap:8px';
      const slider=document.createElement('input');slider.type='range';slider.min=min;slider.max=max;slider.step=step;slider.value=piece[key];slider.style.flex='1';
      const number=document.createElement('input');number.type='number';number.min=min;number.max=max;number.step=step;number.value=piece[key];number.style.cssText='width:75px;padding:5px;border:1px solid #ccc;border-radius:5px';
      const change=value=>{
        const n=Number(value);if(!Number.isFinite(n))return;
        piece[key]=Math.round(n*1000)/1000;
        slider.value=piece[key];number.value=piece[key];persist();
      };
      slider.addEventListener('input',()=>change(slider.value));
      number.addEventListener('change',()=>change(number.value));
      line.append(slider,number);row.append(label,line);controls.append(row);
    }
  };
  selector.addEventListener('change',build);
  panel.querySelector('#ww-close').onclick=()=>panel.remove();
  panel.querySelector('#ww-reset').onclick=()=>{
    Object.assign(reg[selector.value],initial[selector.value]);persist();build();
  };
  panel.querySelector('#ww-copy').onclick=async()=>{
    const result=Object.fromEntries(Object.entries(reg).map(([k,v])=>[k,{...v}]));
    const json=JSON.stringify(result,null,2);console.log('Wada woman coordinates:',json);
    try{await navigator.clipboard.writeText(json);panel.querySelector('#ww-copy').textContent='✓ Copiate'}
    catch(e){prompt('Copia questo JSON e invialo in chat:',json)}
  };
  build();persist();
  console.log('Wada woman alignment ready. Adjust a garment then click "Copia coordinate".');
})();
