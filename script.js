// initialise the gameboard
function Gameboard() {
    // initialise the board
    const size = 3;
    const board = [];

    for (let i = 0; i < size; i++) {
        board[i] = [];
        for (let j = 0; j < size; j++) {
            board[i].push(Cell());
        }
    }

    // return the board
    const getBoard = () => board;

    // checks if a token already exists, and adds player token if not
    const addToken = (row, column, player) => {
        board[row][column].addValue(player);
    };

    // print the board by first pushing values into a new board
    const printBoard = () => {
        const boardValues = [];
        for (let i = 0; i < size; i++) {
            boardValues[i] = [];
            for (let j = 0; j < size; j++) {
                boardValues[i].push(board[i][j].getValue()); const boardDiv = document.querySelector('.game-container');
            }
        }
        console.log(boardValues);
    };

    // reset the board
    const resetBoard = () => {
        board.forEach((row, rowNo) => row.forEach((col, colNo) => {
            board[rowNo][colNo].addValue(0);
        }))
    };

    return { getBoard, addToken, printBoard, resetBoard };
}

// defines the value of the cells
function Cell() {
    // initialises value to 0
    let value = 0;

    // change the value of the cell
    const addValue = (player) => {
        value = player;
    };

    const getValue = () => value;

    return { addValue, getValue };
}

function GameController(
    playerOneName = "Player One",
    playerTwoName = "Player Two"
) {

    const addNameOne = (name) => {
        players[0].name = name;
    };

    const addNameTwo = (name) => {
        players[1].name = name;
    };


    // create the gameboard
    const board = Gameboard();

    // create the player objects
    const players = [
        {
            name: playerOneName,
            token: 1
        },
        {
            name: playerTwoName,
            token: 2
        }
    ];

    // define the active player
    let activePlayer = players[0];

    // function to switch the player's turn
    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    const playRound = (row, column) => {

        // change text content
        board.addToken(row, column, getActivePlayer().token);
        // switch the player and print the new round
        switchPlayerTurn();
    };

    const resetGame = () => {
        board.resetBoard();
        activePlayer = players[0];
    }

    const checkWin = () => {
        // need to get the other player's token as it has been switched
        const activeToken = getActivePlayer().token == 1 ? 2 : 1;
        const currentLayout = board.getBoard();

        if (currentLayout[0][0].getValue() === activeToken && currentLayout[0][1].getValue() === activeToken && currentLayout[0][2].getValue() === activeToken) {
            //alert(1);
            return true;
        } else if (currentLayout[1][0].getValue() === activeToken && currentLayout[1][1].getValue() === activeToken && currentLayout[1][2].getValue() === activeToken) {
            //alert(2);
            return true;
        } else if (currentLayout[2][0].getValue() === activeToken && currentLayout[2][1].getValue() === activeToken && currentLayout[2][2].getValue() === activeToken) {
            //alert(3);
            return true;
        } else if (currentLayout[0][0].getValue() === activeToken && currentLayout[1][0].getValue() === activeToken && currentLayout[2][0].getValue() === activeToken) {
            //alert(4);
            return true;
        } else if (currentLayout[0][1].getValue() === activeToken && currentLayout[1][1].getValue() === activeToken && currentLayout[2][1].getValue() === activeToken) {
            //alert(5);
            return true;
        } else if (currentLayout[0][2].getValue() === activeToken && currentLayout[1][2].getValue() === activeToken && currentLayout[2][2].getValue() === activeToken) {
            //alert(6);
            return true;
        } else if (currentLayout[0][0].getValue() === activeToken && currentLayout[1][1].getValue() === activeToken && currentLayout[2][2].getValue() === activeToken) {
            //alert(7);
            return true;
        } else if (currentLayout[0][2].getValue() === activeToken && currentLayout[1][1].getValue() === activeToken && currentLayout[2][0].getValue() === activeToken) {
            //alert(8);
            return true;
        }

        return false;
    };

    const checkFull = () => {
        // search for a blank cell
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (board.getBoard()[row][col].getValue() === 0) {
                    return false;
                }
            }
        }
        return true;
    };

    return {
        addNameOne,
        addNameTwo,
        playRound,
        getActivePlayer,
        switchPlayerTurn,
        resetGame,
        checkWin,
        checkFull,
        getBoard: board.getBoard
    };
}

function ScreenController() {
    // initialise the const
    const playerOneDiv = document.querySelector(".player1");
    const playerTwoDiv = document.querySelector(".player2");
    const game = GameController();
    const statusDiv = document.querySelector('.status');
    const boardDiv = document.querySelector('.game-container');
    const restartBtn = document.querySelector('#restart');
    const submitBtn = document.querySelector('#submit');
    let pOneName = "";
    let pTwoName = "";
    playerOneDiv.classList.toggle("active");

    submitBtn.addEventListener("click", (event) => {
        event.preventDefault();
        if (document.querySelector('#pOneName').value !== "" && document.querySelector('#pTwoName').value !== "") {
            updateScreen();
            pOneName = document.querySelector('#pOneName').value;
            let pTwoName = document.querySelector('#pTwoName').value;
            game.addNameOne(pOneName);
            game.addNameTwo(pTwoName);
            playerOneDiv.innerText = pOneName + " (X)";
            playerTwoDiv.innerText = pTwoName + " (O)";
            document.querySelector('form').classList.add('hidden');
            boardDiv.classList.toggle('hidden');
            statusDiv.classList.toggle('hidden');
        };
    });

    const updateScreen = () => {

        // clear the board
        boardDiv.innerText = "";

        // get the latest version of the board and player turn
        const board = game.getBoard();
        let activePlayer = game.getActivePlayer();

        // render the updated board squares
        board.forEach((row, rowNo) => row.forEach((cell, colNo) => {
            const newCell = document.createElement("button");
            newCell.classList.add("cell");
            newCell.dataset.row = rowNo;
            newCell.dataset.column = colNo;

            const cellContent = cell.getValue();

            if (cellContent == 0) {
                newCell.innerText = "-";
            } else if (cellContent == 1) {
                newCell.classList.add("playerOne");
                newCell.innerText = "X";
            } else {
                newCell.classList.add("playerTwo");
                newCell.innerText = "O";
            }
            boardDiv.appendChild(newCell);
        }));
    }

    const disableBoard = () => {
        const buttons = document.querySelectorAll('.game-container button');
        buttons.forEach((button) => {
            button.disabled = true;
        });

        //restartBtn.style.visibility = "visible";
        restartBtn.addEventListener("click", () => {
            playerOneDiv.classList.add("active");
            playerTwoDiv.classList.remove("active");
            game.resetGame();
            updateScreen();
            restartBtn.classList.add('hidden');
        });
    };

    // add an event listener for the board. Check that cell is available
    function clickHandlerBoard(e) {
        const selectedRow = e.target.dataset.row;
        const selectedColumn = e.target.dataset.column;

        // Check that cell is availalable                   
        if (game.getBoard()[selectedRow][selectedColumn].getValue() !== 0) {
            // Prompt error message
            alert('Cell is not available!');
            return;
        }
        if (!selectedRow || !selectedColumn) return;

        game.playRound(selectedRow, selectedColumn);

        updateScreen();

        if (game.checkWin()) {
            // alert of win
            setTimeout(function () {
                game.switchPlayerTurn();
                alert(`${game.getActivePlayer().name} wins!`);
            }, 50);

            // disable all buttons and make restart button visible
            restartBtn.classList.remove('hidden');
            disableBoard();

        } else if (game.checkFull()) {
            // disable buttons and make restart button visible
            disableBoard();
            restartBtn.classList.toggle('hidden');
        } else {

            // change the font colour of the current player
            playerOneDiv.classList.toggle("active");
            playerTwoDiv.classList.toggle("active");
            
        }

    }

    boardDiv.addEventListener("click", clickHandlerBoard);
    updateScreen();
    boardDiv.classList.add('hidden');
    statusDiv.classList.add('hidden');
};


// control the game
ScreenController();

