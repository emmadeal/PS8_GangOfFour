const gameState = require("../logic/gameState.js");
const game = require("../logic/game")
const AI = require("../logic/AI")

const handleConnection = (io) => {
    const nsp = io.of('/api/game');
    nsp.on("connection", async (socket) => {
        console.log("New client connected");
        socket.on('newMove', async (pos) => {
            if(game.isOver) return
            //Player turn
            let [colStr,] = JSON.parse(pos);
            //console.log(colStr)
            let col = parseInt(colStr);
            console.log("col" + col);
            if (game.isMoveValid(col)) {
                game.updateBoard(col);
                socket.emit('updateBoard', JSON.stringify(game.getBoard()))
                if (game.checkForWin()) {
                    socket.emit('endGame', JSON.stringify({winner: "player", winCombination: game.winCombination, points: game.WIN_POINTS}));
                    console.log("player win")
                    game.isOver = true;
                }
                if (game.checkForDraw()) {
                    socket.emit('endGame', JSON.stringify({winner: "draw", points: game.DRAW_POINTS}));
                }

            }

            if(game.isOver) return

            //delay to let the player see the move
            const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms)); await sleep(800);

            //AI turn
            let [iaCol,] = AI.computeMove(game.getBoard());
            game.updateBoard(iaCol);
            socket.emit('updateBoard', JSON.stringify(game.getBoard()))
            if (game.checkForWin()) {
                socket.emit('endGame', JSON.stringify({winner: "IA", winCombination: game.winCombination, points: game.LOSS_POINTS}));
            }
            if (game.checkForDraw()) {
                socket.emit('endGame', JSON.stringify({winner: "draw", points: game.DRAW_POINTS}));
            }

        })



        socket.on("disconnect", () => {
            console.log("Client disconnected");
        });
    });
};

module.exports = { handleConnection };
