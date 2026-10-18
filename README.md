# Auralis Frontier

Juego original de estrategia y gestión del ecosistema Auralis. Combina una base isométrica, tecnología militar, magia, comercio con habitantes y combates contra IA local.

**Jugar:** https://oscard0823.github.io/auralis-frontier/

**Android y Windows:** https://github.com/OscarD0823/auralis-frontier/releases/latest

## Qué incluye la alpha 0.3

- Base de 48 × 48 casillas (antes 18 × 18), hasta 180 edificios y terreno modificable; minimapa, zoom y desplazamiento.
- 17 tipos de edificio con funciones: mando, extractor, reactor, cuartel, refinería, torre, santuario, muralla, fábrica de vehículos, hangar, batería de misiles, laboratorio, hospital, mercado, embajada, depósito y astillero. Mejoras, reparación y reubicación.
- 14 clases: comando, tanque Bastión, dron Avispa, maga, gólem, draco, jeep, lanzamisiles, helicóptero, lancero, arquera, caballero, cañonera y transporte. Instalaciones especializadas, tecnologías, límite inicial 60 ampliable a 120.
- Control directo del ejército en la base y las expediciones: clic, recuadro, doble clic por clase, Shift para añadir, Ctrl + 1–9 para guardar grupos y 1–9 para recuperarlos. Clic derecho para mover o atacar; A + clic avanza y ataca, S mantiene posición. Formaciones de línea y columna. En móvil, selección y órdenes mediante botones y toques.
- 24 regiones procedurales de 40 × 40, generadas de forma determinista a partir de una semilla y conservadas en la partida. Praderas, desiertos, tundra, archipiélagos, zonas volcánicas y selvas. Lagos, bosques, alturas, yacimientos y emplazamientos distintos.
- Niebla de exploración persistente durante cada expedición: el ejército descubre terreno y enemigos. La IA utiliza defensas y tropas de distintas civilizaciones.
- Rutas terrestres o marítimas desde Aurora o una colonia. Requieren depósito y, en el mar, astillero. Consumen aleación durante la expedición; sin suministros las tropas se mueven más despacio. Las rutas deben mantener una conexión activa con Aurora.
- Conquista, fundación y crecimiento de colonias mineras, comerciales o fortalezas. Construye infraestructuras en hasta 20 solares, consulta su vista isométrica y recibe sus exportaciones en la base inicial. Los edificios productivos, comerciales y de protección modifican los envíos.
- Tres civilizaciones de IA con relaciones, ayuda diplomática y alianzas. Los pactos aportan daño, comercio o logística. Seis minerales comerciables: hierro, cobre, cobalto, cristal marino, obsidiana y esmeralda.
- Combate naval con cañoneras y transportes de 12 plazas. Las tropas terrestres no cruzan el mar: hay que embarcarlas, navegar hasta la costa y desembarcar. Los helicópteros y criaturas voladoras pueden sobrevolarlo.
- Desastres según el bioma: incendio, tormenta de arena, ventisca, temporal, erupción e inundación. Se anuncian 8 segundos antes y dañan unidades y objetivos dentro de la zona señalada.
- Tres operaciones guiadas, incursiones contra Aurora, encargos de NPC y áureos como moneda de compra.
- Ilustraciones originales con poses de reposo, marcha y ataque. Fuentes y prompts en [ARTWORK.md](ARTWORK.md) y [ARTWORK-v3.md](ARTWORK-v3.md).
- Web/PWA sin conexión, Android y Windows con contenido incluido. Guardado, exportación e importación validadas entre plataformas.

## Funcionamiento del guardado y de la IA

Es una alpha para un jugador. La IA usa reglas de combate y búsqueda de rutas en el dispositivo; no necesita un servicio de inteligencia artificial externo. Las incursiones y los combates solo avanzan mientras el juego está visible. La producción continúa al volver al juego con un máximo de cuatro horas acumuladas.

Cada instalación guarda una colonia propia. Para continuar en otra plataforma, exporta la partida e impórtala allí. Todavía no incluye cuentas Auralis, sincronización automática, multijugador, clanes, compras reales ni batallas entre jugadores.

La versión 0.3 conserva las partidas de 0.1 y 0.2: amplía el terreno conservando las casillas y coordenadas anteriores y añade las clases y sistemas nuevos. Actualiza todas las aplicaciones antes de trasladar una partida de 0.3 a otro dispositivo. Las colonias se administran desde el mapa regional; la construcción libre por casilla se realiza en Aurora. Las alianzas son con facciones locales de IA, sin multijugador. Los desastres afectan las expediciones visibles; no se simulan al cerrar el juego.

## Ejecutar y comprobar

Requiere Node.js 22 o posterior.

```sh
npm ci
npm run dev
npm test
```

Abre http://127.0.0.1:4183/. La web no requiere compilación: `dist/` contiene todos los recursos y no depende de CDN.

GitHub Actions publica `dist/` en GitHub Pages al enviar cambios a `main`.

## Android

Requiere JDK 21 y Android SDK 36. El proyecto nativo está en `android/`.

```sh
npm run android:sync
cd android
./gradlew assembleRelease
```

Para firmar una release, define `AURALIS_KEYSTORE_FILE` y `AURALIS_KEY_PASSWORD`; alias de clave `auralis-frontier`. Las claves y contraseñas no se incluyen en el repositorio. Sin esas variables, la compilación release no queda firmada.

## Windows

```sh
npm run desktop:build
```

Genera `release/Auralis-Frontier-Windows-Setup.exe`. La aplicación usa Electron con el contenido del juego incluido y se ejecuta sin servidor externo. Este instalador no dispone de certificado de firma de Windows.

## Publicar las descargas

Los botones del juego apuntan a estos nombres estables dentro de la última release de GitHub:

- `Auralis-Frontier-Android.apk`
- `Auralis-Frontier-Windows-Setup.exe`

Una release debe contener ambos archivos y `SHA256SUMS.txt`. Incrementa también `versionCode` de Android para las actualizaciones.

## Próximas ampliaciones

Más biomas, criaturas, héroes, edificios, cadenas de producción, campañas y dificultad; edición de terreno por áreas; IA con exploración y expansión; integración de identidad Auralis cuando su contrato esté definido. Cuentas compartidas y multijugador requerirán un backend: GitHub Pages aloja archivos estáticos.

Arte, nombres y código del juego creados para este proyecto. No contiene archivos, personajes ni gráficos extraídos de Social Wars o Clash of Clans.
