defmodule MemoryWeb.PageController do
  use MemoryWeb, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end

  def game(conn, params) do
    user = get_session(conn, :user)
    if user do
      render conn, "game.html", game: params["game"], user: user
    else
      conn
      |> put_flash(:error, "Must pick a username") # changes taken from course notes
      |> redirect(to: "/")
    end
  end

  def join(conn, %{"join" => %{"user" => user, "game" => game}}) do
    conn
    |> put_session(:user, user)
    |> redirect(to: "/game/#{game}") # changes taken from course notes
  end
end
