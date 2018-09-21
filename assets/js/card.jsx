import React from "react";

export default function Card({ selected, name, completed, clicked, frozen }) {
  if (completed) {
    return <span>{name} found</span>;
  } else if (selected) {
    return <span>{name}</span>;
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
