import { RouletteButtonInterface } from "../interfaces/interfaces"
import Image from 'next/image';

export default function RouletteButton({ range, onSelect, onHover, displayedLabel, betName, lastCursor }: RouletteButtonInterface) {
    return (
        <div className="roullete-button-container">
            <button
                onMouseEnter={() => onHover(range, true)}
                onMouseLeave={() => onHover(range, false)}
                onClick={() => { onSelect(betName) }}
                className="roullete-button"
            >
                {displayedLabel}
            </button>
            {lastCursor &&
                <Image src={`/cursors/${lastCursor}.png`} alt="chip_icon" className='chip_icon'  width={35} height={35}/>
            }
        </div>
    )
}