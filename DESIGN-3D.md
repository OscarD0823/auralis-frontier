# Auralis Frontier 0.7 — mundo 3D y transporte de recursos

La campaña Horizontes usa Three.js 0.186.1 / WebGL 2 con una cámara ortográfica que puede girarse y cambiar de inclinación. El mundo contiene geometría tridimensional original: fachadas, cubiertas, pozos, árboles, barcos, vehículos, personajes y equipo. Los atlas anteriores se conservan para la campaña clásica y la vista compatible cuando WebGL 2 no está disponible. La interfaz indica qué renderizador está activo.

## Modelos, materiales y animación

`dist/models-3d.js` define 23 tipos de edificio y 19 tipos de unidad mediante geometrías compartidas. Los personajes tienen articulaciones independientes en brazos y piernas, orientación al desplazarse, herramientas de trabajo y una carga visible. La caballería anima las patas; los vehículos, las ruedas; los helicópteros, el rotor; los barcos oscilan sobre el agua. Los molinos y núcleos tienen componentes giratorios. Las mejoras y los planos históricos, industriales y avanzados modifican detalles y materiales. No hay un modelo diferente para cada uno de los 400 niveles posibles.

El terreno, los edificios y las unidades comparten materiales rugosos, una paleta coherente, iluminación direccional, luz ambiental y sombras. Las texturas pequeñas se generan con código y se incluyen en la memoria local del renderizador. Las miniaturas se dibujan desde los mismos modelos del mundo. El estilo es 3D estilizado; no pretende ser fotorrealista.

## Límites de rendimiento

El mapa sigue siendo procedural por sectores de 32 × 32 con un LRU de 64 sectores. El renderizador recorre la ventana de cámara con margen y un límite de 181 × 181 casillas; nunca crea geometría para los 67 millones de posiciones del mapa. Las geometrías y materiales repetidos se agrupan con `InstancedMesh`. El suelo se reconstruye al cambiar su ventana, edición, exploración o estado relevante; los personajes se animan sin regenerar el mundo completo. La resolución interna se limita según el tamaño de pantalla. La caché de modelos está acotada y los objetos de otras islas dejan de dibujarse.

La selección de edificios y unidades usa intersecciones de rayos con su volumen; el terreno se resuelve contra sus alturas. El minimapa, las órdenes RTS, el trazado de caminos, el zoom y el control táctil usan la misma proyección. Q/E giran la cámara, y los botones ↶ / ↷ permiten hacerlo en pantallas táctiles.

El subsuelo sigue teniendo 40 capas separadas. No se ha convertido en excavación volumétrica continua, simulación de fluidos ni interiores transitables. El rendimiento y las sombras dependen de la GPU. WebGL 2 ausente activa automáticamente el renderizador 2D anterior, conservando las reglas y las partidas.

## Recolección y entrega

Inspiración funcional: la [guía oficial de Age of Empires](https://www.ageofempires.com/learn-to-play/controlling-your-empire-gathering-resources-xbox/) describe aldeanos, recursos y puntos de entrega por categoría. Auralis adapta ese ciclo a su propio mundo y sus reglas.

1. Un colono alcanza un nodo y extrae cantidades finitas; el manantial es renovable.
2. Guarda lo extraído en su carga, con capacidad de diez unidades. La carga no forma parte del inventario gastable.
3. Vuelve a entregar cuando se llena o se agota el nodo. También puede ordenarse una entrega parcial.
4. Solo al alcanzar el destino pasan los materiales al inventario. La recolección continúa después; al agotarse un nodo se ejecuta la siguiente orden de la cola. Los oficios continuos buscan otro nodo conocido.

El punto inicial de desembarco es gratuito y está vacío: resuelve el inicio sin recursos ni edificios. Campamentos y almacenes reciben todas las categorías. Granjas reciben alimentos; minas, minerales; pozos, cisternas y plantas de agua, agua. Se usa la instalación válida más cercana; si no existe ninguna, la isla permite un punto de entrega de campo. Los destinos dañados o incompletos no reciben recursos. Las órdenes interrumpidas conservan la carga; las bajas la pierden. No se transfieren automáticamente las cargas parciales al agotarse un nodo.

El estado de trabajo muestra la fase, carga, capacidad y destino. Los botones de oficio permiten asignar madera, piedra, alimentos o agua. Las mejoras presentan almacén, coste y déficit por material, con ayuda sobre cómo conseguirlo o estudiarlo. La producción de instalaciones con operarios, la excavación profunda y el transporte entre islas conservan sus reglas específicas.

## Compatibilidad y comprobaciones

Se conserva `auralis-world-v1`, las semillas, las construcciones y los guardados 0.4–0.6. Los campos nuevos de carga y punto de entrega se validan al importar; un mundo anterior obtiene un punto vacío cuando lo necesita. La campaña clásica conserva su almacenamiento independiente.

Las pruebas cubren entrega física antes de gastar, agotamiento con carga parcial, cola de órdenes, guardado durante el regreso, destinos por categoría, destrucción de instalaciones, bajas, cargas inválidas, proyección de ocho ángulos, selección por rayos, articulaciones, los catálogos de edificios/tropas, móvil, capas, límites de sectores y funcionamiento sin conexión. Three.js se distribuye localmente junto con su licencia MIT; no se solicita una CDN durante el juego.
