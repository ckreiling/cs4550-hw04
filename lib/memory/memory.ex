defmodule Memory.Game do
  use Agent

  @doc """
  Starts the memory game agent, ready to spin up new games
  """
  def start_link _args do
    Agent.start_link fn -> Map.new end, name: __MODULE__
  end

  @doc """
  Gets the game state for a single game. If the game isn't started, it will be
  created with an initial state
  """
  def get_game_state id do
    Agent.get_and_update __MODULE__, fn lobby ->
      if not Map.has_key? lobby, id do
        { initial_state, Map.put(lobby, id, initial_state) }
      else
        { Map.get(lobby, id), lobby }
      end
    end
  end

  def reset_game id do
    # TODO implement the reset game functionality.
    # CHALLENGE: make sure the timeout is cancelled before resetting
  end

  @doc """
  Updates the state for the game associated with the given id, and returns it.
  """
  def tile_clicked id do
    # TODO implement tile clicked functionality
  end

  defp tiles do 
    letters = ["H", "G", "F", "E", "D", "C", "B", "A"]
    Enum.reduce letters, [], &([ "#{&1}1" | ["#{&1}2" | &2]]) 
  end

  defp tiles_random do
    # TODO need to randomize tiles...
    tiles
  end

  defp tiles_map do
    Enum.reduce tiles, Map.new, &Map.put(&2, &1, false)
  end

  defp initial_state do
    base_state = %{
      :num_clicks => 0,
      :frozen => false,
      :tiles_random_order => tiles_random,
      :first_selected => nil,
      :second_selected => nil,
    }
    Map.merge base_state, tiles_map
  end
end
