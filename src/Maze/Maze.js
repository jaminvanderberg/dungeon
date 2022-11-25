import Direction from "./Direction";

export default class Maze {
  cell = [];
  xSize;
  ySize;
  startGroup = [];
  endGroup = [];
  border = [];
  done = false;
  resultCount;
  start;
  end;

  constructor(xSize, ySize, resultCount, blankSpots) {
    this.xSize = xSize;
    this.ySize = ySize;
    this.resultCount = resultCount;

    for (let y = 0; y < ySize; y++) {
      for (let x = 0; x < xSize; x++) {
        if (x === 0) {
          this.cell[y] = [];
        }
        this.cell[y][x] = { used: false, blank: false };
      }
    }

    let startY = Math.floor(Math.random() * ySize);
    let endY = Math.floor(Math.random() * ySize);
    this.addToGroup(0, startY, this.startGroup);
    this.addToGroup(xSize - 1, endY, this.endGroup);
    this.start = { x: 0, y: startY };
    this.end = { x: xSize - 1, y: endY };

    let index = this.randomElement(this.endGroup);
    this.endGroup = [this.endGroup[index]];
    let endPos = this.findNeighbor(this.endGroup[0]);

    while (blankSpots > 0) {
      let x = Math.floor(Math.random() * xSize);
      let y = Math.floor(Math.random() * ySize);
      if (
        this.cell[y][x].blank === false &&
        (x !== endPos.x || y !== endPos.y)
      ) {
        this.cell[y][x].blank = true;
        blankSpots--;
      }
    }

    while (!this.done) {
      this.step();
    }
  }

  findNeighbor(n) {
    return { x: n.x + n.dir.relativeX, y: n.y + n.dir.relativeY };
  }

  step() {
    if (this.done) {
      return false;
    }

    let start = false,
      end = false;
    if (this.startGroup.length > 0) {
      start = this.addNeighbor(
        this.startGroup,
        this.randomElement(this.startGroup)
      );
    }
    if (this.endGroup.length > 0) {
      end = this.addNeighbor(this.endGroup, this.randomElement(this.endGroup));
    }

    if (!start && !end) {
      for (let i = 0; i < this.resultCount; i++) {
        let index = this.randomElement(this.border);
        let pos = this.border[index];
        this.cell[pos.y][pos.x][pos.dir.name] = true;
        this.cell[pos.y + pos.dir.relativeY][pos.x + pos.dir.relativeX][
          pos.dir.inverse().name
        ] = true;
      }
      this.done = true;
    }

    return true;
  }

  addToGroup(x, y, group, fromDir) {
    if (fromDir !== undefined) {
      this.cell[y][x][fromDir.inverse().name] = true;
    }
    this.cell[y][x].used = true;
    this.cell[y][x].group = group;

    if (y > 0 && fromDir !== Direction.SOUTH) {
      group.push({ x: x, y: y, dir: Direction.NORTH });
    }
    if (x > 0 && fromDir !== Direction.EAST) {
      group.push({ x: x, y: y, dir: Direction.WEST });
    }
    if (y < this.xSize - 1 && fromDir !== Direction.NORTH) {
      group.push({ x: x, y: y, dir: Direction.SOUTH });
    }
    if (x < this.ySize - 1 && fromDir !== Direction.WEST) {
      group.push({ x: x, y: y, dir: Direction.EAST });
    }
  }

  randomElement(group) {
    let index = Math.floor(Math.random() * group.length);
    return index;
  }

  addNeighbor(group, index) {
    let n = group[index];
    let pos = this.findNeighbor(n);
    group.splice(index, 1);
    while (
      this.cell[pos.y][pos.x].used === true ||
      this.cell[pos.y][pos.x].blank === true
    ) {
      if (
        this.cell[pos.y][pos.x].group !== group &&
        this.cell[pos.y][pos.x].blank === false &&
        group === this.startGroup
      ) {
        this.border.push(n);
      }
      if (group.length === 0) {
        return false;
      }

      index = this.randomElement(group);
      n = group[index];
      pos = this.findNeighbor(n);
      group.splice(index, 1);
    }
    this.cell[n.y][n.x][n.dir.name] = true;

    this.addToGroup(pos.x, pos.y, group, n.dir);
    return true;
  }
}
