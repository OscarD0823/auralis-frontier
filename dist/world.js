import { GRID, BUILDINGS, UNITS, canPlace, fieldUnits, visible, BIOMES, terrainRevision, fogRevision, inSight } from './engine.js';
import { artReady, getArt, paintArt } from './art.js';
export { artReady };
const hash = (x, y) => { const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return n - Math.floor(n); };
const clamp = (n, a, b) => Math.min(b, Math.max(a, n));
const shade = (hex, n) => { const v = parseInt(hex.slice(1), 16); return '#' + [v >> 16, (v >> 8) & 255, v & 255].map(c => clamp(Math.round(c * n), 0, 255).toString(16).padStart(2, '0')).join(''); };
function makeTree(seed) {
  const canvas = document.createElement('canvas'); canvas.width = 160; canvas.height = 200; const c = canvas.getContext('2d');
  c.fillStyle = '#26491938'; c.beginPath(); c.ellipse(83, 179, 46, 13, -.12, 0, Math.PI * 2); c.fill();
  c.fillStyle = '#775536'; c.beginPath(); c.moveTo(72, 177); c.quadraticCurveTo(80, 133, 67, 105); c.lineTo(93, 104); c.quadraticCurveTo(83, 145, 91, 179); c.lineTo(83, 174); c.lineTo(77, 181); c.closePath(); c.fill();
  c.strokeStyle = '#a47c48'; c.lineWidth = 4; c.beginPath(); c.moveTo(81, 166); c.lineTo(80, 124); c.lineTo(101, 109); c.moveTo(79, 137); c.lineTo(56, 116); c.stroke();
  const colors = seed === 1 ? ['#296346', '#4b9250', '#82b551'] : seed === 2 ? ['#39682f', '#69a43a', '#a5c74e'] : ['#2d6b37', '#519838', '#8abb45'];
  for (const [x, y, rx, ry] of [[48,106,37,34],[104,104,38,33],[77,72,43,37],[39,85,27,25],[110,77,29,27],[74,44,32,30],[72,111,42,28]]) {
    const g = c.createRadialGradient(x-12,y-15,2,x,y,rx); g.addColorStop(0,colors[2]);g.addColorStop(.57,colors[1]);g.addColorStop(1,colors[0]);
    c.fillStyle=g;c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fill();c.fillStyle='#dbed942d';c.beginPath();c.ellipse(x-10,y-12,rx*.5,ry*.18,-.25,0,Math.PI*2);c.fill();
  }
  if(seed===2)for(const [x,y]of [[50,100],[92,63],[114,109]]){c.fillStyle='#eac157';c.beginPath();c.arc(x,y,4,0,7);c.fill();}
  return canvas;
}
export class Renderer {
  constructor(canvas) {
    this.canvas=canvas;this.ctx=canvas.getContext('2d');this.camera={x:0,y:0,zoom:1};this.shots=[];this.hover=null;this.time=0;this.motion=new Map();
    this.treeImages=[0,1,2].map(makeTree);this.ground=document.createElement('canvas');this.groundKey='';this.resize();
  }
  resize(){const center=this.w&&this.h?this.unproject(this.w*.51,this.h*.49):null;const r=this.canvas.getBoundingClientRect();this.w=r.width;this.h=r.height;this.dpr=Math.min(devicePixelRatio||1,2);this.canvas.width=Math.round(this.w*this.dpr);this.canvas.height=Math.round(this.h*this.dpr);this.scale=Math.max(.6,Math.min(this.w/950,this.h/670))*1.1;this.groundKey='';if(center)this.centerOn(center.x,center.y);}
  p(x,y,z=0){const t=52*this.scale*this.camera.zoom;return{x:this.w*.51+(x-y)*t*.5+this.camera.x,y:this.h*.49+(x+y-17)*t*.25-z*this.scale*this.camera.zoom+this.camera.y};}
  centerOn(x,y){const p=this.p(x,y);this.camera.x+=this.w*.51-p.x;this.camera.y+=this.h*.49-p.y;this.groundKey='';}
  onScreen(x,y,pad=130){const p=this.p(x,y);return p.x>-pad&&p.x<this.w+pad&&p.y>-pad&&p.y<this.h+pad;}
  unproject(px,py){const t=52*this.scale*this.camera.zoom,dx=(px-this.w*.51-this.camera.x)/(t*.5),dy=(py-this.h*.49-this.camera.y)/(t*.25)+17;return{x:(dx+dy)/2,y:(dy-dx)/2};}
  getMap(state){return state.battle?.map||{size:state.battle?18:state.mapSize||GRID,terrain:state.battle?null:state.terrain,discovered:state.battle?null:state.explored};}
  bounds(size){const corners=[[-240,-240],[this.w+240,-240],[-240,this.h+240],[this.w+240,this.h+240]].map(([x,y])=>this.unproject(x,y));return{x0:Math.max(0,Math.floor(Math.min(...corners.map(p=>p.x)))-2),y0:Math.max(0,Math.floor(Math.min(...corners.map(p=>p.y)))-2),x1:Math.min(size-1,Math.ceil(Math.max(...corners.map(p=>p.x)))+2),y1:Math.min(size-1,Math.ceil(Math.max(...corners.map(p=>p.y)))+2)};}
  groundHeight(x,y){const m=this.activeMap;return(m?.terrain?.[Math.floor(y)*m.size+Math.floor(x)]?.h||0)*10;}
  groundPoint(x,y){return this.p(x,y,this.groundHeight(x,y));}
  tileAt(px,py,state){const map=this.getMap(state),raw=this.unproject(px,py),candidates=[],t=52*this.scale*this.camera.zoom;for(let x=Math.max(0,Math.floor(raw.x)-2);x<=Math.min(map.size-1,Math.ceil(raw.x)+13);x++)for(let y=Math.max(0,Math.floor(raw.y)-2);y<=Math.min(map.size-1,Math.ceil(raw.y)+13);y++){const z=(map.terrain?.[y*map.size+x]?.h||0)*10,p=this.p(x+.5,y+.5,z);if(Math.abs(px-p.x)/(t/2)+Math.abs(py-p.y)/(t/4)<=1)candidates.push({x,y});}return candidates.sort((a,b)=>(b.x+b.y)-(a.x+a.y))[0]||{x:-1,y:-1};}
  poly(points,fill,stroke,width=.7){const c=this.ctx;c.beginPath();points.forEach((p,i)=>i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y));c.closePath();if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=width;c.stroke();}}
  line(a,b,color,width=1){const c=this.ctx;c.beginPath();c.moveTo(a.x,a.y);c.lineTo(b.x,b.y);c.strokeStyle=color;c.lineWidth=width*this.scale*this.camera.zoom;c.stroke();}
  box(x,y,w,d,h,color,z=0){this.poly([this.p(x,y+d,z),this.p(x+w,y+d,z),this.p(x+w,y+d,z+h),this.p(x,y+d,z+h)],shade(color,.76));this.poly([this.p(x+w,y,z),this.p(x+w,y+d,z),this.p(x+w,y+d,z+h),this.p(x+w,y,z+h)],shade(color,.6));this.poly([this.p(x,y,z+h),this.p(x+w,y,z+h),this.p(x+w,y+d,z+h),this.p(x,y+d,z+h)],color);}
  circle(x,y,z,r,color){const p=this.p(x,y,z),c=this.ctx;c.fillStyle=color;c.beginPath();c.arc(p.x,p.y,r*this.scale*this.camera.zoom,0,7);c.fill();}
  glow(x,y,z,color,size=17){const p=this.p(x,y,z),c=this.ctx,r=size*this.scale*this.camera.zoom,g=c.createRadialGradient(p.x,p.y,0,p.x,p.y,r);g.addColorStop(0,color);g.addColorStop(1,'#00000000');c.fillStyle=g;c.fillRect(p.x-r,p.y-r,r*2,r*2);}
  tile(x,y,h,color){const z=h*10;this.poly([this.p(x,y+1,z),this.p(x+1,y+1,z),this.p(x+1,y+1,-15),this.p(x,y+1,-15)],'#a48756');this.poly([this.p(x+1,y,z),this.p(x+1,y+1,z),this.p(x+1,y+1,-15),this.p(x+1,y,-15)],'#8b764d');this.poly([this.p(x,y,z),this.p(x+1,y,z),this.p(x+1,y+1,z),this.p(x,y+1,z)],color);}
  label(text,x,y,{color='#fff4d4',bg='#263e2aed',size=10,border='#edcf7a88'}={}){const c=this.ctx,s=this.scale*this.camera.zoom;c.save();c.font=`700 ${size*s}px 'Segoe UI',sans-serif`;c.textAlign='center';const w=c.measureText(text).width+18*s;c.fillStyle=bg;c.strokeStyle=border;c.lineWidth=s;c.beginPath();c.roundRect(x-w/2,y-14*s,w,22*s,5*s);c.fill();c.stroke();c.fillStyle=color;c.fillText(text,x,y+s);c.restore();}
  tree(x,y,n,z=0){const p=this.p(x,y,z),s=this.scale*this.camera.zoom,h=(80+n*35)*s,w=h*.8;this.ctx.save();this.ctx.translate(p.x,p.y);this.ctx.rotate(Math.sin(this.time*.8+x)*.009);this.ctx.drawImage(this.treeImages[Math.floor(n*3)%3],-w/2,-h*.9,w,h);this.ctx.restore();}
  shadow(x,y,w=.7,d=.35,z=0){const p=this.p(x,y,z),s=this.scale*this.camera.zoom,c=this.ctx;c.fillStyle='#244a253f';c.beginPath();c.ellipse(p.x,p.y+2*s,w*24*s,d*18*s,0,0,7);c.fill();}
  building(b,selected=false,preview=false){
    const spec=BUILDINGS[b.type]||BUILDINGS.command,c=this.ctx,s=this.scale*this.camera.zoom,x=b.x+spec.size/2,y=b.y+spec.size/2,z=b.z||0,p=this.p(x,y,z),art=getArt(b.type);
    const width=(spec.size===1?b.type==='wall'?58:64:116)*s*(1+(b.level-1)*.014),height=art?width*art.rect[3]/art.rect[2]:70*s,bottom=p.y+spec.size*13*s;
    const foot=[this.p(b.x,b.y,z+1),this.p(b.x+spec.size,b.y,z+1),this.p(b.x+spec.size,b.y+spec.size,z+1),this.p(b.x,b.y+spec.size,z+1)];
    this.shadow(x,y,spec.size*.9,spec.size*.45,z);if(selected||preview)this.poly(foot,'#f9e79c2b','#ffe79d',2*s);
    c.save();if(b.hp===0)c.filter='grayscale(1) brightness(.55)';else if(b.enemy)c.filter='hue-rotate(-25deg) saturate(.85)';else if(b.level>1)c.filter=`saturate(${1+b.level*.05}) brightness(${1+b.level*.015})`;
    if(art)paintArt(c,art,p.x-width/2,bottom-height,width,height);else this.box(b.x+.1,b.y+.1,spec.size-.2,spec.size-.2,25,spec.color,z);c.restore();
    if(b.hp!==0&&['reactor','sanctum','refinery'].includes(b.type))this.glow(x,y,height/s*.66,b.type==='sanctum'?'#dca4ff45':b.type==='reactor'?'#89ffff45':'#ffd18533',16+Math.sin(this.time*2)*4);
    if(b.level>=2&&b.hp!==0){for(let i=0;i<Math.min(b.level-1,4);i++){const xx=b.x+.25+i*(spec.size-.5)/Math.max(1,b.level-2),yy=b.y+spec.size-.12;this.box(xx,yy,.09,.09,16+b.level*2,'#c79942',z);const a=this.p(xx,yy,z+18+b.level*2);c.fillStyle=b.level>=4?'#7b55b7':'#168c9b';c.beginPath();c.moveTo(a.x,a.y);c.lineTo(a.x+7*s,a.y+2*s);c.lineTo(a.x+6*s,a.y+12*s);c.lineTo(a.x,a.y+8*s);c.closePath();c.fill();}if(b.level>=4)this.glow(x,y,25,'#ffe8a633',40);}
    if(b.hp===0)this.label('REPARAR',p.x,p.y-height*.35,{size:8,color:'#ffcab0',bg:'#493b31ed',border:'#e6a27b77'});
    else if(b.readyAt>Date.now()){for(const[xx,yy]of[[b.x,b.y+spec.size],[b.x+spec.size,b.y+spec.size]])this.box(xx,yy,.07,.07,48,'#9c713d',z);const q=this.p(x,y,height/s-6);this.label('EN OBRAS · '+Math.ceil((b.readyAt-Date.now())/1000)+' s',q.x,q.y,{size:8,color:'#ffe6a2'});}
    if(selected&&!preview)this.label(spec.name+' · NIV. '+b.level,p.x,bottom-height-8*s);
    else if(!preview&&!b.enemy&&b.level>1)this.label(['','I','II','III','IV','V'][b.level]||'V',p.x+width*.28,bottom-5*s,{size:7,bg:'#805b2beb'});
    if(b.hp>0&&b.hp<spec.hp*b.level)this.health(x,y,height/s-8,b.hp/(spec.hp*b.level),false);
  }
  hitBuilding(b,px,py,terrain){const spec=BUILDINGS[b.type],s=this.scale*this.camera.zoom,p=this.p(b.x+spec.size/2,b.y+spec.size/2,(terrain[b.y*GRID+b.x]?.h||0)*10),art=getArt(b.type),w=(spec.size===1?64:116)*s,h=art?w*art.rect[3]/art.rect[2]:80*s,bottom=p.y+spec.size*13*s;return Math.abs(px-p.x)<w*.43&&py>bottom-h*.94&&py<bottom;}
  unit(u,enemy=false,z=0){
    z+=this.groundHeight(u.x,u.y);const c=this.ctx,s=this.scale*this.camera.zoom,key=(enemy?'e:':'a:')+(u.id||u.type+':'+u.x.toFixed(1)),old=this.motion.get(key),delta=old?Math.hypot(u.x-old.x,u.y-old.y):0,moving=u.walking||delta>.002,facing=delta>.002?(u.x-old.x)-(u.y-old.y)>0:old?.facing||false;
    this.motion.set(key,{x:u.x,y:u.y,facing});const frame=(u.cooldown||0)>.5&&!moving?3:moving?1+Math.floor(this.time*7)%2:0,art=getArt(u.type,frame,true),flying=UNITS[u.type]?.flying,mult={ranger:1,bulwark:1.35,wasp:1.1,arcanist:1.1,golem:1.5,drake:1.65,jeep:1.35,missile:1.6,helicopter:1.7,cavalry:1.35,gunboat:1.8,transport:1.9}[u.type]||1;
    this.shadow(u.x,u.y,mult*.6,.22,z);const hover=flying?13+Math.sin(this.time*4+u.x)*3:moving?Math.abs(Math.sin(this.time*7))*1.2:Math.sin(this.time*2+u.y)*.45,p=this.p(u.x,u.y,z+hover),width=52*mult*s,height=art?width*art.rect[3]/art.rect[2]:38*s;
    c.save();if(enemy)c.filter='hue-rotate(155deg) saturate(.82)';if(art)paintArt(c,art,p.x-width/2,p.y-height*.96,width,height,facing);else{this.box(u.x-.14,u.y-.14,.28,.28,16,enemy?'#c87b53':UNITS[u.type]?.color||'#99bc76',z);this.circle(u.x,u.y,z+23,5,'#cdae84');}c.restore();
    if(u.hp<u.maxHp)this.health(u.x,u.y,z+height/s*.95+hover,u.hp/u.maxHp,enemy);
  }
  health(x,y,z,ratio,enemy){const p=this.p(x,y,z),c=this.ctx,s=this.scale*this.camera.zoom;c.fillStyle='#263225df';c.beginPath();c.roundRect(p.x-20*s,p.y,40*s,5*s,2*s);c.fill();c.fillStyle=enemy?'#f07461':'#b3e66d';c.fillRect(p.x-18*s,p.y+s,36*s*clamp(ratio,0,1),3*s);}
  mountain(x,y,h,biome){const z=h*10,base=[this.p(x+.05,y+.85,z),this.p(x+.95,y+.9,z),this.p(x+.8,y+.05,z)],top=this.p(x+.48,y+.46,z+18+h*3),colors=biome===4?['#55575a','#777874','#9b9280']:['#7a8586','#9daba5','#bec5b6'];this.poly([base[0],base[1],top],colors[0]);this.poly([base[1],base[2],top],colors[1]);this.poly([base[2],base[0],top],colors[2]);if(h>=9||biome===2){const near=base.map(p=>({x:top.x+(p.x-top.x)*.32,y:top.y+(p.y-top.y)*.32}));this.poly([top,near[0],near[1]],'#dae8e6');this.poly([top,near[1],near[2]],'#f5faf0');}}
  paintGround(state,editing){
    const c=this.ctx,battle=state.battle,map=this.getMap(state),terrain=map.terrain,size=map.size,bounds=this.bounds(size),g=c.createLinearGradient(0,0,0,this.h);g.addColorStop(0,map.discovered?'#314b50':battle?'#719888':'#69b2b4');g.addColorStop(1,map.discovered?'#1c353e':'#328e9e');c.fillStyle=g;c.fillRect(0,0,this.w,this.h);
    for(let sum=bounds.x0+bounds.y0;sum<=bounds.x1+bounds.y1;sum++)for(let x=bounds.x0;x<=bounds.x1;x++){const y=sum-x;if(y<bounds.y0||y>bounds.y1||!this.onScreen(x,y,210))continue;if(map.discovered&&!map.discovered[y*size+x])continue;const n=hash(x,y),t=terrain?.[y*size+x]||{h:0,kind:'grass'},road=['path','bridge'].includes(t.kind)||(!battle&&((y===9&&x>2&&x<14)||(x===9&&y>2&&y<14))),water=t.kind==='water',biome=battle?.map?.biome||0;
      const base=battle?.map?BIOMES[biome].color:'#8fc552',color=water?'#4f9fb1':t.kind==='bridge'?'#b29b6a':road?'#b9ac80':t.kind==='mountain'?'#8b9990':t.kind==='cliff'?'#a69e7b':t.kind==='marsh'?'#688e6e':shade(base,1-Math.min(t.h,12)*.016+n*.02);this.tile(x,y,t.h,color);
      if(editing)this.poly([this.p(x,y,t.h*10+1),this.p(x+1,y,t.h*10+1),this.p(x+1,y+1,t.h*10+1),this.p(x,y+1,t.h*10+1)],null,'#e8f6bd42');
      if(water){this.line(this.p(x+.13,y+.43,t.h*10+1),this.p(x+.73,y+.43,t.h*10+1),'#c9efff55',1);if(n>.75)this.line(this.p(x+.4,y+.7,t.h*10+1),this.p(x+.8,y+.7,t.h*10+1),'#b5e7f433',1);}
      if(t.kind==='bridge'){for(let k=0;k<4;k++)this.line(this.p(x+k*.25,y,3),this.p(x+k*.25,y+1,3),'#dfc791',1);this.line(this.p(x,y,7),this.p(x+1,y,7),'#69593d',2);this.line(this.p(x,y+1,7),this.p(x+1,y+1,7),'#69593d',2);}
      if(battle&&x>=1&&x<=5&&y>=2&&y<=15)this.poly([this.p(x,y,1),this.p(x+1,y,1),this.p(x+1,y+1,1),this.p(x,y+1,1)],'#4daed640','#b5edfa4a');
    }
  }
  draw(state,{selected,placement,terrainTool,moving,selectedUnits=[],selectionBox}={}){
    const c=this.ctx;c.setTransform(this.dpr,0,0,this.dpr,0,0);this.time=performance.now()/1000;const battle=state.battle,map=this.getMap(state),terrain=map.terrain,size=map.size,bounds=this.bounds(size),editing=!!(placement||terrainTool||moving),key=[this.w,this.h,this.camera.x,this.camera.y,this.camera.zoom,terrain?terrainRevision(terrain):'legacy',map.discovered?fogRevision(map.discovered):0,editing].join('|');
    this.activeMap=map;if(this.lastTerrain!==terrain){this.lastTerrain=terrain;this.groundKey='';}this.lastTileCount=(bounds.x1-bounds.x0+1)*(bounds.y1-bounds.y0+1);
    if(key!==this.groundKey){this.ground.width=this.canvas.width;this.ground.height=this.canvas.height;const gc=this.ground.getContext('2d');gc.setTransform(this.dpr,0,0,this.dpr,0,0);this.ctx=gc;this.paintGround(state,editing);this.ctx=c;this.groundKey=key;}
    c.clearRect(0,0,this.w,this.h);c.drawImage(this.ground,0,0,this.w,this.h);const objects=[];
    for(let x=bounds.x0;x<=bounds.x1;x++)for(let y=bounds.y0;y<=bounds.y1;y++){if(!this.onScreen(x,y,210)||map.discovered&&!map.discovered[y*size+x])continue;const t=terrain?.[y*size+x],n=hash(x+20,y);if(t?.kind==='mountain')objects.push({depth:x+y,draw:()=>this.mountain(x,y,t.h,map.biome||0)});else if(t?.kind==='cliff'&&n>.6)objects.push({depth:x+y,draw:()=>this.box(x+.12,y+.2,.7,.65,7,'#989882',t.h*10)});else if((t?.kind==='forest'&&n>.3)||(!terrain&&(x<2||y<2||x>15||y>15)&&n>.6))objects.push({depth:x+y,draw:()=>this.tree(x+.5,y+.5,n,(t?.h||0)*10)});else if(n>.94&&(x<2||y<2||x>15||y>15))objects.push({depth:x+y,draw:()=>{this.box(x+.15,y+.2,.45,.4,7,'#adb28b',(t?.h||0)*10);this.box(x+.4,y+.5,.25,.3,4,'#d1c99d',(t?.h||0)*10);}});}
    if(battle){
      for(const e of battle.enemies)if(visible(battle,e)&&this.onScreen(e.x,e.y))objects.push({depth:e.x+e.y,draw:()=>{if(UNITS[e.type]){this.unit(e,true);return;}if(e.hp<=0){for(let i=0;i<4;i++)this.box(e.x-.5+(i%2)*.6,e.y-.3+Math.floor(i/2)*.5,.5,.4,5+i*3,i%2?'#ae9e78':'#7d8064');return;}const type=e.type==='core'?'command':e.type==='turret'&&battle.mission===2?'sanctum':e.type,size=BUILDINGS[type].size;this.building({type,x:e.x-size/2,y:e.y-size/2,level:battle.mission+1,enemy:true,z:this.groundHeight(e.x,e.y)});this.health(e.x,e.y,this.groundHeight(e.x,e.y)+100,e.hp/e.maxHp,true);}});
      for(const u of battle.units)if(u.hp>0&&!u.embarked&&this.onScreen(u.x,u.y))objects.push({depth:u.x+u.y+.1,draw:()=>this.unit(u)});
    }else{
      for(const b of state.buildings)if(this.onScreen(b.x,b.y,220))objects.push({depth:b.x+b.y+BUILDINGS[b.type].size,draw:()=>this.building({...b,z:(terrain?.[b.y*GRID+b.x]?.h||0)*10},b.id===selected)});
      for(const u of state.garrison||[])if(u.hp>0&&!u.embarked&&this.onScreen(u.x,u.y))objects.push({depth:u.x+u.y,draw:()=>this.unit(u)});
      if(state.offers.length){const x=3.2,y=9.4;objects.push({depth:x+y+.15,draw:()=>{this.unit({id:'visitor',type:state.offers[0].kind===1?'arcanist':'ranger',x,y,hp:1,maxHp:1});this.box(x-.35,y+.45,.7,.85,12,'#b68a4f');this.box(x-.3,y+.5,.6,.75,3,'#6c9e8a',12);const p=this.p(x,y,62);this.label('!  ENCARGO',p.x,p.y+Math.sin(this.time*2)*2,{size:8,color:'#ffe3a3'});}});}
      if(state.raid)for(const u of state.raid.units)if(u.hp>0)objects.push({depth:u.x+u.y,draw:()=>this.unit(u,true)});
    }
    objects.sort((a,b)=>a.depth-b.depth).forEach(o=>o.draw());
    if(this.hover&&!battle&&editing){const{x,y}=this.hover;if(x>=1&&y>=1&&x<GRID-1&&y<GRID-1){const type=placement||state.buildings.find(b=>b.id===moving)?.type,size=type?BUILDINGS[type].size:1,z=(terrain[y*GRID+x]?.h||0)*10+2,valid=terrainTool||moving||!type||canPlace(state,type,x,y);this.poly([this.p(x,y,z),this.p(x+size,y,z),this.p(x+size,y+size,z),this.p(x,y+size,z)],valid?'#e1ffb958':'#ef785e77',valid?'#f6ffca':'#ffb4a0',2);if(placement&&valid){c.globalAlpha=.7;this.building({type:placement,x,y,level:1,z},false,true);c.globalAlpha=1;}}}
    if(map.discovered){for(let y=bounds.y0;y<=bounds.y1;y++)for(let x=bounds.x0;x<=bounds.x1;x++){if(!this.onScreen(x,y,210))continue;const known=map.discovered[y*size+x],seen=known&&inSight(map,x,y),z=known?(terrain[y*size+x]?.h||0)*10+1:0;if(!known)this.poly([this.p(x,y,z),this.p(x+1,y,z),this.p(x+1,y+1,z),this.p(x,y+1,z)],'#1a303a');else if(!seen)this.poly([this.p(x,y,z),this.p(x+1,y,z),this.p(x+1,y+1,z),this.p(x,y+1,z)],'#132e3966');if(!known&&x%4===0&&y%4===0){const p=this.p(x+1,y+1,2),ss=this.scale*this.camera.zoom,r=90*ss,g=c.createRadialGradient(p.x,p.y,0,p.x,p.y,r);g.addColorStop(0,'#8daeb51c');g.addColorStop(1,'#607e8800');c.fillStyle=g;c.beginPath();c.ellipse(p.x+Math.sin(this.time*.12+x)*6,p.y,r,r*.5,0,0,7);c.fill();}}}
    if(battle?.map){for(const d of map.deposits)if(d.amount>0&&map.discovered[Math.floor(d.y)*size+Math.floor(d.x)]&&this.onScreen(d.x,d.y))this.box(d.x-.3,d.y-.3,.6,.6,12,BIOMES[map.biome].resource==='alloy'?'#b8c2d1':'#8be4ed',this.groundHeight(d.x,d.y));if(battle.disaster){const d=battle.disaster,p=this.groundPoint(d.x,d.y),ss=this.scale*this.camera.zoom;c.strokeStyle='#ff9c67';c.fillStyle='#ff8a4333';c.beginPath();c.ellipse(p.x,p.y,d.radius*26*ss,d.radius*13*ss,0,0,7);c.fill();c.stroke();this.label(d.name+' · '+(battle.elapsed<d.starts?'EVACÚA '+Math.ceil(d.starts-battle.elapsed)+'s':'PELIGRO'),p.x,p.y-35*ss,{color:'#ffd0a3'});}}
    for(const u of fieldUnits(state))if(selectedUnits.includes(u.id)&&u.hp>0&&!u.embarked){const p=this.groundPoint(u.x,u.y),ss=this.scale*this.camera.zoom;c.strokeStyle='#d6ff8d';c.lineWidth=2;c.beginPath();c.ellipse(p.x,p.y+3,20*ss,9*ss,0,0,7);c.stroke();if(u.order?.x!==undefined){const q=this.groundPoint(u.order.x,u.order.y);c.setLineDash([5,5]);this.line(p,q,'#e8f7b377');c.setLineDash([]);this.circle(u.order.x,u.order.y,3,3,'#eaffb1');}}
    if(selectionBox){c.fillStyle='#b6edab26';c.strokeStyle='#d4ffb9';c.lineWidth=1;c.fillRect(selectionBox.x,selectionBox.y,selectionBox.w,selectionBox.h);c.strokeRect(selectionBox.x,selectionBox.y,selectionBox.w,selectionBox.h);}
    const now=performance.now();this.shots=this.shots.filter(v=>now-v.at<360);for(const shot of this.shots){const progress=(now-shot.at)/360,a=this.p(shot.x,shot.y,28+this.groundHeight(shot.x,shot.y)),b=this.p(shot.tx,shot.ty,25+this.groundHeight(shot.tx,shot.ty)),color=shot.enemy?'#ff9873':shot.kind==='arcanist'?'#c3a0ff':shot.kind==='drake'?'#ffb24f':'#fff1a7';c.globalAlpha=1-progress;this.line(a,b,color,['arcanist','drake','bulwark','missile','gunboat'].includes(shot.kind)?3:1.5);const px=a.x+(b.x-a.x)*progress,py=a.y+(b.y-a.y)*progress-Math.sin(progress*Math.PI)*12;c.fillStyle=color;c.shadowColor=color;c.shadowBlur=8;c.beginPath();c.arc(px,py,(shot.kind==='drake'?5:3)*this.scale,0,7);c.fill();c.shadowBlur=0;c.globalAlpha=1;}
    if(battle&&!battle.units.length){const p=this.p(3.3,8,1);this.label('TOCA PARA DESPLEGAR',p.x,p.y,{size:9,bg:'#286680dd',border:'#b8e6ee'});}if(this.motion.size>160)this.motion.clear();
  }
  addShots(shots){const at=performance.now();this.shots.push(...shots.map(s=>({...s,at})));}
}
export function thumbnail(canvas,type,unit=false){
  const c=canvas.getContext('2d');canvas.width=320;canvas.height=220;c.setTransform(2,0,0,2,0,0);const art=getArt(type,0,unit);if(!art)return;
  const maxW=unit?128:144,maxH=unit?110:108,ratio=art.rect[2]/art.rect[3],h=Math.min(maxH,maxW/ratio),w=h*ratio;paintArt(c,art,(160-w)/2,110-h,w,h);
}
