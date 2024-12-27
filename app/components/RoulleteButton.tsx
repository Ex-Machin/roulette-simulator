
type RouletteButtonProps = {
    range: number[];
    onSelect: (range: string) => void;
    onHover: (range: number[], isHovering: boolean) => void;
    displayedLabel: string
    betName: string
    lastCursor: string | undefined
};

export default function RouletteButton({ range, onSelect, onHover, displayedLabel, betName, lastCursor }: RouletteButtonProps) {
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
                <img src={`./cursors/${lastCursor}.png`} alt="chip_icon" className='chip_icon' />
            }
        </div>
    )
}