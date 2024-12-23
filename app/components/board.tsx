import { MouseEventHandler } from "react";
import Chip from "./Chip";
import Square from "./Sqaure";


export interface BoardProps {
    squares: any;
    hovered: boolean[];
    onPlay: Function;
    setCursor: Function;
    highlightedCombination: number[]
    onMouseLeave: MouseEventHandler<HTMLButtonElement>;
    onMouseMove: (index: number, x: number, width: number, y: number, height: number) => void;
}


export default function Board({ squares, hovered, onPlay, setCursor, highlightedCombination, onMouseMove, onMouseLeave }: BoardProps) {

    const changeCursor = (value: string) => {
        setCursor((prevState: string) => (prevState === value ? "" : value));
    };

    return (
        <>
            <div className="board-row" key={0}>
                <Square
                    key={0}
                    index="0"
                    color={
                        highlightedCombination.includes(0) ? "highlighted" : squares[0].color
                    }
                    hover={hovered[0]}
                    chip={squares[0].lastChip}
                    onSquareClick={() => onPlay(0)}
                    onMouseMove={onMouseMove}
                    onMouseLeave={onMouseLeave}
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
                                color={
                                    highlightedCombination.includes(index) ? "highlighted" : squares[index].color
                                }
                                hover={hovered[index]}
                                chip={squares[index].lastChip}
                                onSquareClick={() => onPlay(index)}
                                onMouseMove={onMouseMove}
                                onMouseLeave={onMouseLeave}
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