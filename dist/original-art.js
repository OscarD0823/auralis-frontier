import {atlases,artReady,getArt,buildingFrames} from './art.js';
import {realismReady,buildingSprite,unitSprite} from './realism-assets.js';
import {TROOPS} from './horizons.js';

// These are the eight original, unmodified Auralis sheets, not substitute models.
export const originalArtReady=Promise.all([artReady,realismReady]);
const crops=new Map();
const military={camp:'command',barracks:'barracks',garage:'garage',airfield:'airfield',hangar:'airfield',tower:'turret',bunker:'turret',cannon:'turret',coastal:'turret',antiair:'battery',munitions:'battery',lab:'lab',hospital:'hospital',clinic:'hospital',market:'market',embassy:'embassy',depot:'depot',maintenance:'garage',freightterminal:'depot',radar:'lab'};
const fantasy={camp:'command',mine:'mine',quarry:'mine',reactor:'reactor',barracks:'barracks',refinery:'refinery',smithy:'refinery',foundry:'refinery',cannon:'turret',tower:'turret',lab:'sanctum',archive:'sanctum',wall:'wall'};
const earlyAlias={sawmill:'depot',carpenter:'depot',workshop:'depot',granary:'farm',mill:'farm',bakery:'house',fishery:'dock',huntinglodge:'house',livestock:'farm',stable:'house',caravan:'market',bridgeyard:'depot',engineering:'school',surveyoffice:'school',refuge:'house',clinic:'school',hospital:'school',archive:'school',lighthouse:'tower',watchtower:'tower',firestation:'house',fueltank:'refinery',sewage:'waterworks',station:'depot',cargoharbor:'dock',shipwright:'dock',cargoterminal:'depot',hangar:'garage',maintenance:'garage',freightterminal:'depot',bunker:'tower',coastal:'tower',antiair:'tower',munitions:'depot',radar:'school',shield:'lab'};
const unitAlias={guardian:'golem',psion:'arcanist',starship:'drake',mecha:'bulwark',surveyor:'settler',engineer:'settler',medic:'settler',cargoplane:'plane',freighttrain:'train',submarine:'gunboat',leviathan:'gunboat',wagon:'transport'};

function source(type,unit,tier,frame){
 if(unit){const id=unitAlias[type]||type;if(id==='settler')return unitSprite('settler',frame);if(['spearman','archer','cavalry'].includes(id))return getArt(id,frame,true);if(['raft','galley','train','plane'].includes(id))return unitSprite(id);return getArt(TROOPS[id]?.art||id,frame,true);}
 if(type==='dock'||['cargoharbor','shipwright'].includes(type))return getArt('dock');
 if(tier>=23){const civic=buildingSprite(type,0,tier);if(civic)return civic;}
 if(tier>=12&&military[type])return getArt(military[type]);
 if(tier>=4&&fantasy[type]&&atlases.buildings)return{img:atlases.buildings,rect:buildingFrames[fantasy[type]]};
 return buildingSprite(type,0,tier)||buildingSprite(earlyAlias[type],0,tier)||null;
}
export function originalSprite(type,unit=false,tier=0,frame=0){
 const s=source(type,unit,tier,Math.max(0,Math.min(3,frame)));if(!s)return null;
 const key=s.img.src+':'+s.rect.join(',');if(crops.has(key))return crops.get(key);
 const [x,y,w,h]=s.rect,c=document.createElement('canvas');c.width=Math.ceil(w);c.height=Math.ceil(h);const ctx=c.getContext('2d',{willReadFrequently:true});ctx.drawImage(s.img,x,y,w,h,0,0,c.width,c.height);
 const pixels=ctx.getImageData(0,0,c.width,c.height).data;let left=c.width,top=c.height,right=-1,bottom=-1;
 for(let yy=0;yy<c.height;yy++)for(let xx=0;xx<c.width;xx++)if(pixels[(yy*c.width+xx)*4+3]>32){left=Math.min(left,xx);right=Math.max(right,xx);top=Math.min(top,yy);bottom=Math.max(bottom,yy);}
 if(right<left)return null;
 const image=document.createElement('canvas');image.width=right-left+1;image.height=bottom-top+1;image.getContext('2d').drawImage(c,left,top,image.width,image.height,0,0,image.width,image.height);
 const sprite={key,image,ratio:image.width/image.height,source:s.img.src};crops.set(key,sprite);return sprite;
}
export function originalThumbnail(canvas,type,unit=false,tier=0){const s=originalSprite(type,unit,tier);if(!s)return false;canvas.width=320;canvas.height=240;const c=canvas.getContext('2d'),scale=Math.min(300/s.image.width,220/s.image.height);c.drawImage(s.image,(320-s.image.width*scale)/2,230-s.image.height*scale,s.image.width*scale,s.image.height*scale);canvas.dataset.artSource=s.source.split('/').pop();return true;}

export class OriginalPortrait{
 constructor(canvas,unit){this.canvas=canvas;this.unit={...unit};this.pose='idle';this.zoom=1;this.flip=false;this.yaw=0;this.disposed=false;this.abort=new AbortController();const options={signal:this.abort.signal};let start=null;canvas.addEventListener('pointerdown',e=>{canvas.setPointerCapture(e.pointerId);start=e.clientX;},options);canvas.addEventListener('pointermove',e=>{if(start!==null){this.yaw+=(e.clientX-start)*.01;this.flip=this.yaw<0;start=e.clientX;}},options);for(const event of['pointerup','pointercancel'])canvas.addEventListener(event,()=>start=null,options);canvas.addEventListener('wheel',e=>{e.preventDefault();this.zoom=Math.max(.7,Math.min(1.5,this.zoom-e.deltaY*.001));},{...options,passive:false});this.resize=new ResizeObserver(()=>this.fit());this.resize.observe(canvas);this.fit();this.loop=t=>{if(this.disposed)return;if(!document.hidden&&t-(this.last||0)>80){this.last=t;this.draw(t/1000);}this.raf=requestAnimationFrame(this.loop);};this.raf=requestAnimationFrame(this.loop);canvas.dataset.characterRevision='original';}
 fit(){const r=this.canvas.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);this.canvas.width=Math.max(1,r.width*d);this.canvas.height=Math.max(1,r.height*d);}
 draw(t){const frame=this.pose==='walk'?[0,1,2,1][Math.floor(t*6)%4]:this.pose==='attack'||this.pose==='work'?(Math.floor(t*2)%2?3:0):0,s=originalSprite(this.unit.type,true,this.unit.technology||0,frame);if(!s)return;const c=this.canvas.getContext('2d'),w=this.canvas.width,h=this.canvas.height;c.clearRect(0,0,w,h);const scale=Math.min(w*.8/s.image.width,h*.87/s.image.height)*this.zoom;c.save();c.translate(w/2,h*.94);if(this.flip)c.scale(-1,1);c.drawImage(s.image,-s.image.width*scale/2,-s.image.height*scale,s.image.width*scale,s.image.height*scale);c.restore();this.canvas.dataset.frames=String((Number(this.canvas.dataset.frames)||0)+1);this.canvas.dataset.pose=this.pose;this.canvas.dataset.yaw=this.yaw.toFixed(3);this.canvas.dataset.source=s.source.split('/').pop();}
 setPose(pose){this.pose=pose;}
 dispose(){this.disposed=true;cancelAnimationFrame(this.raf);this.resize.disconnect();this.abort.abort();}
}
