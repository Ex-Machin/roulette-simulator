import { ChipProps } from "../interfaces/interfaces";

export default function Chip({ value, onCursorClick }: ChipProps) {
    return (
        <button className='chip' onClick={onCursorClick}>
            <img src={value ? `./chips/${value}.png`: undefined} alt="chip_icon" />
        </button>
    )
}