import {FRAMES} from './realism-frames.js';
// Original pre-rendered art, generated for Auralis. Source PNGs remain unmodified.
export const REALISM_REVISION=1;
const images={},sprites=new Map(),materials=new Map();
const sources={settlements:'settlements-v5.png',nature:'nature-v5.png',people:'people-v5.png',transport:'transport-v5.png',terrain:'terrain-v5.png'};
export const realismReady=Promise.all(Object.entries(sources).map(([key,file])=>new Promise(resolve=>{const img=new Image();img.onload=()=>{images[key]=img;resolve(true);};img.onerror=()=>resolve(false);img.src=new URL('./assets/art/'+file,import.meta.url).href;})));
export function realismLoaded(){return Object.keys(images).length===5;}
export function sprite(atlas,index,frame=0){
 const key=atlas+':'+index+':'+frame;if(sprites.has(key))return sprites.get(key);const img=images[atlas];if(!img)return null;
 const record=FRAMES[key];if(!record)return null;const result={...record,img};sprites.set(key,result);return result;
}
export function paintSprite(c,s,x,y,width,{flip=false,alpha=1,align='foot',height=null}={}){
 if(!s)return false;const scale=height?height/s.inkHeight:width/s.inkWidth,w=s.inkWidth*scale,h=s.inkHeight*scale,dx=align==='center'?-w/2:s.offsetX*scale,dy=-h;
 c.save();c.globalAlpha*=alpha;c.translate(x,y);if(flip)c.scale(-1,1);c.drawImage(s.img,...s.rect,dx,dy,w,h);c.restore();return true;
}
export function spriteContains(s,x,y,width,px,py){
 if(!s?.hitRows)return false;const h=width*s.inkHeight/s.inkWidth,xx=Math.floor((px-x+width/2)/width*24),yy=Math.floor((py-y+h)/h*24);return xx>=0&&xx<24&&yy>=0&&yy<24&&!!(s.hitRows[yy]&(1<<xx));
}
export const BUILDING_INDEX={camp:0,house:1,farm:2,mine:3,barracks:4,market:5,tower:6,dock:7,depot:8,embassy:9};
export const UNIT_ROWS={settler:0,spearman:1,archer:2,cavalry:3};
export const VESSEL_INDEX={raft:0,galley:1,transport:2,gunboat:3,train:4,plane:5,bridge:6,wall:7};
export function buildingSprite(type,variant=0){let index=BUILDING_INDEX[type];if(index===undefined)return null;if(type==='house'&&variant%3===1)index=10;if(type==='farm'&&variant%2===1)index=11;return sprite('settlements',index);}
export function unitSprite(type,frame=0){if(Object.hasOwn(UNIT_ROWS,type))return sprite('people',UNIT_ROWS[type],frame);return Object.hasOwn(VESSEL_INDEX,type)?sprite('transport',VESSEL_INDEX[type]):null;}
export function realismThumbnail(canvas,type,unit=false){const s=unit?unitSprite(type):buildingSprite(type);if(!s)return false;canvas.width=320;canvas.height=220;const c=canvas.getContext('2d');c.setTransform(2,0,0,2,0,0);const factor=Math.min(145/s.inkWidth,104/s.inkHeight);paintSprite(c,s,80,107,s.inkWidth*factor,{align:'center'});return true;}
export function material(index){if(materials.has(index))return materials.get(index);const img=images.terrain;if(!img)return null;const c=document.createElement('canvas');c.width=c.height=192;c.getContext('2d').drawImage(img,index%4*img.naturalWidth/4,Math.floor(index/4)*img.naturalHeight/2,img.naturalWidth/4,img.naturalHeight/2,0,0,192,192);materials.set(index,c);return c;}
