export const TILE_STATUS = {
    HIDDEN: "hidden",
    MINE: "mine",
    NUMBER: "number",
    MARKED: "marked"
};

// Create board
export function createBoard(boardSize, numberOfMines) {
    const board = [];
    const minePositions = getMinePositions(boardSize, numberOfMines);
    for (let x = 0; x < boardSize; x++) {
        board.push([]);
        for (let y = 0; y < boardSize; y++) {
            const element = document.createElement("div");
            element.dataset.status = TILE_STATUS.HIDDEN;
            const tile = {
                element,
                x,
                y,
                mine: minePositions.some(positionMatch.bind(null, { x, y })),
                get status() {
                    return this.element.dataset.status;
                },
                set status(value) {
                    this.element.dataset.status = value;
                }
            };
            board[x].push(tile);
        }
    }
    return board;
}

function getMinePositions(boardSize, numberOfMines) {
    const positions = [];
    while (positions.length < numberOfMines) {
        const position = {
            x: randomNumber(boardSize),
            y: randomNumber(boardSize)
        };
        if (!positions.some(positionMatch.bind(null, position))) {
            positions.push(position);
        }
    }
    return positions;
}

function positionMatch(positionA, positionB) {
    return positionA.x === positionB.x && positionA.y === positionB.y;
}

function randomNumber(size) {
    return Math.floor(Math.random() * size);
}

export function markTile(tile) {
    if (tile.status !== TILE_STATUS.HIDDEN && tile.status !== TILE_STATUS.MARKED) {
        return;
    }
    if (tile.status === TILE_STATUS.MARKED) {
        tile.status = TILE_STATUS.HIDDEN;
    } else {
        tile.status = TILE_STATUS.MARKED;
    }
}

export function revealTile(board, tile) {
    if (tile.status !== TILE_STATUS.HIDDEN) {
        return;
    }
    if (tile.mine) {
        tile.status = TILE_STATUS.MINE;
        return;
    }
    tile.status = TILE_STATUS.NUMBER;
    const adjacentTiles = nearbyTiles(board, tile);
    const mines = adjacentTiles.filter(t => t.mine);
    if (mines.length === 0) {
        adjacentTiles.forEach(revealTile.bind(null, board));
    } else {
        tile.element.textContent = mines.length;
        if (mines.length === 1) {
            tile.element.classList.add("one");
        }
        if (mines.length === 2) {
            tile.element.classList.add("two");
        }
        if (mines.length === 3) {
            tile.element.classList.add("three");
        }
        if (mines.length === 4) {
            tile.element.classList.add("four");
        }
        if (mines.length === 5) {
            tile.element.classList.add("five");
        }
        if (mines.length === 6) {
            tile.element.classList.add("six");
        }
        if (mines.length === 7) {
            tile.element.classList.add("seven");
        }
        if (mines.length === 8) {
            tile.element.classList.add("eight");
        }
    }
}

function nearbyTiles(board, { x, y }) {
    const tiles = [];
    for (let xOffset = -1; xOffset <= 1; xOffset++) {
        for (let yOffset = -1; yOffset <= 1; yOffset++) {
            const tile = board[x + xOffset]?.[y + yOffset];
            if (tile) tiles.push(tile);
        }
    }
    return tiles;
}

export function checkWin(board) {
    return board.every(row => {
        return row.every(tile => {
            return tile.status === TILE_STATUS.NUMBER || (tile.mine && (tile.status === TILE_STATUS.MARKED || tile.status === TILE_STATUS.HIDDEN));
        });
    });
}

export function checkLose(board) {
    return board.some(row => {
        return row.some(tile => {
            return tile.status === TILE_STATUS.MINE;
        });
    });
}