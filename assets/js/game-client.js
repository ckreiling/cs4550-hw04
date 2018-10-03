// NOTE: The contents of this file will only be executed if
// you uncomment its entry in "assets/js/app.js".

// To use Phoenix channels, the first step is to import Socket,
// and connect at the socket path in "lib/web/endpoint.ex".
//
// Pass the token on params as below. Or remove it
// from the params if you are not using authentication.
import { Socket } from "phoenix";
import events from "./events";

function logSuccess(resp) {
  console.log("Successful action:", resp);
}

/**
 * Object for managing the websocket connection to the database. After a single
 * connection, it will call all of the different subscribers.
 *
 * Kind of acts like an action creator, but also dispatches actions when events
 * come from the server
 * @param {Array[Function]} subscriber
 */
export default function GameClient(subscriber, id) {
  this._subscriber = subscriber;

  this._socket = new Socket("/socket");
  this._socket.connect();

  this._gameChannel = this._socket.channel(`games:${id}`);

  // TODO serialize the payload in this listener from snake_case to camelCase
  this._gameChannel.on(events.NEW_GAME_STATE, payload => {
    this._subscriber({ type: events.NEW_GAME_STATE, payload });
  });

  this._gameChannel
    .join()
    .receive("ok", resp => {
      console.log("Joined game room successfully", resp);
    })
    .receive("error", resp => {
      console.log("Unable to join game room", resp);
    });
}

GameClient.prototype.tileClicked = function(tile) {
  this._gameChannel
    .push(events.TILE_CLICKED, { tile })
    .receive("ok", logSuccess)
    .receive("error", resp => console.log("Tile clicked has an error..."));
};

GameClient.prototype.resetCurrentGame = function() {
  this._gameChannel
    .push(events.USER_RESET)
    .receive("ok", logSuccess)
    .receive("error", resp => console.log("Reset failed", resp));
};
