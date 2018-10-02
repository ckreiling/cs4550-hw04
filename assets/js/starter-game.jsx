import React from "react";
import ReactDOM from "react-dom";

import Card from "./card";
import GameClient from "./game-client";
import stateReducer from "./state-reducer";

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
      secondSelected: null,
      timeoutId: null
    },
    tilesState
  );

class App extends React.Component {
  constructor(props) {
    super(props);

    this.reset = this.reset.bind(this);
    this.tileClicked = this.tileClicked.bind(this);
    this.dispatch = this.dispatch.bind(this);

    this.client = new GameClient(this.dispatch, window.gameName);
    this.state = {
      gameId: window.gameName
    };
  }

  // Connecting function between the client and this component's state.
  dispatch({ payload, type }) {
    if (!payload || !type) {
      console.error(
        "Payload or type are not present in the dispatched action:",
        {
          payload,
          type
        }
      );
      return;
    }
    this.setState(state => stateReducer(state, { type, payload }));
  }

  // Reset the game
  reset() {
    this.client.resetCurrentGame();
  }

  // returns a function that will be called if a card is clicked.
  tileClicked(tile) {
    return () => {
      this.client.tileClicked(tile);
    };
  }

  render() {
    const { gameState, gameId } = this.state;
    return (
      <div className="app-container">
        <h2>Current game: {gameId}</h2>
        <div className="memory-container">
          {gameState.tilesRandomOrder.map(key => {
            const name = key.split("")[0];
            return (
              <Card
                frozen={gameState.frozen}
                key={key}
                name={name}
                selected={gameState[key]}
                completed={gameState[`${name}1`] && gameState[`${name}2`]}
                clicked={this.tileClicked(key)}
              />
            );
          })}
        </div>
        <button className="restart-button" onClick={this.reset}>
          Restart game
        </button>
        <div>Clicks in this game: {gameState.numClicks}</div>
      </div>
    );
  }
}
