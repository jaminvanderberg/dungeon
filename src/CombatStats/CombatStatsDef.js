import CombatStats from "./CombatStats";

export default class CombatStatsDef {
  constructor(healthmin, healthmax, power, critPercent, critAmount) {
    this.healthmin = healthmin;
    this.healthmax = healthmax;
    this.power = power;
    this.critPercent = critPercent;
    this.critAmount = critAmount;
  }

  create() {
    var health =
      Math.floor(Math.random() * (this.healthmax - this.healthmin)) +
      this.healthmin;
    return new CombatStats(
      health,
      this.power,
      this.critPercent,
      this.critAmount
    );
  }
}
