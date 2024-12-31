import { WheelInterface } from "../interfaces/interfaces";
import Image from 'next/image';

export default function Wheel({ wheelRotation, circleRotation }: WheelInterface) {
    return (
        <div>
            <div className="wheel-container">
                {circleRotation &&
                    <div
                        className="orbiting-circle"
                        style={{
                            transform: `rotate(-${circleRotation}deg) translate(125px)`,
                        }}
                    />
                }
                <Image
                    style={{ transform: `rotate(${wheelRotation}deg)` }}
                    className="wheel"
                    src="/wheel.png"
                    alt="wheel"
                    fill={true}
                />
            </div>
        </div>
    );
};