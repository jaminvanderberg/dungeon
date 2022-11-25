import CombatStatsDef from "../CombatStats/CombatStatsDef";
import Monster from "./Monster";

export default class MonsterDef {
  constructor(name, image, healthmin, healthmax, power, money) {
    this.name = name;
    this.image = image;
    this.stats = new CombatStatsDef(healthmin, healthmax, power);
    this.money = money;
  }

  create() {
    return new Monster(this.name, this.stats.create(), this.image, this.money);
  }
}
