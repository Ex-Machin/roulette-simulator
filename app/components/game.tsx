"use client"

import { MouseEventHandler, useState } from 'react';


interface SquareProps {
  index: string;
  cursor: string
  onSquareClick: MouseEventHandler<HTMLButtonElement>;
}

interface BoardProps {
  squares: any;
  setSquares: Function;
  cursor: string;
  setCursor: Function;
}

interface ChipProps {
  value: number;
  onCursorClick: MouseEventHandler<HTMLButtonElement>;
}

function Chip({ value, onCursorClick }: ChipProps) {
  return (
    <button className='chip' onClick={onCursorClick}>
      <img src={`./chips/${value}.png`} alt="chip_icon" />
    </button>
  )
}

function Square({ index, cursor, onSquareClick }: SquareProps) {
  const color = "square_button " + (Number(index) % 2 === 0 ? "black" : "red");
  const [chip, setChip] = useState<null | string>(null);

  const handleSquareClick = (e: any) => {
    if (cursor !== '') {
      setChip(cursor);
      onSquareClick(e);
    }
  };
  return (
    <div className='square'>
      <button className={color} onClick={(e) => handleSquareClick(e)}>
        {index}
      </button>
      {chip &&
        <img src={`./cursors/${chip}.png`} alt="chip_icon" className='chip_icon' />
      }
    </div>
  );
}

function Board({ squares, setSquares, cursor, setCursor }: BoardProps) {

  function handleClick(i: number) {
    const nextSquares = squares.slice();
    nextSquares[i][i] += Number(cursor);
    setSquares(nextSquares);
  }

  const changeCursor = (value: string) => {
    setCursor((prevState: string) => {
      if (prevState === value) {
        return ""
      }



      return value;
    });
  }

  return (
    <>
      <div className="board-row" key={0}>
        <Square
          key={0}
          index="0"
          cursor={cursor}
          onSquareClick={(e) => handleClick(0)}
        />
      </div>
      {Array.from({ length: 12 }, (_, rowIndex) => (
        <div className="board-row" key={rowIndex + 1}>
          {Array.from({ length: 3 }, (_, colIndex) => {
            const index = rowIndex * 3 + colIndex + 1;
            return (
              <Square
                key={index}
                index={index.toString()}
                cursor={cursor}
                onSquareClick={(e) => handleClick(index)}
              />
            );
          })}
        </div>
      ))}
      <div>
        {[5, 10, 25, 100, 500].map((value) => {
          return <Chip key={value} value={value} onCursorClick={() => changeCursor(value.toString())} />
        })}
      </div>
    </>
  );
}


export default function Game() {
  const [squares, setSquares] = useState(Array.from({ length: 37 }, (_, i) => ({ [i.toString()]: 0 })));
  const [cursor, setCursor] = useState('');


  return (
    <div className="game" style={{ cursor: `url(./cursors/${cursor}.png), auto` }}>
      <div className="game-board">
        <Board squares={squares} setSquares={setSquares} cursor={cursor} setCursor={setCursor} />
      </div>
    </div>
  );
}