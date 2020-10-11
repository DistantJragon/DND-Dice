drawPriorityList = [];
imageList = {};
shapeList = {};
textList = {};

var tempCanvas = document.getElementById("theCanvas");
var gameArea = {
    canvas: tempCanvas,
    ctx: tempCanvas.getContext("2d"),
    spriteScale: 0.1,
    lowerDimension: function() {
        if (this.canvas.height < this.canvas.width) {
            return this.canvas.height;
        } else {
            return this.canvas.width;
        }
    },
    clear: function() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    updateSprites: function() {
        for (list of drawPriorityList) {
            if (list instanceof Array) {
                for (sprite of list) {
                    sprite.update();
                }
            }
        }
    },
    resizeCanvas: function() {
        this.canvas.width  = window.innerWidth;
        this.canvas.height = window.innerHeight;
    },
    setFullscreen: function() {
        if(this.canvas.webkitRequestFullScreen) {
            this.canvas.webkitRequestFullScreen();
        } else if (this.canvas.mozRequestFullScreen) {
            this.canvas.mozRequestFullScreen();
        }
    }
};
gameArea.resizeCanvas();

var camera = {x: 0, y: 0};
var gradient;

strokeWidth = "10px";

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
    this.imageTrimLengthX = 1440;
    this.imageTrimLengthY = 1440;
    if (!(drawPriorityList[drawPriority] instanceof Array)) {
        drawPriorityList[drawPriority] = [];
    }
    drawPriorityList[drawPriority].push(this);
    this.update = function() {
        var ctx = gameArea.ctx;
        this.movement();
        ctx.drawImage(
            this.image, 
            this.imageTrimStartX, this.imageTrimStartY, 
            this.imageTrimLengthX, this.imageTrimLengthY,
            this.x - camera.x, this.y - camera.y,
            this.width, this.height
        );
    },
    this.movement = function() {
        this.velocity += this.acceleration;
        this.x += this.velocity * Math.cos(this.direction);
        this.y += this.velocity * Math.sin(this.direction);
    },
    this.moveCenterToSides = function(moveX, moveY) {
        this.x = this.x + ((this.width / 2) * moveX)
        this.y = this.y + ((this.height / 2) * moveY)
    }
}

function createNewShape(shape, fillStyle, stokeWidth, strokeStyle, width, height, x, y, drawPriority) {
    this.width = width;
    this.height = height;
    this.fillStyle = fillStyle;
    this.stokeWidth = stokeWidth;
    this.strokeStyle = strokeStyle;
    this.shape = shape;
    this.acceleration = 0;
    this.velocity = 0;
    this.direction = 0;
    this.x = x;
    this.y = y;
    if (!(drawPriorityList[drawPriority] instanceof Array)) {
        drawPriorityList[drawPriority] = [];
    }
    drawPriorityList[drawPriority].push(this);
    this.update = function() {
        var ctx = gameArea.ctx;
        this.movement();
        ctx.beginPath();
        if (this.shape == "rectangle") { ctx.rect(x - camera.x, this.y - camera.y, this.width, this,height); }
        else if (this.shape == "circle") { ctx.arc(this.x, this.y, this.width, 0, 2 * Math.PI); }
        ctx.fillStyle = this.fillStyle;
        ctx.fill();
        ctx.lineWidth = this.stokeWidth;
        ctx.strokeStyle = this.strokeStyle;
        ctx.stroke();
    },
    this.movement = function() {
        this.velocity += this.acceleration;
        this.x += this.velocity * Math.cos(this.direction);
        this.y += this.velocity * Math.sin(this.direction);
    },
    this.moveCenterToSides = function(moveX, moveY) {
        this.x = this.x + ((this.width / 2) * moveX)
        this.y = this.y + ((this.height / 2) * moveY)
    }
}

function createNewText(fontSize, font, color, x, y, drawPriority) {
    this.fontSize = fontSize;
    this.font = font;
    this.color = color;
    this.acceleration = 0;
    this.velocity = 0;
    this.direction = 0;
    this.x = x;
    this.y = y;
    if (!(drawPriorityList[drawPriority] instanceof Array)) {
        drawPriorityList[drawPriority] = [];
    }
    drawPriorityList[drawPriority].push(this)
    this.update = function() {
        var ctx = myGameArea.context;
        this.movement();
        ctx.font = this.fontSize + " " + this.font;
        ctx.fillStyle = this.color;
        ctx.fillText(this.text, this.x - camera.x, this.y - camera.y);
    },
    this.movement = function() {
        this.velocity += this.acceleration;
        this.x += this.velocity * Math.cos(this.direction);
        this.y += this.velocity * Math.sin(this.direction);
    }
}

function randomInteger(min, max) {;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function addInteractionSensors(canvas) {
    canvas.addEventListener('mousedown', mousePressed);
}

function mousePressed(e) {
    var cursorX = e.pageX;
    var cursorY = e.pageY;
    if (mouseIsOver(imageList.optionsButton, cursorX, cursorY)) { gameArea.setFullscreen(); }
}

function mouseIsOver(thing, mouseX, mouseY) {
    thingXStart = thing.x;
    thingXEnd = thing.x + thing.width;
    thingYStart = thing.y;
    thingYEnd = thing.y + thing.height;
    return  (
        mouseX >= thingXStart && 
        mouseX <= thingXEnd && 
        mouseY >= thingYStart && 
        mouseY <= thingYEnd
    );
}
function startGameLoop() {
    var canvas = gameArea.canvas
    if (canvas.getContext) {
        createAllSprites();
        addInteractionSensors(canvas);
        setInterval(gameLoop, 10);
    }
}
function createAllSprites() {
    spriteScale = gameArea.spriteScale;
    lowerDimension = gameArea.lowerDimension();
    imageList.optionsButton = new createNewImage(
        lowerDimension * spriteScale, lowerDimension * spriteScale,
        "options.png", lowerDimension * 0.01, lowerDimension * 0.01, 1 );
    // imageList.sliderStart = new createNewShape("circle", "BFBFBF", "0px", "#00000000", lowerDimension * spriteScale * 0.6, lowerDimension * spriteScale * 0.6);
}
function gameLoop() {
    gameArea.resizeCanvas();
    gameArea.clear();
    gameArea.updateSprites();
}
startGameLoop();
