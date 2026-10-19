import {FRAMES} from './realism-frames.js';
// Original pre-rendered art, generated for Auralis. Source PNGs remain unmodified.
export const REALISM_REVISION=1;
const images={},sprites=new Map(),materials=new Map();
const sources={settlements:'settlements-v5.png',nature:'nature-v5.png',people:'people-v5.png',transport:'transport-v5.png',terrain:'terrain-v5.png',civic:'civic-buildings-v6.png'};
export const realismReady=Promise.all(Object.entries(sources).map(([key,file])=>new Promise(resolve=>{const img=new Image();img.onload=()=>{images[key]=img;resolve(true);};img.onerror=()=>resolve(false);img.src=new URL('./assets/art/'+file,import.meta.url).href;})));
export function realismLoaded(){return Object.keys(images).length===Object.keys(sources).length;}
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
export const BUILDING_INDEX={camp:0,house:1,farm:2,mine:3,barracks:4,market:5,tower:6,dock:7,depot:8,embassy:9,school:9,cistern:8};
export const UNIT_ROWS={settler:0,spearman:1,archer:2,cavalry:3};
export const VESSEL_INDEX={raft:0,galley:1,transport:2,gunboat:3,train:4,plane:5,bridge:6,wall:7};
export const CIVIC_INDEX={well:0,cistern:1,school:2,waterworks:3,greenhouse:4,fusion:5,starforge:6};
export const FUTURE_INDEX={camp:7,house:8,farm:9,depot:10,tower:11,reactor:5,garage:6,school:7,cistern:3};
export function buildingSprite(type,variant=0,tier=0){if(tier>=23&&Object.hasOwn(FUTURE_INDEX,type))return sprite('civic',FUTURE_INDEX[type]);if(Object.hasOwn(CIVIC_INDEX,type))return sprite('civic',CIVIC_INDEX[type]);if(tier>=12)return null;let index=BUILDING_INDEX[type];if(index===undefined)return null;if(type==='house'&&variant%3===1)index=10;if(type==='farm'&&variant%2===1)index=11;return sprite('settlements',index);}
export function unitSprite(type,frame=0){if(Object.hasOwn(UNIT_ROWS,type))return sprite('people',UNIT_ROWS[type],frame);return Object.hasOwn(VESSEL_INDEX,type)?sprite('transport',VESSEL_INDEX[type]):null;}
export function realismThumbnail(canvas,type,unit=false,tier=0){const s=unit?unitSprite(type):buildingSprite(type,0,tier);if(!s&&type!=='well')return false;canvas.width=320;canvas.height=220;const c=canvas.getContext('2d');c.setTransform(2,0,0,2,0,0);if(!s&&type==='well'){paintWell(c,80,108,1.8);return true;}const factor=Math.min(145/s.inkWidth,104/s.inkHeight);paintSprite(c,s,80,107,s.inkWidth*factor,{align:'center'});return true;}
export function paintWell(c,x,y,scale=1){c.save();c.translate(x,y);c.scale(scale,scale);const stone=c.createLinearGradient(-24,0,24,0);stone.addColorStop(0,'#747966');stone.addColorStop(.55,'#c4bea0');stone.addColorStop(1,'#7b806c');c.fillStyle=stone;c.beginPath();c.ellipse(0,-3,24,12,0,0,Math.PI);c.lineTo(-24,-18);c.ellipse(0,-18,24,12,0,Math.PI,Math.PI*2);c.closePath();c.fill();c.strokeStyle='#5b604e';c.lineWidth=1;for(let row=0;row<3;row++)for(let i=0;i<6;i++){const xx=-22+i*8+(row%2)*3;c.strokeRect(xx,-20+row*6,7,5);}c.fillStyle='#c0bea4';c.beginPath();c.ellipse(0,-20,25,12,0,0,7);c.fill();c.fillStyle='#254f50';c.beginPath();c.ellipse(0,-20,17,7,0,0,7);c.fill();c.fillStyle='#816b44';c.fillRect(-18,-62,4,45);c.fillRect(15,-62,4,45);c.fillRect(-20,-55,40,4);c.strokeStyle='#d1bd87';c.beginPath();c.moveTo(1,-53);c.lineTo(1,-22);c.stroke();c.fillStyle='#777b63';c.fillRect(-3,-28,8,7);c.fillStyle='#786a49';c.beginPath();c.moveTo(-32,-57);c.lineTo(0,-78);c.lineTo(32,-60);c.lineTo(1,-45);c.closePath();c.fill();c.strokeStyle='#b8a377';for(let i=0;i<5;i++){c.beginPath();c.moveTo(-27+i*6,-59+i*3);c.lineTo(i*6,-75+i*3);c.stroke();}c.restore();}
export function material(index){if(materials.has(index))return materials.get(index);const img=images.terrain;if(!img)return null;const c=document.createElement('canvas');c.width=c.height=192;c.getContext('2d').drawImage(img,index%4*img.naturalWidth/4,Math.floor(index/4)*img.naturalHeight/2,img.naturalWidth/4,img.naturalHeight/2,0,0,192,192);materials.set(index,c);return c;}
