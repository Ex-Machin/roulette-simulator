import { MouseEventHandler } from "react";

export interface SquareProps {
    index: string;
    color: string;
    hover: string;
    chip: null | string;
    onSquareClick: MouseEventHandler<HTMLButtonElement>;
}

export interface BoardProps {
    squares: any;
    onPlay: Function;
    setCursor: Function;
}

export interface ChipProps {
    value: number;
    onCursorClick: MouseEventHandler<HTMLButtonElement>;
}
