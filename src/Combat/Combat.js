import React from "react";

export default class Combat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      health: 100,
      instructions: "",
      selectMonster: null,
      awaitCommand: false,
      log: []
    };

    this.fight = this.fight.bind(this);
    this.heal = this.heal.bind(this);
    this.doFight = this.doFight.bind(this);
  }

  fight() {
    this.setState({
      instructions: "Select an enemy to attack",
      selectMonster: this.doFight,
      awaitCommand: "monster",
      log: []
    });
  }

  doFight(monster, index) {
    let crit = this.props.player.stats.checkCrit();
    let damage = this.props.player.stats.hit(monster.stats, crit);

    var log = [
      (crit ? "CRITICAL! " : "") + "You hit " + monster.name + " for " + damage
    ];

    //this.props.player.damage(monster.power);
    if (monster.stats.health <= 0) {
      this.props.player.money += monster.money;
      this.props.monster.splice(index, 1);
    }

    if (this.props.monster.length === 0) {
      this.props.parent.endCombat();
    }
    this.setState(
      this.endTurn({
        selectMonster: null,
        awaitCommand: false,
        log: log,
        instructions: ""
      })
    );
  }

  heal() {
    this.props.player.heal(20);
    this.props.player.money -= 30;
    this.setState(this.endTurn({ log: ["You heal for 20"] }));
  }

  endTurn(state) {
    var self = this;
    var log = state.log;
    this.props.monster.map(function (monster, index) {
      let crit = monster.stats.checkCrit();
      let damage = monster.stats.hit(self.props.player.stats, crit);
      log.push(
        (crit ? "CRITICAL! " : "") + monster.name + " hit you for " + damage
      );
      return true;
    });

    state.log = log;
    return state;
  }

  render() {
    var playerwidth = {
      width:
        (this.props.player.stats.health / this.props.player.stats.maxhealth) *
          100 +
        "%"
    };
    var self = this;

    return (
      <div className="App container">
        <div>{this.props.player.money}</div>
        <div>{this.state.instructions}</div>
        <div class="row">
          {this.props.monster.map(function (monster, index) {
            var enemywidth = {
              width:
                (monster.stats.health / monster.stats.maxhealth) * 100 + "%"
            };
            var style = { cursor: "pointer" };
            if (self.state.awaitCommand === false) {
              style = {};
            }

            return (
              <div class="col">
                <img
                  src={monster.image}
                  alt={monster.name}
                  style={style}
                  onClick={
                    self.state.awaitCommand !== false
                      ? () => self.doFight(monster, index)
                      : undefined
                  }
                />
                <div class="progress" style={{ width: "100%" }}>
                  <div
                    class="progress-bar bg-danger"
                    role="progressbar"
                    aria-label="Enemy Health"
                    style={enemywidth}
                    aria-valuenow={monster.health}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
        {!this.state.awaitCommand && (
          <div>
            <button type="button" class="btn btn-primary" onClick={this.fight}>
              Fight
            </button>
            &nbsp;
            <button type="button" class="btn btn-primary" onClick={this.heal}>
              Heal - 10
            </button>
          </div>
        )}
        <div class="progress" style={{ width: "50%" }}>
          <div
            class="progress-bar bg-success"
            role="progressbar"
            aria-label="Enemy Health"
            style={playerwidth}
            aria-valuenow={this.state.health}
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>
        <div>
          {this.state.log.map(function (str) {
            return <div>{str}</div>;
          })}
        </div>
      </div>
    );
  }
}
