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
                boardValues[i].push(board[i][j].getValue());    const boardDiv = document.querySelector('.game-container');

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
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    };

    const playRound = (row, column) => {
        console.log(`Dropping ${getActivePlayer().name}'s token in ${row}, ${column}`);
        console.log("this is the active player's token: " + getActivePlayer().token);
        board.addToken(row, column, getActivePlayer().token);

        // here is where the logic should go for checking whether a player has won the game already
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
    const game = GameController();
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.game-container');

    const updateScreen = () => {

        // clear the board
        boardDiv.innerText = "";

        // get the latest version of the board and player turn
        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        // display the player's turn 
        playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;

        // render the updated board squares
        board.forEach(row, rowNo => {
            row.forEach(col, colNo => {
                const cellbutton = document.createElement("button");
                cellbutton.classList.add("cell");


                // add a dataset to the cell for easier identification
                cellbutton.dataset.row = rowNo;
                cellbutton.dataset.column = colNo;

                const cellContent = board[row][col].getValue();

                if (cellContent === 0) {
                    cellbutton.textContent = '';
                } else if (cellContent == 1) {
                    cellbutton.textContent = 'X';
                } else {
                    cellbutton.textContent = 'O';
                };
                

                boardDiv.appendChild(cellbutton);
                
            });
        });
    }

    // add an event listener for the board
    function clickHandlerBoard(e) {
        const selectedRow = e.target.selectedRow.row;
        const selectedColumn = e.target.dataset.column;

        if (!selectedRow || !selectedColumn) return;

        game.playRound(selectedRow, selectedColumn);
        updateScreen();
    }

    boardDiv.addEventListener("click", clickHandlerBoard);

    updateScreen();
};

ScreenController();
