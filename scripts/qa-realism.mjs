import {createRequire} from 'node:module';
import {readFile,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url),{chromium}=require('C:/Users/odcon/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const base=process.argv[2]||'http://127.0.0.1:4183/',browser=await chromium.launch({headless:true,channel:'msedge'}),context=await browser.newContext({viewport:{width:1600,height:1000}}),p=await context.newPage(),errors=[];
p.on('pageerror',e=>errors.push(e.message));
const ready=async()=>{const loaded=await p.evaluate(async()=>await(await import('./realism-assets.js')).realismReady);assert.ok(loaded.every(Boolean),'All five original atlases must load');};
try{
 await p.goto(new URL('icon.svg',base).href);await p.evaluate(async raw=>await(await import('./world-storage.js')).persistWorld(raw),await readFile('artifacts/horizons-demo.json','utf8'));await p.goto(base);await ready();
 const roof=await p.locator('#game').evaluate(async canvas=>{
  const G=await import('./horizons.js'),{HorizonsRenderer}=await import('./horizons-render.js'),A=await import('./realism-assets.js'),{FRAMES}=await import('./realism-frames.js'),state=G.deserialize(await(await import('./world-storage.js')).loadWorld()),m=G.currentMap(state),box=canvas.getBoundingClientRect(),helper=document.createElement('canvas');helper.style.cssText=`position:fixed;width:${box.width}px;height:${box.height}px;opacity:0;pointer-events:none`;document.body.append(helper);const r=new HorizonsRenderer(helper);r.map=m;r.centerOn(4096.5,4096.5);
  const building=m.buildings.find(b=>b.type==='house'&&b.x===4089&&b.y===4093),size=G.STRUCTURES.house.size,pos=r.groundPoint(building.x+size/2,building.y+size/2),art=A.buildingSprite('house',Number(building.id.replace(/\D/g,''))),width=148*r.scale,height=width*art.inkHeight/art.inkWidth,point={x:pos.x,y:pos.y-height*.55};
  const hit=r.hitSettlement(point.x,point.y),ground=r.tileAt(point.x,point.y),outside=ground.x<building.x||ground.y<building.y||ground.x>=building.x+size||ground.y>=building.y+size;
  const metrics={frames:Object.keys(FRAMES).length,hit:hit?.id,expected:building.id,outside,transparentCorner:A.spriteContains(art,pos.x,pos.y,width,pos.x-width/2,pos.y-height)};helper.remove();return{...metrics,x:box.left+point.x,y:box.top+point.y};
 });
 assert.equal(roof.frames,48);assert.equal(roof.hit,roof.expected);assert.equal(roof.outside,true,'Roof click must extend beyond logical ground footprint');assert.equal(roof.transparentCorner,false);
 await p.mouse.click(roof.x,roof.y);await p.waitForTimeout(120);assert.equal(await p.locator('#sidebar h2').textContent(),'Vivienda');await p.screenshot({path:'artifacts/v5-roof-selection.png'});
 await p.setViewportSize({width:390,height:844});await p.waitForTimeout(200);await p.screenshot({path:'artifacts/v5-mobile-colony.png'});assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await p.evaluate(async()=>await navigator.serviceWorker.ready);await context.setOffline(true);await p.reload();await ready();assert.equal(await p.locator('#world-title').textContent(),'Aurora · Tierra natal');await context.setOffline(false);
 assert.deepEqual(errors,[]);console.log('PASS: detailed atlases, building roof selection, transparent corners, mobile layout and all five atlases offline.',roof);
}finally{await writeFile('artifacts/realism-browser-errors.json',JSON.stringify(errors));await browser.close();}
