import { MouseEventHandler } from "react";

export type Square = {
    bet: number;
    lastChip: null | string;
    hover: null | boolean;
    combinations: Record<"top" | "left" | "chip", number | string>[]
};

export interface BoardInterface {
    squares: Square[];
    hovered: boolean[];
    onSquareSelect: (i: number) => void;
    highlightedCombination: number[]
    onMouseLeave: MouseEventHandler<HTMLButtonElement>;
    onMouseMove: (index: number, x: number, width: number, y: number, height: number) => void;
    onRangeSelect: (bet: string) => void
    setHoverState: (range: number[], isHovering: boolean) => void
    returnLastCursor: (label: string) => string | undefined
}

export interface ChipInterface {
    value: number;
    onCursorClick: MouseEventHandler<HTMLButtonElement>;
}

export interface RouletteButtonInterface {
    range: number[];
    onSelect: (range: string) => void;
    onHover: (range: number[], isHovering: boolean) => void;
    displayedLabel: string
    betName: string
    lastCursor: string | undefined
};

export interface RouletteButtonColorInterface {
    range: number[];
    onSelect: (range: string) => void;
    onHover: (range: number[], isHovering: boolean) => void;
    imagePath: string
    betName: string
    lastCursor: string | undefined
};

export interface SquareInterface {
    index: string;
    color: string;
    hover: boolean;
    chip: null | string;
    onSquareClick: MouseEventHandler<HTMLButtonElement>;
    onMouseMove: (index: number, x: number, width: number, y: number, height: number) => void;
    onMouseLeave: MouseEventHandler<HTMLButtonElement>;
    combinations: Record<"top" | "left" | "chip", number | string>[]
}

export interface WheelInterface {
    wheelRotation: number
    circleRotation: number | null,
}
