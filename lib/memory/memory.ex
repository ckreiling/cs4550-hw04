defmodule Memory.Game do
  use Agent

  @doc """
  Starts the memory game agent, ready to spin up new games
  """
  def start_link _args do
    Agent.start_link fn -> Map.new end, name: __MODULE__
  end

  @doc """
  Returns the list of keys associated with the lobby.
  """
  def get_lobby do
    Agent.get __MODULE__, &Map.keys(&1)
  end

  @doc """
  Starts a new game with the given ID.

  Returns :ok if the ID isn't taken, or :already_exists if the ID is taken.
  """
  def new_game id do
    Agent.get_and_update __MODULE__, fn lobby ->
      if not Map.has_key? lobby, id do
        { :ok, Map.put(lobby, id, initial_state) }
      else
        { :already_exists, lobby }
      end
    end
  end

  @doc """
  Gets the game state for a single game.
  """
  def get_game_state id do
    Agent.get __MODULE__, &Map.get(&1, id)
  end

  @doc """
  Initial state for a single memory game.
  """
  defp initial_state do
    %{
      :hello => "world"
    }
  end
end
