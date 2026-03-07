import { ChipInterface } from "../interfaces/interfaces";
import Image from 'next/image';

export default function Chip({ value, onCursorClick, isSelected }: ChipInterface) {
  return (
    <button
      className='chip'
      onClick={onCursorClick}
      style={{ transform: isSelected ? 'translateY(-5px)' : 'translateY(0)', transition: 'transform 0.15s ease' }}
    >
      {value &&
        <Image src={`/chips/${value}.png`} alt="chip_icon" width={35} height={35} />
      }
    </button>
  )
}