// Generator v1 is a save-format contract: existing worlds keep this algorithm.
export const WORLD_SIZE=8192, CHUNK_SIZE=32, CACHE_LIMIT=64, DEPTHS=40;
export const MATERIALS={air:{name:'Galería',color:'#5b6260'},soil:{name:'Tierra',color:'#978061'},stone:{name:'Roca',color:'#9b9f98'},iron:{name:'Hierro',color:'#ad806c'},coal:{name:'Carbón',color:'#505e68'},gold:{name:'Oro',color:'#d8b563'},oil:{name:'Petróleo',color:'#514b59'},crystal:{name:'Cristal',color:'#86bdc7'},wall:{name:'Bloque de piedra',color:'#b8ae94'},support:{name:'Entibado',color:'#b99268'},stairs:{name:'Escalera',color:'#cebc84'}};
export function hash32(text){let h=2166136261;for(const c of String(text)){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}
export function randomAt(x,y,seed){let n=Math.imul(x,374761393)^Math.imul(y,668265263)^seed;n=Math.imul(n^(n>>>13),1274126177);return((n^(n>>>16))>>>0)/4294967296;}
function noise(x,y,seed){const a=Math.floor(x),b=Math.floor(y),u=x-a,v=y-b,s=u*u*(3-2*u),t=v*v*(3-2*v);return (randomAt(a,b,seed)*(1-s)+randomAt(a+1,b,seed)*s)*(1-t)+(randomAt(a,b+1,seed)*(1-s)+randomAt(a+1,b+1,seed)*s)*t;}
export const BIOME_NAMES=['Pradera','Desierto','Taiga','Archipiélago','Volcánico','Selva'];
export function makeDescriptor(seed,kind='island',size=WORLD_SIZE){return {encoding:'sectors-v1',version:1,seed:seed>>>0,kind,size,biome:seed%6,edits:[]};}
export function coastGates(d){const n=d.size,c=n>>1;return [{id:'west',x:Math.floor(n*.18)-3,y:c},{id:'east',x:Math.floor(n*.82)+3,y:c},{id:'north',x:c,y:Math.floor(n*.18)-3},{id:'south',x:c,y:Math.floor(n*.82)+3}];}
export function naturalTile(d,x,y){
  const n=d.size,c=n/2,a=Math.abs(x-c)/n,b=Math.abs(y-c)/n,phase=d.seed/1e8;
  if(d.kind==='ocean')return {h:-1,kind:'water'};
  if(Math.abs(x-c)<=3&&Math.abs(y-c)<=3)return {h:0,kind:x===c+3&&y===c?'forest':'grass'};
  // Four navigable coves remain stable and meet the corresponding exit.
  const gates=coastGates(d),g=gates.find(g=>Math.abs(x-g.x)<22&&Math.abs(y-g.y)<22);
  if(g){const water=g.id==='west'?x<Math.floor(n*.18):g.id==='east'?x>Math.floor(n*.82):g.id==='north'?y<Math.floor(n*.18):y>Math.floor(n*.82);return {h:water?-1:0,kind:water?'water':'grass'};}
  const coast=.32+Math.sin((b+a)*13+phase)*.018;
  if(Math.max(a,b)>coast)return {h:-1,kind:'water'};
  let h=Math.max(0,Math.floor((noise(x/180,y/180,d.seed)-.43)*23));
  const ridge=Math.abs(y-(c-310+Math.sin(x/240+phase)*110));if(ridge<20)h+=7;
  const river=c+210+Math.sin(y/110+phase)*32+Math.sin(y/800)*80;
  if(Math.abs(x-river)<5)return {h:-1,kind:'water'};
  const volcanoX=c-650+(d.seed%200),volcanoY=c+480,distance=Math.hypot(x-volcanoX,y-volcanoY);
  if(d.biome===4&&distance<85)h=Math.max(h,Math.floor((85-distance)/7));
  if(Math.abs(x-c)<40&&Math.abs(y-c)<40)h=0;
  const kind=h>=7?'mountain':ridge<22?'cliff':randomAt(x,y,d.seed)>.79?'forest':'grass';
  return {h:Math.min(12,h),kind};
}
export function geology(seed,x,y,depth){if(depth<=0)return 'soil';const v=noise(x/11,y/11,seed^Math.imul(depth,92821));if(depth>=26&&v>.72)return 'oil';if(depth>=30&&v<.2)return 'crystal';if(depth>=16&&v>.63)return 'gold';if(depth>=7&&v>.56)return 'iron';if(depth>=4&&v<.32)return 'coal';return 'stone';}
const numeric=k=>typeof k==='string'&&/^(0|[1-9]\d*)$/.test(k);
export function sectorTerrain(descriptor){
  if(!descriptor||descriptor.encoding!=='sectors-v1'||descriptor.version!==1||![512,2048,8192,16384].includes(descriptor.size)||!['island','ocean'].includes(descriptor.kind)||!Number.isInteger(descriptor.seed)||!Array.isArray(descriptor.edits)||descriptor.edits.length>250000)throw Error('Territorio incompatible.');
  const d={...descriptor},edits=new Map(descriptor.edits),cache=new Map();let revision=0,generated=0;
  for(const [i,t]of edits)if(!Number.isInteger(i)||i<0||i>=d.size**2||!t||!Number.isInteger(t.h)||t.h< -1||t.h>20||!['grass','forest','water','path','mountain','cliff','bridge','marsh','rail','pipe','wall'].includes(t.kind))throw Error('Cambio de terreno inválido.');
  function get(i){if(i<0||i>=d.size**2)return undefined;if(edits.has(i))return edits.get(i);const x=i%d.size,y=Math.floor(i/d.size),cx=x>>5,cy=y>>5,key=cy*Math.ceil(d.size/32)+cx;let chunk=cache.get(key);if(!chunk){chunk=Array.from({length:1024},(_,j)=>Object.freeze(naturalTile(d,cx*32+j%32,cy*32+(j>>5))));cache.set(key,chunk);generated++;if(cache.size>CACHE_LIMIT)cache.delete(cache.keys().next().value);}else{cache.delete(key);cache.set(key,chunk);}return chunk[(y&31)*32+(x&31)];}
  return new Proxy({isSectors:true,length:d.size**2,get revision(){return revision;},get descriptor(){return d;},get stats(){return {resident:cache.size,generated,changed:edits.size,limit:CACHE_LIMIT};},release(){cache.clear();},toJSON(){return {...d,edits:[...edits]};}}, {get(t,k){return numeric(k)?get(Number(k)):t[k];},set(t,k,v){if(numeric(k)){const i=Number(k);if(i<0||i>=d.size**2)throw Error('Fuera del mapa');edits.set(i,{...v});revision++;return true;}return Reflect.set(t,k,v);}});
}
export function sparseFog(size,serialized=null){
  const chunks=new Map();let count=0,revision=0;const width=Math.ceil(size/32);
  function indices(i){const x=i%size,y=Math.floor(i/size);return[(y>>5)*width+(x>>5),(y&31)*32+(x&31)];}
  if(serialized){if(serialized.encoding!=='sector-fog-v1'||serialized.size!==size||!Array.isArray(serialized.chunks)||serialized.chunks.length>Math.ceil(size/32)**2)throw Error('Niebla incompatible.');for(const [id,text]of serialized.chunks){if(!Number.isInteger(id)||id<0||id>=width**2||typeof text!=='string'||text.length!==172)throw Error('Sector de niebla inválido.');const raw=atob(text);if(raw.length!==128)throw Error('Niebla truncada');const bits=Uint8Array.from(raw,c=>c.charCodeAt(0));chunks.set(id,bits);}for(const bits of chunks.values())for(const byte of bits){let v=byte;while(v){count++;v&=v-1;}}}
  const target={isSparse:true,length:size*size,get count(){return count;},get revision(){return revision;},clear(){chunks.clear();count=0;revision++;},has(i){const [key,bit]=indices(i);return((chunks.get(key)?.[bit>>3]||0)>>(bit&7))&1;},toJSON(){return{encoding:'sector-fog-v1',size,chunks:[...chunks].map(([id,bits])=>[id,btoa(String.fromCharCode(...bits))])};}};
  return new Proxy(target,{get(t,k){return numeric(k)?t.has(Number(k)):t[k];},set(t,k,value){if(!numeric(k))return Reflect.set(t,k,value);const i=Number(k);if(i<0||i>=size*size||!value)return true;const[key,bit]=indices(i);let bits=chunks.get(key);if(!bits){bits=new Uint8Array(128);chunks.set(key,bits);}const mask=1<<(bit&7);if(!(bits[bit>>3]&mask)){bits[bit>>3]|=mask;count++;revision++;}return true;}});
}
// Sparse local A*: distant orders are followed in bounded legs, never size² arrays.
export function localPath(map,start,goal,spec={},limit=5000){
  const size=map.size,sx=Math.floor(start.x),sy=Math.floor(start.y),dist=Math.hypot(goal.x-start.x,goal.y-start.y),span=Math.min(48,dist),gx=Math.max(0,Math.min(size-1,Math.floor(sx+(goal.x-start.x)*span/Math.max(1,dist)))),gy=Math.max(0,Math.min(size-1,Math.floor(sy+(goal.y-start.y)*span/Math.max(1,dist))));
  const startKey=sy*size+sx,open=[],cost=new Map([[startKey,0]]),parent=new Map(),closed=new Set();let best=startKey,bestDist=Infinity,expanded=0;
  const heuristic=(x,y)=>{const a=Math.abs(gx-x),b=Math.abs(gy-y);return Math.max(a,b)+(Math.SQRT2-1)*Math.min(a,b);};
  function push(v){let i=open.length;open.push(v);while(i){const p=(i-1)>>1;if(open[p].f<=v.f)break;open[i]=open[p];i=p;open[i]=v;}}
  function pop(){const v=open[0],tail=open.pop();if(open.length){open[0]=tail;let i=0;while(i*2+1<open.length){let j=i*2+1;if(j+1<open.length&&open[j+1].f<open[j].f)j++;if(open[j].f>=tail.f)break;open[i]=open[j];i=j;open[i]=tail;}}return v;}
  push({i:startKey,f:heuristic(sx,sy)});
  while(open.length&&expanded<limit){const {i}=pop();if(closed.has(i))continue;closed.add(i);expanded++;const x=i%size,y=Math.floor(i/size),d=heuristic(x,y);if(d<bestDist){bestDist=d;best=i;}if(x===gx&&y===gy)break;
    for(const [a,b]of[[x+1,y],[x,y+1],[x-1,y],[x,y-1],[x+1,y+1],[x-1,y+1],[x+1,y-1],[x-1,y-1]]){if(a<0||b<0||a>=size||b>=size||!map.passable(a,b,spec)||Math.abs(a-sx)>64||Math.abs(b-sy)>64)continue;const diagonal=a!==x&&b!==y;if(diagonal&&(!map.passable(a,y,spec)||!map.passable(x,b,spec)))continue;const k=b*size+a,from=map.tile(x,y),to=map.tile(a,b);if(!spec.flying&&!spec.naval&&(Math.abs(to.h-from.h)>1||diagonal&&(Math.abs(map.tile(a,y).h-from.h)>1||Math.abs(map.tile(x,b).h-from.h)>1)))continue;const next=cost.get(i)+(['path','rail','bridge'].includes(to.kind)?.7:to.kind==='forest'?1.6:1)*(diagonal?Math.SQRT2:1);if(next<(cost.get(k)??Infinity)){cost.set(k,next);parent.set(k,i);push({i:k,f:next+heuristic(a,b)*.7});}}
  }
  const path=[];let k=best;while(k!==startKey&&parent.has(k)){path.push({x:k%size+.5,y:Math.floor(k/size)+.5});k=parent.get(k);}return {path:path.reverse(),expanded,reached:best===gy*size+gx};
}
