# Estándar de Auralis Frontier · arquitectura, habitantes e infraestructura

Versión 1 · 19 de octubre de 2026. Este documento se define antes de ampliar el catálogo jugable. El [catálogo interactivo](https://oscard0823.github.io/auralis-frontier/codex.html) distingue contenido de campaña y planos de expansión. Un plano con modelo y función definida todavía no equivale a una mecánica implementada.

## 1. Análisis acumulativo de referencias

### Primera capa: Clash of Clans

La referencia útil es la relación entre una base compacta, edificios reconocibles y una selección que explica qué puede hacerse. Silueta, tejado, masa y objeto funcional permiten distinguir economía, alojamiento y defensa a distancia. La mejora debe cambiar la arquitectura de forma legible. El volumen se apoya en el césped; su huella lógica no necesita convertirse en una plataforma cuadrada visible. La organización de defensas, accesos y obstáculos convierte la posición en una decisión.

La [renovación oficial de la interfaz](https://supercell.com/en/games/clashofclans/blog/news/weve-revamped-the-clash-of-clans-user-interface/) concentra construcción y mejoras y reduce controles permanentes. Las [notas de defensas combinadas](https://supercell.com/en/games/clashofclans/blog/game-updates/building-merging-th16/) muestran que alcance y especialización cambian la utilidad de una defensa. No copiamos sus edificios, valores ni distribución exacta de botones.

**Reglas conservadas A1–A5:** función reconocible por silueta; huella estable entre niveles; mejora con transformación visible; anillo de alcance solo durante selección/colocación; ficha contextual con modelo, antes/después, materiales, tiempo y una acción principal.

### Segunda capa: Cities: Skylines, sin retirar A1–A5

Las [herramientas oficiales de vías](https://www.paradoxinteractive.com/games/cities-skylines-ii/features/road-tools) relacionan trazado y relieve. El [sistema de carga](https://www.paradoxinteractive.com/games/cities-skylines-ii/features/public-cargo-transportation) relaciona terminales, redes y líneas; los modos tienen requisitos diferentes. De aquí se toma la necesidad de accesos, espacios de operación y conexiones entre servicios. Una mina sin salida logística no debe abastecer mágicamente una capital lejana.

**Se añaden B1–B5:** puerta o muelle y punto de entrega explícitos; entradas y salidas de producción; capa de redes opcional; presupuesto por longitud, relieve y estructura; mantenimiento, capacidad y congestión como propiedades de diseño. Los estudios geotécnicos y el modelo de fatiga que se describen abajo son propuestas propias de Auralis, no afirmaciones sobre Cities.

### Tercera capa: Social Wars, sin retirar A ni B

La documentación histórica conservada describe una ciudad militar, instalaciones de entrenamiento, vehículos y defensas. Su página original ya no ofrece un manual técnico verificable. Se consultaron el [registro y presskit de DeVuego](https://www.devuego.es/presskit/social-wars) y la [descripción histórica archivada por Gamepressure](https://www.gamepressure.com/games/social-wars/z134ee). Esta última es una fuente secundaria; sus detalles no se presentan como reglas oficiales actuales. No se pudo verificar una tabla completa original de niveles.

**Se añaden C1–C5:** cuartel, establo, fábrica, hangar y astillero con funciones distintas; munición/energía y suministros visibles en el diseño; vehículos con volumen y articulaciones propios; defensas especializadas por blanco; enclaves enemigos con economía y logística. La progresión militar acompaña a la civilización, sin convertir una casa en una fábrica por un cambio de color.

### Cuarta capa: Age of Empires, conservando las tres anteriores

La [guía oficial de recursos y controles](https://www.ageofempires.com/learn-to-play/control-resources-aoe2/) conecta aldeanos, órdenes, puntos de entrega y una interfaz de selección. La [guía oficial de inicio de AoE IV](https://www.ageofempires.com/news/quickstart-guide-age-of-empires-iv/) sitúa población y economía junto al desarrollo militar. Se adopta la interacción física: el trabajador llega, trabaja, carga y entrega; el ejército recibe órdenes sobre el terreno.

**Se añaden D1–D5:** espacio transitable alrededor de las entradas; animación según tarea; selección, cola y reunión; roles y contramedidas; edificios útiles para la economía y el combate. Auralis conserva control directo RTS; no adopta exclusivamente el despliegue inicial de tropas de Clash.

### Interacción entre jugador, edificios, tropas y terreno

| Referencia | Decisión del jugador | Edificio y habitantes | Relación con el entorno | Aplicación acumulativa |
|---|---|---|---|---|
| Clash | Ordenar una base compacta, seleccionar y mejorar; en combate importa dónde desplegar | Defensas y objetivos tienen papeles distintos; muros y alcance influyen en el ataque | Cada pieza conserva una silueta y una huella fáciles de leer | Alcance y accesos visibles al seleccionar; mejoras visuales claras; Auralis añade control directo del ejército |
| Cities | Trazar redes y situar servicios con accesos útiles | Personas y vehículos dependen de destinos, terminales y conexiones; no es una referencia de control militar RTS | Relieve, costa, carretera y espacio de operación condicionan la ciudad | Separar entrada pública, carga y mantenimiento; mostrar por qué una instalación no recibe suministros |
| Social Wars | Las capturas históricas muestran selección de instalaciones, ejército y misiones | Se reconocen centros de mando, cuarteles, vehículos, hangares y robots | Base militar sobre un campo legible, con cultivos, muros e instalaciones diferenciadas | Mantener especialización militar y encargos, retirando la acumulación de banners de la interfaz |
| Age of Empires | Seleccionar unidades, asignar tareas, dirigir ejércitos y desarrollar economía | Los aldeanos llegan al trabajo y depositan recursos; instalaciones y centro urbano tienen papeles propios | La distancia entre nodo, entrega, acceso y peligro importa | Una entrada transitable y un punto de trabajo por edificio; equipo y animación explican la acción |

Para Social Wars se contrastaron también [capturas conservadas por jugadores](https://eujogosocialwars.blogspot.com/2013/02/fotos.html) y la [colección histórica de IGDB](https://www.igdb.com/games/social-wars). Las capturas son evidencia visual; no permiten reconstruir con certeza todos los algoritmos de selección, combate o costes originales. Esas partes del estándar son decisiones propias.

### Qué se conserva de los menús de cada referencia

Clash aporta la ficha de mejora y el catálogo contextual. Cities aporta filtros y capas de redes bajo demanda. Social Wars aporta la misión con objetivo, avance y recompensa, sin trasladar su franja de amigos ni banners permanentes. Age of Empires aporta selección, comandos y datos de economía visibles mientras se juega. El menú de Auralis usa esos papeles dentro de una sola paleta y jerarquía; no mezcla cuatro estilos de botones en una misma pantalla.

## 2. Dirección artística común

3D estilizado de detalle medio: volúmenes sólidos, bordes suaves, materiales mates, proporciones creíbles y formas algo simplificadas para leerlas en móvil. Sin apariencia fotográfica ni plástico brillante. Cámara ortográfica giratoria; la misma luz, escala y materiales en personajes y edificios.

- Una casilla es una unidad de juego, sin equivalencia universal con metros. El laboratorio de ingeniería usa metros y toneladas explícitos en escenarios separados.
- Una persona mide aproximadamente 0,95–1,10 unidades. Una puerta legible mide 1,1; una vivienda tiene una cubierta dominante y una entrada despejada. Los tamaños de juego tienen prioridad sobre la escala documental.
- Paleta: tierra, madera cálida, piedra marfil, pizarra, vegetación apagada y azul mineral. El color de facción ocupa banderas, tela y piezas pequeñas; no tiñe todas las paredes.
- El suelo llega al edificio. Zócalo bajo, manchas de tierra, vegetación y pequeños objetos unen ambas superficies. No usar pedestales gruesos universales ni bordes negros.
- Distinción por función: hogar = cubierta y chimenea; almacén = portón y carga; ciencia = instrumentos; defensa = estructura de tiro; energía = máquina y conductos; agua = depósito; transporte = plataforma y acceso.
- La fachada de operación tiene puerta, zona de carga o servicio. La huella de colisión no cambia al mejorar y los adornos no bloquean caminos invisiblemente.
- Estados obligatorios: plano, construcción, activo, sin personal, sin insumos, dañado y destruido. La actividad se muestra con herramienta, rotor, carga, agua o luz discreta; sin monedas flotando continuamente.

## 3. Auditoría del arte existente

Se inspeccionaron los doce PNG de `dist/assets/art/`, el constructor `models-3d.js` y capturas reales del mundo 0.8. Los PNG anteriores se preservan para la campaña clásica y la vista compatible.

| Activo | Hallazgo | Decisión del estándar |
|---|---|---|
| buildings.png | Fantasía muy saturada y ornamento dominante | Conservar archivo; evitar su paleta en la nueva arquitectura |
| troops.png | Personajes caricaturescos y magia intensa | Conservar poses como referencia de lectura, moderar volumen y brillo |
| military-buildings-v3.png | Roles militares legibles, bases rígidas | Retener antenas, hangares y armas; integrar cimientos y acceso al suelo |
| military-troops-v3.png | Buenas diferencias entre infantería, jeep y misil | Mantener variedad de tamaño y animaciones; unificar materiales |
| historical-troops-v3.png | Armas y poses reconocibles | Llevar herramientas, alcance y postura al modelo articulado |
| shipyard-v3.png | Astillero con maquinaria e intercambio tierra/agua | Separar grada, almacenamiento y atraque en su función futura |
| settlements-v5.png | Madera y piedra coherentes, exceso de microdetalle | Retener masas, cubiertas, patios; simplificar detalles pequeños |
| people-v5.png | Buen ciclo de caminar/trabajar y escala humana | Referencia de tarea visible, sin sustituir geometría por imágenes |
| nature-v5.png | Árboles y minerales variados | Unificar rugosidad, iluminación y contacto con el terreno |
| terrain-v5.png | Materiales útiles, resolución desigual | Evitar ruido repetido y costuras; geometría manda en el relieve |
| transport-v5.png | Barcos, tren y avión de siluetas distintas | Usar progresión de capacidad y terminal compatible |
| civic-buildings-v6.png | Agua, ciencia y futuro coherentes | Integrar con el entorno y reducir detalles que desaparecen en móvil |

El modelo 0.8 repite la vivienda como base de varios servicios y diferencia niveles principalmente con pequeñas piedras. El estándar exige que se reconozcan servicio y nivel por cambios constructivos, no solo por adornos.

## 4. Contrato de cada edificio y diez niveles

Cada ficha debe incluir: identificador estable, estado de implementación, familia, función, insumos, resultado, personal, acceso, era de apertura, huella, punto de trabajo, volumen de selección, alcance si procede, riesgos, mantenimiento y diez perfiles visuales. Los nuevos planos del catálogo detallan estos campos. Los identificadores guardados nunca dependen del nombre traducido.

| Nivel | Cambio constructivo común | Lectura funcional |
|---|---|---|
| 1 | Núcleo mínimo, estructura ligera | Función reconocible con un equipo básico |
| 2 | Acceso, escalón o rampa y suministro de campo | Ya puede operar y recibir materiales |
| 3 | Zócalo y apoyos reforzados | Mayor estabilidad sin aumentar la huella |
| 4 | Pórtico, bahía o recinto de trabajo | Separación entre entrada y operación |
| 5 | Primer módulo especializado visible | Mejor herramienta, depósito o puesto de tiro |
| 6 | Segunda instalación de servicio | Redundancia y mayor capacidad |
| 7 | Refuerzos y conexión externa legible | Operación sostenida y mantenimiento |
| 8 | Equipo avanzado según su función | Mejor alcance, precisión o rendimiento |
| 9 | Protección, almacenamiento y automatización | Preparación para condiciones difíciles |
| 10 | Conjunto completo y emblema sobrio | Máximo de la era, silueta culminada |

El nivel se combina con la era; no la reemplaza. Las 40 eras conservan sus reglas y se agrupan en ocho lenguajes constructivos: campamento, aldea, ciudad amurallada, navegación, industria, modernidad, espacio y materia avanzada. Cada era mantiene su nombre y materiales habilitados. Se comparten módulos entre eras; no se prometen 400 esculturas artesanales exclusivas por edificio.

El visor permite elegir cualquiera de las 40 eras y ver diez modelos por edificio, girarlos, comparar su función y exportar una lámina PNG. Las imágenes de referencia de imagegen son dirección artística; el visor muestra la geometría que realmente se ha programado.

## 5. Tropas, civiles, NPC y civilizaciones ocultas

Cada unidad tiene papel, equipo, masa de juego, terreno admisible, capacidad de carga, coste de suministro, instalación de origen y contramedida. Los diez grados visuales representan equipo/formación dentro de la era, no diez resurrecciones. Las bajas son permanentes. En la campaña actual la experiencia individual no sube automáticamente esos grados.

Animaciones mínimas: espera, desplazamiento, giro, trabajo/carga, ataque, daño y caída; vehículos añaden ruedas/orugas/rotor; barcos, balance y propulsión. Los diez grados de equipo conservan la silueta y cambian mochila, protección, escudo, arma o sensor. Un civil no lleva un arma militar para parecer mejorado.

NPC propuestos: topógrafo, agrimensor, geólogo, ingeniero, constructor, comerciante, transportista, médico, refugiado, diplomático, explorador y guardián. Deben tener lugar de origen, tarea, petición, recompensa y consecuencia de moralidad. Una petición exige bienes entregados, nunca resta recursos que todavía lleva un colono.

Los seis pueblos existentes conservan sus condiciones de contacto. Humanos: madera y piedra; Verdantes: pabellones vivos sin talar el bosque sagrado; Pétreos: bóvedas y contrafuertes integrados en roca; Mareanos: plataformas costeras, cerámica y velas; Sintéticos: módulos de metal mate y talleres; Astrales: arcos minerales y energía contenida. Cada uno recibe variantes de asentamiento, civiles, defensa, transporte y misión. La diferencia no se limita a recolorear uniformes. El catálogo avisa de revelaciones sobre pueblos ocultos.

## 6. Redes para unir ciudad y extracción

| Modo | Infraestructura previa | Estudio | Consumo y límite |
|---|---|---|---|
| Caballo de carga | Establo y puntos de intercambio; sin carretera obligatoria | Reconocimiento del itinerario | Alimento/agua; carga pequeña, pendiente y agua limitan el paso |
| Carreta | Camino continuo y posta | Topografía, pendiente y vados | Alimento; ancho, firme y capacidad del puente |
| Camión | Carretera y terminal de carga | Terraplén, drenaje y capacidad portante | Combustible/energía; carga por eje y congestión |
| Tren | Vía continua, estación y patio | Pendiente, curvas, explanación y puentes | Energía; gálibo, carga y señalización |
| Barco | Astillero, puerto y corredor marítimo trazado | Profundidad, costa, corriente y clima | Provisiones/combustible; calado y atraque |
| Avión | Pista, terminal y corredor aéreo | Relieve, aproximación, viento y obstáculos | Combustible/energía; pista y carga útil |

Un corredor marítimo o aéreo es un camino navegable estudiado, no una carretera sobre el océano o en el cielo. Un transbordo necesita terminal y almacén; la carga llega al destino solo al completar el viaje. El laboratorio calcula requisitos y presupuestos; los convoyes de campaña 0.8 conservan sus reglas hasta integrar la nueva ingeniería.

## 7. Estudios, presupuesto, puentes y defensas

Secuencia: explorar → delimitar corredor o emplazamiento → levantar estudio → elegir estándar de carga y vida útil → comparar alternativas → reservar materiales → construir por tramos → inspeccionar → mantener. No revelar geología ni zonas bajo niebla por abrir un menú.

El estudio propuesto registra semilla y revisión del terreno, puntos muestreados, pendiente máxima, suelo, agua, riesgos, material disponible, distancia, incertidumbre, validez y equipo responsable. Una modificación de relieve invalida la zona afectada. La primera prospección debe poder hacerse con herramientas manuales: no requiere un centro de ingeniería para construir el propio centro.

Presupuesto = firme + estructuras + movimiento de tierras + cimentación + drenaje + terminales + reserva de riesgo. La extracción local reduce compras, pero necesita trabajo y transporte reales. El informe separa volumen excavado aprovechable, material descartado y material a traer; no genera inventario al pulsar Calcular.

Para un puente, el laboratorio usa una viga equivalente simplemente apoyada: M = q·L²/8 + P·L/4; tensión = M/Z; flecha = 5qL⁴/(384EI) + PL³/(48EI). Se declaran unidades, sección, luz, número de vigas, peso propio, vehículo+carga, factor dinámico y margen. La vida estimada usa una curva de fatiga simplificada con clima, tráfico diario e inspección; es un modelo de equilibrio del juego, no una certificación de ingeniería. Mostrar qué condición falla antes de permitir el plano.

Soportes múltiples reducen la luz, pero cada pila tiene coste y necesita lecho apto; no se eliminan las cimentaciones por aumentar el número de apoyos. Vida deseada y tráfico no son el mismo campo. Inspección y reparación recuperan condición; una reparación no aumenta automáticamente el límite de carga. Las catástrofes pueden cerrar la estructura y requerir un estudio nuevo.

Una defensa necesita visibilidad, campo de tiro, suelo, distancia de seguridad, suministro, operador y acceso de mantenimiento. Torres tempranas consumen provisiones; armas industriales requieren munición y sensores; defensas energéticas, energía y refrigeración. El informe explica sectores ciegos y contramedidas. El laboratorio permite comparar emplazamientos; en campaña la torre actual aún usa sus reglas 0.8.

## 8. Interfaz común

Conservar el mapa libre y cinco accesos principales. Construir muestra categorías y buscador; cada tarjeta comunica función, apertura y coste. Seleccionar abre solo la ficha correspondiente. Mejorar presenta modelo actual y siguiente, cambio de capacidad, materiales, constructor y tiempo. Al diseñar una red, mostrar un resumen de longitud, pendientes, estructuras, capacidad, presupuesto y riesgos, con detalles desplegables.

Evitar una imitación literal de cuatro interfaces distintas: el estándar reúne sus patrones en un único sistema visual. Tipografía sobria, panel oscuro mate para gestión y ficha clara para mejoras. Iconos acompañados de etiquetas; objetivos de toque de al menos 44 px en los controles nuevos. Sin ventanas apiladas, tablas permanentes ni alertas repetidas. El catálogo de diseño no sustituye el menú de la partida y no modifica sus recursos.

## 9. Aceptación y alcance

Un activo se acepta si se entiende a escala de móvil, tiene entrada y huella coherentes, distingue sus diez niveles, conserva identidad al girar, comparte iluminación con el terreno y expone su utilidad. La captura del visor y el modelo deben corresponder al mismo identificador, era y nivel. La generación de láminas debe producir una imagen por edificio con los diez niveles, con un manifiesto de cobertura.

El catálogo diferencia explícitamente: **Campaña** (reglas actuales), **Plano** (función y modelo de expansión), **Laboratorio** (cálculos ejecutables sin construir). No se presentarán las futuras cadenas económicas, nuevos puestos NPC o ingeniería de carga como sistemas ya activos. El despliegue de arte no debe borrar partidas ni cambiar costes silenciosamente. Los atlas viejos se mantienen para compatibilidad.
