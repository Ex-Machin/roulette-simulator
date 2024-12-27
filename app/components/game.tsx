"use client";

import { useRef, useState } from "react";
import Board from "./Board";
import {
  allPossibleRoulleteCombinations,
  black,
  even,
  leftBlock,
  leftColumn,
  middleColumn,
  nineteenTo36,
  odd,
  oneTo12,
  oneTo18,
  red,
  rightBlock,
  rightColumn,
  thirteenTo24,
  twentyfiveTo36,
} from "../utils/ranges";
import { RouletteButton } from "./RoulleteButton";

export type Square = {
  bet: number;
  lastChip: null | string;
  hover: null | boolean;
  combinations: Record<"top" | "left" | "chip", number | string>[]
};

export default function Game() {
  const initialState: Square[][] = [Array.from({ length: 37 }, (_, i) => ({
    bet: 0,
    lastChip: null,
    hover: null,
    combinations: []
  })),
  ];
  const first_bet_audio = new Audio("./audio/first_bet.mp3");
  const second_bet_audio = new Audio("./audio/second_bet.mp3");

  const [cursor, setCursor] = useState("");
  const [history, setHistory] = useState(initialState);
  const [hovered, setHovered] = useState(Array.from({ length: 37 }, () => false));
  const [bets, setBets] = useState<Record<number, string>[]>([]);
  const [highlightedCombination, setHighlightedCombination] = useState<number[]>([]);
  const [betCombinationsHistory, setBetCombinationsHistory] = useState<(typeof allPossibleRoulleteCombinations)[]>([allPossibleRoulleteCombinations]);

  let currentSquares = history[history.length - 1];
  let currentBetCombination = betCombinationsHistory[betCombinationsHistory.length - 1];

  function onSquareSelect(i: number) {
    if (cursor !== "") {
      const updatedBetCombination = { ...currentBetCombination };
      let updatedSquares = currentSquares.map((square) => ({ ...square }));
      const joinedCombinations = highlightedCombination.join("/");

      if (highlightedCombination.length > 1) {

        if (updatedBetCombination[joinedCombinations as keyof typeof allPossibleRoulleteCombinations] !== 0) {
          second_bet_audio.play();
        } else {
          first_bet_audio.play();
        }
        updatedBetCombination[joinedCombinations as keyof typeof allPossibleRoulleteCombinations] += Number(cursor);

        setBetCombinationsHistory([
          ...betCombinationsHistory,
          updatedBetCombination,
        ]);

        updatedSquares = calculatePositions(updatedSquares, cursor)
        setBets([...bets, { [highlightedCombination.join("/")]: cursor }]);
      } else {
        
        updatedSquares[i].bet += Number(cursor);
        if (updatedSquares[i].lastChip) {
          second_bet_audio.play();
        } else {
          first_bet_audio.play();
        }
        updatedSquares[i].lastChip = cursor;
        
        setBets([...bets, { [i]: cursor }]);
        // To keep history the same
        setBetCombinationsHistory([...betCombinationsHistory, updatedBetCombination])
      }
      
      
      setHistory([...history, updatedSquares]);

    }
  }

  function calculatePositions(squares: Square[], cursor: string) {
    const firsHighlightedElement = Number(highlightedCombination[0]);
    const secondHighlightedElement = Number(highlightedCombination[1]);

    if (highlightedCombination.includes(0)) {

      if (highlightedCombination.length === 3) {
        const thirdElement = highlightedCombination[2]

        squares[thirdElement].combinations = [...squares[thirdElement].combinations, { "top": 0, "left": 0, "chip": cursor }]

      } else if (highlightedCombination.length === 2) {
        squares[secondHighlightedElement].combinations = [...squares[secondHighlightedElement].combinations, { "top": 0, "left": 50, "chip": cursor }]
      } else {
        squares[secondHighlightedElement].combinations = [...squares[secondHighlightedElement].combinations, { "top": 0, "left": 0, "chip": cursor }]

      }

      return squares
    }

    if (highlightedCombination.length === 2) {

      // 2 row highlithed elements 
      if (firsHighlightedElement + 1 === highlightedCombination[1]) {
        squares[firsHighlightedElement].combinations = [...squares[firsHighlightedElement].combinations, { "top": 50, "left": 100, "chip": cursor }]
      }
      // 2 columns highlighted elements
      if (firsHighlightedElement + 3 === highlightedCombination[1]) {
        squares[firsHighlightedElement].combinations = [...squares[firsHighlightedElement].combinations, { "top": 100, "left": 50, "chip": cursor }]
      }
    }

    if (highlightedCombination.length === 3) {

      squares[firsHighlightedElement].combinations = [...squares[firsHighlightedElement].combinations, { "top": 50, "left": 0, "chip": cursor }]

    }

    if (highlightedCombination.length === 4) {
      squares[firsHighlightedElement].combinations = [...squares[firsHighlightedElement].combinations, { "top": 100, "left": 100, "chip": cursor }]
    }

    if (highlightedCombination.length === 6) {

      squares[firsHighlightedElement].combinations = [...squares[firsHighlightedElement].combinations, { "top": 100, "left": 0, "chip": cursor }]

    }

    return squares
  }

  function goBack() {
    if (history.length > 1) {
      setHistory((prevHistory) => prevHistory.slice(0, -1));
      setBets((prevBets) => prevBets.slice(0, -1));
      setBetCombinationsHistory((prevBetCombinations) => prevBetCombinations.slice(0, -1));
    }
  }

  function onClear() {
    if (history.length > 1) {
      setHistory(initialState);
      setBets([]);
      setBetCombinationsHistory([allPossibleRoulleteCombinations])
    }
  }

  function setHoverState(range: number[], isHovering: boolean) {
    const updatedSquares = currentSquares.map((_, index) => range.includes(index) && isHovering);
    setHovered([...updatedSquares]);
  }

  function onRangeSelect(bet: string) {
    if (cursor) {
      if (bets.some((obj) => obj.hasOwnProperty(bet))) {
        second_bet_audio.play();
      } else {
        first_bet_audio.play();
      }

      setBets([...bets, { [bet]: cursor }]);
    }
  }

  const onMouseMove = (index: number, x: number, width: number, y: number, height: number) => {
    if (index < 0 || index >= currentSquares.length) {
      setHighlightedCombination([]);
      return;
    }

    const relativeWidthPosition = x / width;
    const relativeHeightPosition = y / height;

    let combination = new Set([index]);

    if (index === 0) {
      if (relativeHeightPosition >= 0.8) {

        const widthRanges = [
          { range: [0, 0.2], indices: [index + 1] },
          { range: [0.2, 0.4], indices: [index + 1, index + 2] },
          { range: [0.4, 0.6], indices: [index + 2] },
          { range: [0.6, 0.8], indices: [index + 2, index + 3] },
          { range: [0.8, 1], indices: [index + 3] },
        ];

        widthRanges.forEach(({ range, indices }) => {
          if (
            relativeWidthPosition >= range[0] &&
            relativeWidthPosition <= range[1]
          ) {
            indices.forEach((idx) => combination.add(idx)); // Добавляем индексы в комбинацию
          }
        });
      }
      setHighlightedCombination(Array.from(combination).sort((a, b) => a - b));
      return;
    }


    if (!(relativeHeightPosition >= 0.2 && relativeHeightPosition <= 0.8)) {
      const delta = relativeHeightPosition >= 0.8 ? 3 : -3;
      const neighborIndex = index + delta;

      if (neighborIndex >= 0 && neighborIndex < currentSquares.length) {
        if (relativeWidthPosition <= 0.2) {
          if (leftBlock.has(index)) {
            combination.add(index);
            combination.add(index + 1);
            combination.add(index + 2);

            combination.add(neighborIndex + 1);
            combination.add(neighborIndex + 2);
          }
        } else if (relativeWidthPosition >= 0.8) {
          if (rightBlock.has(index)) {
            if (index === 3 && relativeHeightPosition <= 0.8) {
              combination.add(index);
              combination.add(index - 1);
              combination.add(index - 2);
              combination.add(index - 3);

              setHighlightedCombination(Array.from(combination).sort((a, b) => a - b));
              return;
            } else {
              combination.add(index);
              combination.add(index - 1);
              combination.add(index - 2);

              combination.add(neighborIndex - 1);
              combination.add(neighborIndex - 2);
            }
          }
        }

        combination.add(neighborIndex);
      }
    }

    // 1 row from 
    if (rightBlock.has(index) && relativeWidthPosition >= 0.8) {
      combination.add(index)
      combination.add(index - 1)
      combination.add(index - 2)

      setHighlightedCombination(Array.from(combination).sort((a, b) => a - b));
      return;
    }

    // 1 row
    if (leftBlock.has(index) && relativeWidthPosition <= 0.2) {
      combination.add(index)
      combination.add(index + 1)
      combination.add(index + 2)

      setHighlightedCombination(Array.from(combination).sort((a, b) => a - b));
      return;
    }

    if (!(relativeWidthPosition >= 0.2 && relativeWidthPosition <= 0.8)) {
      const delta = relativeWidthPosition > 0.8 ? 1 : -1;
      const neighborIndex = index + delta;

      if (
        neighborIndex >= 0 &&
        neighborIndex < currentSquares.length &&
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
        combination.add(sortedCombination[1] - 3);
      }

      // up-right side corner
      if (relativeHeightPosition <= 0.2 && relativeWidthPosition >= 0.8) {
        combination.add(sortedCombination[2] - 3);
      }

      // bottom-left side corner
      if (relativeHeightPosition >= 0.8 && relativeWidthPosition <= 0.2) {
        combination.add(sortedCombination[0] + 3);
      }

      // bottom-right side corner
      if (relativeHeightPosition >= 0.8 && relativeWidthPosition >= 0.8) {
        combination.add(sortedCombination[1] + 3);
      }
    }

    setHighlightedCombination(Array.from(combination).sort((a, b) => a - b));
  };

  const onMouseLeave = () => {
    setHighlightedCombination([]);
  };

  return (
    <div
      className="game"
      style={{ cursor: `url(./cursors/${cursor}.png) 10 10, auto` }}
    >
      <div className="game-board">
        <Board
          squares={currentSquares}
          hovered={hovered}
          onSquareSelect={onSquareSelect}
          setCursor={setCursor}
          highlightedCombination={highlightedCombination}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
          onRangeSelect={onRangeSelect}
          setHoverState={setHoverState}
        />
      </div>
      <div className="game-info">
        <button onClick={() => goBack()}>Go Back</button>
        <button onClick={() => onClear()}>
          Clear
        </button>
        <RouletteButton
          range={oneTo18}
          onSelect={(betName) => onRangeSelect(betName)}
          onHover={setHoverState}
          betName="1-18"
          displayedLabel="1-18"
        />
        <RouletteButton
          range={nineteenTo36}
          onSelect={(betName) => onRangeSelect(betName)}
          onHover={setHoverState}
          betName="19-36"
          displayedLabel="19-36"
        />
        <RouletteButton
          range={oneTo12}
          onSelect={(betName) => onRangeSelect(betName)}
          onHover={setHoverState}
          betName="1-12"
          displayedLabel="1-12"
        />
        <RouletteButton
          range={thirteenTo24}
          onSelect={(betName) => onRangeSelect(betName)}
          onHover={setHoverState}
          betName="13-24"
          displayedLabel="13-24"
        />
        <RouletteButton
          range={twentyfiveTo36}
          onSelect={(betName) => onRangeSelect(betName)}
          onHover={setHoverState}
          betName="25-36"
          displayedLabel="25-36"
        />
        <RouletteButton
          range={even}
          onSelect={(betName) => onRangeSelect(betName)}
          onHover={setHoverState}
          betName="Even"
          displayedLabel="Even"
          />
        <RouletteButton
          range={odd}
          onSelect={(betName) => onRangeSelect(betName)}
          onHover={setHoverState}
          betName="Odd"
          displayedLabel="Odd"
        />
        <RouletteButton
          range={red}
          onSelect={(betName) => onRangeSelect(betName)}
          onHover={setHoverState}
          betName="Red"
          displayedLabel="Red"
        />

        <RouletteButton
          range={black}
          onSelect={(betName) => onRangeSelect(betName)}
          onHover={setHoverState}
          betName="Black"
          displayedLabel="Black"
        />
      </div>
    </div>
  );
}
