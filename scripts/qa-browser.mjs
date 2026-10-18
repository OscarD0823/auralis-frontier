import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import * as E from '../dist/engine.js';
const require=createRequire(import.meta.url);
const {chromium}=require('C:/Users/odcon/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const base=process.argv[2]||'http://127.0.0.1:4183/';
const browser=await chromium.launch({headless:true,channel:'msedge'}),context=await browser.newContext({viewport:{width:1440,height:940},acceptDownloads:true});
const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await mkdir('artifacts',{recursive:true});
const read=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('auralis-frontier-save-v1')));
async function seed(fn){const s=E.createGame();s.tutorialSeen=true;new Function('s','E',fn)(s,E);await page.goto('about:blank');const helper=await context.newPage();await helper.goto(new URL('icon.svg',base).href);await helper.evaluate(data=>localStorage.setItem('auralis-frontier-save-v1',data),JSON.stringify(s));await helper.close();await page.goto(base);await page.waitForTimeout(300);}
async function clickWorld(x,y){const pos=await page.locator('#game').evaluate((el,{x,y})=>{const r=el.getBoundingClientRect(),scale=Math.max(.6,Math.min(r.width/950,r.height/670))*1.1,t=52*scale;return {x:r.left+r.width*.51+(x-y)*t*.5,y:r.top+r.height*.49+(x+y-17)*t*.25};},{x,y});await page.mouse.click(pos.x,pos.y);}
try{
  await page.goto(base);await page.getByRole('button',{name:'COMENZAR MI COLONIA'}).click();
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await page.screenshot({path:'artifacts/base-desktop.png'});
  await page.locator('[data-action="select-build"][data-type="mine"]').click();await clickWorld(3.5,3.5);assert.equal((await read()).buildings.length,6);
  await page.locator('[data-view="army"]').click();await page.locator('[data-action="train"][data-type="ranger"]').click();assert.equal((await read()).jobs.length,1);
  await page.waitForTimeout(6800);assert.match(await page.locator('.unit-card').first().textContent(),/7 DISPONIBLES/);
  await page.screenshot({path:'artifacts/army-desktop.png'});
  await seed('E.spawnNpc(s);');await page.locator('[data-view="village"]').click();const coins=(await read()).resources.credits;await page.locator('[data-action="fulfill"]').click();assert.equal((await read()).contracts,1);assert.ok((await read()).resources.credits>coins);
  await seed('E.spawnNpc(s); E.spawnNpc(s);');await page.locator('[data-view="village"]').click();await page.screenshot({path:'artifacts/village-desktop.png'});
  await page.locator('[data-view="base"]').click();await page.locator('[data-action="terrain"][data-tool="flatten"]').click();await page.locator('[data-tool="lower"]').click();await clickWorld(12.5,12.5);assert.equal((await read()).terrain[12*E.GRID+12].kind,'water');
  await page.locator('#cancel-placement').click();await page.locator('[data-view="missions"]').click();await page.locator('[data-action="start-mission"][data-index="0"]').click();await clickWorld(3.5,8.5);assert.equal((await read()).battle.units.length,1);await page.screenshot({path:'artifacts/combat-desktop.png'});
  await page.locator('#retreat-btn').click();await page.locator('[data-action="retreat-confirm"]').click();assert.equal((await read()).battle,null);assert.equal((await read()).army.ranger,6);
  await seed('s.nextRaidAt=Date.now()-1; E.startRaid(s);');await page.waitForTimeout(1800);assert.equal(await page.locator('#battle-bar').isVisible(),true);await page.screenshot({path:'artifacts/raid-desktop.png'});
  await seed('E.startRaid(s); s.raid.units.forEach(u=>u.hp=0); s.raid.outcome="victory";');await page.locator('[data-action="finish-raid"]').click();assert.equal((await read()).raidsDefended,1);
  await seed('s.army={ranger:15,bulwark:4,wasp:3}; E.startBattle(s,0); for(const t of Object.keys(E.UNITS))while(s.battle.reserve[t])E.deploy(s,t,4,8);for(let i=0;i<1800&&!s.battle.outcome;i++)E.battleStep(s,.1);');await page.locator('[data-action="finish-battle"]').click();assert.equal((await read()).campaign,1);
  await page.locator('#settings-btn').click();const downloadPromise=page.waitForEvent('download');await page.locator('[data-action="export"]').click();const download=await downloadPromise;await download.saveAs('artifacts/qa-save.json');await page.locator('[data-action="close-modal"]').click();
  // Importing malformed data must preserve the current colony.
  await page.locator('#import-input').setInputFiles({name:'bad.json',mimeType:'application/json',buffer:Buffer.from('{"version":1}')});assert.equal((await read()).campaign,1);
  await page.reload();assert.equal((await read()).campaign,1);
  for(const width of [320,390,768]){
    await page.setViewportSize({width,height:844});await page.waitForTimeout(200);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`overflow at ${width}`);
    for(const v of ['base','army','missions','village']){await page.locator(`[data-view="${v}"]`).click();assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`${v} overflow at ${width}`);if(width===390)await page.screenshot({path:`artifacts/${v}-mobile.png`});}
  }
  await page.locator('[data-view="base"]').click();await page.locator('#downloads-btn').click();assert.equal(await page.locator('.download-option').count(),2);await page.screenshot({path:'artifacts/downloads-mobile.png'});await page.locator('[data-action="close-modal"]').click();
  await page.evaluate(()=>navigator.serviceWorker.ready);await page.reload();await context.setOffline(true);await page.reload();await page.waitForTimeout(500);assert.equal(await page.locator('#game').isVisible(),true);assert.equal((await read()).campaign,1);await context.setOffline(false);
  assert.deepEqual(errors,[]);console.log('PASS: construction, training, NPC, terrain, combat, retreat, raids, victory, export, invalid import, persistence, 320/390/768 layouts and offline reload.');
}finally{await writeFile('artifacts/browser-errors.json',JSON.stringify(errors,null,2));await browser.close();}
