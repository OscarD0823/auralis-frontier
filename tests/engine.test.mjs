import test from 'node:test';
import assert from 'node:assert/strict';
import * as E from '../dist/engine.js';
const now=Date.now();
test('production is capped at four offline hours and save round trips',()=>{
  const s=E.createGame(now);assert.ok(E.readSave(E.encodeSave(s),now));E.advance(s,now+86400000);assert.equal(s.resources.credits,900+2*14400);assert.equal(s.resources.alloy,420+1.2*14400);
});
test('construction only spends coins on valid, flat, unoccupied ground',()=>{
  const s=E.createGame(now),before=s.resources.credits;assert.equal(E.build(s,'mine',7,7,now).ok,false);assert.equal(s.resources.credits,before);
  assert.equal(E.build(s,'mine',3,3,now).ok,true);assert.equal(s.resources.credits,before-180);assert.equal(E.production(s,now).alloy,1.2);E.advance(s,now+9000);assert.equal(E.production(s,now+9000).alloy,2.4);
  s.terrain[12*E.GRID+12].h=1;assert.equal(E.canPlace(s,'mine',12,12),false);
});
test('training queue delivers each unit once and enforces capacity',()=>{
  const s=E.createGame(now);assert.equal(E.train(s,'ranger',now).ok,true);E.advance(s,now+6000);assert.equal(s.army.ranger,7);E.advance(s,now+12000);assert.equal(s.army.ranger,7);
  s.army={ranger:60,bulwark:0,wasp:0};assert.equal(E.train(s,'ranger',now+12000).ok,false);
});
test('terrain tools charge coins, preserve buildings, and affect buildability',()=>{
  const s=E.createGame(now),coins=s.resources.credits;assert.equal(E.reform(s,'raise',7,7).ok,false);assert.equal(s.resources.credits,coins);
  assert.equal(E.reform(s,'lower',3,3).ok,true);assert.equal(s.terrain[3*E.GRID+3].kind,'water');assert.equal(E.canPlace(s,'mine',3,3),false);
  assert.equal(E.reform(s,'flatten',3,3).ok,true);assert.equal(E.canPlace(s,'mine',3,3),true);assert.equal(s.resources.credits,coins-50);
});
test('NPC requests and market exchanges cannot pay twice or overspend',()=>{
  const s=E.createGame(now);E.spawnNpc(s,now);const o=s.offers[0],coins=s.resources.credits,alloy=s.resources.alloy;assert.equal(E.fulfill(s,o.id,now).ok,true);assert.equal(s.resources.credits,coins+o.reward);assert.equal(s.resources.alloy,alloy-o.amount);assert.equal(E.fulfill(s,o.id,now).ok,false);assert.equal(s.contracts,1);
  s.resources.energy=20;assert.equal(E.trade(s,'energy').ok,false);assert.equal(s.resources.energy,20);
});
test('attack starts with committed troops, reserves return on retreat, and campaign locks',()=>{
  const s=E.createGame(now);assert.equal(E.startBattle(s,2).ok,false);assert.equal(E.startBattle(s,0).ok,true);assert.equal(E.unitCount(s.army),0);assert.equal(E.deploy(s,'ranger',10,10).ok,false);assert.equal(E.deploy(s,'ranger',3,8).ok,true);assert.equal(s.battle.reserve.ranger,5);E.finishBattle(s,true);assert.equal(E.unitCount(s.army),8);assert.equal(s.campaign,0);
});
test('combat produces a real victory with rewards and a valid saved battle',()=>{
  const s=E.createGame(now);s.army={ranger:15,bulwark:4,wasp:3};E.startBattle(s,0,now);for(const type of Object.keys(E.UNITS))while(s.battle.reserve[type])E.deploy(s,type,4,7+Math.random());assert.ok(E.readSave(E.encodeSave(s),now));
  for(let i=0;i<1800&&!s.battle.outcome;i++)E.battleStep(s,.1);assert.equal(s.battle.outcome,'victory');const coins=s.resources.credits;const result=E.finishBattle(s);assert.ok(result.victory);assert.equal(s.campaign,1);assert.equal(s.resources.credits,coins+500);assert.equal(E.finishBattle(s).ok,false);
});
test('AI raids damage actual base buildings and towers fire back',()=>{
  const s=E.createGame(now);E.startRaid(s,now);assert.ok(s.raid.units.length);assert.equal(E.startBattle(s,0).ok,false);const shots=[];for(let i=0;i<1800&&!s.raid.outcome;i++)shots.push(...E.raidStep(s,.1));assert.ok(shots.some(v=>v.enemy));assert.ok(shots.some(v=>!v.enemy));assert.ok(s.buildings.some(b=>b.hp<E.BUILDINGS[b.type].hp*b.level));assert.ok(s.raid.outcome);assert.ok(E.readSave(E.encodeSave(s),now));const result=E.finishRaid(s);assert.equal(typeof result.victory,'boolean');assert.equal(s.raid,null);
});
test('damaged production stops, repairs restore it, and buildings can move',()=>{
  const s=E.createGame(now),mine=s.buildings.find(b=>b.type==='mine');mine.hp=0;assert.equal(E.production(s,now).alloy,0);assert.equal(E.repair(s,mine.id).ok,true);assert.equal(E.production(s,now).alloy,1.2);assert.equal(E.moveBuilding(s,mine.id,3,3).ok,true);assert.equal(mine.x,3);
});
test('malformed and overlapping imports are rejected',()=>{
  assert.equal(E.readSave('bad'),null);for(const mutate of [s=>s.resources.credits=-1,s=>s.army.ranger=Infinity,s=>s.buildings[1].x=7,s=>s.terrain.pop(),s=>s.buildings[0].type='__proto__',s=>s.nextRaidAt='later']){const s=E.createGame(now);mutate(s);assert.equal(E.readSave(E.encodeSave(s),now),null);}
});
test('a moving army and a live raid remain reloadable throughout combat',()=>{
  const s=E.createGame(now);E.startBattle(s,0,now);E.deploy(s,'ranger',1.5,3);for(let i=0;i<200;i++){E.battleStep(s,.1);if(i%25===0)assert.ok(E.readSave(E.encodeSave(s),now),'battle save at step '+i);}E.finishBattle(s,true);E.startRaid(s,now);for(let i=0;i<200;i++){E.raidStep(s,.1);if(i%25===0)assert.ok(E.readSave(E.encodeSave(s),now),'raid save at step '+i);}
});
test('a bankrupt colony can restart production after the command falls',()=>{
  const s=E.createGame(now);s.resources={credits:0,alloy:0,energy:0};s.buildings.forEach(b=>b.hp=0);assert.equal(E.production(s,now).credits,0);assert.equal(E.repair(s,'hq').ok,true);assert.equal(E.production(s,now).credits,2);E.advance(s,now+10000);assert.equal(s.resources.credits,20);
});
test('0.1.0 colonies and battles migrate without losing the original roster',()=>{
  const s=E.createGame(now);for(const k of ['arcanist','golem','drake'])delete s.army[k];
  const migrated=E.readSave(E.encodeSave(s),now);assert.ok(migrated);assert.equal(migrated.army.ranger,6);assert.equal(migrated.army.drake,0);
  E.startBattle(s,0,now);for(const k of ['arcanist','golem','drake']){delete s.army[k];delete s.battle.reserve[k];}
  s.battle.enemies=s.battle.enemies.filter(e=>e.type==='core'||e.type==='turret');
  const battle=E.readSave(E.encodeSave(s),now);assert.ok(battle);assert.equal(battle.battle.reserve.ranger,6);E.finishBattle(battle,true);assert.equal(battle.army.drake,0);assert.equal(battle.army.ranger,6);
});
test('new troops unlock through command improvements and train normally',()=>{
  const s=E.createGame(now);s.resources.credits=10000;assert.equal(E.train(s,'arcanist',now).ok,false);assert.equal(E.train(s,'golem',now).ok,false);assert.equal(E.train(s,'drake',now).ok,false);
  const hq=s.buildings.find(b=>b.type==='command');hq.level=2;hq.hp=E.BUILDINGS.command.hp*2;
  assert.equal(E.train(s,'arcanist',now).ok,true);assert.equal(E.train(s,'golem',now).ok,true);assert.equal(E.train(s,'drake',now).ok,false);
  hq.level=3;hq.hp=E.BUILDINGS.command.hp*3;assert.equal(E.train(s,'drake',now).ok,true);E.advance(s,now+60000);
  assert.equal(s.army.arcanist,1);assert.equal(s.army.golem,1);assert.equal(s.army.drake,1);assert.ok(E.readSave(E.encodeSave(s),now+60000));
});
test('area attacks damage nearby targets and golems prioritize defences',()=>{
  const s=E.createGame(now);s.army.arcanist=1;s.army.golem=1;E.startBattle(s,0,now);E.deploy(s,'arcanist',4,8);const u=s.battle.units[0];u.x=9;u.y=8;
  const core=s.battle.enemies[0],other=s.battle.enemies[1];core.x=10;core.y=8;other.x=10.5;other.y=8;const hp=other.hp;E.battleStep(s,.1);assert.ok(core.hp<core.maxHp);assert.ok(other.hp<hp);
  E.deploy(s,'golem',4,8);const golem=s.battle.units[1];golem.x=8;golem.y=8;core.x=8.2;core.y=8;other.x=12;other.y=8;const before=golem.x;E.battleStep(s,.1);assert.ok(golem.x>before,'golem moves towards cannon instead of attacking nearby core');
});
