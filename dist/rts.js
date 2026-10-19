// Bounded RTS helpers. Formation planning and separation never allocate a world-sized grid.
export const FORMATIONS={line:'Línea',column:'Columna',box:'Bloque',spread:'Dispersa'};
export const STANCES={defend:'Defender',aggressive:'Ofensiva',passive:'No atacar'};
export function formationTargets(map,units,x,y,formation,passable,troops){
 const center=units.reduce((p,u)=>{const queued=u.queue?.at(-1),last=Number.isFinite(queued?.x)&&Number.isFinite(queued?.y)?queued:u;return{x:p.x+last.x/units.length,y:p.y+last.y/units.length};},{x:0,y:0}),dx=x-center.x,dy=y-center.y,len=Math.hypot(dx,dy)||1,forward={x:dx/len,y:dy/len},side={x:forward.y,y:-forward.x},used=new Set(),columns=formation==='column'?Math.min(2,units.length):formation==='line'?Math.min(8,units.length):Math.ceil(Math.sqrt(units.length));
 return units.map((u,i)=>{const row=Math.floor(i/columns),count=Math.min(columns,units.length-row*columns),spacing=troops[u.type].naval?2:formation==='spread'?1.65:1.05,lateral=(i%columns-(count-1)/2)*spacing,back=(row-(Math.ceil(units.length/columns)-1)/2)*spacing;const target={x:x+side.x*lateral-forward.x*back,y:y+side.y*lateral-forward.y*back},spec=troops[u.type];let best=null,score=Infinity;
  for(let radius=0;radius<=6&&!best;radius++)for(let a=-radius;a<=radius;a++)for(let b=-radius;b<=radius;b++){if(radius&&Math.abs(a)!==radius&&Math.abs(b)!==radius)continue;const xx=Math.floor(target.x)+a,yy=Math.floor(target.y)+b,key=xx+':'+yy;if(xx<0||yy<0||xx>=map.size-1||yy>=map.size-1||used.has(key)||!passable(map,xx,yy,spec,u.depth||0))continue;const value=Math.hypot(xx+.5-target.x,yy+.5-target.y);if(value<score){score=value;best={x:xx+.5,y:yy+.5};}}
  if(best)used.add(Math.floor(best.x)+':'+Math.floor(best.y));return best;
 });
}
export function separateUnits(map,dt,passable,troops){
 const cells=new Map(),active=[...map.units,...(map.enemies||[])].filter(u=>u.hp>0&&!u.embarked&&!u.inTransit&&!troops[u.type].flying),key=(x,y,d)=>Math.floor(x/2)+':'+Math.floor(y/2)+':'+d;
 for(const u of active){const k=key(u.x,u.y,u.depth||0);if(!cells.has(k))cells.set(k,[]);cells.get(k).push(u);}
 for(const u of active){const spec=troops[u.type],radius=spec.naval?.82:['jeep','bulwark','missile','mecha'].includes(u.type)?.55:.32;let sx=0,sy=0,neighbors=0;for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++)for(const v of cells.get(key(u.x+a*2,u.y+b*2,u.depth||0))||[]){if(u===v||!!spec.naval!==!!troops[v.type].naval||neighbors>=12)continue;const dx=u.x-v.x,dy=u.y-v.y,d=Math.hypot(dx,dy),other=troops[v.type].naval?.82:['jeep','bulwark','missile','mecha'].includes(v.type)?.55:.32,limit=radius+other;if(d>=limit)continue;neighbors++;const angle=u.id<v.id?.7:Math.PI+.7,amount=(limit-d)*Math.min(1,dt*3)*.5;sx+=(d>.001?dx/d:Math.cos(angle))*amount;sy+=(d>.001?dy/d:Math.sin(angle))*amount;}
  const norm=Math.hypot(sx,sy),cap=dt*.65;if(norm>cap){sx*=cap/norm;sy*=cap/norm;}const nx=u.x+sx,ny=u.y+sy;const levelSafe=u.depth||spec.naval||Math.abs((map.terrain[Math.floor(ny)*map.size+Math.floor(nx)]?.h||0)-(map.terrain[Math.floor(u.y)*map.size+Math.floor(u.x)]?.h||0))<=1;if(levelSafe&&nx>=0&&ny>=0&&nx<map.size-1&&ny<map.size-1&&passable(map,Math.floor(nx),Math.floor(ny),spec,u.depth||0)){u.x=nx;u.y=ny;}
 }
}
