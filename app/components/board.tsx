import { MouseEventHandler } from "react";
import Chip from "./Chip";
import Square from "./Sqaure";
import getRouletteColor from "../utils/functions";
import { RouletteButton } from "./RoulleteButton";
import { leftColumn, middleColumn, rightColumn } from "../utils/ranges";


export interface BoardProps {
    squares: any;
    hovered: boolean[];
    onSquareSelect: Function;
    setCursor: Function;
    highlightedCombination: number[]
    onMouseLeave: MouseEventHandler<HTMLButtonElement>;
    onMouseMove: (index: number, x: number, width: number, y: number, height: number) => void;
    onRangeSelect: Function
    setHoverState: (range: number[], isHovering: boolean) => void
}


export default function Board({ squares, hovered, onSquareSelect, setCursor, highlightedCombination, onMouseMove, onMouseLeave, onRangeSelect, setHoverState }: BoardProps) {


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
                        highlightedCombination.includes(0) ? "hover " + getRouletteColor(0) : getRouletteColor(0)
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
                                    highlightedCombination.includes(index) ? "hover " + getRouletteColor(index) : getRouletteColor(index)
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
            <div className="collumns-roullete">

                <RouletteButton
                    range={leftColumn}
                    onSelect={(label) => onRangeSelect(label)}
                    onHover={setHoverState}
                    className="roullete-button column"
                    betName="Left Column"
                    displayedLabel="2to1"
                />
                <RouletteButton
                    range={middleColumn}
                    onSelect={(label) => onRangeSelect(label)}
                    onHover={setHoverState}
                    className="roullete-button column"
                    betName="Middle Column"
                    displayedLabel="2to1"
                />
                <RouletteButton
                    range={rightColumn}
                    onSelect={(label) => onRangeSelect(label)}
                    onHover={setHoverState}
                    className="roullete-button column"
                    betName="Right Column"
                    displayedLabel="2to1"
                />
            </div>
            <div>
                {[5, 10, 25, 100, 500].map((value) => {
                    return <Chip key={value} value={value} onCursorClick={() => changeCursor(value.toString())} />
                })}
            </div>
        </>
    );
}