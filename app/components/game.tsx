"use client";

import { useRef, useState } from "react";
import { Square } from "../interfaces/interfaces";
import { getRandomInt } from "../utils/functions";
import {
  black,
  even,
  leftBlock,
  nineteenTo36,
  numbersToDegree,
  odd,
  oneTo12,
  oneTo18,
  red,
  rightBlock,
  thirteenTo24,
  twentyfiveTo36
} from "../utils/ranges";
import Board from "./Board";
import Chip from "./Chip";
import RouletteButton from "./RoulleteButton";
import RouletteButtonColor from "./RoulleteButtonColor";
import Wheel from "./Wheel";

export default function Game() {
  const initialState: Square[][] = [Array.from({ length: 37 }, (_, i) => ({
    bet: 0,
    lastChip: null,
    hover: null,
    combinations: []
  })),
  ];
  const first_bet_audio = useRef(typeof Audio !== "undefined" && new Audio("./audio/first_bet.mp3"));
  const second_bet_audio = useRef(typeof Audio !== "undefined" && new Audio("./audio/second_bet.mp3"))
  const wheelSound = useRef(typeof Audio !== "undefined" && new Audio("./audio/roulette_wheel_sound_effect.mp3"));

  const [cursor, setCursor] = useState("");
  const [history, setHistory] = useState(initialState);
  const [hovered, setHovered] = useState(Array.from({ length: 37 }, () => false));
  const [bets, setBets] = useState<Record<number, string>[]>([]);
  const [highlightedCombination, setHighlightedCombination] = useState<number[]>([]);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [circleRotation, setCircleRotation] = useState<number | null>(null);

  const isWheelSpinning = useRef(false);
  const wheelRequestId = useRef<number | null>(null);
  const circleRequestId = useRef<number | null>(null);
  const wheelSpinned = useRef(false)


  let currentSquares = history[history.length - 1];

  function onSquareSelect(i: number) {
    if (cursor !== "") {
      let updatedSquares = currentSquares.map((square) => ({ ...square }));

      if (highlightedCombination.length > 1) {

        if (updatedSquares[i].combinations.length) {
          second_bet_audio.current && second_bet_audio.current.play()
        } else {
          first_bet_audio.current && first_bet_audio.current.play();
        }

        updatedSquares = calculatePositions(updatedSquares, cursor)
        setBets([...bets, { [highlightedCombination.join("/")]: cursor }]);
      } else {

        updatedSquares[i].bet += Number(cursor);
        if (updatedSquares[i].lastChip) {
          second_bet_audio.current && second_bet_audio.current.play();
        } else {
          first_bet_audio.current && first_bet_audio.current.play();
        }
        updatedSquares[i].lastChip = cursor;

        setBets([...bets, { [i]: cursor }]);
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
    }
  }

  function onClear() {
    if (history.length > 1) {
      setHistory(initialState);
      setBets([]);
    }
  }

  function setHoverState(range: number[], isHovering: boolean) {
    const updatedSquares = currentSquares.map((_, index) => range.includes(index) && isHovering);
    setHovered([...updatedSquares]);
  }

  function onRangeSelect(bet: string) {
    if (cursor) {
      if (bets.some((obj) => obj.hasOwnProperty(bet))) {
        second_bet_audio.current && second_bet_audio.current.play();
      } else {
        first_bet_audio.current && first_bet_audio.current.play();
      }

      setHistory([...history, [...currentSquares]]);
      setBets([...bets, { [bet]: cursor }]);
    }
  }

  function returnLastCursor(label: string): string | undefined {
    let lastValue: string | undefined = undefined;

    for (const bet of bets) {
      if (label in bet) {
        // @ts-ignore
        lastValue = bet[label];
      }
    }

    return lastValue;
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

  const spin = () => {
    if (isWheelSpinning.current) return;
    if (!bets.length) return

    const randomNumber = getRandomInt(36)
    const startingDegree = numbersToDegree[randomNumber as keyof typeof numbersToDegree]

    setCircleRotation(startingDegree)

    isWheelSpinning.current = true;
    wheelSound.current && wheelSound.current.play();

    const startTime = Date.now();
    const duration = 4.179592 * 1000;

    const animate = () => {
      const elapsed = Date.now() - startTime;

      if (elapsed < duration) {
        const progress = elapsed / duration;

        // Колесо вращается быстрее в начале, замедляясь к концу
        const easing = (1 - Math.cos(progress * Math.PI)) / 2;
        const wheelAngle = easing * 360 * 3; // 3 полных оборота
        const circleAngle = easing * 360 + startingDegree;

        setWheelRotation(wheelAngle);
        setCircleRotation(circleAngle);

        wheelRequestId.current = requestAnimationFrame(animate);
      } else {
        // Завершение анимации
        setWheelRotation((prev) => prev + (360 - (prev % 360))); // Остановить на ближайшем секторе
        setCircleRotation((prev) => prev as number % 360);

        cancelAnimationFrame(wheelRequestId.current!);
        cancelAnimationFrame(circleRequestId.current!);

        wheelRequestId.current = null;
        circleRequestId.current = null;
        isWheelSpinning.current = false;
        wheelSpinned.current = true

        onClear()
      }
    };

    requestAnimationFrame(animate);
  };


  const changeCursor = (value: string) => {
    setCursor((prevState: string) => (prevState === value ? "" : value));
  };

  return (
    <div className="game" style={{ cursor: cursor ? `url(./cursors/${cursor}.png) 10 10, auto` : "auto" }}>
      <div className="game-board">
        <aside className="left-ranges">
          <RouletteButton
            range={even}
            onSelect={(betName) => onRangeSelect(betName)}
            onHover={setHoverState}
            betName="Even"
            displayedLabel="Even"
            lastCursor={returnLastCursor("Even")}
          />
          <RouletteButton
            range={odd}
            onSelect={(betName) => onRangeSelect(betName)}
            onHover={setHoverState}
            betName="Odd"
            displayedLabel="Odd"
            lastCursor={returnLastCursor("Odd")}
          />
          <RouletteButtonColor
            range={red}
            onSelect={(betName) => onRangeSelect(betName)}
            onHover={setHoverState}
            betName="Red"
            imagePath="./red.png"
            lastCursor={returnLastCursor("Red")}
          />
          <RouletteButtonColor
            range={black}
            onSelect={(betName) => onRangeSelect(betName)}
            onHover={setHoverState}
            betName="Black"
            imagePath="./black.png"
            lastCursor={returnLastCursor("Black")}
          />
          <RouletteButton
            range={oneTo18}
            onSelect={(betName) => onRangeSelect(betName)}
            onHover={setHoverState}
            betName="1-18"
            displayedLabel="1-18"
            lastCursor={returnLastCursor("1-18")}
          />
          <RouletteButton
            range={nineteenTo36}
            onSelect={(betName) => onRangeSelect(betName)}
            onHover={setHoverState}
            betName="19-36"
            displayedLabel="19-36"
            lastCursor={returnLastCursor("19-36")}
          />
        </aside>
        <Board
          squares={currentSquares}
          hovered={hovered}
          onSquareSelect={onSquareSelect}
          highlightedCombination={highlightedCombination}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
          onRangeSelect={onRangeSelect}
          setHoverState={setHoverState}
          returnLastCursor={returnLastCursor}
        />
        <aside className="right-ranges">

          <RouletteButton
            range={oneTo12}
            onSelect={(betName) => onRangeSelect(betName)}
            onHover={setHoverState}
            betName="1-12"
            displayedLabel="1-12"
            lastCursor={returnLastCursor("1-12")}
          />
          <RouletteButton
            range={thirteenTo24}
            onSelect={(betName) => onRangeSelect(betName)}
            onHover={setHoverState}
            betName="13-24"
            displayedLabel="13-24"
            lastCursor={returnLastCursor("13-24")}
          />
          <RouletteButton
            range={twentyfiveTo36}
            onSelect={(betName) => onRangeSelect(betName)}
            onHover={setHoverState}
            betName="25-36"
            displayedLabel="25-36"
            lastCursor={returnLastCursor("25-36")}
          />
        </aside>
      </div>
      <div className="game-info">
        <div className="buttons">

          <button onClick={goBack}>Go Back</button>
          <button onClick={onClear}>
            Clear
          </button>
          <button onClick={spin}>
            Spin
          </button>
        </div>
        <Wheel wheelRotation={wheelRotation} circleRotation={circleRotation} />
        <div className="chips">
          {[5, 10, 25, 100, 500].map((value) => {
            return <Chip key={value} value={value} onCursorClick={() => changeCursor(value.toString())} />
          })}
        </div>
      </div>

    </div>
  );
}
