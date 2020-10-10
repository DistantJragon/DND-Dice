console.log('1')
console.log('2')
var gameArea = {
    canvas: document.getElementById("theCanvas"),
    ctx: gameArea.canvas.getContext("2d"),
    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
};
gameArea.canvas.width = document.body.clientWidth;
gameArea.canvas.height = document.body.clientHeight;

drawPriorityList = []
imageList = []
shapeList = []
textList = []

var camera = {x: 0, y: 0};

function createNewImage(width, height, source, x, y, drawPriority) {
    this.image = new Image();
    this.image.src = "./media/" + source;
    this.width = width;
    this.height = height;
    this.acceleration = 0;
    this.velocity = 0;
    this.direction = 0;
    this.x = x;
    this.y = y;
    this.imageTrimStartX = 0;
    this.imageTrimStartY = 0;
    this.imageTrimLengthX = width;
    this.imageTrimLengthY = height;
    if (!(drawPriorityList[drawPriority] instanceof Array)) {
        drawPriorityList[drawPriority] = [];
    }
    drawPriorityList[drawPriority].push(this)
    imageList.push(this.image);
    this.update = function() {
        var ctx = gameArea.ctx;
        this.move();
        ctx.drawImage(
            this.image, 
            this.this.imageTrimStartX, this.imageTrimStartY, 
            this.imageTrimLengthX, this.imageTrimLengthY,
            this.x - camera.x, this.y - camera.y,
            this.width, this.height
        );
    }
    this.move() = function() {
        this.velocity += this.acceleration;
        this.x += this.velocity * Math.cos(this.direction);
        this.y += this.velocity * Math.sin(this.direction);
    }
}

function createNewShape(width, height, color, shape, x, y, drawPriority) {
    this.width = width;
    this.height = height;
    this.color = color
    this.shape = shape
    this.acceleration = 0;
    this.velocity = 0;
    this.direction = 0;
    this.x = x;
    this.y = y;
    if (!(drawPriorityList[drawPriority] instanceof Array)) {
        drawPriorityList[drawPriority] = [];
    }
    drawPriorityList[drawPriority].push(this)
    shapeList.push(this)
    this.update = function() {
        var ctx = gameArea.ctx;
        ctx.fillStyle = this.color;
        if (this.shape = 'rectangle') {
            ctx.fillRect(
                this.x - camera.x, this.y - camera.y, 
                this.width, this.height
            );
        }
    }
    this.move() = function() {
        this.velocity += this.acceleration;
        this.x += this.velocity * Math.cos(this.direction);
        this.y += this.velocity * Math.sin(this.direction);
    }
}

function createNewText(fontSize, font, color, x, y, drawPriority) {
    this.fontSize = fontSize
    this.font = font
    this.color = color
    this.acceleration = 0;
    this.velocity = 0;
    this.direction = 0;
    this.x = x;
    this.y = y;
    if (!(drawPriorityList[drawPriority] instanceof Array)) {
        drawPriorityList[drawPriority] = [];
    }
    drawPriorityList[drawPriority].push(this)
    textList.push(this);
    this.update = function() {
        var ctx = myGameArea.context;
            ctx.font = this.fontSize + " " + this.font;
            ctx.fillStyle = this.color;
            ctx.fillText(this.text, this.x - camera.x, this.y - camera.y);
    }
    this.move() = function() {
        this.velocity += this.acceleration;
        this.x += this.velocity * Math.cos(this.direction);
        this.y += this.velocity * Math.sin(this.direction);
    }
}

function startGameLoop() {
    if (canvas.getContext) {
        setInterval(gameLoop(), 10);
    }
}
function gameLoop() {
    gameArea.clear()

}

function randomInteger(min, max) {;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}