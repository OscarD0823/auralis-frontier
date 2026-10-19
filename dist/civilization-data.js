import {PROCESSED_STOCK} from './campaign-content.js';
// Data-driven progression: append an age to AGE_NAMES to extend the campaign.
export const LEVELS_PER_ERA=10;
export const ERA_IDS={stone:1,metal:3,navigation:8,industry:12,modern:17,orbital:23};
export const LEGACY_ERAS=[0,1,3,8,12,17,23];
const AGE_NAMES=['Supervivencia','Aldea de piedra','Agricultura','Metalurgia','Ciudades amuralladas','Imperios antiguos','Feudalismo','Reinos medievales','Navegación','Renacimiento','Pólvora','Vapor','Industria','Electricidad','Mecanización','Petróleo','Aviación','Era moderna','Información','Robótica','Biotecnología','Fusión','Nanotecnología','Era orbital','Colonias lunares','Horizonte marciano','Red interplanetaria','Minería de asteroides','Civilización solar','Terraformación','Materia programable','Antimateria','Red cuántica','Singularidad','Imperio estelar','Civilización galáctica','Ingeniería dimensional','Tecnología causal','Horizonte cósmico','Trascendencia'];
export const STOCK_NAMES={wood:'Madera',stone:'Piedra',food:'Alimentos',water:'Agua potable',iron:'Hierro',coal:'Carbón',gold:'Oro',oil:'Petróleo',crystal:'Cristal',copper:'Cobre',tin:'Estaño',salt:'Sal',silica:'Sílice',lithium:'Litio',titanium:'Titanio',uranium:'Uranio',iridium:'Iridio',aether:'Éter mineral',credits:'Áureos',...PROCESSED_STOCK};
export const MINERALS={
 stone:{era:0,depth:0,use:'Cimientos y mampostería; niveles 2–4 de los edificios.'},
 salt:{era:2,depth:1,use:'Conservación de alimentos; mejora la agricultura y reduce el consumo de comida.'},
 copper:{era:2,depth:3,use:'Herramientas y conductores; talleres, primeros imperios y electricidad.'},
 tin:{era:3,depth:4,use:'Aleación de bronce; defensa, herramientas y arquitectura antigua.'},
 coal:{era:3,depth:4,use:'Hornos, vapor, generación eléctrica y ferrocarril.'},
 iron:{era:3,depth:7,use:'Herramientas de acero, fortificaciones, barcos y máquinas.'},
 gold:{era:3,depth:16,use:'Comercio, instrumentos de precisión y circuitos avanzados.'},
 silica:{era:8,depth:10,use:'Vidrio y semiconductores; investigación y civilización digital.'},
 oil:{era:12,depth:26,use:'Motores, aviación y transporte industrial.'},
 crystal:{era:18,depth:30,use:'Óptica, energía orbital y computación.'},
 lithium:{era:17,depth:18,use:'Baterías y almacenamiento; robótica, sintéticos y electrificación.'},
 titanium:{era:22,depth:24,use:'Estructuras aeroespaciales, estaciones y colonias planetarias.'},
 uranium:{era:20,depth:28,use:'Reactores avanzados y propulsión; requiere tratamiento científico.'},
 iridium:{era:27,depth:34,use:'Ingeniería estelar, sensores cuánticos y materia programable.'},
 aether:{era:33,depth:38,use:'Conducción dimensional y tecnología de las últimas eras.'}
};
export const requiredMineral=era=>era<3?'stone':era<4?'copper':era<6?'tin':era<9?'iron':era<12?'silica':era<15?'coal':era<18?'oil':era<21?'lithium':era<23?'uranium':era<28?'titanium':era<34?'iridium':'aether';
export const ERAS=AGE_NAMES.map((name,i)=>{const scale=Math.round(160*Math.pow(1.23,i)),mineral=requiredMineral(i);return{name,depth:i<3?2+i*3:i<8?16:i<12?24:i<17?32:40,time:i?600+i*180:0,cost:i?{wood:Math.round(scale*.8),stone:scale,food:Math.round(scale*.6),water:Math.round(scale*.4),...(i>=3?{[mineral]:Math.max(20,Math.round(scale*.12))}:{}),...(i>=12?{credits:Math.round(scale*.15)}:{})}:{},mineral,domain:i<8?'Fundación':i<12?'Expansión':i<18?'Industria':i<23?'Ciencia':i<30?'Espacio':i<34?'Materia':'Trascendencia',bonus:'Capacidad productiva +'+Math.round(i*4)+'% · infraestructura de nivel tecnológico '+(i+1)};});
export const SPECIES={
 human:{name:'Humanos',symbol:'◈',description:'Colonos versátiles que fundan el primer pueblo.',gather:1,food:1,water:1,hp:1,speed:1},
 sylvan:{name:'Verdantes',symbol:'❧',description:'Guardianes de bosques remotos. Recolectan un 20% más; necesitan un 10% menos de agua.',gather:1.2,food:1,water:.9,hp:.95,speed:1.05,cost:{food:150,water:100,wood:100},morality:20},
 stonekin:{name:'Pétreos',symbol:'⬡',description:'Habitantes de galerías olvidadas. Extraen un 25% más de minerales y tienen un 25% más de vida.',gather:1,mining:1.25,food:1.1,water:.85,hp:1.25,speed:.9,cost:{stone:180,iron:40,food:80},morality:-10},
 thalass:{name:'Mareanos',symbol:'≈',description:'Navegantes de archipiélagos aislados. Se desplazan un 15% más rápido y consumen menos agua.',gather:1.05,food:1,water:.7,hp:1,speed:1.15,cost:{food:200,water:200,gold:30},morality:10},
 synthetic:{name:'Sintéticos',symbol:'◇',description:'Una civilización mecánica que exige investigación y una fábrica avanzada. Consume un 75% menos de comida.',gather:1.15,mining:1.15,food:.25,water:.5,hp:1.15,speed:1,cost:{iron:500,lithium:100,silica:150,credits:500},morality:0},
 astral:{name:'Astrales',symbol:'✦',description:'Exploradores de materia estelar. Su pacto requiere ciencia avanzada y una reputación compasiva.',gather:1.3,mining:1.3,food:.7,water:.7,hp:1.2,speed:1.2,cost:{iridium:160,crystal:300,credits:2000},morality:50}
};
export const ROAD_GRADES={rail:{name:'Ferrocarril',era:12,cost:{iron:8,stone:4},speed:1.5,width:.3},trail:{name:'Camino de tierra',era:0,cost:{stone:3},speed:1.3,width:.24},paved:{name:'Calzada de piedra',era:3,cost:{stone:8,wood:2},speed:1.5,width:.34},avenue:{name:'Avenida imperial',era:12,cost:{stone:15,iron:4},speed:1.75,width:.48}};
