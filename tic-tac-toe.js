const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const imgBoard = document.getElementById('board');
const imgUnicorn = document.getElementById('https://emojipedia-us.s3.amazonaws.com/thumbs/160/apple/33/unicorn-face_1f984.png');
const imgHorse = document.getElementById('https://www.emojibase.com/resources/img/emojis/apple/x1f434.png.pagespeed.ic.kPO2Ua1ZTt.png');

const rand = function(num) {
    return Math.floor(Math.random() * num) + 1;
};

canvas.addEventListener('click', function(evt) {
     if (isGameOver) {
        return;
    }
    const i = Math.floor(evt.offsetY * 3 / canvas.height);
    const j = Math.floor(evt.offsetX * 3 / canvas.width);
    if (makeMove(board, [i, j], isX) !== -1) {
        update();
    }
}, false);

const update = function() {
    drawBoard(board);
    let result = findWinner(board);
    if (result) {
        alert('Winner: ' + result.winner);
        isGameOver = true;
        return;
    }
    isX = !isX;
    let m = nextMove(board, isX);
    makeMove(board, m, isX);
    isX = !isX;
    drawBoard(board);
    result = findWinner(board);
    if (result) {
        alert('Winner: ' + result.winner);
        isGameOver = true;
        return;
    }
}

const Win = function(board, char) {
    let hCharsNum = 0, vCharsNum = 0, hEmpetyCell = -1, vEmpetyCell = -1;
    let d1CharsNum = 0, d2CharsNum = 0,d1EmpetyCell = -1, d2EmpetyCell = -1;

    for (let i = 0; i < 3; i+=1) {
        hCharsNum = 0;
        vCharsNum = 0;
        hEmpetyCell = -1;
        vEmpetyCell = -1;

        if (board[i][i] === char) {
            d1CharsNum+=1;
        } else if (board[i][i] === ' ') {
           d1EmpetyCell = i;
        }

        if (board[i][3 - i - 1] === char) {
            d2CharsNum+=1;
        } else if (board[i][3 - i - 1] === ' ') {
            d2EmpetyCell = i;
        }

        for (let j = 0; j < 3; j+=1) {
            if (board[i][j] === char) {
                hCharsNum+=1;
            } else if (board[i][j] === ' ') {
                hEmpetyCell = j;
            }

            if (board[j][i] === char) {
                vCharsNum+=1;
            } else if (board[j][i] === ' ') {
                vEmpetyCell = j;
            }
        }

        if (hCharsNum === 3 - 1 && hEmpetyCell !== -1) {
            return [i, hEmpetyCell];
        }

        if (vCharsNum === 3 - 1 && vEmpetyCell !== -1) {
            return [vEmpetyCell, i];
        }
    }

    if (d1CharsNum === 3 - 1 &&d1EmpetyCell !== -1) {
        return [diagonal1EmptyIndex,d1EmpetyCell];
    }

    if (d2CharsNum === 3 - 1 && d2EmpetyCell !== -1) {
        return [d2EmpetyCell, 3 - d2EmpetyCell - 1];
    }
    return null;
};

const isFull = function(board) {
    for (let i = 0; i < 3; i+=1) {
        for (let j = 0; j < 3; j+=1) {
            if (board[i][j] === ' ') {
                return false;
            }
        }
    }
    return true;
};

const findWinner = function(board) {
    const xWinningLine = findWinLine(board, 'unicorn');
    if (xWinningLine) {
        return {
            winner: 'unicorn',
            winningLocations: xWinningLine
        }
    }
    const oWinningLine = findWinLine(board, 'horse');
    if (oWinningLine) {
        return {
            winner: 'horse',
            winningLocations: oWinningLine
        }
    }

    if (isFull(board)) {
        return {
            winner: 'tie'
        }
    }

    return undefined;
};

const findWinLine = function(board, char) {
    let hCharsNum = 0, vCharsNum = 0, hLine = [], vLine = [];
    let d1CharsNum = 0, d2CharsNum = 0, d1Line = [], d2Line = [];

    for (let i = 0; i < 3; i+=1) {
        hCharsNum = 0;
        vCharsNum = 0;
        hLine.length = 0;
        vLine.length = 0;

        if (board[i][i] === char) {
            d1CharsNum+=1;
        }
        d1Line.push([i, i]);

        if (board[i][3 - i - 1] === char) {
            d2CharsNum+=1;
        }
        d2Line.push([i, 3 - i - 1]);

        for (let j = 0; j < 3; j+=1) {
            if (board[i][j] === char) {
                hCharsNum+=1;
            }
            hLine.push([i, j]);

            if (board[j][i] === char) {
                vCharsNum+=1;
            }
            vLine.push([j, i]);
        }

        if (hCharsNum === 3) {
            return hLine;
        }

        if (vCharsNum === 3) {
            return vLine;
        }
    }

    if (d1CharsNum === 3) {
        return d1Line;
    }

    if (d2CharsNum === 3) {
        return d2Line;
    }
    return null;
};

const getFork = function(board, char) {
    let position;

    for (let i = 0; i < 3; i+=1) {
        for (let j = 0; j < 3; j+=1) {
            position = [i, j];
            if (board[i][j] === ' ') {
                let lines = posLines(board, position);
                if (forkOccures(lines, position, char, 3)) {
                    return position;
                }
            }
        }
    }
    return null;
};

const forkOccures = function(lines, position, char) {
    let forkLineNum= 0;
    let charNum;

    for (let i = 0; i < lines.length; i+=1) {
        let line = lines[i];
        charNum = 0;
        for (j = 0; j < line.length; j+=1) {
            if (line[j] === char) {
                charNum+=1;
            } else if (line[j] !== ' ') {
                charNum = -1;
                break;
            }
        }

        if (charNum === 3 - 2) {
            forkLinesNum+=1;
        }
    }

    return forkLineNum> 1;
};

const posLines = function(board, position) {
    const lines = [];
    const hLine = [];
    const vLine = [];
    const d1Line = [];
    const d2Line = [];
    const row = position[0];
    const col = position[1];
    const ond1 = row === col;
    const ond2 = row === 3 - col - 1;

    for (let i = 0; i < 3; i+=1) {
        hLine.push([board[row][i]]);
        vLine.push([board[i][col]]);
        d1Line.push(board[i][i]);
        d2Line.push(board[i][3 - i - 1]);
    }

    lines.push(hLine);
    lines.push(vLine);
    if (ond1) {
        lines.push(d1Line);
    }
    if (ond2) {
        lines.push(d2Line);
    }
    return lines;
};

const OppositeCorner= function(board, char) {
    if (board[0][0] === char && board[3 - 1][3 - 1] === ' ') {
        return [3 - 1, 3 - 1];
    }
    if (board[0][3 - 1] === char && board[3 - 1][0] === ' ') {
        return [3 - 1, 0];
    }
    if (board[3 - 1][0] === char && board[0][3 - 1] === ' ') {
        return [0, 3 - 1];
    }
    if (board[3 - 1][3 - 1] === char && board[0][0] === ' ') {
        return [0, 0];
    }
    return null;
};

const emptyCorner = function(board) {

    if (board[0][0] === ' ') {
        return [0, 0];
    }
    if (board[3 - 1][0] === ' ') {
        return [3 - 1, 0];
    }
    if (board[0][3 - 1] === ' ') {
        return [0, 3 - 1];
    }
    if (board[3 - 1][3 - 1] === ' ') {
        return [3 - 1, 3 - 1];
    }
    return null;
};

const firstEmpty = function(board) {
    for (let i = 0; i < 3; i+=1) {
        for (let j = 0; j < 3; j+=1) {
            if (board[i][j] === ' ') {
                return [i, j];
            }
        }
    }
};

const nextMove = function(board, isX) {
    const player1Char = isX ? 'unicorn' : 'horse';
    const player2Char = isX ? 'horse' : 'unicorn';
    const winning = Win(board, player1Char);
    if (winning) {
        return winning;
    }
    const losing = Win(board, player2Char);
    if (losing) {
        return losing;
    }
    const winningFork = getFork(board, player1Char);
    if (winningFork) {
        return winningFork;
    }
    const losingFork = getFork(board, player2Char);
    if (losingFork) {
        return losingFork;
    }
    const midIndex = Math.floor(3 / 2);
    if (board[midIndex][midIndex] === ' ') {
        return [midIndex, midIndex];
    }
    const OppCorner = OppositeCorner(board, player2Char);
    if (OppCorner) {
        return OppCorner;
    }
    const corner = emptyCorner(board);
    if (corner) {
        return corner;
    }
    return firstEmpty(board);
};

const makeMove = function(board, position, isX) {
    if (board[position[0]][position[1]] !== ' ') {
        return -1;
    }
    board[position[0]][position[1]] = isX ? 'unicorn' : 'horse';
    isX = !isX;
    return 0;
};

const simulate = function() {
    while(true) {
        let position = nextMove(board, isX);
        if (makeMove(board, position, isX) === -1) {
            alert('Invalid move');
            break;
        }
        let result = findWinner(board);
        if (result) {
            alert('Winner: ' + result.winner);
            break;
        }
        isX = !isX;
        printBoard();
    }
    console.log(board);
};

const printBoard = function() {
    let line = '';
    for (let i = 0; i < 3; i+=1) {
        for (let j = 0; j < 3; j+=1) {
            line = line + board[i][j];
        }
        console.log(line);
        line = '';
    }
};

const drawBoard = function(board) {
    const lineWidth = 0;
    ctx.lineWidth = lineWidth;
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw horizontal and vertical lines
    for (let i = 0; i < 3 - 1; i+=1) {
        let x = (i + 1) * canvas.width / 3 - lineWidth / 2;

        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();

        let y = (i + 1) * canvas.height / 3 - lineWidth / 2;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }

    let img;
    for (let i = 0; i < 3; i+=1) {
        for (let j = 0; j < 3; j+=1) {
            if (board[i][j] === 'unicorn') {
                img = imgUnicorn[rand(3) - 1];
            } else if (board[i][j] === 'horse') {
                img = imgHorse[rand(3) - 1];
            } else {
                continue;
            }

            ctx.drawImage(img,
                j * canvas.width / 3 + canvas.width / 20,
                i * canvas.height / 3 + canvas.height / 20,
                canvas.width / 5, canvas.height / 5);
        }
    }
};

const startNewGame = function() {
    for (let i = 0; i < 3; i+=1) {
        for (let j = 0; j < 3; j+=1) {
            board[i][j] = ' ';
        }
    }

    var e = document.getElementById("player1Char");
    isX = e.options[e.selectedIndex].value === 'unicorn';
    isGameOver = false;
    if (! isX) {
        let m = nextMove(board, true);
        makeMove(board, m, true);
    }
    drawBoard(board);
};

const board = [
    [' ', ' ', ' '],
    [' ', ' ', ' '],
    [' ', ' ', ' ']
];

let isX = true;
let isGameOver = false;

drawBoard(board);
