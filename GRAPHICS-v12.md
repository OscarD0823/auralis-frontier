# Modelado 3D · 0.12

La actualización cambia geometría, articulaciones, relieve y luz. Comparte las mismas piezas entre la campaña y el catálogo, con los diez niveles y familias de eras existentes.

- Tejados de una sola malla compartida con 144 tejas volumétricas, labio, variación de color, aleros y cumbreras. Las tiendas usan una superficie de tela curvada independiente.
- Ayuntamiento medieval con torres redondas, escalinata y portal; fachadas con arcos y sillares. Edificios más altos para que se lean sus paredes y accesos a distancia.
- Torsos torneados, cabezas y calzado redondeados, codos y rodillas animados. La herramienta sigue el antebrazo durante el trabajo. Se conservan armas, carga, equipo, pueblos y roles NPC.
- Chasis inclinados, torretas redondeadas y cañones cilíndricos. Cascos de barco construidos por secciones con proa, pantoque y cubierta; sacos y antenas en instalaciones militares.
- Copas irregulares, pinos por ramas y espigas en geometría. Sway de vegetación en GPU. Mapas normales de madera, piedra y tejas generados por código.
- Entorno para reflejos PBR, luz lateral, faroles y ventanas que cambian al anochecer. Hasta cuatro luces locales activas en edificios visibles.
- Orillas inclinadas de color mezclado y agua por proximidad a la costa, con espuma animada. El campo costero solo lee terreno descubierto; no altera cotas, navegación, construcción ni recursos del motor.
- Encuadre inicial un poco más cercano, conservando zoom y giro manuales. El mapa continúa cargándose por sectores, con lotes de instancias y cachés limitadas.

`qa-sculpted.mjs` verifica 512 variantes de era/nivel y 33 unidades, atributos finitos, articulaciones, herramienta, relieve, campo costero, luces nocturnas y terreno inalterado. `qa-3d.mjs` comprueba selección desde ocho ángulos, móvil, capas, modo sin conexión y límites de renderizado. En su escena representativa se midieron 277 llamadas y unas 463 mil caras incluyendo sombras, 19 geometrías compartidas y seis sectores residentes. La CPU en Edge de escritorio osciló entre 3 y 9 ms durante las pruebas; no es una medición de FPS de otros equipos.

Todos los modelos, mapas normales y shaders añadidos son originales, definidos en `sculpted-geometry.js`, `sculpted-style.js` y `scene-lighting.js`. Se conserva el sistema de sonido de 0.11 y el formato de guardado. Las texturas y geometrías se incluyen en web, Android y Windows y están disponibles sin conexión.
