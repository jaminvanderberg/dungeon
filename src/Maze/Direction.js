export default class Direction {
  static NORTH = new Direction("north", 0, 0, -1, 1, 2);
  static SOUTH = new Direction("south", 1, 0, 1, 3, 0);
  static EAST = new Direction("east", 2, 1, 0, 2, 3);
  static WEST = new Direction("west", 3, -1, 0, 0, 1);

  static DirectionList = [
    Direction.NORTH,
    Direction.EAST,
    Direction.SOUTH,
    Direction.WEST
  ];

  static fromOffset(offset) {
    let ret = Direction.NORTH;
    Direction.DirectionList.forEach((dir) => {
      if (offset.x === dir.relativeX && offset.y === dir.relativeY) {
        ret = dir;
      }
    });
    return ret;
  }

  constructor(name, index, relX, relY, next, inverse) {
    this.name = name;
    this.index = index;
    this.relativeX = relX;
    this.relativeY = relY;
    this.next = next;
    this.inv = inverse;
  }

  inverse() {
    return Direction.DirectionList[this.inv];
  }

  static RandomDirection() {
    let i = Math.floor(Math.random() * 4);
    return Array[i];
  }

  offset(pos) {
    return {
      x: pos.x + this.relativeX,
      y: pos.y + this.relativeY
    };
  }
}
