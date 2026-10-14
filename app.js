const character=document.querySelector('#character');
const bubble=document.querySelector('#bubble');
const particles=document.querySelector('#particles');
let affection=0;
try{affection=Math.max(0,Math.min(100,Number(localStorage.getItem('meadow-affection'))||0))}catch{}
let timer,holding=false,lastPet=0,lastPoint=null,audio,sound=false;
const moods={pet:['뿌듯한 하치와레','헤헤… 한 번 더 해주세요','쓰다듬어 주니까, 행복해… ♡'],feed:['배부른 하치와레','맛있는 간식, 고마워요','우와! 맛있다아… 🍙'],play:['신난 하치와레','방울을 쫓아 폴짝폴짝','반짝반짝! 같이 놀자!'],rest:['꾸벅꾸벅, 쉬는 중','옆에 있어주면 안심돼요','여기서 같이… 조금만 쉴까…']};
function update(){document.querySelector('#affection-value').textContent=affection;document.querySelector('#affection-bar').style.width=affection+'%';document.querySelector('.progress').setAttribute('aria-valuenow',affection);document.querySelector('#affection-caption').textContent=affection>=100?'이제 우리는 아주 소중한 친구!':affection>=50?'너랑 있으면 매일이 행복해.':'조금씩, 천천히 친해져요.';try{localStorage.setItem('meadow-affection',affection)}catch{}}
function particle(text,x=165,y=100,kind=''){const el=document.createElement('span');el.className='particle '+kind;el.textContent=text;el.style.left=x+'px';el.style.top=y+'px';el.style.setProperty('--drift',Math.random()*80-40+'px');particles.append(el);setTimeout(()=>el.remove(),2700)}
function chime(){if(!sound||!audio)return;try{const oscillator=audio.createOscillator(),gain=audio.createGain();oscillator.type='sine';oscillator.frequency.setValueAtTime(640,audio.currentTime);oscillator.frequency.exponentialRampToValueAtTime(900,audio.currentTime+.12);gain.gain.setValueAtTime(.035,audio.currentTime);gain.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.3);oscillator.connect(gain);gain.connect(audio.destination);oscillator.start();oscillator.stop(audio.currentTime+.3)}catch{}}
function act(action){if(transforming)return;clearTimeout(timer);character.classList.remove('petted','playing','sleeping');document.querySelectorAll('[data-action]').forEach(b=>b.classList.toggle('active',b.dataset.action===action));const [title,description,message]=moods[action];document.querySelector('#mood').textContent=title;document.querySelector('#mood-description').textContent=description;bubble.textContent=message;document.querySelector('#mood-icon').textContent=action==='rest'?'☾':'☺';affection=Math.min(100,affection+({pet:2,feed:5,play:3,rest:1}[action]));update();chime();if(action==='pet'){character.classList.add('petted');particle('♡',100+Math.random()*130,100)}if(action==='feed'){character.classList.add('petted');particle('🍙',145,230,'snack');setTimeout(()=>particle('♡',205,110),300)}if(action==='play'){character.classList.add('playing');for(let i=0;i<8;i++)setTimeout(()=>particle('',40+Math.random()*240,220+Math.random()*100,'play-bubble'),i*160)}if(action==='rest'){character.classList.add('sleeping');for(let i=0;i<3;i++)setTimeout(()=>particle('z',220+i*15,100-i*15,'sleep-z'),i*600)}timer=setTimeout(()=>{character.classList.remove('petted','playing','sleeping');document.querySelectorAll('[data-action]').forEach(b=>b.classList.remove('active'));bubble.textContent='네가 옆에 있어서 좋아 ♡';document.querySelector('#mood').textContent='기분 좋은 오후';document.querySelector('#mood-description').textContent='같이 있어줘서 좋아요';document.querySelector('#mood-icon').textContent='☺'},action==='rest'?6500:3500)}
character.addEventListener('pointerdown',e=>{holding=true;lastPoint={x:e.clientX,y:e.clientY};character.setPointerCapture(e.pointerId);act('pet');lastPet=Date.now()});
character.addEventListener('pointermove',e=>{if(!holding)return;const distance=lastPoint?Math.hypot(e.clientX-lastPoint.x,e.clientY-lastPoint.y):0;if(distance>8&&Date.now()-lastPet>180){act('pet');lastPet=Date.now();lastPoint={x:e.clientX,y:e.clientY}}});
for(const event of ['pointerup','pointercancel','lostpointercapture'])character.addEventListener(event,()=>{holding=false;lastPoint=null});
character.addEventListener('click',e=>{if(e.detail===0)act('pet')});
document.querySelectorAll('[data-action]').forEach(button=>button.addEventListener('click',()=>act(button.dataset.action)));
document.querySelector('#reset').addEventListener('click',()=>{cancelTransformation();setMagical(false);clearTimeout(timer);affection=0;update();character.classList.remove('petted','playing','sleeping');particles.replaceChildren();document.querySelectorAll('[data-action]').forEach(b=>b.classList.remove('active'));bubble.textContent='와아… 놀러 왔구나! ♡';document.querySelector('#mood').textContent='기분 좋은 오후';document.querySelector('#mood-description').textContent='같이 있어줘서 좋아요';document.querySelector('#mood-icon').textContent='☺'});
document.querySelector('#sound').addEventListener('click',async()=>{try{audio??=new(window.AudioContext||window.webkitAudioContext)();await audio.resume();sound=!sound;document.querySelector('#sound').setAttribute('aria-pressed',sound);document.querySelector('#sound span').textContent=sound?'소리 켜짐':'소리 꺼짐';chime()}catch{document.querySelector('#sound span').textContent='소리 사용 불가'}});
const grass=document.querySelector('#grass');for(let i=0;i<32;i++){const el=document.createElement('span');el.className='grass-tuft'+(i%7===0?' flower':'');el.textContent=i%7===0?'✿':'〃';el.style.left=((i*37+9)%94)+'%';el.style.top=(32+(i*23)%60)+'%';el.style.setProperty('--rotation',((i*17)%40-20)+'deg');grass.append(el)}
const img=new Image();img.onload=()=>document.querySelector('#sprite').classList.add('generated');img.src='assets/hachi-sprites.png';update();

const magicStar=document.querySelector('#magic-star');
const meadow=document.querySelector('.meadow');
const transition=document.querySelector('#transformation');
let magical=false,transforming=false,magicSwapTimer,magicEndTimer;
const magicAsset=new Image();magicAsset.src='assets/magical-hachi-sprites.png';
function setMagical(value){magical=value;meadow.classList.toggle('magical',value);character.classList.toggle('magical',value);magicStar.setAttribute('aria-pressed',String(value));magicStar.setAttribute('aria-label',value?'얼굴 있는 노란 별을 눌러 평소 하치와레로 돌아가기':'얼굴 있는 노란 별을 눌러 매지컬 하치와레로 변신');magicStar.querySelector('span').textContent=value?'다시 누르면 원래 모습':'별을 눌러 변신!';}
function cancelTransformation(){clearTimeout(magicSwapTimer);clearTimeout(magicEndTimer);transforming=false;transition.hidden=true;meadow.classList.remove('transforming');magicStar.disabled=false;character.disabled=false;document.querySelectorAll('[data-action]').forEach(b=>b.disabled=false);}
magicStar.addEventListener('click',async()=>{
 if(transforming)return;
 if(!magicAsset.complete||!magicAsset.naturalWidth){try{await magicAsset.decode()}catch{bubble.textContent='변신 그림을 불러오지 못했어요. 다시 눌러주세요.';return}}
 if(transforming)return;
 clearTimeout(timer);holding=false;character.classList.remove('petted','playing','sleeping');particles.replaceChildren();document.querySelectorAll('[data-action]').forEach(b=>{b.classList.remove('active');b.disabled=true});
 transforming=true;magicStar.disabled=true;character.disabled=true;
 const target=!magical;
 transition.querySelector('p').textContent=target?'반짝반짝, 매지컬 하치와레!':'다시, 포근한 풀밭으로';
 transition.hidden=false;meadow.classList.add('transforming');chime();
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 magicSwapTimer=setTimeout(()=>{setMagical(target);bubble.textContent=target?'매지컬 하치와레, 등장! ✨':'풀밭으로 돌아왔어! ♡';document.querySelector('#mood').textContent=target?'반짝이는 매지컬 하치와레':'기분 좋은 오후';document.querySelector('#mood-description').textContent=target?'너에게 작은 마법을 선물할게':'같이 있어줘서 좋아요';},reduced?80:900);
 magicEndTimer=setTimeout(()=>{cancelTransformation();for(let i=0;i<6;i++)particle('✦',70+i*35,100+(i%2)*50);},reduced?200:1900);
});
