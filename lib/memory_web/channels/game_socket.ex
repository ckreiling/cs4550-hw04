defmodule MemoryWeb.Channel do
  use Phoenix.Channel

  import Memory.Game

  def join "games:" <> id, _message, socket do
    { :ok, Memory.Game.get_game_state(id), socket }
  end

  def handle_in "reset_game", _params, socket do
    "games:" <> id = socket.topic
    broadcast! socket, "new_game_state", Memory.Game.reset_game(id)
    { :noreply, socket }
  end

  def handle_in "tile_clicked", %{"tile" => tile}, socket do
    "games:" <> id = socket.topic
    broadcast! socket, "new_game_state", Memory.Game.tile_clicked(id)
    { :noreply, socket }
  end
end