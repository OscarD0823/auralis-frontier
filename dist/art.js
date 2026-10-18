// Original Auralis atlases. Coordinates are recorded against the generated source images.
export const atlases = {};
const sources = { buildings: './assets/art/buildings.png', troops: './assets/art/troops.png' };
export const buildingFrames = {
  command: [0, 0, 450, 480], mine: [450, 65, 368, 415],
  reactor: [818, 15, 350, 465], barracks: [1168, 35, 368, 445],
  refinery: [0, 500, 450, 490], turret: [450, 480, 350, 528],
  sanctum: [800, 480, 380, 544], wall: [1180, 550, 356, 474],
};
export const troopRows = { ranger: 0, bulwark: 1, wasp: 2, arcanist: 3, golem: 4, drake: 5 };
const troopBands = [0, 231, 457, 641, 887, 1147, 1448];
export const artReady = Promise.all(Object.entries(sources).map(([name, url]) => new Promise(resolve => {
  const img = new Image();
  img.onload = () => { atlases[name] = img; resolve(true); };
  img.onerror = () => resolve(false);
  img.src = new URL(url, import.meta.url).href;
})));
export function getArt(type, frame = 0, unit = false) {
  const img = atlases[unit ? 'troops' : 'buildings']; if (!img) return null;
  if (!unit) return buildingFrames[type] ? { img, rect: buildingFrames[type] } : null;
  const row = troopRows[type]; if (row === undefined) return null;
  const w = img.naturalWidth / 4, factor = img.naturalHeight / 1448;
  const y = troopBands[row] * factor, h = (troopBands[row + 1] - troopBands[row]) * factor;
  return { img, rect: [Math.max(0, Math.min(3, frame)) * w, y, w, h] };
}
export function paintArt(ctx, art, x, y, width, height, flip = false) {
  if (!art) return false; ctx.save();
  if (flip) { ctx.translate(x + width, y); ctx.scale(-1, 1); ctx.drawImage(art.img, ...art.rect, 0, 0, width, height); }
  else ctx.drawImage(art.img, ...art.rect, x, y, width, height);
  ctx.restore(); return true;
}
