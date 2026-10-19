import {tile,STRUCTURES,ROAD_GRADES} from './horizons.js';
import {material} from './realism-assets.js';

// World-anchored material coordinates keep neighboring cells visually continuous.
export class LandscapeRenderer {
 constructor(renderer){this.r=renderer;this.patterns=new Map();this.mask=document.createElement('canvas');this.memory=document.createElement('canvas');this.memoryKey='';}
 pattern(index,h=0){
  const r=this.r,source=material(index);if(!source)return null;let pattern=this.patterns.get(index);if(!pattern){pattern=r.ctx.createPattern(source,'repeat');this.patterns.set(index,pattern);}
  const t=52*r.scale*r.camera.zoom,origin=r.p(0,0,h*10);pattern.setTransform(new DOMMatrix([t/64,t/128,-t/64,t/128,origin.x,origin.y]));return pattern;
 }
 shape(x,y,h){const r=this.r,c=r.ctx,points=[r.p(x,y,h*10),r.p(x+1,y,h*10),r.p(x+1,y+1,h*10),r.p(x,y+1,h*10)],center=r.p(x+.5,y+.5,h*10);c.beginPath();points.forEach((p,i)=>{const d=Math.hypot(p.x-center.x,p.y-center.y)||1,xx=p.x+(p.x-center.x)/d*.35,yy=p.y+(p.y-center.y)/d*.35;i?c.lineTo(xx,yy):c.moveTo(xx,yy);});c.closePath();return points;}
 terrain(m,x,y,layer,seen){
  const r=this.r,c=r.ctx,tileData=tile(m,x,y,layer),h=layer?0:tileData.h,kind=tileData.kind,scale=r.scale*r.camera.zoom,p=r.p(x+.5,y+.5,h*10),t=52*scale;
  const biomeIndex=m.biome===1?2:m.biome===2?4:m.biome===4?5:0,index=layer?7:['water','bridge'].includes(kind)?6:['mountain','cliff'].includes(kind)?7:biomeIndex;
  this.shape(x,y,h);c.fillStyle=this.pattern(index,h)||(['water'].includes(kind)?'#2b687a':layer?'#6c6c5b':['mountain','cliff'].includes(kind)?'#96937c':'#747f48');c.fill();
  // Only actual changes in elevation have faces; flat cells have no cube walls.
  if(!layer&&h>0)for(const[dx,dy,edge]of[[0,1,2],[1,0,1]]){const xx=x+dx,yy=y+dy;if(xx>=m.size||yy>=m.size||!m.fog[yy*m.size+xx])continue;const next=tile(m,xx,yy);if(next.h>=h)continue;const from=edge===2?[r.p(x,y+1,h*10),r.p(x+1,y+1,h*10)]:[r.p(x+1,y,h*10),r.p(x+1,y+1,h*10)],to=edge===2?[r.p(x+1,y+1,next.h*10),r.p(x,y+1,next.h*10)]:[r.p(x+1,y+1,next.h*10),r.p(x+1,y,next.h*10)];r.poly([...from,...to],this.pattern(7,h)||'#777564');r.poly([...from,...to],edge===2?'#1d201b22':'#0d151b44');}
  if(layer){if(!seen){this.shape(x,y,0);c.fillStyle='#172323bb';c.fill();}else if(['air','support','stairs'].includes(tileData.material)){this.shape(x,y,0);c.fillStyle='#172729b8';c.fill();}else if(['iron','coal','gold','oil','crystal'].includes(tileData.material)){const color={iron:'#ad765b',coal:'#202932',gold:'#c6a35a',oil:'#28222a',crystal:'#79b9bd'}[tileData.material];r.line(r.p(x+.1,y+.25,3),r.p(x+.8,y+.8,3),color,4);}return;}
  if(kind==='forest'){const gradient=c.createRadialGradient(p.x,p.y,0,p.x,p.y,t*.65);gradient.addColorStop(0,'#302b1888');gradient.addColorStop(1,'#302b1800');c.fillStyle=gradient;c.fillRect(p.x-t*.7,p.y-t*.35,t*1.4,t*.7);}
  if(['path','rail','pipe'].includes(kind)){
   const roadWidth=ROAD_GRADES[m.roads?.[y*m.size+x]?.grade]?.width||.25;const connected=[];for(const[dx,dy]of[[1,0],[0,1],[-1,0],[0,-1]])if(['path','bridge','rail','pipe'].includes(tile(m,x+dx,y+dy)?.kind))connected.push(r.p(x+.5+dx*.52,y+.5+dy*.52,h*10+1));
   c.save();c.lineCap='round';c.lineJoin='round';c.beginPath();if(!connected.length){c.ellipse(p.x,p.y,t*.35,t*.17,0,0,Math.PI*2);c.fillStyle=this.pattern(3,h)||'#a3926b';c.fill();}else{for(const q of connected){c.moveTo(p.x,p.y);c.lineTo(q.x,q.y);}c.strokeStyle='#68583a40';c.lineWidth=t*(roadWidth+.07);c.stroke();c.strokeStyle=this.pattern(3,h)||'#a3926b';c.lineWidth=t*roadWidth;c.stroke();}c.restore();
   if(kind==='rail'){for(let a=0;a<4;a++)r.line(r.p(x+a*.25,y+.15,h*10+3),r.p(x+a*.25,y+.85,h*10+3),'#74654f',2.4);r.line(r.p(x,y+.25,h*10+5),r.p(x+1,y+.25,h*10+5),'#a7acaa',1.4);r.line(r.p(x,y+.75,h*10+5),r.p(x+1,y+.75,h*10+5),'#a7acaa',1.4);}else if(kind==='pipe'){r.line(r.p(x,y+.5,h*10+5),r.p(x+1,y+.5,h*10+5),'#3e5554',5);r.line(r.p(x,y+.45,h*10+7),r.p(x+1,y+.45,h*10+7),'#94aca1',1.5);}
  }
  if(kind==='water'){
   for(const[dx,dy,points]of[[0,-1,[[x,y],[x+1,y]]],[1,0,[[x+1,y],[x+1,y+1]]],[0,1,[[x,y+1],[x+1,y+1]]],[-1,0,[[x,y],[x,y+1]]]]){const xx=x+dx,yy=y+dy;if(xx<0||yy<0||xx>=m.size||yy>=m.size||!m.fog[yy*m.size+xx])continue;if(tile(m,xx,yy).kind==='water')continue;const a=r.p(...points[0],0),b=r.p(...points[1],0);r.line(a,b,'#c4bc9177',5);r.line(a,b,'#d6e0c24d',1.2);}
  }
 }
 paint(m,bounds,layer,undergroundSeen){
  const r=this.r,c=r.ctx;c.clearRect(0,0,r.w,r.h);this.mask.width=r.canvas.width;this.mask.height=r.canvas.height;const mask=this.mask.getContext('2d');mask.setTransform(r.dpr,0,0,r.dpr,0,0);mask.fillStyle='#fff';
  for(let sum=bounds.x0+bounds.y0;sum<=bounds.x1+bounds.y1;sum++)for(let x=bounds.x0;x<=bounds.x1;x++){const y=sum-x;if(y<bounds.y0||y>bounds.y1||!m.fog[y*m.size+x]||!r.onScreen(x,y,180))continue;this.terrain(m,x,y,layer,!layer||undergroundSeen(x,y));const h=layer?0:tile(m,x,y).h,points=[r.p(x,y,h*10),r.p(x+1,y,h*10),r.p(x+1,y+1,h*10),r.p(x,y+1,h*10)];mask.beginPath();points.forEach((p,i)=>i?mask.lineTo(p.x,p.y):mask.moveTo(p.x,p.y));mask.closePath();mask.fill();}
  if(!layer)for(const b of m.buildings){if(b.hp<=0||!r.onScreen(b.x,b.y,200)||!m.fog[b.y*m.size+b.x])continue;const size=STRUCTURES[b.type].size,p=r.groundPoint(b.x+size/2,b.y+size/2),radius=size*27*r.scale*r.camera.zoom;c.save();c.translate(p.x,p.y);c.scale(1,.46);const dirt=c.createRadialGradient(0,0,radius*.25,0,0,radius);dirt.addColorStop(0,'#aa946052');dirt.addColorStop(.65,'#a4926033');dirt.addColorStop(1,'#8c885600');c.fillStyle=dirt;c.fillRect(-radius,-radius,radius*2,radius*2);c.restore();}
  c.save();c.globalCompositeOperation='destination-in';c.filter='blur('+Math.max(4,8*r.scale*r.camera.zoom*r.dpr)+'px)';c.drawImage(this.mask,0,0,r.w,r.h);c.restore();c.save();c.globalCompositeOperation='destination-over';const fog=c.createRadialGradient(r.w*.5,r.h*.5,10,r.w*.5,r.h*.5,Math.max(r.w,r.h)*.7);fog.addColorStop(0,layer?'#182529':'#263831');fog.addColorStop(1,layer?'#111c21':'#152b2b');c.fillStyle=fog;c.fillRect(0,0,r.w,r.h);c.restore();
 }
 memoryFog(m,bounds){const r=this.r,key=[m.id,m.visionTick,r.camera.x,r.camera.y,r.camera.zoom,r.w,r.h].join('|');if(key!==this.memoryKey){this.memory.width=r.canvas.width;this.memory.height=r.canvas.height;const c=this.memory.getContext('2d');c.setTransform(r.dpr,0,0,r.dpr,0,0);c.fillStyle='#12232270';for(let y=bounds.y0;y<=bounds.y1;y++)for(let x=bounds.x0;x<=bounds.x1;x++){if(!m.fog[y*m.size+x]||m.sight?.[y*m.size+x]||!r.onScreen(x,y,160))continue;const h=tile(m,x,y).h,points=[r.p(x,y,h*10),r.p(x+1,y,h*10),r.p(x+1,y+1,h*10),r.p(x,y+1,h*10)];c.beginPath();points.forEach((p,i)=>i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y));c.closePath();c.fill();}this.memoryKey=key;}r.ctx.save();r.ctx.filter='blur('+4*r.dpr+'px)';r.ctx.drawImage(this.memory,0,0,r.w,r.h);r.ctx.restore();}
}
