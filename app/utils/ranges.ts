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

export const allPossibleRoulleteCombinations = {
  "1/2": 0,
  "1/4": 0,
  "1/2/4/5": 0,
  "1/2/3/4/5/6": 0,
  "2/3": 0,
  "2/5": 0,
  "2/3/5/6": 0,
  "3/6": 0,
  "4/5": 0,
  "5/6": 0,
  "5/8": 0,
  "4/5/7/8": 0,
  "5/6/8/9": 0,
  "4/5/6/7/8/9": 0,
  "6/9": 0,
  "4/7": 0,
  "7/8": 0,
  "7/10": 0,
  "7/8/10/11": 0,
  "7/8/9/10/11/12": 0,
  "8/9": 0,
  "8/11": 0,
  "8/9/11/12": 0,
  "9/12": 0,
  "10/11": 0,
  "10/13": 0,
  "10/11/13/14": 0,
  "10/11/12/13/14/15": 0,
  "11/12": 0,
  "11/14": 0,
  "11/12/14/15": 0,
  "12/15": 0,
  "13/14": 0,
  "13/16": 0,
  "13/14/16/17": 0,
  "13/14/15/16/17/18": 0,
  "14/15": 0,
  "15/18": 0,
  "14/15/17/18": 0,
  "16/17": 0,
  "16/19": 0,
  "16/17/19/20": 0,
  "16/17/18/19/20/21": 0,
  "14/17": 0,
  "17/18": 0,
  "17/20": 0,
  "17/18/20/21": 0,
  "18/21": 0,
  "19/20": 0,
  "19/22": 0,
  "19/20/22/23": 0,
  "19/20/21/22/23/24": 0,
  "20/21": 0,
  "20/23": 0,
  "20/21/23/24": 0,
  "21/24": 0,
  "22/23": 0,
  "22/25": 0,
  "22/23/25/26": 0,
  "22/23/24/25/26": 0,
  "23/24": 0,
  "23/26": 0,
  "23/24/26/27": 0,
  "22/23/24/25/26/27": 0,
  "24/27": 0,
  "25/26": 0,
  "25/28": 0,
  "25/26/28/29": 0,
  "25/26/27/28/29/30": 0,
  "26/27": 0,
  "26/29": 0,
  "26/27/29/30": 0,
  "27/30": 0,
  "28/29": 0,
  "28/31": 0,
  "28/29/31/32": 0,
  "28/29/30/31/32/33": 0,
  "29/30": 0,
  "29/32": 0,
  "29/30/32/33": 0,
  "30/33": 0,
  "31/32": 0,
  "31/34": 0,
  "31/32/34/35": 0,
  "31/32/33/34/35/36": 0,
  "32/33": 0,
  "32/35": 0,
  "32/33/35/36": 0,
  "33/36": 0,
  "34/35": 0,
  "35/36": 0,
};