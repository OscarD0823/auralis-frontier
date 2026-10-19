import {World3DRenderer} from './world-3d.js';
import {HorizonsRenderer} from './horizons-render.js';
export function createWorldRenderer(canvas){
 try{return new World3DRenderer(canvas);}catch(error){
  // A canvas cannot change context types after a failed WebGL initialization.
  const clean=canvas.cloneNode();canvas.parentElement.querySelector('.world-overlay')?.remove();canvas.replaceWith(clean);const r=new HorizonsRenderer(clean);r.mode='2D · compatibilidad';clean.dataset.renderer='2d';console.warn('Auralis: WebGL 2 no disponible; se usa la vista compatible.',error.message);return r;
 }
}
