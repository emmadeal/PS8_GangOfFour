const player1 = 'X'
const player2 = 'Y'
let currentPlayer = player1

const ROWS = 6
const COLUMNS = 7
const board = []
const rowTracker = [5, 5, 5, 5, 5, 5, 5]
let isOver = false

window.onload = () =>  initGame()

function initGame(){
    addInvisibleRow() // to add a circle on top of the board
    for (let i = 0; i < ROWS; i++) {
        let row = []
        for (let j = 0; j < COLUMNS; j++) {
            row.push(' ')
            let circle = document.createElement("div")
            circle.id = i.toString() + "-" + j.toString()
            circle.classList.add("circle")
            circle.addEventListener("click", addCircle)
            circle.addEventListener("onmouseenter", addTopCircle)
            circle.addEventListener("onmouseleave", rmvTopCircle)
            document.getElementById("board").append(circle)
        }
        board.push(row)
    }
    console.log(board)
}

function addInvisibleRow(){
    for (let j = 0; j < COLUMNS; j++) {
        let circle = document.createElement("div")
        circle.id = "top-row-0- " + j.toString()
        document.getElementById("top-row").append(circle)
    }
}

function addCircle(e){
    if(isOver) return
    let [, col] = e.target.id.split("-")
    let row = rowTracker[col] // get the actual row from the column tracker
    if (row < 0) return
    board[row][col] = currentPlayer
    let circle = document.getElementById(row.toString() + "-" + col.toString())
    if(currentPlayer === player1){
        circle.style.backgroundColor = "red"
        currentPlayer = player2
    }
    else{
        circle.style.backgroundColor = "yellow"
        currentPlayer = player1
    }
    rowTracker[col]--
    checkForWin()

}

function addTopCircle(e){
    console.log(e.target.id.split("-"))
    let [, col] = e.target.id.split("-")
    let circle = document.getElementById("top-row-0- " + col.toString())
    circle.style.backgroundColor = currentPlayer === player1 ? "red" : "yellow";
}

function rmvTopCircle(e){
    let [, col] = e.target.id.split(" ")
    let circle = document.getElementById("top-row-0- " + col.toString())
    circle.style.backgroundColor = "white";
}

function checkForWin() {
    if(checkHorizontal()) return
    if(checkVertical()) return
    if(checkDiagonal()) return
    checkAntiDiagonal()
}


function checkHorizontal(){
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLUMNS - 3; j++){
            if (board[i][j] === ' ') continue
            if (board[i][j] === board[i][j+1]
                && board[i][j+1] === board[i][j+2]
                && board[i][j+2] === board[i][j+3]) {
                setWinner(i, j);return true;
            }
        }
    }
}

function checkVertical(){
    for (let i = 0; i < ROWS - 3; i++) {
        for (let j = 0; j < COLUMNS; j++){
            if (board[i][j] === ' ') continue
            if (board[i][j] === board[i+1][j]
                && board[i+1][j] === board[i+2][j]
                && board[i+2][j] === board[i+3][j]) {
                setWinner(i, j);return true;
            }
        }
    }
}

function checkDiagonal() {
    for (let i = 3; i < ROWS; i++) {
        for (let j = 0; j < COLUMNS - 3; j++) {
            if (board[i][j] === ' ') continue
            if (board[i][j] === board[i-1][j+1]
                && board[i-1][j+1] === board[i-2][j+2]
                && board[i-2][j+2] === board[i-3][j+3]) {
                setWinner(i, j);
                return true;
            }
        }
    }
}

function checkAntiDiagonal(){
    for (let i = 0; i < ROWS - 3; i++) {
        for (let j = 0; j < COLUMNS - 3; j++){
            if (board[i][j] === ' ') continue
            if (board[i][j] === board[i+1][j+1]
                && board[i+1][j+1] === board[i+2][j+2]
                && board[i+2][j+2] === board[i+3][j+3]) {
                setWinner(i, j);return true;
            }
        }
    }
}

function setWinner(i, j){
    alert("Winner is " + board[i][j])
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
