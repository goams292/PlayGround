(() => {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  const colors = [
    {id:'moss', name:'Moss crew', role:'THE GARDENERS', color:'#91ba79', hex:'#91ba79', start:0, home:'lane-green', lane:[[7,1],[7,2],[7,3],[7,4],[7,5]], base:[0,0], spots:[[1.65,1.65],[3.3,1.65],[1.65,3.3],[3.3,3.3]], safe:0},
    {id:'honey', name:'Honey crew', role:'THE NIGHT OWLS', color:'#e4bd70', hex:'#e4bd70', start:13, home:'lane-gold', lane:[[1,7],[2,7],[3,7],[4,7],[5,7]], base:[0,9], spots:[[10.65,1.65],[12.3,1.65],[10.65,3.3],[12.3,3.3]], safe:13},
    {id:'berry', name:'Berry crew', role:'THE SNEAKS', color:'#df8779', hex:'#df8779', start:26, home:'lane-red', lane:[[7,13],[7,12],[7,11],[7,10],[7,9]], base:[9,9], spots:[[10.65,10.65],[12.3,10.65],[10.65,12.3],[12.3,12.3]], safe:26},
    {id:'blue', name:'Blue crew', role:'THE LOOKOUTS', color:'#8eadd9', hex:'#8eadd9', start:39, home:'lane-blue', lane:[[13,7],[12,7],[11,7],[10,7],[9,7]], base:[9,0], spots:[[1.65,10.65],[3.3,10.65],[1.65,12.3],[3.3,12.3]], safe:39}
  ];
  const track = [];
  for(let c=1;c<=5;c++) track.push([6,c]);
  for(let r=5;r>=0;r--) track.push([r,6]);
  track.push([0,7],[0,8]);
  for(let r=1;r<=5;r++) track.push([r,8]);
  for(let c=9;c<=14;c++) track.push([6,c]);
  track.push([7,14],[8,14]);
  for(let c=13;c>=9;c--) track.push([8,c]);
  for(let r=9;r<=14;r++) track.push([r,8]);
  track.push([14,7],[14,6]);
  for(let r=13;r>=9;r--) track.push([r,6]);
  for(let c=5;c>=0;c--) track.push([8,c]);
  track.push([7,0],[6,0]);
  const safeIndexes = new Set([0,8,13,21,26,34,39,47]);
  const svg = document.getElementById('board');
  const boardNS = (tag, attrs={}, parent=svg) => {const e=document.createElementNS(NS,tag);for(const [k,v] of Object.entries(attrs))e.setAttribute(k,v);parent.appendChild(e);return e;};
  const cellRect=(r,c,cls,parent=svg,extra={})=>boardNS('rect',{x:c*40,y:r*40,width:40,height:40,rx:4,class:cls,...extra},parent);
  function buildBoard(){
    const defs=boardNS('defs');
    defs.innerHTML=`<linearGradient id="grassFill" x2="0.8" y2="1"><stop stop-color="#b6c991"/><stop offset="1" stop-color="#839e68"/></linearGradient><linearGradient id="yardFill" x2="0" y2="1"><stop stop-color="#84a966"/><stop offset="1" stop-color="#618451"/></linearGradient><pattern id="grass" width="40" height="40" patternUnits="userSpaceOnUse"><rect width="40" height="40" fill="url(#yardFill)"/><path d="M5 8l2-4m6 22 2-4m16-13 2-4M7 36l2-4m19 4 2-4" stroke="#d3df9c" opacity=".22" stroke-width="1.6"/><circle cx="23" cy="19" r="1" fill="#d5d99e" opacity=".25"/></pattern><pattern id="plank" width="14" height="14" patternUnits="userSpaceOnUse"><rect width="14" height="14" fill="#61744d"/><path d="M0 1h14M0 13h14" stroke="#a6b27a" opacity=".14"/></pattern><filter id="soft"><feGaussianBlur stdDeviation="3"/></filter>`;
    boardNS('rect',{width:600,height:600,fill:'#677e53'});
    for(let r=0;r<15;r++)for(let c=0;c<15;c++)cellRect(r,c,'yard-cell');
    // Four cozy hideouts
    const houses=[{x:0,y:0,fill:'#56774d',name:'MOSS',sub:'THE GREENHOUSE'},{x:360,y:0,fill:'#94733e',name:'HONEY',sub:'THE TREEHOUSE'},{x:360,y:360,fill:'#8b514b',name:'BERRY',sub:'THE TOOL SHED'},{x:0,y:360,fill:'#526b91',name:'BLUE',sub:'THE POTTER’S SHED'}];
    for(const h of houses){
      boardNS('rect',{x:h.x+5,y:h.y+5,width:230,height:230,rx:15,fill:h.fill,stroke:'#e9dfc6', 'stroke-width':2,opacity:.97});
      boardNS('rect',{x:h.x+12,y:h.y+12,width:216,height:216,rx:11,fill:'none',stroke:'#e5d6b1','stroke-width':1,opacity:.35});
      boardNS('path',{d:`M${h.x+17} ${h.y+75}V${h.y+39}l98-25 98 25v36`,fill:'none',stroke:'#e9dfc6','stroke-width':4,'stroke-linejoin':'round',opacity:.8});
      boardNS('rect',{x:h.x+35,y:h.y+81,width:170,height:128,rx:10,fill:'url(#plank)',stroke:'#d5caab','stroke-width':2});
      boardNS('text',{x:h.x+120,y:h.y+57,'text-anchor':'middle',class:'house-label'}).textContent=h.name+' HIDEOUT';
      boardNS('text',{x:h.x+120,y:h.y+102,'text-anchor':'middle',class:'house-small'}).textContent=h.sub;
      // soft home spots
      const crew=colors.find(c=>c.base[0]===h.y/40 && c.base[1]===h.x/40);
      crew.spots.forEach(([sx,sy])=>{boardNS('circle',{cx:sx*40+20,cy:sy*40+20,r:22,fill:'#16241a',opacity:.23,stroke:'#e8dfc8','stroke-width':1,'stroke-dasharray':'3 4'});});
    }
    // Backyard path and safe patches
    track.forEach(([r,c],i)=>{cellRect(r,c,safeIndexes.has(i)?'path-cell safe-cell':'path-cell');if(safeIndexes.has(i))boardNS('text',{x:c*40+20,y:r*40+25,'text-anchor':'middle',class:'goal-star'}).textContent='✳';});
    // Colored entry gates and home lanes
    colors.forEach((crew)=>{
      crew.lane.forEach(([r,c],i)=>{cellRect(r,c,crew.home);if(i<4)boardNS('circle',{cx:c*40+20,cy:r*40+20,r:4,fill:crew.hex,opacity:.6});});
      const [sr,sc]=track[crew.start];
      boardNS('rect',{x:sc*40+4,y:sr*40+4,width:32,height:32,rx:6,fill:crew.hex,opacity:.9,stroke:'#f9edcf','stroke-width':1.4});
      boardNS('path',{d:`M${sc*40+12} ${sr*40+22}l7 7 11-15`,stroke:'#fff3d3','stroke-width':2.4,fill:'none','stroke-linecap':'round','stroke-linejoin':'round'});
    });
    // Center oak-tree finish medallion
    boardNS('circle',{cx:300,cy:300,r:72,fill:'#354c35',stroke:'#e4d7b4','stroke-width':3});
    boardNS('circle',{cx:300,cy:300,r:62,fill:'#d9c99f',stroke:'#72815e','stroke-width':2});
    boardNS('path',{d:'M300 248 352 300 300 352 248 300Z',fill:'#829b69',stroke:'#f4e8c9','stroke-width':2});
    boardNS('path',{d:'M300 255 345 300 300 300Z',fill:'#d9b66d'});boardNS('path',{d:'M345 300 300 345 300 300Z',fill:'#d77d6e'});boardNS('path',{d:'M300 345 255 300 300 300Z',fill:'#7794c2'});boardNS('path',{d:'M255 300 300 255 300 300Z',fill:'#80a66e'});
    boardNS('circle',{cx:300,cy:300,r:18,fill:'#f0dfb8',stroke:'#697c55','stroke-width':1.5});
    boardNS('path',{d:'M300 289c-10-10-20-4-16 5 2 5 10 8 16 15 6-7 14-10 16-15 4-9-6-15-16-5Z',fill:'#536e4a'});
    // garden flecks beyond house and path lend the board a lived-in look
    const decor=boardNS('g',{class:'yard-decoration'});
    [[264,69,'✦'],[335,100,'·'],[276,537,'✧'],[335,495,'·'],[60,260,'✧'],[107,336,'·'],[538,270,'✦'],[493,330,'·']].forEach(([x,y,t])=>boardNS('text',{x,y,fill:'#e5dca9','font-size':t==='·'?12:16,'text-anchor':'middle'},decor).textContent=t);
    boardNS('g',{id:'pieces'});
  }
  buildBoard();
  const initialState=()=>({tokens:colors.map(()=>Array.from({length:4},()=>({step:-1}))), current:0, dice:null, legal:[], phase:'roll', round:1, winner:null, message:'Bring a rogue out of hiding with a six.', event:'The neighbors are asleep. Probably.', lastCapture:null});
  let state=initialState(), busy=false, muted=false, toastTimer, gameId=0;
  const schedule=(callback,delay)=>{const id=gameId;return setTimeout(()=>{if(id===gameId)callback();},delay);};
  const el=id=>document.getElementById(id);
  const pieceLayer=document.getElementById('pieces');
  const coordsFor=(ci,ti)=>{
    const token=state.tokens[ci][ti],crew=colors[ci];
    if(token.step<0){const [x,y]=crew.spots[ti];return [x*40+20,y*40+20];}
    if(token.step>=57){return [300+(ci===0?-19:ci===2?19:0),300+(ci===1?-19:ci===3?19:0)];}
    if(token.step>=52){const [r,c]=crew.lane[token.step-52];return [c*40+20,r*40+20];}
    const [r,c]=track[(crew.start+token.step)%52];return [c*40+20,r*40+20];
  };
  const globalPos=(ci,ti)=>{const s=state.tokens[ci][ti].step;return s>=0&&s<52?(colors[ci].start+s)%52:null;};
  const getLegal=(ci,roll)=>state.tokens[ci].map((t,i)=>({t,i})).filter(({t})=>t.step<0?roll===6:t.step<57&&t.step+roll<=57).map(x=>x.i);
  function captureThreat(ci,ti){
    const target=globalPos(ci,ti);
    if(target===null||safeIndexes.has(target)||state.phase!=='choose'||state.current===ci)return false;
    return state.legal.some(ownTi=>{
      const own=state.tokens[state.current][ownTi];
      const next=own.step<0?0:own.step+state.dice;
      return next<52&&(colors[state.current].start+next)%52===target;
    });
  }
  function drawPawn(parent,x,y,ci,ti,interactive=false){
    const crew=colors[ci], token=state.tokens[ci][ti], movable=state.current===ci&&state.legal.includes(ti)&&state.phase==='choose';
    const g=boardNS('g',{class:`pawn${movable?' movable':''}${state.lastCapture===`${ci}-${ti}`?' caught':''}`,transform:`translate(${x} ${y})`,tabindex:movable?'0':'-1',role:movable?'button':undefined,'aria-label':`${crew.name} rogue ${ti+1}${movable?', tap to move':''}`,'data-ci':ci,'data-ti':ti},parent);
    if(movable){const ring=boardNS('circle',{cx:0,cy:1,r:15,fill:'none',stroke:'#ffe390','stroke-width':1.5,'stroke-dasharray':'3 2'},g);}
    boardNS('ellipse',{cx:0,cy:10,rx:11,ry:4,class:'pawn-shadow'},g);
    // Tiny masked garden rascal, with a bright little knife prop in hand.
    boardNS('path',{d:'M-8 9Q-8 2-6-2L-3-5H3L6-2Q8 2 8 9L5 12H-5Z',fill:crew.color,class:'body'} ,g);
    boardNS('circle',{cx:0,cy:-8,r:5.2,fill:'#dbc7a0',class:'head'},g);
    boardNS('path',{d:'M-5-8Q0-15 5-8L4-6H-4Z',fill:'#26362c'},g);
    boardNS('path',{d:'M-5 1-10 5M5 1l8-5',stroke:crew.color,'stroke-width':3,'stroke-linecap':'round'},g);
    // Hilt and silver blade, held away from the little character.
    boardNS('path',{d:'M9-3l4-5 2-1-1 3-4 5',fill:'#d9e0d1',stroke:'#fff0cd','stroke-width':.8,'stroke-linejoin':'round'},g);
    boardNS('path',{d:'M8-1l3 2',class:'knife-hilt'},g);
    if(token.step>=57){boardNS('path',{d:'M-3 3l3 3 4-6',stroke:'#f7eed4','stroke-width':2,'fill':'none','stroke-linecap':'round','stroke-linejoin':'round'},g);}
    if(captureThreat(ci,ti)||state.lastCapture===`${ci}-${ti}`){
      const badge=boardNS('g',{class:'backstab visible',transform:'translate(8 6)'},g);
      boardNS('circle',{cx:0,cy:0,r:6,class:'backstab-disc'},badge);
      boardNS('path',{d:'M-2 2 2-2M-2-2l4 4'},badge);
    }
    if(movable){g.addEventListener('click',()=>moveToken(ci,ti));g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();moveToken(ci,ti);}});}
    return g;
  }
  function renderPieces(){
    pieceLayer.replaceChildren();
    const positions=new Map();
    colors.forEach((crew,ci)=>state.tokens[ci].forEach((token,ti)=>{
      let [x,y]=coordsFor(ci,ti);
      if(token.step>=0&&token.step<57){const key=`${Math.round(x)},${Math.round(y)}`;const n=positions.get(key)||0;positions.set(key,n+1);if(n){const angle=(n*2.35)+(ci*.65);x+=Math.cos(angle)*8;y+=Math.sin(angle)*8;}}
      if(token.step>=57){x+=((ti%2)*12)-6;y+=((Math.floor(ti/2))*10)-5;}
      drawPawn(pieceLayer,x,y,ci,ti,true);
    }));
  }
  function renderRoster(){
    el('roster').innerHTML=colors.map((crew,ci)=>{
      const home=state.tokens[ci].filter(t=>t.step>=57).length;
      const out=state.tokens[ci].filter(t=>t.step>=0&&t.step<57).length;
      return `<div class="crew-row ${state.current===ci?'crew-active':''}" style="--crew:${crew.hex}"><span class="crew-turn">${state.current===ci?'✦':''}</span><i class="crew-swatch"></i><span class="crew-name">${crew.name}<small class="crew-role">${crew.role}</small></span><span class="crew-count"><b>${home}</b> / ${out}</span></div>`;
    }).join('');
  }
  function render(){
    renderPieces();renderRoster();
    const crew=colors[state.current];
    el('turnPill').style.setProperty('--crew',crew.hex);
    el('turnPill').style.borderColor=`${crew.hex}66`;
    el('turnPillText').textContent=state.current===0?'YOUR TURN':`${crew.name.toUpperCase()} TURN`;
    el('turnPill').style.color=state.current===0?'#d9c99e':crew.hex;
    el('statusTitle').textContent=state.winner!==null?`${colors[state.winner].name} wins!`:state.phase==='choose'?'Pick a rogue':state.phase==='busy'?'Making a move…':state.phase==='extra'?'Roll again':state.current===0?'Roll to begin':`${crew.name} is up`;
    el('roundCount').textContent=`ROUND ${String(state.round).padStart(2,'0')}`;
    el('moveMessage').textContent=state.message;
    el('eventText').textContent=state.event;
    const canRoll=!busy&&state.winner===null&&state.current===0&&(state.phase==='roll'||state.phase==='extra');
    el('rollBtn').disabled=!canRoll;el('die').disabled=!canRoll;
    el('rollBtn').querySelector('span').textContent=state.phase==='extra'?'ROLL AGAIN':state.phase==='choose'?'CHOOSE A ROGUE':'ROLL THE DICE';
    el('pipGrid').dataset.value=state.dice||1;
    el('diceHint').textContent=state.dice?`LAST ROLL · ${state.dice}`:'YOUR LUCK IS WAITING';
    el('turnPill').querySelector('.turn-dot').style.background=crew.hex;
  }
  function notify(message){const t=el('toast');t.textContent=message;t.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('show'),2100);}
  function setStatus(message,event){state.message=message;if(event)state.event=event;render();}
  function roll(){
    if(busy||state.winner!==null||(state.current===0&&!['roll','extra'].includes(state.phase)))return;
    busy=true;state.phase='busy';render();
    el('diceStage').classList.remove('rolling');void el('diceStage').offsetWidth;el('diceStage').classList.add('rolling');
    const roller=state.current;
    schedule(()=>{
      const value=1+Math.floor(Math.random()*6);state.dice=value;state.legal=getLegal(roller,value);busy=false;
      if(!state.legal.length){
        state.message=value===6?'A six, but no moves left in the yard.':`No move for ${value}. The yard keeps its secrets.`;
        state.event=value===6?'A lucky six goes nowhere this time.':'No clean move. Pass the garden gate.';
        state.phase=value===6?'extra':'roll';
        if(value===6){state.message='Six! No move this time, but you get another roll.';render();if(roller!==0)schedule(roll,900);}
        else schedule(advanceTurn,900);
      }else{
        state.phase='choose';state.message=value===6?'Six! Choose a hideout rogue or advance one already out.':`You rolled ${value}. Tap a glowing rogue to move.`;
        state.event=value===6?'A perfect six. The garden gate swings open.':'Something rustled in the grass…';
        render();
        if(roller!==0)schedule(aiChoose,650);
      }
    },520);
  }
  function advanceTurn(){
    if(state.winner!==null)return;
    state.current=(state.current+1)%colors.length;
    if(state.current===0)state.round++;
    state.phase='roll';state.legal=[];state.dice=null;state.lastCapture=null;busy=false;
    state.message=state.current===0?'Bring a rogue out of hiding with a six.':`${colors[state.current].name} is sizing up the yard.`;
    render();
    if(state.current!==0)schedule(roll,650);
  }
  function moveToken(ci,ti){
    if(busy||state.phase!=='choose'||ci!==state.current||!state.legal.includes(ti))return;
    const token=state.tokens[ci][ti];
    busy=true;state.phase='busy';render();
    const moveBy=token.step<0?0:state.dice;
    schedule(()=>{
      const old=token.step;
      if(old<0)token.step=0;else token.step+=moveBy;
      let captured=null;
      const pos=globalPos(ci,ti);
      if(pos!==null&&!safeIndexes.has(pos)){
        colors.forEach((_,oi)=>{if(oi===ci)return;state.tokens[oi].forEach((other,oj)=>{if(globalPos(oi,oj)===pos){captured=[oi,oj];other.step=-1;}});});
      }
      if(captured){state.lastCapture=captured.join('-');state.event=`${colors[captured[0]].name} got caught sneaking through the grass.`;state.message=`A cheeky catch! ${colors[captured[0]].name} heads back to the hideout.`;notify('Caught in the act — back to the hideout!');}
      else if(token.step===57){state.message=`Home safe! Rogue ${ti+1} made it to the oak tree.`;state.event='One rascal slipped past the neighbors and made it home.';}
      else if(old<0){state.message='Out of the hideout! Now cross the backyard.';state.event='A new rogue is loose in the garden.';}
      else {state.message=`Nice and quiet. Rogue ${ti+1} moved ${state.dice} spaces.`;state.event='Not a squeak from the neighbors.';}
      busy=false;
      if(state.tokens[ci].every(t=>t.step>=57)){state.winner=ci;state.phase='over';state.message=`${colors[ci].name} got all four home. The yard is yours!`;state.event='All four rogues made it home. A clean getaway!';notify(`${colors[ci].name} wins the backyard!`);}
      else if(state.dice===6){state.phase='extra';state.legal=[];state.message='Six! You earned another roll.';}
      else {state.phase='roll';state.legal=[];}
      render();
      if(captured){schedule(()=>{state.lastCapture=null;render();},1400);}
      if(state.winner===null&&state.dice!==6)schedule(advanceTurn,650);
      else if(state.winner===null&&ci!==0)schedule(roll,650);
    },ci===0?230:380);
  }
  function aiChoose(){
    if(state.current===0||state.phase!=='choose'||state.winner!==null)return;
    const ci=state.current, options=state.legal.slice();
    const scored=options.map(ti=>{
      const token=state.tokens[ci][ti];let score=0;
      if(token.step<0)score+=5;
      else if(token.step+state.dice>=57)score+=20;
      else if(token.step>=51)score+=5;
      const next=token.step<0?0:token.step+state.dice;
      if(next<52){const p=(colors[ci].start+next)%52;if(!safeIndexes.has(p)&&colors.some((_,oi)=>oi!==ci&&state.tokens[oi].some(t=>globalPos(oi,state.tokens[oi].indexOf(t))===p)))score+=11;}
      return {ti,score};
    }).sort((a,b)=>b.score-a.score);
    moveToken(ci,scored[0].ti);
  }
  function newGame(){
    gameId++;clearTimeout(toastTimer);el('toast').classList.remove('show');
    state=initialState();busy=false;render();notify('Fresh game. The neighbors are none the wiser.');
  }
  const backdrop=el('modalBackdrop');
  function openRules(){backdrop.hidden=false;el('modalClose').focus();}
  function closeRules(){backdrop.hidden=true;el('rulesBtn').focus();}
  el('rollBtn').addEventListener('click',roll);el('die').addEventListener('click',roll);
  el('newGameBtn').addEventListener('click',newGame);el('rulesBtn').addEventListener('click',openRules);
  el('modalClose').addEventListener('click',closeRules);el('modalOk').addEventListener('click',closeRules);
  backdrop.addEventListener('click',e=>{if(e.target===backdrop)closeRules();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!backdrop.hidden)closeRules();});
  el('soundToggle').addEventListener('click',()=>{muted=!muted;el('soundToggle').classList.toggle('muted',muted);el('soundToggle').textContent=muted?'♩':'♫';el('soundToggle').setAttribute('aria-label',muted?'Turn sound on':'Turn sound off');});
  render();
})();
