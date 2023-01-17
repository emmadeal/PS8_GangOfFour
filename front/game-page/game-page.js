const player1 = 'X'
const player2 = 'Y'
let currentPlayer = player1

const ROWS = 6
const COLUMNS = 7
const board = []
const columnTracker = [5, 5, 5, 5, 5, 5, 5]
let isOver = false

window.onload = () =>  initGame()

function initGame(){
    for (let i = 0; i < ROWS; i++) {
        let row = []
        for (let j = 0; j < COLUMNS; j++) {
            row.push(' ')
            let circle = document.createElement("div")
            circle.id = i.toString() + "-" + j.toString()
            circle.classList.add("circle")
            circle.addEventListener("click", addCircle)
            document.getElementById("board").append(circle)
        }
        board.push(row)
    }
    console.log(board)
}

function addCircle(e){
    console.log(e.target.id)
    if(isOver) return
    let [row, column] = e.target.id.split("-")
    row = columnTracker[column] // get the actual row from the column tracker
    if (row < 0) return
    board[row][column] = currentPlayer
    let circle = document.getElementById(row.toString() + "-" + column.toString())
    if(currentPlayer === player1){
        circle.style.backgroundColor = "red"
        currentPlayer = player2
    }
    else{
        circle.style.backgroundColor = "yellow"
        currentPlayer = player1
    }
    columnTracker[column]--
    checkForWin()

}

function checkForWin(){

}

function checkHorizontalWin(){
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLUMNS - 3; j++){
            if (board[i][j] === ' ') continue
            if (board[i][j] === board[i][j+1] && board[i][j+1] === board[i][j+2] && board[i][j+2] === board[i][j+3]) {
                setWinner(i, j);
                return;
            }
        }
    }
}




















const nothingToSeeHere = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let keysPressed = [];

document.addEventListener('keydown', (e) => {
    keysPressed.push(e.code);
    if (keysPressed.length > nothingToSeeHere.length) keysPressed.shift();
    if (keysPressed.join(',') === nothingToSeeHere.join(',')) {
        document.getElementById('board').classList.add("shake")
        setTimeout(() => board.classList.remove("shake"), 1000);
    }
});
