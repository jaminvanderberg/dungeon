import { clampedGuassian } from "../Utility/Random";
import { Config } from "../Config";

export default class CombatStats {
  constructor(health, power, critPercent, critAmount) {
    this.health = health;
    this.maxhealth = health;
    this.power = power;
    this.critPercent = critPercent;
    if (critPercent === undefined) {
      this.critPercent = Config.CritPercent;
    }
    this.critAmount = critAmount;
    if (critAmount === undefined) {
      this.critAmount = Config.CritAmount;
    }
  }

  damage(amount) {
    this.health -= amount;
  }

  heal(amount) {
    this.health += amount;
    if (this.health > this.maxhealth) {
      this.health = this.maxhealth;
    }
  }

  healAll() {
    this.health = this.maxhealth;
  }

  hit(target, crit) {
    let stdDev = Math.ceil(this.power * 0.1);
    let max = this.power + stdDev * 3;
    let damage = Math.round(
      clampedGuassian(this.power, stdDev, 1, max) * (crit ? this.critAmount : 1)
    );
    target.damage(damage);
    return damage;
  }

  checkCrit() {
    if (Math.random() <= this.critPercent) {
      return true;
    }
    return false;
  }
}
