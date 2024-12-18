"use client"

import { MouseEventHandler, useEffect, useState } from 'react';

interface SquareProps {
  index: string;
  cursor: string
  onSquareClick: MouseEventHandler<HTMLButtonElement>;
  first_bet_audio: HTMLAudioElement
  second_bet_audio: HTMLAudioElement
}

interface BoardProps {
  squares: any;
  onPlay: Function;
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

function Square({ index, cursor, onSquareClick, first_bet_audio, second_bet_audio }: SquareProps) {
  const color = "square_button " + (Number(index) % 2 === 0 ? "black" : "red");
  const [chip, setChip] = useState<null | string>(null);

  const handleSquareClick = (e: any) => {
    if (cursor !== '') {
      if (chip) {
        second_bet_audio.play();
      } else {
        first_bet_audio.play();
      }
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

function Board({ squares, onPlay, cursor, setCursor }: BoardProps) {
  const first_bet_audo = new Audio('./audio/first_bet.mp3')
  const second_bet_audio = new Audio('./audio/second_bet.mp3')

  useEffect(() => {
    console.log("squares", squares);
  }, [])
  

  function handleClick(i: number) {
    squares = squares.map((square: any) => ({ ...square }));
    squares[i][i] += Number(cursor);
    onPlay(squares);
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
          onSquareClick={() => handleClick(0)}
          first_bet_audio={first_bet_audo}
          second_bet_audio={second_bet_audio}
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
                onSquareClick={() => handleClick(index)}
                first_bet_audio={first_bet_audo}
                second_bet_audio={second_bet_audio}
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
  const [history, setHistory] = useState([Array.from({ length: 37 }, (_, i) => ({ [i.toString()]: 0, "lastChip": null }))]);
  let currentSquares = history[history.length - 1]


  function handlePlay(nextSquares: { [key: string]: number }[]) {
    const deepCopiedSquares = nextSquares.map((square: any) => ({ ...square })); 
    setHistory([...history, deepCopiedSquares]);
  }

  function goBack() {
    if (history.length > 1) {
      setHistory((prevHistory) => prevHistory.slice(0, -1));
    }
  }
  

  return (
    <div className="game" style={{ cursor: `url(./cursors/${cursor}.png), auto` }}>
      <div className="game-board">
        <Board squares={currentSquares} onPlay={handlePlay} cursor={cursor} setCursor={setCursor} />
      </div>
      <div className="game-info">
        <button onClick={() => goBack()}>Go Back</button>
      </div>
    </div>
  );
}