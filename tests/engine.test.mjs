import test from 'node:test';
import assert from 'node:assert/strict';
import * as E from '../dist/engine.js';
const now=Date.now();
test('production is capped at four offline hours and save round trips',()=>{
  const s=E.createGame(now);assert.ok(E.readSave(JSON.stringify(s),now));E.advance(s,now+86400000);assert.equal(s.resources.credits,900+2*14400);assert.equal(s.resources.alloy,420+1.2*14400);
});
test('construction only spends coins on valid, flat, unoccupied ground',()=>{
  const s=E.createGame(now),before=s.resources.credits;assert.equal(E.build(s,'mine',7,7,now).ok,false);assert.equal(s.resources.credits,before);
  assert.equal(E.build(s,'mine',3,3,now).ok,true);assert.equal(s.resources.credits,before-180);assert.equal(E.production(s,now).alloy,1.2);E.advance(s,now+9000);assert.equal(E.production(s,now+9000).alloy,2.4);
  s.terrain[12*18+12].h=1;assert.equal(E.canPlace(s,'mine',12,12),false);
});
test('training queue delivers each unit once and enforces capacity',()=>{
  const s=E.createGame(now);assert.equal(E.train(s,'ranger',now).ok,true);E.advance(s,now+6000);assert.equal(s.army.ranger,7);E.advance(s,now+12000);assert.equal(s.army.ranger,7);
  s.army={ranger:60,bulwark:0,wasp:0};assert.equal(E.train(s,'ranger',now+12000).ok,false);
});
test('terrain tools charge coins, preserve buildings, and affect buildability',()=>{
  const s=E.createGame(now),coins=s.resources.credits;assert.equal(E.reform(s,'raise',7,7).ok,false);assert.equal(s.resources.credits,coins);
  assert.equal(E.reform(s,'lower',3,3).ok,true);assert.equal(s.terrain[3*18+3].kind,'water');assert.equal(E.canPlace(s,'mine',3,3),false);
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
  const s=E.createGame(now);s.army={ranger:15,bulwark:4,wasp:3};E.startBattle(s,0,now);for(const type of Object.keys(E.UNITS))while(s.battle.reserve[type])E.deploy(s,type,4,7+Math.random());assert.ok(E.readSave(JSON.stringify(s),now));
  for(let i=0;i<1800&&!s.battle.outcome;i++)E.battleStep(s,.1);assert.equal(s.battle.outcome,'victory');const coins=s.resources.credits;const result=E.finishBattle(s);assert.ok(result.victory);assert.equal(s.campaign,1);assert.equal(s.resources.credits,coins+500);assert.equal(E.finishBattle(s).ok,false);
});
test('AI raids damage actual base buildings and towers fire back',()=>{
  const s=E.createGame(now);E.startRaid(s,now);assert.ok(s.raid.units.length);assert.equal(E.startBattle(s,0).ok,false);const shots=[];for(let i=0;i<1800&&!s.raid.outcome;i++)shots.push(...E.raidStep(s,.1));assert.ok(shots.some(v=>v.enemy));assert.ok(shots.some(v=>!v.enemy));assert.ok(s.buildings.some(b=>b.hp<E.BUILDINGS[b.type].hp*b.level));assert.ok(s.raid.outcome);assert.ok(E.readSave(JSON.stringify(s),now));const result=E.finishRaid(s);assert.equal(typeof result.victory,'boolean');assert.equal(s.raid,null);
});
test('damaged production stops, repairs restore it, and buildings can move',()=>{
  const s=E.createGame(now),mine=s.buildings.find(b=>b.type==='mine');mine.hp=0;assert.equal(E.production(s,now).alloy,0);assert.equal(E.repair(s,mine.id).ok,true);assert.equal(E.production(s,now).alloy,1.2);assert.equal(E.moveBuilding(s,mine.id,3,3).ok,true);assert.equal(mine.x,3);
});
test('malformed and overlapping imports are rejected',()=>{
  assert.equal(E.readSave('bad'),null);for(const mutate of [s=>s.resources.credits=-1,s=>s.army.ranger=Infinity,s=>s.buildings[1].x=7,s=>s.terrain.pop(),s=>s.buildings[0].type='__proto__',s=>s.nextRaidAt='later']){const s=E.createGame(now);mutate(s);assert.equal(E.readSave(JSON.stringify(s),now),null);}
});
test('a moving army and a live raid remain reloadable throughout combat',()=>{
  const s=E.createGame(now);E.startBattle(s,0,now);E.deploy(s,'ranger',1.5,3);for(let i=0;i<200;i++){E.battleStep(s,.1);assert.ok(E.readSave(JSON.stringify(s),now),'battle save at step '+i);}E.finishBattle(s,true);E.startRaid(s,now);for(let i=0;i<200;i++){E.raidStep(s,.1);assert.ok(E.readSave(JSON.stringify(s),now),'raid save at step '+i);}
});
test('a bankrupt colony can restart production after the command falls',()=>{
  const s=E.createGame(now);s.resources={credits:0,alloy:0,energy:0};s.buildings.forEach(b=>b.hp=0);assert.equal(E.production(s,now).credits,0);assert.equal(E.repair(s,'hq').ok,true);assert.equal(E.production(s,now).credits,2);E.advance(s,now+10000);assert.equal(s.resources.credits,20);
});
