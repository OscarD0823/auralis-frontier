# Mundo persistente de supervivencia y estrategia

Diseño consolidado el 18 de octubre de 2026 a partir de este chat y de la conversación pública [Mapa grande y rendimiento web](https://chatgpt.com/share/6ad57a96-61f4-83e9-82f9-fc19bb01fc85). El enlace compartido permitió recuperar el contenido que inicialmente faltaba en el conector.

La conversación evoluciona de una comparación de mapas grandes a un RTS individual, con mundos procedurales, islas y océanos independientes, persistencia y construcción libre. Su última propuesta recomienda un motor voxel 3D. Las tecnologías sugeridas por el asistente son propuestas de arquitectura, no componentes ya implementados.

## Reglas solicitadas

- Dificultad máxima; sin recursos, moneda, edificios ni ejército iniciales. Un colono civil explora, recolecta y funda la primera población.
- Bajas permanentes; progresión lenta por eras, hasta tecnología militar, aérea y espacial.
- Territorios enormes con viajes largos, montañas, acantilados, ríos, volcanes, aldeas y bases ricas y difíciles de conquistar.
- Construcción libre, tala y despeje. Caminos, puentes, vías, puertos, tuberías y aeródromos con utilidad logística.
- Al menos cuarenta capas de excavación, con túneles, materiales y equipamiento dependientes de la profundidad y la era.
- Océanos e islas como mapas independientes y permanentes. Se navega hasta descubrir tierra; otras costas abren océanos distintos con destinos propios.
- Convoyes visibles, comercio, alianzas, invasiones y civilizaciones que conservan su historia.
- Niebla persistente, visión actual, día/noche y fases lunares. Fenómenos espaciales, meteorológicos y sísmicos con efectos de juego.
- Carga por sectores y dibujo de la cámara. Simulación resumida en mapas inactivos; guardado por diferencias.

## Contratos implementados en 0.4

`sectors.js` identifica el terreno con semilla y versión de generador; una caché LRU de 64 sectores de 32 × 32 mantiene temporalmente las casillas generadas. Los cambios se conservan fuera de la caché. La niebla usa bitsets dispersos por sector y las excavaciones usan coordenadas x:y:profundidad.

`horizons.js` separa el reloj y la campaña del registro de mapas. Cada isla y océano conserva unidades, edificios, recursos consumidos, existencias, excavaciones, facciones y salidas. Las conexiones identifican la puerta de destino y son bidireccionales. Viajar exige una embarcación próxima; cambia el mapa activo y libera la caché del anterior. El estado serializado completo se escribe en una transacción de IndexedDB.

Los convoyes retiran carga real del origen, la mantienen en tránsito y la añaden al destino al terminar el viaje. Los trenes requieren continuidad de vía. La simulación inactiva avanza de forma agregada, sin ejecutar el combate de todos los mapas. Los temporizadores de juego no avanzan al cerrar la aplicación.

La superficie es de 8192 × 8192 en Aurora y los océanos; las otras islas pueden ser de 2048 u 8192. Estas dimensiones se verifican como casillas virtuales, sin equivalencia oficial con GTA V o una escala física fija.

## Diferencia con la propuesta voxel completa

La alpha conserva un renderizador Canvas isométrico. Hay alturas modificables y cuarenta capas de celdas persistentes, con pozos, galerías y movimiento de colonos. La cámara muestra una capa por vez. No se ha implementado una escena voxel 3D continua con greedy meshing, navegación volumétrica arbitraria, varias plantas construibles y rotación libre.

Esa ampliación requiere una arquitectura gráfica y de navegación adicional. También quedan para esa evolución las redes hidrológicas físicas, los fluidos, la construcción de planos personalizados y una política completa de guerras entre facciones en ausencia del jugador. No se presentan como funciones terminadas.

## Evidencia de aceptación

`tests/horizons.test.mjs` verifica cero inicial, caché acotada, terreno determinista, consumo de nodos, tiempos/costes, bajas, 40 capas, petróleo y tubería, viajes de ida/vuelta, océanos distintos, comercio, eventos, carga real y vía interrumpida. `scripts/qa-horizons.mjs` recorre la interfaz, el guardado, móvil y uso sin conexión. La campaña clásica tiene pruebas separadas de migración y combate.
