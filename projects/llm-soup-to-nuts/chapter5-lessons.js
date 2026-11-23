// Lesson copy and pictures for the Chapter 5 walkthrough. Every number comes
// from the saved GPT-2 trace; anything hypothetical is labelled as a simulation.
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const f=(x,n=4)=>Number(x).toFixed(n),pct=x=>`${(100*x).toFixed(2)}%`,pct1=x=>`${(100*x).toFixed(1)}%`,sum=a=>a.reduce((x,y)=>x+y,0);
const piece=s=>esc(s.replace(/^ /,'␣'));
const tok=s=>{const t=s.replace(/\n/g,'↵');return esc(t.trim()||t);};
const trunc=(s,n)=>s.length>n?s.slice(0,n-1)+'…':s;
const CH3=location.pathname.includes('/tmp/')?'../personal-site/projects/llm-soup-to-nuts/chapter-3.html':'chapter-3.html';
const btn=(key,label,on)=>`<button type="button" data-tour="${key}"${on==null?'':` aria-pressed="${on}"`}>${label}</button>`;
const tools=(...items)=>`<div class="lesson-tools">${items.join('')}</div>`;
const select=(key,label,items,value)=>`<label>${label} <select data-field="${key}">${items.map(([k,v])=>`<option value="${k}"${k===value?' selected':''}>${v}</option>`).join('')}</select></label>`;
const formula=s=>`<p class="equation numbers">${s}</p>`;
const table=(heads,rows,cls='')=>`<table class="lesson-ledger ${cls}"><thead><tr>${heads.map(s=>`<th scope="col">${s}</th>`).join('')}</tr></thead><tbody>${rows.map(a=>`<tr${a.hot?' class="is-row"':''}><th scope="row">${a[0]}</th>${a.slice(1).map(s=>`<td>${s}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
const bar=(label,v,color='accent')=>`<div class="budget-row"><span>${label}</span><span class="budget-track"><i style="width:${(100*Math.max(0,Math.min(1,v))).toFixed(2)}%;background:var(--cp-${color})"></i></span><b>${pct(v)}</b></div>`;
const fig=(title,body,caption='')=>`<figure class="lesson-figure">${title?`<h4>${title}</h4>`:''}${body}${caption?`<figcaption>${caption}</figcaption>`:''}</figure>`;
const two=(a,b)=>`<div class="two-up">${a}${b}</div>`;
const sec=(title,html)=>`<section class="lesson-sec"><h3>${title}</h3>${html}</section>`;
const callout=html=>`<div class="callout">${html}</div>`;
const note=html=>`<p class="lesson-note">${html}</p>`;
const bridge=html=>`<p class="bridge">${html}</p>`;
const steps=items=>`<ol class="lesson-steps">${items.map(s=>`<li>${s}</li>`).join('')}</ol>`;
const svg=(label,inner,w=480,h=158)=>`<svg class="lesson-plot${w>=600?' wide':''}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label)}">${inner}</svg>`;
const text=(x,y,t,anchor='start',cls='')=>`<text x="${(+x).toFixed(1)}" y="${(+y).toFixed(1)}" text-anchor="${anchor}"${cls?` class="${cls}"`:''}>${esc(t)}</text>`;
const line=(x,y,xx,yy,color='border-strong',w=2,extra='')=>`<line x1="${(+x).toFixed(1)}" y1="${(+y).toFixed(1)}" x2="${(+xx).toFixed(1)}" y2="${(+yy).toFixed(1)}" stroke="var(--cp-${color})" stroke-width="${w}"${extra}/>`;
const dot=(x,y,color='accent',r=5)=>`<circle cx="${(+x).toFixed(1)}" cy="${(+y).toFixed(1)}" r="${r}" fill="var(--cp-${color})"/>`;
const sign=v=>v<0?'danger':'success';
function arrow(x1,y1,x2,y2,color,w=3){
  const a=Math.atan2(y2-y1,x2-x1),L=11,s=5.5,bx=x2-L*Math.cos(a),by=y2-L*Math.sin(a),px=-Math.sin(a)*s,py=Math.cos(a)*s;
  return line(x1,y1,bx,by,color,w)+`<polygon points="${f(x2,1)},${f(y2,1)} ${f(bx+px,1)},${f(by+py,1)} ${f(bx-px,1)},${f(by-py,1)}" fill="var(--cp-${color})"/>`;
}
function quiz(question,options){
  return `<div class="quiz" role="group" aria-label="Quick check"><p class="quiz-q"><span class="quiz-tag">Quick check</span> ${question}</p>
    <div class="quiz-opts">${options.map(([label,ok,fb])=>`<button type="button" data-answer="${ok?1:0}" data-fb="${esc(fb)}" aria-pressed="false">${label}</button>`).join('')}</div>
    <p class="quiz-fb" aria-live="polite"></p></div>`;
}
const seats=c=>c.pass.pieces.map((w,i)=>[i,`${i+1}. ${piece(w)}`]);
const readerPick=c=>select('reader','Reading at',seats(c),c.r);
const sourcePick=c=>select('source','Compare with',seats(c).slice(0,c.r+1),c.s);
const headPick=c=>select('head','Head',Array.from({length:12},(_,i)=>[i,i+1]),c.head);
const choices=(k,n,sel,label='Coordinate')=>select(k,label,Array.from({length:n},(_,i)=>[i,i+1]),sel);
export const stops=['overview','tokens','embedding','position','add','query','key','attention','values','heads','mlp','blocks','prediction','generate','practice'];
export const stopNames=['Overview','Tokens','Token embedding','Position embedding','Add the rows','Query','Key','Attention','Value mixture','Combine heads','Feed-forward','Blocks 2 to 12','Prediction','Write the next word','Check yourself'];

// ---------- pictures ----------
// Wide screens get a wider drawing canvas, so charts can fill the page
// without blowing their labels up to poster size.
let WIDE=true;
const canvas=(narrow=480)=>WIDE?960:narrow;
function strips(label,rows,n=24,shared=true,floor=0,half=false){
  const W=half?480:canvas(),x0=112,H=46,bw=(W-x0-6)/n,maxOf=v=>Math.max(...Array.from(v.slice(0,n),Math.abs),floor,1e-9),M=Math.max(...rows.map(r=>maxOf(r.values)));
  const body=rows.map((row,k)=>{
    const y=12+k*H+H/2,m=shared?M:maxOf(row.values);
    return text(4,y+5,row.label,'start','ts')+line(x0,y,W-4,y,'border',1)+Array.from(row.values.slice(0,n)).map((v,i)=>{
      const h=(H/2-5)*v/m;
      return `<rect x="${f(x0+i*bw+.8,1)}" y="${f(h>0?y-h:y,1)}" width="${f(Math.max(1,bw-1.6),1)}" height="${f(Math.max(.6,Math.abs(h)),1)}" fill="var(--cp-${sign(v)})"${row.hot===i?' stroke="var(--cp-text)" stroke-width="1.5"':''}/>`;
    }).join('');
  }).join('');
  return svg(label,body,W,rows.length*H+22);
}
function fingerprint(rows,sel,n=48){
  const W=canvas(),x0=70,cw=(W-x0-4)/n,ch=16,gap=5,m=Math.max(...rows.flatMap(r=>Array.from(r.slice(0,n),Math.abs)));
  const body=rows.map((row,i)=>{
    const y=24+i*(ch+gap);
    return text(4,y+12,`Seat ${i+1}`,'start',i===sel?'ts tb':'ts')+Array.from(row.slice(0,n)).map((v,j)=>`<rect x="${f(x0+j*cw,1)}" y="${y}" width="${f(cw-.6,1)}" height="${ch}" fill="var(--cp-${sign(v)})" opacity="${f(.08+.92*Math.sqrt(Math.abs(v)/m),2)}"/>`).join('')
      +(i===sel?`<rect x="${x0-2}" y="${y-2}" width="${f(cw*n+3,1)}" height="${ch+4}" fill="none" stroke="var(--cp-text)" stroke-width="1.5"/>`:'');
  }).join('');
  return svg('Each seat has its own pattern of position numbers',text(x0,15,'coordinate 1','start','ts tm')+text(W-4,15,String(n),'end','ts tm')+body,W,24+rows.length*(ch+gap)+6);
}
function searchPicture(c){
  const {pass,r,h}=c,n=pass.pieces.length,w=h.weights[r],W=canvas(640),mid=W/2,gap=(W-40)/n,X=i=>20+gap*(i+.5),cw=Math.min(gap-12,120),hw=cw/2;
  let g=`<rect x="${f(X(r)-62,1)}" y="8" width="124" height="32" rx="6" fill="var(--cp-surface)" stroke="var(--cp-link)" stroke-width="2"/>`+text(X(r),29,`Q of “${trunc(pass.pieces[r].trim(),9)}”`,'middle','tq tb');
  for(let i=0;i<n;i++){
    const open=i<=r,x=X(i);
    if(open)g+=`<path d="M${f(X(r),1)} 40 C${f(X(r),1)} 88 ${f(x,1)} 86 ${f(x,1)} 128" fill="none" stroke="var(--cp-link)" stroke-width="${f(1+7*w[i],1)}" opacity="${f(.25+.75*Math.sqrt(w[i]),2)}"/>`
      +`<path d="M${f(x,1)} 226 C${f(x,1)} 262 ${mid} 250 ${mid} 282" fill="none" stroke="var(--cp-success)" stroke-width="${f(1+16*w[i],1)}" opacity="${f(.3+.7*Math.sqrt(w[i]),2)}"/>`;
    g+=`<g opacity="${open?1:.35}"><rect x="${f(x-hw,1)}" y="128" width="${f(cw,1)}" height="28" rx="5" fill="var(--cp-surface)" stroke="var(--cp-${open?'danger':'border-strong'})" stroke-width="2"/>`
      +text(x,147,open?`K ${pct1(w[i])}`:'future','middle',open?'tk ts tb':'ts tm')
      +`<rect x="${f(x-hw,1)}" y="162" width="${f(cw,1)}" height="30" rx="5" fill="var(--cp-surface-soft)" stroke="var(--cp-border-strong)"/>`+text(x,182,trunc(pass.pieces[i].trim(),9),'middle',i===r?'tb':'')
      +`<rect x="${f(x-hw,1)}" y="198" width="${f(cw,1)}" height="28" rx="5" fill="var(--cp-surface)" stroke="var(--cp-${open?'success':'border-strong'})" stroke-width="2"/>`+text(x,217,'V','middle',open?'tv tb':'tm')+'</g>';
  }
  g+=`<rect x="${mid-150}" y="282" width="300" height="34" rx="6" fill="var(--cp-surface)" stroke="var(--cp-success)" stroke-width="2"/>`+text(mid,304,`the blend “${trunc(pass.pieces[r].trim(),9)}” collects`,'middle','tv tb');
  return svg(`One attention head searching from ${pass.pieces[r].trim()}`,g,W,324);
}
function libraryPicture(){
  const lines=(x,y,w)=>Array.from({length:4},(_,i)=>line(x,y+i*12,x+w-(i===3?20:0),y+i*12,'border-strong',2)).join('');
  return svg('A library: your search, a catalog card, and the book itself',
    text(105,22,'1. Query','middle','tq tb')+text(105,42,'what you are looking for','middle','ts tm')
    +`<rect x="20" y="78" width="170" height="36" rx="18" fill="var(--cp-surface)" stroke="var(--cp-link)" stroke-width="2"/><circle cx="42" cy="95" r="8" fill="none" stroke="var(--cp-link)" stroke-width="2.5"/>`+line(48,101,55,108,'link',2.5)+text(64,100,'feeding a cat','start','ts')
    +text(320,22,'2. Key','middle','tk tb')+text(320,42,'the catalog card','middle','ts tm')
    +`<rect x="245" y="60" width="150" height="72" rx="4" fill="var(--cp-surface)" stroke="var(--cp-danger)" stroke-width="2"/>`+text(257,82,'Cat Care 101','start','ts tb')+text(257,102,'pets, feeding, cats','start','ts tm')+text(257,121,'shelf 636.8','start','ts tm')
    +text(535,22,'3. Value','middle','tv tb')+text(535,42,'the book itself','middle','ts tm')
    +`<path d="M455 64 Q495 56 533 66 V136 Q495 126 455 134 Z M537 66 Q575 56 615 64 V134 Q575 126 537 136 Z" fill="var(--cp-surface)" stroke="var(--cp-success)" stroke-width="2"/>`+lines(465,82,58)+lines(547,82,58)
    +arrow(194,96,240,96,'text-soft',2)+text(217,84,'match?','middle','ts tm')+arrow(398,96,450,96,'text-soft',2)+text(424,84,'points to','middle','ts tm')
    +text(320,168,'You compare your search with catalog cards,','middle','ts')+text(320,188,'but the book is what you take home.','middle','ts'),640,200);
}
function dotSketch(){
  const panel=(cx,deg,a,b)=>{
    const ox=cx,oy=92,L=68,q=-25*Math.PI/180,k=deg*Math.PI/180,qx=ox+L*Math.cos(q),qy=oy+L*Math.sin(q),kx=ox+L*Math.cos(k),ky=oy+L*Math.sin(k);
    return arrow(ox,oy,qx,qy,'link',3)+arrow(ox,oy,kx,ky,'danger',3)+dot(ox,oy,'text-soft',3.5)+text(qx+8,qy+5,'Q','start','tq tb')+text(kx-4,ky-9,'K','end','tk tb')+text(cx,160,a,'middle','ts tb')+text(cx,178,b,'middle','ts tm');
  };
  return svg('Three sketches: same direction gives a big positive score, a right angle gives zero, opposite directions give a negative score',
    panel(107,-42,'same direction','big positive score')+panel(320,-115,'right angle','score near zero')+panel(533,155,'opposite directions','negative score'),640,188);
}
function productsChart(products,k){
  const max=Math.max(...products.map(Math.abs),1e-5);
  const W=canvas(),sp=(W-28)/64;
  return svg('64 signed products in the query-key dot product',line(10,65,W-10,65)+products.map((v,i)=>line(14+sp*i,65,14+sp*i,65-49*v/max,sign(v),i===k?6:3)).join('')+text(12,134,'1','start','ts tm')+text(W/2,134,'coordinate','middle','ts tm')+text(W-12,134,'64','end','ts tm'),W,142);
}
function scoresChart(c,raw){
  const {pass,s}=c,W=canvas(),lo=Math.min(0,...raw),hi=Math.max(0,...raw),X=v=>120+(W-180)*(v-lo)/(hi-lo||1),rowH=26;
  const g=raw.map((v,i)=>{const y=12+i*rowH;
    return text(4,y+13,`${i+1}. ${trunc(pass.pieces[i].trim(),9)}`,'start',i===s?'ts tb':'ts')+`<rect x="${f(Math.min(X(0),X(v)),1)}" y="${y+2}" width="${f(Math.max(1,Math.abs(X(v)-X(0))),1)}" height="14" fill="var(--cp-${sign(v)})" opacity="${i===s?1:.5}"/>`+text(W-4,y+14,f(v,2),'end','ts');
  }).join('')+line(X(0),6,X(0),12+raw.length*rowH,'text-soft',1.5)+text(X(0),raw.length*rowH+28,'0','middle','ts tm');
  return svg('Raw query-key scores for every visible token',g,W,raw.length*rowH+34);
}
function attentionGrid(c){
  const {pass,r,s,h}=c,n=pass.pieces.length,cs=Math.min(44,330/n),x0=118,y0=34;
  let g='';
  for(let j=0;j<n;j++)g+=text(x0+cs*(j+.5),y0-10,String(j+1),'middle','ts tm');
  for(let i=0;i<n;i++){
    const y=y0+cs*i;
    if(i===r)g+=`<rect x="2" y="${f(y,1)}" width="${f(x0+cs*n,1)}" height="${f(cs,1)}" fill="var(--cp-accent-soft)"/>`;
    g+=text(8,y+cs/2+4,`${i+1}. ${trunc(pass.pieces[i].trim(),9)}`,'start',i===r?'ts tb':'ts');
    for(let j=0;j<n;j++){
      const x=x0+cs*j,v=h.weights[i][j];
      g+=j>i?`<rect x="${f(x+1,1)}" y="${f(y+1,1)}" width="${f(cs-2,1)}" height="${f(cs-2,1)}" fill="var(--cp-surface-soft)"/>`+line(x+cs*.32,y+cs*.68,x+cs*.68,y+cs*.32,'border-strong',1)
        :`<rect x="${f(x+1,1)}" y="${f(y+1,1)}" width="${f(cs-2,1)}" height="${f(cs-2,1)}" fill="none" stroke="var(--cp-border)"/><circle cx="${f(x+cs/2,1)}" cy="${f(y+cs/2,1)}" r="${f(1.5+(cs/2-4)*Math.sqrt(v),1)}" fill="var(--cp-accent)" opacity="${f(.3+.7*Math.sqrt(v),2)}"/>`;
      if(i===r&&j===s)g+=`<rect x="${f(x,1)}" y="${f(y,1)}" width="${f(cs,1)}" height="${f(cs,1)}" fill="none" stroke="var(--cp-text)" stroke-width="2"/>`;
    }
  }
  return svg('Attention grid: rows read, columns are read, the future is greyed out',g,480,y0+cs*n+8);
}
function hourglass(){
  return svg('The feed-forward network expands 768 numbers to 3,072, bends them, shrinks back to 768, and adds the result to the original row',
    `<path d="M54 100 V30 H590 V128" fill="none" stroke="var(--cp-text-soft)" stroke-width="1.6" stroke-dasharray="5 5"/>`+text(320,22,'bypass: the original row','middle','ts tm')
    +`<polygon points="68,102 262,52 262,228 68,176" fill="var(--cp-link)" opacity=".15"/><polygon points="290,52 484,102 484,176 290,228" fill="var(--cp-warning)" opacity=".15"/>`
    +`<rect x="40" y="100" width="28" height="78" rx="4" fill="var(--cp-link)" opacity=".75"/><rect x="262" y="50" width="28" height="180" rx="4" fill="var(--cp-warning)" opacity=".85"/><rect x="484" y="100" width="28" height="78" rx="4" fill="var(--cp-success)" opacity=".75"/>`
    +text(54,198,'768','middle','ts tb')+text(276,248,'3,072 detectors','middle','ts tb')+text(498,198,'768','middle','ts tb')
    +text(166,144,'1. expand','middle','ts')+text(386,144,'3. shrink','middle','ts')+text(276,44,'2. bend (GELU)','middle','ts')
    +line(512,138,580,138,'text-soft',2)+`<circle cx="590" cy="138" r="10" fill="var(--cp-surface)" stroke="var(--cp-text-soft)" stroke-width="2"/>`+text(590,143,'+','middle','tb')+arrow(600,138,634,138,'text-soft',2)+text(590,172,'4. add','middle','ts'),640,256);
}
function geluPlot(a,v){
  const gelu=x=>.5*x*(1+Math.tanh(Math.sqrt(2/Math.PI)*(x+.044715*x**3)));
  const range=Math.max(3,Math.ceil(Math.abs(a))),X=x=>35+410*(x+range)/(2*range),Y=y=>115-85*y/range;
  const path=Array.from({length:111},(_,i)=>{const x=range*(i/55-1);return `${i?'L':'M'}${f(X(x),1)},${f(Y(gelu(x)),1)}`;}).join('');
  return svg('GELU: input on the horizontal axis, output on the vertical axis',line(24,Y(0),465,Y(0))+line(X(0),12,X(0),136)+`<path d="${path}" fill="none" stroke="var(--cp-link)" stroke-width="3"/>`+dot(X(a),Y(v))+text(16,150,`−${range}`,'start','ts tm')+text(240,150,'input','middle','ts tm')+text(462,150,String(range),'end','ts tm')+text(X(0)+6,22,'output','start','ts tm'),480,158);
}
function depthGrid(c){
  const {pass,r,state}=c,n=pass.pieces.length,W=canvas(600),X=j=>118+((W-150)/12)*j,Y=i=>40+22*i;
  let g=`<rect x="${X(state.layer)-14}" y="26" width="28" height="${22*n+6}" fill="var(--cp-accent-soft)"/>`+text(X(0),20,'in','middle','ts tm');
  for(let j=1;j<=12;j++)g+=text(X(j),20,String(j),'middle','ts tm');
  for(let i=0;i<n;i++)g+=text(4,Y(i)+4,`${i+1}. ${trunc(pass.pieces[i].trim(),9)}`,'start',i===r?'ts tb':'ts')+line(X(0),Y(i),X(12),Y(i),i===r?'accent':'border',i===r?2:1);
  for(let j=1;j<=12;j++)for(let k=0;k<r;k++)g+=line(X(j-1),Y(k),X(j),Y(r),'accent',1,' opacity=".3"');
  for(let j=0;j<=12;j++)for(let i=0;i<n;i++)g+=dot(X(j),Y(i),i===r?'accent':'border-strong',i===r?4.5:3);
  return svg('Rows travel through twelve blocks; each block lets a row read earlier rows only',g,W,Y(n-1)+18);
}
function numberLine(e,p,x){
  const W=canvas(),lo=Math.min(0,e,x),hi=Math.max(0,e,x),X=v=>40+(W-80)*(v-lo)/(hi-lo||1);
  const walk=(a,b,y,color,label)=>arrow(X(a),y,X(b),y,color,4)+text(24,y-12,label,'start','ts');
  return svg('Adding two numbers as two walks along a number line',line(X(0),14,X(0),128,'text-soft',1.5)+text(X(0),144,'0','middle','ts tm')
    +walk(0,e,48,'link',`1. Token: from 0 to ${f(e,5)}`)+walk(e,x,100,'accent',`2. Seat: from there to ${f(x,5)}`),W,152);
}
// ---------- lessons ----------
function overview(c){
  const {pass,r,s,h,W,S,wt,st,head}=c,n=pass.pieces.length,top=pass.top[r],share=h.weights[r][s],pronoun=/ it$/.test(pass.text);
  const journey=`<ol class="journey">${[
    ['Text',`“${esc(pass.text)}”`],['Tokens',`${n} pieces, each with an ID`],['Rows of numbers',`${n} rows × 768 numbers`],
    ['12 blocks','rows share information, then think it over'],['The last row',`the row for “${W}”, fully updated`],['A guess',`“${tok(top[0].word)}” at ${pct1(top[0].p)}`]
  ].map(([t,d])=>`<li><b>${t}</b><span>${d}</span></li>`).join('')}</ol>`;
  const prev=r>0?pass.top[r-1].slice(0,3):null;
  const peek=prev?`<p>Here's a fun detail. One token earlier, right after “${tok(pass.pieces[r-1])}”, GPT-2's top three guesses were ${prev.map(a=>`“${tok(a.word)}” (${pct1(a.p)})`).join(', ')}. ${prev.some(a=>a.word===' she')&&prev.some(a=>a.word===' it')?'So the model itself was weighing up whether the reason would be about Sarah or about the cat! ':''}After “${W}”, its favourite is “${tok(top[0].word)}” at ${pct(top[0].p)}. By the end of this walkthrough you'll know exactly where that number came from.</p>`:'';
  return {
    lead:'Let’s open up a Transformer by following one guess',
    intro:pronoun?`<p>Read this with me: <b>“${esc(pass.text)} …”</b> What comes next? You probably have a few guesses already: <i>was hungry</i>, <i>kept meowing</i>, <i>looked sad</i>. And without even noticing, you decided that “it” is most likely the cat, not Sarah.</p><p>That tiny moment is our way into this chapter’s real subject: the <b>Transformer</b>, the architecture inside GPT-2 and nearly every LLM you’ve heard of. To make a good guess, a model has to do the same two things you just did: pull the right information from earlier words into “it”, and then turn everything it knows into a guess for the next word. Every part of a Transformer exists to do a piece of that work. Let’s watch a real model, GPT-2, do both, one step at a time, with its real numbers, and meet every part along the way.</p>`
      :`<p>Read this with me: <b>“${esc(pass.text)} …”</b> What comes next? To guess, you used every word you’d read so far, and you kept track of which cat was which without even trying.</p><p>A model has to do the same: pull information from earlier words into the current one, then turn what it knows into a guess. Every part of a <b>Transformer</b>, the architecture inside GPT-2 and nearly every LLM you’ve heard of, exists to do a piece of that work. Let’s watch GPT-2 do it one step at a time, with its real numbers, and meet every part along the way.</p>`,
    title:'How to read the map above',
    guide:`Every row on the map is one token, and the work flows from left to right. Find “${wt}” on the left and follow its row all the way to the bars on the right: those are GPT-2’s actual guesses for the next token.\n\nThe green ribbon shows information flowing from “${st}” into “${wt}”. You can click almost anything on the map. Or just press Next, and I’ll walk you through every stop.`,
    heading:'The whole Transformer on one page',
    body:`<p>Before we zoom in, here’s the trip our guess takes through the Transformer. Don’t worry if some of these words are new. Every one of them gets its own stop, with pictures and something you can poke at.</p>${journey}
      ${note('Every number in this walkthrough comes from one saved run of GPT-2 small, a model OpenAI released in 2019. It’s tiny by today’s standards, but the core recipe you’ll see here is the same one much bigger models still build on.')}
      ${sec('Two kinds of choosing (please don’t mix them up!)',`<p>Here’s something that confused me for a long time, so let me get it out of the way early. A Transformer makes two very different kinds of choices, and both of them show up as a list of percentages.</p>
        ${two(fig('Looking back: attention',h.weights[r].slice(0,r+1).map((v,i)=>bar(`${i+1}. ${piece(pass.pieces[i])}`,v,i===s?'success':'border-strong')).join(''),`While working on “${W}”, head ${head+1} splits its attention across the ${r+1} token${r?'s':''} it can see. “${S}” gets ${pct(share)}.`),
          fig('Looking ahead: prediction',top.slice(0,3).map(a=>bar(tok(a.word),a.p)).join('')+bar('everything else',1-sum(top.slice(0,3).map(a=>a.p)),'border-strong'),`At the very end, the model splits a different budget across all 50,257 tokens it knows. That’s its guess for what comes after “${W}”.`))}
        <p>See how the two lists don’t even contain the same things? The left one is about the sentence we already have. The right one is about a token that doesn’t exist yet. Attention helps “${W}” <em>understand</em> the sentence. The prediction is the model’s <em>answer</em>.</p>
        ${tools(headPick(c),readerPick(c))}
        ${note('Try switching the head. The left bars change, but the right bars stay frozen. Why? All twelve heads already did their work in the saved run. Picking a head only changes which one you’re looking at.')}`)}
      ${prev?sec('A sneak peek at the answer',peek):''}
      ${quiz(`While reading “${W}”, head ${head+1} gives “${S}” ${pct(share)} of its attention. What does that number tell you?`,[
        [`There’s a ${pct(share)} chance the next token is “${S}”.`,0,'Careful, that’s exactly the mix-up I warned about! Attention is spread over tokens already in the sentence, not over possible next tokens.'],
        [`This head blends in ${pct(share)} of its information from “${S}”.`,1,`Yes! It’s a mixing weight: how much of ${st}’s information this one head pulls into “${wt}”.`],
        [`The model is ${pct(share)} sure “${W}” refers to “${S}”.`,0,'Tempting, but no. It’s a mixing weight inside one head, not a confidence score about meaning. Lots of heads attend in ways that have nothing to do with what a word refers to.']])}
      ${bridge('Ready? Let’s start at the far left, where the text gets chopped into pieces. Press <b>Next</b>.')}`
  };
}
function tokens(c){
  const {pass,r,wt,traces}=c,n=pass.pieces.length,groups=[];
  pass.pieces.forEach((s,i)=>{if(!i||s.startsWith(' '))groups.push([]);groups.at(-1).push(i);});
  const tree=`<div class="word-tree">${groups.map(g=>`<div class="word-group"><b>${esc(g.map(i=>pass.pieces[i]).join('').trim())}</b><div class="word-pieces${g.length>1?' split':''}">${g.map(i=>btn('reader:'+i,`<b>${piece(pass.pieces[i])}</b><small>ID ${pass.tokenIds[i]}</small><small>seat ${i+1}</small>`,i===r)).join('')}</div></div>`).join('')}</div>`;
  const align=(name,t)=>`<div class="seat-row"><h4>${name}</h4><div class="tile-seq">${t.pieces.slice(0,5).map((p,i)=>`<span${t.tokenIds[i]===262?' class="hot"':''}><b>${piece(p)}</b><small>seat ${i+1} · ID ${t.tokenIds[i]}</small></span>`).join('')}<span class="more">…</span></div></div>`;
  return {
    lead:'First, chop the text into pieces',
    intro:`<p>A computer can’t do math on letters. So before anything else, GPT-2 cuts the text into pieces called <b>tokens</b> and swaps each piece for its number in a dictionary. You met this idea in <a href="${CH3}">Chapter 3</a>; now let’s watch the real GPT-2 tokenizer work on our sentence.</p><p>And here’s the first surprise: tokens are not always words. A common word like “fed” gets one token. A rarer word like “overfed” gets cut in two. And a space usually sticks to the front of the word after it!</p>`,
    title:'One row per token, not per word',
    guide:`Each box on the far left of the map is one token, and each token gets its own row running all the way across. Right now there are ${n} rows.\n\nSwitch to “overfed” in the experiment below and count the rows again. One word, two rows!`,
    heading:'Words in, tokens out',
    body:`<p>Here’s our sentence, cut up exactly the way GPT-2 cuts it. Each word sits above the token (or tokens) it became. Click a token to follow its row on the map. The little ␣ means a real space character that belongs to the token.</p>
      ${two(`<div>${tree}${tools(btn('example:base','Sarah <b>fed</b> the cat because it',c.example==='base'),btn('example:split','Sarah <b>overfed</b> the cat because it',c.example==='split'))}</div>`,`<div><h3>What the tokenizer just did</h3>${steps([
        '<b>Find familiar pieces.</b> GPT-2 has a fixed vocabulary of 50,257 pieces, built <em>before</em> the model was trained. The tokenizer glues characters into the biggest familiar pieces it can find. “fed” is common enough to be one piece. “overfed” isn’t, so it becomes “␣over” + “fed”.',
        '<b>Keep the space.</b> Look closely: “␣fed” and “fed” are two <em>different</em> tokens, with IDs 11672 and 19082! GPT-2 glues the space onto the front of the next word, so the same letters with and without a space count as different pieces. Weird, right? It’s one of those tokenizer quirks from Chapter 3.',
        '<b>Swap pieces for IDs.</b> Finally, each piece is replaced by its line number in the vocabulary. That number, the <b>token ID</b>, is just an address, like a locker number. Locker 3797 isn’t “more” than locker 340; it’s just where “␣cat” happens to live.'])}</div>`)}
      ${sec('What a token is versus where it sits',two(`<div><p>Now compare the two versions of the sentence. Watch the highlighted token.</p>${align('With “fed”',traces.base)}${align('With “overfed”',traces.split)}</div>`,
        `<div><p>Adding one token pushes everything after it one seat to the right. “␣the” keeps its ID, 262, but its seat moves from 3 to 4.</p>${callout('Hold on to this idea, because it’s going to matter a lot: <b>what</b> a token is and <b>where</b> it sits are two separate facts, and GPT-2 looks them up separately.')}</div>`))}
      ${quiz('How many rows will GPT-2 build for “Sarah overfed the cat”?',[
        ['4, one per word',0,'Close! But the model never sees words, only tokens. “overfed” becomes two tokens, so it gets two rows.'],
        ['5, one per token',1,'Exactly. Sarah, ␣over, fed, ␣the, ␣cat: five tokens, five rows.'],
        ['21, one per character',0,'That’s how a character-level model would work. GPT-2 uses bigger pieces, so it needs far fewer rows.']])}
      ${bridge(`We now have a list of IDs. But an ID is just an address. Next, let’s go to that address and see what’s stored there.`)}`
  };
}
function position(c){
  const {pass,r,col,traces,wt}=c,p=pass.positions[r][col],loud=Math.max(...Array.from(pass.positions[0],Math.abs));
  const rp=traces.repeat,pair=i=>strips(`The cat in seat ${i+1}: token row, seat row and their sum`,[
    {label:'Token row',values:rp.embeddings[i]},{label:'Seat row',values:rp.positions[i]},{label:'Sum',values:rp.input[i]}],24,true,0,true);
  const gap=Array.from(rp.input[4],(v,i)=>v-rp.input[1][i]),flips=Array.from(rp.positions[1]).filter((v,i)=>Math.sign(v)!==Math.sign(rp.positions[4][i])).length,fp=WIDE?96:48,dn=WIDE?64:24;
  return {
    lead:'Same word, different seat',
    intro:`<p>Here’s a puzzle. In <b>“The cat saw the cat”</b>, both cats are the same token, “␣cat”, ID 3797. So the token table hands both of them exactly the same 768 numbers. But one cat is doing the seeing and the other is being seen! If their rows are identical, how could the model ever tell them apart?</p><p>It’s actually worse than that. As we’ll see at the Key stop, attention compares rows by what’s <em>inside</em> them, not by where they sit. Without some help, a sentence would look like a bag of rows with no order at all. GPT-2’s fix is simple and kind of lovely: every <em>seat</em> gets its own learned row of numbers too.</p>`,
    title:'The lower branch: a row for the seat',
    guide:`On the map, follow the lower branch on the “${wt}” row. Its seat, ${r+1}, picks a row from a second table, the position table. Coordinate ${col+1} of that row is ${f(p,5)}.\n\nAny token sitting in seat ${r+1} would get exactly this same number. The seat doesn’t care who’s sitting in it.`,
    heading:'Every seat has its own fingerprint',
    body:`<p>GPT-2 keeps a second table that works just like the token table, except it has one row per <em>seat</em> instead of one row per token. It has 1,024 rows, because GPT-2 can read up to 1,024 tokens at once. Seat 1 uses row 0, seat 2 uses row 1, and so on (programmers count from zero, sorry about that :-)).</p>
      ${fig(`The first ${fp} numbers of each seat’s row`,fingerprint(pass.positions,r,fp),'Each stripe is one seat’s learned row. Green means positive, red means negative, and stronger color means a bigger number. Every seat has its own pattern, and that pattern is the <em>only</em> way the model knows where a token sits.')}
      <p>Did you notice how loud seat 1 looks? Its row has some really big numbers in it (the biggest is ${f(loud,2)}), while a typical token number is only about 0.07. GPT-2 treats the very first seat as special. Keep that in mind; we’ll see a hint of why at the Attention stop.</p>
      ${sec('The two cats experiment',`<p>Let’s put this to the test. Here are the two cats from “The cat saw the cat”, side by side. For each one I’ve drawn the first 24 numbers of its token row, its seat row, and their sum.</p>
        ${two(fig('The cat in seat 2',pair(1)),fig('The cat in seat 5',pair(4)))}
        <p>Look at the top rows: identical, bar for bar. Now the middle rows. They look alike at first glance, and that’s real: neighbouring seats have similar fingerprints, so seat 2 and seat 5 are cousins. But they are not twins. Across all 768 numbers, ${flips} of them even flip sign! Here’s what you get if you subtract one cat’s final row from the other’s:</p>
        ${fig('Cat in seat 5 minus cat in seat 2',strips('Difference between the two cats’ input rows',[{label:'Difference',values:gap}],dn),`The first ${dn} numbers. Since the token rows are identical, every bar here comes purely from the seats. If the model only had token rows, this whole picture would be flat.`)}
        <p>So the rows the model actually gets are different. Same token, different seats, different rows. Puzzle solved!</p>
        ${tools(c.example==='repeat'?btn('example:restore','Go back to our sentence'):btn('example:repeat','Show the two cats on the map'))}`)}
      ${sec('Why not just add the seat number?',`<p>You might be wondering: why a whole row of 768 learned numbers? Why not just add the seat number itself, 1 for seat 1, 2 for seat 2, and so on? Here’s the problem. A typical token number is around 0.07. By seat 500 we’d be adding 500 to every coordinate, which would completely drown out the token. A learned row lets training pick patterns that are the right size and actually useful.</p>
        ${note('Newer models often use a different trick called <a href="https://arxiv.org/abs/2104.09864">rotary position embeddings</a> (RoPE), which rotates the queries and keys instead of adding a row. GPT-2 keeps it simple: one learned row per seat.')}`)}
      ${quiz('In “The cat saw the cat”, what’s different about the two “␣cat” rows that enter block 1?',[
        ['Their token rows',0,'Both cats have ID 3797, so the token table hands back the exact same row.'],
        ['Their seat rows, and so their sums',1,'Right! Same token row, different seat rows, so the rows the model actually gets are different.'],
        ['Nothing, they’re identical',0,'Their token rows match, but each one picks up a different seat row, so their sums differ.']])}
      ${bridge('Every token now has two rows: one for <em>what</em> it is and one for <em>where</em> it sits. Next, we combine them into one.')}`
  };
}
function add(c){
  const {pass,r,col,W,wt}=c,E=pass.embeddings[r],P=pass.positions[r],X=pass.input[r],e=E[col],p=P[col],x=X[col],n=pass.pieces.length;
  const best=test=>{let k=0,b=-1;for(let i=0;i<E.length;i++){const v=test(E[i],P[i]);if(v>b){b=v;k=i;}}return k;};
  const together=best((a,b)=>a*b>0?Math.min(Math.abs(a),Math.abs(b)):-1),apart=best((a,b)=>a*b<0?Math.min(Math.abs(a),Math.abs(b)):-1);
  const other=tok(pass.pieces[r===0?1:0]),wn=WIDE?64:32;
  return {
    lead:'Two rows in, one row out',
    intro:`<p>This step is short, but it matters. GPT-2 takes the token row and the seat row and simply <b>adds</b> them, number by number: coordinate 1 plus coordinate 1, coordinate 2 plus coordinate 2, all the way to 768.</p><p>That’s it! No multiplying, nothing learned in this step. The result is one row of 768 numbers per token, and this is the row that walks into block 1.</p>`,
    title:'Watch the + on the map',
    guide:`On the “${wt}” row, the two branches meet at the + sign. For coordinate ${col+1}, the token brings ${f(e,5)}, the seat brings ${f(p,5)}, and together they make ${f(x,5)}.\n\nPick a different coordinate below and the numbers on the map follow along.`,
    heading:'Adding is walking on a number line',
    body:`<p>Here’s the picture I keep in my head. Start at zero. The token’s number walks you to ${f(e,5)}. Then, from <em>there</em>, the seat’s number walks you by ${f(p,5)}. Wherever you land is the input. When the two walks point the same way they add up; when they point in opposite directions they partly cancel.</p>
      ${tools(`<label>Coordinate (1 to 768) <input type="number" data-field="col" min="1" max="768" step="1" value="${col+1}"></label>`,btn('col:'+(together+1),'Show me one where they team up'),btn('col:'+(apart+1),'Show me one where they cancel'))}
      ${fig(`Coordinate ${col+1} of “${W}”`,numberLine(e,p,x),'Blue walk: the token’s number. Pink walk: the seat’s number, starting where the first walk ended.')}
      ${formula(`${f(e,5)} + (${f(p,5)}) = ${f(x,5)}`)}
      ${sec('The whole row at once',fig('',strips(`Token row, seat row and sum for ${W}`,[{label:'Token row',values:E,hot:col<wn?col:null},{label:'Seat row',values:P,hot:col<wn?col:null},{label:'Sum',values:X,hot:col<wn?col:null}],wn),`The first ${wn} of 768 coordinates. Each bar in the bottom row is just the two bars above it, added together. Look for a spot where green sits above red and see how they cancel.`))}
      ${sec('Why add instead of gluing them together?',two(`<div><p>Another way to combine two lists is to put them end to end, which would give 1,536 numbers. Adding keeps the row at 768, so every later step can use the same width.</p><p>“But doesn’t adding scramble them?” A little, yes. After adding, the model can’t perfectly pull the two apart again. But with 768 directions to work with there’s lots of room, and since both tables are learned, training is free to arrange them so they get in each other’s way as little as possible.</p></div>`,
        callout(`<b>Here’s the thing to notice.</b> Right now the row for “${W}” knows exactly two things: which token it is and which seat it’s in. It has no idea that “${other}” or any other token exists. Every row is still on its own little island. Building bridges between the islands is exactly what the next stop, attention, is for.`)))}
      ${quiz(`Suppose we swap “${other}” for a different token. Does the input row for “${W}” change?`,[
        ['Yes, every row depends on every word',0,'Not yet! At this point each row only knows its own token and its own seat. Changing a different token can’t touch it.'],
        ['No, its token and seat haven’t changed',1,'Exactly. Rows only start to influence each other inside the blocks, beginning with attention.']])}
      ${bridge(`So far every token has kept to itself. Next, block 1 begins, and the rows finally get to talk to each other. To do that, every row needs three new things: a <b>query</b>, a <b>key</b> and a <b>value</b>. (We now have ${n} rows × 768 numbers.)`)}`
  };
}
const trio=()=>`<div class="trio">${[['q','Q','Query','What information am I looking for?'],['k','K','Key','How relevant am I to your search?'],['v','V','Value','Here’s the information I can contribute.']].map(([k,l,n,t])=>`<div class="trio-card trio-${k}"><b>${l}</b><span>${n}</span><p>${t}</p></div>`).join('')}</div>`;
const topOf=a=>a.indexOf(Math.max(...a));
function query(c){
  const {pass,r,s,h,W,S,wt,st,head}=c,w=h.weights[r].slice(0,r+1),best=topOf(w),z=pass.block.normalized[r],terms=h.qTerms[r],raw=pass.input[r];
  const mean=sum(Array.from(raw))/raw.length,sd=Math.sqrt(sum(Array.from(raw,v=>(v-mean)**2))/raw.length+1e-5),std=Array.from(raw,v=>(v-mean)/sd),ln=WIDE?64:32;
  const fork=svg('One row branches into a query, a key and a value',`<rect x="10" y="62" width="150" height="40" rx="6" fill="var(--cp-surface-soft)" stroke="var(--cp-border-strong)"/>`+text(85,80,`row for “${trunc(pass.pieces[r].trim(),9)}”`,'middle','ts tb')+text(85,96,'768 numbers','middle','ts tm')
    +[['link','tq','Query: my search'],['danger','tk','Key: how to find me'],['success','tv','Value: what I can give']].map(([col,cl,t],i)=>{const y=26+56*i;return arrow(160,82,262,y,col,3)+`<rect x="266" y="${y-16}" width="200" height="32" rx="6" fill="var(--cp-surface)" stroke="var(--cp-${col})" stroke-width="2"/>`+text(278,y+5,t,'start',`${cl} ts tb`);}).join(''),480,164);
  const confession=best!==s?`A small confession about real models: in this head, “${tok(pass.pieces[best])}” actually gets the biggest share (${pct(w[best])}), not “${S}”. Don’t worry, that’s normal in block 1! Early heads often lean on the first token or on themselves. Whatever work the model does to connect words like these is spread over many heads and many blocks. You’ll see all twelve heads side by side at the Heads stop.`
    :`In this head, “${S}” gets the biggest share of all. Try another head at the top of the page and you’ll see the shares change completely.`;
  return {
    lead:'Self-attention is a search engine inside the model',
    intro:`<p>OK, this is the part people find confusing, so let me go slowly. I used to understand Q, K and V for about a day and then forget them again. What finally made it stick for me was this: <b>self-attention is a little search engine built into the model.</b> Every token gets to search the tokens before it for information it needs.</p><p>A search needs three things, and that’s all Q, K and V are:</p>${trio()}<p class="trio-rule">The one sentence I want you to remember: <b>Q and K decide WHO to listen to. V decides WHAT gets passed along.</b></p>`,
    title:'The blue line is the question',
    guide:`On the map, follow the blue line from “${wt}” into the box labelled Q. That’s the query “${wt}” makes in head ${head+1}.\n\nThe red line is the key from “${st}”, and the green line carries its value. Every token makes all three, but the map only draws the ones we’re following right now.`,
    heading:'Let’s watch one search happen',
    body:`<p>GPT-2 is working on “${W}”. To make a good guess about what comes next, “${W}” would really benefit from knowing something about the earlier words. Here’s how head ${head+1} in block 1 runs that search, drawn with the real shares from the saved run:</p>
      ${fig('',searchPicture(c),'Blue: the query from the token doing the reading. Red: every visible token’s key, with the share it earned. Green: every value, flowing into one blend. Thicker means a bigger share.')}
      ${two(steps([`<b>Ask.</b> “${W}” turns its row into a <span class="tq">query</span>: a search phrase made of 64 numbers.`,
        `<b>Match.</b> The query is compared with the <span class="tk">key</span> of every token “${W}” is allowed to see, including itself. Each comparison gives a score.`,
        `<b>Share.</b> The scores are turned into percentages that add up to 100%. Here, “${S}” gets ${pct(h.weights[r][s])}.`,
        `<b>Collect.</b> “${W}” takes a blend of everyone’s <span class="tv">values</span>, mixed according to those percentages. That blend is the new information this head adds to “${W}”.`]),
        `<div>${callout(`Notice what just happened: we <b>matched</b> against the key of “${S}”, but we <b>collected</b> the value of “${S}”. That’s the part I really want you to remember.`)}${note(confession)}</div>`)}
      ${sec('Why three different vectors? A trip to the library',`<p>This is the deeper idea that makes QKV stick. Why not just compare the tokens’ rows directly? Picture yourself walking into a library:</p>
        ${two(fig('',libraryPicture()),`<div><p>You search with your <b>query</b>: what you want. You compare it against <b>catalog cards</b>: short descriptions made for <em>finding</em> things. But when you find a match, you don’t take the catalog card home. You take the <b>book</b>, the actual content.</p>
        <p>Why keep them separate? Because the best way to <em>describe</em> something so it can be found is not the same as the thing itself. A catalog card says “pets, feeding, cats”. The book has 300 pages of detail. So GPT-2 learns three separate sets of weights, W<sub>Q</sub>, W<sub>K</sub> and W<sub>V</sub>, and each one gets to specialize in its own job.</p></div>`)}`)}
      ${sec('Every token plays all three roles',`<p>One more thing that tripped me up at first: Q, K and V are not three kinds of tokens. <em>Every</em> token makes all three, from its own row. “${W}” has a query (for its own search), a key (so other tokens can find it) and a value (so it can contribute when it’s found).</p>
        ${two(fig('',fork),`<div>${formula('Q = X · W<sub>Q</sub> &nbsp;&nbsp;&nbsp; K = X · W<sub>K</sub> &nbsp;&nbsp;&nbsp; V = X · W<sub>V</sub>')}
        <p>Here X is the stack of (tidied-up) rows, one per token. Each W is a learned table of 768 × 64 numbers for this head, so every token gets its own 64-number query, key and value.</p></div>`)}`)}
      ${sec(`Zoom in: how “${W}” builds its query`,`<p>Let me show you exactly how one number of the query gets made. It’s simpler than it sounds, I promise.</p>
        <p><b>Step 1, tidy up the row first (LayerNorm).</b> Before making its query, GPT-2 makes a tidied-up copy of the row. It shifts the 768 numbers so their average is 0 and rescales them so their typical size is 1. (For “${W}”, the average was ${f(mean)} and the typical size was ${f(sd)}.) Then it applies a small learned adjustment to each coordinate. Think of it as setting the volume to a standard level, so no row shouts louder than the others. The original row is kept safe and untouched; you’ll see why at the Heads stop.</p>
        ${fig('',strips('The row before and after tidying',[{label:'Before',values:raw},{label:'After',values:std}],ln,false),`The first ${ln} numbers. Each row is drawn on its own scale so you can compare their shapes, and they match exactly. What changed is the size: the typical number went from ${f(sd,2)} to 1. (This is before the small learned adjustment.)`)}
        <p><b>Step 2, a weighted vote.</b> Query number 1 is a weighted sum. Each of the 768 tidied numbers gets multiplied by its own learned weight, everything is added up, and a learned bias goes on at the end. Here are the first four of those 768 products:</p>
        ${two(table(['Coordinate','Tidied number','Learned weight','Product'],terms.map((t,i)=>[i+1,f(z[i]),f(h.qColumn[i]),f(t)])),`<div>${formula(`First 4 products: ${f(sum(terms))}<br>Other 764 products: ${f(h.qRest[r])}<br>Learned bias: ${f(h.qBias)}<br>Query number 1 = ${f(h.query[r][0])}`)}
        <p>Now do that 63 more times, each time with a different column of weights, and you have the whole 64-number query for head ${head+1}.</p></div>`)}
        ${tools(readerPick(c),headPick(c))}
        ${note('Try switching the reader: a different row goes in, but the weights stay the same. Then switch the head: the same row goes in, but a different set of weights reads it. That’s a different question being asked.')}`)}
      ${quiz('Which tokens make a query?',[
        ['Only the token doing the reading',0,'That’s the one we’re following, but every token runs its own search at the same time.'],
        ['Every token, from its own row',1,'Yes! Every token makes a query, a key and a value. Each one searches, and each one can be found.'],
        ['Only nouns like “cat”',0,'The model doesn’t know about nouns. Every token, even “the” and “because”, makes all three.']])}
      ${bridge('We have a question. Next, let’s see how it gets compared with every key.')}`
  };
}
function softmax(xs){const m=Math.max(...xs),e=xs.map(x=>Math.exp(x-m)),z=sum(e);return e.map(x=>x/z);}
function key(c){
  const {pass,r,s,h,state,W,S,wt,st,head}=c,k=state.axis,q=h.q64[r],keys=h.k64[s],products=q.map((v,i)=>v*keys[i]),raw=h.rawScores[r].slice(0,r+1);
  const delta=state.delta,edited=raw.map((v,i)=>v+(i===s?q[k]*delta:0)),share=softmax(edited.map(v=>v/8))[s],best=topOf(raw);
  return {
    lead:'Matching the question against every label',
    intro:`<p>The query from “${W}” is ready. Now it gets compared with the keys: one key for every token “${W}” is allowed to see, including itself.</p><p>The comparison is a <b>dot product</b>. Don’t let the name scare you! It just means: multiply the two lists number by number, then add everything up. When the query and the key agree, the score comes out high. When they disagree, it comes out low, or even negative.</p>`,
    title:'The red line is the label being matched',
    guide:`Follow the red line from “${st}” into the K box: that’s the key of “${st}”. Matched against the query from “${wt}” in head ${head+1}, it scores ${f(raw[s],2)}.\n\nPick a different token below to compare “${wt}” with someone else.`,
    heading:'What a dot product really measures',
    body:`${two(`<div><p>Here’s the picture I keep in my head. Think of the query and the key as two arrows. If they point the same way, the dot product is big and positive. At right angles, it’s zero. Pointing opposite ways, it’s negative.</p><p>Our real arrows have 64 directions, which nobody can draw, but the idea is exactly the same as in two. The sketch on the right shows all three cases.</p></div>`,fig('A 2D sketch of three matches',dotSketch()))}
      <p>So let’s do it for real. Here are all 64 multiplications for the query of “${W}” and the key of “${S}”. Each bar is one coordinate’s vote:</p>
      ${tools(sourcePick(c),choices('axis',64,k))}
      ${fig(`Why “${S}” gets the score it gets`,productsChart(products,k),`Green bars push the score up; red bars pull it down. Coordinate ${k+1}: ${f(q[k])} × ${f(keys[k])} = ${f(products[k])}. The other 63 add up to ${f(sum(products)-products[k])}. All 64 together: <b>${f(raw[s])}</b>.`)}
      <p>Notice that no single coordinate decides the match. It’s the whole pattern. Lots of small agreements can outweigh one big disagreement, and the other way around.</p>
      ${sec('Every key gets a score',`${fig('',scoresChart(c,raw),`The raw scores for “${W}” in head ${head+1}. “${tok(pass.pieces[best])}” scores highest. Scores can be negative; all that matters is how they compare with each other, as you’ll see at the next stop.`)}`)}
      ${sec('An experiment: nudge one catalog card',`<p>Here’s a fun way to test the library idea. What if we changed the catalog card of “${S}” a tiny bit, just one of its 64 numbers? The query stays exactly the same. Only the key changes. Before you click: do you think “${S}” will get more attention or less?</p>
        ${tools(btn('delta:0','Real key',delta===0),btn('delta:1',`Simulation: add 1 to key number ${k+1}`,delta===1))}
        ${two(`<div>${formula(`Score: ${f(raw[s])} → ${f(edited[s])}`)}
        ${fig('Share of the budget for “'+S+'”',bar('Real key',h.weights[r][s],'link')+(delta?bar('Nudged key',share):''),delta?'Both bars use the same 0 to 100% scale. The other tokens’ scores didn’t change, but they still compete for the same budget.':'Press the simulation button to see how the share changes.')}</div>`,
        `<div><p>The score moves by exactly the query’s number in that column (${f(q[k])}), because that’s what the key’s number gets multiplied by. A positive query number means the nudge helps; a negative one means it hurts. ${r===0?'(At seat 1 there is only one key to choose from, so its share stays 100% no matter what.) ':''}And notice what <em>didn’t</em> change: the value of “${S}”, the actual content. We only changed how easy “${S}” is to find, not what it would hand over.</p>
        ${note('This is a local simulation. The map above still shows the real model.')}</div>`)}`)}
      ${quiz(`If we change the key of “${S}”, what can change?`,[
        [`How much attention “${S}” receives`,1,`Right. The key only controls how well “${st}” matches the query, so it controls the share.`],
        [`The information inside the value of “${S}”`,0,'Nope, that’s the book, not the catalog card. Changing the key leaves the value alone.'],
        [`The query of “${W}”`,0,`The query belongs to “${wt}” and comes from its own row. Changing someone else’s key can’t touch it.`]])}
      ${bridge(`We now have a score for every token “${W}” can see. But scores aren’t percentages yet, and there’s one important rule we haven’t dealt with: no peeking at the future. That’s next.`)}`
  };
}
function attention(c){
  const {pass,r,s,h,W,S,wt,st,head}=c,raw=h.rawScores[r],scaled=raw.map(v=>v/8),allowed=scaled.slice(0,r+1),peak=Math.max(...allowed);
  const mass=scaled.map((v,i)=>i<=r?Math.exp(v-peak):0),den=sum(mass),noScale=softmax(raw.slice(0,r+1)),best=topOf(noScale),first=tok(pass.pieces[0]);
  const masked=s>r;
  return {
    lead:'Turning scores into a budget',
    intro:`<p>A score like ${f(raw[topOf(raw.slice(0,r+1))],2)} doesn’t tell “${W}” how much to listen to anyone. We need percentages that add up to 100%, like a budget to spend. GPT-2 gets there in three small steps: <b>shrink</b> the scores, <b>hide</b> the future, then <b>softmax</b>.</p><p>Let me show you each one with the real numbers.</p>`,
    title:masked?'This route is closed.':'Read one row of the grid',
    guide:masked?`“${st}” sits in seat ${s+1}, after “${wt}” in seat ${r+1}. From where “${wt}” sits, that token is still in the future, so its share is exactly 0%. There’s no green ribbon for this route.`
      :`The grid on the map is the attention pattern: each row is a reader, each column is a token it might read. Find the row for “${wt}”. Its circles are its budget: bigger circle, bigger share.\n\nThe slashes in the top right corner are the future. They’re always empty.`,
    heading:'Three steps from scores to shares',
    body:`${tools(readerPick(c),select('cell','Inspect any token',seats(c),s))}
      ${sec('Step 1: Shrink the scores (divide by 8)',`<p>With 64 coordinates voting, scores can get big, and big scores make the next step very picky: the winner grabs nearly everything. So GPT-2 divides every score by √64 = 8 to calm them down. Want to see why that matters? Here are the real shares next to what would happen if we skipped the division:</p>
        ${two(fig('What GPT-2 does: divide by 8',h.weights[r].slice(0,r+1).map((v,i)=>bar(`${i+1}. ${piece(pass.pieces[i])}`,v,'accent')).join('')),fig('What if we skipped it?',noScale.map((v,i)=>bar(`${i+1}. ${piece(pass.pieces[i])}`,v,'border-strong')).join('')))}
        <p>${r===0?'At seat 1 both versions are 100%, because there is only one token to look at. Try a later reader to see the difference.':`Without dividing, “${tok(pass.pieces[best])}” would grab ${pct(noScale[best])}, and this head would almost ignore everyone else. With the division, the head can blend information from several tokens.`}</p>`)}
      ${sec('Step 2: Hide the future (the causal mask)',two(`<div><p>When GPT-2 learns, it reads whole sentences at once. If “fed” could peek at the words after it, predicting the next word would be cheating, because the answer would be right there!</p><p>So before going any further, every score for a future token is replaced with <b>negative infinity</b>. It’s like covering the rest of the page with your hand while you read.</p>
        <p>In the grid, each row is one reader and each column is a token it could read, in the same order. The grey triangle is the future: always 0%. Every row adds up to 100% on its own. The highlighted row is “${W}”.</p></div>`,fig('',attentionGrid(c))))}
      ${sec('Step 3: Softmax turns scores into a budget',`<p>Softmax does two things. First it raises <i>e</i> (about 2.718) to the power of each score. That makes every number positive, and it makes bigger scores <em>much</em> bigger. Then it divides each result by their total, so they add up to exactly 100%.</p>
        ${two(table(['Token','Score ÷ 8','e to that power','Share'],pass.pieces.map((p,i)=>Object.assign([`${i+1}. ${piece(p)}`,f(scaled[i],3),i>r?'hidden (future)':f(mass[i],4),pct(h.weights[r][i])],{hot:i===s}))),
        `<div>${masked?'':fig('The whole budget for “'+W+'”',`<div class="allocation">${mass.slice(0,r+1).map((v,i)=>`<span title="${esc(pass.pieces[i].trim())}: ${pct(v/den)}" style="flex-grow:${v/den};background:var(--cp-${i===s?'accent':'border-strong'})"></span>`).join('')}</div>`,`The highlighted slice: ${f(mass[s])} ÷ ${f(den)} = ${pct(h.weights[r][s])}.`)}
        ${note('I subtracted the biggest score before raising e to its power. It doesn’t change the shares at all; it just keeps the numbers from getting huge. Real code does the same thing.')}
        ${callout('<b>Why negative infinity and not zero?</b> Because e<sup>0</sup> = 1, which would still buy a slice of the budget! But e<sup>−∞</sup> = 0, so a future token gets exactly nothing.')}</div>`)}`)}
      ${r>0?sec('A pattern you’ll see everywhere: the first token',`<p>Look at how much of the budget goes to “${first}”, the very first token. In this head, “${W}” gives it ${pct(h.weights[r][0])}. Many heads in GPT-2 park a big chunk of their attention on the first token, even when it isn’t especially relevant. Researchers call this an <a href="https://arxiv.org/abs/2309.17453">attention sink</a>: a sort of default place to put attention when nothing else is a strong match. Remember how loud seat 1’s position row was? That may be part of the same story.</p>`):''}
      ${quiz('Which token’s attention row can you predict before computing anything at all?',[
        ['The first token',1,'Yes! The first token can only see itself, so its row is always 100% on itself.'],
        ['The last token',0,'The last token can see everyone, so its row depends on all the scores.'],
        ['“cat”',0,'Its row depends on the scores like any other. Only the first token has no choice.']])}
      ${bridge(`Now “${W}” has its budget. But a budget is just a set of instructions. Next, let’s spend it on the values and see what information actually flows into “${W}”.`)}`
  };
}
function values(c){
  const {pass,r,s,h,state,W,S,wt,st}=c,k=state.feature,delta=state.delta,real=h.weights[r].slice(0,r+1),x=state.share<0?real[s]:state.share/100;
  const sim=real.map((v,i)=>i===s?x:(real[s]>=1-1e-9?(1-x)/Math.max(1,r):v*(1-x)/(1-real[s])));
  const mixOf=wts=>[0,1,2,3].map(j=>sum(wts.map((a,i)=>a*h.value[i][j])));
  const name=i=>tok(pass.pieces[i]);
  const vals=real.map((a,i)=>h.value[i][k]+(i===s?delta:0)),parts=real.map((a,i)=>a*vals[i]);
  const ends=[0];parts.forEach(v=>ends.push(ends.at(-1)+v));
  const lo=Math.min(...ends),hi=Math.max(...ends),X=v=>120+320*(v-lo)/(hi-lo||1);
  const waterfall=svg('Running sum of each token’s contribution',line(X(0),6,X(0),24+23*r,'text-soft',1.5)+parts.map((v,i)=>{const y=18+i*23;
    return text(4,y+4,`${i+1}. ${trunc(pass.pieces[i].trim(),9)}`,'start','ts')+line(X(ends[i]),y,X(ends[i+1]),y,sign(v),5)+dot(X(ends[i+1]),y,sign(v),4)+(i===r?'':line(X(ends[i+1]),y+3,X(ends[i+1]),y+20,'border',1));}).join('')+text(X(0),46+23*r,'0','middle','ts tm'),480,54+23*r);
  const live=`<div data-live="mix" class="two-up"><div>${fig('Your shares',sim.map((v,i)=>bar(`${i+1}. ${piece(pass.pieces[i])}`,v,i===s?'success':'border-strong')).join(''))}
      ${formula(`new info = ${sim.map((v,i)=>`${v.toFixed(2)}·V(${name(i)})`).join(' + ')}`)}</div>
      ${fig('First 4 numbers of the blend',strips('Real blend and your blend',[{label:'Real blend',values:mixOf(real)},{label:'Your blend',values:mixOf(sim)}],4,true,0,true),`You gave “${S}” ${pct1(x)}. The real model gave it ${pct1(real[s])}.`)}</div>`;
  return {
    lead:'Collecting the information',
    intro:`<p>This is where information finally moves! Every token has a <b>value</b>: the content it can contribute, 64 numbers per head. “${W}” takes each value, scales it by that token’s share from the last step, and adds everything up.</p><p>So if “${S}” got ${pct(real[s])} of the budget, then ${pct(real[s])} of its value flows into the result. Every token it can see contributes a slice. The result is a blend, not one winner.</p>`,
    title:'The green ribbons carry the information',
    guide:`On the map, each green ribbon’s width is a share. Follow them into the Σ, which adds everything up.\n\nWhat travels along the ribbon from “${st}” is its value, scaled down to ${pct(real[s])}. The key helped decide the width; the value is what’s inside.`,
    heading:'Play with the mixture',
    body:`<p>Let’s play with the mixture ourselves. Drag the slider to change how much “${W}” listens to “${S}”. The other tokens’ shares shrink or grow to keep the total at 100%.</p>
      ${tools(sourcePick(c),`<label class="range-label">Share for “${S}” <input type="range" data-range="share" min="0" max="100" step="0.5" value="${(100*x).toFixed(1)}"${r===0?' disabled':''}></label>`,btn('share:-1','Back to the real shares',state.share<0))}
      ${live}
      ${note(r===0?'At seat 1 there is only one token to listen to, so the slider has nothing to trade off. Pick a later reader to play.':'This slider is a teaching simulation, not the real model. The real shares are the ones you started with.')}
      <p>See how the result slides smoothly as you drag? It’s a weighted <em>sum</em> of vectors, not a choice of one word. A token can gather information from many tokens at the same time.</p>
      ${sec('Where one number of the result comes from',`${tools(choices('feature',4,k))}
        ${two(fig('',table(['Token','Share','Value','Share × value'],real.map((a,i)=>Object.assign([name(i),pct(a),f(vals[i]),f(parts[i])],{hot:i===s})))),fig('',waterfall,'Start at zero. Each token’s slice starts where the last one ended: right for positive, left for negative. The last dot is the result.'))}
        ${formula(`Blend, number ${k+1}: ${f(sum(parts))}${delta?` (the real model: ${f(h.output[r][k])})`:''}`)}`)}
      ${sec('WHO versus WHAT: the experiment that makes it click',`<p>Remember the one sentence from the Query stop? <b>Q and K decide WHO; V decides WHAT.</b> Let’s prove it. Leave every query and key alone and change just one number in the value of “${S}”. Before you click, predict: will any of the percentages change?</p>
        ${tools(btn('delta:0','Real value',delta===0),btn('delta:1',`Simulation: add 1 to value number ${k+1}`,delta===1))}
        ${two(fig('The shares',real.map((a,i)=>bar(name(i),a,i===s?'success':'border-strong')).join('')),fig('The result, number '+(k+1),formula(delta?`Before: ${f(h.output[r][k])}<br>After: ${f(sum(parts))}<br>Change: ${f(sum(parts)-h.output[r][k])} = ${pct(real[s])} × 1`:`Right now: ${f(h.output[r][k])}<br>(nothing changed yet)`)))}
        <p>${delta?`The percentages didn’t move at all, because nothing about the queries or keys changed. Only the content flowing through the ribbon changed, by exactly ${pct(real[s])} × 1. <b>Who</b> to listen to and <b>what</b> they say are completely separate things.`:'Press the simulation button and watch which side moves.'}</p>`)}
      ${sec('Your 10-second memory test',quiz('A token’s query matches strongly with another token’s key. Which vector from that other token contributes information to the output?',[
        ['Its query',0,'Not quite. A token uses its query for its own search, not to hand over information.'],
        ['Its key',0,'Close, but the key only decides how much attention it gets. The information comes from the value.'],
        ['Its value',1,'Exactly! The key decides how much attention it gets. The value provides the information.']]))}
      <div class="takeaway"><p>If you only remember one sentence, make it this one:</p><p class="takeaway-line"><span class="tq">Query asks.</span> <span class="tk">Key matches.</span> <span class="tv">Value delivers.</span></p><p>And the math version: Q × K decides the attention weights, and those weights multiply V to make the output.</p></div>
      <details class="shorthand"><summary>See all four attention stops as one line of math</summary>${formula('Attention(Q, K, V) = softmax( mask( Q · Kᵀ / √64 ) ) · V')}
        <p>Stack every token’s query, key and value into tables Q, K and V. Q · Kᵀ computes every query-key dot product at once (the Key stop). Dividing by √64 and masking the future is the Attention stop, and softmax turns each row into a budget. Multiplying by V mixes the values (this stop). These symbols aren’t new: they’re exactly the steps you just walked through.</p></details>
      ${bridge('That was one head. Block 1 has twelve of them, all running at the same time. Next, let’s see what each one found, and how their answers get put together.')}`
  };
}
function heads(c){
  const {pass,r,s,head,h,W,S,wt}=c,b=pass.block,n=pass.pieces.length,col=j=>b.heads.map(x=>x.weights[r][j]);
  const heat=`<table class="heads-heat"><thead><tr><th scope="col">Head</th>${pass.pieces.map((p,j)=>`<th scope="col">${piece(p)}</th>`).join('')}</tr></thead><tbody>${b.heads.map((x,i)=>`<tr${i===head?' class="is-row"':''}><th scope="row">${btn('head:'+i,`Head ${i+1}`,i===head)}</th>${pass.pieces.map((_,j)=>{
    if(j>r)return '<td class="masked" aria-label="future">·</td>';const v=x.weights[r][j];
    return `<td style="background:color-mix(in srgb, var(--cp-accent) ${Math.round(100*v)}%, transparent);color:var(--cp-${v>.55?'accent-fg':'text'})" title="Head ${i+1} gives ${esc(pass.pieces[j].trim())} ${pct(v)}">${v>=.095?Math.round(100*v)+'%':''}</td>`;}).join('')}</tr>`).join('')}</tbody></table>`;
  let story=`At seat 1 every head can only read “${W}” itself, so every row is 100% on the same token.`;
  if(r>0){
    const self=col(r),firstCol=col(0),hs=topOf(self),hf=topOf(firstCol);
    story=`Look how different they are! Head ${hs+1} spends ${pct1(self[hs])} on “${W}” itself. Head ${hf+1} puts ${pct1(firstCol[hf])} on “${tok(pass.pieces[0])}”, the first token.`;
    if(s!==0&&s!==r){const cs=col(s),hc=topOf(cs);story+=` The head that cares most about “${S}” is head ${hc+1}, with ${pct1(cs[hc])}.${cs[hc]<.5?` Even so, no head in block 1 gives “${S}” most of its budget. Early blocks do simpler bookkeeping; richer connections build up over the next eleven blocks.`:''}`;}
  }
  const concat=`<div class="concat" role="group" aria-label="Twelve head outputs joined end to end">${b.heads.map((_,i)=>btn('head:'+i,`H${i+1}`,i===head)).join('')}</div><div class="concat-scale"><span>1</span><span>768</span></div>`;
  return {
    lead:'Twelve heads, twelve different questions',
    intro:`<p>Everything we just did, query, key, share, collect, was <em>one</em> head. Block 1 has twelve heads doing it at the same time, side by side. Each head has its own W<sub>Q</sub>, W<sub>K</sub> and W<sub>V</sub>, so each one asks its own question and collects its own information.</p><p>Why bother? Picture twelve friends reading the same sentence. One keeps track of who did what, another watches the word right before, another just re-reads the current word. Together they notice far more than any one of them could alone. (In a real model nobody hands out these jobs. Training discovers them, and they’re often a lot messier than my friends picture.)</p>`,
    title:'Two of twelve heads on the map',
    guide:`After the grid, the map draws two small strips per token: the outputs of two heads. All twelve were computed; the picture just doesn’t have room for the rest.\n\nClick a head below to see where it looked from “${wt}”.`,
    heading:'Where each head looked',
    body:`<p>Here’s every head in block 1 reading from “${W}”. Each row is one head’s budget, so each row adds up to 100%. Click a head to follow it on the map.</p>
      ${two(`<div class="heat-wrap">${heat}</div>`,`<div><p>${story}</p>${note('Each row of the table is one head. A darker cell means a bigger slice of that head’s budget, and the dots on the right are future tokens that “'+W+'” can’t see yet.')}</div>`)}
      ${sec('Combining twelve answers',`<p>Each head hands back 64 numbers. GPT-2 doesn’t average them, because that would blur twelve different findings into one. Instead it lines them up end to end: head 1’s 64 numbers, then head 2’s, and so on. 12 × 64 = 768, exactly the width we started with!</p>
        ${concat}${two(fig(`Head ${head+1} fills numbers ${head*64+1} to ${(head+1)*64}`,table(['Head number','Joined number','Value'],h.output[r].map((v,i)=>[i+1,head*64+i+1,f(v)])),`The first 4 of head ${head+1}’s 64 numbers for “${W}”. Joining changes their positions, not their values.`),
        `<div><p>Click a segment in the strip above to see where another head’s numbers land.</p><p>Then one more learned layer, the <b>output projection</b>, mixes all 768 numbers together, so the heads’ findings can be combined into something useful.</p></div>`)}`)}
      ${sec('The bypass: add, don’t replace',`<p>Here’s a design choice that makes deep models work. The attention result does <em>not</em> replace the row. It gets <b>added</b> to the original row, like writing notes in the margin instead of rewriting the page. The dashed line along the top of the map is the original row taking that bypass. It’s called the <b>residual connection</b>.</p>
        ${two(table(['Number','Original row','+ attention adds','= new row'],[0,1,2,3].map(k=>[k+1,f(pass.input[r][k]),f(b.attentionProjection[r][k]),f(b.attentionResidual[r][k])])),
        `<p>Why does this matter so much? Because the row never loses what it already knew. Each block only has to learn what to <em>add</em>. That makes it much easier to stack many blocks on top of each other, which is exactly what GPT-2 does next.</p>`)}`)}
      ${quiz('Twelve heads each return 64 numbers. What does GPT-2 do with them?',[
        ['Averages them into 64 numbers',0,'Averaging would blur twelve different findings into one. GPT-2 keeps them all.'],
        ['Lines them up into 768 numbers, then mixes them with a learned layer',1,'Yes! Join, project, then add to the original row.'],
        ['Keeps only the head with the biggest share',0,'Every head contributes. There’s no vote for a single winner.']])}
      ${bridge('After attention, every row has heard from the tokens before it. Next, each row gets some quiet time to think about what it just heard.')}`
  };
}
function mlp(c){
  const {pass,r,state,W,wt}=c,b=pass.block,acts=b.activated[r],ins=b.expanded[r],j=state.unit<0?topOf(Array.from(ins,Math.abs)):state.unit,k=state.feature,a=b.expanded[r][j],v=b.activated[r][j],other=tok(pass.pieces[r===0?1:0]);
  const fired=acts.filter(x=>x>.1).length,firer=pass.block.activated.findIndex(row=>row.some(x=>x>1));
  const story=a<-1?`A big negative input, squashed almost to zero. That’s the bend at work!`:a>1?`A big positive input, passed through almost unchanged.`:`An input close to zero, where the curve is gentle.`;
  return {
    lead:'Now each token thinks on its own',
    intro:`<p>If attention was a meeting where every token got to hear from the others, the <b>feed-forward network</b> (people also call it the <b>MLP</b>) is what happens after the meeting: everyone goes back to their desk and thinks it over on their own.</p><p>Every row goes through the same small network, one row at a time. No row can see any other row here. It works only with what it already has, which now includes everything attention just brought in.</p>`,
    title:'Follow the row through the feed-forward box',
    guide:`On the “${wt}” row, the yellow tiles in the feed-forward box are 16 of its 3,072 hidden units. Bright tiles fired; dim ones stayed quiet.\n\nAfter the box, another + adds the result back onto the row, just like after attention.`,
    heading:'Expand, bend, shrink, add',
    body:`${two(fig('',hourglass()),steps(['<b>Expand.</b> The row is tidied up with LayerNorm again, then multiplied by a learned table to make 3,072 numbers, four times as many. Think of each one as a little detector asking, “is my pattern in this row?”',
        '<b>Bend.</b> Each detector’s number goes through a smooth curve called GELU. Big positive numbers pass through almost unchanged, and negative ones get squashed toward zero. This bend is the whole point! Without it, the two multiplications would collapse into one, and the network couldn’t learn anything a single table couldn’t.',
        '<b>Shrink.</b> A second learned table combines all 3,072 detector outputs back down to 768 numbers.',
        '<b>Add.</b> Just like after attention, the result is added to the row instead of replacing it.']))}
      ${sec('The bend, up close',`${tools(readerPick(c),select('unit','Detector',Array.from({length:16},(_,i)=>[i,i+1]),j))}
        ${two(fig(`Detector ${j+1} on the GELU curve`,geluPlot(a,v),`Detector ${j+1}: ${f(a)} goes in, ${f(v)} comes out. ${story}${state.unit<0?' (I started you on the detector with the biggest input of the 16 we saved.)':''}${fired===0&&firer>=0&&firer!==r?` Want to see one fire? Read at “${tok(pass.pieces[firer])}”.`:''}`),fig('All 16 saved detectors for “'+W+'”',strips('First 16 detector outputs',[{label:'After GELU',values:acts,hot:j}],16,true,1,true),`${fired===0?'None':fired} of these 16 fired for “${W}” (output above 0.1). The rest stayed quiet: GELU squashes negative inputs to tiny numbers just below zero, so those bars barely show. Bars are drawn on a fixed scale where full height is 1. That’s normal, by the way. For any one token, most detectors stay quiet.`))}`)}
      ${sec('One number, before and after',`${tools(choices('feature',4,k))}${two(formula(`Row after attention: ${f(b.attentionResidual[r][k])}<br>+ the MLP adds: ${f(b.contracted[r][k])}<br>= row leaving block 1: ${f(b.output[r][k])}`),
        note('The shrink step uses all 3,072 detectors, not just the 16 we saved, so the dot on the curve is one contributor among thousands.'))}`)}
      ${sec('So where does a model keep what it knows?',`<p>Here’s a fun one. Researchers have found evidence that a lot of what a model “knows”, like the fact that Paris is in France, lives in these feed-forward layers (<a href="https://arxiv.org/abs/2012.14913">Geva et al.</a>, <a href="https://arxiv.org/abs/2202.05262">Meng et al.</a>). A handy way to think about it: attention <em>moves</em> information between tokens, and the MLP <em>looks things up and transforms</em> it inside each token. It’s a simplification, but a useful one.</p>`)}
      ${quiz(`Inside the MLP, can the row for “${W}” read the row for “${other}”?`,[
        ['Yes, the MLP sees all the rows',0,'Nope. The MLP works on one row at a time. Only attention can move information between rows.'],
        ['No, it only sees its own row',1,'Right. Whatever it knows about the other tokens, it learned from attention just before.']])}
      ${bridge('That’s one complete block: attention, add, feed-forward, add. GPT-2 small does this twelve times. Let’s watch what happens to the row along the way.')}`
  };
}
function blocks(c){
  const {pass,r,state,W}=c,k=state.depthAxis,j=state.layer,series=[pass.input[r][k],...pass.depth.map(v=>v[r][k])],n=pass.pieces.length;
  const lo=Math.min(...series,0),hi=Math.max(...series,0),CW=canvas(),X=i=>44+((CW-100)/12)*i,Y=v=>112-85*(v-lo)/(hi-lo||1);
  const chart=svg('One coordinate of the row after each block',line(30,Y(0),CW-22,Y(0),'border',1)+`<path d="${series.map((v,i)=>`${i?'L':'M'}${f(X(i),1)},${f(Y(v),1)}`).join('')}" fill="none" stroke="var(--cp-link)" stroke-width="3"/>`
    +series.map((v,i)=>dot(X(i),Y(v),i===j||i===j-1?'accent':'border-strong',i===j?6:4)).join('')+text(2,Y(hi)+4,f(hi,1),'start','ts tm')+text(2,Y(lo)+4,f(lo,1),'start','ts tm')+text(X(0),148,'input','middle','ts tm')+text(X(6),148,'block 6','middle','ts tm')+text(X(12),148,'block 12','middle','ts tm'),CW,156);
  return {
    lead:'Twelve rounds of the same recipe',
    intro:`<p>You know how a tricky sentence makes more sense the second time you read it? Stacked blocks work a bit like that. Block 2 gets the rows that block 1 produced, and those rows already carry information from their neighbours. So block 2’s heads can ask richer questions and find richer answers. Then block 3 builds on block 2, and so on, twelve times.</p><p>Every block follows the same recipe, but each has its own learned weights. The number of rows never changes: still one per token. What changes is how much each row knows.</p>`,
    title:'Blocks 2 to 12, folded into one column',
    guide:'To save space, the map folds blocks 2 to 12 into a single column. None of them were skipped: the saved run went through all twelve.\n\nThe little strip at the end of each row is the row after block 12, ready for the final step.',
    heading:'Watch one number travel through twelve blocks',
    body:`<p>Each dot below is one coordinate of the row for “${W}”, measured after each block in the saved run. Pick a block to see what it added.</p>
      ${tools(readerPick(c),choices('depthAxis',8,k),select('layer','Block',Array.from({length:12},(_,i)=>[i+1,i+1]),j))}
      ${fig(`Coordinate ${k+1} of “${W}”`,chart,`Block ${j}: ${f(series[j-1])} went in, ${f(series[j])} came out. That block added ${f(series[j]-series[j-1])}.`)}
      <p>Can we read meaning off this line? Honestly, no. One coordinate isn’t a human idea like “is a pet”. Meaning is spread across many coordinates at once. But the line does show something true: the row keeps changing as it goes deeper, and every block adds its own bit on top of the last one. That’s the residual connection from the Heads stop, at work twelve times over.</p>
      ${sec('Deeper is not later',`<p>One thing that tripped me up: moving right through the blocks is <em>not</em> moving forward in the sentence. All the rows go through block 1 together, then block 2 together, and so on. No new tokens appear along the way.</p>
        ${fig('',depthGrid(c),`Each dot is one row after one block. In every block, “${W}” can pull information from the rows above it (the faint lines) but never from rows below it. Information flows right, into deeper blocks, and down, from earlier tokens to later ones. Never up.`)}`)}
      ${quiz(`After all twelve blocks, how many rows does GPT-2 have for “${esc(pass.text)}”?`,[
        [`${n}, one per token, same as before`,1,'Exactly. The rows get richer, but there are still the same number of them.'],
        [`${n*12}, a new set of rows for every block`,0,'Each block updates the rows; it doesn’t add new ones.'],
        ['1, everything gets squashed into one row',0,'Every token keeps its own row all the way to the end.']])}
      ${bridge(`After block 12, the row for “${W}” has gathered everything it’s going to gather. One last step: turn that row into a guess.`)}`
  };
}
function rng(seed){return()=>{seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function prediction(c){
  const {pass,r,output,state,W,wt}=c,top=pass.top[r],best=top[0],cand=top.find(a=>a.id===output)||best,ref=cand===best?top[1]:best,top8=sum(top.map(a=>a.p)),rest=1-top8;
  let draws='';
  if(state.seed>0){
    const rand=rng(state.seed*7919+r),picks=Array.from({length:20},()=>{let u=rand();for(const a of top){if((u-=a.p)<0)return tok(a.word);}return '(something else)';});
    const counts=picks.reduce((m,x)=>(m[x]=(m[x]||0)+1,m),{});
    draws=`<div class="draws">${picks.map(x=>`<span>${x}</span>`).join('')}</div><p class="lesson-note">Out of 20 rolls: ${Object.entries(counts).sort((a,b)=>b[1]-a[1]).map(([x,v])=>`“${x}” ${v}×`).join(', ')}. Roll again and you’ll get a different mix.</p>`;
  }
  const recap=[['tokens','Tokens: text becomes pieces with IDs.'],['embedding','Token embedding: each ID fetches a row of 768 learned numbers.'],['position','Position embedding: each seat adds its own learned row.'],['add','Add: the two rows become one.'],['query','Query: every token asks a question.'],['key','Key: each question is matched against every visible label.'],['attention','Attention: scores become a budget, with the future hidden.'],['values','Values: the budget mixes in everyone’s information.'],['heads','Heads: twelve searches run side by side, and the result is added to the row.'],['mlp','Feed-forward: each row thinks on its own, and adds that too.'],['blocks','Blocks: the same recipe runs twelve times.'],['prediction','Prediction: the final row is compared with every token, and softmax gives the guess.']];
  return {
    lead:'From a row of numbers back to words',
    intro:`<p>Here’s a lovely bit of symmetry. At the very start, we used a token ID to look up a row in the token table. Now we go the other way! We take the final row for “${W}” (tidied with one last LayerNorm) and compare it with <em>every</em> row in that same token table, all 50,257 of them, using a dot product. Tokens whose rows match well get high scores, called <b>logits</b>.</p><p>Then softmax, our old friend from the Attention stop, turns those 50,257 scores into probabilities that add up to 100%.</p>`,
    title:'The bars on the right are the answer',
    guide:`These are GPT-2’s top 8 guesses for the token after “${wt}”. Its favourite, “${best.word.trim()||best.word}”, gets ${pct(best.p)}.\n\nClick any bar to inspect it. Nothing gets added to the sentence; we’re just looking.`,
    heading:'One budget for the whole vocabulary',
    body:`<p>The bars on the map are scaled so the favourite looks full. Here they are on an honest 0 to 100% scale, plus one more bar for everything else:</p>
      ${two(fig(`After “${W}”`,top.map(a=>bar(tok(a.word),a.p,a.id===cand.id?'accent':'link')).join('')+bar('everything else',rest,'border-strong')),
        fig('Compare two guesses',tools(select('out','Inspect',top.map(a=>[a.id,tok(a.word)]),cand.id))+table(['Token','Logit','Probability'],[cand,ref].map(a=>[tok(a.word),f(a.logit,3),pct(a.p)]))
          +formula(`Gap in score: ${f(cand.logit-ref.logit,3)}<br>e<sup>${f(cand.logit-ref.logit,3)}</sup> ≈ ${f(cand.p/ref.p,3)} times as likely`),'Probabilities only depend on the <em>gaps</em> between scores. Logits can be negative; only the differences matter.'))}
      <p>Look how much is left over! The top 8 add up to ${pct(top8)}, and the other ${pct(rest)} is spread across about 50,000 other tokens. The model has a favourite, but it isn’t certain, and plenty of other continuations are possible.</p>
      ${sec('Every row makes a guess',`<p>Here’s something that surprised me. It’s not just the last row that makes a guess. <em>Every</em> row predicts the token that comes after it:</p>
        <div class="heat-wrap">${table(['After…','1st guess','2nd','3rd'],pass.top.map((t,i)=>Object.assign([esc(pass.pieces.slice(0,i+1).join('')),...t.slice(0,3).map(a=>`<b>${tok(a.word)}</b> ${pct1(a.p)}`)],{hot:i===r})),'prefix-table')}</div>
        <p>This is how GPT-2 is trained: in one pass over a sentence, every row guesses its next token, and the model gets graded on all of those guesses at once. Each row only ever used the tokens up to its own seat, thanks to the causal mask.</p>`)}
      ${sec('Picking the next token',`<p>To actually write something, the model has to pick one token. Always picking the favourite is called <b>greedy decoding</b>: predictable, but it can get repetitive. <b>Sampling</b> rolls a weighted die instead, so “${tok(best.word)}” comes up about ${pct1(best.p)} of the time. Try rolling it:</p>
        ${tools(btn('draw:1',state.seed?'Roll 20 more times':'Roll the die 20 times'))}${draws}
        <p>Whatever gets picked is added to the end of the sentence, takes the next seat, and the whole journey you just followed runs again for the next guess. That’s all text generation is: this loop, over and over.</p>`)}
      ${sec('Woohoo, you made it!',`<p>You just followed one prediction all the way through a real Transformer. Here’s the whole trip in one breath:</p><ol class="recap">${recap.map(([k,t])=>`<li><a href="?lesson=${k}">${t}</a></li>`).join('')}</ol>`)}
      ${quiz(`Why does the row for “${tok(pass.pieces[Math.min(1,pass.pieces.length-1)])}” also have a prediction?`,[
        ['Every row guesses the token that comes after it',1,'Yes! That’s what lets GPT-2 learn from every position of a sentence at once.'],
        ['Only the last row really predicts; the others are copies',0,'Each row makes its own guess, using only the tokens up to that point.'],
        ['It’s a bug in this page',0,':-) No bug! Every position predicts its own next token.']])}
      ${bridge('Press <b>Next</b> to watch GPT-2 write the next few words, one token at a time.')}`
  };
}

function generate(c){
  const {pass,state}=c,n=pass.pieces.length,steps=pass.continuation||[],k=Math.min(state.gen,steps.length);
  const added=steps.slice(0,k),dist=k===0?pass.top[n-1]:steps[k-1].top,best=dist[0],done=k>=steps.length,chip=s=>esc(s.replace(/^ /,'␣').replace(/\n/g,'↵'));
  const text=esc(pass.text+added.map(s=>s.word).join('')).replace(/\n/g,' ↵ ');
  const line=`<div class="gen-line" aria-label="The sentence so far, with seat numbers">${pass.pieces.map((p,i)=>`<span class="gen-tok"><b>${chip(p)}</b><small>seat ${i+1}</small></span>`).join('')}${added.map((s,i)=>`<span class="gen-tok is-new"><b>${chip(s.word)}</b><small>seat ${n+i+1}</small></span>`).join('')}<span class="gen-tok is-next"><b>?</b><small>seat ${n+k+1}</small></span></div>`;
  const history=k?table(['Step','GPT-2 added','How likely it was','Rows in the next trip'],added.map((s,i)=>[i+1,`<b>${chip(s.word)}</b>`,pct(s.p),n+i+1])):'';
  return {
    lead:'Pick a word, add it, and do the whole trip again',
    intro:`<p>So far we followed <em>one</em> prediction. But a chatbot writes whole paragraphs. How does it do that? The answer is almost disappointingly simple, and I love it for that.</p><p>GPT-2 picks one token, glues it onto the end of the sentence, and runs the <em>entire</em> trip again, from tokens all the way to a new guess, now with one more row. Then it does it again. And again. This loop has a fancy name, <b>autoregressive generation</b>, but it really is just: guess, append, repeat.</p>`,
    title:'One new row at a time',
    guide:`The map above still shows the trip for our original sentence. Each press of the button below is a brand-new trip through all twelve blocks with one more row. I’m only showing you where each trip ends: GPT-2’s next guess.\n\nGPT-2 is using greedy decoding here, so it always picks its favourite.`,
    heading:'Watch GPT-2 write',
    body:`<p>Press the button to let GPT-2 write one token at a time. Every number below comes from re-running the real model on the longer sentence.</p>
      ${tools(btn('gen:next',done?'That’s all I saved':k?'Add the next word':'Add GPT-2’s favourite word'),btn('gen:reset','Start over'))}
      ${fig('The sentence so far',line+`<p class="gen-text">“${text} …”</p>`,`${n+k} rows go into the next trip. The pink tokens were written by GPT-2 itself.`)}
      ${two(fig(`What GPT-2 guesses for seat ${n+k+1}`,dist.map(a=>bar(tok(a.word),a.p,a.id===best.id?'accent':'link')).join('')+bar('everything else',1-sum(dist.map(a=>a.p)),'border-strong'),done?`I saved ${steps.length} steps, so this is where we stop.`:`Its favourite is “${tok(best.word)}” at ${pct(best.p)}. Press the button and it gets added.`),
        k?fig('What GPT-2 has written so far',history):`<div>${callout(`Before you press: GPT-2’s favourite is “${tok(best.word)}”. What do you think it will write after that? Make a guess, then keep pressing to check.`)}</div>`)}
      ${sec('Why run the whole trip again?',`<p>Every new token needs its own row, and that row needs attention to look back at all the earlier rows. So yes, the model really does run all twelve blocks again for every single token it writes.</p>
        <p>Here’s a neat detail, though. Because of the causal mask, the earlier rows never look at later ones. Adding “${tok(steps[0]?.word||best.word)}” at the end can’t change anything that happened in the earlier rows. A real system takes advantage of that and saves the earlier rows’ keys and values instead of recomputing them. That trick is called the <b>KV cache</b>, and it’s one of the speed tricks coming in a later chapter.</p>`)}
      ${sec('Greedy, or a roll of the dice?',`<p>Always taking the favourite is called <b>greedy decoding</b>. I used it here because it’s predictable: you’ll see the same words every time you press the button. But it can get repetitive. Want to see that for yourself? Switch the sentence at the top to “Repeated: cat” and press the button six times. Greedy GPT-2 writes “, and the cat saw the” and starts going round in circles!</p><p>That’s why most chatbots <b>sample</b> instead: they roll the weighted die you tried at the Prediction stop. It’s also why the same question can get a different answer each time you ask.</p>`)}
      ${quiz('GPT-2 has just added a new token at the end. In the next trip, what happens to the rows for the earlier tokens?',[
        ['They come out exactly the same as before',1,'Exactly! The causal mask means earlier rows never look at later ones, so a new token at the end can’t change them. That’s what makes the KV cache possible.'],
        ['They all change, because they can now see the new token',0,'Remember the grey triangle at the Attention stop? Earlier rows can never look at later tokens, so they can’t see the new one.'],
        ['They get thrown away',0,'Every row is still there. The new token just adds one more row at the end.']])}
      ${bridge('You’ve now seen the whole machine, from one sentence to brand-new text. Last stop: let’s check what stuck.')}`
  };
}
function byhand(title,setup,question,answer,digits,tol,unit,hints,solution){
  return `<div class="byhand" data-answer="${answer}" data-tol="${tol}" data-digits="${digits}"><h4>${title}</h4>${setup}<p class="byhand-q">${question}</p>
    <div class="byhand-row"><label>Your answer${unit?` (${unit})`:''} <input type="text" inputmode="decimal" autocomplete="off" data-byhand-input></label><button type="button" data-byhand="check">Check</button><button type="button" data-byhand="hint">Show a hint</button><button type="button" data-byhand="reveal">Show the answer</button></div>
    <p class="byhand-fb" aria-live="polite"></p><ol class="byhand-hints">${hints.map(t=>`<li hidden>${t}</li>`).join('')}</ol><div class="byhand-solution" hidden>${solution}</div></div>`;
}
function practice(c){
  const {pass,head}=c,h=pass.block.heads[head],n=pass.pieces.length,rr=Math.min(2,n-1),r0=c.r;
  const name=i=>`“${tok(pass.pieces[i])}”`,round=(x,d)=>Number(Number(x).toFixed(d));
  const a=round(pass.embeddings[r0][0],5),b=round(pass.positions[r0][0],5),sumAB=round(a+b,5);
  const sc=h.rawScores[rr].slice(0,rr+1).map(v=>round(v/8,3)),mx=Math.max(...sc),ex=sc.map(v=>Math.exp(v-mx)),den=sum(ex),share=round(100*ex[0]/den,1);
  const sh=h.weights[rr].slice(0,rr+1).map(v=>round(v,3)),vals=h.value.slice(0,rr+1).map(v=>round(v[0],4)),blend=round(sum(sh.map((s,i)=>s*vals[i])),4);
  return {
    lead:'Your turn: three small calculations',
    intro:`<p>We’ve been following GPT-2’s numbers for fourteen stops. Now it’s your turn to do a few of them yourself, with a calculator if you like. These are the real numbers from the same saved run.</p><p>Don’t worry about getting them perfect on the first try. Every exercise has hints, and you can always peek at the answer. The point is to feel each step in your own hands.</p>`,
    title:'Practice, then a quick review',
    guide:'The whole map is back in view. Each exercise below comes from one part of it: the + at the inputs, one row of the attention grid, and one green ribbon.\n\nTake your time. Nothing here changes the model.',
    heading:'Do it by hand',
    body:`${byhand('1. Add the two rows',`<p>Look at ${name(r0)} in seat ${r0+1}. In coordinate 1, its token row brings <b>${f(a,5)}</b> and its seat row brings <b>${f(b,5)}</b>.</p>`,
        'What number enters block 1 in this coordinate? Give five decimal places.',sumAB,5,.000015,'',
        ['Remember the number line from the Add stop: start at the token’s number, then walk by the seat’s number.',`Add them: ${f(a,5)} + (${f(b,5)}).`],
        formula(`${f(a,5)} + (${f(b,5)}) = ${f(sumAB,5)}`))}
      ${byhand('2. Turn three scores into one share',`<p>Now look at ${name(rr)} in seat ${rr+1}, in head ${head+1}. It can see three tokens. After dividing by 8, their scores are:</p>${table(['Token','Score ÷ 8'],sc.map((v,i)=>[name(i),f(v,3)]))}`,
        `What share of the budget does ${name(0)} get? Give a percentage with one decimal place.`,share,1,.15,'%',
        ['Subtract the biggest score from each score, so the biggest becomes 0. (This doesn’t change the answer; it just keeps the numbers small.)','Raise e to each result. Your calculator’s eˣ button does this. Remember e⁰ = 1.',`Divide the result for ${name(0)} by the total of all three, then multiply by 100.`],
        table(['Token','Score ÷ 8','minus the biggest','e to that power','Share'],sc.map((v,i)=>[name(i),f(v,3),f(v-mx,3),f(ex[i],4),pct(ex[i]/den)]))+formula(`${f(ex[0],4)} ÷ ${f(den,4)} = ${f(share,1)}%`))}
      ${byhand('3. Blend the values',`<p>Same token, same head. Here are the three shares from the previous exercise and the first number of each token’s value:</p>${table(['Token','Share','Value, number 1'],sh.map((s,i)=>[name(i),f(s,3),f(vals[i],4)]))}`,
        `What is the first number of the blend that flows into ${name(rr)}? Give four decimal places.`,blend,4,.0006,'',
        ['Multiply each share by its value.','Add the three products together. Watch the signs!'],
        table(['Token','Share × value'],sh.map((s,i)=>[name(i),`${f(s,3)} × ${f(vals[i],4)} = ${f(s*vals[i],4)}`]))+formula(`Sum = ${f(blend,4)}`))}
      ${sec('Review: the whole trip in seven questions',`<p>No scores, no pressure. Just a quick way to see which stops you might want to revisit.</p>
        ${quiz('What does GPT-2 actually receive first?',[
          ['The letters of the sentence',0,'Close, but the tokenizer turns letters into pieces first, and each piece into an ID.'],
          ['Token IDs that point to rows in a learned table',1,'Yes! Each ID is an address. The row it points to is the token embedding.'],
          ['One number per word that measures its meaning',0,'An ID is just an address, like a locker number. Meaning lives in the 768 numbers of the row it points to.']])}
        ${quiz('The same token appears in two different seats. The rows that enter block 1 are…',[
          ['Identical, because the token is the same',0,'The token rows match, but each seat adds its own position row.'],
          ['Different, because each seat adds its own position row',1,'Right! Same token row, different seat rows, different sums.']])}
        ${quiz('A query matches a key strongly. What gets passed along?',[
          ['The key',0,'The key only decides how big the share is.'],
          ['The value',1,'Exactly. Query asks, key matches, value delivers.'],
          ['The query',0,'The query belongs to the token doing the reading. It’s the question, not the answer.']])}
        ${quiz('Why is the top-right triangle of the attention grid always empty?',[
          ['Those are future tokens, and the causal mask hides them',1,'Yes! Every future score becomes negative infinity, so its share is exactly zero.'],
          ['Those tokens didn’t match well',0,'Even a terrible match gets a small positive share. Exactly zero only comes from the mask.']])}
        ${quiz('What does the residual connection do?',[
          ['It adds each block’s result to the row instead of replacing it',1,'Right. Like writing notes in the margin: the row never loses what it knew.'],
          ['It removes the attention result if it’s too small',0,'Nothing is removed. The update is always added on top of the original row.']])}
        ${quiz('Inside the feed-forward network, each row…',[
          ['Reads every other row first',0,'That’s attention’s job. The feed-forward network works on one row at a time.'],
          ['Is processed on its own, without looking at other rows',1,'Exactly. Attention moves information between rows; the MLP thinks it over inside each row.']])}
        ${quiz('To make its guess, GPT-2 compares the final row with…',[
          ['Every row of the token table, all 50,257 of them',1,'Yes! A dot product with every token row gives the logits, and softmax turns them into probabilities.'],
          ['Only the tokens already in the sentence',0,'Then it could never write a new word! It scores the whole vocabulary.']])}`)}
      ${callout(`<b>That’s Chapter 5!</b> You can now follow a real Transformer from a sentence, through tokens, rows, attention, feed-forward layers and twelve blocks, all the way to brand-new text. If a stop still feels fuzzy, the sidebar and the Back button will take you right back to it. And if you want to go further, my favourite next steps are in the reading list just below.`)}`
  };
}

const lessons={overview,tokens,position,add,query,key,attention,values,heads,mlp,blocks,prediction,generate,practice};
export function createTour(root,change,refresh,{review=true}={}){
  const defaults={axis:0,feature:0,delta:0,unit:-1,depthAxis:0,layer:12,share:-1,seed:0,gen:0};
  let state={...defaults},signature='',last=null;
  // Charts use the wide canvas when the lesson area itself is wide, not the window:
  // on the chapter page a sidebar can take part of the window.
  const host=root.parentElement,isWide=()=>(host.clientWidth||innerWidth)>=820;
  new ResizeObserver(()=>{if(last&&isWide()!==WIDE)refresh();}).observe(host);
  function build(slug,ctx){
    WIDE=isWide();
    const pass=ctx.pass,trim=i=>pass.pieces[i].trim()||pass.pieces[i];
    return lessons[slug]({...ctx,state,h:pass.block.heads[ctx.head],W:esc(trim(ctx.r)),S:esc(trim(ctx.s)),wt:trim(ctx.r),st:trim(ctx.s)});
  }
  function act(el,key,val){
    const attr=el.hasAttribute('data-field')?'data-field':'data-tour',saved=el.getAttribute(attr);
    if(key==='draw'){state.seed++;refresh();}
    else if(key==='gen'){state.gen=val==='next'?state.gen+1:0;refresh();}
    else if(Object.hasOwn(defaults,key)){state[key]=Number(val);refresh();}
    else change(key,val);
    (root.querySelector(`[${attr}="${saved}"]`)||root.querySelector(`[${attr}^="${key}"]`))?.focus({preventScroll:true});
  }
  function checkByHand(box){
    const fb=box.querySelector('.byhand-fb'),raw=box.querySelector('[data-byhand-input]').value.replace(/[−–]/g,'-').replace(/[%\s]/g,'').replace(',','.');
    const v=Number(raw),ans=Number(box.dataset.answer),digits=Number(box.dataset.digits),off=Math.abs(v-ans);
    if(raw===''||!Number.isFinite(v)){fb.textContent='Type a number first, then press Check.';fb.dataset.result='wrong';return;}
    if(off<=.5*10**-digits+1e-12){fb.textContent='Correct! That’s exactly the number GPT-2 used.';fb.dataset.result='right';}
    else if(off<=Number(box.dataset.tol)){fb.textContent=`Correct! (GPT-2 has ${ans.toFixed(digits)}; the tiny difference is just rounding.)`;fb.dataset.result='right';}
    else{fb.textContent='Not quite. Have another go, or open a hint.';fb.dataset.result='wrong';}
  }
  root.addEventListener('click',e=>{
    const a=e.target.closest('[data-answer]');
    if(a&&a.matches('button')){
      const box=a.closest('.quiz'),fb=box.querySelector('.quiz-fb');
      box.querySelectorAll('[data-answer]').forEach(b=>b.setAttribute('aria-pressed',String(b===a)));
      fb.textContent=a.dataset.fb;fb.dataset.result=a.dataset.answer==='1'?'right':'wrong';return;
    }
    const hb=e.target.closest('[data-byhand]');
    if(hb){
      const box=hb.closest('.byhand'),job=hb.dataset.byhand;
      if(job==='check')checkByHand(box);
      if(job==='hint'){const next=box.querySelector('.byhand-hints li[hidden]');if(next)next.hidden=false;if(!box.querySelector('.byhand-hints li[hidden]')){hb.disabled=true;hb.textContent='No more hints';}}
      if(job==='reveal'){box.querySelector('.byhand-solution').hidden=false;hb.disabled=true;}
      return;
    }
    const b=e.target.closest('[data-tour]');
    if(b){const [k,v]=b.dataset.tour.split(':');act(b,k,v);}
  });
  root.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.matches('[data-byhand-input]')){e.preventDefault();checkByHand(e.target.closest('.byhand'));}});
  root.addEventListener('change',e=>{if(e.target.matches('[data-field]'))act(e.target,e.target.dataset.field,e.target.value);});
  // Dragging a slider patches only its live result, so the slider keeps the pointer.
  root.addEventListener('input',e=>{
    const el=e.target.closest('[data-range]');if(!el||!last)return;
    state[el.dataset.range]=Number(el.value);
    const tpl=document.createElement('template');tpl.innerHTML=build(...last).body;
    root.querySelectorAll('[data-live]').forEach(n=>{const fresh=tpl.content.querySelector(`[data-live="${n.dataset.live}"]`);if(fresh)n.innerHTML=fresh.innerHTML;});
    root.querySelector('[data-tour="share:-1"]')?.setAttribute('aria-pressed','false');
  });
  return function show(slug,ctx,before){
    const sig=[slug,ctx.example,ctx.r,ctx.s,ctx.head].join(':');
    if(sig!==signature){state={...defaults};signature=sig;}
    last=[slug,ctx];
    const lesson=build(slug,ctx),compare=review&&before&&before[0];
    root.innerHTML=`<h2 id="tourTitle">${lesson.heading}</h2>${lesson.body}${compare?`
      <details class="lesson-review"><summary>Author review: compare with the earlier explanation</summary><p><del class="review-remove">${esc(before[0])} ${esc(before[1])}</del></p><p><ins class="review-add">${lesson.lead}. ${lesson.intro.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim()}</ins></p></details>`:''}`;
    root.dataset.lesson=slug;
    return [lesson.title,lesson.guide,lesson.lead,lesson.intro];
  };
}
