var drawPriorityList = [];
var imageList = {};
var shapeList = {};
var textList = {};
var hudList = [];

var tempCanvas = document.getElementById("theCanvas");
var gameArea = {
    canvas: tempCanvas,
    ctx: tempCanvas.getContext("2d"),
    spriteScale: 0.1,
    canvasSizeChanged: false,
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
            if (list) {
                for (sprite of list) {
                    sprite.update();
                }
            }
        }
    },
    resizeCanvas: function() {
        this.canvasSizeChanged = false;
        if (this.canvas.width != window.innerWidth) {
            this.canvas.width  = window.innerWidth;
            this.canvasSizeChanged = true;
        }
        if (this.canvas.height != window.innerHeight) {
            this.canvas.height  = window.innerHeight;
            this.canvasSizeChanged = true;
        }
    },
    setFullscreen: function() {
        if (this.canvas.webkitRequestFullScreen) {
            this.canvas.webkitRequestFullScreen();
        } else if (this.canvas.mozRequestFullScreen) {
            this.canvas.mozRequestFullScreen();
        }
    }
};
gameArea.resizeCanvas();

var camera = {x: 0, y: 0};
var gradient;

function createNewImage(width, height, source, x, y, drawPriority, hud) {
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
    if (!(drawPriorityList[drawPriority])) {drawPriorityList[drawPriority] = [];}
    drawPriorityList[drawPriority].push(this);
    this.hud = hud;
    if (this.hud) {hudList.push(this)}
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

function createNewShape(shape, fillStyle, stokeWidth, strokeStyle, width, height, x, y, drawPriority, hud) {
    this.width = width;
    this.height = height;
    if (shape == "circle") {this.radius = this.width / 2;}
    this.fillStyle = fillStyle;
    this.stokeWidth = stokeWidth;
    this.strokeStyle = strokeStyle;
    this.shape = shape;
    this.acceleration = 0;
    this.velocity = 0;
    this.direction = 0;
    this.x = x;
    this.y = y;
    if (!(drawPriorityList[drawPriority])) {
        drawPriorityList[drawPriority] = [];
    }
    drawPriorityList[drawPriority].push(this);
    this.hud = hud;
    if (this.hud) {hudList.push(this)}
    this.update = function() {
        var ctx = gameArea.ctx;
        this.movement();
        ctx.beginPath();
        if (this.shape == "rectangle") {ctx.rect(this.x - camera.x, this.y - camera.y, this.width, this.height);}
        else if (this.shape == "circle") {ctx.arc(this.x + this.radius, this.y + this.radius, this.radius, 0, 2 * Math.PI);}
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

function createNewText(fontSize, font, color, x, y, drawPriority, hud) {
    this.fontSize = fontSize;
    this.font = font;
    this.color = color;
    this.acceleration = 0;
    this.velocity = 0;
    this.direction = 0;
    this.x = x;
    this.y = y;
    if (!(drawPriorityList[drawPriority])) {
        drawPriorityList[drawPriority] = [];
    }
    drawPriorityList[drawPriority].push(this)
    this.hud = hud;
    if (this.hud) {hudList.push(this)}
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
    if (mouseIsOver(imageList.optionsButton, cursorX, cursorY)) {gameArea.setFullscreen();}
}

function mouseIsOver(thing, mouseX, mouseY) {
    var thingXStart = thing.x;
    var thingXEnd = thing.x + thing.width;
    var thingYStart = thing.y;
    var thingYEnd = thing.y + thing.height;
    return  (
        mouseX >= thingXStart && 
        mouseX <= thingXEnd && 
        mouseY >= thingYStart && 
        mouseY <= thingYEnd
    );
}

function controlHUD() {
    var options = imageList.optionsButton;
    var tDSI = imageList.typeOfDiceSliderIcon;
    var nDSI = imageList.numberOfDiceSliderIcon;
    tDSI.timer += 1;
    if (tDSI.timer > 40) {
        tDSI.timer = 0;
        tDSI.imageTrimStartX += 1440;
    }
    if (tDSI.imageTrimStartX > 5760) {
        tDSI.imageTrimStartX = 0;
    }
    for (hudElement of hudList) {
        hudElement.x += camera.x;
        hudElement.y += camera.y;
    }
}
function resetHud() {
    for (hudElement of hudList) {
        hudElement.x -= camera.x;
        hudElement.y -= camera.y;
    }
}

function createAllSprites() {
    var spriteScale = gameArea.spriteScale;
    var lowerDimension = gameArea.lowerDimension();
    imageList.optionsButton = new createNewImage(
        lowerDimension * spriteScale, lowerDimension * spriteScale,
        "options.png", lowerDimension * 0.01, lowerDimension * 0.01, 1, true
    );
    var dBIWidth = lowerDimension * spriteScale * 0.55;
    imageList.typeOfDiceSliderIcon = new createNewImage(
        dBIWidth, dBIWidth, 
        "dice.png", 
        lowerDimension * 0.01, 
        lowerDimension * -0.01 + gameArea.canvas.height - dBIWidth, 1, true
    );
    imageList.typeOfDiceSliderIcon.timer = 0;
    imageList.numberOfDiceSliderIcon = new createNewImage(
        dBIWidth, dBIWidth,
        "poundSign.png",
        lowerDimension * -0.01 + gameArea.canvas.width - dBIWidth,
        lowerDimension * -0.01 + gameArea.canvas.height - dBIWidth, 1, true
    );
    var tDSI = imageList.typeOfDiceSliderIcon;
    var nDSI = imageList.numberOfDiceSliderIcon;
    shapeList.typeOfDiceSliderStart = new createNewShape(
        "circle", "#BFBFBF", "0px", "#00000000", dBIWidth, dBIWidth,
        tDSI.x + dBIWidth + 10, tDSI.y, 1, true
    );
    shapeList.typeOfDiceSliderEnd = new createNewShape(
        "circle", "#BFBFBF", "0px", "#00000000", dBIWidth, dBIWidth,
        nDSI.x - dBIWidth - 10, nDSI.y, 1, true
    );
    var sS = shapeList.typeOfDiceSliderStart;
    var sE = shapeList.typeOfDiceSliderEnd;
    shapeList.typeOfDiceSliderBar = new createNewShape(
        "rectangle", "#BFBFBF", "0px", "#00000000", sE.x - sS.x, dBIWidth,
        sS.x + dBIWidth / 2, sS.y, 1, true
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
function gameLoop() {
    gameArea.resizeCanvas();
    // move camera
    gameArea.clear();
    controlHUD();
    gameArea.updateSprites();
    resetHud();
}
startGameLoop();
