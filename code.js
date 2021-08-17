var drawPriorityList = [];
var imageList = {};
var shapeList = {};
var textList = {};
var diceGroupList = [];
var hudList = [];
var typeOfDiceSlotsList = [];
var numberOfDiceSlotsList = [];
var maxNumberOfDiceRowsPerPage;
var maxNumberOfDiceColumnsPerPage;
var maxNumberOfDicePerPage;
var gameLoopHasStarted = false;

var tempCanvas = document.getElementById("theCanvas");
var gameArea = {
    canvas: tempCanvas,
    ctx: tempCanvas.getContext("2d"),
    spriteScale: 1,
    hudScale: 1,
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
                    sprite.draw();
                }
            }
        }
    },
    checkWindowSize: function() {
        var canvasSizeChanged = false;
        if (this.canvas.width != window.innerWidth) {
            this.canvas.width  = window.innerWidth;
            canvasSizeChanged = true;
        }
        if (this.canvas.height != window.innerHeight) {
            this.canvas.height  = window.innerHeight;
            canvasSizeChanged = true;
        }

        if (canvasSizeChanged) {
            resetHud()
            return true
        } else {
            return false
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

var camera = {x: 0, y: 0};
var gradient;

function imageSprite(source,
    drawPriority = 0,
    width = 100, height = 100,
    x = 100, y = 100
) {
    this.image = new Image();
    this.image.src = "./media/" + source;
    this.width = width;
    this.height = height;
    this.alpha = 1;
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
    this.draw = function() {
        var ctx = gameArea.ctx;
        this.movement();
        ctx.globalAlpha = this.alpha;
        ctx.drawImage(
            this.image, 
            this.imageTrimStartX, this.imageTrimStartY, 
            this.imageTrimLengthX, this.imageTrimLengthY,
            this.x - (camera.x * this.hud), this.y - (camera.y * this.hud),
            this.width, this.height
        );
        ctx.globalAlpha = 1;
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

function shapeSprite(shape = "circle", 
    drawPriority = 0,
    width = 100, height = 100, 
    x = 100, y = 100,
    fillStyle = "#000000", stokeWidth = 10, strokeStyle = "#000000"
) {
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
    this.draw = function() {
        var ctx = gameArea.ctx;
        this.movement();
        ctx.beginPath();
        if (this.shape == "rectangle") {ctx.rect(this.x - (camera.x * this.hud), this.y - (camera.y * this.hud), this.width, this.height);}
        else if (this.shape == "circle") {ctx.arc(this.x + this.radius - (camera.x * this.hud), this.y + this.radius + (camera.y * this.hud), this.radius, 0, 2 * Math.PI);}
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
        if (this.shape == "rectagle") {
            this.x = this.x + ((this.width / 2) * moveX)
            this.y = this.y + ((this.height / 2) * moveY)
        } else if (this.shape == "circle") {
            this.x = this.x + ((this.radius) * moveX)
            this.y = this.y + ((this.radius) * moveY)
        }
    }
}

function textSprite(text,
    drawPriority = 0,
    x = 100, y = 100,
    fontSize = 12, color = "#000000FF", font = "10px sans-serif", textAllignment = "center"
) {
    this.text = text
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
    this.draw = function() {
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

function diceType(numberOfSidesList, pageNumber, numberOfDiceInGroup, diceShapeNumber) {
    this.numberOfDice = 1;
    this.numberOfGroups = 1;
    this.pageNumber = pageNumber;
    this.numberOfDiceInGroup = numberOfDiceInGroup;
    this.numberOfRows = 1;
    this.numberOfColumns = 1;
    this.numberOfRowsPerGroup = 1;
    this.numberOfColumnsPerGroup = numberOfDiceInGroup;
    this.maxNumberOfDiceRows = Math.floor(maxNumberOfDiceRowsPerPage / this.numberOfRowsPerGroup);
    this.maxNumberOfDiceColumns = Math.floor(maxNumberOfDiceColumnsPerPage / this.numberOfColumnsPerGroup);
    this.maxNumberOfGroups = this.maxNumberOfDiceRows * this.maxNumberOfDiceColumns;
    this.createdDiceGroups = 0;
    this.createdDice = 0;
    this.tempRow = 0;
    this.tempColumn = 0;
    this.numberOfSidesList = numberOfSidesList;
    this.diceGroupList = [];
    this.diceShapeNumber = diceShapeNumber;
    this.createDiceGroups = function() {
        for (i = this.createdDiceGroups; i < this.maxNumberOfGroups + 1; i++) {
            this.diceGroupList.push(new diceGroup(this.numberOfSidesList, this.numberOfDiceInGroup, this.diceShapeNumber));
            this.createdDiceGroups += 1;
        }
        this.createdDice = this.maxNumberOfDice;
    }
}
function diceGroup(numberOfSidesList, numberOfDiceInGroup, diceShapeNumber) {
    this.numberOfSidesList = numberOfSidesList;
    this.numberOfDiceInGroup = numberOfDiceInGroup;
    this.diceShapeNumber = diceShapeNumber;
    this.createdDice = 0;
    this.column = -1;
    this.row = -1;
    this.diceList = [];
    this.createDice = function() {
        for (i = this.createdDice; i < this.numberOfDiceInGroup; i++) {
            this.diceList[i].push(new dice(this, this.numberOfSidesList[i], this.diceShapeNumber))
            this.diceList[i].positionInGroup = i;
        }
    }
}

function dice(parent, numberOfSides, diceShapeNumber) {
    this.value = -1;
    this.parent = parent;
    this.diceShapeNumber = diceShapeNumber;
    this.positionInGroup = -1;
    this.diceSprite = {
        shape: new imageSprite(
            gameArea.lowerDimension * spriteScale, gameArea.lowerDimension * spriteScale,
            "dice.png", 0, 0, 0
        )
    }
    this.roll = function() {
        this.value = randomInteger(1, numberOfSides);
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
    var thingYStart = thing.y;
    if (thing.radius) {
        var thingXEnd = thing.x + thing.radius;
        var thingYEnd = thing.y + thing.radius;
    } else {
        var thingXEnd = thing.x + thing.width;
        var thingYEnd = thing.y + thing.height;
    }
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
}
function resetHud() {
    var hudScale = gameArea.hudScale;
    var lowerDimension = gameArea.lowerDimension();
    var lD = lowerDimension;
    var settingsWidth = lD * hudScale * 0.1;
    var sliderWidth = settingsWidth * 0.55;
    var padding = lD * 0.01;
    imageList.optionsButton.width = settingsWidth;
    imageList.optionsButton.height = settingsWidth;    
    imageList.optionsButton.x = padding;
    imageList.optionsButton.y = padding;
    imageList.typeOfDiceSliderIcon.width = sliderWidth;
    imageList.typeOfDiceSliderIcon.height = sliderWidth;
    imageList.typeOfDiceSliderIcon.x = padding;
    imageList.typeOfDiceSliderIcon.y = gameArea.canvas.height - sliderWidth - padding;
    imageList.numberOfDiceSliderIcon.width = sliderWidth;
    imageList.numberOfDiceSliderIcon.height = sliderWidth;
    imageList.numberOfDiceSliderIcon.x = gameArea.canvas.width - sliderWidth - padding;
    imageList.numberOfDiceSliderIcon.y = gameArea.canvas.height - sliderWidth - padding;
    var tDSI = imageList.typeOfDiceSliderIcon;
    var nDSI = imageList.numberOfDiceSliderIcon;
    shapeList.typeOfDiceSliderStart.radius = sliderWidth * 0.5;
    shapeList.typeOfDiceSliderStart.x = sliderWidth + padding * 2;
    shapeList.typeOfDiceSliderStart.y = tDSI.y;
    shapeList.typeOfDiceSliderEnd.radius = sliderWidth * 0.5;
    shapeList.typeOfDiceSliderEnd.x = nDSI.x - sliderWidth - padding;
    shapeList.typeOfDiceSliderEnd.y = nDSI.y;
    var sS = shapeList.typeOfDiceSliderStart;
    var sE = shapeList.typeOfDiceSliderEnd;
    shapeList.typeOfDiceSliderBar.width = sE.x - sS.x;
    shapeList.typeOfDiceSliderBar.height = sliderWidth;
    shapeList.typeOfDiceSliderBar.x = sS.x + sliderWidth * 0.5;
    shapeList.typeOfDiceSliderBar.y = tDSI.y;
    var sB = shapeList.typeOfDiceSliderBar;
    for (i = 0; i < 7; i++) {
        typeOfDiceSlotsList[i].radius = sliderWidth * 0.125;
        typeOfDiceSlotsList[i].x = sB.x + i * sB.width / 6;
        typeOfDiceSlotsList[i].y = sB.y + sliderWidth * 0.5;
        typeOfDiceSlotsList[i].moveCenterToSides(-1, -1);
    }
    shapeList.numberOfDiceSliderStart.radius = sliderWidth * 0.5;
    shapeList.numberOfDiceSliderStart.x = imageList.numberOfDiceSliderIcon.x;
    shapeList.numberOfDiceSliderStart.y = nDSI.y - sliderWidth - padding;
    shapeList.numberOfDiceSliderEnd.radius = sliderWidth * 0.5;
    shapeList.numberOfDiceSliderEnd.x = nDSI.x;
    shapeList.numberOfDiceSliderEnd.y = padding;
    sS = shapeList.numberOfDiceSliderStart;
    sE = shapeList.numberOfDiceSliderEnd;
    shapeList.numberOfDiceSliderBar.width = sliderWidth;
    shapeList.numberOfDiceSliderBar.height = sE.y - sS.y;
    shapeList.numberOfDiceSliderBar.x = nDSI.x;
    shapeList.numberOfDiceSliderBar.y= sS.y + sliderWidth * 0.5;
    sB = shapeList.numberOfDiceSliderBar;
    gameArea.checkMaxNumberOfDice();
    for (i = 0; i < maxNumberOfDicePerPage; i++) {
        if (numberOfDiceSlotsList[i]) {
            numberOfDiceSlotsList[i].radius = sliderWidth * 0.125;
            numberOfDiceSlotsList[i].x = sB.x + sliderWidth * 0.5;
            numberOfDiceSlotsList[i].y = sB.y + i * sB.height / (maxNumberOfDicePerPage - 1);
            numberOfDiceSlotsList[i].fillStyle = "#8B8B8BFF"
        } else {
            numberOfDiceSlotsList[i] = new shapeSprite(
                "circle", 2,
                sliderWidth / 4, sliderWidth / 4,
                sB.x + sliderWidth * 0.5, sB.y + i * sB.height / (maxNumberOfDicePerPage - 1),
                "#8B8B8BFF", "0px", "#00000000"
            );
        }
        numberOfDiceSlotsList[i].moveCenterToSides(-1, -1)
    }
    while (i < numberOfDiceSlotsList.length) {
        numberOfDiceSlotsList[i].fillStyle = "#00000000";
        i++;
    }
}

function createHudSprites() {
    var hudScale = gameArea.hudScale;
    var lowerDimension = gameArea.lowerDimension();
    var lD = lowerDimension;
    var settingsWidth = lD * hudScale * 0.1;
    var sliderWidth = settingsWidth * 0.55;
    var padding = lD * 0.01;
    imageList.optionsButton = new imageSprite(
        "options.png", 1,
        settingsWidth, settingsWidth,
        padding, padding
    );
    imageList.typeOfDiceSliderIcon = new imageSprite( 
        "dice.png", 1,
        sliderWidth, sliderWidth,
        padding, gameArea.canvas.height - sliderWidth - padding
    );
    imageList.typeOfDiceSliderIcon.timer = 0;
    imageList.numberOfDiceSliderIcon = new imageSprite(   
        "poundSign.png", 1,
        sliderWidth, sliderWidth,
        gameArea.canvas.width - sliderWidth - padding,
        gameArea.canvas.height - sliderWidth - padding
    );
    var tDSI = imageList.typeOfDiceSliderIcon;
    var nDSI = imageList.numberOfDiceSliderIcon;
    shapeList.typeOfDiceSliderStart = new shapeSprite(
        "circle", 1, 
        sliderWidth, sliderWidth, 
        tDSI.x + sliderWidth + padding, tDSI.y,
        "#BFBFBF", "0px", "#00000000"
    );
    shapeList.typeOfDiceSliderEnd = new shapeSprite(  
        "circle", 1, 
        sliderWidth, sliderWidth, 
        nDSI.x - sliderWidth - padding, nDSI.y,
        "#BFBFBF", "0px", "#00000000"
    );
    var sS = shapeList.typeOfDiceSliderStart;
    var sE = shapeList.typeOfDiceSliderEnd;
    shapeList.typeOfDiceSliderBar = new shapeSprite(
        "rectangle", 1,
        sE.x - sS.x, sliderWidth,
        sS.x + sliderWidth * 0.5, sS.y,
        "#BFBFBF", "0px", "#00000000",
    );
    var sB = shapeList.typeOfDiceSliderBar;
    for (i = 0; i < 7; i++) {
        typeOfDiceSlotsList[i] = new shapeSprite(
            "circle", 2,
            sliderWidth / 4, sliderWidth / 4,
            sB.x + i * sB.width / 6, sB.y + sliderWidth / 2,
            "#8B8B8B", "0px", "#00000000"
        );
        typeOfDiceSlotsList[i].moveCenterToSides(0, -1)
    }
    shapeList.numberOfDiceSliderStart = new shapeSprite(
        "circle", 1,
        sliderWidth, sliderWidth,
        nDSI.x, nDSI.y - sliderWidth - padding,
        "#BFBFBF", "0px", "#00000000"
    );
    shapeList.numberOfDiceSliderEnd = new shapeSprite(
        "circle", 1,
        sliderWidth, sliderWidth,
        nDSI.x, padding,
        "#BFBFBF", "0px", "#00000000"
    );
    sS = shapeList.numberOfDiceSliderStart;
    sE = shapeList.numberOfDiceSliderEnd;
    shapeList.numberOfDiceSliderBar = new shapeSprite(
        "rectangle", 1,
        sliderWidth, sE.y - sS.y,
        sS.x, sS.y + sliderWidth / 2,
        "#BFBFBF", "0px", "#00000000"
    );
    sB = shapeList.numberOfDiceSliderBar;
    gameArea.checkMaxNumberOfDice = function() {
        var hudScale = gameArea.hudScale;
        var lowerDimension = gameArea.lowerDimension();
        var lD = lowerDimension;
        var settingsWidth = lD * hudScale * 0.1;
        var sliderWidth = settingsWidth * 0.55;
        var padding = lD * 0.01;
        var spaceAvailiableInWidth = gameArea.canvas.width - (2 * padding) - settingsWidth - sliderWidth;
        maxNumberOfDiceColumnsPerPage = Math.floor(spaceAvailiableInWidth / lD / gameArea.spriteScale * 10);
        var spaceAvailiableInHeight = gameArea.canvas.height - sliderWidth - imageList.optionsButton.x
        maxNumberOfDiceRowsPerPage = Math.floor(spaceAvailiableInHeight / lD / gameArea.spriteScale * 10);
        maxNumberOfDicePerPage = maxNumberOfDiceColumnsPerPage * maxNumberOfDiceRowsPerPage;
    }
    gameArea.checkMaxNumberOfDice();
    for (i = 0; i < maxNumberOfDicePerPage; i++) {
        numberOfDiceSlotsList[i] = new shapeSprite(
            "circle", 2,
            sliderWidth / 4, sliderWidth / 4,
            sB.x + sliderWidth / 2, sB.y + i * sB.height / (maxNumberOfDicePerPage - 1),
            "#8B8B8B", "0px", "#00000000"
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
    gameArea.checkWindowSize();
    // move camera
    gameArea.clear();
    controlHUD();
    gameArea.updateSprites();
}
function nearestSquareNumber(number) {
    var nearestRoot = Math.ceil(Math.sqrt(number));
    return nearestRoot * nearestRoot;
}
startGameLoop();
