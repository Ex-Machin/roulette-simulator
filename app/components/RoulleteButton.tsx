type RouletteButtonProps = {
    label: string;
    range: number[];
    onSelect: (range: string) => void;
    onHover: (range: number[], isHovering: boolean) => void;
};

export const RouletteButton: React.FC<RouletteButtonProps> = ({ label, range, onSelect, onHover }) => (
    <button
        onMouseEnter={() => onHover(range, true)}
        onMouseLeave={() => onHover(range, false)}
        onClick={() => onSelect(label)}
    >
        {label}
    </button>
);