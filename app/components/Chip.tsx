import { ChipInterface } from "../interfaces/interfaces";
import Image from 'next/image';

export default function Chip({ value, onCursorClick }: ChipInterface) {
    return (
        <button className='chip' onClick={onCursorClick}>
            {value &&
                <Image src={`/chips/${value}.png`} alt="chip_icon" width={35} height={35}/>
            }
        </button>
    )
}