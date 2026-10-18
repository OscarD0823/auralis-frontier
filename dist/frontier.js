// Deterministic worlds, persistent colonies, diplomacy and field orders.
import { UNITS, BUILDINGS, ready, unitCount } from './engine.js';
export const BIOMES = [
  {name:'Pradera',color:'#8fc552',mineral:'Hierro',resource:'alloy',disaster:'Incendio'},
  {name:'Desierto',color:'#d1b374',mineral:'Cobre',resource:'alloy',disaster:'Tormenta de arena'},
  {name:'Tundra',color:'#bacfcd',mineral:'Cobalto',resource:'alloy',disaster:'Ventisca'},
  {name:'Archipiélago',color:'#90bd75',mineral:'Cristal marino',resource:'energy',disaster:'Temporal'},
  {name:'Volcánico',color:'#827c70',mineral:'Obsidiana',resource:'energy',disaster:'Erupción'},
  {name:'Selva',color:'#67a15b',mineral:'Esmeralda',resource:'energy',disaster:'Inundación'},
];
export const FACTIONS = [
  {name:'Liga del Acero',description:'Convoyes blindados y colonias industriales.',bonus:'Tus armas infligen un 10% más de daño.'},
  {name:'Pueblos del Roble',description:'Aldeas, arqueros y caballería de las llanuras.',bonus:'Las colonias exportan un 25% más de recursos.'},
  {name:'Pacto del Éter',description:'Civilizaciones de cristal y guardianes arcanos.',bonus:'Las rutas consumen un 25% menos de suministros.'},
];
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
export function random(seed){let n=seed>>>0;return()=>{n+=0x6d2b79f5;let t=Math.imul(n^n>>>15,1|n);t^=t+Math.imul(t^t>>>7,61|t);return((t^t>>>14)>>>0)/4294967296;};}
export function createFrontier(seed){
  const rnd=random(seed);return {seed:seed>>>0,relations:[0,0,0],alliances:[false,false,false],colonies:[],routes:[],shipments:0,minerals:[0,0,0,0,0,0],log:[],regions:Array.from({length:24},(_,i)=>({id:i,seed:Math.floor(rnd()*4294967295),biome:i===0?0:i===1?3:Math.floor(rnd()*6),faction:Math.floor(rnd()*3),name:['Valle','Bastión','Costa','Cuenca','Tierras','Puerto'][i%6]+' '+['Aurora','Cobalto','Nácar','Ceniza','Roble','Vigía'][Math.floor(rnd()*6)]+' '+(i+1),status:i<3?'open':'hidden',scouted:false}))};
}
export function regionInfo(s,id){const r=s.frontier.regions[id];if(!r)return null;const biome=BIOMES[r.biome],naval=r.biome===3,difficulty=1+Math.floor(id/3);return {...r,naval,difficulty,region:biome.name+' · '+biome.mineral,name:r.name,description:FACTIONS[r.faction].name+' · Base ocupada por Eclipse en un territorio procedural '+(naval?'con paso marítimo.':'con rutas terrestres.'),reward:{credits:700+difficulty*450,alloy:300+difficulty*170,energy:150+difficulty*90}};}
export function battleInfo(s){return s.battle?.regionId!==undefined?regionInfo(s,s.battle.regionId):null;}
export function generateRegion(seed,biomeIndex,size=40){
  const rnd=random(seed),biome=BIOMES[biomeIndex],naval=biomeIndex===3,terrain=Array.from({length:size*size},(_,i)=>{const x=i%size,y=Math.floor(i/size),n=rnd();
    let kind=n<(biomeIndex===5?.4:.16)?'forest':'grass',h=n>.95?1:0;
    if(!naval&&x>8&&Math.sin(x*.32+seed%17)+Math.cos(y*.35+seed%29)>1.65){kind='water';h=-1;}
    // Every land map has an open corridor; naval maps have an unbroken navigable channel.
    if(y>=7&&y<=11){kind='grass';h=0;}
    if(naval&&((x>=11&&x<=19)||(x<20&&y>=12))){kind='water';h=-1;}
    if(x<=6&&y<12){kind='grass';h=0;}
    return {kind,h};
  });
  const deposits=Array.from({length:10},(_,i)=>({id:'mineral-'+i,x:7+Math.floor(rnd()*(size-10)),y:3+Math.floor(rnd()*(size-6)),amount:350+Math.floor(rnd()*600),resource:biome.resource})).filter(d=>terrain[d.y*size+d.x].kind!=='water');
  const cx=26+Math.floor(rnd()*7),cy=8+Math.floor(rnd()*20),positions=[[cx,cy],[cx-4,cy-2],[cx-3,cy+4],[cx+4,cy+1],[cx+1,cy-5],[cx+3,cy+5]];
  // Flatten actual enemy footprints, not just their central cell.
  for(const[x,y]of positions)for(let a=-2;a<=2;a++)for(let b=-2;b<=2;b++)if(x+a>=0&&x+a<size&&y+b>=0&&y+b<size)terrain[(y+b)*size+x+a]={kind:'grass',h:0};
  for(const[x,y]of positions)for(let yy=Math.min(9,y);yy<=Math.max(9,y);yy++)terrain[yy*size+x]={kind:'grass',h:0};
  return {size,terrain,deposits,positions,biome:biomeIndex,seed,discovered:Array(size*size).fill(0)};
}
export function reveal(map,x,y,radius=5){for(let yy=Math.max(0,Math.floor(y-radius));yy<=Math.min(map.size-1,Math.ceil(y+radius));yy++)for(let xx=Math.max(0,Math.floor(x-radius));xx<=Math.min(map.size-1,Math.ceil(x+radius));xx++)if(Math.hypot(xx-x,yy-y)<=radius)map.discovered[yy*map.size+xx]=1;}
export function visible(b,e){return !b.map||!!b.map.discovered[Math.floor(e.y)*b.map.size+Math.floor(e.x)];}
const has=(s,type)=>s.buildings.some(b=>b.type===type&&ready(b,Date.now()));
export function capacity(s){return Math.min(120,60+s.buildings.filter(b=>b.type==='depot'&&ready(b,Date.now())).reduce((a,b)=>a+b.level*20,0));}
export function openRoute(s,id,source=-1){
  const r=regionInfo(s,id);if(!r||r.status==='hidden'||r.status==='allied')return{ok:false,message:'Explora primero una región vecina.'};
  if(s.frontier.routes.some(route=>route.to===id))return{ok:false,message:'Esta región ya tiene una ruta de suministros.'};
  if(source!==-1&&!s.frontier.colonies.some(c=>c.id===source))return{ok:false,message:'El origen debe ser Aurora o una colonia tuya.'};
  if(!has(s,'depot'))return{ok:false,message:'Construye un depósito de suministros para abastecer expediciones.'};
  if(r.naval&&!has(s,'dock'))return{ok:false,message:'Construye un astillero para abrir rutas marítimas.'};
  if(s.resources.credits<200)return{ok:false,message:'Necesitas 200 áureos para establecer la ruta.'};
  s.resources.credits-=200;s.frontier.routes.push({from:source,to:id,active:true,delivered:0});return{ok:true,message:'Ruta '+(r.naval?'marítima':'terrestre')+' establecida. Consume 0,5 aleación/s durante la expedición.'};
}
export function toggleRoute(s,id){const r=s.frontier.routes.find(r=>r.to===id);if(!r)return{ok:false,message:'No existe esa ruta.'};r.active=!r.active;return{ok:true,message:r.active?'Ruta reanudada.':'Ruta suspendida. La colonia deja de exportar.'};}
export function beginExpedition(s,id,now=Date.now()){
  const r=regionInfo(s,id);if(!r||r.status==='hidden'||['owned','allied'].includes(r.status))return{ok:false,message:'Elige una región abierta sin conquistar.'};
  if(s.battle||s.raid)return{ok:false,message:'Termina el combate actual antes de salir.'};
  if(!unitCount(s.army))return{ok:false,message:'Entrena un ejército antes de partir.'};
  if(!s.frontier.routes.some(route=>route.to===id&&route.active))return{ok:false,message:'Establece y activa una línea de suministros antes de partir.'};
  if(r.naval&&(!(s.army.transport>0)||!(s.army.gunboat>0)))return{ok:false,message:'Esta isla requiere al menos una lancha y un transporte de desembarco.'};
  const map=generateRegion(r.seed,r.biome),hp=700+r.difficulty*350;
  const enemies=map.positions.map(([x,y],i)=>({id:'region-'+i,type:i===0?'core':i<4?'turret':i===4?'mine':'barracks',x,y,hp:i===0?hp:200+r.difficulty*100,maxHp:i===0?hp:200+r.difficulty*100,cooldown:0}));
  if(r.naval)enemies.push({id:'enemy-boat',type:'gunboat',x:16,y:19,hp:450,maxHp:450,cooldown:0});
  const guardType=['ranger','spearman','arcanist'][r.faction];
  for(let i=0;i<Math.min(6,2+r.difficulty);i++)enemies.push({id:'guard-'+i,type:guardType,x:map.positions[0][0]-2+i%3,y:map.positions[0][1]+3+Math.floor(i/3),hp:UNITS[guardType].hp,maxHp:UNITS[guardType].hp,cooldown:0});
  s.garrison=[];s.battle={mission:0,regionId:id,map,reserve:Object.fromEntries(Object.keys(UNITS).map(k=>[k,s.army[k]||0])),units:[],enemies,elapsed:0,bonus:0,rally:{x:4,y:8},outcome:null,supply:100,disaster:null,nextDisaster:75+(r.seed%45)};
  s.army=Object.fromEntries(Object.keys(UNITS).map(k=>[k,0]));reveal(map,3,7,7);reveal(map,3,14,4);r.scouted=true;s.frontier.regions[id].scouted=true;
  return{ok:true,message:'Expedición iniciada. Explora la niebla para encontrar la base enemiga.'};
}
export function colonize(s,id,type){
  const r=s.frontier.regions[id];if(!r||r.status!=='owned'||s.frontier.colonies.some(c=>c.id===id))return{ok:false,message:'Conquista esta región antes de fundar una colonia.'};
  if(!['industry','civil','fortress'].includes(type))return{ok:false,message:'Especialización desconocida.'};
  if(s.resources.credits<600)return{ok:false,message:'Necesitas 600 áureos para levantar la colonia.'};
  s.resources.credits-=600;s.frontier.colonies.push({id,type,level:1,buildings:['command',type==='industry'?'mine':type==='civil'?'market':'turret'],population:20});
  return{ok:true,message:'Colonia fundada. Sus exportaciones viajarán hasta Aurora mientras su ruta esté activa.'};
}
export function upgradeColony(s,id){const c=s.frontier.colonies.find(c=>c.id===id);if(!c||c.level>=5||c.buildings.length>=20)return{ok:false,message:'La colonia no puede mejorar más.'};const cost=500*c.level;if(s.resources.credits<cost)return{ok:false,message:'Necesitas '+cost+' áureos.'};s.resources.credits-=cost;c.level++;c.population+=20;c.buildings.push(c.level%2?'refinery':'barracks');return{ok:true,message:'La civilización crece. Aumentan su población, sus edificios y sus exportaciones.'};}
export function buildColony(s,id,type){const c=s.frontier.colonies.find(c=>c.id===id);if(!c||!['mine','reactor','refinery','market','turret','depot','barracks','hospital'].includes(type))return{ok:false,message:'Elige una infraestructura de la colonia.'};if(c.buildings.length>=20)return{ok:false,message:'Esta colonia ya tiene sus 20 solares ocupados.'};const cost=BUILDINGS[type].cost.credits;if(s.resources.credits<cost)return{ok:false,message:'Necesitas '+cost+' áureos para esta obra.'};s.resources.credits-=cost;c.buildings.push(type);c.population+=5;return{ok:true,message:BUILDINGS[type].name+' construido en '+s.frontier.regions[id].name+'.'};}
export function colonyLayout(c){return c.buildings.map((type,i)=>({id:'colony-'+i,type,x:24+(i%5)*3,y:10+Math.floor(i/5)*3,level:c.level,hp:BUILDINGS[type].hp*c.level}));}
export function diplomacy(s,faction,action){
  if(!FACTIONS[faction]||!has(s,'embassy'))return{ok:false,message:'Construye una embajada para negociar con las civilizaciones.'};
  const f=s.frontier;if(action==='aid'){if(f.alliances[faction])return{ok:false,message:'Ya cuentas con su alianza.'};if(s.resources.credits<250)return{ok:false,message:'La ayuda diplomática cuesta 250 áureos.'};s.resources.credits-=250;f.relations[faction]=Math.min(100,f.relations[faction]+25);return{ok:true,message:'Relación +25. Alcanza 75 para pactar una alianza.'};}
  if(action==='ally'){if(f.alliances[faction]||f.relations[faction]<75)return{ok:false,message:'Necesitas una relación de 75 y no tener ya el pacto.'};f.alliances[faction]=true;const r=f.regions.find(r=>r.faction===faction&&r.status==='open');if(r){r.status='allied';unlockNeighbours(f,r.id);}return{ok:true,message:'Alianza firmada: '+FACTIONS[faction].bonus};}
  return{ok:false,message:'Acción diplomática desconocida.'};
}
function unlockNeighbours(f,id){for(const i of [id-1,id+1,id-6,id+6])if(f.regions[i]?.status==='hidden')f.regions[i].status='open';}
export function conquer(s,id){const r=s.frontier.regions[id];r.status='owned';s.frontier.relations[r.faction]=Math.min(100,s.frontier.relations[r.faction]+15);unlockNeighbours(s.frontier,id);}
function connected(s,route,seen=new Set()){if(!route?.active||seen.has(route.to))return false;if(route.from===-1)return true;seen.add(route.to);return s.frontier.colonies.some(c=>c.id===route.from)&&connected(s,s.frontier.routes.find(r=>r.to===route.from),seen);}
export function colonyRates(s){const rates={credits:0,alloy:0,energy:0},f=s.frontier;if(!f)return rates;for(const c of f.colonies){const route=f.routes.find(r=>r.to===c.id);if(!connected(s,route))continue;const protection=Math.min(.15,c.buildings.filter(t=>t==='turret').length*.07+c.buildings.filter(t=>t==='barracks').length*.05+c.buildings.filter(t=>t==='hospital').length*.03+(c.type==='fortress'?.1:0)),trade=1+c.buildings.filter(t=>t==='market'||t==='depot').length*.1,mult=c.level*(f.alliances[1]?1.25:1)*(.85+protection)*trade,resource=BIOMES[f.regions[c.id].biome].resource;rates.credits+=mult*(c.type==='civil'?2:1);rates[resource]+=mult*(c.type==='industry'?2:1);for(const type of c.buildings)if(type!=='command')for(const[k,v]of Object.entries(BUILDINGS[type].rate))rates[k]+=v*mult;}return rates;}
export function advanceFrontier(s,seconds){const rates=colonyRates(s);for(const[k,v]of Object.entries(rates))s.resources[k]=Math.min(999999,s.resources[k]+seconds*v);const total=Object.values(rates).reduce((a,b)=>a+b,0)*seconds;s.frontier.shipments+=total;for(const route of s.frontier.routes)if(connected(s,route)){const c=s.frontier.colonies.find(c=>c.id===route.to);if(c){route.delivered+=seconds;s.frontier.minerals[s.frontier.regions[c.id].biome]=Math.min(999999,s.frontier.minerals[s.frontier.regions[c.id].biome]+seconds*.3*c.level);}}}
export function fieldUnits(s){return s.battle?.units||s.garrison||[];}
export function syncGarrison(s){
  if(s.battle){s.garrison=[];return;}s.garrison??=[];
  for(const[type,n]of Object.entries(s.army)){const units=s.garrison.filter(u=>u.type===type);if(units.length>n){const remove=new Set(units.slice(n).map(u=>u.id));s.garrison=s.garrison.filter(u=>!remove.has(u.id));}for(let i=units.length;i<n;i++){let id='home-'+type+'-'+i;while(s.garrison.some(u=>u.id===id))id+='x';const index=s.garrison.length,hp=UNITS[type].hp*(1+(s.tech?.armor||0)*.15);s.garrison.push({id,type,x:UNITS[type].naval?4+(index%5)*2:3+(index%8)*.7,y:UNITS[type].naval?22.5+Math.floor(index/8)*1.5:11+Math.floor(index/8)*.8,hp,maxHp:hp,cooldown:0,order:{kind:'hold'}});}}
}
export function issueOrder(s,ids,kind,x,y,targetId=null,formation='line'){
  if(!['move','attack','attackMove','hold','auto'].includes(kind))return{ok:false,message:'Orden desconocida.'};
  const units=fieldUnits(s).filter(u=>ids.includes(u.id)&&u.hp>0&&!u.embarked);if(!units.length)return{ok:false,message:'Selecciona primero tus tropas.'};
  const size=s.battle?.map?.size||(s.battle?18:48);if(['move','attackMove','attack'].includes(kind)&&(!Number.isFinite(x)||!Number.isFinite(y)||x<.5||y<.5||x>=size-.5||y>=size-.5))return{ok:false,message:'El destino está fuera del mapa.'};
  if(kind==='attack'&&!(s.battle?.enemies||s.raid?.units||[]).some(e=>e.id===targetId&&e.hp>0))return{ok:false,message:'El objetivo ya no está disponible.'};
  units.forEach((u,i)=>{const cols=formation==='column'?2:Math.ceil(Math.sqrt(units.length)),dx=(i%cols-(Math.min(cols,units.length)-1)/2)*.65,dy=Math.floor(i/cols)*.65;u.order=['hold','auto'].includes(kind)?{kind}:{kind,x:clamp(x+dx,.5,size-1),y:clamp(y+dy,.5,size-1),targetId};delete u.path;});return{ok:true,message:units.length+' unidades · '+({move:'Avanzar',attack:'Atacar objetivo',attackMove:'Avanzar y atacar',hold:'Mantener posición',auto:'Ataque libre'}[kind])};
}
function canWalk(map,x,y,spec){const t=map.terrain[y*map.size+x];return !!t&&(spec.flying||spec.naval?t.kind==='water'||!spec.naval:t.kind!=='water')&&(!map.blocked?.has(y*map.size+x)||spec.flying);}
function moveUnit(u,tx,ty,spec,dt,map,mult=1){
  if(!map||spec.flying){const d=Math.hypot(tx-u.x,ty-u.y);if(d>.12){const step=Math.min(d,spec.speed*dt*mult);u.x+=(tx-u.x)/d*step;u.y+=(ty-u.y)/d*step;}return;}
  const gx=clamp(Math.floor(tx),0,map.size-1),gy=clamp(Math.floor(ty),0,map.size-1),key=gx+','+gy;
  if(u.pathTarget!==key||!u.path){u.pathTarget=key;const sx=Math.floor(u.x),sy=Math.floor(u.y),q=[[sx,sy]],parents=new Map(),seen=new Set([sy*map.size+sx]);let end=null,closest=[sx,sy],distance=Infinity;
    for(let i=0;i<q.length;i++){const[x,y]=q[i],d=Math.hypot(x-gx,y-gy);if(d<distance){distance=d;closest=[x,y];}if(x===gx&&y===gy){end=[x,y];break;}for(const[a,b]of[[x+1,y],[x,y+1],[x-1,y],[x,y-1]])if(a>=0&&b>=0&&a<map.size&&b<map.size&&!seen.has(b*map.size+a)&&canWalk(map,a,b,spec)){seen.add(b*map.size+a);parents.set(b*map.size+a,[x,y]);q.push([a,b]);}}
    end??=closest;const path=[];while(parents.has(end[1]*map.size+end[0])){path.unshift({x:end[0]+.5,y:end[1]+.5});end=parents.get(end[1]*map.size+end[0]);}u.path=path;
  }
  const next=u.path[0];if(!next)return;const d=Math.hypot(next.x-u.x,next.y-u.y),step=spec.speed*dt*mult;if(d<=step+.03){u.x=next.x;u.y=next.y;u.path.shift();}else{u.x+=(next.x-u.x)/d*step;u.y+=(next.y-u.y)/d*step;}
}
export function embark(s,ids,unload=false){
  const units=fieldUnits(s),boats=units.filter(u=>u.type==='transport'&&u.hp>0&&(unload?ids.includes(u.id):true));let n=0;
  for(const boat of boats){if(unload){const map=s.battle?.map;for(const u of units.filter(u=>u.embarked===boat.id)){let spot=null;for(let dy=-3;dy<=3&&!spot;dy++)for(let dx=-3;dx<=3;dx++){const x=Math.floor(boat.x)+dx,y=Math.floor(boat.y)+dy;if(x>=1&&y>=1&&x<(map?.size||48)-1&&y<(map?.size||48)-1&&(!map||map.terrain[y*map.size+x].kind!=='water')){spot={x:x+.5,y:y+.5};break;}}if(spot){delete u.embarked;u.x=spot.x;u.y=spot.y;u.order={kind:'hold'};delete u.path;n++;}}}else{let count=units.filter(u=>u.embarked===boat.id).length;for(const u of units.filter(u=>ids.includes(u.id)&&!UNITS[u.type].naval&&!UNITS[u.type].flying&&!u.embarked&&Math.hypot(u.x-boat.x,u.y-boat.y)<4)){if(count>=12)break;u.embarked=boat.id;u.order={kind:'hold'};count++;n++;}}}
  return{ok:n>0,message:n?`${n} tropas ${unload?'desembarcadas':'embarcadas'}.`:'Acerca un transporte a la costa (máximo 3 casillas) y a tus tropas. Cada transporte admite 12 unidades.'};
}
export function tacticalStep(s,dt,home=false){
  const b=s.battle,units=home?(s.garrison||[]):b.units,targets=home?(s.raid?.units||[]):b.enemies,map=home?{terrain:s.terrain,size:48,blocked:new Set(s.buildings.flatMap(b=>Array.from({length:BUILDINGS[b.type].size**2},(_,i)=>(b.y+Math.floor(i/BUILDINGS[b.type].size))*48+b.x+i%BUILDINGS[b.type].size)))}:b.map;const shots=[];
  for(const u of units){if(u.hp<=0)continue;const spec=UNITS[u.type];if(u.embarked){const boat=units.find(v=>v.id===u.embarked&&v.hp>0);if(boat){u.x=boat.x;u.y=boat.y;}else u.hp=0;continue;}
    if(map?.discovered)reveal(map,u.x,u.y,5+(s.tech?.logistics||0));u.cooldown=Math.max(0,u.cooldown-dt);const order=u.order||{kind:'auto'};
    let candidates=targets.filter(e=>e.hp>0&&(!b||visible(b,e)));if(spec.preferDefences&&order.kind==='auto'&&candidates.some(e=>e.type==='turret'))candidates=candidates.filter(e=>e.type==='turret');
    candidates.sort((a,c)=>Math.hypot(u.x-a.x,u.y-a.y)-Math.hypot(u.x-c.x,u.y-c.y));let e=order.kind==='attack'?candidates.find(e=>e.id===order.targetId):candidates[0];
    if(order.kind==='move')e=null;
    if(e&&['hold','attackMove'].includes(order.kind)&&Math.hypot(e.x-u.x,e.y-u.y)>(order.kind==='hold'?spec.range:spec.range+2))e=null;
    if(e){const dist=Math.hypot(e.x-u.x,e.y-u.y);if(dist>spec.range){if(order.kind!=='hold')moveUnit(u,e.x,e.y,spec,dt,map,(b?.supply<15?.6:1));}else if(u.cooldown<=0){const damage=spec.damage*(1+(b?.bonus||0)+(s.tech?.weapons||0)*.1+(s.frontier?.alliances[0] ? .1 : 0));e.hp=Math.max(0,e.hp-damage);if(spec.splash)for(const other of targets)if(other!==e&&other.hp>0&&Math.hypot(other.x-e.x,other.y-e.y)<=spec.splash)other.hp=Math.max(0,other.hp-damage*.55);u.cooldown=spec.reload||.75;shots.push({x:u.x,y:u.y,tx:e.x,ty:e.y,kind:u.type,enemy:false});}}
    else if(['move','attackMove'].includes(order.kind)){moveUnit(u,order.x,order.y,spec,dt,map,(b?.supply<15?.6:1));if(Math.hypot(order.x-u.x,order.y-u.y)<.7)u.order={kind:'hold'};}
    // Nearby discovered deposits are collected by scouts; each node is finite.
    if(map?.deposits)for(const d of map.deposits)if(d.amount>0&&Math.hypot(d.x-u.x,d.y-u.y)<1.5){const amount=Math.min(d.amount,dt*5);d.amount-=amount;s.frontier.minerals[map.biome]=Math.min(999999,s.frontier.minerals[map.biome]+amount);}
  }return shots;
}
export function enemyFieldStep(s,dt){const b=s.battle;if(!b?.map)return[];const shots=[];for(const e of b.enemies){const spec=UNITS[e.type];if(!spec||e.hp<=0)continue;e.cooldown=Math.max(0,e.cooldown-dt);const target=b.units.filter(u=>u.hp>0&&!u.embarked&&Math.hypot(e.x-u.x,e.y-u.y)<9).sort((a,c)=>Math.hypot(a.x-e.x,a.y-e.y)-Math.hypot(c.x-e.x,c.y-e.y))[0];if(!target)continue;const dist=Math.hypot(target.x-e.x,target.y-e.y);if(dist>spec.range)moveUnit(e,target.x,target.y,spec,dt,b.map,.75);else if(e.cooldown<=0){target.hp=Math.max(0,target.hp-spec.damage*.65);e.cooldown=spec.reload||1;shots.push({x:e.x,y:e.y,tx:target.x,ty:target.y,enemy:true,kind:e.type});}}return shots;}
export function environmentalStep(s,dt){const b=s.battle;if(!b?.map)return;const route=s.frontier.routes.find(r=>r.to===b.regionId),cost=dt*.5*(s.frontier.alliances[2] ? .75 : 1)/(1+(s.tech?.logistics||0)*.15);if(connected(s,route)&&s.resources.alloy>=cost){s.resources.alloy-=cost;b.supply=Math.min(100,b.supply+dt*2);}else b.supply=Math.max(0,b.supply-dt*1.5);
  if(b.disaster&&b.elapsed>b.disaster.until)b.disaster=null;
  if(b.elapsed>=b.nextDisaster&&!b.disaster){const rnd=random(b.map.seed+Math.floor(b.elapsed)),x=8+Math.floor(rnd()*(b.map.size-12)),y=5+Math.floor(rnd()*(b.map.size-10));b.disaster={name:BIOMES[b.map.biome].disaster,x,y,radius:4,starts:b.elapsed+8,until:b.elapsed+23};b.nextDisaster=b.elapsed+100;}
  if(b.disaster&&b.elapsed>=b.disaster.starts){const d=b.disaster;for(const u of [...b.units,...b.enemies])if(u.hp>0&&!u.embarked&&Math.hypot(u.x-d.x,u.y-d.y)<d.radius)u.hp=Math.max(0,u.hp-dt*12);}
}
export function validFrontier(f){const finite=n=>typeof n==='number'&&Number.isFinite(n)&&n>=0&&n<=1e12;return !!f&&Array.isArray(f.minerals)&&f.minerals.length===6&&f.minerals.every(n=>finite(n)&&n<=999999)&&Number.isInteger(f.seed)&&Array.isArray(f.regions)&&f.regions.length===24&&f.regions.every((r,i)=>r.id===i&&Number.isInteger(r.seed)&&r.seed>=0&&r.seed<=4294967295&&Number.isInteger(r.biome)&&r.biome>=0&&r.biome<6&&Number.isInteger(r.faction)&&r.faction>=0&&r.faction<3&&typeof r.name==='string'&&r.name.length<100&&['open','hidden','owned','allied'].includes(r.status))&&Array.isArray(f.relations)&&f.relations.length===3&&f.relations.every(n=>finite(n)&&n<=100)&&Array.isArray(f.alliances)&&f.alliances.length===3&&f.alliances.every(n=>typeof n==='boolean')&&Array.isArray(f.colonies)&&f.colonies.length<=24&&new Set(f.colonies.map(c=>c.id)).size===f.colonies.length&&f.colonies.every(c=>f.regions[c.id]?.status==='owned'&&['industry','civil','fortress'].includes(c.type)&&Number.isInteger(c.level)&&c.level>=1&&c.level<=5&&Array.isArray(c.buildings)&&c.buildings.length<=20&&c.buildings.every(t=>Object.hasOwn(BUILDINGS,t))&&finite(c.population))&&Array.isArray(f.routes)&&f.routes.length<=24&&new Set(f.routes.map(r=>r.to)).size===f.routes.length&&f.routes.every(r=>Number.isInteger(r.to)&&r.to>=0&&r.to<24&&(r.from===-1||f.colonies.some(c=>c.id===r.from))&&typeof r.active==='boolean'&&finite(r.delivered))&&finite(f.shipments);}
export function validMap(map){return !!map&&map.size===40&&Number.isInteger(map.seed)&&Number.isInteger(map.biome)&&map.biome>=0&&map.biome<6&&Array.isArray(map.terrain)&&map.terrain.length===1600&&map.terrain.every(t=>t&&[-1,0,1,2,3].includes(t.h)&&['grass','water','forest','path'].includes(t.kind))&&Array.isArray(map.discovered)&&map.discovered.length===1600&&map.discovered.every(v=>v===0||v===1)&&Array.isArray(map.deposits)&&map.deposits.length<=10&&map.deposits.every(d=>Number.isFinite(d.x)&&d.x>=0&&d.x<40&&Number.isFinite(d.y)&&d.y>=0&&d.y<40&&Number.isFinite(d.amount)&&d.amount>=0&&d.amount<=1000&&['alloy','energy'].includes(d.resource));}

export function tradeMineral(s,index){if(!Number.isInteger(index)||index<0||index>=6||!has(s,'market'))return{ok:false,message:'Construye un mercado en Aurora para comerciar minerales.'};if(s.frontier.minerals[index]<10)return{ok:false,message:'Necesitas 10 unidades de este mineral.'};s.frontier.minerals[index]-=10;const amount=[120,140,180,200,220,260][index];s.resources.credits=Math.min(999999,s.resources.credits+amount);return{ok:true,message:'Venta de '+BIOMES[index].mineral+': +'+amount+' áureos.'};}
