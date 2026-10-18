# Arte y referencias de Auralis Frontier 0.2

El arte se generó con la herramienta integrada de generación de imágenes. Los archivos originales se conservaron y las copias de producción viven en este repositorio:

- `dist/assets/art/buildings.png`: atlas RGBA de 1536 × 1024, ocho edificios.
- `dist/assets/art/troops.png`: atlas RGBA de 1086 × 1448, seis tropas con cuatro poses por tropa.
- `dist/art.js`: recortes, bandas de animación, carga y dibujo. Se utiliza el canal alfa original, sin sustituirlo por un fondo de color.
- `dist/world.js`: terreno, árboles, iluminación, movimiento, selección, mejoras y combate.

## Referencias analizadas

[Social Wars — reseña y capturas de Gamezebo](https://www.gamezebo.com/reviews/social-wars-review/): soldados de proporciones caricaturescas, vehículos y maquinaria; combinación de gestión de una base y combates. De aquí se toma la variedad de siluetas y la convivencia entre infantería y vehículos.

[Clash of Clans — sitio oficial de Supercell](https://supercell.com/en/games/clashofclans/): aldea, ejército y progresión de la base. La dirección visual adoptada para Auralis usa volúmenes grandes, materiales legibles, personajes expresivos y funciones de edificios fáciles de distinguir. Esta selección es una interpretación de diseño, no una reproducción de sus archivos.

No se distribuyen imágenes, personajes ni edificios extraídos de esos juegos. Los prompts definen diseños originales de Auralis.

## Integración

El atlas de edificios se recorta con coordenadas por objeto. El atlas de tropas tiene bandas de distinta altura; sus separaciones se verificaron en filas transparentes (y=231, 457, 641, 887, 1147). Cada banda contiene reposo, dos pasos y ataque. El renderer refleja la dirección, alterna los pasos, anima el vuelo y activa la pose de ataque durante el disparo. Los edificios ganan estandartes y efectos según su nivel. El terreno se guarda en una capa de dibujo reutilizable para reducir trabajo por fotograma.

## Prompt del atlas de edificios

```text
Use case: stylized-concept.
Asset type: production transparent sprite atlas for an original isometric strategy videogame called Auralis Frontier.
Create ONE professionally painted 3D-cartoon game asset sheet, 1536 by 1024 landscape, transparent alpha background. Exactly 4 columns and 2 rows of evenly sized 384x512 cells, no drawn grid, no text, no numbers, no logos. One complete isolated isometric building per cell, centered horizontally, every building has its bottom ground contact at 88% of cell height, generous clear transparent margins, nothing crosses a cell. All structures use the same orthographic isometric camera, visible front and right sides, camera looking down about 30 degrees, ground diamond width about 300px and depth 150px. Chunky rounded hand-painted 3D mobile-strategy art with richly shaded materials and bright friendly colors, polished carved stone, warm wood, brass machinery, teal cloth banners and glowing violet/cyan arcane crystals. Strong readable silhouette and details readable at 100 pixels. Lighting from upper left, soft ambient occlusion, only small soft contact shadows with transparency, no environment or scenery.
In reading order:
1 top-left: grand command hall, a stout stone-and-timber fortified town hall, layered terracotta orange roofs, teal pennants, brass pipes, an original small glowing turquoise crest, wide welcoming entrance, a side watchtower. Distinctive centerpiece.
2 top second: ore extractor, timber-framed mine opening with copper roof, visible yellow-gold ore cart, chunky mechanical drill and gears, rock outcrop at back.
3 top third: ether reactor, circular stone machinery plinth enclosing a large brilliant turquoise crystal in brass rings, smaller floating crystals, copper conduits.
4 top-right: barracks, sturdy wooden and stone military lodge, deep blue pitched roof, hanging shield sign, training dummies and weapon racks.
5 bottom-left: refinery and trading workshop, warm stone industrial workshop with copper chimneys, orange roof, stacks of ingots and small coin vault, brass pipes.
6 bottom second: defensive cannon tower, imposing round stone tower with one chunky steel cannon pointed diagonally towards bottom-left, bronze details, teal banner. Ground footprint about half that of town hall.
7 bottom third: arcane sanctuary, tiered pale-stone magical tower with violet roof, glowing purple crystal, rune rings, bronze stars, magical book pedestals.
8 bottom-right: one fortification wall segment, stout carved-stone and timber wall, chunky crenellations and a teal shield, one single segment, about half the footprint of town hall.
Keep the original cohesive military-meets-fantasy Auralis art identity throughout. Aim for appealing premium 3D casual base-building game art. NO borrowed characters or recognizable trademark-specific buildings. NO plain geometric placeholders, NO low-poly wireframe look, NO UI panels, NO grass tile background, NO labels. Real transparent background.
```

## Prompt del atlas de tropas

```text
Use case: stylized-concept.
Asset type: production character animation sprite sheet for Auralis Frontier, an original colorful military-and-magic isometric base-building strategy game.
Create a transparent alpha PNG sprite sheet, portrait canvas 1536x2048. Exactly FOUR equal columns and SIX equal rows, 24 isolated character sprites total. No text, no labels, no dividers, no UI, no ground tiles. Each sprite fits entirely inside its cell with at least 30px transparent margin; no sprite touches a neighbor. Ground-contact feet are at 85% height in EVERY cell. The isometric camera looks down 30 degrees, all characters face diagonally bottom-left; same orthographic perspective, scale and upper-left lighting. Premium friendly hand-painted 3D cartoon rendering, large expressive heads, chunky readable equipment, beveled polished surfaces, richly shaded teal/copper/purple palette, strong silhouettes readable when displayed at 45px. Each row shows THE SAME character identity with 4 animation poses: column 1 idle ready stance, column 2 walking left foot forward, column 3 walking right foot forward, column 4 attacking. Consistency of costume, face, colors and body proportions across each row is essential.
ROW 1: original cute human frontier scout soldier: confident round face, brown hair, oversized olive-and-teal armored helmet with copper goggles, teal scarf, chunky leather boots, short brass-and-steel fantasy blaster. Attack pose aiming weapon with a small bright muzzle flash.
ROW 2: original compact whimsical armored tank, low wide body, clearly visible dark tank treads, green-teal rounded armored hull with copper rivets, big short cannon, original turquoise crystal mounted at back. The walking frames show shifted treads; attack frame shows cannon firing. Tank about 1.5 times the soldier width but roughly soldier height.
ROW 3: original arcane flying drone, brass beetle-shaped body, four teal glowing rotor wings, violet central crystal eye, compact and appealing. Walking frames have different rotor-wing positions; attack frame has a small violet energy discharge.
ROW 4: original female arcane mage, rich purple hooded cloak with turquoise trim, warm expressive face, copper belt, large turquoise crystal-topped staff, leather satchel. Walking frames change leg/cape positions; attack frame has staff extended with small cyan spell orb.
ROW 5: original rune-stone guardian golem, broad shoulders and massive rounded hands, weathered pale granite body with moss accents, glowing turquoise runes and chest crystal, gentle-but-powerful expressive eyes. About 1.3 times soldier height and 1.5 times width. Attack frame powerful fist punch.
ROW 6: original friendly young mechanical wyvern, stocky teal-scaled dragon with small copper armor pieces, orange wing membranes, expressive violet eyes, two wings and two hind legs, no rider. Idle on feet with wings half-open; walking frames have alternating hind feet and wing positions; attack breathes a small orange flame. About 1.6 times soldier width, 1.3 times height.
The result must be actual usable isolated game sprites, not portrait cards, not a lineup illustration. Every sprite wholly inside its own cell, real clean transparent background, no environmental backdrop or full-cell color glows. Original designs only, no recognizable trademark characters.
```

