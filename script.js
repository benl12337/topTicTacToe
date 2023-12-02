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
        if (board[row][column].getValue() === 0) {
            board[row][column].addValue(player);
        }
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

    return { getBoard, addToken, printBoard };
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

    const printNewRound = () => {
        console.log(`${getActivePlayer().name}'s turn.`);
    };

    const playRound = (row, column) => {

        // change text content
        board.addToken(row, column, getActivePlayer().token);

        // here is where the logic should go for checking whether a player has won the game already
        // check whether the game has been won

        const activeToken = getActivePlayer().token;
        const currentLayout = board.getBoard();
        let win = false;

        // Check for any winning combinations
        if (currentLayout[0][0].getValue() === activeToken && currentLayout[0][1].getValue() === activeToken && currentLayout[0][2].getValue() === activeToken ||
            currentLayout[1][0].getValue() === activeToken && currentLayout[1][1].getValue() === activeToken && currentLayout[1][2].getValue() === activeToken ||
            currentLayout[2][0].getValue() === activeToken && currentLayout[2][1].getValue() === activeToken && currentLayout[2][2].getValue() === activeToken ||
            currentLayout[0][0].getValue() === activeToken && currentLayout[1][0].getValue() === activeToken && currentLayout[2][0].getValue() === activeToken ||
            currentLayout[0][1].getValue() === activeToken && currentLayout[1][1].getValue() === activeToken && currentLayout[2][1].getValue() === activeToken ||
            currentLayout[0][2].getValue() === activeToken && currentLayout[1][2].getValue() === activeToken && currentLayout[2][2].getValue() === activeToken ||
            currentLayout[0][0].getValue() === activeToken && currentLayout[1][1].getValue() === activeToken && currentLayout[2][2].getValue() === activeToken ||
            currentLayout[0][2].getValue() === activeToken && currentLayout[1][1].getValue() === activeToken && currentLayout[2][0].getValue() === activeToken
        ) {
            alert(getActivePlayer().name + ' wins!');
            console.log('Win!');
            return;
        };


        // check if the board is full
        let full = true;
        board.getBoard().forEach((row) => row.forEach((cell) => {
            if (cell.getValue() === 0) {
                full = false;
            };
        }));

        if (full) {
            alert('Board Full!');
        };

        switchPlayerTurn();
        printNewRound();
    }

    printNewRound();

    return {
        playRound,
        getActivePlayer,
        getBoard: board.getBoard
    };
}

function ScreenController() {

    // initialise the consts
    const playerOneDiv = document.querySelector(".player1");
    const playerTwoDiv = document.querySelector(".player2");
    playerTwoDiv.classList.toggle("active");
    const game = GameController();
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.game-container');

    const updateScreen = () => {

        // check if game is won or board is full
        // make restart button visible

        // change the background colour of the current player
        playerOneDiv.classList.toggle("active");
        playerTwoDiv.classList.toggle("active");

        // clear the board
        boardDiv.innerText = "";

        // get the latest version of the board and player turn
        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        // render the updated board squares
        board.forEach((row, rowNo) => row.forEach((cell, colNo) => {
            const newCell = document.createElement("button");
            newCell.classList.add("cell");
            newCell.dataset.row = rowNo;
            newCell.dataset.column = colNo;

            const cellContent = cell.getValue();

            if (cellContent == 0) {
                newCell.innerText = "";
            } else if (cellContent == 1) {
                newCell.innerText = "X";
            } else {
                newCell.innerText = "O";
            }
            boardDiv.appendChild(newCell);
        }));
    }

    // add an event listener for the board. Check that cell is available
    function clickHandlerBoard(e) {
        const selectedRow = e.target.dataset.row;
        const selectedColumn = e.target.dataset.column;


        // Check that cell is available
        if (game.getBoard()[selectedRow][selectedColumn].getValue() !== 0) {
            alert('Cell is not available!');
            return;
        }
        if (!selectedRow || !selectedColumn) return;

        game.playRound(selectedRow, selectedColumn);

        updateScreen();

    }

    boardDiv.addEventListener("click", clickHandlerBoard);

    updateScreen();
};

ScreenController();
