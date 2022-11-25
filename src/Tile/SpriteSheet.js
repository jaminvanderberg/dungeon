import { loadJSON } from "./JSON";
import { getDefaultTilemap, getTilemap, getSprite } from "./Tilemap";

export default class SpriteSheet {
  spritedata = {};
  defaultTilemap = {};
  sprites = {};

  load(json) {
    loadJSON(
      json,
      function (response) {
        this.spritedata = response;
        this.defaultTilemap = getDefaultTilemap(response);
      }.bind(this)
    );
  }

  getSprite(name) {
    if (!this.sprites.hasOwnProperty(name)) {
      let sprite = this.spritedata[name];
      let tilemap = getTilemap(
        this.spritedata.tilemaps,
        sprite,
        this.defaultTilemap
      );
      this.sprites[name] = getSprite(tilemap, sprite.x, sprite.y);
    }
    return this.sprites[name];
  }
}
