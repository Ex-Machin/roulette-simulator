import { ChipProps } from "../interfaces/interfaces";

export default function Chip({ value, onCursorClick }: ChipProps) {
    return (
        <button className='chip' onClick={onCursorClick}>
            <img src={`./chips/${value}.png`} alt="chip_icon" />
        </button>
    )
}