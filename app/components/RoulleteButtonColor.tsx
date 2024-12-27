
type RouletteButtonProps = {
    range: number[];
    onSelect: (range: string) => void;
    onHover: (range: number[], isHovering: boolean) => void;
    imagePath: string
    betName: string
    lastCursor: string | undefined
};

export default function RouletteButtonColor({ range, onSelect, onHover, imagePath, betName, lastCursor }: RouletteButtonProps) {
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