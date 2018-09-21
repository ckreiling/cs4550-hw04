import React from "react";
import ReactDOM from "react-dom";
import _ from "lodash";

import Card from "./card";

export default function game_init(root) {
  ReactDOM.render(<Starter />, root);
}

const allLetters = ["A", "B", "C", "D", "E", "F", "G", "H"];

const tiles = allLetters.reduce((acc, letter) => {
  acc[`${letter}1`] = false;
  acc[`${letter}2`] = false;
  return acc;
}, []);

const StarterInitialState = Object.assign(tiles, {
  // The number of times the user clicks in the game
  numClicks: 0,
  firstSelected: null,
  secondSelected: null
});

class Starter extends React.Component {
  constructor(props) {
    super(props);
    this.state = Object.assign({}, StarterInitialState);

    this.reset = this.reset.bind(this);
    this.tileClicked = this.tileClicked.bind(this);
    this.firstTileClicked = this.firstTileClicked.bind(this);
    this.secondTileClicked = this.secondTileClicked.bind(this);
  }

  reset() {
    this.setState(Object.assign({}, StarterInitialState), () =>
      console.log("Reset the game")
    );
  }

  firstTileClicked(letter) {
    this.setState(prevState => ({
      firstSelected: `${letter}1`,
      numClicks: prevState.numClicks + 1,
      [`${letter}1`]: true
    }));
  }

  secondTileClicked(letter) {
    if (this.state[`${letter}1`]) {
      this.setState(prevState => ({
        numClicks: prevState.numClicks + 1,
        [`${letter}2`]: true
      }));
    } else {
      this.setState(
        {
          frozen: true,
          secondSelected: `${letter}2`,
          [`${letter}2`]: true
        },
        () => {
          setTimeout(() => {
            this.setState(prevState => {
              const { firstSelected, secondSelected, numClicks } = prevState;
              return {
                frozen: false,
                numClicks: numClicks + 1,
                firstSelected: null,
                secondSelected: null,
                [firstSelected]: false,
                [secondSelected]: false
              };
            });
          }, 2000);
        }
      );
    }
  }

  tileClicked(letter) {
    return () => {
      const { firstSelected } = this.state;
      if (firstSelected) {
        this.secondTileClicked(letter);
      } else {
        this.firstTileClicked(letter);
      }
    };
  }

  render() {
    return (
      <div>
        {Object.keys(this.state)
          .filter(key => allLetters.includes(key.split("")[0])) // HACK ALERT
          .map(key => {
            const name = key.split("")[0];
            return (
              <Card
                frozen={this.state.frozen}
                key={key}
                name={name}
                selected={this.state[key]}
                completed={this.state[`${name}1`] && this.state[`${name}2`]}
                clicked={this.tileClicked(name)}
              />
            );
          })}
        <button onClick={this.reset}>Restart game</button>
      </div>
    );
  }
}
