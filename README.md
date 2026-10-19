# Auralis Frontier · Horizontes

Juego original de estrategia y supervivencia del ecosistema Auralis para web, Android y Windows.

[Jugar](https://oscard0823.github.io/auralis-frontier/) · [Descargar Android y Windows](https://github.com/OscarD0823/auralis-frontier/releases/latest) · [Ecosistema Auralis](https://oscard0823.github.io/Pagina-Principal/)

## Alpha 0.12: modelado con más volumen

- Tejados con 144 tejas en relieve y tela independiente para tiendas; ayuntamiento con torres redondas, arcos, aleros y sillares.
- Personajes con torsos curvos, codos y rodillas articulados; chasis inclinados, torretas redondeadas y cascos navales por secciones.
- Copas orgánicas, pinos por ramas, espigas y vegetación con viento; materiales con mapas normales, reflejos de entorno, faroles y luz nocturna.
- Orillas inclinadas, agua somera y espuma según la costa descubierta; cámara inicial más cercana. Se mantienen partidas, sonido y carga del mapa por sectores.
- [Detalles y validación del modelado](GRAPHICS-v12.md).

## Alpha 0.11: un mundo con más volumen y sonido

- **Edificios y tropas 3D renovados**: masas biseladas, tejados a cuatro aguas, ayuntamiento con campanario, casas con porche y buhardilla, almacenes abiertos y cuarteles con torre. Ventanas, troncos, carros de mineral, antenas, vehículos, orugas, cascos y rostros usan geometría y materiales compartidos.
- **Terreno continuo** con variación de color a escala del mundo, tejas y madera pintadas por código, vegetación, sombras de contacto y agua animada. Partículas limitadas para trabajo, chimeneas y proyectiles con impacto.
- **21 sonidos originales** sintetizados: tala, minería, agua, pasos, motores, navegación, arcos, disparos, explosiones, avisos y recompensas; aves/grillos según el ciclo del día. Audio posicional sobre lo visible; volumen general, efectos, ambiente y música opcional en Ajustes. Se activa con la primera interacción y se suspende al ocultar el juego.
- Los 64 edificios, 33 unidades, diez niveles y los pueblos del catálogo comparten el nuevo estilo. Se conserva la campaña. La geometría es original y estilizada; no se incluyen modelos ni sonidos de los juegos de referencia.

## Alpha 0.10: el estándar entra en la campaña

- **64 edificios funcionales y 33 unidades reclutables** con modelos 3D propios, diez niveles/equipos y aperturas por era. Los edificios incorporan adornos de los pueblos ya desbloqueados; los enclaves remotos muestran su arquitectura.
- **Cadenas de producción con operarios**: aserradero, carpintería, molino/panadería, ganadería, cantera, caza/pesca, herrería, fundición, taller, medicinas, munición y saneamiento. Los insumos se trasladan desde almacenes y la producción queda en el edificio. Un colono puede recoger diez bienes y entregarlos; los convoyes mueven lotes mayores.
- **Suministros → Instalaciones / Ingeniería / Convoyes**, con inventarios locales, recetas, personal y estado de trabajo. Se mantienen cinco accesos principales. Los grados de equipo se mejoran desde Órdenes.
- **Estudios sobre terreno explorado**: trabajador físico, gasto de alimentos/agua y registro de las cotas. Cambiar el terreno invalida el estudio. Carreteras y ferrocarriles requieren trazado, estudio vigente, presupuesto y construcción por tramos; ya no se colocan puentes o vías instantáneamente.
- **Puentes por carga y vida útil**: vigas, apoyos, luz, peso de vehículo+carga, flecha, tensión, suelo, exposición y fatiga. Acero/hormigón requieren ingeniería y minerales estudiados. Las uniones de los primeros puentes de madera sustituyen herrajes por madera. Condición, cierre, inspección y reparación conservando la capacidad nominal.
- **Vehículos propios**: caballos, carretas, camiones, trenes, cargueros, hidroalas y aeronaves. Redes continuas y terminales compatibles; carga real, consumo por salida, entrega y regreso. Una vía rota o un puente cerrado detiene el convoy. La destrucción pierde vehículo y carga; no aparece un reemplazo gratuito.
- **Rutas entre islas con carguero propio**, terminal estudiada y conexiones ya recorridas. Ida, descarga y vuelta, con daño por catástrofes. Las rutas antiguas completan su carga pendiente y esperan ser reemplazadas por vehículos propios.
- **Defensas estudiadas y abastecidas**: guarnición, provisiones/munición, línea de visión y objetivos terrestres/navales/aéreos; sensores para antiaéreas y energía para escudos. Se conservan las torres de partidas anteriores bajo sus reglas originales.
- **12 visitantes NPC** junto a sus instalaciones: peticiones, pago en áureos, moralidad y tiempo de espera. Acoger refugiados añade colonos si hay capacidad. Graneros, refugios, archivo, faros, sensores, señales, depósitos de combustible y servicios tienen efectos jugables.

Se conservan semilla, terreno, unidades e inventarios de partidas anteriores. Los seis nuevos bienes empiezan en cero; no se regalan recursos por migrar. La simulación de transporte e ingeniería sigue siendo un modelo de juego: no calcula tráfico urbano completo, navegación hidrodinámica, viento o estructuras reales. Los corredores locales se estudian hasta 180 casillas por tramo; la red puede construirse en varios tramos. Los mapas inactivos resumen trabajo y reservas cada 30 segundos; el cierre del juego detiene el reloj.

## Alpha 0.9: un estándar antes de ampliar el mundo

- [Libro de diseño 3D](https://oscard0823.github.io/auralis-frontier/codex.html): análisis acumulativo de Clash of Clans, Cities: Skylines, Social Wars y Age of Empires; [estándar completo](DESIGN-STANDARD.md) con auditoría de los doce atlas y contratos visuales/funcionales.
- **64 edificios**: 23 de campaña y 41 planos de expansión. **33 tropas y transportes**, 12 roles NPC y seis pueblos, cada uno con función, acceso y origen definidos. Los planos todavía no añaden mecánicas a la partida.
- Diez modelos por activo, selector de 40 eras, ocho lenguajes arquitectónicos, giro, buscador y exportación PNG. Los módulos se comparten entre eras; no son 400 esculturas únicas por edificio.
- Progresión estructural de los edificios existentes: accesos, apoyos, pórticos, módulos funcionales y refuerzos. Las miniaturas respetan nivel y familia de era. La ficha de mejora compara visualmente el modelo actual y el siguiente.
- **Laboratorio independiente de ingeniería**: caballos, carretas, camiones, trenes, barcos y aviones; excavación, firme y material aprovechable; puentes por luz, sección, carga, apoyos, suelo, tráfico y exposición; estudio de defensas. Sus cálculos no construyen ni gastan recursos de campaña.
- Dos láminas originales de dirección artística; prompts y procedencia en [ARTWORK-STANDARD.md](ARTWORK-STANDARD.md). El paquete de diseño exporta 115 láminas y 1150 imágenes individuales en una era representativa por activo.

Las partidas y las reglas económicas de campaña se conservan. Ingeniería, edificios de expansión, nuevos roles NPC y grados de equipo están identificados como diseños o laboratorio, a la espera de su integración jugable.

## Alpha 0.8: el mapa primero

- **Interfaz contextual**: cinco accesos principales; gestión, cámara, catálogo e inspector se despliegan cuando hacen falta. Menús adaptados a móvil, con edificios y tropas filtrados por categoría y era.
- **Construcción con vista previa 3D**, posición arrastrable, giro de 90°, presupuesto y confirmación. La previsualización y su cancelación no gastan materiales. Las obras aparecen sobre su huella real con cimientos y andamios.
- **Mejoras desde el edificio o el catálogo**, con modelo central, diez niveles, prestaciones actuales y siguientes, materiales pendientes y acción principal única.
- **Caminos conectados** con distinto ancho y acabado, rectas, curvas, puentes y presupuesto previo. Conservan el trabajo por tramos de los colonos.
- **Ejército con destinos individuales en línea, columna, bloque o dispersión**, rutas diagonales que respetan esquinas y desniveles, separación entre unidades, comportamiento defensivo/ofensivo/pasivo y puntos de reunión para nuevos reclutas. Selección por área disponible también con el dedo.

Se conservan las partidas anteriores. El movimiento usa rutas locales acotadas; las formaciones asignan destinos y no simulan un frente rígido durante toda la marcha. Diseño, referencias y controles: [DESIGN-UI.md](DESIGN-UI.md).

## Alpha 0.7: mundo 3D y una economía visible

- Escenario en **3D real con WebGL 2**: edificios, naturaleza, colonos, ejército, barcos y vehículos hechos con geometría original. Cámara giratoria e inclinación, iluminación común, sombras y texturas de materiales coherentes.
- Personajes articulados: caminan, trabajan, giran y llevan una carga visible; caballería, ruedas, hélices, molinos y barcos animados. Las miniaturas muestran los modelos que aparecen en el mapa.
- **Recolectar → cargar → transportar → entregar**. Capacidad de diez unidades, entrega parcial, destinos según el recurso y punto de desembarco gratuito para comenzar con cero inventario. Las bajas pierden la carga.
- Estado de trabajo con fase, carga y destino; oficios rápidos; mejoras con existencias, coste y déficit, más ayuda para conseguir o estudiar cada material.
- Dibujo limitado a la cámara, primitivas agrupadas en instancias y archivos 3D incluidos para jugar sin conexión. Se conservan las partidas. Si WebGL 2 no está disponible, se activa una vista 2D identificada como compatible.

El estilo es 3D estilizado. El catálogo tiene variantes históricas, industriales y avanzadas, sin un modelo exclusivo para cada nivel de cada era. Las capas del subsuelo siguen separadas. Arquitectura, límites y fuentes: [DESIGN-3D.md](DESIGN-3D.md).

## Alpha 0.6: un pueblo que se convierte en imperio

- **40 eras ampliables y 10 niveles por era**, desde un colono hasta tecnología cósmica. Los edificios tienen un nivel y un plano tecnológico: adaptar barrios antiguos cambia sus prestaciones y su aspecto.
- **Mejoras con constructor y minerales estudiados**. Comparación de prestaciones, precio y tiempo en una ficha de pergamino; menús de gobierno con madera y bronce. Completar capital y edificios al máximo da un 50% de descuento sobre el coste base de avance. Adelantar la era cuesta 12 veces el precio base y tarda el doble.
- **Comida, agua y bienestar para toda la población**, manantial inicial, pozos, cisternas, plantas de agua, granjas e invernaderos con operarios. Carencias prolongadas dañan a los habitantes. Industria con balance eléctrico; centrales mejorables y fusión.
- **Oficios continuos para colonos**, sin retirar el control manual: recolectores, aguadores, agricultores, operarios y mineros de galerías. Provisiones físicas en los barcos para abastecer expediciones y nuevas colonias.
- **15 materiales estudiables en tres fases**, con muestras reales de las excavaciones. Los análisis revelan usos, mejoran extracción y abaratan mejoras.
- **Seis pueblos**, cinco desbloqueados mediante contactos raros o misiones de exploración, minería, alianzas y ciencia. Selección de pueblo al reclutar, con capacidades y necesidades diferentes.
- **Moralidad de −100 a +100**, reputación, políticas de racionamiento, jornada y conservación; refugiados, caravanas, restauración, guerra, integración y saqueo con consecuencias persistentes.
- **Caminos propios rectos o curvos**, presupuesto previo, puentes, tres grados de vía y construcción por tramos. Cancelar recupera los materiales sin utilizar.
- **23 edificios y 19 unidades**. Guardianes energéticos, mecas, tejedores cuánticos, naves y leviatanes complementan al ejército anterior. Las incursiones NPC también progresan y gastan sus reservas.

Las partidas de Horizontes 0.4–0.5 se migran conservando el mundo y el progreso. La campaña clásica sigue separada. Las reglas y sus límites están en [DESIGN-CIVILIZATION.md](DESIGN-CIVILIZATION.md); el nuevo atlas original y su prompt, en [ARTWORK-v6.md](ARTWORK-v6.md).

## Alpha 0.5: arte de la civilización

Horizontes incorpora cinco atlas originales: edificios de piedra y madera con tejados de paja y pizarra; colonos, lanceros, arqueras y caballería con poses de trabajo y movimiento; árboles, rocas y recursos; barcos, trenes y aviones; y materiales de terreno. El suelo usa texturas continuas ancladas al mundo, con caminos conectados, agua, costas, sombras de contacto y niebla suavizada. Los desniveles conservan sus paredes de roca, sin bordes de cubo alrededor de cada casilla plana.

Los edificios se pueden seleccionar también sobre su tejado visible. El recorte y las máscaras de selección de los sprites se calculan antes de publicar, sin leer píxeles de los atlas durante la partida. Los recursos gráficos se incluyen en web, Android y Windows y se guardan para jugar sin conexión. Se conserva el formato de las partidas de Horizontes 0.4. El arte y los prompts completos están en [ARTWORK-v5.md](ARTWORK-v5.md).

## Alpha 0.4: campaña de Horizontes

La nueva campaña comienza con **un colono, cero recursos, cero áureos, ningún edificio y ningún soldado**. La dificultad es máxima y las bajas son permanentes. La campaña clásica conserva su guardado y se puede abrir desde Ajustes o [classic.html](https://oscard0823.github.io/auralis-frontier/classic.html).

- Isla natal de **8192 × 8192 casillas** (67.108.864 posiciones virtuales). Otras islas de 2048 o 8192 casillas y océanos de 8192. Bosques, ríos, cordilleras, acantilados, costas, relieve volcánico y seis biomas.
- Generación determinista por sectores de 32 × 32, caché de hasta 64 sectores de terreno por mapa, dibujo limitado a la cámara y un margen. El terreno generado se descarta; las modificaciones permanecen. La escala en casillas es de diseño, sin equivalencia oficial con GTA V o kilómetros reales.
- Niebla persistente y visión actual, más reducida durante la noche. Los árboles y recursos son finitos; recolectarlos consume el nodo y permite despejar terreno.
- **Siete eras**: supervivencia, aldea de piedra, metalurgia, navegación, industria, era moderna y orbital. Cada avance consume materiales y tarda de 10 a 90 minutos de tiempo jugado. La extracción y el entrenamiento también llevan tiempo.
- **Dieciséis edificios funcionales**: campamento, vivienda, granja, mina, cuartel, mercado, torre, puerto, almacén, embajada, hospital, refinería, fábrica, central, aeródromo y observatorio. Construcción libre en suelo descubierto, despejado y llano; un colono debe trabajar en la obra.
- **Catorce tipos de unidad**, incluido el colono: lanceros, arqueros, caballería, bote, galera, carguero, fragata, infantería, jeep, tanque, lanzamisiles, helicóptero y dron. Las instalaciones y las eras desbloquean la producción. El hospital cura supervivientes; no resucita tropas.
- Control RTS con selección por recuadro, formaciones de línea/columna, avance y ataque, exploración automática, detención, grupos Ctrl + 1–9 y órdenes en cola con Shift. Movimiento terrestre, naval, aéreo y por galerías.
- Islas y océanos como **mapas independientes conectados por costas y puntos de desembarco**. Hay que descubrir una salida y acercar físicamente la flota. Las unidades terrestres embarcan y desembarcan. Cada costa de una isla puede conducir a otro océano con destinos distintos. La navegación de ida y vuelta conserva el estado.
- Civilizaciones NPC con reservas, defensores, nivel tecnológico, encargos remunerados en áureos, confianza, alianzas y declaración de guerra. Las bases hostiles envían incursiones. Al conquistarlas, parte de sus reservas pasa a la colonia. Piratas en el océano.
- Caminos, puentes, murallas, elevación del terreno, vías y tuberías con costes materiales. Convoyes marítimos y aéreos entre instalaciones; tren entre mina y almacén sobre una vía continua. Transportan existencias reales y consumen alimentos o combustible. Romper la vía interrumpe el tren.
- **Cuarenta capas excavables**: pozos verticales y galerías laterales, descenso de colonos, colocación de bloques, entibados y escaleras. Geología por semilla: piedra, carbón, hierro, oro, cristal y petróleo. La profundidad depende de la era; el petróleo necesita refinería y tubería conectada.
- Ciclo de día y noche, ocho fases lunares y eventos con aviso: auroras, meteoritos, tormentas solares, terremotos, maremotos, tsunamis y tornados. Los eventos peligrosos dañan unidades y edificios; algunos modifican el terreno. La tormenta solar corta la energía industrial.
- IndexedDB, copia local de recuperación cuando cabe, exportación/importación JSON y archivos del juego disponibles sin conexión. Los mundos de web, Android y Windows son independientes hasta importar una copia.

## Alcance del motor actual

La vista principal es **3D con cámara ortográfica giratoria, modelos articulados y sombras**. La vista 2D se conserva para equipos sin WebGL 2 y para la campaña clásica. El subsuelo se muestra por capas independientes y contiene celdas modificables y unidades en su nivel; no se simulan excavación volumétrica continua, interiores transitables, fluidos, geología física real ni presión del petróleo.

El mapa activo tiene combate y trabajo detallados. Los mapas visitados e inactivos actualizan reservas, poder NPC, apoyo aliado e incursiones de forma resumida cada 30 segundos de tiempo jugado; no ejecutan todos sus soldados. El reloj de Horizontes se pausa al ocultar o cerrar el juego y durante diálogos. La campaña clásica conserva sus reglas de producción y hospital de versiones anteriores.

El generador `sectors-v1` está versionado. Se persisten semillas, cambios, exploración, excavaciones, unidades, construcciones, inventarios, relaciones y rutas. La búsqueda de caminos usa tramos locales acotados, con un máximo de dos búsquedas nuevas por paso; no reserva matrices del tamaño del mundo. El prototipo admite hasta 1000 mapas visitados, 2000 unidades por mapa y copias importadas de hasta 64 MB. El rendimiento depende del dispositivo y de la cantidad de objetos visibles.

No incluye cuentas, sincronización automática, multijugador ni servicios de IA externos. GitHub Pages aloja el juego estático. La IA se ejecuta en el dispositivo.

## Campaña clásica y compatibilidad

La campaña clásica amplía la base a 512 × 512 y las expediciones a 416 × 416, añade relieve, visión actual, niebla recordada, autoexploración y cuatro dificultades. Conserva las partidas 0.1–0.3 sin mover sus construcciones. Incluye los 17 edificios, 14 tropas militares y arcanas, 24 regiones, colonias, diplomacia, mejoras, reparación y las tres operaciones anteriores.

El guardado clásico usa su clave anterior. Horizontes tiene formato y almacenamiento separados; empezar la nueva campaña no borra la antigua. Las copias se importan en su campaña correspondiente.

## Ejecutar y comprobar

Requiere Node.js 22 o posterior.

```sh
npm ci
npm run dev
npm test
node scripts/qa-design.mjs
node scripts/export-design.mjs
node scripts/qa-clean-ui.mjs
node scripts/qa-3d-controls.mjs
node scripts/qa-3d.mjs
node scripts/qa-horizons.mjs
node scripts/capture-horizons.mjs
node scripts/qa-civilization.mjs
node scripts/qa-browser.mjs
node scripts/qa-expeditions.mjs
node scripts/qa-large-world.mjs
```

Abre http://127.0.0.1:4183/. `dist/` contiene la web completa, sin CDN ni compilación previa. Los scripts de navegador usan Playwright con Edge en el entorno de desarrollo. GitHub Actions publica `dist/` al enviar cambios a `main`.

Las pruebas comprueban recursos iniciales, consumo de nodos, obras, eras y sus tiempos, pérdidas permanentes, órdenes, puentes, 40 capas, petróleo, ida/vuelta entre mapas, persistencia, eventos, comercio, convoyes y ferrocarril interrumpido. Las pruebas de navegador ejercitan acciones reales, móvil, exportación, importación inválida y recarga sin conexión.

## Android y Windows

Android requiere JDK 21 y Android SDK 36. `npm run android:sync` copia `dist/` al proyecto nativo. Después ejecuta `android/gradlew assembleRelease`. Para firmar, define `AURALIS_KEYSTORE_FILE` y `AURALIS_KEY_PASSWORD`; alias `auralis-frontier`. Las credenciales se conservan fuera del repositorio.

`npm run desktop:build` genera el instalador Windows con Electron y el contenido incluido. Los nombres públicos de las descargas son estables:

- `Auralis-Frontier-Android.apk`
- `Auralis-Frontier-Windows-Setup.exe`
- `SHA256SUMS.txt`

Actualiza `versionCode` de Android con cada release. La aplicación Windows no cuenta con certificado de firma. Abre Ajustes → Exportar mundo para trasladar la partida a otro dispositivo.

Código, nombres e ilustraciones originales. No contiene gráficos extraídos de Social Wars, Age of Empires, Clash of Clans ni Minecraft. Los atlas están documentados en [ARTWORK.md](ARTWORK.md), [ARTWORK-v3.md](ARTWORK-v3.md) y [ARTWORK-v5.md](ARTWORK-v5.md). El dibujo de las primeras eras con código permanece como respaldo mientras cargan sus imágenes.
