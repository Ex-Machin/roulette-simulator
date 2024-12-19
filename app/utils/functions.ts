export default function getRouletteColor(number: number) {
    if (number === 0 || number === 37) return "green";

    const redNumbers = [
        1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36
    ];

    return redNumbers.includes(number) ? "red" : "black";
}