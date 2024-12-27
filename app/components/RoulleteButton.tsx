type RouletteButtonProps = {
    range: number[];
    onSelect: (range: string) => void;
    onHover: (range: number[], isHovering: boolean) => void;
    displayedLabel: string
    betName: string
    chip: string
    className?: string
};

export const RouletteButton: React.FC<RouletteButtonProps> = ({ range, onSelect, onHover, displayedLabel, betName, chip, className="" }) => (
    <>
    <button
        onMouseEnter={() => onHover(range, true)}
        onMouseLeave={() => onHover(range, false)}
        onClick={() => onSelect(betName)}
        className={className}
        >
        {displayedLabel}
    </button>
    {chip &&
        <img src={`./cursors/${chip}.png`} alt="chip_icon" className='chip_icon' />
    }
    </>
);