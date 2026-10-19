# Gráficos y sonido · 0.11

La dirección mezcla la lectura inmediata de edificios y personajes de Clash of Clans con las instalaciones, vehículos y armas de Social Wars. Se crean modelos y sonidos originales; las referencias no aportan archivos al juego.

Referencias visuales: [Clash of Clans, Supercell](https://supercell.com/en/games/clashofclans/), [galería archivada de Social Wars](https://kotaku.com/games/social-wars/gallery/1) y [capturas históricas de Social Wars](https://eujogosocialwars.blogspot.com/2013/02/fotos.html). La página oficial de Social Wars requiere acceso a Facebook; las capturas históricas permiten revisar sus instalaciones militares. No se afirma disponer de sus modelos o código.

## Geometría y materiales

`visual-style.js` comparte masas biseladas y tejados a cuatro aguas entre el juego, las miniaturas y el catálogo. El ayuntamiento, la casa, el almacén y el cuartel preindustriales tienen siluetas propias; el primer campamento es una tienda. Ventanas, accesos, almacenes de troncos, carros de mineral, defensas, antenas y embarcaderos refuerzan la función del edificio. Se mantienen huella, giro, diez niveles y decoraciones de cada pueblo.

Los personajes tienen rostros, manos, cascos, correas y equipamiento, con las articulaciones existentes para caminar y trabajar. Vehículos con faros, parachoques, orugas, escotillas; barcos con barandillas y salvavidas. Los tres transportes de geometría independiente reciben su propia decoración. No se sustituyen modelos por imágenes planas.

Las texturas de 256 px se pintan por código con semilla fija: tejas, madera, piedra y camuflaje. El sombreado del terreno usa coordenadas del mundo y variación suave; el agua también ancla sus ondas al mundo. Sombras de contacto transparentes, hojas y hierba integran los objetos con el suelo. Las partículas de trabajo, humo y proyectiles tienen límites y se recortan por pantalla y visibilidad.

La prueba representativa con 64 tipos de edificios y 33 unidades dibuja 3025 casillas, usa 11 geometrías compartidas, 248 llamadas y unas 327 mil caras incluyendo sombras, con unos 5 ms de CPU por actualización en Edge de escritorio durante pruebas concurrentes. Es una medición de esa escena, no una garantía de FPS en todo dispositivo. Se mantiene el límite de 64 sectores residentes; no se renderiza el mapa completo. Las sombras usan 1024 px en pantallas pequeñas y 2048 px en escritorio. El modo 2D conserva compatibilidad cuando WebGL no está disponible.

## Sonido

`audio.js` sintetiza 21 señales con ruido filtrado, transitorios y resonancias; no descarga muestras. Incluye selección, órdenes, confirmación, error, madera, piedra, metal, agua, pasos, motores, navegación, arco, disparo, explosión, energía, monedas, finalización, alerta, aves, grillos y una melodía suave opcional. Trabajo y movimiento dependen de las unidades reales; disparos dependen de los eventos de combate del motor. Los efectos espaciales se limitan a la vista descubierta y a la capa activa. Los avisos generales de eventos se oyen como información del HUD.

El navegador activa el contexto tras una interacción. Hay controles separados de volumen general, efectos, ambiente, música y silencio, persistidos en el dispositivo; la música empieza apagada. Un compresor limita las mezclas, se aceptan como máximo veinte señales simultáneas, se liberan los nodos terminados y se suspende el contexto al ocultar la página. La síntesis funciona sin conexión en web y dentro de los paquetes nativos.

`qa-visual-audio.mjs` comprueba las 21 formas de onda en un contexto de audio fuera de línea, señal finita y niveles sin saturación, diferencias entre sonidos, activación, silencio, persistencia, suspensión/reanudación, límite y liberación de voces, ocultación espacial y controles a 320/390/768 px. También comprueba 512 variantes de edificios, las 33 tropas y las normales exteriores de los tejados. Estas pruebas validan generación y enrutamiento; no sustituyen una escucha en los altavoces de cada dispositivo.
