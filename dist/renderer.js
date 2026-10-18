import {GRID,BUILDINGS,UNITS,canPlace} from './engine.js';
const hash=(x,y)=>{const n=Math.sin(x*127.1+y*311.7)*43758.5453;return n-Math.floor(n);};
function shade(hex,n){const v=parseInt(hex.slice(1),16);return '#'+[v>>16,(v>>8)&255,v&255].map(c=>Math.max(0,Math.min(255,Math.round(c*n))).toString(16).padStart(2,'0')).join('');}
export class Renderer{
  constructor(canvas){this.canvas=canvas;this.ctx=canvas.getContext('2d');this.camera={x:0,y:0,zoom:1};this.shots=[];this.hover=null;this.time=0;this.resize();}
  resize(){const r=this.canvas.getBoundingClientRect();this.w=r.width;this.h=r.height;this.dpr=Math.min(devicePixelRatio||1,2);this.canvas.width=Math.round(this.w*this.dpr);this.canvas.height=Math.round(this.h*this.dpr);this.scale=Math.max(.6,Math.min(this.w/950,this.h/670))*1.1;}
  p(x,y,z=0){const t=52*this.scale*this.camera.zoom;return {x:this.w*.51+(x-y)*t*.5+this.camera.x,y:this.h*.49+(x+y-17)*t*.25-z*this.scale*this.camera.zoom+this.camera.y};}
  unproject(px,py){const t=52*this.scale*this.camera.zoom,dx=(px-this.w*.51-this.camera.x)/(t*.5),dy=(py-this.h*.49-this.camera.y)/(t*.25)+17;return {x:(dx+dy)/2,y:(dy-dx)/2};}
  tileAt(px,py,s){const candidates=[];for(let x=0;x<GRID;x++)for(let y=0;y<GRID;y++){const z=s.battle?0:(s.terrain[y*GRID+x]?.h||0)*10,p=this.p(x+.5,y+.5,z),t=52*this.scale*this.camera.zoom;if(Math.abs(px-p.x)/(t/2)+Math.abs(py-p.y)/(t/4)<=1)candidates.push({x,y});}return candidates.sort((a,b)=>(b.x+b.y)-(a.x+a.y))[0]||{x:-1,y:-1};}
  poly(points,fill,stroke){const c=this.ctx;c.beginPath();points.forEach((p,i)=>i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y));c.closePath();if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=.7;c.stroke();}}
  line(a,b,color,width=1){const c=this.ctx;c.beginPath();c.moveTo(a.x,a.y);c.lineTo(b.x,b.y);c.strokeStyle=color;c.lineWidth=width*this.scale*this.camera.zoom;c.stroke();}
  box(x,y,w,d,h,color,z=0){const a=this.p(x,y,z),b=this.p(x+w,y,z),cc=this.p(x+w,y+d,z),e=this.p(x,y+d,z),at=this.p(x,y,z+h),bt=this.p(x+w,y,z+h),ct=this.p(x+w,y+d,z+h),et=this.p(x,y+d,z+h);this.poly([e,cc,ct,et],shade(color,.68));this.poly([b,cc,ct,bt],shade(color,.48));this.poly([at,bt,ct,et],color,shade(color,1.12));}
  circle(x,y,z,r,color){const p=this.p(x,y,z),c=this.ctx;c.beginPath();c.arc(p.x,p.y,r*this.scale*this.camera.zoom,0,Math.PI*2);c.fillStyle=color;c.fill();}
  glow(x,y,z,color,size=17){const p=this.p(x,y,z),c=this.ctx,r=size*this.scale*this.camera.zoom,g=c.createRadialGradient(p.x,p.y,0,p.x,p.y,r);g.addColorStop(0,color);g.addColorStop(1,'#00000000');c.fillStyle=g;c.fillRect(p.x-r,p.y-r,r*2,r*2);}
  tile(x,y,h,color){const z=h*10,a=this.p(x,y,z),b=this.p(x+1,y,z),d=this.p(x+1,y+1,z),e=this.p(x,y+1,z);this.poly([e,d,this.p(x+1,y+1,-15),this.p(x,y+1,-15)],'#4b5541');this.poly([b,d,this.p(x+1,y+1,-15),this.p(x+1,y,-15)],'#3f4e3b');this.poly([a,b,d,e],color,'#d7e8a909');}
  tree(x,y,n,z=0){const p=this.p(x,y,z),c=this.ctx,s=this.scale*this.camera.zoom;this.shadow(x,y,.5,.5,z);this.box(x-.035,y-.035,.07,.07,16,'#6d6045',z);for(let i=0;i<3;i++){const ht=(22+i*10)*s,w=(18-i*3)*s;c.beginPath();c.moveTo(p.x,p.y-ht-13*s);c.lineTo(p.x+w,p.y-ht+10*s);c.lineTo(p.x,p.y-ht+15*s);c.lineTo(p.x-w,p.y-ht+10*s);c.closePath();c.fillStyle=['#3c583a','#486640','#5a774a'][i];c.fill();c.beginPath();c.moveTo(p.x,p.y-ht-13*s);c.lineTo(p.x+w,p.y-ht+10*s);c.lineTo(p.x,p.y-ht+15*s);c.closePath();c.fillStyle='#0e352020';c.fill();}}
  shadow(x,y,w,d,z=0){this.poly([this.p(x-.1,y+.1,z),this.p(x+w+.35,y+.1,z),this.p(x+w+.7,y+d+.5,z),this.p(x+.15,y+d+.5,z)],'#14271d2e');}
  building(b,selected=false,preview=false){const spec=BUILDINGS[b.type]||BUILDINGS.command,c=this.ctx,x=b.x+.14,y=b.y+.14,z=b.z||0,w=spec.size-.28;
    this.shadow(x,y,w,w,z);this.box(x-.08,y-.08,w+.16,w+.16,3,'#9caa84',z);const zz=z+3;
    if(b.type==='command'){
      this.box(x,y,w,w,19,'#7a8970',zz);this.box(x+.2,y+.17,w-.4,w-.3,17,'#a3b48e',zz+19);this.box(x+.32,y+.28,w-.64,.53,5,'#4e7273',zz+36);this.box(x+.43,y+.42,w-.86,.27,3,'#92d3c7',zz+41);
      this.box(x+.5,y+1.22,.7,.22,12,'#31494a',zz);for(let i=0;i<3;i++)this.box(x+.19+i*.48,y+1.5,.31,.04,6,'#8ac7bb',zz+10);
      this.line(this.p(x+1.43,y+.37,zz+35),this.p(x+1.43,y+.37,zz+67),'#293c37',2);this.poly([this.p(x+1.43,y+.37,zz+65),this.p(x+1.92,y+.37,zz+60),this.p(x+1.43,y+.37,zz+54)],'#bfd69a');
      this.glow(x+.9,y+.65,zz+45,'#9affe33a',23);
    }else if(b.type==='mine'){
      this.box(x,y,w,w,12,'#8c8765',zz);this.box(x+.2,y+.2,.68,.73,25,'#adac83',zz+12);this.box(x+.85,y+.25,.66,1.15,9,'#696e57',zz+12);this.box(x+.37,y+.37,.26,.3,15,'#d8ae6a',zz+37);
      for(let i=0;i<4;i++){const a=this.p(x+.9+i*.16,y+1.37,zz+24),b=this.p(x+1.03+i*.16,y+.44,zz+24);this.line(a,b,'#3c4e44',2);}
      this.line(this.p(x+.49,y+.49,zz+55),this.p(x+1.4,y+.49,zz+55),'#d4b780',4);this.line(this.p(x+1.4,y+.49,zz+55),this.p(x+1.4,y+.49,zz+23),'#5e6555',2);
    }else if(b.type==='reactor'){
      this.box(x,y,w,w,8,'#72958a',zz);for(let i=0;i<3;i++)for(let j=0;j<2;j++){this.box(x+.12+i*.52,y+.15+j*.74,.44,.62,3,'#4e7187',zz+8);this.line(this.p(x+.15+i*.52,y+.35+j*.74,zz+12),this.p(x+.5+i*.52,y+.35+j*.74,zz+12),'#a0d7e5',.7);}
      this.box(x+.65,y+.6,.42,.42,22,'#87b6bf',zz+8);this.circle(x+.86,y+.81,zz+37,6,'#b2edf1');this.glow(x+.86,y+.81,zz+37,'#a0f7ff66',23);
    }else if(b.type==='barracks'){
      this.box(x,y,w,w,18,'#718166',zz);this.box(x+.12,y+.12,w-.24,w-.24,8,'#8a9d73',zz+18);this.box(x+.25,y+1.2,1.15,.36,15,'#384f43',zz);for(let i=0;i<3;i++)this.box(x+.24+i*.45,y+.24,.3,.56,2,'#a2b98a',zz+26);
      this.box(x+1.13,y+.9,.4,.4,3,'#b9bd8b',zz+26);this.line(this.p(x+.4,y+.8,zz+29),this.p(x+.8,y+.8,zz+29),'#d7deb9',3);this.line(this.p(x+.6,y+.6,zz+29),this.p(x+.6,y+1,zz+29),'#d7deb9',3);
    }else if(b.type==='refinery'){
      this.box(x,y,w,w,15,'#9d8b6c',zz);this.box(x+.15,y+.18,.7,.65,25,'#b6a587',zz+15);this.box(x+.25,y+.3,.25,.3,22,'#6f7867',zz+40);this.box(x+1.03,y+.9,.4,.5,15,'#c1a679',zz+15);this.box(x+.12,y+1.2,.65,.3,10,'#656d58',zz+15);
      this.circle(x+.38,y+.45,zz+65,5,'#bbc6ac33');this.circle(x+.4+Math.sin(this.time)*.12,y+.45,zz+76+(this.time%3)*4,7,'#c8cdb32c');
    }else if(b.type==='turret'){
      this.box(x,y,w,w,12,'#89927b',zz);this.box(x+.13,y+.13,.46,.46,24,'#7c8d75',zz+12);this.box(x+.03,y+.03,.65,.65,11,'#b7bea1',zz+36);this.box(x+.22,y-.35,.19,.63,5,'#3e544c',zz+43);this.circle(x+.38,y+.38,zz+49,3,'#d5a185');
    }else if(b.type==='sanctum'){
      this.box(x+.1,y+.1,w-.2,w-.2,9,'#6d7878',zz);const cx=x+w/2,cy=y+w/2,lo=this.p(cx,cy,zz+14),hi=this.p(cx,cy,zz+69),l=this.p(cx-.4,cy,zz+38),r=this.p(cx+.4,cy,zz+38),f=this.p(cx,cy+.4,zz+38);
      this.poly([hi,l,f,lo],'#9c81d5');this.poly([hi,r,f,lo],'#c3b0f2');this.glow(cx,cy,zz+43,'#cdb4ff66',35);for(let i=0;i<4;i++)this.box(x+.12+(i%2)*1.17,y+.12+Math.floor(i/2)*1.17,.22,.22,20,'#9ea293',zz);
    }else if(b.type==='wall'){this.box(x,y,w,w,25,'#8a9582',zz);this.box(x-.03,y-.03,w+.06,w+.06,5,'#afb49a',zz+25);this.box(x+.15,y+.15,.2,.2,4,'#c6c7ac',zz+30);}
    if(b.hp===0){this.poly([this.p(x,y,zz+5),this.p(x+w,y,zz+5),this.p(x+w,y+w,zz+5),this.p(x,y+w,zz+5)],'#2f201bb0');const p=this.p(x+w/2,y+w/2,zz+42);c.fillStyle='#e9ab8e';c.font=`bold ${18*this.scale*this.camera.zoom}px sans-serif`;c.textAlign='center';c.fillText('⚒',p.x,p.y);}
    if(b.readyAt>Date.now()){const p=this.p(x+w/2,y+w/2,zz+65),t=this.scale*this.camera.zoom;c.fillStyle='#152820dd';c.fillRect(p.x-27*t,p.y-11*t,54*t,17*t);c.font=`${9*t}px sans-serif`;c.fillStyle='#d2dfb5';c.textAlign='center';c.fillText(Math.ceil((b.readyAt-Date.now())/1000)+' s',p.x,p.y+1*t);}
    if(selected||preview){this.poly([this.p(b.x,b.y,z+1),this.p(b.x+spec.size,b.y,z+1),this.p(b.x+spec.size,b.y+spec.size,z+1),this.p(b.x,b.y+spec.size,z+1)],null,'#d6edba');}
    if(selected&&!preview){const p=this.p(x+w/2,y+w/2,zz+80),t=this.scale*this.camera.zoom;c.textAlign='center';c.font=`600 ${10*t}px sans-serif`;const label=spec.name+' · NIV. '+b.level,ww=c.measureText(label).width+22*t;c.fillStyle='#16291feb';c.fillRect(p.x-ww/2,p.y-14*t,ww,22*t);c.fillStyle='#d8e8c7';c.fillText(label,p.x,p.y);}
    if(b.hp>0&&b.hp<spec.hp*b.level)this.health(x+w/2,y+w/2,zz+57,b.hp/(spec.hp*b.level),false);
  }
  unit(u,enemy=false,z=0){const c=this.ctx,s=this.scale*this.camera.zoom,col=enemy?'#d98e6e':UNITS[u.type]?.color||'#b7d29b',x=u.x,y=u.y;
    this.shadow(x-.15,y-.15,.3,.3,z);
    if(u.type==='bulwark'){
      this.box(x-.37,y-.38,.74,.76,7,'#344a40',z);this.box(x-.3,y-.32,.6,.64,10,col,z+6);this.box(x-.15,y-.15,.3,.3,7,shade(col,1.1),z+16);this.box(x-.05,y-.7,.1,.65,4,'#465747',z+21);
    }else if(u.type==='wasp'){
      z+=24+Math.sin(this.time*4+u.x)*3;this.box(x-.2,y-.2,.4,.4,4,col,z);this.line(this.p(x-.55,y-.55,z+4),this.p(x+.55,y+.55,z+4),shade(col,.7),2);this.line(this.p(x+.55,y-.55,z+4),this.p(x-.55,y+.55,z+4),shade(col,.7),2);for(const [a,b]of [[-.5,-.5],[.5,.5],[.5,-.5],[-.5,.5]]){const p=this.p(x+a,y+b,z+5);c.strokeStyle='#cde4d566';c.lineWidth=1;c.beginPath();c.ellipse(p.x,p.y,10*s,4*s,0,0,Math.PI*2);c.stroke();}this.glow(x,y,z+2,'#d8b9ff55',15);
    }else{
      const step=Math.sin(this.time*7+u.y*3)*.04;this.box(x-.1,y-.08,.08,.08,8,'#253d35',z);this.box(x+.04,y+step,.08,.08,8,'#253d35',z);this.box(x-.13,y-.13,.26,.26,10,col,z+7);this.circle(x,y,z+23,4.2,'#d0b995');this.circle(x,y,z+26,4.5,shade(col,.7));this.line(this.p(x+.13,y-.05,z+14),this.p(x+.13,y-.4,z+14),'#263e38',2);
    }
    if(u.hp<u.maxHp)this.health(x,y,z+38,u.hp/u.maxHp,enemy);
  }
  health(x,y,z,ratio,enemy){const p=this.p(x,y,z),c=this.ctx,s=this.scale*this.camera.zoom;c.fillStyle='#14251be0';c.fillRect(p.x-15*s,p.y,30*s,3*s);c.fillStyle=enemy?'#dc9377':'#c8dea4';c.fillRect(p.x-15*s,p.y,30*s*Math.max(0,ratio),3*s);}
  draw(s,{selected,placement,terrainTool,moving,deployType}={}){
    const c=this.ctx;c.setTransform(this.dpr,0,0,this.dpr,0,0);c.clearRect(0,0,this.w,this.h);this.time=performance.now()/1000;const battle=s.battle,terrain=battle?null:s.terrain;
    for(let sum=0;sum<GRID*2;sum++)for(let x=0;x<GRID;x++){const y=sum-x;if(y<0||y>=GRID||Math.abs(x-8.5)+Math.abs(y-8.5)>15)continue;const n=hash(x,y),t=terrain?.[y*GRID+x]||{h:0,kind:'grass'},road=t.kind==='path'||(!battle&&((y===9&&x>2&&x<14)||(x===9&&y>2&&y<14))),water=t.kind==='water';
      let col=battle?['#9a926c','#a59a71','#a99f79','#938c67'][Math.floor(n*4)]:['#78875c','#7c8d62','#839369','#728358','#87976b'][Math.floor(n*5)];if(road)col='#a5a27c';if(water)col='#5b9397';this.tile(x,y,t.h,col);
      if(water){this.line(this.p(x+.2,y+.4,t.h*10+1),this.p(x+.55,y+.4,t.h*10+1),'#a9d5ce44',1);}else if(n>.8&&!road){this.circle(x+.35,y+.35,t.h*10+1,1,'#c1c79570');}
      if(battle&&x>=1&&x<=5&&y>=2&&y<=15)this.poly([this.p(x,y,1),this.p(x+1,y,1),this.p(x+1,y+1,1),this.p(x,y+1,1)],'#5eaac94d','#a3def26b');
    }
    const objects=[];
    for(let x=0;x<GRID;x++)for(let y=0;y<GRID;y++){if(Math.abs(x-8.5)+Math.abs(y-8.5)>14)continue;const t=terrain?.[y*GRID+x],n=hash(x+20,y);if((t?.kind==='forest'&&n>.25)||(!terrain&&(x<2||y<2||x>15||y>15)&&n>.55))objects.push({depth:x+y,draw:()=>this.tree(x+.5,y+.5,n,(t?.h||0)*10)});else if(n>.92&&(x<2||y<2||x>15||y>15))objects.push({depth:x+y,draw:()=>{this.box(x+.15,y+.2,.45,.4,7,'#8d987b',(t?.h||0)*10);this.box(x+.4,y+.5,.25,.3,4,'#a3ab89',(t?.h||0)*10);}});}
    if(battle){
      for(const e of battle.enemies)objects.push({depth:e.x+e.y,draw:()=>{if(e.hp<=0){this.box(e.x-.3,e.y-.3,.8,.8,3,'#696b53');return;}this.building({type:e.type==='core'?'command':battle.mission===2?'sanctum':'turret',x:e.x-.5,y:e.y-.5,level:battle.mission+1});this.health(e.x,e.y,76,e.hp/e.maxHp,true);}});
      for(const u of battle.units)if(u.hp>0)objects.push({depth:u.x+u.y+.1,draw:()=>this.unit(u)});
    }else{
      for(const b of s.buildings)objects.push({depth:b.x+b.y+BUILDINGS[b.type].size,draw:()=>this.building({...b,z:(terrain?.[b.y*GRID+b.x]?.h||0)*10},b.id===selected)});
      for(let i=0;i<Math.min(6,s.army.ranger);i++){const u={type:'ranger',x:9.2+Math.sin(this.time*.15+i*1.6)*1.6,y:9.4+Math.cos(this.time*.15+i*1.6)*1.2,hp:125,maxHp:125};objects.push({depth:u.x+u.y,draw:()=>this.unit(u)});}
      if(s.offers.length){const x=3.2+Math.sin(this.time*.25)*.15,y=9.4;objects.push({depth:x+y,draw:()=>{this.unit({type:'ranger',x,y,hp:125,maxHp:125});this.box(x-.25,y+.45,.5,.7,9,'#aa9568');const p=this.p(x,y,55);c.font=`bold ${18*this.scale*this.camera.zoom}px sans-serif`;c.textAlign='center';c.fillStyle='#f2d184';c.fillText('!',p.x,p.y+Math.sin(this.time*2)*2);}});}
      if(s.raid)for(const u of s.raid.units)if(u.hp>0)objects.push({depth:u.x+u.y,draw:()=>this.unit(u,true)});
    }
    objects.sort((a,b)=>a.depth-b.depth).forEach(o=>o.draw());
    if(this.hover&&!battle){const {x,y}=this.hover;if(x>=1&&y>=1&&x<17&&y<17){const type=placement||s.buildings.find(b=>b.id===moving)?.type,size=type?BUILDINGS[type].size:1,z=(terrain[y*GRID+x]?.h||0)*10+2;const valid=terrainTool||moving||!type||canPlace(s,type,x,y),color=valid?'#d5eaba':'#eb9f88';if(placement||terrainTool||moving)this.poly([this.p(x,y,z),this.p(x+size,y,z),this.p(x+size,y+size,z),this.p(x,y+size,z)],valid?'#c4dfa43b':'#dd7d5c44',color);if(placement&&valid){c.globalAlpha=.5;this.building({type:placement,x,y,level:1,z},false,true);c.globalAlpha=1;}}}
    const now=performance.now();this.shots=this.shots.filter(v=>now-v.at<220);for(const shot of this.shots){const alpha=1-(now-shot.at)/220;c.globalAlpha=alpha;this.line(this.p(shot.x,shot.y,22),this.p(shot.tx,shot.ty,20),shot.enemy?'#ffa679':'#dff2b1',2);this.glow(shot.tx,shot.ty,20,shot.enemy?'#ffc09070':'#d5eab870',10);c.globalAlpha=1;}
    if(battle&&!battle.units.length){const p=this.p(3.5,8,1);c.textAlign='center';c.fillStyle='#e4f5dd';c.font=`600 ${11*this.scale*this.camera.zoom}px sans-serif`;c.fillText('ZONA DE DESPLIEGUE',p.x,p.y);}
  }
  addShots(shots){const at=performance.now();this.shots.push(...shots.map(s=>({...s,at})));}
}
export function thumbnail(canvas,type,unit=false){
  const r=Object.create(Renderer.prototype);r.canvas=canvas;r.ctx=canvas.getContext('2d');r.w=160;r.h=100;r.scale=1.1;r.camera={x:0,y:0,zoom:1};r.time=0;r.dpr=2;canvas.width=320;canvas.height=200;r.ctx.scale(2,2);r.p=(x,y,z=0)=>({x:80+(x-y)*17,y:unit?70+(x+y)*8-z*.85:83+(x+y-1.7)*9-z*.85});
  if(unit)r.unit({type,x:0,y:0,hp:1,maxHp:1});else r.building({type,x:0,y:0,level:1});
}
