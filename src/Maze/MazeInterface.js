import React from "react";
import Direction from "./Direction";
import "./maze.css";
import RuleTile from "../Tile/RuleTile";
import SpriteSheet from "../Tile/SpriteSheet";

export default class MazeInterface extends React.Component {
  ruletile = new RuleTile();
  character = new SpriteSheet();
  enemy = new SpriteSheet();

  constructor(props) {
    super(props);

    if (props.state !== undefined) {
      this.state = props.state;
    } else {
      let cell = [];
      for (let y = 0; y < this.props.maze.ySize; y++) {
        for (let x = 0; x < this.props.maze.xSize; x++) {
          if (x === 0) {
            cell[y] = [];
          }
          cell[y][x] = 0;
        }
      }
      cell[this.props.maze.start.y][this.props.maze.start.x] = 1;
      let pos = { x: this.props.maze.start.x, y: this.props.maze.start.y };

      this.state = {
        pos: pos,
        facing: "east",
        cell: cell,
        viewmap: this.getViewMap(pos, cell),
        offset: { x: 0, y: 0 }
      };
    }

    this.ruletile.load(props.ruletile);
    this.character.load(props.character);
    this.enemy.load(props.enemy);

    this.step = this.step.bind(this);
    this.keydown = this.keydown.bind(this);
    this.getViewMap = this.getViewMap.bind(this);
    this.modifyViewMap = this.modifyViewMap.bind(this);
    this.moveTo = this.moveTo.bind(this);
    this.walk = this.walk.bind(this);
    this.finishMove = this.finishMove.bind(this);
  }

  componentDidUpdate() {}

  componentDidMount() {
    this.componentDidUpdate();
    document.addEventListener("keydown", this.keydown, false);

    new Image().src = "image/maze/top-down-character.png";
    new Image().src = "image/maze/boss.png";
  }

  step() {
    this.state.maze.step();
    this.setState({});
  }

  keydown(event) {
    if (this.state.offset.moving) {
      return;
    }

    let dir = Direction.NORTH;
    console.log(event.key);
    switch (event.key) {
      case "Down":
      case "ArrowDown":
      case "s":
        dir = Direction.SOUTH;
        break;
      case "Up":
      case "ArrowUp":
      case "w":
        dir = Direction.NORTH;
        break;
      case "Left":
      case "ArrowLeft":
      case "a":
        dir = Direction.WEST;
        break;
      case "Right":
      case "ArrowRight":
      case "d":
        dir = Direction.EAST;
        break;
      default:
        return;
    }

    if (
      this.props.maze.cell[this.state.pos.y][this.state.pos.x][dir.name] ===
      true
    ) {
      let newpos = dir.offset(this.state.pos);
      this.moveTo(newpos.x, newpos.y);
    }
    event.preventDefault();
  }

  moveTo(x, y) {
    let offset = { x: x - this.state.pos.x, y: y - this.state.pos.y };
    let dir = Direction.fromOffset(offset);
    this.setState({
      offset: {
        x: offset.x,
        y: offset.y,
        offsetX: offset.x,
        offsetY: offset.y,
        movetoX: x,
        movetoY: y,
        moving: true
      },
      facing: dir.name
    });
    setTimeout(this.walk, this.props.movementTime);
  }

  walk() {
    let offset = {
      x: this.state.offset.x + this.state.offset.offsetX,
      y: this.state.offset.y + this.state.offset.offsetY,
      offsetX: this.state.offset.offsetX,
      offsetY: this.state.offset.offsetY,
      movetoX: this.state.offset.movetoX,
      movetoY: this.state.offset.movetoY,
      moving: true
    };
    if (
      offset.x >= this.props.scale ||
      offset.y >= this.props.scale ||
      -offset.x >= this.props.scale ||
      -offset.y >= this.props.scale
    ) {
      this.finishMove();
      return;
    }
    this.setState({
      offset: offset
    });
    setTimeout(this.walk, this.props.movementTime);
  }

  finishMove() {
    let x = this.state.offset.movetoX;
    let y = this.state.offset.movetoY;
    let prev = this.state.cell[y][x];

    let cell = JSON.parse(JSON.stringify(this.state.cell));
    cell[y][x] = 1;
    let pos = { x: x, y: y };
    let viewmap = this.getViewMap(pos, cell);
    viewmap.forEach((row, y) => {
      row.forEach((v, x) => {
        if (viewmap[y][x].color > 0 && cell[y][x] === 0) {
          cell[y][x] = 0.6;
        }
      });
    });

    let newstate = {
      offset: { x: 0, y: 0 },
      pos: { x: x, y: y },
      cell: cell,
      viewmap: this.getViewMap(pos, cell)
    };
    this.setState(newstate);

    if (prev !== 1) {
      let chance = Math.floor(Math.random() * 3);
      if (chance === 0) {
        this.props.startCombat(Object.assign(this.state, newstate));
      }
    }
  }

  doNothing() {}

  render() {
    let state = this.state;
    let props = this.props;
    let scale = this.props.scale + "px";
    if (this.props.scale === undefined) {
      scale = "30px";
    }
    let viewmap = this.state.viewmap;
    let ruletile = this.ruletile;
    return (
      <div className="maze">
        {this.props.maze.cell.map((row, y) => {
          return (
            <div className="m-0 p-0 b-0 maze-row" style={{ height: scale }}>
              {row.map((cell, x) => {
                let style = "maze-cell ";
                /*if (cell.blank !== true) {
                  if (cell.north !== true) {
                    style += "border-north ";
                  }
                  if (cell.east !== true) {
                    style += "border-east ";
                  }
                  if (cell.south !== true) {
                    style += "border-south ";
                  }
                  if (cell.west !== true) {
                    style += "border-west ";
                  }
                }*/
                let dim = {
                  width: scale,
                  height: scale
                };
                if (viewmap[y][x].moveTo) {
                  style += "moveTo";
                }
                let fog = {
                  backgroundColor:
                    "rgba(0, 0, 0, " + (100 - viewmap[y][x].color * 100) + "%)"
                };

                let img = "";
                let imgstyle = {};
                let imgClass = "cell-sprite ";
                if (
                  x === props.maze.end.x &&
                  y === props.maze.end.y &&
                  viewmap[y][x].color > 0
                ) {
                  img = "image/maze/boss.png";
                }
                if (x === state.pos.x && y === state.pos.y) {
                  img = "image/maze/char1.png";
                  imgstyle = {
                    left: state.offset.x + 22 + "px",
                    top: state.offset.y + 14 + "px"
                  };
                  //imgClass += "face-" + state.facing;
                }

                let tile = ruletile.pickTile(
                  cell.north,
                  cell.east,
                  cell.south,
                  cell.west
                );

                return (
                  <div
                    style={dim}
                    className={style}
                    onClick={
                      viewmap[y][x].moveTo === true
                        ? () => this.moveTo(x, y)
                        : this.doNothing()
                    }
                  >
                    <div className="maze-fog" style={fog}>
                      {" "}
                    </div>
                    {tile.hasOwnProperty("src") && (
                      <img
                        className="cell-tile"
                        src={tile.src}
                        style={tile.style}
                        alt=""
                      />
                    )}
                    {img !== "" && (
                      <img
                        className={imgClass}
                        src={img}
                        style={imgstyle}
                        alt=""
                      />
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  }

  getViewMap(pos, cell) {
    let viewmap = [];
    for (let y = 0; y < this.props.maze.ySize; y++) {
      for (let x = 0; x < this.props.maze.xSize; x++) {
        if (x === 0) {
          viewmap[y] = [];
        }
        viewmap[y][x] = { color: cell[y][x] };
      }
    }

    this.modifyViewMap(viewmap, pos, 1);
    return viewmap;
  }

  modifyViewMap(viewmap, pos, falloff, prevdir) {
    falloff -= 0.5 / this.props.viewDistance;
    if (falloff <= 0.5) {
      return;
    }
    let self = this;
    Direction.DirectionList.forEach((dir) => {
      if (self.props.maze.cell[pos.y][pos.x][dir.name] === true) {
        let x = pos.x + dir.relativeX;
        let y = pos.y + dir.relativeY;
        if (prevdir === undefined || dir === prevdir) {
          if (prevdir === undefined) {
            viewmap[y][x].moveTo = true;
          }
          if (viewmap[y][x].color < falloff) {
            viewmap[y][x].color = falloff;
          }
          self.modifyViewMap(viewmap, { x: x, y: y }, falloff, dir);
        } else {
          if (viewmap[y][x].color < 0.7 + 0.3 / this.props.viewDistance) {
            viewmap[y][x].color = 0.7 + 0.3 / this.props.viewDistance;
          }
        }
      }
    });
  }
}
