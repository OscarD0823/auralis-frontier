import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import * as E from '../dist/engine.js';
const require=createRequire(import.meta.url),{chromium}=require('C:/Users/odcon/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser=await chromium.launch({headless:true,channel:'msedge'}),context=await browser.newContext({viewport:{width:1440,height:940}}),page=await context.newPage(),errors=[];
page.on('pageerror',e=>errors.push(e.message));
try{
  const legacy=E.createGame();delete legacy.army.arcanist;delete legacy.army.golem;delete legacy.army.drake;legacy.tutorialSeen=true;legacy.resources.credits=4000;legacy.buildings.push({id:'old-workshop',type:'refinery',x:12,y:12,level:1,hp:700});
  await page.goto('http://127.0.0.1:4183/icon.svg');await page.evaluate(data=>localStorage.setItem('auralis-frontier-save-v1',data),E.encodeSave(legacy));await page.goto('http://127.0.0.1:4183/classic.html');
  await page.evaluate(async()=>{const a=await import('./art.js');await a.artReady;});
  const assets=await page.evaluate(async()=>{const a=await import('./art.js');return Object.keys(a.atlases);});assert.equal(assets.length,6);
  await page.locator('[data-view="army"]').click();assert.equal(await page.locator('.unit-card').count(),14);assert.equal(await page.locator('[data-type="arcanist"][data-action="train"]').isDisabled(),true);assert.equal(await page.locator('[data-type="drake"][data-action="train"]').isDisabled(),true);
  const legacyCheck=await page.evaluate(()=>JSON.parse(localStorage.getItem('auralis-frontier-save-v1')));assert.equal(legacyCheck.buildings.length,6);assert.equal(legacyCheck.army.ranger,6);assert.equal(legacyCheck.army.arcanist,0);
  await page.locator('[data-view="base"]').click();
  const pos=await page.locator('#game').evaluate(el=>{const r=el.getBoundingClientRect(),s=Math.max(.6,Math.min(r.width/950,r.height/670))*1.1;return{x:r.left+r.width*.51,y:r.top+r.height*.49-13*s};});
  await page.mouse.click(pos.x,pos.y);await page.locator('#modal [data-action="upgrade"]').click();await page.waitForTimeout(11100);await page.locator('#modal [data-action="close-modal"]').click();
  await page.locator('[data-view="army"]').click();assert.equal(await page.locator('[data-type="arcanist"][data-action="train"]').isEnabled(),true);assert.equal(await page.locator('[data-type="golem"][data-action="train"]').isEnabled(),true);assert.equal(await page.locator('[data-type="drake"][data-action="train"]').isDisabled(),true);
  await page.locator('[data-type="arcanist"][data-action="train"]').click();assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('auralis-frontier-save-v1')).jobs.at(-1).unit),'arcanist');
  const pixels=await page.locator('.unit-visual canvas').evaluateAll(nodes=>nodes.map(c=>{const data=c.getContext('2d').getImageData(0,0,c.width,c.height).data;let count=0;for(let i=3;i<data.length;i+=4)if(data[i]>50)count++;return count;}));assert.ok(pixels.every(n=>n>100),'every new troop portrait is drawn');
  await page.screenshot({path:'artifacts/v3-migration-army-verified.png'});await page.locator('[data-view="base"]').click();await page.screenshot({path:'artifacts/v2-base-verified.png'});
  await page.setViewportSize({width:390,height:844});await page.screenshot({path:'artifacts/v2-base-mobile-verified.png'});await page.locator('[data-view="army"]').click();await page.screenshot({path:'artifacts/v2-army-mobile-verified.png'});
  assert.deepEqual(errors,[]);console.log('PASS: legacy migration, illustrated atlases, six roster portraits, real command upgrade, new troop unlocks and training.');
}finally{await browser.close();}
