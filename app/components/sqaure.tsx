import { SquareProps } from "../interfaces/interfaces";



export default function Square({ index, color, hover, chip, onSquareClick, onMouseMove, onMouseLeave, combinations }: SquareProps) {
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
                <img style={{ top: `${50}%`, left: `${50}%` }} src={`./cursors/${chip}.png`} alt="chip_icon" className='chip_icon' />
            }
            {combinations.map((combination, i) => {
                return <img key={i} style={{ top: `${combination.top}%`, left: `${combination.left}%` }} src={combination.chip ? `./cursors/${combination.chip}.png` : undefined} alt="chip_icon" className='chip_icon' />
            })}
        </div>
    );
}
