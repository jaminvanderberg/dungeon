import MonsterDef from "./Monster/MonsterDef";
import MonsterFactory from "./Monster/MonsterFactory";

export const Config = {
  PlayerHealth: 100,
  PlayerPower: 8,
  MonsterHealth: 30,
  MonsterPower: 2,

  CritPercent: 0.1,
  CritAmount: 2
};

var dark_knight = new MonsterDef(
  "Dark Knight",
  "image/dark-knight.png",
  25,
  30,
  3,
  30
);
var knight = new MonsterDef("Knight", "image/knight.png", 18, 22, 2, 20);
var slime = new MonsterDef("Slime", "image/knight.png", 8, 12, 1);

MonsterFactory.add([knight, knight]);
MonsterFactory.add([dark_knight, knight]);
MonsterFactory.add([knight, knight, knight]);
MonsterFactory.add([dark_knight, dark_knight]);
//MonsterFactory.add([slime, slime, slime]);
