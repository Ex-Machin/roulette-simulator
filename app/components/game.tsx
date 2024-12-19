"use client"

import { MouseEventHandler, useEffect, useState } from 'react';

interface SquareProps {
  index: string;
  chip: null | string;
  onSquareClick: MouseEventHandler<HTMLButtonElement>;
}

interface BoardProps {
  squares: any;
  onPlay: Function;
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

function Square({ index, chip, onSquareClick, }: SquareProps) {
  const color = "square_button " + (Number(index) % 2 === 0 ? "black" : "red");

  return (
    <div className='square'>
      <button className={color} onClick={(i) => onSquareClick(i)}>
        {index}
      </button>
      {chip &&
        <img src={`./cursors/${chip}.png`} alt="chip_icon" className='chip_icon' />
      }
    </div>
  );
}

function Board({ squares, onPlay, setCursor }: BoardProps) {

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
          chip={squares[0].lastChip}
          onSquareClick={() =>  onPlay(0)}
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
                chip={squares[index].lastChip}
                onSquareClick={() => onPlay(index)}
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
  const [cursor, setCursor] = useState('');
  const [history, setHistory] = useState([Array.from({ length: 37 }, () => ({ "bet": 0, "lastChip": null }))]);

  let currentSquares = history[history.length - 1]

  const first_bet_audio = new Audio('./audio/first_bet.mp3')
  const second_bet_audio = new Audio('./audio/second_bet.mp3')

  function handlePlay(i: number) {
    if (cursor !== '') {
      const updatedSquares = currentSquares.map((square: any) => ({ ...square }));
  
      updatedSquares[i].bet += Number(cursor);
      if (updatedSquares[i].lastChip) {
        second_bet_audio.play();
      } else {
        first_bet_audio.play();
      }
      updatedSquares[i].lastChip = cursor;
  
      setHistory([...history, updatedSquares]);
    }
  }

  function goBack() {
    if (history.length > 1) {
      setHistory((prevHistory) => prevHistory.slice(0, -1));
    }
  }

  function clear() {
    setHistory([Array.from({ length: 37 }, () => ({ "bet": 0, "lastChip": null }))])
  }
  

  return (
    <div className="game" style={{ cursor: `url(./cursors/${cursor}.png), auto` }}>
      <div className="game-board">
        <Board squares={{...currentSquares}} onPlay={handlePlay} setCursor={setCursor} />
      </div>
      <div className="game-info">
        <button onClick={() => goBack()}>Go Back</button>
        <button onClick={() => clear()}>Clear</button>
      </div>
    </div>
  );
}