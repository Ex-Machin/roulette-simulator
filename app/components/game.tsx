"use client"

import { useState } from 'react';
import getRouletteColor from '../utils/functions';
import Board from './Board';
import { Square } from '../interfaces/interfaces';
import { black, even, nineteenTo36, odd, oneTo12, oneTo18, red, thirteenTo24, twentyfiveTo36 } from '../utils/ranges';
import { RouletteButton } from './RoulleteButton';


export default function Game() {
  const initialState: Square[][] = [Array.from({ length: 37 }, (_, i) => ({ "bet": 0, "lastChip": null, "hover": null, "color": getRouletteColor(i) }))]
  const first_bet_audio = new Audio('./audio/first_bet.mp3')
  const second_bet_audio = new Audio('./audio/second_bet.mp3')

  const [cursor, setCursor] = useState('');
  const [history, setHistory] = useState(initialState);
  const [hovered, setHovered] = useState(Array.from({ length: 37 }, () => false))
  const [bets, setBets] = useState<Record<number, string>[]>([])
  const [highlightedCombination, setHighlightedCombination] = useState<number[]>([]);

  let currentSquares = history[history.length - 1]

  function handlePlay(i: number) {
    if (cursor !== '') {
      const updatedSquares = currentSquares.map((square) => ({ ...square }));

      updatedSquares[i].bet += Number(cursor);
      if (updatedSquares[i].lastChip) {
        second_bet_audio.play();
      } else {
        first_bet_audio.play();
      }
      updatedSquares[i].lastChip = cursor;

      setBets([...bets, { [i]: cursor }])
      setHistory([...history, updatedSquares]);
    }
  }

  function goBack() {
    if (history.length > 1) {
      setHistory((prevHistory) => prevHistory.slice(0, -1));
      setBets((prevBets) => prevBets.slice(0, -1));
    }
  }

  function setHoverState(range: number[], isHovering: boolean) {
    const updatedSquares = currentSquares.map((_, index) => range.includes(index) && isHovering);
    setHovered([...updatedSquares])
  }

  function onSelect(bet: string) {
    if (cursor) {
      if (bets.some(obj => obj.hasOwnProperty(bet))) {
        second_bet_audio.play();
      } else {
        first_bet_audio.play();
      }
      setBets([...bets, { [bet]: cursor }])
    }
  }

  const onMouseMove = (index: number, x: number, width: number, y: number, height: number) => {
    if (index < 0 || index >= currentSquares.length) {
      setHighlightedCombination([]);
      return;
    }

    const relativeWidthPosition = x / width;
    const relativeHeightPosition = y / height;

    const rightBlock = new Set([3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36]);
    const leftBlock = new Set([1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34]);

    let combination = new Set([index]);

    if (index == 0) {
      if (relativeHeightPosition >= 0.8) {
        const widthRanges = [
          { range: [0, 0.2], indices: [index + 1] },
          { range: [0.2, 0.4], indices: [index + 1, index + 2] },
          { range: [0.4, 0.6], indices: [index + 2] },
          { range: [0.6, 0.8], indices: [index + 2, index + 3] },
          { range: [0.8, 1], indices: [index + 3] }
        ];

        widthRanges.forEach(({ range, indices }) => {
          if (relativeWidthPosition > range[0] && relativeWidthPosition <= range[1]) {
            indices.forEach(idx => combination.add(idx)); // Добавляем индексы в комбинацию
          }
        });

      }
      setHighlightedCombination(Array.from(combination));
      return;
    }

    if (relativeHeightPosition >= 0.2 && relativeHeightPosition <= 0.8) {

    } else {
      const delta = relativeHeightPosition > 0.8 ? 3 : -3;
      const neighborIndex = index + delta;

      if (
        neighborIndex >= 0 && neighborIndex < currentSquares.length
      ) {

        if (relativeWidthPosition <= 0.2) {
          if (leftBlock.has(index) && leftBlock.has(neighborIndex)) {
            combination.add(index)
            combination.add(index + 1)
            combination.add(index + 2)

            combination.add(neighborIndex + 1)
            combination.add(neighborIndex + 2)
          }
        }
        else if (relativeWidthPosition >= 0.8) {
          if (rightBlock.has(index) && rightBlock.has(neighborIndex)) {
            combination.add(index)
            combination.add(index - 1)
            combination.add(index - 2)

            combination.add(neighborIndex - 1)
            combination.add(neighborIndex - 2)
          }
        }

        combination.add(neighborIndex);

      }
    }

    if (relativeWidthPosition >= 0.2 && relativeWidthPosition <= 0.8) {
    } else {
      const delta = relativeWidthPosition > 0.8 ? 1 : -1;
      const neighborIndex = index + delta;

      if (
        neighborIndex >= 0 && neighborIndex < currentSquares.length &&
        !(delta === 1 && rightBlock.has(index)) &&
        !(delta === -1 && leftBlock.has(index))
      ) {
        combination.add(neighborIndex);
      }
    }

    if (combination.size === 3) {
      const sortedCombination = Array.from(combination).sort((a, b) => a - b);

      // up-left side corner
      if (relativeHeightPosition <= 0.2 && relativeWidthPosition <= 0.2) {
        combination.add(sortedCombination[1] - 3)
      }

      // up-right side corner
      if (relativeHeightPosition <= 0.2 && relativeWidthPosition >= 0.8) {
        combination.add(sortedCombination[2] - 3)
      }

      // bottom-left side corner 
      if (relativeHeightPosition >= 0.8 && relativeWidthPosition <= 0.2) {
        combination.add(sortedCombination[0] + 3)
      }

      // bottom-right side corner 
      if (relativeHeightPosition >= 0.8 && relativeWidthPosition >= 0.8) {
        combination.add(sortedCombination[1] + 3)
      }
    }

    setHighlightedCombination(Array.from(combination));
  };

  const onMouseLeave = () => {
    setHighlightedCombination([]);
  };


  return (
    <div className="game" style={{ cursor: `url(./cursors/${cursor}.png) 10 10, auto` }}>
      <div className="game-board">
        <Board squares={currentSquares} hovered={hovered} onPlay={handlePlay} setCursor={setCursor} highlightedCombination={highlightedCombination} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}/>
      </div>
      <div className="game-info">
        <button onClick={() => goBack()}>Go Back</button>
        <button onClick={() => { setHistory(initialState); setBets([]) }}>Clear</button>
        <RouletteButton label='1-18' range={oneTo18} onSelect={(label) => onSelect(label)} onHover={setHoverState} />
        <RouletteButton label='19-36' range={nineteenTo36} onSelect={onSelect} onHover={setHoverState} />
        <RouletteButton label='1-12' range={oneTo12} onSelect={onSelect} onHover={setHoverState} />
        <RouletteButton label='13-24' range={thirteenTo24} onSelect={onSelect} onHover={setHoverState} />
        <RouletteButton label='25-36' range={twentyfiveTo36} onSelect={onSelect} onHover={setHoverState} />
        <RouletteButton label='Even' range={even} onSelect={onSelect} onHover={setHoverState} />
        <RouletteButton label='Odd' range={odd} onSelect={onSelect} onHover={setHoverState} />
        <RouletteButton label='Red' range={red} onSelect={onSelect} onHover={setHoverState} />
        <RouletteButton label='Black' range={black} onSelect={onSelect} onHover={setHoverState} />
      </div>
    </div>
  );
}