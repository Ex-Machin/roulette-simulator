import { MouseEventHandler } from "react";
import Chip from "./Chip";
import Square from "./Sqaure";
import getRouletteColor from "../utils/functions";


export interface BoardProps {
    squares: any;
    hovered: boolean[];
    onSquareSelect: Function;
    setCursor: Function;
    highlightedCombination: number[]
    onMouseLeave: MouseEventHandler<HTMLButtonElement>;
    onMouseMove: (index: number, x: number, width: number, y: number, height: number) => void;
}


export default function Board({ squares, hovered, onSquareSelect, setCursor, highlightedCombination, onMouseMove, onMouseLeave }: BoardProps) {
    

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
                        highlightedCombination.includes(0) ? "highlighted" : getRouletteColor(0)
                    }
                    hover={hovered[0]}
                    chip={squares[0].lastChip}
                    onSquareClick={() => onSquareSelect(0)}
                    onMouseMove={onMouseMove}
                    onMouseLeave={onMouseLeave}
                    combinations={squares[0].combinations}
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
                                    highlightedCombination.includes(index) ? "highlighted" : getRouletteColor(index)
                                }
                                hover={hovered[index]}
                                chip={squares[index].lastChip}
                                onSquareClick={() => onSquareSelect(index)}
                                onMouseMove={onMouseMove}
                                onMouseLeave={onMouseLeave}
                                combinations={squares[index].combinations}
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