const board = document.querySelector('#board');
const diceEls = [...document.querySelectorAll('.die')];
const rollBtn = document.querySelector('#rollBtn');
const statusTitle = document.querySelector('#statusTitle');
const statusText = document.querySelector('#statusText');
const playersEl = document.querySelector('#players');
const turnLabel = document.querySelector('#turnLabel');
const roundLabel = document.querySelector('#roundLabel');
const rollHint = document.querySelector('#rollHint');

const colors = ['coral','teal','yellow','violet'];
const names = ['Coral','Teal','Gold','Iris'];
const starts = [0,13,26,39];
// A compact 52-space perimeter around the four home zones.
const path = [[6,0],[7,0],[8,0],[8,1],[8,2],[8,3],[8,4],[8,5],[9,6],[10,6],[11,6],[12,6],[13,6],[14,6],[14,7],[14,8],[13,8],[12,8],[11,8],[10,8],[9,8],[8,9],[8,10],[8,11],[8,12],[8,13],[8,14],[7,14],[6,14],[6,13],[6,12],[6,11],[6,10],[6,9],[5,8],[4,8],[3,8],[2,8],[1,8],[0,8],[0,7],[0,6],[1,6],[2,6],[3,6],[4,6],[5,6],[6,5],[6,4],[6,3],[6,2],[6,1]];
const lanes = {coral:[[7,1],[7,2],[7,3],[7,4],[7,5]],teal:[[13,7],[12,7],[11,7],[10,7],[9,7]],yellow:[[7,13],[7,12],[7,11],[7,10],[7,9]],violet:[[1,7],[2,7],[3,7],[4,7],[5,7]]};
let players, current, dice, rolled, round, soundOn;

function cellPos(r,c){ return `left:${(c+.5)*100/15}%;top:${(r+.5)*100/15}%`; }
function makeBoard(){
  board.innerHTML='';
  colors.forEach((color)=>{
    const home=document.createElement('div'); home.className=`home ${color}`;
    for(let i=0;i<4;i++){const n=document.createElement('div');n.className='nest';n.dataset.color=color;n.dataset.slot=i;home.appendChild(n)} board.appendChild(home);
  });
  colors.forEach((color)=>lanes[color].forEach(([r,c])=>{const el=document.createElement('div');el.className=`lane ${color}`;board.appendChild(el)}));
  path.forEach(([r,c],i)=>{const el=document.createElement('div');el.className='path-cell';el.style.cssText=cellPos(r,c);el.dataset.index=i;if([0,13,26,39].includes(i))el.classList.add(colors[starts.indexOf(i)]);board.appendChild(el)});
  const center=document.createElement('div');center.className='center';center.innerHTML='<span>HOME</span>';board.appendChild(center);
  players.forEach((p,pi)=>p.tokens.forEach((token,ti)=>{const el=document.createElement('button');el.className=`token ${p.color}`;el.dataset.player=pi;el.dataset.token=ti;el.title=`${p.name} runner ${ti+1}`;el.addEventListener('click',()=>moveToken(pi,ti));board.appendChild(el)}));
  renderTokens();
}
function homePosition(pi,ti){
  const spots=[[ [2.4,2.4],[3.6,2.4],[2.4,3.6],[3.6,3.6] ],[ [11.4,2.4],[12.6,2.4],[11.4,3.6],[12.6,3.6] ],[ [2.4,11.4],[3.6,11.4],[2.4,12.6],[3.6,12.6] ],[ [11.4,11.4],[12.6,11.4],[11.4,12.6],[12.6,12.6] ]];return [spots[pi][ti][1],spots[pi][ti][0]];}
function renderTokens(){
  document.querySelectorAll('.token').forEach(el=>{const pi=+el.dataset.player,ti=+el.dataset.token,pos=players[pi].tokens[ti];let r,c;if(pos<0||pos>=57){[r,c]=homePosition(pi,ti)}else{const idx=(starts[pi]+pos)%52;[r,c]=path[idx]}el.style.cssText=cellPos(r,c);el.classList.toggle('selectable',rolled && pi===0 && canMove(pos));el.disabled=!(rolled&&pi===0&&canMove(pos));});
}
function renderPlayers(){playersEl.innerHTML=players.map((p,i)=>`<div class="player ${i===current?'active':''}"><span class="player-swatch" style="background:var(--${p.color})"></span><span class="player-name">${p.name}</span><span class="player-score">${p.tokens.filter(x=>x===57).length}/4</span></div>`).join('')}
function canMove(pos){if(!rolled)return false;const steps=dice[0]+dice[1];return pos<57&&(pos>=0||steps===6||steps===12)&&(pos+steps<=57)}
function updateStatus(title,text){statusTitle.textContent=title;statusText.textContent=text}
function roll(){if(rolled)return;rolled=true;dice=[0,0];rollBtn.disabled=true;rollHint.textContent='GOOD LUCK';diceEls.forEach((el,i)=>{el.classList.add('rolling');setTimeout(()=>{dice[i]=Math.floor(Math.random()*6)+1;el.textContent=dice[i];el.classList.remove('rolling')},220+i*70)});setTimeout(()=>{renderTokens();const total=dice[0]+dice[1];const moves=players[0].tokens.filter(canMove).length;if(moves){updateStatus('Pick a runner.',`${total} spaces available. Tap a glowing token.`);rollHint.textContent=`${total} SPACES`}else{updateStatus('No move this time.',`No runner can use ${total} spaces.`);setTimeout(nextTurn,1100)}},500)}
function moveToken(pi,ti){if(pi!==0||!rolled||!canMove(players[pi].tokens[ti]))return;const steps=dice[0]+dice[1];let pos=players[pi].tokens[ti];pos=pos<0?steps===6?0:steps:pos+steps;players[pi].tokens[ti]=pos;let captured=false;if(pos>=0&&pos<57){const landed=(starts[0]+pos)%52;players.forEach((p,i)=>{if(i>0)p.tokens=p.tokens.map(x=>{if(x>=0&&x<52&&(starts[i]+x)%52===landed){captured=true;return -1}return x})})}makeBoard();if(pos===57)updateStatus('Runner home!', 'A perfect finish.');else if(captured)updateStatus('Backstab!', 'You sent an opponent home. Roll again.');else updateStatus('Clean move.', 'Nice. The table is yours.');if(players[0].tokens.every(x=>x===57)){updateStatus('You win!', 'The table belongs to Coral.');return}if(captured||dice[0]===dice[1]){rolled=false;rollBtn.disabled=false;rollHint.textContent='BONUS ROLL';renderTokens()}else setTimeout(nextTurn,950)}
function nextTurn(){current=(current+1)%4;round+=current===0?1:0;rolled=false;dice=[null,null];rollBtn.disabled=current!==0;turnLabel.textContent=current===0?'YOUR TURN':`${names[current].toUpperCase()}'S TURN`;roundLabel.textContent=String(round).padStart(2,'0');diceEls.forEach(el=>{el.textContent='?';el.classList.remove('held')});renderPlayers();if(current===0){rollHint.textContent='ROLL TO START';updateStatus('Ready when you are.','Roll both dice to begin your turn.')}else{rollHint.textContent='CPU THINKING';updateStatus(`${names[current]} is thinking…`,'The other players are taking their turn.');setTimeout(()=>{if(current!==0) cpuTurn()},650)}}
function cpuTurn(){const a=Math.ceil(Math.random()*6),b=Math.ceil(Math.random()*6);const movable=players[current].tokens.findIndex(x=>x<57&&(x>=0||a+b===6||a+b===12)&&x+a+b<=57);if(movable>=0)players[current].tokens[movable]=players[current].tokens[movable]<0?0:players[current].tokens[movable]+a+b;makeBoard();setTimeout(()=>{if(current!==0)nextTurn()},500)}
function reset(){players=colors.map((color,i)=>({name:names[i],color,tokens:[-1,-1,-1,-1]}));current=0;dice=[null,null];rolled=false;round=1;rollBtn.disabled=false;turnLabel.textContent='YOUR TURN';roundLabel.textContent='01';diceEls.forEach(el=>el.textContent='?');rollHint.textContent='ROLL TO START';updateStatus('Ready when you are.','Roll both dice to begin your turn.');renderPlayers();makeBoard()}
rollBtn.addEventListener('click',roll);document.querySelector('#resetBtn').addEventListener('click',reset);document.querySelector('#soundBtn').addEventListener('click',e=>{soundOn=!soundOn;e.currentTarget.textContent=soundOn?'♫':'♬';});
reset();
