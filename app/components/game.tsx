"use client"

import { useState } from 'react';
import getRouletteColor from '../utils/functions';
import Board from './board';


export default function Game() {
  const initialState = [Array.from({ length: 37 }, (_, i) => ({ "bet": 0, "lastChip": null, "hover": null, "color": getRouletteColor(i)}))]
  const first_bet_audio = new Audio('./audio/first_bet.mp3')
  const second_bet_audio = new Audio('./audio/second_bet.mp3')

  const [cursor, setCursor] = useState('');
  const [history, setHistory] = useState(initialState);

  let currentSquares = history[history.length - 1]

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
    setHistory(initialState)
  }
  

  return (
    <div className="game" style={{ cursor: `url(./cursors/${cursor}.png), auto` }}>
      <div className="game-board">
        <Board squares={currentSquares} onPlay={handlePlay} setCursor={setCursor} />
      </div>
      <div className="game-info">
        <button onClick={() => goBack()}>Go Back</button>
        <button onClick={() => clear()}>Clear</button>
      </div>
    </div>
  );
}