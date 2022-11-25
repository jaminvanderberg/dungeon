import "./styles.css";
import React from "react";
import Combat from "./Combat/Combat";
import Player from "./Player";
import MonsterFactory from "./Monster/MonsterFactory";
import Store from "./Store/Store";
import MazeInterface from "./Maze/MazeInterface";
import Maze from "./Maze/Maze";

export const GameState = Object.freeze({
  Maze: Symbol("maze"),
  Combat: Symbol("combat"),
  Store: Symbol("store")
});

export default class GameController extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      player: new Player(),
      monster: MonsterFactory.getMonster(),
      gameState: GameState.Maze,
      maze: new Maze(10, 10, 1, 2),
      mazeState: undefined
    };

    this.startCombat = this.startCombat.bind(this);
    this.endCombat = this.endCombat.bind(this);
  }

  chooseMonster() {}

  endCombat() {
    this.setState({
      gameState: GameState.Maze
    });
  }

  startCombat(mazeState) {
    //this.setState({
    //  monster: MonsterFactory.getMonster(),
    //  gameState: GameState.Combat,
    //  mazeState: mazeState
    //d});
  }

  endStore() {
    this.setState(
      this.startCombat({
        gameState: GameState.Combat
      })
    );
  }

  render() {
    if (this.state.gameState === GameState.Combat) {
      return this.combat();
    } else if (this.state.gameState === GameState.Store) {
      return this.store();
    } else {
      return this.maze();
    }
  }

  combat() {
    return (
      <Combat
        player={this.state.player}
        monster={this.state.monster}
        parent={this}
      />
    );
  }

  store() {
    return <Store player={this.state.player} parent={this} />;
  }

  maze() {
    return (
      <div className="App">
        <link rel="preload" href="imges/boss.png" as="image" />
        <link rel="preload" href="imges/top-down-character.png" as="image" />
        <MazeInterface
          maze={this.state.maze}
          state={this.state.mazeState}
          speed="10"
          scale="72"
          viewDistance="5"
          movementTime="4"
          startCombat={this.startCombat}
          ruletile="json/ruletile/cave.json"
          character="json/sprite/character.json"
          enemy="json/sprite/enemy.json"
        />
      </div>
    );
  }
}
