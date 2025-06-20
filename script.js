// Juego Tetris minimalista
const canvas = document.getElementById('game');
const context = canvas.getContext('2d');

context.scale(20, 20);

function arenaSweep() {
    // TODO: añadir lógica de colisión y limpieza de filas
}

function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                context.fillStyle = 'red';
                context.fillRect(x + offset.x,
                                 y + offset.y,
                                 1, 1);
            }
        });
    });
}

function draw() {
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);

    drawMatrix(player.matrix, player.pos);
}

let player = {
    pos: {x: 5, y: 5},
    matrix: [
        [1, 1],
        [1, 1]
    ]
};

draw();
