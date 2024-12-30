interface WheelInterface {
    wheelRotation: number
    circleRotation: number | null,
}

const Wheel = ({ wheelRotation, circleRotation }: WheelInterface) => {
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
                <img
                    style={{ transform: `rotate(${wheelRotation}deg)` }}
                    className="wheel"
                    src="./wheel.png"
                    alt="wheel"
                />
            </div>
        </div>
    );
};

export default Wheel;
