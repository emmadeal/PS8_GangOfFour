const player1 = 'X'
const player2 = 'Y'
let currentPlayer = player1

const ROWS = 6
const COLUMNS = 7
const board = new Array(ROWS).fill(null).map(() => new Array(COLUMNS).fill(" ").slice())
const rowTracker = [5, 5, 5, 5, 5, 5, 5]
let isOver = false

window.onload = () =>  initGame()

function initGame(){
    addInvisibleRow() // to add a circle on top of the board
    for (let j = 0; j < COLUMNS; j++) {
        let rowDiv = document.createElement("div")
        rowDiv.id = "col-" + j
        for (let i = 0; i < ROWS; i++) {
            let circle = document.createElement("div")
            circle.id = i + "-" + j
            circle.classList.add("circle", "white-circle")
            rowDiv.addEventListener("click", addCircle)
            rowDiv.addEventListener("mouseenter", addTopCircle)
            rowDiv.addEventListener("mouseleave", rmvTopCircle)
            rowDiv.append(circle)

        }
        document.getElementById("board").append(rowDiv)

    }
    console.log(board)
}


function addInvisibleRow(){
    for (let j = 0; j < COLUMNS; j++) {
        let circle = document.createElement("div")
        circle.id = "top-row-0- " + j.toString()
        circle.classList.add("invisible-circle")
        document.getElementById("top-row").append(circle)
    }
}

function addTopCircle(e) {
    if (isOver) return
    console.log()
    let [, col] = e.target.id.split("-")
    if (rowTracker[col] < 0) return // if the column is full don't show the top circle
    let circle = document.getElementById("top-row-0- " + col.toString())
    circle.classList.replace("invisible-circle", "circle")
    circle.classList.add(currentPlayer === player1 ? "red-circle" : "yellow-circle")
    document.getElementById(`col-${col}`).classList.add("show-col")










}

function rmvTopCircle(e){
    let [, col] = e.target.id.split("-")
    let circle = document.getElementById("top-row-0- " + col.toString())
    circle.classList.replace("circle", "invisible-circle")
    circle.classList.remove("red-circle")
    circle.classList.remove("yellow-circle")
    document.getElementById(`col-${col}`).classList.remove("show-col")
}



function addCircle(e){
    if(isOver) return
    let [, col] = e.target.id.split("-")
    let row = rowTracker[col] // get the actual row from the column tracker
    if (row < 0) return
    board[row][col] = currentPlayer
    let turn = document.getElementById("turn")
    let circle = document.getElementById(row.toString() + "-" + col.toString())
    if(currentPlayer === player1){
        circle.classList.replace("white-circle", "red-circle")
        turn.classList.replace("red-title", "yellow-title")
        currentPlayer = player2
    }
    else{
        circle.classList.replace("white-circle", "yellow-circle")
        turn.classList.replace("yellow-title", "red-title")
        currentPlayer = player1
    }
    //show the turn
    turn.innerHTML = currentPlayer + "'s turn"
    rowTracker[col]--
    checkForWin()


}


function checkForWin() {
    if(checkHorizontal()) return
    if(checkVertical()) return
    if(checkDiagonal()) return
    checkAntiDiagonal()
}

function endGameModal(){

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
    isOver = true
    let winner = document.getElementById("winner")
    winner.innerHTML = board[i][j] + " is the winner!"
    winner.classList.add("winner", board[i][j] === player1 ? "red-title" : "yellow-title")

    //hide the turn
    document.getElementById("turn").innerHTML = ""

    //reset the game after 3 seconds
    setTimeout(resetGame, 2000)
}

function resetGame(){
    location.reload()
        /*
    isOver = false
    currentPlayer = player1
    rowTracker.fill(5)
    board.forEach(row => row.fill(' '))

    let circles = []
    for (let j = 0; j < COLUMNS; j++) {
       let col  = document.getElementById(`col-${j}`)
       circles.push(col.children)
    }
    console.log(circles)


    /*


    Array.from(circles).forEach(circle => {
        console.log(circle)
        circle.classList.replace("red-circle", "white-circle")
        circle.classList.replace("yellow-circle", "white-circle")
    })
    document.getElementById("winner").innerHTML = ""
    document.getElementById("winner").classList.remove("winner")
    document.getElementById("turn").innerHTML = player1 + "'s turn"

     */
}




















const nothingToSeeHere = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight'];
let keysPressed = [];

document.addEventListener('keydown', (e) => {
    keysPressed.push(e.code);
    if (keysPressed.length > nothingToSeeHere.length) keysPressed.shift();
    if (keysPressed.join(',') === nothingToSeeHere.join(',')) {
        for (let i = 0; i < 30; i++) {
            let drop = document.createElement("div");
            drop.classList.add("raindrop");
            drop.style.left = Math.random() * 100 + "vw";
            //make inner text a emoji water
            drop.innerText = "💧";
            //eppend on main
            document.getElementById("winner").appendChild(drop);
        }
        console.log("You did it!")
    }
});
