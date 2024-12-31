import { RouletteButtonColorProps } from "../interfaces/interfaces"


export default function RouletteButtonColor({ range, onSelect, onHover, imagePath, betName, lastCursor }: RouletteButtonColorProps) {
    return (
        <div className="roullete-button-container">
            <button
                onMouseEnter={() => onHover(range, true)}
                onMouseLeave={() => onHover(range, false)}
                onClick={() => { onSelect(betName) }}
                className="roullete-button"
            >
                <img src={imagePath} alt="roullete-image-button" />
            </button>
            {lastCursor &&
                <img src={`./cursors/${lastCursor}.png`} alt="chip_icon" className='chip_icon' />
            }
        </div>
    )
}