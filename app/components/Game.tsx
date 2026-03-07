"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Square, User } from "../interfaces/interfaces";
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
import Image from 'next/image';

// Moved outside component — stable reference, never needs to be recreated
const INITIAL_SQUARES: Square[] = Array.from({ length: 37 }, () => ({
  bet: 0,
  lastChip: null,
  hover: null,
  combinations: []
}));

const INITIAL_STATE: Square[][] = [INITIAL_SQUARES];

// Audio instances created once at module level to avoid re-creation on renders
// Guards against SSR (no window/Audio on the server)
const createAudio = (src: string) =>
  typeof Audio !== "undefined" ? new Audio(src) : null;

export default function Game() {
  const first_bet_audio = useRef(createAudio("./audio/first_bet.mp3"));
  const second_bet_audio = useRef(createAudio("./audio/second_bet.mp3"));
  const wheelSound = useRef(createAudio("./audio/roulette_wheel_sound_effect.mp3"));

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    // Use Next.js router instead of window.location for cleaner path parsing
    const id = window.location.pathname.split('/')[1];
    if (!id) {
      setError('Something went wrong. The page is unavailable.');
      setLoading(false);
      return;
    }

    let cancelled = false; // Prevent state updates if component unmounts mid-fetch

    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_PROD_BACKEND}/Balance/${id}`);
        if (cancelled) return;

        if (response.ok) {
          const data = await response.json();
          if (data.length !== 0) {
            setUserData(data);
          } else {
            setError('Something went wrong. The page is unavailable.');
          }
        } else {
          setError('Something went wrong. The page is unavailable.');
        }
      } catch {
        if (!cancelled) setError('Something went wrong. The page is unavailable.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    return () => { cancelled = true; };
  }, []);

  const [cursor, setCursor] = useState("");
  const [history, setHistory] = useState<Square[][]>(INITIAL_STATE);
  const [hovered, setHovered] = useState<boolean[]>(() => Array(37).fill(false));
  const [bets, setBets] = useState<{ type: string; value: string; stake: number }[]>([]);
  const [highlightedCombination, setHighlightedCombination] = useState<number[]>([]);

  const isWheelSpinning = useRef(false);
  const wheelRequestId = useRef<number | null>(null);
  const wheelSpinned = useRef(false);
  const wheelRef = useRef<HTMLImageElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);

  // Memoized — only recomputed when history changes, not on every render
  const currentSquares = useMemo(
    () => history[history.length - 1],
    [history]
  );

  // Stable reference — avoids Board and child re-renders caused by inline arrow functions
  const calculatePositions = useCallback((squares: Square[], cursorVal: string): Square[] => {
    const firstEl = Number(highlightedCombination[0]);
    const secondEl = Number(highlightedCombination[1]);

    if (highlightedCombination.includes(0)) {
      if (highlightedCombination.length === 3) {
        const thirdEl = highlightedCombination[2];
        squares[thirdEl].combinations = [...squares[thirdEl].combinations, { top: 0, left: 0, chip: cursorVal }];
      } else if (highlightedCombination.length === 2) {
        squares[secondEl].combinations = [...squares[secondEl].combinations, { top: 0, left: 50, chip: cursorVal }];
      } else {
        squares[secondEl].combinations = [...squares[secondEl].combinations, { top: 0, left: 0, chip: cursorVal }];
      }
      return squares;
    }

    if (highlightedCombination.length === 2) {
      if (firstEl + 1 === highlightedCombination[1]) {
        squares[firstEl].combinations = [...squares[firstEl].combinations, { top: 50, left: 100, chip: cursorVal }];
      }
      if (firstEl + 3 === highlightedCombination[1]) {
        squares[firstEl].combinations = [...squares[firstEl].combinations, { top: 100, left: 50, chip: cursorVal }];
      }
    }
    if (highlightedCombination.length === 3) {
      squares[firstEl].combinations = [...squares[firstEl].combinations, { top: 50, left: 0, chip: cursorVal }];
    }
    if (highlightedCombination.length === 4) {
      squares[firstEl].combinations = [...squares[firstEl].combinations, { top: 100, left: 100, chip: cursorVal }];
    }
    if (highlightedCombination.length === 6) {
      squares[firstEl].combinations = [...squares[firstEl].combinations, { top: 100, left: 0, chip: cursorVal }];
    }

    return squares;
  }, [highlightedCombination]);

  function convertBet(key: string, cursor: string): { type: string; value: string; stake: number } {
    const stake = Number(cursor);

    const rangeMap: Record<string, { type: string; value: string }> = {
      "Red": { type: "color", value: "red" },
      "Black": { type: "color", value: "black" },
      "Even": { type: "even", value: "true" },
      "Odd": { type: "even", value: "false" },
      "1-18": { type: "rank", value: "1/18" },
      "19-36": { type: "rank", value: "19/36" },
      "1-12": { type: "sequence", value: "1/12" },
      "13-24": { type: "sequence", value: "13/24" },
      "25-36": { type: "sequence", value: "25/36" },
    };

    if (rangeMap[key]) return { ...rangeMap[key], stake };

    // Combination bet (e.g. "1/2/4/5")
    if (key.includes("/")) return { type: "numberSet", value: key, stake };

    // Single number
    return { type: "number", value: key, stake };
  }

  const onSquareSelect = useCallback((i: number) => {
    if (isWheelSpinning.current || !cursor) return;

    let updatedSquares = currentSquares.map((square) => ({ ...square }));

    if (highlightedCombination.length > 1) {
      const audio = updatedSquares[i].combinations.length
        ? second_bet_audio.current
        : first_bet_audio.current;
      if (audio) {
        audio.currentTime = 0;
        audio.play();
      }

      updatedSquares = calculatePositions(updatedSquares, cursor);
      setBets((prev) => [...prev, convertBet(highlightedCombination.join("/"), cursor)]);
    } else {
      updatedSquares[i].bet += Number(cursor);
      const audio = updatedSquares[i].lastChip ? second_bet_audio.current : first_bet_audio.current;
      if (audio) {
        audio.currentTime = 0;
        audio.play();
      }
      updatedSquares[i].lastChip = cursor;
      setBets((prev) => [...prev, convertBet(String(i), cursor)]);
    }

    setHistory((prev) => [...prev, updatedSquares]);
  }, [cursor, currentSquares, highlightedCombination, calculatePositions]);

  const goBack = useCallback(() => {
    if (history.length > 1) {
      setHistory((prev) => prev.slice(0, -1));
      setBets((prev) => prev.slice(0, -1));
    }
  }, [history.length]);

  const onClear = useCallback(() => {
    if (history.length > 1) {
      setHistory(INITIAL_STATE);
      setBets([]);
    }
  }, [history.length]);

  // Rewritten: avoids rebuilding a full boolean array — only updates changed indices
  const setHoverState = useCallback((range: number[], isHovering: boolean) => {
    setHovered((prev) => {
      const next = [...prev];
      range.forEach((i) => { next[i] = isHovering; });
      return next;
    });
  }, []);

  const onRangeSelect = useCallback((bet: string) => {
    if (!cursor) return;
    const audio = bets.some((obj) => obj.hasOwnProperty(bet))
      ? second_bet_audio.current
      : first_bet_audio.current;
    audio?.play();
    setHistory((prev) => [...prev, [...prev[prev.length - 1]]]);
    setBets((prev) => [...prev, convertBet(bet, cursor)]);
  }, [cursor, bets]);

  // Memoized lookup — avoids iterating bets array in every render cycle
  const lastCursorMap = useMemo(() => {
    const map: Record<string, string> = {};
    const reverseMap: Record<string, string> = {
      "red": "Red",
      "black": "Black",
      "true": "Even",
      "false": "Odd",
      "1/18": "1-18",
      "19/36": "19-36",
      "1/12": "1-12",
      "13/24": "13-24",
      "25/36": "25-36",
    };

    for (const bet of bets) {
      const frontendKey = reverseMap[bet.value] ?? bet.value;
      map[frontendKey] = String(bet.stake);
    }
    return map;
  }, [bets]);

  const returnLastCursor = useCallback(
    (label: string): string | undefined => lastCursorMap[label],
    [lastCursorMap]
  );

  // Throttled via requestAnimationFrame to avoid firing more than 60fps
  const rafPending = useRef(false);
  const pendingCombination = useRef<number[]>([]);

  const onMouseMove = useCallback((
    index: number,
    x: number,
    width: number,
    y: number,
    height: number
  ) => {
    if (index < 0 || index >= 37) {
      setHighlightedCombination([]);
      return;
    }

    const relW = x / width;
    const relH = y / height;
    const combination = new Set([index]);

    if (index === 0) {
      if (relH >= 0.8) {
        const widthRanges = [
          { range: [0, 0.2], indices: [index + 1] },
          { range: [0.2, 0.4], indices: [index + 1, index + 2] },
          { range: [0.4, 0.6], indices: [index + 2] },
          { range: [0.6, 0.8], indices: [index + 2, index + 3] },
          { range: [0.8, 1], indices: [index + 3] },
        ];
        widthRanges.forEach(({ range, indices }) => {
          if (relW >= range[0] && relW <= range[1]) {
            indices.forEach((idx) => combination.add(idx));
          }
        });
      }
      pendingCombination.current = Array.from(combination).sort((a, b) => a - b);
    } else {
      if (!(relH >= 0.2 && relH <= 0.8)) {
        const delta = relH >= 0.8 ? 3 : -3;
        const neighbor = index + delta;

        if (neighbor >= 0 && neighbor < 37) {
          if (relW <= 0.2 && leftBlock.has(index)) {
            combination.add(index + 1);
            combination.add(index + 2);
            combination.add(neighbor + 1);
            combination.add(neighbor + 2);
          } else if (relW >= 0.8 && rightBlock.has(index)) {
            if (index === 3 && relH <= 0.8) {
              combination.add(index - 1);
              combination.add(index - 2);
              combination.add(index - 3);
              pendingCombination.current = Array.from(combination).sort((a, b) => a - b);

              if (!rafPending.current) {
                rafPending.current = true;
                requestAnimationFrame(() => {
                  setHighlightedCombination(pendingCombination.current);
                  rafPending.current = false;
                });
              }
              return;
            }
            combination.add(index - 1);
            combination.add(index - 2);
            combination.add(neighbor - 1);
            combination.add(neighbor - 2);
          }
          combination.add(neighbor);
        }
      }

      if (rightBlock.has(index) && relW >= 0.8) {
        combination.add(index - 1);
        combination.add(index - 2);
        pendingCombination.current = Array.from(combination).sort((a, b) => a - b);

        if (!rafPending.current) {
          rafPending.current = true;
          requestAnimationFrame(() => {
            setHighlightedCombination(pendingCombination.current);
            rafPending.current = false;
          });
        }
        return;
      }

      if (leftBlock.has(index) && relW <= 0.2) {
        combination.add(index + 1);
        combination.add(index + 2);
        pendingCombination.current = Array.from(combination).sort((a, b) => a - b);

        if (!rafPending.current) {
          rafPending.current = true;
          requestAnimationFrame(() => {
            setHighlightedCombination(pendingCombination.current);
            rafPending.current = false;
          });
        }
        return;
      }

      if (!(relW >= 0.2 && relW <= 0.8)) {
        const delta = relW > 0.8 ? 1 : -1;
        const neighbor = index + delta;
        if (
          neighbor >= 0 &&
          neighbor < 37 &&
          !(delta === 1 && rightBlock.has(index)) &&
          !(delta === -1 && leftBlock.has(index))
        ) {
          combination.add(neighbor);
        }
      }

      if (combination.size === 3) {
        const sorted = Array.from(combination).sort((a, b) => a - b);
        if (relH <= 0.2 && relW <= 0.2) combination.add(sorted[1] - 3);
        if (relH <= 0.2 && relW >= 0.8) combination.add(sorted[2] - 3);
        if (relH >= 0.8 && relW <= 0.2) combination.add(sorted[0] + 3);
        if (relH >= 0.8 && relW >= 0.8) combination.add(sorted[1] + 3);
      }

      pendingCombination.current = Array.from(combination).sort((a, b) => a - b);
    }

    // Throttle state updates to rAF cadence (max 60fps) instead of every mouse event
    if (!rafPending.current) {
      rafPending.current = true;
      requestAnimationFrame(() => {
        setHighlightedCombination(pendingCombination.current);
        rafPending.current = false;
      });
    }
  }, []);

  const onMouseLeave = useCallback(() => {
    setHighlightedCombination([]);
  }, []);

  // Extracted spin result handling into a proper async function
  const handleSpinResult = useCallback(async () => {
    if (!userData?.id) return;

    try {
      const spin = await fetch(
        `${process.env.NEXT_PUBLIC_PROD_BACKEND}/Spin/spin?id=${userData.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bets),
        }
      );

      if (spin.ok) {
        const winningData = await spin.json();

        return winningData[0].rand;
      }
    } catch {
      setError('Something went wrong. The page is unavailable.');
    }
  }, [userData?.id, bets]);

  const spin = useCallback(async () => {
    if (isWheelSpinning.current || !bets.length) return;

    const randomNumber = await handleSpinResult();
    const startingDegree = numbersToDegree[randomNumber as unknown as keyof typeof numbersToDegree];

    isWheelSpinning.current = true;
    wheelSpinned.current = false;

    if (wheelSound.current) {
      wheelSound.current.currentTime = 0;
      wheelSound.current.play();
    }

    const duration = 4.18 * 1000;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;

      if (elapsed < duration) {
        const progress = elapsed / duration;
        const easing = (1 - Math.cos(progress * Math.PI)) / 2;

        if (wheelRef.current) {
          wheelRef.current.style.transform = `rotate(${easing * 360 * 3}deg)`;
        }
        if (circleRef.current) {
          circleRef.current.style.transform = `rotate(-${easing * 360 + startingDegree}deg) translate(125px)`;
        }

        wheelRequestId.current = requestAnimationFrame(animate);
      } else {
        // Snap to final positions
        const rawAngle = wheelRef.current?.style.transform.match(/[\d.]+/)?.[0];
        const finalWheelAngle = rawAngle ? Math.ceil(parseFloat(rawAngle) % 360) : 0;

        if (wheelRef.current) wheelRef.current.style.transform = `rotate(${finalWheelAngle}deg)`;
        if (circleRef.current) circleRef.current.style.transform = `rotate(-${startingDegree % 360}deg) translate(125px)`;

        if (wheelRequestId.current) cancelAnimationFrame(wheelRequestId.current);
        wheelRequestId.current = null;
        isWheelSpinning.current = false;
        wheelSpinned.current = true;

        // Don't await this — let it run in background, it doesn't affect the animation
        fetch(`${process.env.NEXT_PUBLIC_PROD_BACKEND}/Balance/${userData?.id}`)
          .then(res => res.json())
          .then(balanceData => setUserData(balanceData))
          .catch(() => setError('Something went wrong. The page is unavailable.'));
        
        onClear();
      }
    };

    if (wheelRequestId.current) cancelAnimationFrame(wheelRequestId.current);
    wheelRequestId.current = requestAnimationFrame(animate);
  }, [bets.length, onClear, handleSpinResult]);

  const changeCursor = useCallback((value: string) => {
    setCursor((prev) => (prev === value ? "" : value));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div
      className="game"
      style={{ cursor: cursor ? `url(./cursors/${cursor}.png) 10 10, auto` : "auto" }}
    >
      {/* Player info bar — visible on both desktop and mobile */}
      <div className="player-info-bar">
        <span>Name: {userData?.name}</span>
        <span>Balance: {userData?.balance}</span>
      </div>

      <div className="game-board">
        <aside className="left-ranges">
          <RouletteButton range={even} onSelect={onRangeSelect} onHover={setHoverState} betName="Even" displayedLabel="Even" lastCursor={returnLastCursor("Even")} />
          <RouletteButton range={odd} onSelect={onRangeSelect} onHover={setHoverState} betName="Odd" displayedLabel="Odd" lastCursor={returnLastCursor("Odd")} />
          <RouletteButtonColor range={red} onSelect={onRangeSelect} onHover={setHoverState} betName="Red" imagePath="/red.png" lastCursor={returnLastCursor("Red")} />
          <RouletteButtonColor range={black} onSelect={onRangeSelect} onHover={setHoverState} betName="Black" imagePath="/black.png" lastCursor={returnLastCursor("Black")} />
          <RouletteButton range={oneTo18} onSelect={onRangeSelect} onHover={setHoverState} betName="1-18" displayedLabel="1-18" lastCursor={returnLastCursor("1-18")} />
          <RouletteButton range={nineteenTo36} onSelect={onRangeSelect} onHover={setHoverState} betName="19-36" displayedLabel="19-36" lastCursor={returnLastCursor("19-36")} />
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
          <RouletteButton range={oneTo12} onSelect={onRangeSelect} onHover={setHoverState} betName="1-12" displayedLabel="1-12" lastCursor={returnLastCursor("1-12")} />
          <RouletteButton range={thirteenTo24} onSelect={onRangeSelect} onHover={setHoverState} betName="13-24" displayedLabel="13-24" lastCursor={returnLastCursor("13-24")} />
          <RouletteButton range={twentyfiveTo36} onSelect={onRangeSelect} onHover={setHoverState} betName="25-36" displayedLabel="25-36" lastCursor={returnLastCursor("25-36")} />
        </aside>
      </div>

      <div className="game-info">
        <div className="buttons">
          <button onClick={goBack}>Go Back</button>
          <button onClick={onClear}>Clear</button>
          <button onClick={spin}>Spin</button>
        </div>
        <div>
          <div className="wheel-container">
            <div className="orbiting-circle" ref={circleRef} />
            <Image ref={wheelRef} className="wheel" src="/wheel.png" alt="wheel" fill={true} />
          </div>
        </div>
        <div className="chips">
          {[5, 10, 25, 100, 500].map((value) => (
            <Chip key={value} value={value} onCursorClick={() => changeCursor(value.toString())} />
          ))}
        </div>
      </div>
    </div>
  );
}
