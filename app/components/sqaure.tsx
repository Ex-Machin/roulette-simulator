import { MouseEventHandler } from "react";

export interface SquareProps {
    index: string;
    color: string;
    hover: boolean;
    chip: null | string;
    onSquareClick: MouseEventHandler<HTMLButtonElement>;
    onMouseMove: Function;
    onMouseLeave: MouseEventHandler<HTMLButtonElement>;
}

export default function Square({ index, color, hover, chip, onSquareClick, onMouseMove, onMouseLeave }: SquareProps) {
    const className = "square_button " + color + (hover ? " hover" : "")

    return (
        <div className='square'>
            <button
                className={className}
                onClick={(i) => onSquareClick(i)}
                onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const relativeX = e.clientX - rect.left;
                    const relativeY = e.clientY - rect.top;
                    onMouseMove(Number(index), relativeX, rect.width, relativeY, rect.height);
                }}
                onMouseLeave={onMouseLeave}>
                {index}
            </button>
            {chip &&
                <img src={`./cursors/${chip}.png`} alt="chip_icon" className='chip_icon' />
            }
        </div>
    );
}
