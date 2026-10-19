// Large deterministic maps. Only the viewport is drawn; saves pack terrain and fog.
export const HOME_SIZE=512, REGION_SIZE=416;
export const TILE_KINDS=['grass','forest','water','path','mountain','cliff','bridge','marsh'];
export const DIFFICULTIES={
  explorer:{name:'Explorador',description:'Más visión, menos daño enemigo y abastecimiento económico.',hp:.7,damage:.65,supply:.65,reward:.8,vision:8,rugged:.8,disasters:160},
  normal:{name:'Normal',description:'Geografía, enemigos y suministros equilibrados.',hp:1,damage:1,supply:1,reward:1,vision:6,rugged:1,disasters:120},
  veteran:{name:'Veterano',description:'Relieve más duro, defensas reforzadas y mayor consumo.',hp:1.4,damage:1.3,supply:1.4,reward:1.3,vision:5,rugged:1.15,disasters:95},
  extreme:{name:'Extremo',description:'Poca visión, montañas más altas y enemigos muy peligrosos.',hp:1.85,damage:1.65,supply:1.8,reward:1.65,vision:4,rugged:1.3,disasters:75},
};
const terrainMeta=new WeakMap(),fogMeta=new WeakMap(),sightMaps=new WeakMap(),workspaces=new WeakMap();
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
export function terrainRevision(terrain){let m=terrainMeta.get(terrain);if(!m){m={revision:0};terrainMeta.set(terrain,m);}return m.revision;}
export function touchTerrain(terrain){terrainRevision(terrain);terrainMeta.get(terrain).revision++;}
function hash(x,y,seed){let n=Math.imul(x,374761393)^Math.imul(y,668265263)^seed;n=Math.imul(n^(n>>>13),1274126177);return((n^(n>>>16))>>>0)/4294967295;}
function noise(x,y,seed){const xx=Math.floor(x),yy=Math.floor(y),a=x-xx,b=y-yy,u=a*a*(3-2*a),v=b*b*(3-2*b),p=hash(xx,yy,seed),q=hash(xx+1,yy,seed),r=hash(xx,yy+1,seed),s=hash(xx+1,yy+1,seed);return(p+(q-p)*u)*(1-v)+(r+(s-r)*u)*v;}
function landscape(seed,biome,size,difficulty){
  const mode=DIFFICULTIES[difficulty]||DIFFICULTIES.normal,phase=(seed%628)/100,naval=biome===3,shoreX=Math.floor(size*.36),terrain=new Array(size*size),rivers=[];
  for(let y=0;y<size;y++){
    const r1=size*.27+Math.sin(y*.026+phase)*size*.035+Math.sin(y*.073+phase)*3,r2=size*.65+Math.sin(y*.021+phase+2)*size*.045;
    rivers.push([r1,r2]);
    for(let x=0;x<size;x++){
      const large=noise(x/68,y/68,seed^0x9747),detail=noise(x/19,y/19,seed^0xc639),ridge=Math.abs(noise(x/46,y/46,seed^0x71f3)-.5)*2;
      let h=Math.max(0,Math.floor((large*.72+detail*.28-.43)*24*mode.rugged));
      const escarpment=size*.48+Math.sin(x*.025+phase)*size*.04,plateau=y>escarpment;
      if(plateau)h+=3;
      const pass=Math.abs((x+seed%51)%83-41)<5;
      if(Math.abs(y-escarpment)<5&&pass)h=Math.max(0,h-3+Math.floor(clamp((y-escarpment+5)/3,0,3)));
      h=clamp(h,0,12);
      let kind=h>=7?'mountain':Math.abs(y-escarpment)<2&&!pass?'cliff':hash(x,y,seed^912)>(biome===5?.55:.82)?'forest':'grass';
      if(ridge>.73&&large>.49){h=clamp(h+3,0,12);kind=h>=7?'mountain':'cliff';}
      if(Math.abs(x-r1)<2.2||Math.abs(x-r2)<3.2){h=-1;kind='water';}
      else if(biome===5&&detail<.25){h=0;kind='marsh';}
      if(naval&&x<shoreX){h=-1;kind='water';}
      if(x<11&&y<12){h=0;kind='grass';}
      if(x<7&&y<12){h=0;kind='grass';}
      // The starting cove remains compatible with earlier deployment controls.
      if(naval&&x<11&&y>=12){h=-1;kind='water';}
      terrain[y*size+x]={h,kind};
    }
  }
  return {terrain,rivers,shoreX};
}
function road(map,ax,ay,bx,by,width=1){const steps=Math.max(Math.abs(bx-ax),Math.abs(by-ay));for(let i=0;i<=steps;i++){const x=Math.round(ax+(bx-ax)*i/Math.max(1,steps)),y=Math.round(ay+(by-ay)*i/Math.max(1,steps));for(let dy=-width;dy<=width;dy++)for(let dx=-width;dx<=width;dx++){const xx=x+dx,yy=y+dy;if(xx<0||yy<0||xx>=map.size||yy>=map.size)continue;const old=map.terrain[yy*map.size+xx];map.terrain[yy*map.size+xx]={h:0,kind:old.kind==='water'||old.kind==='bridge'?'bridge':'path'};}}}
export function generateLandscape(seed,biome,size=REGION_SIZE,difficulty='normal'){
  const terrainSeed=(seed^(Object.keys(DIFFICULTIES).indexOf(difficulty)*0x45d9f3b))>>>0,data=landscape(terrainSeed,biome,size,difficulty),small=size<100;
  const cx=small?26+Math.floor(hash(1,2,seed)*7):Math.floor(size*(.64+hash(1,2,seed)*.19)),cy=small?8+Math.floor(hash(3,4,seed)*20):Math.floor(size*(.5+hash(3,4,seed)*.29));
  const positions=[[cx,cy],[cx-4,cy-2],[cx-3,cy+4],[cx+4,cy+1],[cx+1,cy-5],[cx+3,cy+5]];
  const map={size,terrain:data.terrain,deposits:[],positions,biome,seed,generation:2,difficulty,shoreX:small?20:data.shoreX,discovered:Array(size*size).fill(0)};
  if(small&&biome===3){for(let y=0;y<size;y++)for(let x=0;x<size;x++)if(x>=11&&x<=19||x<20&&y>=12)map.terrain[y*size+x]={kind:'water',h:-1};}
  // Connected roads and bridges are safe routes to seek through the fog, not revealed shortcuts.
  const start=biome===3?map.shoreX+2:4;
  road(map,start,9,cx,9);road(map,cx,9,cx,cy);
  if(biome!==3)road(map,3,9,start,9);
  for(const[x,y]of positions){road(map,cx,cy,x,y);for(let a=-2;a<=2;a++)for(let b=-2;b<=2;b++)if(x+a>=0&&x+a<size&&y+b>=0&&y+b<size)map.terrain[(y+b)*size+x+a]={kind:'grass',h:0};}
  if(biome===3){for(let y=5;y<14;y++)for(let x=map.shoreX;x<map.shoreX+4;x++)map.terrain[y*size+x]={kind:'grass',h:0};}
  const count=small?10:180;
  for(let i=0;i<count;i++){const x=7+Math.floor(hash(i,31,seed)*(size-10)),y=3+Math.floor(hash(i,73,seed)*(size-6)),t=map.terrain[y*size+x];if(!['water','mountain','cliff'].includes(t.kind))map.deposits.push({id:'mineral-'+i,x,y,amount:350+Math.floor(hash(i,99,seed)*600),resource:[0,1,2].includes(biome)?'alloy':'energy'});}
  return map;
}
export function generateHome(seed,size=HOME_SIZE){const map=landscape(seed>>>0,0,size,'normal');for(let y=0;y<size;y++)for(let x=0;x<size;x++){if(x<20&&y<20)map.terrain[y*size+x]={h:0,kind:(x<2||y<2)&&hash(x,y,seed)>.4?'forest':'grass'};if(x<18&&y>=20&&y<35)map.terrain[y*size+x]={h:-1,kind:'water'};}return map.terrain;}
export function fogRevision(fog){let m=fogMeta.get(fog);if(!m){m={revision:0,count:fog.reduce((a,b)=>a+b,0)};fogMeta.set(fog,m);}return m.revision;}
export function exploredCount(fog){fogRevision(fog);return fogMeta.get(fog).count;}
function revealCell(fog,index){if(fog[index])return;fogRevision(fog);fog[index]=1;const m=fogMeta.get(fog);m.count++;m.revision++;}
function clearLine(map,x,y,tx,ty){const dx=tx-x,dy=ty-y,steps=Math.max(Math.abs(dx),Math.abs(dy)),eye=(map.terrain[y*map.size+x]?.h||0)+2;for(let i=1;i<steps;i++){const xx=Math.round(x+dx*i/steps),yy=Math.round(y+dy*i/steps),t=map.terrain[yy*map.size+xx];if(t&&t.h>eye+1&&(t.kind==='mountain'||t.kind==='cliff'||t.h>eye+3))return false;}return true;}
export function revealArea(map,x,y,radius=6,sight=null,flying=false){x=Math.floor(x);y=Math.floor(y);if(x<0||y<0||x>=map.size||y>=map.size)return;for(let yy=Math.max(0,y-radius);yy<=Math.min(map.size-1,y+radius);yy++)for(let xx=Math.max(0,x-radius);xx<=Math.min(map.size-1,x+radius);xx++)if(Math.hypot(xx-x,yy-y)<=radius&&(flying||clearLine(map,x,y,xx,yy))){const i=yy*map.size+xx;revealCell(map.discovered,i);if(sight)sight[i]=1;}}
export function updateVision(map,observers,anchors=[],time=0,radius=6){let data=sightMaps.get(map.discovered);if(data&&time>=data.time&&time-data.time<.2)return data.sight;if(!data){data={time:-1,sight:new Uint8Array(map.size*map.size)};sightMaps.set(map.discovered,data);}data.time=time;data.sight.fill(0);for(const u of observers)if(u.hp>0&&!u.embarked)revealArea(map,u.x,u.y,radius+(u.flying?2:0),data.sight,!!u.flying);for(const b of anchors)if(b.hp!==0)revealArea(map,b.x+1,b.y+1,b.type==='command'?12:6,data.sight);return data.sight;}
export function inSight(map,x,y){const i=Math.floor(y)*map.size+Math.floor(x),data=sightMaps.get(map.discovered);return !!(data?data.sight[i]:map.discovered[i]);}
export function forgetSight(fog){sightMaps.delete(fog);}
export function walkable(map,x,y,spec={}){const t=map.terrain[y*map.size+x];return !!t&&(spec.flying||spec.naval?spec.flying||['water','bridge'].includes(t.kind):!['water','mountain','cliff'].includes(t.kind))&&(!map.blocked?.has(y*map.size+x)||spec.flying);}
function heapPush(heap,item){let i=heap.length;heap.push(item);while(i>0){const p=(i-1)>>1;if(heap[p].score<=item.score)break;heap[i]=heap[p];i=p;heap[i]=item;}}
function heapPop(heap){const first=heap[0],last=heap.pop();if(heap.length){heap[0]=last;let i=0;for(;;){let a=i*2+1,b=a+1;if(a>=heap.length)break;const c=b<heap.length&&heap[b].score<heap[a].score?b:a;if(heap[c].score>=last.score)break;heap[i]=heap[c];i=c;heap[i]=last;}}return first;}
export function findTerrainPath(map,sx,sy,gx,gy,spec={},limit=100000){
  const size=map.size;[sx,sy,gx,gy]=[sx,sy,gx,gy].map(v=>clamp(Math.floor(v),0,size-1));
  let workspace=workspaces.get(map.terrain);if(!workspace){workspace={g:new Float32Array(size*size),parents:new Int32Array(size*size),stamp:new Uint32Array(size*size),closed:new Uint32Array(size*size),serial:0};workspaces.set(map.terrain,workspace);}const w=workspace,serial=++w.serial,start=sy*size+sx,goal=gy*size+gx,heap=[];let closest=start,best=Math.abs(sx-gx)+Math.abs(sy-gy),expanded=0,reached=false;
  w.g[start]=0;w.stamp[start]=serial;w.parents[start]=-1;heapPush(heap,{index:start,score:best});
  while(heap.length&&expanded<limit){const {index}=heapPop(heap);if(w.closed[index]===serial)continue;w.closed[index]=serial;expanded++;const x=index%size,y=Math.floor(index/size),d=Math.abs(x-gx)+Math.abs(y-gy);if(d<best){best=d;closest=index;}if(index===goal){closest=index;reached=true;break;}
    for(const[a,b]of [[x+1,y],[x,y+1],[x-1,y],[x,y-1]]){if(a<0||b<0||a>=size||b>=size||!walkable(map,a,b,spec))continue;const next=b*size+a,from=map.terrain[index],to=map.terrain[next];if(!spec.flying&&!spec.naval&&Math.abs(to.h-from.h)>1)continue;const cost=['path','bridge'].includes(to.kind)?.75:to.kind==='forest'?1.3:to.kind==='marsh'?1.9:1.05+Math.max(0,to.h-from.h)*.4,score=w.g[index]+cost;if(w.stamp[next]!==serial||score<w.g[next]){w.g[next]=score;w.stamp[next]=serial;w.parents[next]=index;heapPush(heap,{index:next,score:score+(Math.abs(a-gx)+Math.abs(b-gy))*.75});}}
  }
  const path=[];let i=closest;while(i!==start&&i>=0){path.push({x:i%size+.5,y:Math.floor(i/size)+.5});i=w.parents[i];}path.reverse();return{path,reached,expanded};
}
function bytesToText(bytes){let text='';for(let i=0;i<bytes.length;i+=16000)text+=String.fromCharCode(...bytes.subarray(i,i+16000));return btoa(text);}
function textToBytes(text,max){if(typeof text!=='string'||text.length>Math.ceil(max/3)*4+4)throw Error('Mapa demasiado grande');const raw=atob(text);if(raw.length!==max)throw Error('Longitud del mapa inválida');return Uint8Array.from(raw,c=>c.charCodeAt(0));}
export function packTerrain(terrain){terrainRevision(terrain);const meta=terrainMeta.get(terrain);if(meta.packed&&meta.packedRevision===meta.revision)return meta.packed;const bytes=Uint8Array.from(terrain,t=>((t.h+1)<<4)|TILE_KINDS.indexOf(t.kind));meta.packed={encoding:'tiles-v1',size:Math.sqrt(terrain.length),data:bytesToText(bytes)};meta.packedRevision=meta.revision;return meta.packed;}
export function unpackTerrain(data){if(Array.isArray(data))return data;if(!data||data.encoding!=='tiles-v1'||![18,40,48,REGION_SIZE,HOME_SIZE].includes(data.size))throw Error('Formato de terreno inválido');return Array.from(textToBytes(data.data,data.size**2),n=>{if((n>>4)>13||(n&15)>=TILE_KINDS.length)throw Error('Casilla inválida');return{h:(n>>4)-1,kind:TILE_KINDS[n&15]};});}
export function packFog(fog){fogRevision(fog);const meta=fogMeta.get(fog);if(meta.packed&&meta.packedRevision===meta.revision)return meta.packed;const bytes=new Uint8Array(Math.ceil(fog.length/8));for(let i=0;i<fog.length;i++)if(fog[i])bytes[i>>3]|=1<<(i&7);const runs=[];for(let i=0;i<bytes.length;){let n=1;while(i+n<bytes.length&&bytes[i+n]===bytes[i]&&n<255)n++;runs.push(n,bytes[i]);i+=n;}const compact=runs.length<bytes.length;meta.packed={encoding:compact?'fog-rle-v1':'fog-v1',length:fog.length,data:bytesToText(compact?Uint8Array.from(runs):bytes)};meta.packedRevision=meta.revision;return meta.packed;}
export function unpackFog(data,length){if(Array.isArray(data))return data;if(!data||!['fog-v1','fog-rle-v1'].includes(data.encoding)||data.length!==length)throw Error('Formato de niebla inválido');let bytes;if(data.encoding==='fog-v1')bytes=textToBytes(data.data,Math.ceil(length/8));else{if(typeof data.data!=='string'||data.data.length>Math.ceil(length/8)*3)throw Error('Niebla demasiado grande');const raw=atob(data.data);if(raw.length%2)throw Error('Niebla incompleta');bytes=new Uint8Array(Math.ceil(length/8));let i=0;for(let r=0;r<raw.length;r+=2){const count=raw.charCodeAt(r),value=raw.charCodeAt(r+1);if(!count||i+count>bytes.length)throw Error('Niebla inválida');bytes.fill(value,i,i+count);i+=count;}if(i!==bytes.length)throw Error('Niebla truncada');}return Array.from({length},(_,i)=>(bytes[i>>3]>>(i&7))&1);}
export function encodeSave(s,pretty=false){const cleanUnit=u=>{const{path,pathTarget,pathIndex,...rest}=u;return rest;},battle=s.battle?{...s.battle,units:s.battle.units.map(cleanUnit),enemies:s.battle.enemies.map(cleanUnit)}:null;if(battle?.map)battle.map={...battle.map,terrain:packTerrain(battle.map.terrain),discovered:packFog(battle.map.discovered)};return JSON.stringify({...s,terrain:packTerrain(s.terrain),explored:s.explored?packFog(s.explored):undefined,garrison:(s.garrison||[]).map(cleanUnit),battle},null,pretty?2:0);}
export function decodeWorld(s){s.terrain=unpackTerrain(s.terrain);if(s.explored)s.explored=unpackFog(s.explored,s.terrain.length);if(s.battle?.map){const m=s.battle.map;m.terrain=unpackTerrain(m.terrain);m.discovered=unpackFog(m.discovered,m.size*m.size);}return s;}
