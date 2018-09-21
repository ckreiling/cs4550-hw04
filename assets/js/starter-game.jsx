import React from "react";
import ReactDOM from "react-dom";
import _ from "lodash";

import Card from "./card";

export default function game_init(root) {
  ReactDOM.render(<App />, root);
}

const allLetters = ["A", "B", "C", "D", "E", "F", "G", "H"];

// Every possible tile name, indexed.
const tiles = allLetters.reduce((acc, letter) => {
  acc.push(`${letter}1`, `${letter}2`);
  return acc;
}, []);

// Tiles in the form of a key-value map, each with the value 'false'
const tilesState = tiles.reduce((acc, letterNumber) => {
  acc[letterNumber] = false;
  return acc;
}, {});

// best to keep state shallow
const getInitialAppState = () =>
  Object.assign(
    {},
    {
      numClicks: 0, // The number of times the user clicks in the game
      frozen: false, // is the game frozen? means all buttnos should not work
      tilesRandomOrder: tiles
        .slice() // copy the array, don't want to sort the original
        .sort(() => 0.5 - Math.random() * Math.random()),
      firstSelected: null,
      secondSelected: null
    },
    tilesState
  );

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = getInitialAppState();

    this.reset = this.reset.bind(this);
    this.tileClicked = this.tileClicked.bind(this);
    this.firstTileClicked = this.firstTileClicked.bind(this);
    this.secondTileClicked = this.secondTileClicked.bind(this);
  }

  // Reset the game
  reset() {
    if (this.state.timeoutId) {
      window.clearTimeout(this.state.timeoutId);
    }
    this.setState(getInitialAppState(), () => console.log("Reset the game"));
  }

  firstTileClicked(letter) {
    this.setState({
      firstSelected: letter,
      [letter]: true
    });
  }

  secondTileClicked(letter) {
    const inverseLetter = letter.split("").reduce((acc, x, index) => {
      index == 0 ? (acc = x) : (acc = `${acc}${x == 1 ? 2 : 1}`);
      return acc;
    }, "");
    if (this.state[inverseLetter]) {
      this.setState({
        firstSelected: null,
        secondSelected: null,
        [letter]: true
      });
    } else {
      this.setState(
        {
          frozen: true,
          secondSelected: letter,
          [letter]: true
        },
        () => {
          const timeoutId = setTimeout(() => {
            this.setState(prevState => {
              const { firstSelected, secondSelected } = prevState;
              return {
                frozen: false,
                firstSelected: false,
                secondSelected: false,
                [firstSelected]: false,
                [secondSelected]: false
              };
            });
          }, 3000);
          this.setState({ timeoutId });
        }
      );
    }
  }

  // returns a function that will be called if a card is clicked.
  // the returned function should ONLY be called if the car is not selected.
  tileClicked(letter) {
    return () => {
      this.setState(prevState => ({
        numClicks: prevState.numClicks + 1
      }));
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
        {this.state.tilesRandomOrder.map(key => {
          const name = key.split("")[0];
          return (
            <Card
              frozen={this.state.frozen}
              key={key}
              name={name}
              selected={this.state[key]}
              completed={this.state[`${name}1`] && this.state[`${name}2`]}
              clicked={this.tileClicked(key)}
            />
          );
        })}
        <button onClick={this.reset}>Restart game</button>
        <div>Clicks in this game: {this.state.numClicks}</div>
      </div>
    );
  }
}
