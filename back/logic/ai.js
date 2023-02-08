const {rowTracker} = require("./game");

function computeMove(board) {
    console.log(board)
    while(true) {
        // Get a random column (integer between 0 and 6)
        let i = Math.floor(Math.random() * 7);
        if(rowTracker[i] >= 0) {
            return [i, rowTracker[i]];
        }
    }
}

function getOneEmptyCellCord(board) {
    for (let i = 0; i < 7 ; i++) {
        for (let j = 0; j < 6; j++) {
            if (board[i][j] === 0) {
                return [i, j];
            }
        }
    }
}

module.exports = { computeMove };
