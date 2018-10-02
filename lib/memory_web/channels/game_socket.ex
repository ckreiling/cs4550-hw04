defmodule MemoryWeb.Channel do
  use Phoenix.Channel

  import Memory.Game

  def join("games:lobby", _message, socket) do
    push socket, "lobby", Memory.Game.get_lobby
    { :ok, socket }
  end

  def join("games:" <> id, _message, socket) do
    if Memory.Game.new_game id == :ok do
      broadcast! socket, "new_game", %{id => id}
    end
    push socket, id, Memory.Game.get_game_state(id)
    { :ok, socket }
  end
end