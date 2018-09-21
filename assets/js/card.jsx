import React from "react";

export default function Card({ selected, name, completed, clicked, frozen }) {
  if (completed) {
    return <div>{name} found</div>;
  } else if (selected) {
    return <div>{name}</div>;
  } else {
    return (
      <button
        onClick={frozen ? () => console.log("game is frozen....") : clicked}
      >
        ...click here
      </button>
    );
  }
}
