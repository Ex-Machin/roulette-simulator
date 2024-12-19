import { SquareProps } from "../interfaces/interfaces";

export default function Square({ index, color, hover, chip, onSquareClick, }: SquareProps) {
    const className = "square_button " + color + (hover ? " hover" : "")

    return (
        <div className='square'>
            <button className={className} onClick={(i) => onSquareClick(i)}>
                {index}
            </button>
            {chip &&
                <img src={`./cursors/${chip}.png`} alt="chip_icon" className='chip_icon' />
            }
        </div>
    );
}
