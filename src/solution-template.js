
/*
*
* "board" is a matrix that holds data about the
* game board, in a form of BoardSquare objects
*
* openedSquares holds the position of the opened squares
*
* flaggedSquares holds the position of the flagged squares
*
 */
let board = [];
let openedSquares = [];
let flaggedSquares = [];
let bombCount = 0;
let squaresLeft = 0;


/*
*
* the probability of a bomb in each square
*
 */
let bombProbability = 3;
let maxProbability = 15;
let gameOver = false;
let firstClick = true;

function minesweeperGameBootstrapper(rowCount, colCount) {
    let easy = {
        'rowCount': 9,
        'colCount': 9,
    };
    // TODO you can declare here the medium and expert difficulties

     
    let medium = {
        'rowCount': 16,
        'colCount': 16,
    };
    
    let expert = {
        'rowCount': 16,
        'colCount': 30,
    };

    if (rowCount == null && colCount == null) {
        // TODO have a default difficulty
        generateBoard(easy);
    } else {
        generateBoard({'rowCount': rowCount, 'colCount': colCount});
    }


    document.getElementById("customProbability").value = "";
    const bombProbabilityInput = document.getElementById("bombProbabilityInput");
    const maxProbabilityInput = document.getElementById("maxProbabilityInput");

        
    const customProbability = document.getElementById("customProbability").value;
    if (customProbability) {
        const parsedCustomProbability = parseInt(customProbability);
        if (parsedCustomProbability >= 0 && parsedCustomProbability <= 100) {
            boardMetadata.bombProbability = parsedCustomProbability;
        }
    }

    reset(boardMetadata);
}
function changeDifficulty(newDifficulty) {
    const selectedDifficultyIndex = document.getElementById("difficultySelection").selectedIndex;
    console.log("idx = " + selectedDifficultyIndex);


    switch (selectedDifficultyIndex) {
        case 0:
            selectedDifficulty = DIFFICULTIES.easy;
            break;
        case 1:
            selectedDifficulty = DIFFICULTIES.medium;
            bombProbability = 6;
            bombProbabilityInput.value = 6;
            break;
        case 2:
            selectedDifficulty = DIFFICULTIES.expert;
            bombProbability = 9;
            bombProbabilityInput.value = 9;
        default:
            break;
    }

    startGame();

}
function reset(boardMetadata) {
    board = [];
    gameOver = false;
    firstClick = true;
    document.getElementById("customProbability").value = "";
    generateBoard(boardMetadata);
    render();
}


function generateBoard(boardMetadata) {
    squaresLeft = boardMetadata.colCount * boardMetadata.rowCount;

    /*
    *
    * "generate" an empty matrix
    *
     */
    for (let i = 0; i < boardMetadata.rowCount; i++) {
        board[i] = new Array(boardMetadata.rowCount);
    }


    /*
    *
    * TODO fill the matrix with "BoardSquare" objects, that are in a pre-initialized state
    *
    */
    console.log(board);


    for (let i = 0; i < boardMetadata.rowCount; i++) {
        for (let j = 0; j < boardMetadata.colCount; j++) {
            board[i][j] = new BoardSquare(false, 0);
        }
    }


    /*
    *
    * "place" bombs according to the probabilities declared at the top of the file
    * those could be read from a config file or env variable, but for the
    * simplicity of the solution, I will not do that
    *
    */
    for (let i = 0; i < boardMetadata.rowCount; i++) {
        for (let j = 0; j < boardMetadata.colCount; j++) {
            // TODO place the bomb, you can use the following formula: Math.random() * maxProbability < bombProbability
            if (Math.random() * maxProbability < bombProbability) {
                board[i][j] = new BoardSquare(true, 0);
                bombCount++;
            }
        }
    }


    for (let i = 0; i < boardMetadata.rowCount; i++) {
        for (let j = 0; j < boardMetadata.colCount; j++) {
            if (!board[i][j].hasBomb) {
                board[i][j].bombsAround = countBombsAround(i, j);
            }
        }
    }

    /*
    *
    * TODO set the state of the board, with all the squares closed
    * and no flagged squares
    *
     */


    //BELOW THERE ARE SHOWCASED TWO WAYS OF COUNTING THE VICINITY BOMBS

    /*
    *
    * TODO count the bombs around each square
    *
    */
    function countBombsAround(i, j) {
        let arroundBombsCount = 0;
        for (let x = i - 1; x <= i + 1; x++) {
            for (let y = j - 1; y <= j + 1; y++) {
                if (x >= 0 && x <= boardMetadata.rowCount - 1 && y >= 0 && y <= boardMetadata.colCount - 1) {
                    if (board[x][y].hasBomb) {
                        arroundBombsCount++;
                    }
                }
            }
        }

        return arroundBombsCount;

    }

    /*
    *
    * print the board to the console to see the result
    *
    */
    console.log(board);

    const gameContainer = document.getElementById("gameContainer");
    gameContainer.innerHTML = "";

    for (let i = 0; i < boardMetadata.rowCount; i++) {

        const rowDiv = document.createElement("div");
        rowDiv.classList.add("row");

        for (let j = 0; j < boardMetadata.colCount; j++) {


            const newDiv = document.createElement("div");

            newDiv.classList.add("col", "tile", "closed-tile", "d-flex", "justify-content-center", "align-items-center");

            newDiv.addEventListener("click", handleClickTile);
            newDiv.addEventListener("contextmenu", handleMarkTile);
            newDiv.dataset.i = i;
            newDiv.dataset.j = j;


            if (board[i][j].hasBomb) {
                newDiv.classList.add("bg-danger");
                newDiv.classList.add("bomb");
                newDiv.innerHTML = `<img src="assets/bomb.png" class="icon invisible" alt="bomb" />`
            } else {
                newDiv.classList.add("bg-light");
                newDiv.innerHTML = `<span id="bombsAroundText" class="invisible">${board[i][j].bombsAround !== 0 ? board[i][j].bombsAround : ""}</span>`
            }


            rowDiv.appendChild(newDiv);
            gameContainer.appendChild(rowDiv);
        }
    }
}
/*
*
* simple object to keep the data for each square
* of the board
*
*/
class BoardSquare {
    constructor(hasBomb, bombsAround) {
        this.hasBomb = hasBomb;
        this.bombsAround = bombsAround;
    }
}

class Pair {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

function countAdjacentBombs(board, x, y, boardMetadata) {
    let bombCount = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            let newX = x + i;
            let newY = y + j;
            if (newX >= 0 && newX < boardMetadata.colCount && newY >= 0 && newY < boardMetadata.rowCount) {
                if (board[newX][newY].isBomb) {
                    bombCount++;
                }
            }
        }
    }
    return bombCount;
}
/*
* call the function that "handles the game"
* called at the end of the file, because if called at the start,
* all the global variables will appear as undefined / out of scope
*
 */
minesweeperGameBootstrapper(5, 5);

// TODO create the other required functions such as 'discovering' a tile, and so on (also make sure to handle the win/loss cases)

