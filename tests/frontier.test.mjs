import test from 'node:test';
import assert from 'node:assert/strict';
import * as E from '../dist/engine.js';
const now=Date.now();
function fixture(){const s=E.createGame(now);s.resources={credits:50000,alloy:50000,energy:50000};let i=0;for(const type of ['depot','garage','airfield','dock','embassy','lab','hospital','market'])s.buildings.push({id:'test-'+type,type,x:20+(i++%4)*4,y:20+Math.floor((i-1)/4)*4,level:1,hp:E.BUILDINGS[type].hp});return s;}
test('procedural worlds are repeatable, diverse, connected and initially concealed',()=>{
  for(let biome=0;biome<6;biome++){const a=E.generateRegion(12345,biome),b=E.generateRegion(12345,biome),c=E.generateRegion(12999,biome);assert.deepEqual(a,b);assert.notDeepEqual(a.terrain,c.terrain);assert.equal(a.discovered.reduce((n,v)=>n+v,0),0);assert.ok(E.validMap(a));assert.ok(E.walkable(a,4,9,{}));}
  const s=fixture();assert.equal(E.beginExpedition(s,0).ok,false);assert.equal(E.openRoute(s,0).ok,true);assert.equal(E.beginExpedition(s,0).ok,true);assert.ok(s.battle.map.discovered.some(v=>v===1));assert.ok(s.battle.enemies.every(e=>!E.visible(s.battle,e)));assert.ok(E.readSave(s));
});
test('moving and holding follow explicit orders; units reveal fog and return with valid saves',()=>{
  const s=fixture();E.openRoute(s,0);E.beginExpedition(s,0);E.deploy(s,'ranger',4,8);const u=s.battle.units[0],initial=s.battle.map.discovered.reduce((a,b)=>a+b,0);E.issueOrder(s,[u.id],'move',15,9);
  for(let i=0;i<110;i++)E.battleStep(s,.1);assert.ok(u.x>12);assert.ok(s.battle.map.discovered.reduce((a,b)=>a+b,0)>initial);E.issueOrder(s,[u.id],'hold');const x=u.x;for(let i=0;i<20;i++)E.battleStep(s,.1);assert.equal(u.x,x);assert.ok(E.readSave(s));E.finishBattle(s,true);assert.equal(s.army.ranger,6);
});
test('orders for multiple troops form different destinations and reject invalid targets',()=>{
  const s=fixture();E.syncGarrison(s);const ids=s.garrison.slice(0,4).map(u=>u.id);assert.equal(E.issueOrder(s,ids,'move',NaN,4).ok,false);assert.equal(E.issueOrder(s,ids,'attack',4,4,'missing').ok,false);assert.equal(E.issueOrder(s,ids,'move',16,16).ok,true);assert.equal(new Set(s.garrison.slice(0,4).map(u=>u.order.x+','+u.order.y)).size,4);assert.ok(E.readSave(s));
});
test('naval expeditions require boats, protect embarked units and allow a real landing',()=>{
  const s=fixture();E.openRoute(s,1);assert.equal(E.beginExpedition(s,1).ok,false);s.army.gunboat=1;s.army.transport=1;assert.equal(E.beginExpedition(s,1).ok,true);assert.equal(E.deploy(s,'transport',4,8).ok,false);assert.equal(E.deploy(s,'ranger',4,13).ok,false);assert.equal(E.deploy(s,'transport',4,13).ok,true);assert.equal(E.deploy(s,'ranger',4,10).ok,true);const boat=s.battle.units[0],u=s.battle.units[1];assert.equal(E.embark(s,[u.id]).ok,true);assert.equal(u.embarked,boat.id);E.issueOrder(s,[boat.id],'move',s.battle.map.shoreX-.5,10.5);
  for(let i=0;i<1300&&Math.hypot(boat.x-(s.battle.map.shoreX-.5),boat.y-10.5)>1;i++)E.battleStep(s,.1);assert.ok(boat.x>18);assert.equal(u.x,boat.x);assert.ok(E.readSave(s));assert.equal(E.embark(s,[boat.id],true).ok,true);assert.equal(u.embarked,undefined);assert.ok(u.x>=s.battle.map.shoreX);assert.notEqual(s.battle.map.terrain[Math.floor(u.y)*E.REGION_SIZE+Math.floor(u.x)].kind,'water');
});
test('conquest unlocks neighbours; colonies send resources through connected routes only',()=>{
  const s=fixture();s.campaign=2;E.openRoute(s,0);E.beginExpedition(s,0);s.battle.enemies.forEach(e=>e.hp=0);E.battleStep(s,.1);const coins=s.resources.credits,result=E.finishBattle(s);assert.equal(result.victory,true);assert.equal(s.campaign,2);assert.equal(s.resources.credits-coins,E.regionInfo(s,0).reward.credits);assert.equal(s.frontier.regions[0].status,'owned');assert.equal(s.frontier.regions[6].status,'open');assert.equal(E.colonize(s,0,'industry').ok,true);assert.equal(E.colonize(s,0,'industry').ok,false);const alloy=s.resources.alloy;E.advance(s,now+10000);assert.ok(s.resources.alloy>alloy+12);assert.ok(s.frontier.shipments>0);E.toggleRoute(s,0);assert.equal(E.colonyRates(s).alloy,0);assert.ok(E.readSave(s,now+10000));
});
test('diplomacy grants a lasting benefit and cannot buy the same alliance twice',()=>{
  const s=fixture();assert.equal(E.diplomacy(s,1,'ally').ok,false);for(let i=0;i<3;i++)assert.equal(E.diplomacy(s,1,'aid').ok,true);assert.equal(E.diplomacy(s,1,'ally').ok,true);assert.equal(s.frontier.alliances[1],true);assert.equal(E.diplomacy(s,1,'ally').ok,false);assert.ok(E.readSave(s));
});
test('supply failure slows the expedition and disasters warn before causing damage',()=>{
  const s=fixture();E.openRoute(s,0);E.beginExpedition(s,0);E.deploy(s,'ranger',4,8);const b=s.battle,u=b.units[0];E.toggleRoute(s,0);for(let i=0;i<100;i++)E.environmentalStep(s,.1);assert.ok(b.supply<90);b.elapsed=b.nextDisaster;E.environmentalStep(s,.1);assert.ok(b.disaster);u.x=b.disaster.x;u.y=b.disaster.y;const hp=u.hp;E.environmentalStep(s,.1);assert.equal(u.hp,hp);b.elapsed=b.disaster.starts+1;E.environmentalStep(s,.1);assert.ok(u.hp<hp);assert.ok(E.readSave(s));
});
test('specialist buildings unlock vehicles, research, capacity, trade and hospital rescues',()=>{
  const s=fixture();assert.equal(E.capacity(s),80);assert.equal(E.train(s,'jeep').ok,true);assert.equal(E.train(s,'helicopter').ok,true);assert.equal(E.train(s,'gunboat').ok,true);assert.equal(E.research(s,'weapons').ok,true);assert.equal(E.research(s,'weapons').ok,false);const coins=s.resources.credits;E.trade(s,'alloy');assert.equal(s.resources.credits-coins,90);
  E.startBattle(s,0);for(let i=0;i<4;i++)E.deploy(s,'ranger',4,8);s.battle.units.forEach(u=>u.hp=0);const before=s.battle.reserve.ranger;E.finishBattle(s,true);assert.equal(s.army.ranger,before+1);
});
test('18 by 18 saves migrate terrain without relocating buildings or losing tile edits',()=>{
  const s=E.createGame(now),old=Array.from({length:324},(_,i)=>({...s.terrain[Math.floor(i/18)*E.GRID+i%18]}));old[3*18+3]={h:2,kind:'path'};s.terrain=old;delete s.frontier;delete s.tech;delete s.garrison;for(const type of Object.keys(s.army))if(!['ranger','wasp','bulwark'].includes(type))delete s.army[type];const m=E.readSave(s,now);assert.ok(m);assert.equal(m.terrain.length,E.GRID**2);assert.deepEqual(m.terrain[3*E.GRID+3],{h:2,kind:'path'});assert.deepEqual(m.buildings,s.buildings);assert.equal(m.army.ranger,6);
});
test('malformed world imports are rejected without accepting duplicate colonies or invalid orders',()=>{
  for(const mutate of [s=>s.frontier.regions[0].biome=99,s=>s.frontier.alliances=[true],s=>s.frontier.routes=[{from:-1,to:900,active:true,delivered:0}],s=>s.tech.weapons=50]){const s=fixture();mutate(s);assert.equal(E.readSave(s),null);}
});
