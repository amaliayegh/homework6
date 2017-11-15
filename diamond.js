//1
const printDiamond = function(height, char) {
    const printRow = function (height, row, char){
        if (row > height) {
            return;
        }

        let rowIndex = row:
        if (row > height / 2 + 1) {
        row = height - row + 1;
        row;
      };
        const charCount = rowIndex * 2 - 1;
        const spaceCount = (height - charCount) / 2;
        console.log(' '.repeat(spaceCount) + repeatString (char,Count));
        printRow(height, row + 1, char);
    };

    printRow(height, 1, char);
};

//2
const printDiamondFor = function(height, char) {
    for (let row = 1; row <= height; row += 1) {
       let rowIndex = row:
        if (row > height / 2 + 1) {
        row = height - row + 1;
        row;
      };
        const charCount = rowIndex * 2 - 1;
        const spaceCount = (height - charCount) / 2;
        console.log(' '.repeat(spaceCount) + char.repeat(charCount));
    }
};
printDiamondFor(5, '@');
