var gameArea = {
    canvas: document.getElementById("theCanvas"),
    ctx: canvas.getContext("2d"),
}
gameArea.canvas.width = document.body.clientWidth;
gameArea.canvas.height = document.body.clientHeight;

imageList = []
shapeList = []
textList = []

var camera = {x: 0, y: 0};

function createNewImage(width, height, source, x, y) {
    this.image = new Image(),
    this.image.src = "./media/" + source,
    this.width = width,
    this.height = height;
    this.acceleration = 0,
    this.velocity = 0,
    this.direction = 0,
    this.x = x,
    this.y = y,
    this.imageTrimStartX = 0,
    this.imageTrimStartY = 0,
    this.imageTrimLengthX = width,
    this.imageTrimLengthY = height,
    this.update = function() {
        var ctx = gameArea.ctx;
        this.move();
        ctx.drawImage(
            this.image, this.this.imageTrimStartX, this.imageTrimStartY, this.imageTrimLengthX, this.imageTrimLengthY,
            this.x - camera.x, this.y - camera.y,
            this.width, this.height
        );
    },
    this.move() = function() {
        this.velocity += this.acceleration;
        this.x += this.velocity * Math.cos(this.direction);
        this.y += this.velocity * Math.sin(this.direction);
    }
}

function createNewShape(width, height, color, x, y) {

}

function createNewText(width, height, color, x, y) {

}

function startGameLoop() {
    if (canvas.getContext) {
        setInterval(gameLoop(), 10);
    }
}
function gameLoop() {

}

function randomInteger(min, max) {;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }