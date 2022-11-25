import { loadJSON } from "./JSON";
import { getDefaultTilemap, getTilemap, getSprite } from "./Tilemap";

export default class RuleTile {
  ruledata = {};

  defaultTilemap = "";

  load(json) {
    loadJSON(
      json,
      function (response) {
        this.ruledata = response;
        this.calcMasks();
        this.defaultTilemap = getDefaultTilemap(response);
        console.log("Loaded " + json);
      }.bind(this)
    );
  }

  calcMasks() {
    if (Array.isArray(this.ruledata.rules)) {
      for (let i in this.ruledata.rules) {
        let rule = this.ruledata.rules[i];
        rule.reqMask = 0;
        rule.exclMask = 0;
        let shift = 3;
        if (Array.isArray(rule.mask)) {
          for (let j in rule.mask) {
            let value = rule.mask[j];
            if (value === true) {
              rule.reqMask += 1 << shift;
            }
            if (value === false) {
              rule.exclMask += 1 << shift;
            }
            shift--;
            if (shift < 0) {
              break;
            }
          }
        }
      }
    }
  }

  findDefaultTilemap() {
    if (this.ruledata.tilemaps instanceof Object) {
      this.defaultTimemap = this.ruledata.tilemap;
    }
  }

  pickTile(north, east, south, west) {
    let mask =
      (north ? 1 << 3 : 0) +
      (east ? 1 << 2 : 0) +
      (south ? 1 << 1 : 0) +
      (west ? 1 << 0 : 0);
    let ret = {};
    if (Array.isArray(this.ruledata.rules)) {
      for (let i in this.ruledata.rules) {
        let rule = this.ruledata.rules[i];
        if ((mask & rule.reqMask) !== rule.reqMask) {
          continue;
        }
        if ((mask & rule.exclMask) !== 0) {
          continue;
        }

        let tilemap = getTilemap(
          this.ruledata.tilemaps,
          rule,
          this.defaultTilemap
        );
        let offsetX = -rule.x * tilemap.x;
        let offsetY = -rule.y * tilemap.y;
        return getSprite(tilemap, offsetX, offsetY);
      }
    }
    return ret;
  }
}
