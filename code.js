var spriteList = [];
var textList = [];
var diceList = {};
var canvasWidth;
var canvasHeight;
var camera = {x: 0, y: 0, mouseX: 0, mouseY: 0};
var startCam = {x: 0, y: 0};
var diceWidth = 250;

function Component(width, height, color, x, y, type) {
  "use strict";
  this.type = type;
  if (type === "image") {
    this.image = new Image();
    this.image.src = "./media/" + color;
    spriteList.push(this);
  } else if (type === "text") {
    textList.push(this);
  } else {
    this.rectangle = true;
    spriteList.push(this);
  }
  this.width = width;
  this.height = height;
  this.velocityX = 0;
  this.velocityY = 0;
  this.x = x;
  this.y = y;
  this.sourceX = 0;
  this.destinationX = x;
  this.destinationY = y;
  this.row = 0;
  this.column = 0;
  this.awayX = 0;
  this.awayY = 0;
  this.update = function () {
    var ctx = myGameArea.context;
    if (this.type === "text") {
      ctx.font = this.width + " " + this.height;
      ctx.fillStyle = color;
      ctx.fillText(this.text, this.x - camera.x + startCam.x, this.y - camera.y + startCam.y);
    } else if (type === "image") {
      ctx.drawImage(this.image,
                    this.sourceX,
                    0,
                    this.width,
                    this.height,
                    this.x - camera.x + startCam.x - (this.width / 2),
                    this.y - camera.y + startCam.y - (this.height / 2),
                    this.width,
                    this.height);
    } else {
      ctx.fillStyle = color;
      ctx.fillRect(this.x - camera.x + startCam.x, this.y - camera.y + startCam.y, this.width, this.height);
    }
  };
  this.vroom = function () {
    this.x += this.velocityX;
    this.y += this.velocityY;
  };
}
function DiceType(pageNumber) {
  "use strict";
  var i;
  this.numberOfDice = 1;
  this.pageNumber = pageNumber;
  this.maxRows = Math.floor((canvasHeight - 100) / diceWidth);
  this.maxColumns = Math.floor((canvasWidth - 270) / diceWidth);
  this.numberOfRows = 1;
  this.numberOfColumns = 1;
  this.maxDice = this.maxColumns * this.maxRows;
  if (this.pageNumber === 4) {
    this.maxColumns = this.maxColumns - (this.maxColumns % 2);
    this.maxDice = this.maxColumns * this.maxRows / 2;
    this.numberOfColumns = 2;
  }
  this.createdDice = 0;
  this.tempRow = 1;
  this.tempColumn = 1;
  if (this.pageNumber <= 3) {
    this.sides = 2 * (this.pageNumber + 2);
  } else if (this.pageNumber === 4) {
    this.sides = 10;
  } else if (this.pageNumber === 5) {
    this.sides = 12;
  } else if (this.pageNumber === 6) {
    this.sides = 20;
  }
  this.getDiceInRow = function (rowNumber) {
    var i, diceListInThisRow = [], D00Multiplier = 1;
    if (this === diceList.D00) { D00Multiplier = 2; }
    for (i = 1; i < this.maxDice * D00Multiplier + 1; i += 1) {
      if (this[i].row === rowNumber) {
        diceListInThisRow.push(this[i]);
      }
    }
    return diceListInThisRow;
  };
  this.getDiceInColumn = function (columnNumber) {
    var i, diceListInThisColumn = [], D00Multiplier = 1;
    if (this === diceList.D00) { D00Multiplier = 2; }
    for (i = 1; i < this.maxDice * D00Multiplier + 1; i += 1) {
      if (this[i].column === columnNumber) {
        diceListInThisColumn.push(this[i]);
      }
    }
    return diceListInThisColumn;
  };
  if (this.pageNumber === 4) {
    this.createSprites = function (width, height) {
      var i, tempRows = 1, tempColumns = 2, tempNumberOfRows = 1, tempNumberOfColumns = 2;
      for (i = this.createdDice + 2; i < this.maxDice * 2 + 2; i += 2) {
        this[i - 1] = new Component(width, height, "D00.png", canvasWidth, canvasHeight, "image");
        this[i] = new Component(width, height, "D10.png", canvasWidth, canvasHeight, "image");
      }
      for (i = 2; i < this.maxDice * 2 + 2; i += 2) {
        this[i - 1].awayX = (Math.floor((tempColumns - 1) / 2) / (this.maxColumns / 2) + pageNumber) * canvasWidth;
        this[i].awayX = (Math.floor((tempColumns) / 2) / (this.maxColumns / 2) + pageNumber) * canvasWidth;
        if (i === tempRows * tempColumns) {
          if (tempRows < this.maxRows && (tempRows < tempColumns / 2 || tempColumns === this.maxColumns)) {
            tempNumberOfRows += 1;
            tempRows += 1;
            tempColumns = 2;
          } else if (tempColumns !== this.maxColumns) {
            tempNumberOfColumns += 2;
            tempRows = 1;
            tempColumns += 2;
          }
        } else {
          if (tempColumns < tempNumberOfColumns - 1) {
            tempColumns += 2;
          } else if (tempRows < tempNumberOfRows) {
            tempRows += 1;
          }
        }
      }
      for (i = this.numberOfDice * 2 + 1; i < this.maxDice * 2 + 1; i += 1) {
        this[i].awayY = canvasHeight * 3 / 2;
        this[i].x = this[i].awayX;
        this[i].y = this[i].awayY;
        this[i].destinationX = this[i].awayX;
        this[i].destinationY = this[i].awayY;
      }
      if (this.createdDice === 0) {
        this.intialize();
      }
      this.createdDice = this.maxDice;
    };
    this.changeDestinations = function (amountOfChange) {
      var i;
      if (amountOfChange === 1) {
        if (this.numberOfDice === this.numberOfRows * this.numberOfColumns / 2 + 1) {
          if (this.numberOfRows !== this.maxRows && (this.numberOfRows < this.numberOfColumns / 2 || this.numberOfColumns === this.maxColumns)) {
            this.numberOfRows += 1;
            this.tempRow = this.numberOfRows;
            this.tempColumn = 1;
          } else if (this.numberOfColumns !== this.maxColumns) {
            this.numberOfColumns += 2;
            this.tempRow = 1;
            this.tempColumn += 2;
          }
        } else {
          if (this.tempRow < this.numberOfRows) {
            this.tempRow += 1;
          }
          if (this.tempColumn <= this.numberOfColumns / 2) {
            this.tempColumn += 2;
          }
        }
        this[this.numberOfDice * 2 - 1].row = this.tempRow;
        this[this.numberOfDice * 2 - 1].column = this.tempColumn;
        this[this.numberOfDice * 2].row = this.tempRow;
        this[this.numberOfDice * 2].column = this.tempColumn + 1;
        for (i = 1; i < this.numberOfDice * 2 + 1; i += 1) {
          this[i].destinationX = ((this[i].column / (this.getDiceInRow(this[i].row).length + 1)) + this.pageNumber) * canvasWidth;
          this[i].destinationY = (this[i].row / (this.numberOfRows + 1)) * canvasHeight;
        }
      }
      if (amountOfChange === 0 || amountOfChange === undefined) {
        for (i = 1; i < this.numberOfDice * 2 + 1; i += 1) {
          this[i].destinationX = ((this[i].column / (this.getDiceInRow(this[i].row).length + 1)) + this.pageNumber) * canvasWidth;
          this[i].destinationY = (this[i].row / (this.numberOfRows + 1)) * canvasHeight;
        }
      }
      if (amountOfChange === -1) {
        if (this.getDiceInColumn(this[this.numberOfDice * 2 + 2].column).length === 1) {
          this.numberOfColumns -= 2;
        }
        if (this.getDiceInRow(this[this.numberOfDice * 2 + 2].row).length === 2) {
          this.numberOfRows -= 1;
        }
        this.tempRow = this[this.numberOfDice * 2].row;
        this.tempColumn = this[this.numberOfDice * 2 - 1].column;
        this[this.numberOfDice * 2 + 1].row = 0;
        this[this.numberOfDice * 2 + 1].column = 0;
        this[this.numberOfDice * 2 + 1].destinationX = this[this.numberOfDice * 2 + 1].awayX;
        this[this.numberOfDice * 2 + 1].destinationY = this[this.numberOfDice * 2 + 1].awayY;
        this[this.numberOfDice * 2 + 2].row = 0;
        this[this.numberOfDice * 2 + 2].column = 0;
        this[this.numberOfDice * 2 + 2].destinationX = this[this.numberOfDice * 2 + 2].awayX;
        this[this.numberOfDice * 2 + 2].destinationY = this[this.numberOfDice * 2 + 2].awayY;

        for (i = 1; i < this.numberOfDice * 2 + 1; i += 1) {
          this[i].destinationX = ((this[i].column / (this.getDiceInRow(this[i].row).length + 1)) + this.pageNumber) * canvasWidth;
          this[i].destinationY = (this[i].row / (this.numberOfRows + 1)) * canvasHeight;
        }
      }
    };
    this.intialize = function () {
      this[1].x = (1 / 3 + this.pageNumber) * canvasWidth;
      this[1].y = canvasHeight / 2;
      this[1].destinationX = (1 / 3 + this.pageNumber) * canvasWidth;
      this[1].destinationY = canvasHeight / 2;
      this[1].row = 1;
      this[1].column = 1;
      this[2].x = (2 / 3 + this.pageNumber) * canvasWidth;
      this[2].y = canvasHeight / 2;
      this[2].destinationX = (2 / 3 + this.pageNumber) * canvasWidth;
      this[2].destinationY = canvasHeight / 2;
      this[2].row = 1;
      this[2].column = 2;
    };
  } else {
    this.createSprites = function (width, height, url) {
      var i, tempX, tempY, tempRows = 1, tempColumns = 1, tempNumberOfRows = 1, tempNumberOfColumns = 1;
      for (i = this.createdDice + 1; i < this.maxDice + 1; i += 1) {
        this[i] = new Component(width, height, url, canvasWidth, canvasHeight, "image");
      }
      for (i = 1; i < this.maxDice + 1; i += 1) {
        tempX = tempColumns / tempNumberOfColumns;
        tempY = tempRows / tempNumberOfRows;
        if (tempY >= 1 / 2) {
          this[i].awayY = canvasHeight * 3 / 2;
        } else {
          this[i].awayY = canvasHeight * -1 / 2;
        }
        if (tempX >= 1 / 2) {
          this[i].awayX = canvasWidth * (3 / 2 + this.pageNumber);
        } else {
          this[i].awayX = canvasWidth * (-1 / 2 + this.pageNumber);
          this[i].awayY = canvasHeight * 3 / 2;
        }
        if (i === tempRows * tempColumns) {
          if (tempRows !== this.maxRows && (tempRows < tempColumns || tempColumns === this.maxColumns)) {
            tempNumberOfRows += 1;
            tempRows += 1;
            tempColumns = 1;
          } else if (tempColumns !== this.maxColumns) {
            tempNumberOfColumns += 1;
            tempColumns += 1;
            tempRows = 1;
          }
        } else {
          if (tempColumns < tempNumberOfColumns) {
            tempColumns += 1;
          } else if (tempRows < tempNumberOfRows) {
            tempRows += 1;
          }
        }
      }
      for (i = this.numberOfDice + 1; i < this.maxDice + 1; i += 1) {
        this[i].x = this[i].awayX;
        this[i].y = this[i].awayY;
        this[i].destinationX = this[i].awayX;
        this[i].destinationY = this[i].awayY;
      }
      if (this.createdDice === 0) {
        this.intialize();
      }
      this.createdDice = this.maxDice;
    };
    this.changeDestinations = function (amountOfChange) {
      var i;
      if (amountOfChange === 1) {
        if (this.numberOfDice === this.numberOfRows * this.numberOfColumns + 1) {
          if (this.numberOfRows !== this.maxRows && (this.numberOfRows < this.numberOfColumns || this.numberOfColumns === this.maxColumns)) {
            this.numberOfRows += 1;
            this.tempRow = this.numberOfRows;
            this.tempColumn = 1;
          } else if (this.numberOfColumns !== this.maxColumns) {
            this.numberOfColumns += 1;
            this.tempRow = 1;
            this.tempColumn += 1;
          }
        } else {
          if (this.tempRow < this.numberOfRows) {
            this.tempRow += 1;
          }
          if (this.tempColumn < this.numberOfColumns) {
            this.tempColumn += 1;
          }
        }
        for (i = 1; i < this.numberOfDice + 1; i += 1) {
          this[this.numberOfDice].row = this.tempRow;
          this[this.numberOfDice].column = this.tempColumn;
          this[i].destinationX = ((this[i].column / (this.getDiceInRow(this[i].row).length + 1)) + this.pageNumber) * canvasWidth;
          this[i].destinationY = (this[i].row / (this.numberOfRows + 1)) * canvasHeight;
        }
        for (i = this.numberOfDice + 1; i < this.createdDice + 1; i  += 1) {
          this[i].destinationX = this[i].awayX;
          this[i].destinationY = this[i].awayY;
        }
      }
      if (amountOfChange === 0) {
        for (i = 1; i < this.numberOfDice + 1; i += 1) {
          this[i].destinationX = ((this[i].column / (this.getDiceInRow(this[i].row).length + 1)) + this.pageNumber) * canvasWidth;
          this[i].destinationY = (this[i].row / (this.numberOfRows + 1)) * canvasHeight;
        }
      }
      if (amountOfChange === -1) {
        if (this.getDiceInColumn(this[this.numberOfDice + 1].column).length === 1) {
          this.numberOfColumns -= 1;
        }
        if (this.getDiceInRow(this[this.numberOfDice + 1].row).length === 1) {
          this.numberOfRows -= 1;
        }
        this.tempRow = this[this.numberOfDice].row;
        this.tempColumn = this[this.numberOfDice].column;
        this[this.numberOfDice + 1].row = 0;
        this[this.numberOfDice + 1].column = 0;
        this[this.numberOfDice + 1].destinationX = this[this.numberOfDice + 1].awayX;
        this[this.numberOfDice + 1].destinationY = this[this.numberOfDice + 1].awayY;

        for (i = 1; i < this.numberOfDice + 1; i += 1) {
          this[i].destinationX = ((this[i].column / (this.getDiceInRow(this[i].row).length + 1)) + this.pageNumber) * canvasWidth;
          this[i].destinationY = (this[i].row / (this.numberOfRows + 1)) * canvasHeight;
        }
        for (i = this.numberOfDice + 1; i < this.createdDice + 1; i  += 1) {
          this[i].destinationX = this[i].awayX;
          this[i].destinationY = this[i].awayY;
        }
      }
    };
    this.intialize = function () {
      this[1].x = (1 / 2 + this.pageNumber) * canvasWidth;
      this[1].y = canvasHeight / 2;
      this[1].destinationX = (1 / 2 + this.pageNumber) * canvasWidth;
      this[1].destinationY = canvasHeight / 2;
      this[1].row = 1;
      this[1].column = 1;
    };
  }
  this.moveToIntendedPositions = function () {
    var i, D00Multiplier = 1;
    if (this === diceList.D00) { D00Multiplier = 2; }
    for (i = 1; i < this.createdDice * D00Multiplier + 1; i += 1) {
      this[i].velocityX = (this[i].destinationX - this[i].x) / 10;
      if (Math.abs(this[i].x - this[i].destinationX) < 1) {
        this[i].x = this[i].destinationX;
        this[i].velocityX = 0;
      }
      this[i].velocityY = (this[i].destinationY - this[i].y) / 10;
      if (Math.abs(this[i].y - this[i].destinationY) < 1) {
        this[i].y = this[i].destinationY;
        this[i].velocityY = 0;
      }
    }
  };
  this.reachedDestination = function () {
    var i, D00Multiplier = 1;
    if (this === diceList.D00) { D00Multiplier = 2; } else { D00Multiplier = 1; }
    for (i = 1; i < this.createdDice * D00Multiplier + 1; i += 1) {
      if (this[i].x !== this[i].destinationX || this[i].y !== this[i].destinationY) {
        return false;
      }
    }
    return true;
  };
}
function Sound(src) {
  "use strict";
  this.sound = document.createElement("audio");
  this.sound.src = "./media/" + src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function () {
    this.sound.play();
  };
  this.stop = function () {
    this.sound.pause();
  };
}

// Spites
var diceSlider = {
  icon : undefined,
  start: undefined,
  end  : undefined,
  fill : undefined,
  slots: undefined,
  ball : undefined
};
var numberSlider = {
  icon : undefined,
  start: undefined,
  end  : undefined,
  fill : undefined,
  slots: undefined,
  ball : undefined
};
var muter;

function sliderXPositions() {
  "use strict";
  diceSlider.icon.x = 25 + diceSlider.icon.width / 2 + camera.x - canvasWidth / 2;
  numberSlider.icon.x = -25 - diceSlider.icon.width / 2 + camera.x + canvasWidth / 2;
  
  diceSlider.start.x = diceSlider.icon.x + diceSlider.icon.width / 2 + 10 + diceSlider.start.width / 2;
  diceSlider.end.x = numberSlider.icon.x - numberSlider.icon.width / 2 - 10 - diceSlider.end.width / 2;
  
  numberSlider.start.x = numberSlider.icon.x;
  numberSlider.end.x = numberSlider.start.x;
  
  diceSlider.fill.x = diceSlider.start.x;
  diceSlider.fill.width = diceSlider.end.x - diceSlider.fill.x;
  
  numberSlider.fill.x = numberSlider.start.x - numberSlider.start.width / 2;
  numberSlider.fill.width = numberSlider.end.x + numberSlider.end.width / 2 - numberSlider.fill.x;
}
function sliderYPositions() {
  "use strict";
  diceSlider.icon.y = canvasHeight - 25 - diceSlider.icon.height / 2;
  diceSlider.icon.y = canvasHeight - 25 - diceSlider.icon.height / 2;
  numberSlider.icon.y = canvasHeight - 25 - numberSlider.icon.height / 2;
  
  diceSlider.start.y = diceSlider.icon.y;
  diceSlider.end.y = diceSlider.icon.y;
  
  numberSlider.start.y = 25 + numberSlider.start.height / 2;
  numberSlider.end.y = numberSlider.icon.y - numberSlider.icon.height / 2 - 10 - numberSlider.start.width / 2;
  
  diceSlider.fill.y = diceSlider.start.y - diceSlider.start.width / 2;
  diceSlider.fill.height = diceSlider.end.y + diceSlider.end.width / 2 - diceSlider.fill.y;
  
  numberSlider.fill.y = numberSlider.start.y;
  numberSlider.fill.height = numberSlider.end.y - numberSlider.fill.y;
}

function allSprites() {
  "use strict";
  var i, distanceBetweenDiceBarSlots, distanceBetweenNumberBarSlots;
  diceList.D4 = new DiceType(0);
  diceList.D6 = new DiceType(1);
  diceList.D8 = new DiceType(2);
  diceList.D10 = new DiceType(3);
  diceList.D00 = new DiceType(4);
  diceList.D12 = new DiceType(5);
  diceList.D20 = new DiceType(6);
  
  diceList.D4.createSprites(diceWidth, diceWidth / 2 * Math.sqrt(3), "D4.png");
  diceList.D6.createSprites(diceWidth, diceWidth, "D6.png");
  diceList.D8.createSprites(diceWidth, diceWidth, "D8.png");
  diceList.D10.createSprites(diceWidth, diceWidth, "D10.png");
  diceList.D00.createSprites(diceWidth, diceWidth);
  diceList.D12.createSprites(diceWidth, diceWidth, "D12.png");
  diceList.D20.createSprites(diceWidth, diceWidth / 2 * Math.sqrt(3), "D20.png");
  diceSlider.start = new Component(62, 62, "Slider.png", 425, 625, "image");
  diceSlider.end = new Component(62, 62, "Slider.png", 22, 375, "image");
  diceSlider.fill = new Component(62, 62, "#bfbfbf", 22, 375);
  diceSlider.icon = new Component(62, 62, "Dice Bar Icon.png", 425, 625, "image");
  numberSlider.start = new Component(62, 62, "Slider.png", 425, 625, "image");
  numberSlider.end = new Component(62, 62, "Slider.png", 22, 375, "image");
  numberSlider.fill = new Component(62, 62, "#bfbfbf", 22, 375);
  numberSlider.icon = new Component(62, 62, "Number Sign.png", 425, 625, "image");
  
  sliderXPositions();
  sliderYPositions();
  
  distanceBetweenDiceBarSlots = diceSlider.fill.width / 6;
  distanceBetweenNumberBarSlots = numberSlider.fill.height / (diceList.D4.maxDice - 1);
  
  diceSlider.slots = {};
  for (i = 0; i < 7; i += 1) {
    diceSlider.slots[i] = new Component(12, 12, "Slot.png", 0, 0, "image");
    diceSlider.slots[i].x = i * distanceBetweenDiceBarSlots + diceSlider.start.x;
    diceSlider.slots[i].y = diceSlider.icon.y;
  }
  numberSlider.slots = {};
  for (i = 0; i < diceList.D4.maxDice; i += 1) {
    numberSlider.slots[i] = new Component(12, 12, "Slot.png", 0, 0, "image");
    numberSlider.slots[i].x = numberSlider.icon.x;
    numberSlider.slots[i].y = i * distanceBetweenNumberBarSlots + numberSlider.start.y;
  }
  
  diceSlider.ball = new Component(37, 37, "Ball.png", 22, 375, "image");
  diceSlider.ball.x = diceSlider.start.x;
  diceSlider.ball.y = diceSlider.start.y;
  numberSlider.ball = new Component(37, 37, "Ball.png", 22, 375, "image");
  numberSlider.ball.x = numberSlider.start.x;
  numberSlider.ball.y = numberSlider.start.y;
  
  muter = new Component(115, 130, "Sound.png", 0, 0, "image");
}

// Text
var D4Text1;
var D4Text2;
var D6Text1;
var D8Text1;
var D10Text1;
var D00Text1;
var D12Text1;
var D20Text1;
var D20Text2;

function textXs() {
  "use strict";
  D4Text1.x = canvasWidth * 0.5 - 15;
  D4Text2.x = canvasWidth * 7.5 - 15;
  D6Text1.x = canvasWidth * 1.5 - 15;
  D8Text1.x = canvasWidth * 2.5 - 15;
  D10Text1.x = canvasWidth * 3.5 - 25;
  D00Text1.x = canvasWidth * 4.5 - 82;
  D12Text1.x = canvasWidth * 5.5 - 25;
  D20Text1.x = canvasWidth * 6.5 - 25;
  D20Text2.x = canvasWidth * -0.5 - 25;
}
function createText() {
  "use strict";
  D4Text1 = new Component("30px", "Consolas", "black", canvasWidth * 0.5 - 15, 30, "text");
  D4Text2 = new Component("30px", "Consolas", "black", canvasWidth * 7.5 - 15, 30, "text");
  D6Text1 = new Component("30px", "Consolas", "black", canvasWidth * 1.5 - 15, 30, "text");
  D8Text1 = new Component("30px", "Consolas", "black", canvasWidth * 2.5 - 15, 30, "text");
  D10Text1 = new Component("30px", "Consolas", "black", canvasWidth * 3.5 - 25, 30, "text");
  D00Text1 = new Component("30px", "Consolas", "black", canvasWidth * 4.5 - 82, 30, "text");
  D12Text1 = new Component("30px", "Consolas", "black", canvasWidth * 5.5 - 25, 30, "text");
  D20Text1 = new Component("30px", "Consolas", "black", canvasWidth * 6.5 - 25, 30, "text");
  D20Text2 = new Component("30px", "Consolas", "black", canvasWidth * -0.5 - 25, 30, "text");
  D4Text1.text = "D4";
  D4Text2.text = "D4";
  D6Text1.text = "D6";
  D8Text1.text = "D8";
  D10Text1.text = "D10";
  D00Text1.text = "Percentile";
  D12Text1.text = "D12";
  D20Text1.text = "D20";
  D20Text2.text = "D20";
}

// Other
var previousCursorX;
var previousCursorY;
var cursorVelocityX;
var cursorVelocityY;
var toggle1 = false;
var toggle2 = false;
var toggle3 = false;
var toggle4 = false;
var toggle5 = false;
var timer1 = 0;
var timer2 = 0;
var timer3 = 0;
var timer4 = 0;
var timer5 = 0;
var timer6 = 0;
var warpingD4 = false;
var warpingD20 = false;
var swipeCheck = false;
var diceSlideCheck = false;
var numSlideCheck = false;
var muteAll = -1;

// Misc.
var cursor = {x: 0, y: 0};
var keysPressed = [];
var keysHeld = [];
var keysReleased = [];
var mousePressed = false;
var mousePress = false;
var mouseRelease = false;
var errorSound;

function getDiceGroupAtCurrentPage() {
  "use strict";
  var i, dice;
  for (dice in diceList) {
    if (diceList.hasOwnProperty(dice)) {
      if (diceList[dice].pageNumber === camera.x / canvasWidth - 0.5) {
        return diceList[dice];
      }
    }
  }
}
function mouseIsOver(sprite) {
  "use strict";
  if ((camera.mouseX >= sprite.x - sprite.width / 2 &&
      camera.mouseY >= sprite.y - sprite.height / 2 &&
      camera.mouseX <= sprite.x + sprite.width / 2 &&
      camera.mouseY <= sprite.y + sprite.height / 2) ||
      (camera.mouseX >= sprite.x &&
      camera.mouseY >= sprite.y &&
      camera.mouseX <= sprite.x + sprite.width &&
      camera.mouseY <= sprite.y + sprite.height &&
      sprite.rectangle)) {
    return true;
  } else {
    return false;
  }
}
function mousePressOver(sprite) {
  "use strict";
  if (mouseIsOver(sprite) && mousePress) {
    return true;
  } else {
    return false;
  }
}
function randomNumber(min, max) {
  "use strict";
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function goRight() {
  "use strict";
  toggle1 = true;
  toggle4 = true;
  timer3 = 10;
  swipeCheck = false;
  if (camera.x === canvasWidth * 6.5) {
    warpingD4 = true;
  }
}
function goLeft() {
  "use strict";
  toggle2 = true;
  toggle5 = true;
  timer3 = 10;
  swipeCheck = false;
  if (camera.x === canvasWidth * 0.5) {
    warpingD20 = true;
  }
}
function numUp() {
  "use strict";
  if (getDiceGroupAtCurrentPage() !== undefined) {
    if (getDiceGroupAtCurrentPage().numberOfDice < getDiceGroupAtCurrentPage().maxDice) {
      getDiceGroupAtCurrentPage().numberOfDice += 1;
      getDiceGroupAtCurrentPage().changeDestinations(+1);
    } else if (muteAll === -1) {
      errorSound.play();
    }
  }
  swipeCheck = false;
}
function numDown() {
  "use strict";
  if (getDiceGroupAtCurrentPage() !== undefined) {
    if (getDiceGroupAtCurrentPage().numberOfDice > 1) {
      getDiceGroupAtCurrentPage().numberOfDice -= 1;
      getDiceGroupAtCurrentPage().changeDestinations(-1);
    } else if (muteAll === -1) {
      errorSound.play();
    }
  }
  swipeCheck = false;
}
function roll() {
  "use strict";
  var i, D00Multiplier = 1;
  if (getDiceGroupAtCurrentPage() === diceList.D00) { D00Multiplier = 2; }
  if (getDiceGroupAtCurrentPage() !== undefined) {
    for (i = 1; i < getDiceGroupAtCurrentPage().numberOfDice * D00Multiplier + 1; i += 1) {
      getDiceGroupAtCurrentPage()[i].sourceX = randomNumber(1, getDiceGroupAtCurrentPage().sides) * getDiceGroupAtCurrentPage()[i].width;
    }
    for (i = getDiceGroupAtCurrentPage().numberOfDice * D00Multiplier + 1; i < getDiceGroupAtCurrentPage().maxDice + 1; i += 1) {
      getDiceGroupAtCurrentPage()[i].sourceX = 0;
    }
  }
  swipeCheck = false;
}
function control() {
  "use strict";
  // Press R
  if (keysPressed[39] === 1) {
    goRight();
  }
  // Hold R
  if (timer1 >= 20 && keysHeld[39]) {
    toggle4 = true;
    if (camera.x >= canvasWidth * 6.5) {
      warpingD4 = true;
    }
  }
  // Press L
  if (keysPressed[37] === 1) {
    goLeft();
  }
  // Hold L
  if (timer2 >= 20 && keysHeld[37]) {
    toggle5 = true;
    if (camera.x <= canvasWidth * 0.5) {
      warpingD20 = true;
    }
  }
  // Press Up
  if (keysPressed[38] === 1) {
    numUp();
  }
  // Press Down
  if (keysPressed[40] === 1) {
    numDown();
  }
  // Press Space
  if (keysPressed[32] === 1) {
    toggle3 = true;  // For rolling 
  }
  // Prepare to determine a swipe or tap
  if (mousePressed &&
      mouseIsOver(muter) === false &&
      mouseIsOver(diceSlider.fill) === false && mouseIsOver(diceSlider.start) === false && mouseIsOver(diceSlider.end) === false &&
      mousePressOver(numberSlider.fill) === false && mousePressOver(numberSlider.start) === false && mousePressOver(numberSlider.end) === false) {
    previousCursorX = cursor.x;
    previousCursorY = cursor.y;
    swipeCheck = true;
  }
  // Determine between swipe or tap(s)
  if (swipeCheck) {
    cursorVelocityX = cursor.x - previousCursorX;
    cursorVelocityY = cursor.y - previousCursorY;
    previousCursorX = cursor.x;
    previousCursorY = cursor.y;
    if (cursorVelocityX >= 80) {
      goLeft();
    } else if (cursorVelocityX <= -80) {
      goRight();
    } else if (cursorVelocityY <= -80) {
      numUp();
    } else if (cursorVelocityY >= 80) {
      numDown();
    } else if (mouseRelease) {
      toggle3 = true;
    }
  }
  if (toggle3) {
    roll();
  }
}
function timers() {
  "use strict";
  if (toggle1) { // For pressing right
    timer1 = timer1 + 1;
  }
  if (timer1 > 20) {
    timer1 = 0;
  }
  if (keysReleased[39]) { // Says "NOT HOLDING RIGHT"
    toggle1 = false;
    timer1 = 0;
  }
  
  if (toggle2) { // For pressing left
    timer2 = timer2 + 1;
  }
  if (timer2 > 20) {
    timer2 = 0;
  }
  if (keysReleased[37]) { // Says "NOT HOLDING LEFT"
    toggle2 = false;
    timer2 = 0;
  }

  if (toggle3) { // For Rolling
    timer3 = timer3 + 1;
  }
  if (timer3 > 7) {
    timer3 = 0;
    toggle3 = false;
  }
  
  if (toggle4) { // For moving camera right
    timer4 = timer4 + 1;
  }
  if (timer4 > 20) {
    timer4 = 0;
    toggle4 = false;
  }
    
  if (toggle5) { // For moving camera left
    timer5 = timer5 + 1;
  }
  if (timer5 > 20) {
    timer5 = 0;
    toggle5 = false;
  }
  
  timer6 = timer6 + 1; // For Dice Bar Icon
}
function mute() {
  "use strict";
  if (mouseIsOver(muter) && mousePressed) {
    muteAll = muteAll * -1;
  }
  muter.sourceX = (muteAll * -58) + 58;
  muter.x = camera.x - canvasWidth / 2 + 15 + muter.width / 2;
  muter.y = 15 + muter.height / 2;
}
function sliders() {
  "use strict";
  var distanceBetweenNumberBarSlots, distanceBetweenDiceBarSlots, i;
  sliderXPositions();
  distanceBetweenDiceBarSlots = diceSlider.fill.width / 6;
  if (getDiceGroupAtCurrentPage() !== undefined) {
    distanceBetweenNumberBarSlots = numberSlider.fill.height / (getDiceGroupAtCurrentPage().maxDice - 1);
  }
  for (i = 0; i < 7; i += 1) {
    diceSlider.slots[i].x = i * distanceBetweenDiceBarSlots + diceSlider.start.x;
  }
  for (i = 0; i < diceList.D4.maxDice; i += 1) {
    numberSlider.slots[i].x = numberSlider.icon.x;
  }
  if (getDiceGroupAtCurrentPage() !== undefined) {
    for (i = 0; i < getDiceGroupAtCurrentPage().maxDice; i += 1) {
      numberSlider.slots[i].y = i * distanceBetweenNumberBarSlots + numberSlider.start.y;
    }
    while (i < diceList.D4.createdDice) {
      numberSlider.slots[i].y = canvasHeight * 2;
      i += 1;
    }
  }
  
  if (timer6 === 30) {
    diceSlider.icon.sourceX = diceSlider.icon.sourceX + 62;
    timer6 = 0;
    if (diceSlider.icon.sourceX >= 310) {
      diceSlider.icon.sourceX = 0;
    }
  }
  if ((mousePressOver(diceSlider.fill) || mousePressOver(diceSlider.start) || mousePressOver(diceSlider.end)) && swipeCheck === false &&
      numSlideCheck === false &&
      swipeCheck === false) {
    diceSlideCheck = true;
    toggle4 = false;
    timer4 = 0;
    toggle5 = false;
    timer5 = 0;
  }
  if (diceSlideCheck) {
    diceSlider.ball.x = camera.mouseX;
  } else {
    diceSlider.ball.x = (camera.x / canvasWidth - 0.5) * distanceBetweenDiceBarSlots + diceSlider.start.x;
  }
  if (diceSlider.ball.x < diceSlider.start.x) {
    diceSlider.ball.x = diceSlider.start.x;
  } else if (diceSlider.ball.x > diceSlider.end.x) {
    diceSlider.ball.x = diceSlider.end.x;
  }
  numberSlider.ball.x = numberSlider.start.x;
  if ((mousePressOver(numberSlider.fill) || mousePressOver(numberSlider.start) || mousePressOver(numberSlider.end)) && swipeCheck === false &&
      diceSlideCheck === false &&
      swipeCheck === false) {
    numSlideCheck = true;
  }
  if (numSlideCheck && getDiceGroupAtCurrentPage() !== undefined) {
    numberSlider.ball.y = camera.mouseY;
    if (numberSlider.ball.y < numberSlider.start.y) {
      numberSlider.ball.y = numberSlider.start.y;
    } else if (numberSlider.ball.y > numberSlider.end.y) {
      numberSlider.ball.y = numberSlider.end.y;
    }
    if (getDiceGroupAtCurrentPage() !== undefined) {
      while (getDiceGroupAtCurrentPage().numberOfDice < (Math.round((numberSlider.ball.y - numberSlider.end.y) / distanceBetweenNumberBarSlots) * -1) + 1) {
        numUp();
      }
      while (getDiceGroupAtCurrentPage().numberOfDice > (Math.round((numberSlider.ball.y - numberSlider.end.y) / distanceBetweenNumberBarSlots) * -1) + 1) {
        numDown();
      }
    }
  } else if (getDiceGroupAtCurrentPage() !== undefined) {
    numberSlider.ball.y = (getDiceGroupAtCurrentPage().numberOfDice - 1) * distanceBetweenNumberBarSlots * -1 + numberSlider.end.y;
  }
  if (getDiceGroupAtCurrentPage() === undefined || mouseRelease) {
    numSlideCheck = false;
  }
}
function spriteAnimation() {
  "use strict";
  var i, dice;
  if (warpingD4 === false && diceList.D4.reachedDestination() === false) {
    diceList.D4.moveToIntendedPositions();
  }
  for (dice in diceList) {
    if (diceList[dice] !== diceList.D4 && diceList[dice] !== diceList.D20) {
      if (diceList[dice].reachedDestination() === false) {
        diceList[dice].moveToIntendedPositions();
      }
    }
  }
  if (warpingD20 === false && diceList.D20.reachedDestination() === false) {
    diceList.D20.moveToIntendedPositions();
  }
  if (warpingD4) {
    for (i = 1; i < diceList.D4.maxDice + 1; i += 1) {
      diceList.D4[i].x = diceList.D4[i].destinationX + canvasWidth * 7;
    }
    if ((toggle4 === false && camera.x === canvasWidth * 0.5) || (toggle5 && camera.x === canvasWidth * 6.5)) {
      warpingD4 = false;
      for (i = 1; i < diceList.D4.maxDice + 1; i += 1) {
        diceList.D4[i].x = diceList.D4[i].destinationX;
      }
    }
  }
  if (warpingD20) {
    for (i = 1; i < diceList.D20.maxDice + 1; i += 1) {
      diceList.D20[i].x = diceList.D20[i].destinationX - canvasWidth * 7;
    }
    if ((toggle5 === false && camera.x === canvasWidth * 6.5) || (toggle4 && camera.x === canvasWidth * 0.5)) {
      warpingD20 = false;
      for (i = 1; i < diceList.D20.maxDice + 1; i += 1) {
        diceList.D20[i].x = diceList.D20[i].destinationX;
      }
    }
  }
}
function cameraPos() {
  "use strict";
  var distanceBetweenDiceBarSlots = diceSlider.fill.width / 6;
  if (toggle4) { // Move right
    camera.x = camera.x + canvasWidth / 20;
  }
  if (toggle5) { // Move left
    camera.x = camera.x - canvasWidth / 20;
  }
  if (camera.x <= canvasWidth / -2) {
    camera.x = canvasWidth * 6.5;
  }
  if (camera.x >= canvasWidth * 7.5) {
    camera.x = canvasWidth / 2;
  }
  if (diceSlideCheck) {
    camera.x = ((diceSlider.ball.x - diceSlider.start.x) / distanceBetweenDiceBarSlots + 0.5) * canvasWidth;
    if (camera.x < canvasWidth / 2) {
      camera.x = canvasWidth / 2;
    } else if (camera.x > canvasWidth * 6.5) {
      camera.x = canvasWidth * 6.5;
    }
  }
  if (mouseRelease && diceSlideCheck) {
    camera.x = (Math.round((diceSlider.ball.x - diceSlider.start.x) / distanceBetweenDiceBarSlots) + 0.5) * canvasWidth;
    diceSlideCheck = false;
  }
  if (toggle4 === false && toggle5 === false && diceSlideCheck === false) {
    camera.x = (Math.round(camera.x / canvasWidth - 0.5) + 0.5) * canvasWidth;
  }
  camera.mouseX = cursor.x + camera.x - startCam.x;
  camera.mouseY = cursor.y + camera.y - startCam.y;
}

function canvasSize() {
  "use strict";
  myGameArea.canvas.width = 10;
  myGameArea.canvas.height = 10;
  myGameArea.canvas.width = window.innerWidth * window.devicePixelRatio - 5;
  myGameArea.canvas.height = window.innerHeight * window.devicePixelRatio - 5;
  canvasWidth = myGameArea.canvas.width;
  canvasHeight = myGameArea.canvas.height;
}
function listenForControls() {
  "use strict";
  myGameArea.canvas.addEventListener('mousemove', function (e) {
    cursor.x = (e.pageX - myGameArea.canvas.offsetLeft) * window.devicePixelRatio;
    cursor.y = (e.pageY - myGameArea.canvas.offsetTop) * window.devicePixelRatio;
  });
  myGameArea.canvas.addEventListener('mousedown', function (e) {
    mousePress = true;
    mousePressed = true;
  });
  myGameArea.canvas.addEventListener('mouseup', function (e) {
    mousePress = false;
    mouseRelease = true;
  });
  myGameArea.canvas.addEventListener('mouseleave', function (e) {
    mousePress = false;
    mouseRelease = true;
  });
  myGameArea.canvas.addEventListener('touchstart', function (e) {
    cursor.x = (e.touches[0].clientX - myGameArea.canvas.offsetLeft) * window.devicePixelRatio;
    cursor.y = (e.touches[0].clientY - myGameArea.canvas.offsetTop) * window.devicePixelRatio;
    mousePress = true;
    mousePressed = true;
    e.preventDefault();
  });
  myGameArea.canvas.addEventListener('touchmove', function (e) {
    cursor.x = (e.touches[0].clientX - myGameArea.canvas.offsetLeft) * window.devicePixelRatio;
    cursor.y = (e.touches[0].clientY - myGameArea.canvas.offsetTop) * window.devicePixelRatio;
    e.preventDefault();
  });
  myGameArea.canvas.addEventListener('touchend', function (e) {
    mousePress = false;
    mouseRelease = true;
    e.preventDefault();
  });
  myGameArea.canvas.addEventListener('touchcancel', function (e) {
    mousePressed = false;
    mousePress = false;
    mouseRelease = true;
  });
  window.addEventListener('keydown', function (e) {
    keysHeld[e.keyCode] = true;
    if (keysPressed[e.keyCode] !== 2) {
      keysPressed[e.keyCode] = 1;
    }
  });
  window.addEventListener('keyup', function (e) {
    keysHeld[e.keyCode] = false;
    keysPressed[e.keyCode] = 0;
    keysReleased[e.keyCode] = true;
  });
}
function updateText() {
  "use strict";
  var i;
  for (i = 0; i < textList.length; i += 1) {
    textList[i].vroom();
  }
  for (i = 0; i < textList.length; i += 1) {
    textList[i].update();
  }
}
function drawSprites() {
  "use strict";
  var i;
  for (i = 0; i < spriteList.length; i += 1) {
    spriteList[i].vroom();
    spriteList[i].update();
  }
}
function resetPressedKeys() {
  "use strict";
  var i;
  for (i = 0; i < keysPressed.length; i += 1) {
    if (keysPressed[i] === 1) {
      keysPressed[i] = 2;
    }
  }
}
function resetReleasedKeys() {
  "use strict";
  var i;
  for (i = 0; i < keysReleased.length; i += 1) {
    if (keysReleased[i] === true) {
      keysReleased[i] = false;
    }
  }
}
function resetMouseClick() {
  "use strict";
  mousePressed = false;
  mouseRelease = false;
}

function updateGameArea() {
  "use strict";
  myGameArea.clear();
  cameraPos();
  control();
  timers();
  mute();
  sliders();
  spriteAnimation();
  
  updateText();
  drawSprites();
  resetPressedKeys();
  resetReleasedKeys();
  resetMouseClick();
}                                       // Draw Function
var myGameArea = {
  canvas : document.createElement("canvas"),
  start : function () {
    "use strict";
    canvasSize();
    camera.x = canvasWidth / 2;
    camera.y = canvasHeight / 2;
    startCam.x = canvasWidth / 2;
    startCam.y = canvasHeight / 2;
    allSprites();
    createText();
    errorSound = new Sound("errorSound.mp3");
    document.getElementById("theBody").style.zoom = 1 / window.devicePixelRatio;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.interval = setInterval(updateGameArea, 100 / 6);
    listenForControls();
  },
  clear : function () {
    "use strict";
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
};

function startGame() {
  "use strict";
  myGameArea.start();
}
