const names=['Tokens','Token embedding','Position embedding','Add'];
const shown=s=>s.replace(/^ /,'␣'), f=n=>n.toFixed(5);
const btn=(key,text,pressed)=>`<button type="button" data-input="${key}"${pressed===undefined?'':` aria-pressed="${pressed}"`}>${text}</button>`;

function rowProfile(values,start,label){
  const scale=Math.max(...values.map(Math.abs)),lines=[[],[]];
  values.forEach((v,i)=>lines[Number(v>=0)].push(`M${i+.5} 20v${scale?(-18*v/scale).toFixed(2):0}`));
  const profile=`<svg class="profile" viewBox="0 0 768 40" preserveAspectRatio="none" role="img" aria-label="All 768 signed coordinates of the ${label} row"><path d="M0 20h768" stroke="var(--cp-border-strong)"/><path d="${lines[0].join('')}" stroke="var(--cp-danger)"/><path d="${lines[1].join('')}" stroke="var(--cp-success)"/><rect x="${start}" width="4" height="40" fill="none" stroke="var(--cp-text)"/></svg>`;
  return {profile,scale};
}

function embeddingLesson({pass,r,col,example,chapter,safe}){
  const {pieces,tokenIds,embeddings,positions}=pass;
  const word=i=>safe(shown(pieces[i])),w=word(r),id=tokenIds[r],row=embeddings[r],n=row.length;
  const start=col-col%4,cols=[start,start+1,start+2,start+3];
  const rows=[...new Set(tokenIds)].sort((a,b)=>a-b).map(k=>k===id?r:tokenIds.indexOf(k));
  const {profile,scale}=rowProfile(row,start,'token embedding');
  const checkOpen=chapter.querySelector('.embedding-code')?.open;
  const matrix=rows.map(i=>`<tr${tokenIds[i]===id?' class="is-row"':''}><th scope="row">${btn('row:'+i,`${word(i)}<small>ID ${tokenIds[i]}</small>`,tokenIds[i]===id)}</th>
    ${cols.map(k=>`<td${i===r&&k===col?' class="is-cell"':''}>${f(embeddings[i][k])}</td>`).join('')}</tr>`).join('');
  const compare=example==='repeat'
    ?`<p>Select either occurrence to follow it in the graph. Both lookups return the same ${n} numbers, not just the matching coordinate shown here.</p>
      <div class="occurrence-check">${[1,4].map(i=>btn(`seat:${i}`,`Place ${i+1}: ${word(i)} · ID ${tokenIds[i]} · coordinate ${col+1} = ${f(embeddings[i][col])}`,r===i)).join('')}</div>
      <p>What differs is the place. At this coordinate the <em>position</em> table gives ${f(positions[1][col])} at place 2 and ${f(positions[4][col])} at place 5. Those numbers belong to the lower branch, not to the token embedding.</p>
      ${btn('example:restore','Restore previous sentence')}`
    :`<p>In “The cat saw the cat”, the first cat does the seeing and the second one is seen. Make a guess before you click: does GPT-2 fetch two different token rows for those two jobs?</p>
      ${btn('example:repeat','Compare the two ␣cat occurrences')}`;
  const quiz=`<div class="quiz" role="group" aria-label="Quick check"><p class="quiz-q"><span class="quiz-tag">Quick check</span> You switch from coordinate 1 to coordinate 2. What changed inside the model?</p><div class="quiz-opts">${[
    ['Nothing. I’m just reading a different number from the same row.',1,'Exactly! The model always uses all 768 numbers. Picking a coordinate only changes which one you’re looking at.'],
    ['The model now uses a different row.',0,'The row is chosen by the token ID, and that didn’t change. You moved across the row, not down the table.'],
    ['The token got a new ID.',0,'The ID comes from the tokenizer and never changes. You only moved across the same row.']].map(([t,ok,fb])=>`<button type="button" data-answer="${ok}" data-fb="${safe(fb)}" aria-pressed="false">${t}</button>`).join('')}</div><p class="quiz-fb" aria-live="polite"></p></div>`;
  chapter.innerHTML=`<h2 id="embeddingTableTitle">Read the embedding table: choose a row, then a column</h2>
    <p>Think of a spreadsheet. The token ID takes you <em>down</em> to a row. A coordinate takes you <em>across</em> that row to one cell. Try clicking a different column heading without changing the token. Then keep the column and pick a different token. Which number on the map changes each time?</p>
    <div class="embedding-grid">
      <section aria-label="Token table explorer">
        <div class="input-action"><label>Inspect coordinate (1 to ${n}) <input id="coordinate" type="number" min="1" max="${n}" step="1" required value="${col+1}"></label></div>
        <table class="lookup" aria-label="Learned token embeddings: vocabulary rows by coordinate"><thead><tr><th scope="col">Token row</th>${cols.map(k=>`<th scope="col">${btn(`col:${k}`,k+1,k===col)}</th>`).join('')}</tr></thead><tbody>${matrix}</tbody></table>
        <p class="embedding-caption">Showing the ${rows.length} distinct vocabulary rows used by this sentence, sorted by ID, and columns ${start+1} to ${start+4} of ${n}. Other columns are hidden, not set to zero. Values are rounded to five decimal places. ␣ marks a leading space.</p>
      </section>
      <figure><h3>The entire row for “${w}”</h3>${profile}<div class="profile-axis"><span>1</span><span>Coordinate</span><span>${n}</span></div>
        <figcaption><p>One mark per coordinate, in order. Above the center line means positive; below means negative. The tallest mark has magnitude ${f(scale)}. The outline locates the four columns shown in the table.</p></figcaption>
        <div class="lookup-readout"><span>ID <b>${id}</b> · coordinate <b>${col+1}</b></span><output>${f(row[col])}</output></div>
        <details class="embedding-code"${checkOpen?' open':''}><summary>See the lookup in code</summary>
        <p><code>wte.weight[${id}]</code> retrieves the whole token row. <code>wte.weight[${id}, ${col}]</code> reads just the highlighted number. Code counts columns from zero, so index ${col} means coordinate ${col+1} on this page.</p></details>
      </figure>
    </div>
    <div class="embedding-grid embedding-tail">
      <section><h3>Who chose these numbers?</h3>
        <p>Nobody did! When training started, every number in this table was random. Then GPT-2 read an enormous amount of text, guessing the next token over and over. Every time it guessed wrong, training nudged the numbers (these ones included) a tiny bit in the direction that would have made the guess better. After a huge number of nudges, this is where they ended up.</p>
        <p>So please don’t try to read ${f(row[col])} as “verb-ness” or “animal-ness”. No single column has a clean human meaning; it’s the pattern across the whole row that later layers learn to use. And just to be clear: we’re only reading saved numbers here. Nothing on this page is training the model.</p>
      </section>
      <section aria-labelledby="repeatTitle"><h3 id="repeatTitle">Can a token tell where it appeared?</h3>${compare}</section>
    </div>
    ${quiz}
    <p class="bridge">Every token now has its 768-number row, so our ${pieces.length} tokens give us ${pieces.length} rows × ${n} numbers. But notice what’s missing. Both cats in “The cat saw the cat” get <em>exactly</em> the same row! The token table knows <em>what</em> a token is, but not <em>where</em> it sits. Press <a href="#next">Next</a> and let’s fix that.</p>`;
  return [
    'You’re looking at one of 768 numbers',
    `The box on the map shows ${f(row[col])} because you’re looking at coordinate ${col+1}. The model uses all ${n} numbers at once; the map only has room to show one of them.\n\nThe seat number (${r+1}) tells you where “${shown(pieces[r])}” sits in the sentence. It doesn’t pick a column. Change the coordinate in the table below and watch which number on the map changes.`,
    'Why one ID gives you 768 numbers',
    `<p>The tokenizer gave “${w}” just one number: <b>${id}</b>. But that number is only an address, like a locker number. Knowing that one locker number is bigger than another tells you nothing about what’s inside.</p>
     <p>So let’s open the locker! GPT-2 small keeps a giant learned table with <b>50,257 rows</b>, one for every token it knows, and <b>${n} numbers in every row</b>. Go to row ${id} and read across. <strong>That whole list of ${n} numbers is the token embedding.</strong> Each slot in the list is called a <em>coordinate</em>.</p>
     <p class="equation numbers">“${w}” → [${Array.from(row.slice(0,4),f).join(', ')}, …]<br><small>First 4 of ${n} coordinates in row ${id}</small></p>`,
    ''
  ];
}

export function createInputStudy({root,mathRoot,chapter,experiment,safe,selectReader,setExample,refresh}){
  let part=0,col=0;
  for(const surface of [root,mathRoot,chapter,experiment])surface.addEventListener('click',e=>{
    const a=e.target.closest('[data-answer]');
    if(a){
      const box=a.closest('.quiz'),fb=box.querySelector('.quiz-fb');
      box.querySelectorAll('[data-answer]').forEach(o=>o.setAttribute('aria-pressed',String(o===a)));
      fb.textContent=a.dataset.fb;fb.dataset.result=a.dataset.answer==='1'?'right':'wrong';return;
    }
    const b=e.target.closest('[data-input]');if(!b)return;
    const key=b.dataset.input,[kind,arg]=key.split(':');
    if(kind==='seat'||kind==='row')selectReader(Number(arg));
    if(kind==='col')col=Number(arg);
    if(kind==='example')setExample(arg);
    refresh();(surface.querySelector(`[data-input="${key}"]`)||surface.querySelector(`[data-input^="${kind}:"]`))?.focus({preventScroll:true});
  });
  for(const surface of [mathRoot,chapter])surface.addEventListener('change',e=>{
    if(e.target.id!=='coordinate')return;
    if(!e.target.value||!e.target.reportValidity())return;
    col=Number(e.target.value)-1;refresh();surface.querySelector('#coordinate').focus({preventScroll:true});
  });
  function present({pass,reader:r,example}){
    const {pieces,tokenIds,embeddings,positions,input}=pass;
    const n=pieces.length,id=tokenIds[r],w=shown(pieces[r]),pos=r+1,e=embeddings[r],p=positions[r],x=input[r];
    let html='',mathHtml='',lesson;
    if(part===1){
      root.replaceChildren();mathRoot.replaceChildren();experiment.replaceChildren();
      return embeddingLesson({pass,r,col,example,chapter,safe});
    }
    if(part===0){
      const groups=[];
      pieces.forEach((s,i)=>{if(!i||s.startsWith(' '))groups.push([]);groups.at(-1).push(i);});
      html+=`<p class="input-caption">One branch per word. Select a piece to follow its row. ␣ means a leading space.</p>
      <div class="word-stream">${groups.map(g=>`<div class="word-branch"><b>${safe(g.map(i=>pieces[i]).join('').trim())}</b><div class="word-leaves ${g.length>1?'split':''}">${g.map(i=>btn(`seat:${i}`,`<b>${safe(shown(pieces[i]))}</b><small>ID ${tokenIds[i]}</small><small>position ${i+1}</small>`,r===i)).join('')}</div></div>`).join('')}</div>
      <p class="input-caption"><b>${groups.length} words → ${n} tokens.</b> ${example==='split'?'“overfed” fills two places. “␣the” moves to place 4, still ID 262.':''}</p>`;
      experiment.innerHTML=example==='split'?btn('example:base','Compare with “fed”'):btn('example:split','Try “overfed”');
      lesson=['An ID identifies a piece. A position identifies an occurrence.',`Look at “${w}”: ID ${id}, position ${pos}. The text of that piece determines the vocabulary entry; the preceding pieces determine its position. Change “fed” to “overfed” and the later pieces move one place even though their IDs have not changed.\n\nThe next step uses these exact IDs in this same GPT-2 checkpoint. Selecting a piece also selects its row in the graph above.`, 'The actual token IDs',`<p class="numbers">[${tokenIds.join(', ')}]</p>`,`Joining these decoded pieces, including spaces, reconstructs “${pass.text}”. GPT-2's vocabulary has 50,257 entries. The IDs are addresses, not measures of similarity.`];
    }else{
      const start=Math.floor(col/4)*4,cols=[start,start+1,start+2,start+3];
      const {profile,scale}=rowProfile(part===2?p:x,start,names[part]);
      const eq=`${f(e[col])} + (${f(p[col])}) ≈ ${f(x[col])}`;
      const row=(title,vs)=>`<tr><th scope="row">${title}</th>${cols.map(k=>`<td class="${k===col?'picked':''}" title="${vs[k]}">${vs[k].toFixed(4)}</td>`).join('')}</tr>`;
      html=`<div class="seat-stream" aria-label="Token occurrences">${pieces.map((s,i)=>`<button type="button" data-input="seat:${i}" aria-pressed="${r===i}" aria-label="${safe(shown(s))}, position ${i+1}">${safe(shown(s))}<sup>${i+1}</sup></button>`).join('')}</div>
      <p class="input-caption">“${safe(w)}” at place ${pos} · tracing coordinate ${col+1} of 768</p>`;
      mathHtml=`<div class="input-action"><label>Inspect coordinate (1 to 768) <input id="coordinate" type="number" min="1" max="768" required step="1" value="${col+1}"></label></div>
      <table class="lookup" aria-label="GPT-2 embedding values"><thead><tr><th>Coordinate</th>${cols.map(k=>`<th scope="col">${btn(`col:${k}`,k+1,k===col)}</th>`).join('')}</tr></thead><tbody>${row('Token · ID '+id,e)}${part>1?row('+ Position '+pos,p):''}${part===3?row('= Input row',x):''}</tbody></table>
      ${profile}<p class="input-rule">${names[part]}: all 768 coordinates, positive above zero and negative below. The largest magnitude here is ${f(scale)}; the outline marks the four displayed columns.</p>`;
      experiment.innerHTML=example==='repeat'?btn('example:restore','Restore previous sentence'):btn('example:repeat','Compare two occurrences of “␣cat”');
      if(example==='repeat')mathHtml+=`<p class="input-rule">Both “␣cat” tokens use ID 3797. At coordinate ${col+1}, both token rows give <b>${f(embeddings[1][col])}</b>. The position row gives <b>${f(positions[1][col])}</b> at place 2 and <b>${f(positions[4][col])}</b> at place 5.</p>`;
      lesson=part===2?['Hold identity fixed and move the token.',
        `Now follow the lower branch. “${w}” occupies place ${pos}, so GPT-2 looks up row ${r} of a different learned table. Its coordinate ${col+1} is ${f(p[col])}. Any token in this same seat would get precisely that position value.\n\nTry the two copies of “␣cat” in “The cat saw the cat”. Both include the leading space, so they really do share an ID. Select place 2, then place 5. The token row stays fixed; the position row changes. Next adds those rows, not the integer seat number.`,
        'A second table, a different address',`<p><code>wpe.weight[${r}, ${col}]</code> = <b>${f(p[col])}</b>. Place ${pos} uses table index ${r}.</p>`,
        `GPT-2 has 1,024 learned position rows, each 768 numbers wide. Other architectures may use rotary position information on queries and keys rather than adding a position row to the input.`]:
      ['Two stored numbers become one working coordinate.',
        `In coordinate ${col+1} the token brings ${f(e[col])} and this position brings ${f(p[col])}. The signs matter: two contributions can reinforce one another or partly cancel. The result is ${f(x[col])}. Read another column and the rule is identical.\n\nNow replace a different token without changing this token’s ID or its place. This input row would stay the same. It knows identity and position, but not its neighbors. The first block’s attention is where information can cross between rows.`,
        `One of ${n} rows that enter block 1`,`<p class="numbers">${eq}</p>`,`For each row in the ${n} × 768 input, token and position coordinates are added before rounding for display. The captured forward pass used every coordinate, all 12 heads in each of 12 blocks, and all 50,257 output logits.`];
    }
    root.innerHTML=html;mathRoot.innerHTML=mathHtml;return lesson;
  }
  return {present,setPart(p){part=p;},setCoordinate(c){col=c;},get part(){return part;},get coordinate(){return col;},get start(){return Math.floor(col/4)*4;},get label(){return names[part];},get next(){return names[part+1];}};
}
