# Auralis Frontier

Juego original de estrategia y gestión del ecosistema Auralis. Combina una base isométrica, tecnología militar, magia, comercio con habitantes y combates contra IA local.

**Jugar:** https://oscard0823.github.io/auralis-frontier/

**Android y Windows:** https://github.com/OscarD0823/auralis-frontier/releases/latest

## Qué incluye esta alpha

- Centro de mando y siete edificios construibles: extractor, reactor de éter, cuartel, refinería, centinela, santuario y muralla. Mejoras hasta nivel 5, reubicación y reparación.
- Áureos como única moneda de compra; producción de aleación y éter, mercado y encargos pagados de tres NPC.
- Seis unidades: explorador, Bastión, Avispa arcana, Maga de éter, Guardián rúnico y Draco de bronce. Las tres últimas se desbloquean mejorando el mando. Entrenamiento secuencial y límite de 60 unidades; daño de área y preferencia por defensas según la clase.
- Ocho edificios ilustrados y 24 poses de tropas: reposo, marcha y ataque. Materiales, banderas, cristales, mejoras visibles, bosque y una isla más colorida. Recursos y prompts originales en [ARTWORK.md](ARTWORK.md).
- Tres fortalezas de dificultad creciente y grandes reservas, con defensas, mando y edificios de producción destructibles. Despliegue táctil, combate simulado, pérdidas, supervivientes, recompensas y repetición con botín reducido.
- Incursiones de IA contra tu propia base. Las torres, los santuarios y la guarnición defienden automáticamente; los enemigos dañan edificios y pueden saquear el 15% de los áureos.
- Terreno modificable por casilla: allanar, elevar, excavar hasta crear agua, plantar bosques y trazar caminos. Los edificios requieren superficies planas y despejadas. El terreno influye en las rutas de invasión y siempre debe quedar un acceso terrestre al mando.
- Ratón, teclado y pantalla táctil; desplazamiento y zoom con dos dedos. Interfaz en español adaptable desde 320 px.
- Guardado automático, exportación e importación validadas. En Android la copia se guarda mediante el menú de compartir del sistema.
- PWA instalable y con caché sin conexión; aplicaciones Android y Windows con contenido incluido.

## Funcionamiento del guardado y de la IA

Es una alpha para un jugador. La IA usa reglas de combate y búsqueda de rutas en el dispositivo; no necesita un servicio de inteligencia artificial externo. Las incursiones y los combates solo avanzan mientras el juego está visible. La producción continúa al volver al juego con un máximo de cuatro horas acumuladas.

Cada instalación guarda una colonia propia. Para continuar en otra plataforma, exporta la partida e impórtala allí. Todavía no incluye cuentas Auralis, sincronización automática, multijugador, clanes, compras reales ni batallas entre jugadores.

La versión 0.2 conserva las partidas de 0.1.0, incluyendo los combates en curso. Añade las clases nuevas con cero unidades iniciales. Actualiza ambas aplicaciones antes de trasladar una partida que ya contenga tropas nuevas.

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
