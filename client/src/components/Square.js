import React from "react";

// Tic Tac Toe Blokları
function Square({ chooseSquare, val }) {
  return (
    <div className="glow-on-hover-table" onClick={chooseSquare}>
      <p>
      {val}
      </p>
    </div>
  );
}

export default Square;
