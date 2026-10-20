# Personajes · 0.13

La referencia solicitada es el realismo estilizado de Clash of Clans: rostros legibles, proporciones heroicas y equipo con volumen. Se revisó la [explicación de Supercell sobre sus figuras](https://supercell.com/en/games/clashofclans/blog/news/the-making-of-clash-figures/), donde se describen ajustes de pupilas, colores y postura del arco. Los personajes de Auralis usan geometrías, paletas y equipamiento originales; no se incluyen modelos ni texturas de Supercell.

La base humana anterior se reemplaza en `characters.js`. Los colonos tienen chaleco, camisa, delantal, barba y herramienta; los lanceros, hombros más anchos, casco, escudo y lanza; los arqueros, una silueta más ligera, capucha posterior, capa, carcaj y arco. Las tropas modernas conservan armas y cascos acordes a la tecnología. Los NPC usan el mismo cuerpo nuevo con sus accesorios de oficio y los pueblos conservan materiales propios.

El rostro usa una malla de cráneo y mandíbula con color de mejillas; ojos con iris, pupila, brillo y parpadeo, cejas, nariz, boca, orejas y pelo. Torso suave con pliegues, manos abiertas o en agarre con dedos, guantes/braceras, cinturones y botas. Las geometrías se comparten entre unidades.

La marcha incorpora desplazamiento del peso, balanceo del torso y cabeza, codos, rodillas y compensación del pie. Trabajo, transporte y combate tienen poses propias; herramientas, armas y carga siguen el cuerpo. La capa se mueve con la marcha. Son animaciones por articulaciones y poses, no captura de movimiento ni simulación física de tela.

El retrato de una unidad abre un visor 3D con giro, acercamiento y cuatro modos: reposo, caminar, trabajar y combate. Solo anima una copia visual de la unidad mientras el diálogo pausa la campaña. Cierra su bucle, eventos, observador y contexto WebGL al salir. Las miniaturas humanas muestran cara y hombros; el mapa permite acercar hasta 4×.

Validación específica: 1512 combinaciones de 21 tipos humanos/NPC, cuatro eras, tres grados de equipo y seis pueblos; geometría y matrices finitas, mallas compartidas, parpadeo y carga. Pruebas de interacción del visor, cuatro poses, giro, campaña inalterada, 320/390/768 px y apertura/cierre repetidos. Se mantiene la comprobación del catálogo de 115 láminas y la campaña. En la escena representativa del motor se midieron 343 llamadas, unas 678 mil caras incluyendo sombras, 30 geometrías, 2352 casillas y seis sectores residentes; la CPU de escritorio estuvo entre 4 y 10 ms durante las pruebas concurrentes. No representa los FPS de todos los dispositivos.

Los edificios, el sistema de sonido y el formato de guardado se conservan. Los modelos y el visor se incluyen en las versiones sin conexión.
