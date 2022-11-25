export function getSprite(tilemap, x, y) {
  let ret = {};
  ret.src = tilemap.url;
  ret.style = {
    width: tilemap.x,
    height: tilemap.y,
    objectFit: "none",
    objectPosition: x + "px " + y + "px"
  };
  return ret;
}

export function getDefaultTilemap(data) {
  if (data.tilemaps instanceof Object) {
    if (data.tilemaps.hasOwnProperty("default")) {
      return data.tilemaps.default;
    }
    if (data.tilemaps.hasOwnProperty("main")) {
      return data.tilemaps.main;
    }
  }
  return {};
}

export function getTilemap(tilemaps, obj, def) {
  let ret = def;
  if (obj.hasOwnProperty("tile")) {
    ret = tilemaps[obj.tile];
  }
  return ret;
}
