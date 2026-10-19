# Interfaz y construcción · Alpha 0.8

La prioridad es ver y dirigir el mundo. La interfaz conserva cinco accesos permanentes: Territorio, Construir, Ejército, Pueblo y Gestión. Ciencia, mapas, diplomacia, eras, excavación y suministros están dentro de Gestión. El inspector lateral solo se abre al solicitar detalles; las órdenes aparecen junto a la selección. El minimapa se puede contraer.

## Construir y mejorar

El catálogo agrupa pueblo, mejoras de edificios existentes, recursos, defensa, tecnología y caminos. Por defecto muestra lo disponible en la era actual. El catálogo militar tiene filtros de civiles, tierra, armada y aviación.

Elegir un edificio abre su vista previa sobre el terreno. Verde indica una posición válida y rojo explica la condición incumplida: terreno, recursos, conocimientos o cercanía de un colono. Se puede tocar o arrastrar la posición y girar el modelo en cuartos de vuelta. Solo **Construir** consume materiales y asigna la obra. Las obras mantienen su tamaño real y muestran cimientos, estructura parcial y andamios. La rotación queda guardada; no cambia su huella cuadrada ni su función.

Seleccionar un edificio permite abrir su mejora con un modelo central, diez indicadores de nivel, comparación de prestaciones, duración y existencias frente al precio. Las reglas de constructor, minerales estudiados y progresión siguen siendo las de civilización. El catálogo también reúne las mejoras de los edificios terminados.

Las vías se dibujan como tramos conectados con juntas redondeadas, distinto ancho según su acabado y señalización en las avenidas. Rectas, curvas, presupuesto y ejecución por colonos conservan las reglas anteriores. No se añade simulación de tráfico ni zonificación.

## Dirigir unidades

- PC: arrastrar un recuadro selecciona; clic derecho da una orden contextual; Shift añade a la cola. Ctrl + 1–9 guarda grupos y 1–9 los recupera. Alt + arrastre o botón central desplaza la cámara.
- Móvil: tocar selecciona o dirige; arrastrar desplaza y dos dedos ajustan el zoom. Órdenes → Seleccionar área permite dibujar un recuadro con el dedo.
- Las formaciones línea, columna, bloque y dispersa distribuyen destinos transitables orientados a la marcha. Cada unidad busca su ruta local; no existe una simulación de frente rígido ni un planificador global de grandes ejércitos.
- Las rutas admiten diagonales y evitan atravesar esquinas bloqueadas o saltar desniveles. Una separación local reduce el amontonamiento sin reservar una cuadrícula del mundo completo.
- Defender mantiene la adquisición local; Ofensiva busca enemigos a mayor distancia y permite perseguir desde espera. No atacar suspende la adquisición automática; una orden explícita de ataque sigue funcionando.
- Los edificios de reclutamiento permiten marcar un punto de reunión descubierto. Los nuevos reclutas reciben una orden hacia un destino transitable cercano; un colono puede recibir una orden de recolección si se marca un recurso adecuado.

B abre Construir, R gira una construcción, Enter confirma y Escape cancela. Q/E giran la cámara. A activa avance y ataque, M mover, G recolectar, S detener y Espacio centra la selección.

## Referencias de diseño

- [Supercell: renovación de la interfaz de Clash of Clans](https://supercell.com/en/games/clashofclans/blog/news/weve-revamped-the-clash-of-clans-user-interface/): catálogo agrupado, controles según contexto y datos de mejora concentrados.
- [Paradox: herramientas de carreteras de Cities: Skylines II](https://www.paradoxinteractive.com/games/cities-skylines-ii/features/road-tools): trazado previo y elección de geometría para construir la red.
- [Age of Empires: controlar el imperio y reunir recursos](https://www.ageofempires.com/learn-to-play/controlling-your-empire-gathering-resources-xbox/): selección, órdenes y tareas físicas de los aldeanos.

La combinación histórica, militar y tecnológica solicitada para Social Wars se representa con los modelos originales de Auralis. No se incorporan imágenes, interfaces ni modelos extraídos de esos juegos. El acabado sigue siendo 3D estilizado, con variantes compartidas entre varias eras.

## Verificación

Las pruebas del motor cubren destinos de formación, llegada, separación, esquinas, posturas, reclutas con reunión, presupuesto sin gasto, rotación y persistencia. Las pruebas de navegador ejercitan catálogo, confirmación/cancelación, ubicación inválida, caminos, órdenes militares, selección táctil, anchuras de 320/390/768 px, mejoras, gestión y modo sin conexión. Los paquetes nativos se verifican contra los archivos exactos de `dist/`.
