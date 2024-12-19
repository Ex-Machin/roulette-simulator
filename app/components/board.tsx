import { BoardProps } from "../interfaces/interfaces";
import Chip from "./chip";
import Square from "./sqaure";

export default function Board({ squares, onPlay, setCursor }: BoardProps) {

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
                    color={squares[0].color}
                    hover={squares[0].hover}
                    chip={squares[0].lastChip}
                    onSquareClick={() => onPlay(0)}
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
                                color={squares[index].color}
                                hover={squares[index].hover}
                                chip={squares[index].lastChip}
                                onSquareClick={() => onPlay(index)}
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