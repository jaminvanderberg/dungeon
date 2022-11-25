import CombatStats from "./CombatStats/CombatStats";
import { Config } from "./Config";

export default class Player {
  constructor() {
    this.stats = new CombatStats(Config.PlayerHealth, Config.PlayerPower);
    this.money = 0;
  }

  damage(amount) {
    this.stats.damage(amount);
  }

  heal(amount) {
    this.stats.heal(amount);
  }
}
