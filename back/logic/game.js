const player1 = 1
const player2 = 2
let currentPlayer = player1
const ROWS = 6
const COLUMNS = 7
const board = new Array(ROWS).fill(null).map(() => new Array(COLUMNS).fill(0).slice())
const rowTracker = [5, 5, 5, 5, 5, 5, 5]
let isOver = false
const winCombination = [] //to highlight the winning combination at the end of the game
const WIN_POINTS = 50
const DRAW_POINTS = 10
const LOSS_POINTS = -25
const FALLING_TIME = 50


function isMoveValid(col) {
    if (col < 0 || col > COLUMNS - 1) return false
    return rowTracker[col] >= 0 && !isOver && board[rowTracker[col]][col] === 0
}

function updateBoard(col) {
    board[rowTracker[col]][col] = currentPlayer
    rowTracker[col]--
    currentPlayer = currentPlayer === player1 ? player2 : player1
}


function checkForWin() {
    if (checkHorizontal()) return true
    if (checkVertical()) return true
    if (checkDiagonal()) return true
    if (checkAntiDiagonal()) return true
    return false
}

function checkHorizontal() {
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLUMNS - 3; j++) {
            if (board[i][j] === 0) continue
            if (board[i][j] === board[i][j + 1]
                && board[i][j + 1] === board[i][j + 2]
                && board[i][j + 2] === board[i][j + 3]) {
                winCombination.push([i, j], [i, j + 1], [i, j + 2], [i, j + 3])
                return true;
            }
        }
    }
}

function checkVertical() {
    for (let i = 0; i < ROWS - 3; i++) {
        for (let j = 0; j < COLUMNS; j++) {
            if (board[i][j] === 0) continue
            if (board[i][j] === board[i + 1][j]
                && board[i + 1][j] === board[i + 2][j]
                && board[i + 2][j] === board[i + 3][j]) {
                winCombination.push([i, j], [i + 1, j], [i + 2, j], [i + 3, j])
                return true;
            }
        }
    }
}

function checkDiagonal() {
    for (let i = 3; i < ROWS; i++) {
        for (let j = 0; j < COLUMNS - 3; j++) {
            if (board[i][j] === 0) continue
            if (board[i][j] === board[i - 1][j + 1]
                && board[i - 1][j + 1] === board[i - 2][j + 2]
                && board[i - 2][j + 2] === board[i - 3][j + 3]) {
                winCombination.push([i, j], [i - 1, j + 1], [i - 2, j + 2], [i - 3, j + 3])
                return true;
            }
        }
    }
}

function checkAntiDiagonal() {
    for (let i = 0; i < ROWS - 3; i++) {
        for (let j = 0; j < COLUMNS - 3; j++) {
            if (board[i][j] === 0) continue
            if (board[i][j] === board[i + 1][j + 1]
                && board[i + 1][j + 1] === board[i + 2][j + 2]
                && board[i + 2][j + 2] === board[i + 3][j + 3]) {
                winCombination.push([i, j], [i + 1, j + 1], [i + 2, j + 2], [i + 3, j + 3])
                return true;
            }
        }
    }
}

function checkForDraw() {
    if (board.every(row => row.every(col => col !== 0))) {
        return true;
    }
}

function setWinner(i, j, win = true) {

}

function getBoard() {
    return board
}

module.exports = {
    isMoveValid, updateBoard, checkForWin,
    checkForDraw, setWinner, getBoard, winCombination,
    rowTracker, WIN_POINTS, DRAW_POINTS, LOSS_POINTS, isOver
}


