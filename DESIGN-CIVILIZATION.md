# Civilización, economía y progresión · 0.6

## Catálogo ampliable

`dist/civilization-data.js` contiene 40 eras y `LEVELS_PER_ERA = 10`. La capital tiene diez niveles en cada era. Los edificios mantienen por separado su plano tecnológico (`tier`) y su nivel (1–10). Un plano antiguo sigue funcionando después de un avance; adaptarlo a la era actual requiere materiales y un constructor, y empieza en nivel 1. Añadir un nombre a `AGE_NAMES` añade una era con costes, tiempo, profundidad y dominio calculados; las instalaciones y tropas pueden declararse con su índice de era.

El catálogo transcurre por agricultura, metales, imperios, navegación, industria, electricidad, era digital, robótica, fusión, colonias espaciales, materia programable y tecnología cósmica. Hay 23 edificios y 19 unidades. Los nuevos guardianes, mecas, tejedores cuánticos, naves y leviatanes complementan las tropas históricas y militares anteriores. Las incursiones NPC también progresan tecnológicamente y pagan su entrenamiento con sus reservas.

## Mejoras y avance

Una mejora reserva sus materiales al iniciarse. Un colono debe acudir y trabajar; retirarlo pausa la obra. Un constructor muerto se puede reemplazar. El edificio presta servicio durante la mejora. La capital actualiza el nivel del imperio al completar su mejora.

La ruta completa requiere capital de nivel 10, todos los tipos de edificio disponibles construidos, todas sus instancias vivas al nivel 10 de la era actual, mineral aplicado estudiado y obras acabadas. Cuesta el 50% del coste base de la siguiente era. La ruta anticipada permite omitir ese desarrollo, cuesta 12 veces el precio base (24 veces la ruta completa) y tarda el doble. Ambas requieren conocimiento del mineral de la siguiente era y recursos del mapa actual. El reloj se pausa al cerrar, ocultar el juego o abrir un diálogo.

Los niveles mejoran prestaciones reales: población en viviendas; velocidad de entrenamiento y calidad de las nuevas tropas; rendimiento agrícola e hídrico; investigación; excavación; defensa; curación; comercio; diplomacia; carga ferroviaria; ahorro de agua y generación eléctrica. Las industrias solo funcionan cuando hay capacidad eléctrica suficiente. El carbón alimenta las centrales; la fusión estudiada permite generar sin carbón y resistir tormentas solares.

El detalle de coste, tiempo, constructor y comparación de prestaciones se inspira en la presentación de mejoras de estrategia de bases; véanse los [ejemplos oficiales de costes y tiempos de Supercell](https://supercell.com/en/games/clashofclans/blog/news/cost-and-time-reductions-december-2023/). Los números de Auralis son propios.

## Alimentos, agua y oficios

Los inventarios comienzan en cero. El colono tiene un margen biológico de hambre y sed; ese margen no añade recursos. Un manantial cercano permite recoger agua desde el principio. Todos los habitantes consumen alimento y agua; los pueblos especiales tienen necesidades diferentes. Las carencias prolongadas reducen bienestar y productividad y finalmente dañan la salud.

Hasta cuatro colonos pueden operar cada granja, pozo, invernadero o planta de agua. Las granjas consumen agua; las plantas avanzadas también requieren energía. Los recolectores asignados buscan nodos ya descubiertos en un radio de 24 casillas y llevan sus bolsas al campamento o almacén. Agotar un nodo provoca la búsqueda de otro. El trabajo manual tiene prioridad y sustituye la asignación continua. Los mineros automáticos requieren haber descendido por un pozo; excavan celdas reales adyacentes de la galería. Las búsquedas automáticas tienen un presupuesto de ocho colonos por lote.

El uso de trabajadores, tareas de recursos y puntos de entrega toma como referencia los [controles y la recolección descritos oficialmente para Age of Empires](https://www.ageofempires.com/learn-to-play/controlling-your-empire-gathering-resources-xbox/). La lógica de Auralis se ejecuta localmente.

Antes de navegar se pueden cargar hasta 100 alimentos y 100 de agua por barco junto a un puerto operativo. Se descuentan del inventario, permanecen en la bodega al cambiar de mapa, se consumen si faltan reservas locales y pueden desembarcarse en una playa descubierta. Perder el barco también pierde sus provisiones.

Los mapas inactivos agregan consumo, instalaciones ya atendidas y obras cuyos trabajadores ya están en posición cada 30 segundos. Sus unidades no recorren caminos en detalle. Los convoyes existentes siguen transportando existencias reales entre islas, con sus propias necesidades de combustible.

## Ciencia y minerales

Quince materiales tienen tres fases de estudio. Cada fase consume muestras, suministros y trabajo de un investigador. La primera revela aplicaciones y habilita las mejoras; la segunda aumenta la extracción; la tercera reduce un 10% el coste de mejoras que aplican ese mineral. El campamento admite los primeros análisis; la casa de estudios permite los avanzados. Las construcciones básicas pueden usar piedra antes de estudiarla; las mejoras y los materiales tecnológicos requieren conocimiento.

Las excavaciones conservan su material principal y sus celdas agotadas. Además pueden aportar cobre, estaño, sal, sílice, litio, titanio, uranio, iridio o éter mineral como muestras secundarias finitas, según profundidad y semilla. No se cambia el generador `sectors-v1` ni la geología primaria de los mundos antiguos. El petróleo conserva sus requisitos de refinería y tubería.

## Pueblos, moralidad y decisiones

Humanos disponibles desde el inicio; verdantes, pétreos, mareanos, sintéticos y astrales requieren pactos. Los contactos especiales son raros, deterministas y permanecen ocultos bajo la niebla. También se pueden obtener mediante misiones de exploración, excavación, ciencia, diplomacia y desarrollo, con requisitos de moralidad y provisiones. Desbloquear un pueblo permite elegirlo al reclutar y aplica sus modificadores reales; no entrega tropas gratis.

La moralidad va de −100 a +100. Ayudas, encargos, tratados, guerras, saqueos, integración y explotación forestal dejan consecuencias y un historial. Las políticas cambian consumo, bienestar, trabajo y contaminación. La reputación afecta al rendimiento, a las recompensas comerciales y a los pactos disponibles. Los dilemas de refugiados, caravanas y restauración tienen costes y recompensas diferentes y solo se resuelven una vez.

El movimiento y otras órdenes neutrales no se consideran actos morales por sí solos. Las consecuencias corresponden a decisiones de gobierno y a acciones que afectan a la población, los recursos o las relaciones.

## Caminos diseñados por el jugador

Rectas con dos puntos o arrastre; curvas cuadráticas con inicio, control y final. Hasta 180 casillas por tramo. El presupuesto comprueba niebla, recursos, edificios, pendientes, eras y cruces de agua antes de gastar nada. El constructor realiza cada casilla y se desplaza a la siguiente. Cancelar devuelve exclusivamente los materiales de la parte sin construir. Los cruces quedan conectados, el agua requiere puentes y los grados tierra, piedra y avenida tienen velocidad y anchura distintas.

La interacción se inspira en el diseño manual de redes descrito en las [herramientas de carreteras de Cities: Skylines II](https://www.paradoxinteractive.com/games/cities-skylines-ii/features/road-tools). Auralis conserva una cuadrícula lógica, caminos locales acotados y una vista isométrica 2D; no implementa el simulador de tráfico de ese juego.

## Guardados y arte

El mundo mantiene `auralis-world-v1`, con `rulesVersion: 2` para la nueva progresión. Los guardados 0.4–0.5 se migran una vez: sus siete eras se corresponden con los hitos del catálogo nuevo, las construcciones reciben su plano, y se conservan recursos, unidades, exploración, excavaciones y avances en curso. Las copias clásicas mantienen su formato separado. Los datos nuevos se validan en la importación.

El atlas adicional y su prompt están en [ARTWORK-v6.md](ARTWORK-v6.md). Se mantienen los atlas históricos y militares. El plano de cada edificio decide su representación histórica, industrial o futura. Las bases se integran mediante textura del suelo y sombras suaves; no se añaden caminos transitables automáticamente.
