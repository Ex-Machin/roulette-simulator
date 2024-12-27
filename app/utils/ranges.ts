// half of the board
export const oneTo18 = Array.from({ length: 18 }, (_, i) => i + 1);
export const nineteenTo36 = Array.from({ length: 18 }, (_, i) => i + 19);

// 3 rows
export const oneTo12 = Array.from({ length: 12 }, (_, i) => i + 1);
export const thirteenTo24 = Array.from({ length: 12 }, (_, i) => i + 13);
export const twentyfiveTo36 = Array.from({ length: 12 }, (_, i) => i + 25);

// even & odd
export const even = [
  2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36,
];
export const odd = [
  1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35,
];

// black and red
export const red = [
  1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
];
export const black = [
  2, 6, 4, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35,
];

export const leftColumn = [1,4,7,10,13,16,19,22,25,28,31,34]
export const middleColumn = [2,5, 8,11,14,17,20,23,26,29,32,35]
export const rightColumn = [3,6,9,12,15,18,21,24,27,30,33,36]

// helpers
export const rightBlock = new Set([3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36]);
export const leftBlock = new Set([1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34]);
