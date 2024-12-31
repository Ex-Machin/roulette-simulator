import { BoardProps } from "../interfaces/interfaces";
import { getRouletteColor } from "../utils/functions";
import { leftColumn, middleColumn, rightColumn } from "../utils/ranges";
import RouletteButton from "./RoulleteButton";
import Square from "./Sqaure";


export default function Board({ squares, hovered, onSquareSelect, highlightedCombination, onMouseMove, onMouseLeave, onRangeSelect, setHoverState, returnLastCursor }: BoardProps) {
    return (
        <div className="board">
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
            <div className="board-row">
                <RouletteButton
                    range={leftColumn}
                    onSelect={(label) => onRangeSelect(label)}
                    onHover={setHoverState}
                    betName="Left Column"
                    displayedLabel="2to1"
                    lastCursor={returnLastCursor("Left Column")}
                />
                <RouletteButton
                    range={middleColumn}
                    onSelect={(label) => onRangeSelect(label)}
                    onHover={setHoverState}
                    betName="Middle Column"
                    displayedLabel="2to1"
                    lastCursor={returnLastCursor("Middle Column")}
                />
                <RouletteButton
                    range={rightColumn}
                    onSelect={(label) => onRangeSelect(label)}
                    onHover={setHoverState}
                    betName="Right Column"
                    displayedLabel="2to1"
                    lastCursor={returnLastCursor("Right Column")}
                />
            </div>
        </div>
    );
}