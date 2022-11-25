class _MonsterFactory {
  constructor() {
    this.monsterlist = [];
  }

  add(monster) {
    this.monsterlist.push(monster);
  }

  getMonster() {
    var ret = [];
    var i = Math.floor(Math.random() * this.monsterlist.length);
    if (Array.isArray(this.monsterlist[i])) {
      this.monsterlist[i].forEach((monster, index) => {
        ret[index] = monster.create();
      });
    } else {
      ret[0] = this.monsterlist[i].create();
    }
    return ret;
  }
}

const MonsterFactory = new _MonsterFactory();

export default MonsterFactory;
