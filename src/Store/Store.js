import React from "react";

export default class Store extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.heal = this.heal.bind(this);
    this.endStore = this.endStore.bind(this);
  }

  heal() {
    this.props.player.stats.healAll();
    this.props.player.money -= 10;
    this.setState({});
  }

  endStore() {
    this.props.parent.endStore();
  }

  render() {
    return (
      <div>
        <div>{this.props.player.money}</div>
        <div>
          {this.props.player.stats.health !==
            this.props.player.stats.maxhealth && (
            <button type="button" class="btn btn-primary" onClick={this.heal}>
              Heal - 10
            </button>
          )}
        </div>
        <div>
          <button type="button" class="btn btn-primary" onClick={this.endStore}>
            End Store
          </button>
        </div>
      </div>
    );
  }
}
