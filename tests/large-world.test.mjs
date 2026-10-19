import test from 'node:test';
import assert from 'node:assert/strict';
import * as E from '../dist/engine.js';
function expedition(mode='normal'){const s=E.createGame();s.resources.credits=20000;s.resources.alloy=20000;s.buildings.push({id:'depot',type:'depot',x:22,y:4,level:1,hp:E.BUILDINGS.depot.hp});E.setDifficulty(s,mode);E.openRoute(s,0);E.beginExpedition(s,0);return s;}
test('playable surface grows by more than 10000 percent for home and regional maps',()=>{
  assert.ok((E.GRID**2/48**2-1)*100>=10000);assert.ok((E.REGION_SIZE**2/40**2-1)*100>=10000);
  const s=E.createGame();assert.equal(s.terrain.length,512**2);assert.equal(E.generateRegion(992,0).terrain.length,416**2);
});
test('procedural mountains, cliffs, rivers and bridges exist and keep a reachable route',()=>{
  for(const mode of Object.keys(E.DIFFICULTIES)){const map=E.generateRegion(99123,0,E.REGION_SIZE,mode),kinds=new Set(map.terrain.map(t=>t.kind));for(const type of ['mountain','cliff','water','bridge','path'])assert.ok(kinds.has(type),mode+' '+type);const [x,y]=map.positions[0],route=E.findTerrainPath(map,4,9,x,y,{});assert.ok(route.reached);assert.ok(route.path.length>200);for(const p of route.path)assert.ok(E.walkable(map,Math.floor(p.x),Math.floor(p.y),{}));}
});
test('ground troops cross at bridges and avoid cliffs; boats and aircraft obey their terrain rules',()=>{
  const map={size:32,terrain:Array.from({length:32**2},(_,i)=>({h:i%32===12?-1:0,kind:i%32===12?'water':'grass'}))};map.terrain[15*32+12]={h:0,kind:'bridge'};for(let y=0;y<30;y++)if(y!==20)map.terrain[y*32+20]={h:8,kind:'cliff'};
  const path=E.findTerrainPath(map,3,3,28,3,{});assert.ok(path.reached);assert.ok(path.path.some(p=>Math.floor(p.x)===12&&Math.floor(p.y)===15));assert.ok(path.path.some(p=>Math.floor(p.x)===20&&Math.floor(p.y)===20));assert.equal(E.walkable(map,12,2,{}),false);assert.equal(E.walkable(map,12,2,{naval:true}),true);assert.equal(E.walkable(map,3,3,{naval:true}),false);assert.equal(E.walkable(map,20,2,{flying:true}),true);
});
test('fog hides unexplored terrain, remembers discovered cells and mountains block ground vision',()=>{
  const map={size:32,terrain:Array.from({length:1024},()=>({kind:'grass',h:0})),discovered:Array(1024).fill(0)};for(let y=3;y<20;y++)map.terrain[y*32+12]={kind:'mountain',h:10};E.updateVision(map,[{x:10,y:10,hp:10}],[],0,7);assert.equal(map.discovered[10*32+12],1);assert.equal(map.discovered[10*32+14],0);E.updateVision(map,[{x:10,y:10,hp:10,flying:true}],[],1,7);assert.equal(map.discovered[10*32+14],1);E.updateVision(map,[{x:27,y:27,hp:10}],[],2,5);assert.equal(map.discovered[10*32+10],1);assert.equal(E.inSight(map,10,10),false);assert.equal(E.inSight(map,27,27),true);
});
test('exploration survives retreat, reload and repeat visits, with separate difficulty records',()=>{
  const s=expedition();E.reveal(s.battle.map,100,100,8);E.finishBattle(s,true);const restored=E.readSave(E.encodeSave(s));assert.ok(restored);E.beginExpedition(restored,0);assert.equal(restored.battle.map.discovered[100*416+100],1);E.finishBattle(restored,true);E.setDifficulty(restored,'extreme');E.beginExpedition(restored,0);assert.equal(restored.battle.map.discovered[100*416+100],0);E.finishBattle(restored,true);E.setDifficulty(restored,'normal');E.beginExpedition(restored,0);assert.equal(restored.battle.map.discovered[100*416+100],1);
});
test('difficulty changes enemy strength, vision and supply costs without resetting the colony',()=>{
  const easy=expedition('explorer'),hard=expedition('extreme');assert.ok(hard.battle.enemies[0].hp>easy.battle.enemies[0].hp);const a=easy.resources.alloy,b=hard.resources.alloy;E.environmentalStep(easy,.1);E.environmentalStep(hard,.1);assert.ok(b-hard.resources.alloy>a-easy.resources.alloy);assert.equal(E.setDifficulty(hard,'normal').ok,false);assert.equal(E.DIFFICULTIES.extreme.vision,4);assert.equal(E.DIFFICULTIES.explorer.vision,8);
});
test('packed saves remain small and preserve heights, fog, active combat and terrain edits',()=>{
  const s=expedition();let data=E.encodeSave(s);assert.ok(data.length<1500000);let restored=E.readSave(data);assert.ok(restored);assert.deepEqual(restored.terrain[120*512+130],s.terrain[120*512+130]);assert.deepEqual(restored.battle.map.terrain[120*416+130],s.battle.map.terrain[120*416+130]);E.finishBattle(s,true);E.encodeSave(s);assert.equal(E.reform(s,'lower',3,3).ok,true);restored=E.readSave(E.encodeSave(s));assert.equal(restored.terrain[3*512+3].kind,'water');assert.equal(restored.explored[3*512+3],1);
});
test('unknown land cannot be built on and scouts can automatically explore the home map',()=>{
  const s=E.createGame();assert.equal(E.canPlace(s,'mine',100,100),false);s.army=Object.fromEntries(Object.keys(E.UNITS).map(k=>[k,k==='ranger'?1:0]));E.syncGarrison(s);const u=s.garrison[0],before=E.exploredCount(s.explored);assert.equal(E.issueOrder(s,[u.id],'explore').ok,true);for(let i=0;i<300;i++)E.tacticalStep(s,.1,true);assert.ok(E.exploredCount(s.explored)>before);assert.ok(Math.hypot(u.x-3,u.y-11)>3);assert.ok(E.readSave(E.encodeSave(s)));
});
test('0.3 terrain and armies migrate into the larger world without moving old structures',()=>{
  const s=E.createGame(),old=s.terrain;s.terrain=Array.from({length:48**2},(_,i)=>({...old[Math.floor(i/48)*512+i%48]}));s.terrain[12*48+12]={h:3,kind:'path'};delete s.explored;delete s.frontier.difficulty;delete s.frontier.exploration;const loaded=E.readSave(JSON.stringify(s));assert.ok(loaded);assert.deepEqual(loaded.buildings,s.buildings);assert.deepEqual(loaded.terrain[12*512+12],{h:3,kind:'path'});assert.equal(loaded.explored[47*512+47],1);assert.equal(loaded.explored[100*512+100],0);assert.equal(loaded.army.ranger,6);
});
