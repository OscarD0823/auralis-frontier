# Referencias de estrategia y dirección visual · 0.14

## Social Empires y Social Wars

Se revisó [AcidCaos/socialemperors](https://github.com/AcidCaos/socialemperors), revisión `f642e0bae5a341f48e73b58f2e6d33a8436992c1`. Es un proyecto de preservación de Social Empires: conserva un cliente Flash y un servidor local; su código se publica bajo GPL-3.0. No es un motor 3D para importar directamente en Auralis.

Los archivos `get_game_config.py`, `engine.py`, `command.py` y las plantillas de juego muestran una separación útil: catálogo de unidades y edificios, costes y producción, comandos, estado de la base y misiones. Los comandos distinguen compra, movimiento, recogida, venta, bajas, guarnición y recompensas de misiones. La configuración admite modificaciones sin reescribir todos los controladores. Auralis conserva su motor propio y su catálogo compartido entre campaña, interfaz y modelos; no incorpora código ni recursos del cliente preservado.

También se revisaron la portada y la [guía pública de Social Wars](https://wars.fbgamesweb.com/como-jugar). La guía muestra 166 edificios y 303 unidades; describe centro de mando, depósitos, academias y hangares, recursos y defensas. Las variantes de jeep ejemplifican una progresión visible y funcional: cambian costes, vida, ataque, alcance y edificio de entrenamiento. Son referencias para especialización, lectura de las mejoras y organización del catálogo, no cifras trasladadas automáticamente al equilibrio de Auralis. No se abrió una partida de una cuenta del servicio.

## Integración visual

Se comprobaron las ocho láminas facilitadas por el usuario: coinciden byte por byte con `people-v5`, `civic-buildings-v6`, `buildings`, `troops`, `military-buildings-v3`, `military-troops-v3`, `historical-troops-v3` y `shipyard-v3` del proyecto.

El mapa conserva geometría tridimensional, perspectiva, oclusión, selección mediante rayos y sombras. Las láminas se usan en miniaturas y como comparación explícita en el visor; no se pegan sobre el mapa. `reference-designs.js` interpreta rasgos de las referencias en edificios y vehículos: torres, murallas, tejados, maquinaria minera, vagoneta, núcleos, hangares, muelle y grúa. Estas interpretaciones no son conversiones exactas de los dibujos.

Los principales humanos y NPC reciben cuerpos con piel, ropa y botas texturizadas y animación esquelética. Las bases y animaciones de Quaternius se adaptan al motor; las fuentes y transformaciones se documentan en `ASSET-CREDITS.md`. Piedra, madera, tejas y revoco usan color, normales y rugosidad, en lugar de un material uniforme. Los modelos locales previos siguen disponibles como respaldo y para familias todavía no sustituidas.

## Dificultades

| Modo | Recolección | Nuevas obras | Consumo | Daño enemigo | Daño de desastres |
|---|---:|---:|---:|---:|---:|
| Fácil | 2× | 2× | 40% | 50% | 45% |
| Difícil | 1,35× | 1,3× | 75% | 80% | 80% |
| Simulación | 1× | 1× | 100% | 100% | 100% |

Entrenamiento, ciencia, avisos y frecuencia de amenazas también se ajustan. Simulación conserva todos los multiplicadores anteriores en uno; las partidas sin el campo `difficulty` se abren en Simulación. Los tres modos empiezan sin recursos y mantienen las bajas permanentes. La elección se guarda, se exporta y se puede cambiar desde la guía o Ajustes.
