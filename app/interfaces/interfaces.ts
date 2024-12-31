import { MouseEventHandler } from "react";

export type Square = {
    bet: number;
    lastChip: null | string;
    hover: null | boolean;
    combinations: Record<"top" | "left" | "chip", number | string>[]
};

export interface BoardProps {
    squares: Square[];
    hovered: boolean[];
    onSquareSelect: Function;
    highlightedCombination: number[]
    onMouseLeave: MouseEventHandler<HTMLButtonElement>;
    onMouseMove: (index: number, x: number, width: number, y: number, height: number) => void;
    onRangeSelect: Function
    setHoverState: (range: number[], isHovering: boolean) => void
    returnLastCursor: Function
}

export interface ChipProps {
    value: number;
    onCursorClick: MouseEventHandler<HTMLButtonElement>;
}

export type RouletteButtonProps = {
    range: number[];
    onSelect: (range: string) => void;
    onHover: (range: number[], isHovering: boolean) => void;
    displayedLabel: string
    betName: string
    lastCursor: string | undefined
};

export type RouletteButtonColorProps = {
    range: number[];
    onSelect: (range: string) => void;
    onHover: (range: number[], isHovering: boolean) => void;
    imagePath: string
    betName: string
    lastCursor: string | undefined
};

export interface SquareProps {
    index: string;
    color: string;
    hover: boolean;
    chip: null | string;
    onSquareClick: MouseEventHandler<HTMLButtonElement>;
    onMouseMove: Function;
    onMouseLeave: MouseEventHandler<HTMLButtonElement>;
    combinations: Record<"top" | "left" | "chip", number | string>[]
}

export interface WheelInterface {
    wheelRotation: number
    circleRotation: number | null,
}
