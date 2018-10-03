defmodule MemoryWeb.Channel do
  use Phoenix.Channel

  import Memory.Game

  def join "games:" <> id, _message, socket do
    # TODO make sure the following push is accepted by the client
    push socket, id, Memory.Game.get_game_state(id)
    { :ok, socket }
  end

  def handle_in "reset_game", %{"id" => id}, socket do
    # TODO reset the game
    # TODO broadcast the new game state to all listeners with the "new_game_state" tag
  end

  def handle_in "tile_clicked", %{"id" => id}, socket do
    # TODO call the tile_clicked function to get the new game state
    # TODO broadcast the new game state to all listeners with the "new_game_state" tag
  end
end