export const VERSION = 1;
export const GRID = 18;
export const BUILDINGS = {
  command: { name: 'Centro de mando', tag: 'COMANDO', description: 'El corazón de tu colonia. Produce créditos y dirige la expansión.', cost: {}, rate: { credits: 2 }, color: '#75d4ca', size: 2, hp: 1800 },
  mine: { name: 'Extractor', tag: 'ECONOMÍA', description: 'Extrae aleación. Véndela o entrégala a los habitantes para ganar áureos.', cost: { credits: 180 }, rate: { alloy: 1.2 }, color: '#f3b75e', size: 2, hp: 600 },
  reactor: { name: 'Reactor de éter', tag: 'ALQUIMIA', description: 'Combina tecnología y magia para extraer éter. Los alquimistas pagan bien por él.', cost: { credits: 210 }, rate: { energy: 1 }, color: '#78c8ee', size: 2, hp: 500 },
  barracks: { name: 'Cuartel', tag: 'EJÉRCITO', description: 'Entrena exploradores, blindados y drones. Cada nivel acelera el entrenamiento.', cost: { credits: 320 }, rate: {}, color: '#a5bc82', size: 2, hp: 850 },
  refinery: { name: 'Refinería', tag: 'ECONOMÍA', description: 'Comercia los minerales de la frontera y produce áureos para tu colonia.', cost: { credits: 370 }, rate: { credits: 3 }, color: '#deab7d', size: 2, hp: 700 },
  turret: { name: 'Torre centinela', tag: 'DEFENSA', description: 'Dispara a los invasores. Cada nivel también mejora el daño de tu ejército un 4%.', cost: { credits: 330 }, rate: {}, color: '#d59c88', size: 1, hp: 1000 },
  sanctum: { name: 'Santuario', tag: 'MAGIA', description: 'Cristal de combate que dispara éter a larga distancia contra invasores.', cost: { credits: 580 }, rate: {}, color: '#bf9eeb', size: 2, hp: 750 },
  wall: { name: 'Muralla', tag: 'DEFENSA', description: 'Frena las incursiones y protege a los edificios de producción.', cost: { credits: 70 }, rate: {}, color: '#a8b1a0', size: 1, hp: 1400 },
};
export const UNITS = {
  ranger: { name: 'Explorador', short: 'EXPLORADOR', description: 'Infantería versátil. Rápida y económica.', cost: { credits: 80 }, hp: 125, damage: 19, range: 1.9, speed: 1.5, time: 6, color: '#8de3ce' },
  bulwark: { name: 'Bastión', short: 'BASTIÓN', description: 'Blindado pesado. Resiste el fuego enemigo.', cost: { credits: 260 }, hp: 430, damage: 40, range: 2.7, speed: .72, time: 12, color: '#f0c77e' },
  wasp: { name: 'Avispa arcana', short: 'AVISPA ARCANA', description: 'Dron impulsado por magia. Gran alcance y movilidad.', cost: { credits: 210 }, hp: 160, damage: 25, range: 3.6, speed: 1.65, time: 9, color: '#bbabf5' },
};
export const MISSIONS = [
  { name: 'Señal en el desierto', region: 'SECTOR 01 · LAS DUNAS', description: 'Una estación del Eclipse bloquea la ruta de suministros. Destruye su núcleo y abre el paso.', reward: { credits: 500, alloy: 200, energy: 90 }, turrets: 2, hp: 650 },
  { name: 'Ciudadela de cobre', region: 'SECTOR 02 · CLAN DEL HIERRO', description: 'Una fortaleza industrial llena de riquezas. Sus torres y guardianes exigen un ejército preparado.', reward: { credits: 2800, alloy: 1400, energy: 600 }, turrets: 4, hp: 2200 },
  { name: 'El trono del Eclipse', region: 'SECTOR 03 · ORDEN ARCANA', description: 'Una ciudadela de magia y tecnología protege un tesoro enorme. Mejora tu base y recluta un gran ejército.', reward: { credits: 6500, alloy: 3200, energy: 1800 }, turrets: 4, hp: 4500 },
];
export const unitCount = army => Object.values(army).reduce((a,b)=>a+b,0);
export const ready = (b, now) => (!b.readyAt || b.readyAt <= now) && b.hp !== 0;
export function createGame(now = Date.now()) {
  return { version: VERSION, createdAt: now, updatedAt: now, resources: { credits: 900, alloy: 420, energy: 240 }, xp: 0, campaign: 0, army: { ranger: 6, bulwark: 1, wasp: 1 }, jobs: [], buildings: [
    { id: 'hq', type: 'command', x: 7, y: 7, level: 1 },
    { id: 'mine-0', type: 'mine', x: 4, y: 7, level: 1 },
    { id: 'reactor-0', type: 'reactor', x: 7, y: 4, level: 1 },
    { id: 'barracks-0', type: 'barracks', x: 10, y: 7, level: 1 },
    { id: 'turret-0', type: 'turret', x: 6, y: 10, level: 1 },
  ].map(b=>({...b,hp:BUILDINGS[b.type].hp})), battle: null, history: [], tutorialSeen: false,
    terrain: Array.from({length:GRID*GRID},(_,i)=>{const x=i%GRID,y=Math.floor(i/GRID);return {h:0,kind:(x<2||y<2||x>15||y>15)?'forest':'grass'};}),
    offers: [], nextNpcAt: now+15000, npcSerial: 0, contracts: 0, raid: null, nextRaidAt:now+360000, raidsDefended:0 };
}
export function production(s, now = Date.now()) {
  const rate = { credits: 0, alloy: 0, energy: 0 };
  for (const b of s.buildings) if (ready(b, now)) for (const [k,v] of Object.entries(BUILDINGS[b.type].rate)) rate[k] += v*b.level;
  return rate;
}
export function advance(s, now = Date.now()) {
  const end = Math.max(now, s.updatedAt), start = Math.max(s.updatedAt, end - 14400000);
  for (const b of s.buildings) {
    const elapsed = b.hp===0?0:Math.max(0, end - Math.max(start, b.readyAt || 0)) / 1000;
    for (const [k,v] of Object.entries(BUILDINGS[b.type].rate)) s.resources[k] = Math.min(999999, s.resources[k]+elapsed*v*(b.nextLevel||b.level));
    if (b.readyAt && b.readyAt <= end) { delete b.readyAt; if (b.nextLevel) { b.level=b.nextLevel; delete b.nextLevel; b.hp=BUILDINGS[b.type].hp*b.level; s.xp+=30; } }
  }
  const completed = s.jobs.filter(j=>j.readyAt<=end);
  for (const j of completed) s.army[j.unit]++;
  s.jobs = s.jobs.filter(j=>j.readyAt>end);
  if(s.offers){s.offers=s.offers.filter(o=>o.expiresAt>end);if(end>=s.nextNpcAt&&s.offers.length<3){spawnNpc(s,end);s.nextNpcAt=end+75000;}}
  s.updatedAt = end;
  return completed.length;
}
export function affordable(s, cost) { return Object.entries(cost).every(([k,v])=>s.resources[k]>=v); }
function pay(s,cost) { for (const [k,v] of Object.entries(cost)) s.resources[k]-=v; }
export function canPlace(s,type,x,y) {
  const spec = BUILDINGS[type];
  if (!spec || type==='command' || !Number.isInteger(x) || !Number.isInteger(y) || x<1 || y<1 || x+spec.size>=GRID || y+spec.size>=GRID) return false;
  const h=s.terrain?.[y*GRID+x]?.h||0;
  for(let a=x;a<x+spec.size;a++)for(let c=y;c<y+spec.size;c++){const t=s.terrain?.[c*GRID+a];if(t&&(t.kind==='water'||t.kind==='forest'||t.h!==h))return false;}
  return !s.buildings.some(b=> x < b.x+BUILDINGS[b.type].size && x+spec.size>b.x && y<b.y+BUILDINGS[b.type].size && y+spec.size>b.y);
}
export function build(s,type,x,y,now=Date.now()) {
  if(s.raid)return {ok:false,message:'Termina la incursión antes de construir.'};
  if (!canPlace(s,type,x,y)) return {ok:false,message:'Necesitas terreno libre, llano y sin bosque. Puedes reformarlo.'};
  if (!affordable(s,BUILDINGS[type].cost)) return {ok:false,message:'Todavía no tienes suficientes recursos.'};
  if (s.buildings.length>=45) return {ok:false,message:'Has alcanzado el límite de 45 edificios.'};
  pay(s,BUILDINGS[type].cost);
  const id='b-'+now+'-'+s.buildings.length;
  s.buildings.push({id,type,x,y,level:1,hp:BUILDINGS[type].hp,readyAt:now+8000});s.xp+=15;
  return {ok:true,message:BUILDINGS[type].name+' en construcción.',id};
}
export function upgradeCost(b) { return { credits: 300*b.level*(b.type==='command'?2:1) }; }
export function upgrade(s,id,now=Date.now()) {
  if(s.raid)return {ok:false,message:'Termina la incursión antes de mejorar.'};
  const b=s.buildings.find(b=>b.id===id);
  if (!b || !ready(b,now)) return {ok:false,message:'Espera a que termine la construcción.'};
  if (b.level>=5) return {ok:false,message:'Este edificio ya alcanzó el nivel máximo.'};
  const cost=upgradeCost(b);
  if (!affordable(s,cost)) return {ok:false,message:'Todavía no tienes suficientes recursos.'};
  advance(s,now);pay(s,cost);b.nextLevel=b.level+1;b.readyAt=now+10000*b.level;
  return {ok:true,message:'Mejora iniciada. El edificio vuelve a producir cuando termine.'};
}
export function train(s,type,now=Date.now()) {
  if (!UNITS[type]) return {ok:false,message:'Unidad desconocida.'};
  const barracks=s.buildings.filter(b=>b.type==='barracks'&&ready(b,now));
  if (!barracks.length) return {ok:false,message:'Necesitas un cuartel terminado.'};
  if (unitCount(s.army)+s.jobs.length+(s.battle?unitCount(s.battle.reserve)+s.battle.units.filter(u=>u.hp>0).length:0)>=60) return {ok:false,message:'El límite de población es de 60 unidades.'};
  if (s.jobs.length>=8) return {ok:false,message:'La cola de entrenamiento está llena (8).'};
  if (!affordable(s,UNITS[type].cost)) return {ok:false,message:'Todavía no tienes suficientes recursos.'};
  pay(s,UNITS[type].cost);
  const level=Math.max(...barracks.map(b=>b.level));
  const tail=Math.max(now,...s.jobs.map(j=>j.readyAt));
  s.jobs.push({unit:type,readyAt:tail+UNITS[type].time*1000/(1+(level-1)*.2)});
  return {ok:true,message:UNITS[type].name+' añadido a la cola.'};
}
export function startBattle(s,index,now=Date.now()) {
  if(s.battle) return {ok:false,message:'Ya hay una operación en curso.'};
  if(s.raid)return {ok:false,message:'Defiende tu base antes de partir.'};
  if(!Number.isInteger(index)||index<0||index>=MISSIONS.length||index>s.campaign) return {ok:false,message:'Completa el sector anterior para desbloquear esta misión.'};
  if(!unitCount(s.army)) return {ok:false,message:'Entrena al menos una unidad antes de partir.'};
  const m=MISSIONS[index];
  const enemies=[{id:'core',type:'core',x:11.5,y:8,hp:m.hp,maxHp:m.hp,cooldown:0}];
  const positions=[[8,6],[10,11],[13,5],[14,10]];
  for(let i=0;i<m.turrets;i++)enemies.push({id:'enemy-'+i,type:'turret',x:positions[i][0],y:positions[i][1],hp:210+index*200,maxHp:210+index*200,cooldown:i*.25});
  const bonus=s.buildings.filter(b=>b.type==='turret'&&ready(b,now)).reduce((a,b)=>a+b.level*.04,0);
  s.battle={mission:index,reserve:{...s.army},units:[],enemies,elapsed:0,bonus:Math.min(bonus,.4),rally:{x:9,y:8},outcome:null};
  s.army={ranger:0,bulwark:0,wasp:0};
  return {ok:true,message:'Despliega tus tropas en la zona azul.'};
}
export function deploy(s,type,x,y) {
  const b=s.battle;
  if(!b||b.outcome||!UNITS[type]||!b.reserve[type])return {ok:false,message:'No quedan unidades de este tipo en reserva.'};
  if(!Number.isFinite(x)||!Number.isFinite(y)||x<1||x>5.5||y<2||y>15) return {ok:false,message:'Toca la zona azul a la izquierda para desplegar.'};
  b.reserve[type]--;
  b.units.push({id:'u-'+b.units.length,type,x,y,hp:UNITS[type].hp,maxHp:UNITS[type].hp,cooldown:0});
  return {ok:true,message:UNITS[type].name+' desplegado.'};
}
export function battleStep(s,dt) {
  const b=s.battle;if(!b||b.outcome)return [];
  dt=Math.min(.1,Math.max(0,dt));b.elapsed+=dt;
  const shots=[];
  for(const u of b.units) {
    if(u.hp<=0)continue;
    const targets=b.enemies.filter(e=>e.hp>0);if(!targets.length)break;
    targets.sort((a,c)=>Math.hypot(u.x-a.x,u.y-a.y)-Math.hypot(u.x-c.x,u.y-c.y));
    const e=targets[0],spec=UNITS[u.type],dist=Math.hypot(e.x-u.x,e.y-u.y);
    u.cooldown=Math.max(0,u.cooldown-dt);
    if(dist>spec.range) {u.x+=(e.x-u.x)/dist*spec.speed*dt;u.y+=(e.y-u.y)/dist*spec.speed*dt;}
    else if(u.cooldown<=0) {e.hp=Math.max(0,e.hp-spec.damage*(1+b.bonus));u.cooldown=.75;shots.push({x:u.x,y:u.y,tx:e.x,ty:e.y,enemy:false});}
  }
  for(const e of b.enemies) {
    if(e.hp<=0||e.type==='core')continue;
    e.cooldown=Math.max(0,e.cooldown-dt);
    const targets=b.units.filter(u=>u.hp>0&&Math.hypot(u.x-e.x,u.y-e.y)<4.6);
    targets.sort((a,c)=>Math.hypot(a.x-e.x,a.y-e.y)-Math.hypot(c.x-e.x,c.y-e.y));
    if(targets.length&&e.cooldown<=0){const u=targets[0];u.hp=Math.max(0,u.hp-(15+b.mission*15));e.cooldown=.95;shots.push({x:e.x,y:e.y,tx:u.x,ty:u.y,enemy:true});}
  }
  if(b.enemies.every(e=>e.hp<=0))b.outcome='victory';
  else if(b.elapsed>=180||(!unitCount(b.reserve)&&!b.units.some(u=>u.hp>0)))b.outcome='defeat';
  return shots;
}
export function finishBattle(s,retreat=false) {
  const b=s.battle;
  if(!b||(!retreat&&!b.outcome))return {ok:false,message:'La operación continúa.'};
  for(const type of Object.keys(UNITS))s.army[type]+=b.reserve[type]+b.units.filter(u=>u.type===type&&u.hp>0).length;
  const victory=!retreat&&b.outcome==='victory',first=victory&&b.mission===s.campaign;
  const reward=Object.fromEntries(Object.entries(MISSIONS[b.mission].reward).map(([k,v])=>[k,Math.floor(v*(first?1:.35))]));
  if(victory){for(const [k,v]of Object.entries(reward))s.resources[k]=Math.min(999999,s.resources[k]+v);s.xp+=first?150:40;if(first)s.campaign++;}
  const result={ok:true,victory,reward:victory?reward:null,survivors:unitCount(s.army),lost:b.units.filter(u=>u.hp<=0).length,message:victory?'Sector recuperado. Los supervivientes han vuelto a la base.':retreat?'Retirada completada. Las unidades supervivientes y las reservas vuelven a la base.':'Operación fallida. Las unidades supervivientes y las reservas vuelven a la base.'};
  s.history.unshift({mission:b.mission,victory,lost:result.lost,at:Date.now()});s.history=s.history.slice(0,10);s.battle=null;
  if(victory)s.nextRaidAt=Math.min(s.nextRaidAt,Date.now()+90000);
  return result;
}
export function readSave(raw,now=Date.now()) {
  let s;try{s=typeof raw==='string'?JSON.parse(raw):raw;}catch{return null;}
  const finite=(n,min,max)=>typeof n==='number'&&Number.isFinite(n)&&n>=min&&n<=max;
  const integer=(n,min,max)=>Number.isInteger(n)&&finite(n,min,max);
  if(!s||s.version!==VERSION||!finite(s.createdAt,0,now+86400000)||!finite(s.updatedAt,0,now+86400000)||!integer(s.campaign,0,3)||!finite(s.xp,0,1e9))return null;
  if(!s.resources||!['credits','alloy','energy'].every(k=>finite(s.resources[k],0,999999)))return null;
  if(!s.army||!Object.keys(s.army).every(k=>Object.hasOwn(UNITS,k))||!Object.keys(UNITS).every(k=>integer(s.army[k],0,60))||unitCount(s.army)>60)return null;
  if(!Array.isArray(s.buildings)||s.buildings.length<1||s.buildings.length>45)return null;
  const occupied=new Set(),ids=new Set();
  for(const b of s.buildings){
    if(!Object.hasOwn(BUILDINGS,b.type)||typeof b.id!=='string'||b.id.length>80||ids.has(b.id)||!integer(b.level,1,5)||!integer(b.x,1,16)||!integer(b.y,1,16)||b.x+BUILDINGS[b.type].size>=GRID||b.y+BUILDINGS[b.type].size>=GRID)return null;
    if(b.readyAt!==undefined&&!finite(b.readyAt,0,now+86400000))return null;
    if(b.nextLevel!==undefined&&(!integer(b.nextLevel,2,5)||b.nextLevel!==b.level+1||!b.readyAt))return null;
    ids.add(b.id);
    for(let x=b.x;x<b.x+BUILDINGS[b.type].size;x++)for(let y=b.y;y<b.y+BUILDINGS[b.type].size;y++){const key=x+','+y;if(occupied.has(key))return null;occupied.add(key);}
  }
  if(s.buildings.filter(b=>b.type==='command').length!==1)return null;
  for(const b of s.buildings)if(!finite(b.hp,0,BUILDINGS[b.type].hp*b.level))return null;
  if(!Array.isArray(s.terrain)||s.terrain.length!==GRID*GRID||s.terrain.some(t=>!t||!integer(t.h,-1,3)||!['grass','forest','water','path'].includes(t.kind)))return null;
  if(!finite(s.nextNpcAt,0,now+86400000)||!finite(s.nextRaidAt,0,now+86400000)||!integer(s.npcSerial,0,1e9)||!integer(s.contracts,0,1e9)||!integer(s.raidsDefended,0,1e9))return null;
  if(!Array.isArray(s.offers)||s.offers.length>3||s.offers.some(o=>!integer(o.id,0,1e9)||!integer(o.kind,0,2)||!['alloy','energy'].includes(o.resource)||!integer(o.amount,1,10000)||!integer(o.reward,1,100000)||!finite(o.expiresAt,0,now+86400000)))return null;
  if(s.raid){const r=s.raid;if(!finite(r.elapsed,0,181)||![null,'victory','defeat'].includes(r.outcome)||!Array.isArray(r.units)||r.units.length>20||r.units.some(u=>!finite(u.x,0,18)||!finite(u.y,0,18)||!finite(u.hp,0,2000)||!finite(u.maxHp,1,2000)||u.hp>u.maxHp||!finite(u.cooldown,-1,5)))return null;}
  if(!Array.isArray(s.jobs)||s.jobs.length>8||s.jobs.some(j=>!Object.hasOwn(UNITS,j.unit)||!finite(j.readyAt,0,now+86400000)))return null;
  if(s.battle){
    if(s.raid)return null;
    const b=s.battle;
    if(!integer(b.mission,0,2)||b.mission>s.campaign||!finite(b.elapsed,0,181)||!finite(b.bonus,0,.4)||![null,'victory','defeat'].includes(b.outcome)||!b.reserve||!Object.keys(b.reserve).every(k=>Object.hasOwn(UNITS,k))||!Object.keys(UNITS).every(k=>integer(b.reserve[k],0,60)))return null;
    if(!Array.isArray(b.units)||b.units.length>60||!Array.isArray(b.enemies)||b.enemies.length!==MISSIONS[b.mission].turrets+1)return null;
    const entity=e=>finite(e.x,0,18)&&finite(e.y,0,18)&&finite(e.hp,0,10000)&&finite(e.maxHp,1,10000)&&e.hp<=e.maxHp&&finite(e.cooldown,-1,5);
    if(b.units.some(u=>!Object.hasOwn(UNITS,u.type)||!entity(u))||b.enemies.some(e=>!['core','turret'].includes(e.type)||!entity(e))||b.enemies.filter(e=>e.type==='core').length!==1)return null;
    if(unitCount(s.army)+s.jobs.length+unitCount(b.reserve)+b.units.filter(u=>u.hp>0).length>60)return null;
  } else if(unitCount(s.army)+s.jobs.length>60)return null;
  // Strip unrelated JSON properties before the save enters the application.
  const clean=JSON.parse(JSON.stringify(s));clean.history=Array.isArray(s.history)?s.history.slice(0,10).filter(h=>integer(h.mission,0,2)&&typeof h.victory==='boolean'&&integer(h.lost,0,60)&&finite(h.at,0,now+86400000)):[];
  clean.tutorialSeen=!!s.tutorialSeen;
  return clean;
}

export const NPCS=[
  {name:'Mara, la ingeniera',role:'GREMIO MECÁNICO',text:'La caravana necesita piezas para cruzar el cañón. ¿Puedes conseguirme aleación?',resource:'alloy'},
  {name:'Elyan, el alquimista',role:'CÍRCULO ARCANO',text:'Los cristales del refugio están perdiendo fuerza. Necesito éter para restaurarlos.',resource:'energy'},
  {name:'Nora, la exploradora',role:'CARAVANA DE LA FRONTERA',text:'Estamos reconstruyendo un pueblo al otro lado del río. Nos faltan materiales.',resource:'alloy'},
];
export function spawnNpc(s,now=Date.now()){
  const id=s.npcSerial++,kind=id%NPCS.length,resource=NPCS[kind].resource,amount=60+(id%5)*30;
  s.offers.push({id,kind,resource,amount,reward:amount*3+100,expiresAt:now+300000});
}
export function fulfill(s,id,now=Date.now()){
  const offer=s.offers.find(o=>o.id===id);if(!offer||offer.expiresAt<now)return {ok:false,message:'Este encargo ya no está disponible.'};
  if(s.resources[offer.resource]<offer.amount)return {ok:false,message:'Todavía no tienes los recursos que necesita.'};
  s.resources[offer.resource]-=offer.amount;s.resources.credits=Math.min(999999,s.resources.credits+offer.reward);s.contracts++;s.xp+=40;s.offers=s.offers.filter(o=>o.id!==id);
  return {ok:true,message:'Encargo completado. Has recibido '+offer.reward+' áureos.'};
}
export function trade(s,resource){
  if(!['alloy','energy'].includes(resource)||s.resources[resource]<50)return {ok:false,message:'Necesitas al menos 50 unidades para vender.'};
  s.resources[resource]-=50;s.resources.credits=Math.min(999999,s.resources.credits+75);return {ok:true,message:'Has vendido 50 unidades por 75 áureos.'};
}
export function reform(s,tool,x,y){
  if(s.raid||s.battle)return {ok:false,message:'No puedes reformar el terreno durante un combate.'};
  if(!Number.isInteger(x)||!Number.isInteger(y)||x<1||y<1||x>=17||y>=17)return {ok:false,message:'Elige una casilla dentro del territorio.'};
  if(s.buildings.some(b=>x>=b.x&&x<b.x+BUILDINGS[b.type].size&&y>=b.y&&y<b.y+BUILDINGS[b.type].size))return {ok:false,message:'Mueve primero el edificio que ocupa esta casilla.'};
  const t=s.terrain[y*GRID+x],next={...t};
  if(tool==='flatten'){next.h=0;next.kind='grass';}
  else if(tool==='raise'){next.h=Math.min(3,t.h+1);next.kind='grass';}
  else if(tool==='lower'){next.h=Math.max(-1,t.h-1);next.kind=next.h<0?'water':'grass';}
  else if(tool==='forest')next.kind='forest';
  else if(tool==='path'){next.h=0;next.kind='path';}
  else return {ok:false,message:'Herramienta desconocida.'};
  if(next.h===t.h&&next.kind===t.kind)return {ok:false,message:'Esa casilla ya tiene esa forma.'};
  if(s.resources.credits<25)return {ok:false,message:'Necesitas 25 áureos por casilla.'};
  // Keep the command reachable from the map boundary; a moat cannot make the AI inert.
  const old=s.terrain[y*GRID+x];s.terrain[y*GRID+x]=next;
  if(!hasRoute(s)){s.terrain[y*GRID+x]=old;return {ok:false,message:'Conserva al menos un acceso terrestre al centro de mando.'};}
  s.resources.credits-=25;return {ok:true,message:'Terreno reformado. −25 áureos.'};
}
function hasRoute(s){
  const hq=s.buildings.find(b=>b.type==='command'),q=[[0,8]],seen=new Set(['0,8']);
  for(let i=0;i<q.length;i++){const [x,y]=q[i];if(x>=hq.x&&x<hq.x+2&&y>=hq.y&&y<hq.y+2)return true;
    for(const [a,b]of [[x-1,y],[x+1,y],[x,y-1],[x,y+1]])if(a>=0&&a<GRID&&b>=0&&b<GRID&&!seen.has(a+','+b)&&s.terrain[b*GRID+a].kind!=='water'&&Math.abs(s.terrain[b*GRID+a].h-s.terrain[y*GRID+x].h)<=1){seen.add(a+','+b);q.push([a,b]);}
  }return false;
}
export function moveBuilding(s,id,x,y){
  if(s.raid)return {ok:false,message:'Termina la incursión antes de mover edificios.'};
  const b=s.buildings.find(b=>b.id===id);if(!b)return {ok:false,message:'Edificio desconocido.'};
  const rest={...s,buildings:s.buildings.filter(c=>c!==b)},type=b.type==='command'?'barracks':b.type;
  if(!canPlace(rest,type,x,y))return {ok:false,message:'Elige terreno libre y llano.'};
  b.x=x;b.y=y;return {ok:true,message:'Edificio reubicado.'};
}
export function repair(s,id){
  if(s.raid)return {ok:false,message:'Termina la incursión antes de reparar.'};
  const b=s.buildings.find(b=>b.id===id);if(!b)return {ok:false,message:'Edificio desconocido.'};
  const max=BUILDINGS[b.type].hp*b.level,cost=Math.ceil((1-b.hp/max)*180*b.level);
  if(b.hp>=max)return {ok:false,message:'El edificio está en perfecto estado.'};
  if(b.type==='command'&&b.hp===0&&s.resources.credits<cost){b.hp=Math.ceil(max*.3);return {ok:true,message:'Los habitantes han restaurado el 30% del mando. Su producción permite reconstruir la colonia.'};}
  if(s.resources.credits<cost)return {ok:false,message:'Necesitas '+cost+' áureos para reparar.'};
  s.resources.credits-=cost;b.hp=max;return {ok:true,message:'Edificio reparado. −'+cost+' áureos.'};
}
export function startRaid(s,now=Date.now()){
  if(s.raid||s.battle)return false;
  const power=s.campaign+Math.floor(s.raidsDefended/2),n=Math.min(12,3+power*2);
  s.raid={elapsed:0,outcome:null,units:Array.from({length:n},(_,i)=>({id:'raider-'+i,x:.5,y:3+i%12,hp:130+power*45,maxHp:130+power*45,cooldown:0,type:'ranger'}))};
  s.nextRaidAt=now+420000;return true;
}
export function raidStep(s,dt){
  const r=s.raid;if(!r||r.outcome)return [];dt=Math.min(.1,Math.max(0,dt));r.elapsed+=dt;
  const shots=[],living=s.buildings.filter(b=>b.hp>0&&!b.readyAt);
  for(const u of r.units){
    if(u.hp<=0)continue;u.cooldown=Math.max(0,u.cooldown-dt);
    const targets=[...living].sort((a,b)=>Math.hypot(a.x+.5-u.x,a.y+.5-u.y)-Math.hypot(b.x+.5-u.x,b.y+.5-u.y));
    const b=targets[0];if(!b)break;
    const tx=b.x+BUILDINGS[b.type].size/2,ty=b.y+BUILDINGS[b.type].size/2,d=Math.hypot(tx-u.x,ty-u.y);
    if(d>1.7){const step=raidNext(s,u,{x:tx,y:ty});if(step){const dx=step.x-u.x,dy=step.y-u.y,dist=Math.hypot(dx,dy);if(dist>.03){u.x+=dx/dist*.75*dt;u.y+=dy/dist*.75*dt;}}}
    else if(u.cooldown<=0){b.hp=Math.max(0,b.hp-(20+s.campaign*10));u.cooldown=1;shots.push({x:u.x,y:u.y,tx,ty,enemy:true});}
  }
  // Towers and sanctuaries fire automatically. The garrison contributes to defence.
  for(const b of living.filter(b=>['turret','sanctum','command'].includes(b.type))){
    b.cooldown=Math.max(0,(b.cooldown||0)-dt);const range=b.type==='sanctum'?6:4.5,targets=r.units.filter(u=>u.hp>0&&Math.hypot(u.x-b.x,u.y-b.y)<range);
    targets.sort((a,c)=>Math.hypot(a.x-b.x,a.y-b.y)-Math.hypot(c.x-b.x,c.y-b.y));
    if(targets.length&&b.cooldown<=0){const u=targets[0],garrison=b.type==='command'?Math.min(25,unitCount(s.army)*2):0;u.hp=Math.max(0,u.hp-(b.type==='command'?10+garrison:b.type==='sanctum'?38:26)*b.level);b.cooldown=.8;shots.push({x:b.x+.5,y:b.y+.5,tx:u.x,ty:u.y,enemy:false});}
  }
  if(r.units.every(u=>u.hp<=0))r.outcome='victory';
  else if(r.elapsed>=180||!s.buildings.find(b=>b.type==='command').hp)r.outcome='defeat';
  return shots;
}
function raidNext(s,u,target){
  const sx=Math.floor(u.x),sy=Math.floor(u.y),tx=Math.floor(target.x),ty=Math.floor(target.y),q=[[sx,sy]],seen=new Set([sx+','+sy]),parents=new Map();let end=null;
  for(let i=0;i<q.length;i++){const [x,y]=q[i];if(x===tx&&y===ty){end=[x,y];break;}
    const ns=[[x-1,y],[x+1,y],[x,y-1],[x,y+1]].sort((a,b)=>Math.hypot(a[0]-tx,a[1]-ty)-Math.hypot(b[0]-tx,b[1]-ty));
    for(const [a,b]of ns)if(a>=0&&b>=0&&a<GRID&&b<GRID&&!seen.has(a+','+b)&&s.terrain[b*GRID+a].kind!=='water'&&Math.abs(s.terrain[b*GRID+a].h-s.terrain[y*GRID+x].h)<=1){seen.add(a+','+b);parents.set(a+','+b,[x,y]);q.push([a,b]);}
  }
  if(!end)return null;
  while(parents.has(end[0]+','+end[1])){const p=parents.get(end[0]+','+end[1]);if(p[0]===sx&&p[1]===sy)break;end=p;}
  return {x:end[0]+.5,y:end[1]+.5};
}
export function finishRaid(s){
  if(!s.raid?.outcome)return null;
  const victory=s.raid.outcome==='victory';let lost=0;
  if(victory){s.raidsDefended++;s.resources.credits=Math.min(999999,s.resources.credits+150);s.xp+=80;}
  else{lost=Math.floor(s.resources.credits*.15);s.resources.credits-=lost;}
  s.raid=null;s.nextRaidAt=Date.now()+420000;
  return {victory,lost,message:victory?'¡Incursión repelida! +150 áureos.':'El enemigo ha saqueado '+lost+' áureos. Repara tu base y refuerza las defensas.'};
}
