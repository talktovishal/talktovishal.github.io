const $ = id => document.getElementById(id);
const stages = ['Overview','Inputs','Query','Key','Attention','Value mixture','Combine heads','Feed-forward','Blocks 2 to 12','Prediction','Write the next word','Check yourself'];
const C = Object.fromEntries(Object.entries({
  ink:'text',muted:'text-muted',line:'border',paper:'surface',pale:'surface-soft',accent:'accent',
  Q:'link',K:'danger',V:'success',input:'warning',highlight:'accent-soft'
}).map(([key,name])=>[key,`var(--cp-${name})`]));
const fmt=(n,d=4)=>Number(n.toFixed(d)).toString(), pct=n=>(100*n).toFixed(2)+'%';
const safe=t=>String(t).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const curve=(x,y,a,b)=>`M${x},${y} C${x+(a-x)*.48},${y} ${a-(a-x)*.46},${b} ${a},${b}`;
const txt=(x,y,label,cls='caption',anchor='start')=>`<text x="${x}" y="${y}" class="${cls}" text-anchor="${anchor}">${safe(label)}</text>`;
const rect=(x,y,w,h,fill,extra='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="${fill}" ${extra}/>`;
const line=(d,color,width,opacity=1,extra='')=>`<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" opacity="${opacity}" ${extra}/>`;
function pick(key,tip,content,tab=0) {
  return `<g class="pick" tabindex="${tab}" role="button" aria-label="${safe(tip)}" data-key="${key}" data-tip="${safe(tip)}">${content}</g>`;
}
function strip(label,values,hot) {
  return `<div class="strip" style="--n:${values.length}"><b>${safe(label)}</b>${values.map((v,i)=>`<span class="${i===hot?'hot':''}">${fmt(v,2)}</span>`).join('')}</div>`;
}
const formula=s=>`<span class="equation numbers">${safe(s)}</span>`;
const vector=v=>'['+v.map(x=>fmt(x,3)).join(', ')+']';
const reduce=matchMedia('(prefers-reduced-motion:reduce)');

// Every mark and every control point uses the same horizontal map. Y stays in
// token-row coordinates. In Inputs the extra space opens *between* token and sum.
const stageEdges=[0,176,391,652,810,982,1138,1400], stageSteps=[1,2,4,6,7,8,9];
const knots=[0,85,96,...stageEdges.slice(1)];
function focusedKnots(zone){
  if(zone<0)return knots.slice();
  const left=stageEdges[zone],right=stageEdges[zone+1],width=right-left,focus=560;
  const rest=(1400-focus)/(1400-width);
  return knots.map(x=>{
    if(x<=left)return x*rest;
    if(x>=right)return left*rest+focus+(x-right)*rest;
    if(zone===0)return x<=85?x:x+focus-width;
    return left*rest+(x-left)*focus/width;
  });
}
function createMapLens(graph){
  let current=knots.slice(),frame=0,paint=null,dirty=true;
  function bind(){
    dirty=true;
    const actions=[],slots=new Map(),samples=[],grouped=new Set();
    const slot=x=>{
      if(!slots.has(x)){
        const i=knots.findIndex((end,k)=>k>0&&x<=end)-1;
        if(i<0||x<0)throw new Error(`Map coordinate outside diagram: ${x}`);
        slots.set(x,samples.length);samples.push([i,(x-knots[i])/(knots[i+1]-knots[i])]);
      }
      return slots.get(x);
    };
    // A vector strip can move as one unit rather than rewriting every tile.
    for(const g of graph.querySelectorAll('g.pick')){
      const kids=[...g.children];if(!kids.length||kids.some(e=>e.tagName!=='rect'))continue;
      const x=Math.min(...kids.map(e=>e.x.baseVal.value)),end=Math.max(...kids.map(e=>e.x.baseVal.value+e.width.baseVal.value));
      if(end<=x||knots.some(k=>x<k&&k<end))continue;
      const a=slot(x),b=slot(end);kids.forEach(e=>grouped.add(e));
      actions.push(X=>{const s=(X[b]-X[a])/(end-x);g.setAttribute('transform',`matrix(${s} 0 0 1 ${X[a]-s*x} 0)`);});
    }
    for(const el of graph.querySelectorAll('rect,text,circle,path')){
      if(grouped.has(el)||el.closest('[data-inset]'))continue;
      const num=a=>Number(el.getAttribute(a));
      if(el.tagName==='path'){
        // The map draws absolute M/L/C/Q/H/V commands. Map horizontal values
        // only, including Bézier handles, so paths still meet their endpoints.
        const parts=el.getAttribute('d').match(/[A-Za-z]|-?(?:\d+\.?\d*|\.\d+)/g);
        const indices=[];let cmd='',n=0;
        parts.forEach((v,i)=>{
          if(/^[A-Za-z]$/.test(v)){
            if(!['M','L','C','Q','H','V'].includes(v))throw new Error(`Unsupported map path command ${v}`);
            cmd=v;n=0;
          }else{if(cmd==='H'||(cmd!=='V'&&n%2===0))indices.push([i,slot(+v)]);n++;}
        });
        actions.push(X=>{for(const [i,k] of indices)parts[i]=X[k];el.setAttribute('d',parts.join(' '));});
      }else if(el.tagName==='rect'){
        const x=num('x'),a=slot(x),b=slot(x+num('width'));
        actions.push(X=>{el.setAttribute('x',X[a]);el.setAttribute('width',X[b]-X[a]);});
      }else{
        const circle=el.tagName==='circle',x=num(circle?'cx':'x'),a=slot(x),b=slot(x+1),y=num(circle?'cy':'y');
        actions.push(X=>{
          const s=Math.min(1,Math.max(circle?0:.88,X[b]-X[a]));
          el.setAttribute('transform',`matrix(${s} 0 0 ${s} ${X[a]-s*x} ${(1-s)*y})`);
        });
      }
    }
    const inset=graph.querySelector('[data-inset]'),bridge=graph.querySelector('[data-bridge]');
    paint=k=>{
      const X=samples.map(([i,t])=>k[i]+(k[i+1]-k[i])*t);
      for(const update of actions)update(X);
      const gap=k[2]-k[1],op=Math.max(0,Math.min(1,(gap-40)/240));
      inset.setAttribute('transform',`translate(${k[1]} ${inset.dataset.y}) scale(${gap/395} 1)`);
      inset.setAttribute('opacity',op);inset.style.visibility=op?'visible':'hidden';
      bridge.setAttribute('opacity',.66*(1-op));
    };
  }
  function to(zone,animate,onFinish){
    cancelAnimationFrame(frame);frame=0;
    const from=current,dest=focusedKnots(zone);
    const same=from.every((v,i)=>v===dest[i]);
    if(!animate||reduce.matches||same){
      if(!same||dirty)paint(current=dest);dirty=false;onFinish?.();return;
    }
    dirty=false;let start;
    function tick(now){
      start??=now;
      const t=Math.min(1,(now-start)/320),ease=t*t*(3-2*t);
      current=t===1?dest:from.map((v,i)=>v+(dest[i]-v)*ease);paint(current);
      if(t<1)frame=requestAnimationFrame(tick);else{frame=0;onFinish?.();}
    }
    paint(from);frame=requestAnimationFrame(tick);
  }
  return {bind,to};
}

async function mount() {
  const {default:data}=await import('./chapter5-gpt2-trace.js?v=20261122-publish');
  const {createTour,stops,stopNames}=await import('./chapter5-lessons.js?v=20261122-title');
  const {createInputStudy}=await import('./chapter5-inputs.js?v=20261122-publish');
  const graph=$('graph');
  function decode(s){return new Float32Array(Uint8Array.from(atob(s),c=>c.charCodeAt(0)).buffer);}
  const positions=data.positionRows.map(decode);
  for(const t of Object.values(data.traces)){
    t.positions=positions.slice(0,t.pieces.length);t.embeddings=t.tokenIds.map(id=>decode(data.tokenRows[id]));
    t.input=t.embeddings.map((row,i)=>row.map((v,j)=>v+positions[i][j]));
  }
  let example='base',pass=data.traces.base,block=pass.block,words=pass.pieces.map(s=>s.trim()),prior=null;
  let reader=5,source=3,head=0,stage=0,flight=null,output=null;
  const selectedHead=()=>block.heads[head],otherHead=()=>(head+1)%block.heads.length;
  const px=i=>469+125*i/(words.length-1),y=i=>107+230*i/(words.length-1),my=i=>145+125*i/(words.length-1);
  const roles=['Q','K','V'], roleKey=['query','key','value'];
  const sorted=()=>pass.top[reader];
  const routeY=(role,i)=>[181,81,303][role]+25*i/(words.length-1);
  const bestSource=r=>selectedHead().weights[r].indexOf(Math.max(...selectedHead().weights[r]));
  const input=createInputStudy({root:$('inputLab'),mathRoot:$('inputMeasures'),chapter:$('embeddingChapter'),experiment:$('experiment'),safe,refresh:()=>render(),setExample,selectReader(i){reader=i;source=bestSource(i);output=null;}});
  const last=stages.length-1,lens=createMapLens(graph),zone=()=>stage===last?-1:stageSteps.findLastIndex(s=>s<=stage);
  const index=()=>stage===0?0:stage===1?1+input.part:stage+3;
  const tour=createTour($('tourChapter'),changeView,()=>render(),{review:Boolean($('reviewQueue'))});
  if($('reviewLinks'))$('reviewLinks').innerHTML=stops.map((s,i)=>`<a href="?lesson=${s}">${i+1}. ${stopNames[i]}</a>`).join('');
  let sceneKey='',headers=[];
  function layout(){
    const inside=stage===1,chapter=inside&&input.part===1;
    // Each lesson now owns its worked math, so the older side panels stay hidden.
    $('inputLab').hidden=true;$('inputMeasures').hidden=true;$('experiment').hidden=true;
    $('deeper').hidden=true;$('embeddingChapter').hidden=!chapter;$('tourChapter').hidden=chapter;
    if(chapter)$('tourChapter').replaceChildren();
    if(!chapter&&$('embeddingChapter').hasChildNodes())$('embeddingChapter').replaceChildren();
    $('lessonKicker').textContent=stopNames[index()];
    for(const id of ['headControl','sourceControl'])$(id).style.visibility=inside?'hidden':'visible';
  }
  const params=new URLSearchParams(location.search),at=Number(params.get('at'));
  if(params.get('stage')==='inputs'){
    stage=1;reader=1;source=bestSource(reader);
    if(params.get('detail')==='embedding')input.setPart(1);
  }
  const jump=stops.indexOf(params.get('lesson'));
  if(jump>=0){
    stage=jump===0?0:jump<=4?1:jump-3;
    if(stage===1){input.setPart(jump-1);reader=1;source=bestSource(reader);}
  }
  if(Number.isInteger(at)&&at>=1&&at<=words.length){reader=at-1;source=bestSource(reader);}
  // Section links from the earlier chapter, and from Chapters 6 and 7, open the matching stop.
  const aliases={qkv:'query',heatmap:'attention','attention-row':'attention','attention-intuition':'values',multihead:'heads',normalization:'heads',ffn:'mlp',block:'blocks',forward:'overview',onetoken:'generate',decoding:'generate',inputs:'tokens',whatsnext:'practice'};
  function applyStop(name){
    const j=stops.indexOf(aliases[name]||name);if(j<0)return false;
    stage=j===0?0:j<=4?1:j-3;if(stage===1)input.setPart(j-1);
    if(stage!==4&&source>reader)source=bestSource(reader);
    if(stage!==9)output=null;
    return true;
  }
  const linked=document.querySelector('[data-stop-link]');
  applyStop(decodeURIComponent(location.hash.slice(1)));
  addEventListener('hashchange',()=>{
    if(!applyStop(decodeURIComponent(location.hash.slice(1))))return;
    render(true);document.getElementById('walkthrough')?.scrollIntoView({block:'start'});
  });
  // Keep the sidebar and the address bar in step with the current stop.
  function syncPlace(){
    const slug=stops[index()];
    document.querySelectorAll('[data-stop-link]').forEach(a=>{
      if(a.dataset.stopLink===slug){a.setAttribute('aria-current','step');const d=a.closest('details');if(d&&!d.open)d.open=true;}
      else a.removeAttribute('aria-current');
    });
    if(linked&&location.hash!=='#'+slug)history.replaceState(null,'',location.pathname+location.search+'#'+slug);
  }
  function stopMotion(){
    flight?.cancel();flight=null;graph.querySelectorAll('.traveller').forEach(e=>e.remove());
  }
  function travel(){
    stopMotion();if(reduce.matches||(stage===4&&source>reader))return;
    const path=graph.querySelector(`[data-beats~="${stage}"]`);if(!path)return;
    const dot=document.createElementNS('http://www.w3.org/2000/svg','circle');
    dot.setAttribute('class','traveller');dot.setAttribute('r','4');dot.setAttribute('pointer-events','none');
    dot.setAttribute('fill',path.getAttribute('stroke'));dot.setAttribute('stroke',C.paper);dot.setAttribute('stroke-width','1.5');graph.append(dot);
    dot.style.offsetPath=`path("${path.getAttribute('d')}")`;dot.style.offsetAnchor='0px 0px';
    flight=dot.animate([{offsetDistance:'0%'},{offsetDistance:'100%'}],{duration:850,easing:'ease-in-out'});
    flight.onfinish=()=>dot.remove();
  }
  function route(d,color,width,opacity,key,tip,beats='',tab=-1){
    return pick(key,tip,line(d,color,width,opacity,`class="visible" data-beats="${beats}"`)+line(d,'transparent',13,1,'class="hit"'),tab);
  }
  function inputInset(){
    const col=input.coordinate,id=pass.tokenIds[reader],place=reader+1;
    const lane=(part,dy,address,name,value)=>{
      const lead=part===1?'M0 0 C10 0 13 -17 24 -17':'';
      return `<g class="pick lookup-lane" data-part="${part}" data-key="lookup:${part}" role="button" tabindex="-1" aria-label="${name}, ${address}: ${value}">
        <path d="${lead} M111 ${dy} H133 M294 ${dy} C310 ${dy} 307 0 324 0"/>
        ${rect(24,dy-12,87,24,C.paper,'class="outline"')}${txt(31,dy+4,address,'role-label')}
        ${rect(133,dy-12,161,24,C.paper,'class="outline"')}${txt(141,dy+4,name,'role-label')}${txt(287,dy+4,value,'amount','end')}</g>`;
    };
    const result=pass.input[reader][col].toFixed(5);
    return `<g data-inset="" data-y="${y(reader)}" visibility="hidden">
      ${txt(133,77-y(reader),`TWO LOOKUPS · COORDINATE ${col+1}`,'subhead')}
      ${lane(1,-17,'ID '+id,'Token',pass.embeddings[reader][col].toFixed(5))}
      ${lane(2,17,'Place '+place,'Position',pass.positions[reader][col].toFixed(5))}
      <g class="pick lookup-sum" data-part="3" data-key="lookup:3" role="button" tabindex="-1" aria-label="Add the two coordinates: ${result}"><path d="M338 0 H395"/><circle cx="329" cy="0" r="10"/>${txt(329,5,'+','label','middle')}${txt(362,-8,result,'role-label','middle')}</g></g>`;
  }
  function draw(){
    const h=selectedHead(), out=sorted(), rank=output??out[0].id, headY=i=>y(i)-5;
    const panel=(x,w,label,sub,id)=>{
      return pick(`step:${id}`,`Inspect ${label}`,rect(x,9,w,41,C.paper,`class="outline" stroke="${C.line}"`)+txt(x+8,26,label,'heading')+txt(x+8,42,sub,'subhead'));
    };
    let art=`<title>The Transformer at work, reading at “${words[reader]}”. Inspect head ${head+1} in block one.</title>`;
    art+=rect(189,60,613,317,C.pale,'opacity=".5"')+rect(414,100,215,206,C.paper,`stroke="${C.line}"`);
    art+=panel(8,158,'Inputs','Token + position embeddings',1)+panel(187,185,'Three projections','Block 1 · normalize first',2)
      +panel(404,224,'Self-attention',`Query rows × source columns`,4)+panel(669,131,'12 heads','Join · project · add',6)
      +panel(818,155,'Feed-forward','Norm · GELU · add',7)+panel(1000,111,'Blocks 2–12','11 more blocks',8)+panel(1150,233,'Next-token probabilities',`Top 8 of 50,257 after “${words[reader]}”`,9);
    art+=txt(20,77,'TOKEN','subhead')+txt(96,77,'INPUT SUM','subhead')+txt(676,77,'2 OF 12 HEADS','subhead');
    // Residual bypass: only the inspected row is expanded to keep crossings legible.
    const ry=y(reader);
    art+=line(`M155,${ry} C180,${ry} 165,61 197,61 H763 Q793,61 793,83 V${ry}`,C.muted,1.6,.62,'stroke-dasharray="4 5"')
      +txt(482,73,'unchanged input row (residual)','caption','middle');
    for(let i=0;i<words.length;i++){
      const yy=y(i),chosen=i===reader;
      if(chosen)art+=line(`M79 ${yy}H85 M96 ${yy}H182`,C.input,8,.66)+line(`M85 ${yy}H96`,C.input,8,.66,'data-bridge=""');
      else art+=line(curve(79,yy,182,yy),C.input,8,.24);
      art+=pick(`read:${i}`,`Read at ${words[i]}, position ${i+1}`,rect(7,yy-14,76,28,chosen?C.highlight:C.paper,`class="outline" stroke="${chosen?C.accent:C.line}"`)+txt(16,yy+5,words[i],'label'));
      let row='';
      const vals=pass.input[i].slice(input.start,input.start+4);
      vals.forEach((v,k)=>{row+=rect(101+k*13,yy-7,11,14,v<0?C.K:C.V,`opacity="${.3+.7*Math.min(1,Math.abs(v)*3)}" ${chosen&&input.start+k===input.coordinate?'data-coordinate=""':''}`);});
      art+=pick(`embed:${i}`,`Input sum for ${words[i]}, coordinates ${input.start+1} to ${input.start+4}: ${vector(vals)}`,rect(95,yy-12,67,24,'transparent',`class="outline"`)+row,-1);
      for(let j=0;j<3;j++){
        const role=roles[j],selected=i===(j===0?reader:source), yy2=routeY(j,i);
        const d=`M162,${yy} C184,${yy} 183,${yy+(j-1)*11} 209,${yy+(j-1)*11} C243,${yy+(j-1)*11} 254,${yy2} 298,${yy2}`;
        art+=route(d,C[role],selected?4:1.8,selected?.86:.25,`role:${j}:${i}`,`${role} projection of ${words[i]}`,selected?['2','3',''][j]:'');
      }
      const junction=647;
      art+=line(curve(605,my(i),junction,headY(i)),C.accent,chosen?3:1.5,chosen?.8:.24,chosen?'data-beats="4"':'')
        +line(curve(junction,headY(i),683,headY(i)),C.V,chosen?5:2,chosen?.9:.25);
      art+=line(curve(681,yy-5,764,yy-2),C.accent,7,chosen?.42:.17)
        +line(curve(681,yy+5,764,yy+2),C.muted,7,chosen?.42:.17)
        +line(curve(765,yy,794,yy),C.ink,3,chosen?.62:.20,chosen?'data-beats="6"':'');
      art+=line(curve(800,yy,876,yy),C.input,7,chosen?.70:.25,chosen?'data-beats="7"':'')
        +line(curve(872,yy,936,yy),C.input,10,chosen?.35:.14)
        +line(curve(936,yy,1081,yy),C.accent,7,chosen?.32:.12)
        +line(curve(1073,yy,1129,yy),C.accent,5,chosen?.60:.19,chosen?'data-beats="8"':'');
      const bypass=`M804,${yy} C824,${yy} 825,${yy-18} 846,${yy-18} H925 C949,${yy-18} 948,${yy} 966,${yy}`;
      art+=line(bypass,C.muted,1.2,chosen?.65:.22);
      const mixCells=[head,otherHead()].map((hi,j)=>block.heads[hi].output[i].map((n,k)=>rect(685+k*10,yy+(j===0?-9:2),8,7,j===0?C.accent:C.muted,`opacity="${.3+.65*Math.min(1,Math.abs(n))}"`)).join('')).join('');
      art+=pick(`join:${i}`,`Heads ${head+1} and ${otherHead()+1} shown; all 12 combined at ${words[i]}`,rect(680,yy-12,53,25,'transparent','class="outline"')+mixCells,-1);
      for(const x of [793,965])art+=`<circle cx="${x}" cy="${yy}" r="6" fill="${C.paper}" stroke="${C.line}"/>`+txt(x,yy+3.6,'+','caption','middle');
      let neurons='';block.activated[i].forEach((v,n)=>{neurons+=rect(870+(n%8)*6,yy-8+Math.floor(n/8)*9,5,7,v>0?C.input:C.line,`opacity="${v>0?.45+.55*Math.min(1,v):.5}"`);});
      art+=pick(`mlp:${i}`,`First 16 of 3,072 feed-forward activations at ${words[i]}`,rect(865,yy-13,57,26,'transparent','class="outline"')+neurons,-1);
      art+=pick(`block:${i}`,`Inspect the output of block 12 at ${words[i]}`,rect(1023,yy-11,49,22,C.pale,`class="outline" stroke="${C.line}"`)+pass.last[i].map((v,j)=>rect(1027+j*5,yy-5,4,10,C.accent,`opacity="${.12+.83*Math.min(1,Math.abs(v))}"`)).join(''),-1);
    }
    const qy=routeY(0,reader),ky=routeY(1,source);
    for(let j=0;j<3;j++){
      const r=j===0?reader:source, role=roles[j];
      art+=pick(`role:${j}:${r}`,`Inspect ${role} of ${words[r]}`,rect(294,routeY(j,0)-17,75,46,C.paper,`class="outline" stroke="${C[role]}"`)+txt(300,routeY(j,0)-5,`${role} · ${words[r]}`,'role-label'));
      for(const [i,values] of h[roleKey[j]].entries()){
        const yy=routeY(j,i);
        art+=pick(`role:${j}:${i}`,`${role} of ${words[i]}, position ${i+1}: ${vector(values)}`,
          rect(295,yy-2.4,73,4.8,i===r?C[role]:'transparent',`fill-opacity=".15" class="outline"`)+
          values.map((v,k)=>rect(303+k*14,yy-1.85,11,3.7,C[role],`opacity="${(i===r?1:.55)*(.15+.8*Math.min(1,Math.abs(v)/1.5))}"`)).join(''),-1);
      }
    }
    art+=route(curve(368,qy,459,my(reader)),C.Q,3.5,.86,`role:0:${reader}`,`Query from ${words[reader]} enters row ${reader+1}`);
    art+=route(`M369,${ky} C406,${ky} 411,88 ${px(source)-17},88 Q${px(source)},88 ${px(source)},102 V135`,C.K,3.5,.84,`role:1:${source}`,`Key from ${words[source]} selects source column ${source+1}`);
    for(let r=0;r<words.length;r++){
      if(r===reader)art+=rect(407,my(r)-9,44,18,C.paper);
      if(r===source)art+=rect(px(r)-7,109,14,18,C.paper);
      art+=txt(449,my(r)+4,words[r],'caption','end');
      art+=txt(px(r),123,String(r+1),'caption','middle');
      for(let s=0;s<words.length;s++){
        const weight=h.weights[r][s],masked=s>r,sel=r===reader&&s===source;
        const cx=px(s),cy=my(r),cell=rect(cx-10,cy-10,20,20,r===reader&&!masked?C.highlight:C.pale,`class="outline" stroke="${sel?C.accent:C.line}" stroke-width="${sel?2:0.5}"`);
        const glyph=masked?line(`M${cx-3},${cy+3}L${cx+3},${cy-3}`,C.muted,1,.4):`<circle cx="${cx}" cy="${cy}" r="${2+7*Math.sqrt(weight)}" fill="${C.accent}" opacity="${.18+.78*Math.sqrt(weight)}"/>`;
        art+=pick(`cell:${r}:${s}`,`${words[r]} reads ${words[s]}: ${masked?'future position, masked':pct(weight)}`,cell+glyph,sel?0:-1);
      }
    }
    art+=txt(522,291,'Circle area increases with share','caption','middle');
    // These ribbons aggregate value vectors, not keys. Width encodes the true row weight.
    for(const i of [...words.keys()].filter(i=>i!==source).concat(source)){
      const w=h.weights[reader][i];if(!w)continue;
      const by=314+i*6;
      const d=`M368,${routeY(2,i)} C402,${routeY(2,i)} 394,${by} 445,${by} H552 C624,${by} 609,${headY(reader)} 647,${headY(reader)}`;
      art+=route(d,C.V,1+13*w,i===source?.92:.23,`value:${i}`,`${words[i]} → ${words[reader]}: ${pct(w)} of this head's mixture`,i===source?'0 5':'');
    }
    art+=`<circle cx="647" cy="${headY(reader)}" r="8" fill="${C.paper}" stroke="${C.V}" pointer-events="none"/>`+txt(647,headY(reader)+4,'Σ','label','middle');
    if(source<=reader){
      art+=line(`M496,${314+source*6+5} V365`,C.V,1.2,.8,'stroke-dasharray="2 4" pointer-events="none"');
      art+=pick(`value:${source}`,`Inspect what ${words[source]} sends to ${words[reader]}`,rect(385,365,222,30,C.paper,`class="outline" stroke="${C.V}"`)+txt(496,385,`${words[source]} → ${words[reader]}  ·  ${pct(h.weights[reader][source])}  ↗`,'label','middle'));
    }
    const py=i=>91+36*i;
    const dTo=i=>curve(1127,ry,1212,py(i));
    out.forEach((v,i)=>{
      const selected=v.id===rank;
      const d=dTo(i);
      art+=line(d,C.accent,1+14*v.p,selected?.75:.18,selected?'data-beats="9"':'');
      art+=pick(`out:${v.id}`,`Next token ${v.word}: ${pct(v.p)}. Up or down arrow to inspect another candidate.`,rect(1212,py(i)-13,174,26,selected?C.highlight:C.paper,'class="outline"')+txt(1218,py(i)+4,v.word,'label')+
        rect(1284,py(i)-3,45,6,C.line)+rect(1284,py(i)-3,45*v.p/out[0].p,6,C.accent)+txt(1381,py(i)+4,pct(v.p),'caption','end'),selected?0:-1);
    });
    art+=txt(1300,377,'Bar scale: longest = top candidate','caption','middle');
    graph.innerHTML=art+inputInset();lens.bind();
    headers=[...graph.querySelectorAll('[data-key^="step:"]')].map(el=>{
      const title=el.querySelector('.heading'),sub=el.querySelector('.subhead');
      return {el,title,sub,name:title.textContent,description:sub.textContent};
    });
  }
  function narrate(){
    const h=selectedHead(), w=words[reader], s=words[source],v=h.value[source],q=h.query[reader],k=h.key[source];
    const weight=h.weights[reader][source],out=sorted(),pred=out.find(x=>x.id===(output??out[0].id));
    const chosen=3,contrib=weight*v[chosen],raw=h.rawScores[reader][source];
    const rows=(...r)=>`<div class="strips">${r.join('')}</div>`;
    const texts=[
      [`How does information from “${s}” reach “${w}”?`,
       `Find “${w}” on the left. At first its row knows only the word and its position. Follow the blue line: this is the question that row asks. The red line brings a possible match from “${s}”. Compared with all the allowed matches, this one earns a share. That share sets the width of the green ribbon. Click its label to see what it carries, or choose Next to start with the input.`,
       'Attention is not a next-word prediction',`When “${safe(w)}” gathers information, this head gives “${safe(s)}” <strong>${pct(weight)}</strong> of its attention. When the whole model guesses the next word, its leading candidate is <strong>“${safe(out[0].word)}” (${pct(out[0].p)})</strong>.`,
       'These are two different distributions. One divides attention over allowed token positions. The other divides probability over 50,257 vocabulary entries. A head’s share is not proof of which noun a pronoun refers to.'],
      null,
      ['The query says what would be useful to find.',
       `The blue path starts at “${w}”. First, LayerNorm centers and rescales this row. A learned projection reads all 768 normalized coordinates to make this head’s 64-number query. Think of a search phrase: it describes what would match, but it is not the content you hope to get back.`,
       `Query of “${w}”: first 4 of 64 coordinates`,rows(strip('Query',q,chosen)),
       `Each output coordinate is a dot product with a learned column, plus its bias. The same parameters are used at every position. Coordinate 4 of this query is ${fmt(q[3])}.`],
      ['Match the catalog entry, not the contents of the book.',
       `The red path starts at “${s}”. Its key is made with a different matrix from the query. The query from “${w}” is compared with this key, feature by feature. Every word makes a query, key and value. The two highlighted paths show which two roles are being compared right now.`,
       `Q of “${w}” against K of “${s}”: first 4 of 64`,rows(strip('Query',q,chosen),strip('Key',k,chosen)),
       `The first product is ${fmt(q[0])} × ${fmt(k[0])} ≈ ${fmt(q[0]*k[0])}. Sum all 64 products, including the 60 not drawn, to get ${fmt(raw)}.`],
      ['One row divides one attention budget.',
       `Read across the matrix row marked “${w}”. Each circle stands for the share an allowed source earns. Slashes are future positions: this token may not read them. Select another cell to inspect a different pair. Even a large circle is not a choice of the next word.`,
       `${w} reads ${s}: ${pct(weight)}`,formula(`dot product ${fmt(raw)} ÷ √64 ≈ ${fmt(raw/8)}`),
       `The allowed scores on this row, after scaling, are ${vector(h.rawScores[reader].slice(0,reader+1).map(s=>s/8))}. Softmax exponentiates and normalizes them together. “${s}” receives ${pct(weight)}. Future positions are excluded before normalization.`],
      ['What comes back is a value, not a key.',
       `Follow the green ribbon from “${s}” to “${w}”. The key helped earn ${pct(weight)} of the budget. The value supplies the 64 numbers that travel with that share. Multiply each value coordinate by the share, then sum across sources. Four coordinates are visible below.`,
       `Contribution of “${s}” to feature 4`,formula(`${fmt(weight,5)} × ${fmt(v[chosen])} ≈ ${fmt(contrib,5)}`)+rows(strip('Source V',v,chosen),strip('All mixed',h.output[reader],chosen)),
       `At coordinate 4, the contributions are ${h.weights[reader].slice(0,reader+1).map((a,i)=>fmt(a*h.value[i][chosen],5)).join(' + ')} ≈ ${fmt(h.output[reader][chosen],5)}. A large share alone does not guarantee a large contribution: it multiplies the actual source value.`],
      ['Twelve heads read the same rows differently.',
       `Try another head above. Its projections produce different circles and ribbons, but the vocabulary bars stay still: you changed which head you inspected, not which heads GPT-2 used. All twelve outputs sit side by side, 12 × 64 = 768 numbers. A projection mixes those numbers and its update is added to the original input row.`,
       `Two of 12 heads at “${w}”, first four coordinates`,rows(...[head,otherHead()].map(i=>strip(`Head ${i+1}`,block.heads[i].output[reader],null))),
       `For coordinate 1 the residual sum is ${fmt(pass.input[reader][0])} + ${fmt(block.attentionProjection[reader][0])} ≈ ${fmt(block.attentionResidual[reader][0])}.`],
      ['Now work on the information this row has gathered.',
       `Attention brought information across seats. The feed-forward network works within one seat. It normalizes a row, expands 768 coordinates to 3,072 and applies GELU, a smooth nonlinearity. The tiles show the first 16 activations. A second projection returns to 768 coordinates for the residual addition.`,
       `MLP at “${w}”, first four coordinates`,rows(strip('Before',block.attentionResidual[reader],0),strip('Update',block.contracted[reader],0),strip('After',block.output[reader].slice(0,4),0)),
       `For hidden unit 1 the affine expansion gives ${fmt(block.expanded[reader][0])}; GPT-2’s GELU gives ${fmt(block.activated[reader][0])}. The return projection uses all 3,072 activations. Its coordinate-1 update is ${fmt(block.contracted[reader][0])}.`],
      ['The next block starts with the row the previous one finished.',
       `Block 2 receives the contextual rows from block 1. It repeats the operations with its own learned weights. The map folds blocks 2 through 12 into one column, but none are skipped in the saved calculation.`,
       `At “${w}”, first four coordinates`,rows(strip('Block 1',block.output[reader].slice(0,4),0),strip('Block 12',pass.last[reader].slice(0,4),0)),
       `After block 12, the first eight coordinates are ${vector(pass.last[reader])}. A final LayerNorm prepares the row for the vocabulary projection.`],
      ['The destinations on the right are possible next tokens.',
       `After “${w}”, GPT-2 scores 50,257 possible next tokens. The eight bars shown are the most likely, with probabilities from the full softmax. They need not add to 100%. Click one to inspect it without appending it.`,
       `Candidate: ${pred.word}`,formula(`logit ${fmt(pred.logit)} → probability ${pct(pred.p)}`),
       `GPT-2 reuses the token embedding table here: dot the final normalized row with each vocabulary row. The highest-scoring continuation is “${out[0].word}” (${pct(out[0].p)}). The top eight together have ${pct(out.reduce((a,t)=>a+t.p,0))} of the mass.`]
    ];
    if(stage===4&&source>reader)texts[4]=['This route is closed.',
      `“${w}” is at position ${reader+1}. “${s}” is at position ${source+1}, which is still in its future. The model can compute a dot product for these two rows, but the causal mask excludes it before shares are assigned. There is no green ribbon from that future source to this reader.`,
      `Masked: position ${source+1} is after ${reader+1}`,formula(`scaled score ${fmt(raw/8)} → masked score −∞ → share 0%`),
      'The exponential of negative infinity is zero. Multiplying the source value by that zero leaves every feature of its contribution at zero. A score of zero would not do the same thing: its exponential would be one.'];
    const inside=stage===1;
    const before=inside?input.present({pass,reader,example}):(texts[stage]||['','']);
    const [title,story,measureTitle,measure]=inside&&input.part===1?before:tour(stops[index()],{pass,traces:data.traces,r:reader,s:source,head,example,col:input.coordinate,output},before);
    $('traceLabel').textContent=inside?[
      `Find “${w}” at place ${reader+1}. Follow this row across the graph.`,
      `On the “${w}” row, follow the token ID to its learned value.`,
      `Same “${w}” row, different lookup: follow place ${reader+1} to its learned value.`,
      `Follow the + on the “${w}” row. Its sum feeds all three projections.`
    ][input.part]:source>reader?`No route from “${s}” to “${w}”.`:`Trace the path from “${s}” to “${w}”.`;
    $('step').textContent=inside?`Inputs · ${input.part+1} of 4 · ${input.label}`:`${index()+1} of ${stops.length} · ${stages[stage]}`;
    $('deeper').querySelector('summary').textContent=inside&&input.part===0?'Inspect the token IDs':'Look closer at the calculation';
    $('guideTitle').textContent=title;$('story').textContent=story;$('measureTitle').textContent=measureTitle;$('measure').innerHTML=measure;
    $('math').replaceChildren();
    $('back').disabled=stage===0;$('next').textContent=stage===last?'Replay':'Next →';
    $('next').title=stage===last?'Replay from overview':`Next: ${inside?input.next??'Query':stages[stage+1]}`;
  }
  function render(move=false,restore=null){
    $('reader').value=reader;$('source').value=source;$('head').value=head;
    [...$('source').options].forEach((opt,i)=>{opt.disabled=i>reader;});
    $('example').value=example;$('sentence').textContent=pass.text;
    layout();stopMotion();$('tip').hidden=true;
    const key=[example,reader,source,head,input.coordinate,output].join(':');
    if(key!==sceneKey){draw();sceneKey=key;}
    const active=zone(),inside=stage===1;
    const shortNames=['Inputs','Projections','Self-attention','12 heads','Feed-forward','Blocks','Prediction'];
    const shortNotes=['Token + position','Q · K · V','Causal matrix','Join and add','Norm · GELU','2 to 12','Top 8 candidates'];
    headers.forEach(({el,title,sub,name,description},i)=>{
      const compact=active>=0&&i!==active;
      el.setAttribute('aria-current',i===active?'step':'false');
      title.textContent=compact?shortNames[i]:name;
      sub.textContent=compact?shortNotes[i]:inside&&i===0?`${input.label} · ${words[reader]} at place ${reader+1}`:description;
    });
    const inset=graph.querySelector('[data-inset]');inset.setAttribute('aria-hidden',String(!inside));inset.style.pointerEvents=inside?'auto':'none';
    inset.querySelector('.subhead').textContent=inside&&input.part===1?`SHOWING COORDINATE ${input.coordinate+1} OF 768`:`TWO LOOKUPS · COORDINATE ${input.coordinate+1}`;
    inset.querySelectorAll('[data-part]').forEach(el=>{
      const part=Number(el.dataset.part);
      el.toggleAttribute('data-lit',inside&&(input.part===part||input.part===3));
      el.setAttribute('tabindex',inside?'0':'-1');
    });
    graph.querySelector('[data-coordinate]').toggleAttribute('data-picked-tile',inside&&input.part===3);
    lens.to(active,move,move&&stage!==1?travel:null);
    narrate();syncPlace();
    if(restore){
      const target=graph.querySelector(`[data-key="${restore}"][tabindex="0"]`)||graph.querySelector(`[data-key="${restore}"]`);
      target?.focus({preventScroll:true});
    }
  }
  function choose(key,keyboard=false,backward=false){
    const [type,a,b]=key.split(':'),i=Number(a);let nextStage;
    if(type==='step')nextStage=i;
    else if(type==='lookup'){input.setPart(i);nextStage=1;}
    else if(type==='cell'){reader=i;source=Number(b);nextStage=4;}
    else if(type==='role'){
      if(i===0){reader=Number(b);source=bestSource(reader);}
      else{source=Number(b);if(source>reader)reader=source;}
      nextStage=[2,3,5][i];
    }else if(type==='value'){source=i;nextStage=5;}
    else if(type==='out'){output=i;nextStage=9;}
    else {reader=i;source=bestSource(reader);nextStage={read:stage===1?1:0,embed:1,join:6,mlp:7,block:8}[type];}
    if(nextStage===1){
      if(type==='embed')input.setPart(3);
      else if(type==='step')input.setPart(backward?3:0);
    }
    stage=nextStage;if(stage!==9)output=null;
    // A masked cell can be inspected but never becomes a source for a subsequent operation.
    if(stage!==4&&source>reader)source=bestSource(reader);
    render(true,keyboard?key:null);
  }
  function options(){const opts=words.map((s,i)=>`<option value="${i}">${i+1}. ${s}</option>`).join('');$('reader').innerHTML=opts;$('source').innerHTML=opts;}
  function setExample(name){
    if(name===example)return;
    if(name==='restore'){({example,reader,source}=prior);prior=null;}
    else{
      if(name==='repeat'){prior={example,reader,source};reader=4;source=1;}
      else if(example==='base'&&name==='split'){reader+=Number(reader>=1);source+=Number(source>=1);}
      else if(example==='split'&&name==='base'){reader-=Number(reader>=2);source-=Number(source>=2);}
      else {reader=1;source=0;}
      example=name;
    }
    pass=data.traces[example];block=pass.block;words=pass.pieces.map(s=>s.trim());output=null;options();
  }
  function changeView(key,val){
    const i=Number(val);
    if(key==='example')setExample(val);
    else if(key==='reader'){reader=i;if(source>reader)source=bestSource(reader);output=null;}
    else if(key==='source'||key==='cell')source=i;
    else if(key==='head')head=i;
    else if(key==='out')output=i;
    else if(key==='col'){if(!Number.isFinite(i))return;input.setCoordinate(Math.max(1,Math.min(768,Math.round(i)))-1);}
    else throw new Error(`Unknown lesson control: ${key}`);
    if(stage!==4&&source>reader)source=bestSource(reader);
    render();
  }
  options();
  $('head').innerHTML=block.heads.map((_,i)=>`<option value="${i}">Head ${i+1}</option>`).join('');
  $('example').onchange=e=>{setExample(e.target.value);render(true);};
  $('reader').onchange=e=>changeView('reader',e.target.value);
  $('source').onchange=e=>changeView('source',e.target.value);
  $('head').onchange=e=>changeView('head',e.target.value);
  // The step controls sit in the sticky map, so they can be pressed from deep in a
  // lesson. Bring the new lesson's opening back into view just below the map.
  function toLessonStart(){
    const plot=$('plot'),below=getComputedStyle(plot).position==='sticky'?plot.getBoundingClientRect().bottom:0,top=$('reading').getBoundingClientRect().top;
    if(top<below-1)scrollTo({top:scrollY+top-below-8,behavior:reduce.matches?'auto':'smooth'});
  }
  $('back').onclick=()=>{if(stage===1&&input.part>0){input.setPart(input.part-1);render();}else choose(`step:${Math.max(0,stage-1)}`,false,true);toLessonStart();};
  $('next').onclick=()=>{if(stage===1&&input.part<3){input.setPart(input.part+1);render();}
    else choose(`step:${(stage+1)%stages.length}`);toLessonStart();};
  graph.addEventListener('click',e=>{const g=e.target.closest('[data-key]');if(g)choose(g.dataset.key);});
  graph.addEventListener('keydown',e=>{
    const g=e.target.closest('[data-key]');if(!g)return;
    if(e.key==='Enter'||e.key===' '){e.preventDefault();choose(g.dataset.key,true);return;}
    if(g.dataset.key.startsWith('out:')&&['ArrowDown','ArrowUp'].includes(e.key)){
      const ranked=sorted(),idx=ranked.findIndex(v=>v.id===Number(g.dataset.key.slice(4)));
      e.preventDefault();choose(`out:${ranked[Math.max(0,Math.min(ranked.length-1,idx+(e.key==='ArrowDown'?1:-1)))].id}`,true);return;
    }
    if(!g.dataset.key.startsWith('cell:')||!e.key.startsWith('Arrow'))return;
    const [,row,col]=g.dataset.key.split(':').map(Number),clamp=n=>Math.max(0,Math.min(words.length-1,n));
    e.preventDefault();choose(`cell:${clamp(row+(e.key==='ArrowDown')-(e.key==='ArrowUp'))}:${clamp(col+(e.key==='ArrowRight')-(e.key==='ArrowLeft'))}`,true);
  });
  let hovered=null;
  function light(g){
    if(g===hovered)return;hovered=g;
    graph.querySelectorAll('.linked').forEach(el=>el.classList.remove('linked'));
    if(!g)return;
    const [type,a,b]=g.dataset.key.split(':');
    const src=type==='value'?Number(a):type==='cell'?Number(b):null;
    if(src===null)return;
    const dst=type==='cell'?Number(a):reader;
    const keys=[`cell:${dst}:${src}`,`role:0:${dst}`,`role:1:${src}`,`read:${src}`];
    if(src<=dst){keys.push(`role:2:${src}`);if(dst===reader)keys.push(`value:${src}`);}
    graph.querySelectorAll(keys.map(k=>`[data-key="${k}"]`).join(',')).forEach(el=>el.classList.add('linked'));
  }
  function hint(e){
    const g=e.target.closest('[data-tip]');light(g);if(!g){$('tip').hidden=true;return;}
    const tip=$('tip'),box=$('plot').getBoundingClientRect();tip.textContent=g.dataset.tip;tip.hidden=false;
    tip.style.left=Math.max(2,Math.min(box.width-tip.offsetWidth-4,e.clientX-box.left+12))+'px';
    tip.style.top=Math.max(2,Math.min(box.height-tip.offsetHeight-3,e.clientY-box.top+15))+'px';
  }
  graph.addEventListener('pointermove',hint);graph.addEventListener('pointerleave',()=>{light(null);$('tip').hidden=true;});
  graph.addEventListener('focusin',e=>light(e.target.closest('[data-tip]')));
  graph.addEventListener('focusout',()=>{light(null);$('tip').hidden=true;});
  const settle=()=>{stopMotion();lens.to(zone(),false);};
  reduce.addEventListener('change',settle);document.addEventListener('visibilitychange',()=>{if(document.hidden)settle();});
  $('work').hidden=false;$('loading').hidden=true;render();
}
mount().catch(error=>{$('work').hidden=true;$('loading').hidden=false;$('loading').textContent=`The graph could not open: ${error.message}. Use the local preview-server link.`;});
