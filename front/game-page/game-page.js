const player1 = 'X'
const player2 = 'Y'
let currentPlayer = player1
const ROWS = 6
const COLUMNS = 7
const board = new Array(ROWS).fill(null).map(() => new Array(COLUMNS).fill(" ").slice())
const rowTracker = [5, 5, 5, 5, 5, 5, 5]
let isOver = false
const winCombination = []
const WIN_POINTS = 50
const DRAW_POINTS = 10
const LOSS_POINTS = -25
const FALLING_TIME = 50

window.onload = () => initGame()

function initGame(){
    addInvisibleRow() // to add a circle on top of the board
    for (let j = 0; j < COLUMNS; j++) {
        let colDiv = document.createElement("div")
        colDiv.id = "col-" + j
        for (let i = 0; i < ROWS; i++) {
            let circle = document.createElement("div")
            circle.id = i + "-" + j
            circle.classList.add("circle", "purple-circle")
            colDiv.addEventListener("click", addCircle)
            colDiv.addEventListener("mouseenter", addTopCircle)
            colDiv.addEventListener("mouseleave", rmvTopCircle)
            colDiv.append(circle)
        }
        document.getElementById("board").append(colDiv)
    }
    document.querySelector("#p1 > p").classList.add("turn-display")
    document.querySelector("#p1 > div").classList.add("matchup-circle-zoom")
}



function wait(ms) {
    return new Promise((resolve) => {
        setInterval(resolve, ms);
    });
}

async function countDown() {
    document.getElementById("board").style.visibility = "hidden"
    let countdown = document.getElementById("countdown")
    for (let i = 3; i > 0; i--) {
        countdown.innerHTML = i.toString()
        //playSound() dont work yet
        await wait(1000);
    }
    countdown.innerHTML = "GO!"
    await wait(900);
    countdown.innerHTML = ""
    document.getElementById("board").style.visibility = "visible";
    initGame()
}

function playSound() {
    const audio = new Audio(
        'https://media.geeksforgeeks.org/wp-content/uploads/20190531135120/beep.mp3');
    document.body.appendChild(audio)
    window.focus()

    audio.play().then(r => console.log(r)).catch(e => console.log(e));
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
    let [, col] = e.target.id.split("-")
    if(col < 0 || col > COLUMNS -1) return
    if (rowTracker[col] < 0) return // if the column is full don't show the top circle
    e.target.classList.add("show-col")
    let circle = document.getElementById(`top-row-0- ${col}`)
    circle.classList.replace("invisible-circle", "circle")
    circle.classList.add(currentPlayer === player1 ? "red-circle" : "yellow-circle")

}

function rmvTopCircle(e){
    let [, col] = e.target.id.split("-")
    let circle = document.getElementById(`top-row-0- ${col}`)
    circle.classList.replace("circle", "invisible-circle")
    circle.classList.remove("red-circle", "yellow-circle")
    e.target.classList.remove("show-col")
}


function rmvColsEventListeners() {
    for (let j = 0; j < COLUMNS; j++) {
        let colDiv = document.getElementById(`col-${j}`)
        colDiv.removeEventListener("click", addCircle)
        //colDiv.removeEventListener("mouseenter", addTopCircle)
    }
}

function addColsEventListeners() {
    for (let j = 0; j < COLUMNS; j++) {
        let colDiv = document.getElementById(`col-${j}`)
        colDiv.addEventListener("click", addCircle)
        //colDiv.addEventListener("mouseenter", addTopCircle)
    }
}

async function animateCircleFall(row, col, colorClass) {
    let i
    for (i = 0; i < row; i++) {
        let circle = document.getElementById(`${i}-${col}`)
        circle.classList.replace("purple-circle", colorClass)
        await wait(FALLING_TIME).then(() => {
            circle.classList.replace(colorClass, "purple-circle")
        })
    }
    document.getElementById(`${i}-${col}`).classList.replace("purple-circle", colorClass)
}



async function addCircle(e) {
    //Checks of the permissivity of the click
    if (isOver) return
    let [, col] = e.target.id.split("-")
    if (col < 0 || col > COLUMNS - 1) return
    let row = rowTracker[col] // get the actual row from the column tracker
    if (row < 0) return // column is full

    //Visual consistency
    rmvColsEventListeners()
    let topCircle = document.getElementById(`top-row-0- ${col}`)
    let circle = document.getElementById(`${row}-${col}`)
    if(currentPlayer === player1){
        topCircle.classList.replace("red-circle", "yellow-circle")
        togglePlayer("p1", "p2", circle, "red-circle")
        currentPlayer = player2
    }else{
        topCircle.classList.replace("yellow-circle", "red-circle")
        togglePlayer("p2", "p1", circle, "yellow-circle")
        currentPlayer = player1
    }

    if(row - 1 < 0) { // column is full after the click, so we remove the effects for this col
        let topRow = document.getElementById(`top-row-0- ${col}`)
        topRow.classList.remove( "red-circle", "yellow-circle", "circle")
        topRow.classList.add("invisible-circle")
        document.getElementById(`col-${col}`).classList.remove("show-col")
    }

    await animateCircleFall(row, col, currentPlayer === player1 ? "yellow-circle" : "red-circle")

    //Update the board
    board[row][col] = currentPlayer
    rowTracker[col]--
    checkForWin()

    //Visual consistency
    addColsEventListeners()
}

//Toggles player 1 off and player 2 on
function togglePlayer(p1, p2, circle, colorClass) {
    //circle.classList.replace("purple-circle", colorClass)
    document.querySelector(`#${p1} > p`).classList.remove("turn-display");
    document.querySelector(`#${p2} > p`).classList.add("turn-display");
    document.querySelector(`#${p1} > div`).classList.remove("matchup-circle-zoom");
    document.querySelector(`#${p2} > div`).classList.add("matchup-circle-zoom");
}


function checkForWin() {
    if(checkHorizontal()) return
    if(checkVertical()) return
    if(checkDiagonal()) return
    if(checkAntiDiagonal()) return
    checkForDraw()
}

function checkHorizontal(){
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLUMNS - 3; j++){
            if (board[i][j] === ' ') continue
            if (board[i][j] === board[i][j+1]
                && board[i][j+1] === board[i][j+2]
                && board[i][j+2] === board[i][j+3]) {
                winCombination.push([i, j], [i, j+1], [i, j+2], [i, j+3])
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
                winCombination.push([i, j], [i+1, j], [i+2, j], [i+3, j])
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
                winCombination.push([i, j], [i-1, j+1], [i-2, j+2], [i-3, j+3])
                setWinner(i, j);return true;
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
                winCombination.push([i, j], [i+1, j+1], [i+2, j+2], [i+3, j+3])
                setWinner(i, j);return true;
            }
        }
    }
}

function checkForDraw(){
    if(board.every(row => row.every(col => col !== " "))){
        setWinner(-1, -1, false)
    }
}



function showEndGameModal(winnerPlayer){
    document.getElementById("end-game-modal").style.display = "flex"

    let modalBtns = document.querySelectorAll("#btn-group > button")
    modalBtns[0].addEventListener("click", () => {
        modalBtns[0].classList.add("clicked")
        backTotheMenu()
    })
    modalBtns[1].addEventListener("click", () => {
        modalBtns[1].classList.add("clicked")
        resetGame()
    })

    let winner = document.getElementById("winner")
    let points = document.getElementById("points")
    if(winnerPlayer !== null) {
        winner.classList.add("green-title")
        winner.innerHTML = winnerPlayer + " is the winner!"
        points.innerHTML = `+${WIN_POINTS} points!`
    }
    else{
        winner.innerHTML = "It's a draw!"
        points.innerHTML = `+${DRAW_POINTS} points!`
    }
}

function setWinner(i, j, win=true){
    isOver = true
    //hide the turn
    document.querySelector("#p1 > p").classList.remove("turn-display")
    document.querySelector("#p2 > p").classList.remove("turn-display")
    //remove the zoom effect
    document.querySelector("#p1 > div").classList.remove("matchup-circle-zoom")
    document.querySelector("#p2 > div").classList.remove("matchup-circle-zoom")
    //use winCombination to highlight the winning circles
    winCombination.forEach(([row, col]) => document.getElementById(`${row}-${col}`).classList.add("win-circle"));
    showEndGameModal(win === true ? board[i][j] : null)



}

function  backTotheMenu(){
    wait(300).then(() => location.href = "../home-page/home.html")

}

function resetGame(){
    wait(300).then(() => location.reload())
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
        circle.classList.replace("red-circle", "purple-circle")
        circle.classList.replace("yellow-circle", "purple-circle")
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
