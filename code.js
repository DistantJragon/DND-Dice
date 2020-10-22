var drawPriorityList = [];
var imageList = {};
var shapeList = {};
var textList = {};
var diceList = [];
var hudList = [];
var typeOfDiceSlotsList = [];
var numberOfDiceSlotsList = [];
var maxNumberOfDiceRows;
var maxNumberOfDiceColumns;
var maxNumberOfDice;
var gameLoopHasStarted = false;

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
        if (gameLoopHasStarted) {
            var spaceAvailiableInWidth = this.canvas.width - (2 * imageList.optionsButton.x) - imageList.optionsButton.width - shapeList.numberOfDiceSliderEnd.width;
            maxNumberOfDiceColumns = Math.floor(spaceAvailiableInWidth / this.lowerDimension() / this.spriteScale);
            var spaceAvailiableInHeight = this.canvas.height - shapeList.typeOfDiceSliderEnd.height - imageList.optionsButton.x
            maxNumberOfDiceRows = Math.floor(spaceAvailiableInHeight / this.lowerDimension() / this.spriteScale);
            maxNumberOfDice = maxNumberOfDiceColumns * maxNumberOfDiceRows;
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

function imageSprite(width, height, source, x, y, drawPriority) {
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
    if (drawPriority > 0) {this.hud = true; hudList.push(this);
    } else {this.hud = false;}
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

function shapeSprite(shape, fillStyle, stokeWidth, strokeStyle, width, height, x, y, drawPriority) {
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
    if (drawPriority > 0) {this.hud = true;
    } else {this.hud = false;}
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

function textSprite(fontSize, font, textAllignment, color, x, y, drawPriority) {
    this.fontSize = fontSize;
    this.font = font;
    this.textAllignment = textAllignment;
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
    if (drawPriority > 0) {this.hud = true; hudList.push(this);
    } else {this.hud = false;}
    this.update = function() {
        var ctx = myGameArea.context;
        this.movement();
        ctx.font = this.fontSize + " " + this.font;
        ctx.fillStyle = this.color;
        ctx.textAllign = this.textAllignment;
        ctx.fillText(this.text, this.x - camera.x, this.y - camera.y);
    },
    this.movement = function() {
        this.velocity += this.acceleration;
        this.x += this.velocity * Math.cos(this.direction);
        this.y += this.velocity * Math.sin(this.direction);
    }
}

function diceType(numberOfSides, pageNumber, numberOfDiceInAGroup, diceShapeNumber) {
    this.numberOfDice = 1;
    this.pageNumber = pageNumber;
    this.numberOfRows = 1;
    this.numberOfColumns = numberOfDiceInAGroup;
    this.numberOfDiceInAGroup = numberOfDiceInAGroup;
    this.createdDice = 0;
    this.tempRow = 1;
    this.tempColumn = 1;
    this.numberOfSides = numberOfSides;
    this.diceList = [];
    this.diceShapeNumber = diceShapeNumber;
    this.diceInRow = [];
    this.diceinColumn = [];
    this.createDice() = function() {
        for (i = this.createdDice; i < maxNumberOfDice; i++) {
            this.diceList.push(new dice(this.diceShapeNumber));
        }
    }
    
}
function dice(diceShapeNumber) {
    this.diceShapeNumber = diceShapeNumber;
    this.value = "";
    this.diceSprite = new imageSprite(
        lowerDimension * spriteScale, lowerDimension * spriteScale,
        "dice.png", 0, 0, 0
    );
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

function createHudSprites() {
    var spriteScale = gameArea.spriteScale;
    var lowerDimension = gameArea.lowerDimension();
    imageList.optionsButton = new imageSprite(
        lowerDimension * spriteScale, lowerDimension * spriteScale,
        "options.png", lowerDimension * 0.01, lowerDimension * 0.01, 1
    );
    var hudWidth = lowerDimension * spriteScale * 0.55;
    imageList.typeOfDiceSliderIcon = new imageSprite(
        hudWidth, hudWidth, 
        "dice.png", 
        lowerDimension * 0.01, 
        lowerDimension * -0.01 + gameArea.canvas.height - hudWidth, 1
    );
    imageList.typeOfDiceSliderIcon.timer = 0;
    imageList.numberOfDiceSliderIcon = new imageSprite(
        hudWidth, hudWidth,
        "poundSign.png",
        lowerDimension * -0.01 + gameArea.canvas.width - hudWidth,
        lowerDimension * -0.01 + gameArea.canvas.height - hudWidth, 1
    );
    var tDSI = imageList.typeOfDiceSliderIcon;
    var nDSI = imageList.numberOfDiceSliderIcon;
    shapeList.typeOfDiceSliderStart = new shapeSprite(
        "circle", "#BFBFBF", "0px", "#00000000", hudWidth, hudWidth,
        tDSI.x + hudWidth + 10, tDSI.y, 1
    );
    shapeList.typeOfDiceSliderEnd = new shapeSprite(
        "circle", "#BFBFBF", "0px", "#00000000", hudWidth, hudWidth,
        nDSI.x - hudWidth - 10, nDSI.y, 1
    );
    var sS = shapeList.typeOfDiceSliderStart;
    var sE = shapeList.typeOfDiceSliderEnd;
    shapeList.typeOfDiceSliderBar = new shapeSprite(
        "rectangle", "#BFBFBF", "0px", "#00000000", sE.x - sS.x, hudWidth,
        sS.x + hudWidth / 2, sS.y, 1
    );
    var sB = shapeList.typeOfDiceSliderBar;
    for (i = 0; i < 7; i++) {
        typeOfDiceSlotsList[i] = new shapeSprite(
            "circle", "#8B8B8B", "0px", "#00000000", hudWidth / 6, hudWidth / 6,
            sB.x + i * sB.width / 6, sB.y + hudWidth / 2, 2
        );
        typeOfDiceSlotsList[i].moveCenterToSides(0, -1)
    }

    shapeList.numberOfDiceSliderStart = new shapeSprite(
        "circle", "#BFBFBF", "0px", "#00000000", hudWidth, hudWidth,
        nDSI.x, nDSI.y - hudWidth - 10, 1
    );
    shapeList.numberOfDiceSliderEnd = new shapeSprite(
        "circle", "#BFBFBF", "0px", "#00000000", hudWidth, hudWidth,
        nDSI.x, lowerDimension * 0.01, 1
    );
    sS = shapeList.numberOfDiceSliderStart;
    sE = shapeList.numberOfDiceSliderEnd;
    shapeList.numberOfDiceSliderBar = new shapeSprite(
        "rectangle", "#BFBFBF", "0px", "#00000000", hudWidth, sE.y - sS.y,
        sS.x, sS.y + hudWidth / 2, 1
    );
    sB = shapeList.numberOfDiceSliderBar;
    gameArea.resizeCanvas();
    for (i = 0; i < maxNumberOfDice; i++) {
        numberOfDiceSlotsList[i] = new shapeSprite(
            "circle", "#8B8B8B", "0px", "#00000000", hudWidth / 6, hudWidth / 6,
            sB.x + hudWidth / 2, sB.y + i * sB.height / (maxNumberOfDice - 1), 2
        );
        numberOfDiceSlotsList[i].moveCenterToSides(-1, -1)
    }
}
function startGameLoop() {
    var canvas = gameArea.canvas
    if (canvas.getContext) {
        gameLoopHasStarted = true;
        createHudSprites();
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
