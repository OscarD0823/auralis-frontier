// Simulation is the existing ruleset: every multiplier remains exactly one.
export const DIFFICULTIES=Object.freeze({
 easy:Object.freeze({id:'easy',name:'Fácil',description:'Más tiempo para aprender: recolección y obras rápidas, menor consumo y ataques menos dañinos.',gather:2,work:2,training:1.8,science:1.6,consumption:.4,enemyDamage:.5,hazardDamage:.45,raidInterval:2,eventInterval:1.8,warning:2}),
 hard:Object.freeze({id:'hard',name:'Difícil',description:'Gestión exigente, con algo más de margen que la simulación: progreso moderado y enemigos peligrosos.',gather:1.35,work:1.3,training:1.25,science:1.2,consumption:.75,enemyDamage:.8,hazardDamage:.8,raidInterval:1.3,eventInterval:1.25,warning:1.5}),
 simulation:Object.freeze({id:'simulation',name:'Simulación',description:'Las reglas actuales: progreso lento, consumo completo, logística y amenazas sin reducir.',gather:1,work:1,training:1,science:1,consumption:1,enemyDamage:1,hazardDamage:1,raidInterval:1,eventInterval:1,warning:1})
});
export const difficulty=s=>DIFFICULTIES[s.difficulty||'simulation']||DIFFICULTIES.simulation;
export function setDifficulty(s,id){if(!Object.hasOwn(DIFFICULTIES,id))return{ok:false,message:'Dificultad desconocida.'};s.difficulty=id;return{ok:true,message:'Dificultad: '+DIFFICULTIES[id].name+'. Las bajas siguen siendo permanentes.'};}
