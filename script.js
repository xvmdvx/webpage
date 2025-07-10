const canvas1 = document.getElementById('game1');
const canvas2 = document.getElementById('game2');
const context1 = canvas1.getContext('2d');
const context2 = canvas2.getContext('2d');

context1.scale(20, 20);
context2.scale(20, 20);

const scoreElem1 = document.getElementById('score1');
const scoreElem2 = document.getElementById('score2');
const overlay = document.getElementById('overlay');
const overlayMsg = document.getElementById('overlay-message');
const highScoresElem = document.getElementById('highScores');

const maxHighScores = 5;

function getHighScores() {
    return JSON.parse(localStorage.getItem('tetrisHighScores') || '[]');
}

function saveHighScores(scores) {
    localStorage.setItem('tetrisHighScores', JSON.stringify(scores));
}

function updateHighScores() {
    const scores = getHighScores();
    highScoresElem.innerHTML = '<h2>HIGH SCORES</h2>' +
        scores.map(s => `<div>${s.name}: ${s.score}</div>`).join('');
}

function checkHighScore(score) {
    const scores = getHighScores();
    if (scores.length < maxHighScores || score > scores[scores.length - 1].score) {
        const name = prompt('Iniciales para ' + score);
        if (name) {
            scores.push({name: name.toUpperCase().slice(0,3), score});
            scores.sort((a,b) => b.score - a.score);
            scores.splice(maxHighScores);
            saveHighScores(scores);
        }
    }
}

function createMatrix(w, h) {
    const matrix = [];
    while (h--) {
        matrix.push(new Array(w).fill(0));
    }
    return matrix;
}

function createPiece(type) {
    switch (type) {
        case 'T':
            return [
                [0, 0, 0],
                [1, 1, 1],
                [0, 1, 0],
            ];
        case 'O':
            return [
                [2, 2],
                [2, 2],
            ];
        case 'L':
            return [
                [0, 3, 0],
                [0, 3, 0],
                [0, 3, 3],
            ];
        case 'J':
            return [
                [0, 4, 0],
                [0, 4, 0],
                [4, 4, 0],
            ];
        case 'I':
            return [
                [0, 5, 0, 0],
                [0, 5, 0, 0],
                [0, 5, 0, 0],
                [0, 5, 0, 0],
            ];
        case 'S':
            return [
                [0, 6, 6],
                [6, 6, 0],
                [0, 0, 0],
            ];
        case 'Z':
            return [
                [7, 7, 0],
                [0, 7, 7],
                [0, 0, 0],
            ];
    }
}

function drawMatrix(context, matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                context.fillStyle = colors[value];
                context.fillRect(x + offset.x, y + offset.y, 1, 1);
            }
        });
    });
}

function merge(arena, player) {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                arena[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
}

function collide(arena, player) {
    const m = player.matrix;
    const o = player.pos;
    for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
            if (m[y][x] !== 0 && (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

function arenaSweep(arena, player) {
    let cleared = 0;
    outer: for (let y = arena.length - 1; y > 0; --y) {
        for (let x = 0; x < arena[y].length; ++x) {
            if (arena[y][x] === 0) {
                continue outer;
            }
        }
        const row = arena.splice(y, 1)[0].fill(0);
        arena.unshift(row);
        ++y;
        player.score += 10;
        cleared++;
    }
    if (!player.lines) player.lines = 0;
    player.lines += cleared;
    if (cleared > 0 && player.lines % 10 === 0 && dropInterval > 200) {
        dropInterval -= 100;
    }
}

function rotate(matrix, dir) {
    for (let y = 0; y < matrix.length; ++y) {
        for (let x = 0; x < y; ++x) {
            [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
        }
    }
    if (dir > 0) {
        matrix.forEach(row => row.reverse());
    } else {
        matrix.reverse();
    }
}

function playerReset(player) {
    const pieces = 'TJLOSZI';
    player.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
    player.pos.y = 0;
    player.pos.x = (player.arena[0].length / 2 | 0) -
                   (player.matrix[0].length / 2 | 0);
    if (collide(player.arena, player)) {
        gameOver();
    }
}

function playerDrop(player) {
    player.pos.y++;
    if (collide(player.arena, player)) {
        player.pos.y--;
        merge(player.arena, player);
        arenaSweep(player.arena, player);
        playerReset(player);
        updateScore();
    }
    dropCounter = 0;
}

function playerMove(player, dir) {
    player.pos.x += dir;
    if (collide(player.arena, player)) {
        player.pos.x -= dir;
    }
}

function playerRotate(player, dir) {
    const pos = player.pos.x;
    let offset = 1;
    rotate(player.matrix, dir);
    while (collide(player.arena, player)) {
        player.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > player.matrix[0].length) {
            rotate(player.matrix, -dir);
            player.pos.x = pos;
            return;
        }
    }
}

const colors = [
    null,
    '#FF0D72',
    '#0DC2FF',
    '#0DFF72',
    '#F538FF',
    '#FF8E0D',
    '#FFE138',
    '#3877FF',
];

const player1 = {
    pos: {x: 0, y: 0},
    matrix: null,
    arena: createMatrix(12, 20),
    score: 0,
    context: context1,
};

const player2 = {
    pos: {x: 0, y: 0},
    matrix: null,
    arena: createMatrix(12, 20),
    score: 0,
    context: context2,
};

let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;
let gameRunning = false;

function startGame() {
    [player1, player2].forEach(p => {
        p.arena.forEach(row => row.fill(0));
        p.score = 0;
        p.lines = 0;
        playerReset(p);
    });
    updateScore();
    updateHighScores();
    dropInterval = 1000;
    lastTime = 0;
    gameRunning = true;
    overlay.classList.add('hidden');
    requestAnimationFrame(update);
}

function gameOver() {
    gameRunning = false;
    [player1, player2].forEach(p => checkHighScore(p.score));
    updateHighScores();
    overlayMsg.textContent = 'GAME OVER - ESPACIO PARA REINICIAR';
    overlay.classList.remove('hidden');
}

function draw() {
    [player1, player2].forEach(p => {
        p.context.fillStyle = '#000';
        p.context.fillRect(0, 0, canvas1.width, canvas1.height);

        drawMatrix(p.context, p.arena, {x:0, y:0});
        if (p.matrix) {
            drawMatrix(p.context, p.matrix, p.pos);
        }
    });
}

function update(time = 0) {
    if (!gameRunning) return;
    const deltaTime = time - lastTime;
    lastTime = time;

    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
        playerDrop(player1);
        playerDrop(player2);
    }

    draw();
    requestAnimationFrame(update);
}

function updateScore() {
    scoreElem1.innerText = player1.score;
    scoreElem2.innerText = player2.score;
    updateHighScores();
}

document.addEventListener('keydown', event => {
    if (!gameRunning && event.code === 'Space') {
        startGame();
        return;
    }
    if (!gameRunning) return;
    switch (event.key) {
        case 'ArrowLeft':
            playerMove(player1, -1);
            break;
        case 'ArrowRight':
            playerMove(player1, 1);
            break;
        case 'ArrowDown':
            playerDrop(player1);
            break;
        case 'ArrowUp':
            playerRotate(player1, 1);
            break;
        case 'a':
        case 'A':
            playerMove(player2, -1);
            break;
        case 'd':
        case 'D':
            playerMove(player2, 1);
            break;
        case 's':
        case 'S':
            playerDrop(player2);
            break;
        case 'w':
        case 'W':
            playerRotate(player2, 1);
            break;
    }
});

draw();
updateHighScores();
overlayMsg.textContent = 'INSERT COIN - PRESIONA ESPACIO';
