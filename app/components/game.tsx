"use client"

import { MouseEventHandler, useState } from 'react';


interface SquareProps {
  value: number;
  onSquareClick: MouseEventHandler<HTMLButtonElement>;
}

interface BoardProps {
  squares: any;
  setSquares: Function;
}


function Square({ value, onSquareClick }: SquareProps) {
  const color = "square " + (value % 2 === 0 ? "black" : "red");

  return (
    <button className={color} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ squares, setSquares }: BoardProps) {
  function handleClick(i: number) {
    const nextSquares = squares.slice();
    nextSquares[i] = "X";
    setSquares(nextSquares);
  }

  return (
    <>
      {Array.from({ length: 12 }, (_, rowIndex) => (
        <div className="board-row" key={rowIndex}>
          {Array.from({ length: 3 }, (_, colIndex) => {
            const index = rowIndex * 3 + colIndex;
            return (
              <Square
                key={index}
                value={squares[index + 1]}
                onSquareClick={() => handleClick(index)}
              />
            );
          })}
        </div>
      ))}
    </>
  );
}

export default function Game() {
  const [squares, setSquares] = useState(Array.from({ length: 37 }, (x, i) => i))


  return (
    <div className="game">
      <div className="game-board">
        <Board squares={squares} setSquares={setSquares} />
      </div>
    </div>
  );
}