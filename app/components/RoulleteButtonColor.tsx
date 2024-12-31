import { RouletteButtonColorInterface } from "../interfaces/interfaces"
import Image from 'next/image';

export default function RouletteButtonColor({ range, onSelect, onHover, imagePath, betName, lastCursor }: RouletteButtonColorInterface) {
    return (
        <div className="roullete-button-container">
            <button
                onMouseEnter={() => onHover(range, true)}
                onMouseLeave={() => onHover(range, false)}
                onClick={() => { onSelect(betName) }}
                className="roullete-button"
            >
                <Image src={imagePath} alt="roullete-image-button" width={40} height={40} />
            </button>
            {lastCursor &&
                <Image src={`/cursors/${lastCursor}.png`} alt="chip_icon" className='chip_icon'  fill={true}/>
            }
        </div>
    )
}