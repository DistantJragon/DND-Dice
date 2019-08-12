var spriteList = [];
var textList = [];
var canvasWidth;
var canvasHeight;
var previousWidth;
var previousHeight;
var camera = {x: 0, y: 0, mouseX: 0, mouseY: 0};
var startCam = {x: 0, y: 0};

function Component(width, height, color, x, y, type) {
  "use strict";
  this.type = type;
  if (type === "image") {
    this.image = new Image();
    this.image.src = "./media/" + color;
    spriteList.push(this);
  } else if (type === "text") {
    textList.push(this);
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
      ctx.fillRect(this.x  - camera.x + startCam.x, this.y - camera.y + startCam.y, this.width, this.height);
    }
  };
  this.vroom = function () {
    this.x += this.velocityX;
    this.y += this.velocityY;
  };
}
function DiceType(diceLimit, pageNumber, iDNumber) {
  "use strict";
  var i;
  this.numberOfDice = 0;
  this.diceLimit = diceLimit;
  this.pageNumber = pageNumber;
  if (iDNumber !== 5) {
    for (i = 0; i < this.diceLimit; i += 1) {
      this[i] = undefined;
    }
    this.moveToIntendedPositions = function () {
      var i;
      for (i = 0; i < this.diceLimit; i += 1) {
        this[i].velocityX = (this[i].destinationX - this[i].x) / 10;
        if (Math.abs(this[i].x - this[i].destinationX) < 1) {
          this[i].x = this[i].destinationX;
        }
        this[i].velocityY = (this[i].destinationY - this[i].y) / 10;
        if (Math.abs(this[i].y - this[i].destinationY) < 1) {
          this[i].y = this[i].destinationY;
        }
      }
    };
    this.createSprites = function (width, height, url) {
      var i,
        xList = [0.5, 1.5, -0.5, 1.5, 1.5, 1.5, 0.5, 1.5, -0.5],
        yList = [0.5, -0.5, 1.5, 1.5, -0.5, 1.5, 1.5, 1.5, 1.5];
      for (i = 0; i < this.diceLimit; i += 1) {
        this[i] = new Component(width, height, url, canvasWidth * (xList[i] + this.pageNumber), canvasHeight * yList[i], "image");
      }
    };
    this.changeDestinations = function () {
      var xList = {},
        yList = {},
        i;
      xList[0] = [ 1/2,  1/3,  1/3,  1/3,  1/4,  1/4, 1/4, 1/4, 1/4]
      yList[0] = [ 1/2,  1/2,  1/3,  1/3,  1/3,  1/3, 1/4, 1/4, 1/4]
      xList[1] = [ 3/2,  2/3,  2/3,  2/3,  1/2,  1/2, 1/2, 1/2, 1/2]
      yList[1] = [-1/2,  1/2,  1/3,  1/3,  1/3,  1/3, 1/4, 1/4, 1/4]
      xList[2] = [-1/2, -1/2,  1/2,  1/3,  1/3,  1/4, 1/4, 1/4, 1/4]
      yList[2] = [ 3/2,  3/2,  2/3,  2/3,  2/3,  2/3, 1/2, 1/2, 1/2]
      xList[3] = [ 3/2,  3/2,  3/2,  2/3,  2/3,  1/2, 1/2, 1/2, 1/2]
      yList[3] = [ 3/2,  3/2,  3/2,  2/3,  2/3,  2/3, 1/2, 1/2, 1/2]
      xList[4] = [ 3/2,  3/2,  3/2,  3/2,  3/4,  3/4, 3/4, 3/4, 3/4]
      yList[4] = [-1/2, -1/2, -1/2, -1/2,  1/3,  1/3, 1/4, 1/4, 1/4]
      xList[5] = [ 3/2,  3/2,  3/2,  3/2,  3/2,  3/4, 3/4, 3/4, 3/4]
      yList[5] = [ 3/2,  3/2,  3/2,  3/2,  3/2,  2/3, 1/2, 1/2, 1/2]
      xList[6] = [-1/2, -1/2, -1/2, -1/2, -1/2, -1/2, 1/2, 1/3, 1/4]
      yList[6] = [ 3/2,  3/2,  3/2,  3/2,  3/2,  3/2, 3/4, 3/4, 3/4]
      xList[7] = [ 3/2,  3/2,  3/2,  3/2,  3/2,  3/2, 3/2, 2/3, 1/2]
      yList[7] = [ 3/2,  3/2,  3/2,  3/2,  3/2,  3/2, 3/2, 3/4, 3/4]
      xList[8] = [ 3/2,  3/2,  3/2,  3/2,  3/2,  3/2, 3/2, 3/2, 3/4]
      yList[8] = [ 3/2,  3/2,  3/2,  3/2,  3/2,  3/2, 3/2, 3/2, 3/4]
      for (i = 0; i < this.diceLimit; i += 1) {
        this[i].destinationX = canvasWidth * (xList[i][this.numberOfDice] + this.pageNumber);
        this[i].destinationY = canvasHeight * yList[i][this.numberOfDice];
      }
    };
    this.reachedDestination = function () {
      var i;
      for (i = 0; i < diceLimit; i += 1) {
        if (this[i].x !== this[i].destinationX || this[i].y !== this[i].destinationY) {
          return false;
        }
      }
    };
  } else {
    for (i = 0; i < this.diceLimit * 2; i += 1) {
      this[i] = undefined;
    }
    this.moveToIntendedPositions = function () {
      for (i = 0; i < this.diceLimit * 2; i += 1) {
        this[i].velocityX = (this[i].destinationX - this[i].x) / 10;
        if (Math.abs(this[i].x - this[i].destinationX) < 1) {
          this[i].x = this[i].destinationX;
        }
        this[i].velocityY = (this[i].destinationY - this[i].y) / 10;
        if (Math.abs(this[i].y - this[i].destinationY) < 1) {
          this[i].y = this[i].destinationY;
        }
      }
    };
    this.createSprites = function (width, height) {

      var xList = [1/3, 2/3, -0.5, 1.5, -0.5, 1.5],
        yList = [0.5, 0.5, 1.5, 1.5, 1.5, 1.5],
        i;
      for (i = 0; i < diceLimit; i += 1) {
        this[i * 2] = new Component(width, height, "D00.png", canvasWidth * (xList[i * 2] + this.pageNumber), canvasHeight * yList[i * 2], "image");
        this[i * 2 + 1] = new Component(width, height, "D10.png", canvasWidth * (xList[i * 2 + 1] + this.pageNumber), canvasHeight * yList[i * 2 + 1], "image");
      }
    };
    this.changeDestinations = function () {
      var xList = {},
        yList = {},
        i;
      // UNTITLED 3 ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
      for (i = 0; i < this.diceLimit * 2; i += 1) {
        this[i].destinationX = canvasWidth * (xList[i][this.numberOfDice] + this.pageNumber);
        this[i].destinationY = canvasHeight * yList[i][this.numberOfDice];
      }
    };
    this.reachedDestination = function () {
      var i;
      for (i = 0; i < diceLimit * 2; i += 1) {
        if (this[i].x !== this[i].destinationX || this[i].y !== this[i].destinationY) {
          return false;
        }
      }
    };
  }
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
var D4 = new DiceType(9, 0, 1);
var D6 = new DiceType(9, 1, 2);
var D8 = new DiceType(9, 2, 3);
var D10 = new DiceType(9, 3, 4);
var D00 = new DiceType(3, 4, 5);
var D12 = new DiceType(9, 5, 6);
var D20 = new DiceType(9, 6, 7);
var diceBar, diceBall, diceBarIcon;
var numBar, numBall, numBarIcon;
var muter;

function allSprites() {
  "use strict";
  D4.createSprites(250, 218, "D4.png", 0);
  D6.createSprites(250, 250, "D6.png", 1);
  D8.createSprites(250, 250, "D8.png", 2);
  D10.createSprites(250, 250, "D10.png", 3);
  D00.createSprites(250, 250, 4);
  D12.createSprites(250, 250, "D12.png", 5);
  D20.createSprites(250, 218, "D20.png", 6);
  
  diceBar = new Component(800, 62, "Dice Bar.png", 425, 625, "image");
  diceBall = new Component(37, 37, "Ball.png", 22, 375, "image");
  diceBarIcon = new Component(62, 62, "Dice Bar Icon.png", 425, 625, "image");
  numBar = new Component(62, 800, "Number Bar.png", 425, 500, "image");
  numBall = new Component(37, 37, "Ball.png", 22, 375, "image");
  numBarIcon = new Component(62, 62, "Number Sign.png", 425, 500, "image");
  muter = new Component(116, 130, "Sound.png", 370, 370, "image");
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
var timer3 = 10;
var timer4 = 0;
var timer5 = 0;
var timer6 = 0;
var warpingD4 = false;
var warpingD20 = false;
var swipeCheck = false;
var diceSlideCheck = false;
var numSlideCheck = false;
var muteAll = -1;
var PAS = false; //  Prevent Accidental Slide

// Misc.
var cursor = {x: 0, y: 0};
var keysPressed = [];
var keysHeld = [];
var keysReleased = [];
var mousePressed = false;
var mousePress = false;
var mouseRelease = false;
var errorSound;

function mousePressOver(sprite) {
  "use strict";
  if ((camera.mouseX >= sprite.x - sprite.width / 2) &&
      (camera.mouseY >= sprite.y - sprite.height / 2) &&
      (camera.mouseX <= sprite.x + sprite.width / 2) &&
      (camera.mouseY <= sprite.y + sprite.height / 2) &&
       mousePress) {
    return true;
  } else {
    return false;
  }
}
function mouseIsOver(sprite) {
  "use strict";
  if ((camera.mouseX >= sprite.x - sprite.width / 2) &&
      (camera.mouseY >= sprite.y - sprite.height / 2) &&
      (camera.mouseX <= (sprite.x + sprite.width / 2)) &&
      (camera.mouseY <= (sprite.y + sprite.height / 2))) {
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
  if (camera.x === canvasWidth * 0.5 && D4.numberOfDice < 8) { D4.numberOfDice = D4.numberOfDice + 1; D4.changeDestinations();
    } else if (camera.x === canvasWidth * 1.5 && D6.numberOfDice < 8) { D6.numberOfDice = D6.numberOfDice + 1; D6.changeDestinations();
    } else if (camera.x === canvasWidth * 2.5 && D8.numberOfDice < 8) { D8.numberOfDice = D8.numberOfDice + 1; D8.changeDestinations();
    } else if (camera.x === canvasWidth * 3.5 && D10.numberOfDice < 8) { D10.numberOfDice = D10.numberOfDice + 1; D10.changeDestinations();
    } else if (camera.x === canvasWidth * 4.5 && D00.numberOfDice < 2) { D00.numberOfDice = D00.numberOfDice + 1; D00.changeDestinations();
    } else if (camera.x === canvasWidth * 5.5 && D12.numberOfDice < 8) { D12.numberOfDice = D12.numberOfDice + 1; D12.changeDestinations();
    } else if (camera.x === canvasWidth * 6.5 && D20.numberOfDice < 8) { D20.numberOfDice = D20.numberOfDice + 1; D20.changeDestinations();
    } else if (muteAll === -1) { errorSound.play(); }
  swipeCheck = false;
}
function numDown() {
  "use strict";
  if (camera.x === canvasWidth * 0.5 && D4.numberOfDice > 0) { D4.numberOfDice = D4.numberOfDice - 1; D4.changeDestinations();
    } else if (camera.x === canvasWidth * 1.5 && D6.numberOfDice > 0) { D6.numberOfDice = D6.numberOfDice - 1; D6.changeDestinations();
    } else if (camera.x === canvasWidth * 2.5 && D8.numberOfDice > 0) { D8.numberOfDice = D8.numberOfDice - 1; D8.changeDestinations();
    } else if (camera.x === canvasWidth * 3.5 && D10.numberOfDice > 0) { D10.numberOfDice = D10.numberOfDice - 1; D10.changeDestinations();
    } else if (camera.x === canvasWidth * 4.5 && D00.numberOfDice > 0) { D00.numberOfDice = D00.numberOfDice - 1; D00.changeDestinations();
    } else if (camera.x === canvasWidth * 5.5 && D12.numberOfDice > 0) { D12.numberOfDice = D12.numberOfDice - 1; D12.changeDestinations();
    } else if (camera.x === canvasWidth * 6.5 && D20.numberOfDice > 0) { D20.numberOfDice = D20.numberOfDice - 1; D20.changeDestinations();
    } else if (muteAll === -1) { errorSound.play(); }
  swipeCheck = false;
}
function roll() {
  "use strict";
  var i;
  // Rolls dice when camera is on them
  if (camera.x === canvasWidth * 0.5) {
    for (i = 0; i < D4.numberOfDice + 1; i += 1) {
      D4[i].sourceX = randomNumber(1, 4) * D4[i].width;
    }
  } else if (camera.x === canvasWidth * 1.5) {
    for (i = 0; i < D6.numberOfDice + 1; i += 1) {
      D6[i].sourceX = randomNumber(1, 6) * D6[i].width;
    }
  } else if (camera.x === canvasWidth * 2.5) {
    for (i = 0; i < D8.numberOfDice + 1; i += 1) {
      D8[i].sourceX = randomNumber(1, 8) * D8[i].width;
    }
  } else if (camera.x === canvasWidth * 3.5) {
    for (i = 0; i < D10.numberOfDice + 1; i += 1) {
      D10[i].sourceX = randomNumber(1, 10) * D10[i].width;
    }
  } else if (camera.x === canvasWidth * 4.5) {
    for (i = 0; i < (D00.numberOfDice + 1) * 2; i += 1) {
      D00[i].sourceX = randomNumber(1, 10) * D00[i].width;
    }
  } else if (camera.x === canvasWidth * 5.5) {
    for (i = 0; i < D12.numberOfDice + 1; i += 1) {
      D12[i].sourceX = randomNumber(1, 12) * D12[i].width;
    }
  } else if (camera.x === canvasWidth * 6.5) {
    for (i = 0; i < D20.numberOfDice + 1; i += 1) {
      D20[i].sourceX = randomNumber(1, 20) * D20[i].width;
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
  if (timer1 >= 20 && keysHeld[39] && mousePressOver(diceBar) === false) {
    timer3 = 20; // Stop rolling
    toggle4 = true;
    if (camera.x === 2600) {
      warpingD4 = true;
    }
  }
  // Press L
  if (keysPressed[37] === 1) {
    goLeft();
  }
  // Hold L
  if (timer2 >= 20 && keysHeld[37] && mousePressOver(diceBar) === false) {
    timer3 = 20;  // Stop rolling
    toggle5 = true;
    if (camera.x === 200) {
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
  if (mousePressed && mouseIsOver(muter) === false && mouseIsOver(diceBar) === false && mouseIsOver(numBar) === false) {
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
    PAS = true;
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
    PAS = true;
  }
  muter.sourceX = (muteAll * -58) + 58;
  muter.x = camera.x - canvasWidth / 2 + 75;
  muter.y = 75;
}
function sliders() {
  "use strict";
  var currentNumberOfDice;
  if (camera.x === canvasWidth * 0.5) {
    currentNumberOfDice = D4.numberOfDice;
  } else if (camera.x === canvasWidth * 1.5) {
    currentNumberOfDice = D6.numberOfDice;
  } else if (camera.x === canvasWidth * 2.5) {
    currentNumberOfDice = D8.numberOfDice;
  } else if (camera.x === canvasWidth * 3.5) {
    currentNumberOfDice = D10.numberOfDice;
  } else if (camera.x === canvasWidth * 4.5) {
    currentNumberOfDice = D00.numberOfDice;
  } else if (camera.x === canvasWidth * 5.5) {
    currentNumberOfDice = D12.numberOfDice;
  } else if (camera.x === canvasWidth * 6.5) {
    currentNumberOfDice = D20.numberOfDice;
  }
  diceBar.x = camera.x + 36;
  diceBar.y = canvasHeight - 63;
  diceBarIcon.x = diceBar.x - 441;
  diceBarIcon.y = diceBar.y;
  numBar.x = camera.x + canvasWidth / 2 - 63;
  numBar.y = canvasHeight / 2 - 36;
  numBarIcon.x = numBar.x;
  numBarIcon.y = numBar.y + 441;
  if (timer6 === 30) {
    diceBarIcon.sourceX = diceBarIcon.sourceX + 62.25;
    timer6 = 0;
    if (diceBarIcon.sourceX >= 310) {
      diceBarIcon.sourceX = 0;
    }
  }
  if (mouseRelease) {
    PAS = false;
    numSlideCheck = false;
  }
  if (mousePressOver(diceBar) === false) {
    diceBall.x = diceBar.x + (camera.x / canvasWidth + 0.5) * 123 - 492;
    diceBall.y = diceBar.y;
  } else if (PAS === false) {
    diceSlideCheck = true;
    toggle4 = false;
    toggle5 = false;
    PAS = true;
  }
  if (mousePressOver(numBar) === false) {
    numBall.x = numBar.x;
    if (currentNumberOfDice !== undefined) {
      numBall.y = numBar.y - currentNumberOfDice * 92 + 368;
    }
  } else if (PAS === false) {
    numSlideCheck = true;
    PAS = true;
  }
  if (diceSlideCheck) {
    diceBall.x = camera.mouseX;
    if (camera.mouseX < diceBar.x - 369) {
      diceBall.x = diceBar.x - 369;
    }
    if (camera.mouseX > diceBar.x + 369) {
      diceBall.x = diceBar.x + 369;
    }
  }
  if (camera.x < canvasWidth / 2) {
    diceBall.x = diceBar.x - 369;
  }
  if (camera.x > canvasWidth * 6.5) {
    diceBall.x = diceBar.x + 369;
  }
  if (numSlideCheck) {
    numBall.y = camera.mouseY;
    if (camera.x === canvasWidth * 4.5 && numBall.y < numBar.y + 184) {
      numBall.y = numBar.y + 184;
    }
    if (camera.mouseY < numBar.y - 369) {
      numBall.y = numBar.y - 369;
    }
    if (camera.mouseY > numBar.y + 369) {
      numBall.y = numBar.y + 369;
    }
    currentNumberOfDice = Math.round((numBall.y - 368 - numBar.y) / -92);
  }
  if (camera.x === canvasWidth * 0.5) {
    D4.numberOfDice = currentNumberOfDice;
  } else if (camera.x === canvasWidth * 1.5) {
    D6.numberOfDice = currentNumberOfDice;
  } else if (camera.x === canvasWidth * 2.5) {
    D8.numberOfDice = currentNumberOfDice;
  } else if (camera.x === canvasWidth * 3.5) {
    D10.numberOfDice = currentNumberOfDice;
  } else if (camera.x === canvasWidth * 4.5) {
    D00.numberOfDice = currentNumberOfDice;
    if (D00.numberOfDice > 2) {
      D00.numberOfDice = 2;
    }
  } else if (camera.x === canvasWidth * 5.5) {
    D12.numberOfDice = currentNumberOfDice;
  } else if (camera.x === canvasWidth * 6.5) {
    D20.numberOfDice = currentNumberOfDice;
  }
  if (numSlideCheck) {
    if (camera.x === canvasWidth * 0.5) {
      D4.changeDestinations();
    } else if (camera.x === canvasWidth * 1.5) {
      D6.changeDestinations();
    } else if (camera.x === canvasWidth * 2.5) {
      D8.changeDestinations();
    } else if (camera.x === canvasWidth * 3.5) {
      D10.changeDestinations();
    } else if (camera.x === canvasWidth * 4.5) {
      D00.changeDestinations();
    } else if (camera.x === canvasWidth * 5.5) {
      D12.changeDestinations();
    } else if (camera.x === canvasWidth * 6.5) {
      D20.changeDestinations();
    }
  }
}
function spriteAnimation() {
  "use strict";
  var i;
  if (warpingD4 === false && D4.reachedDestination() === false) {
    D4.moveToIntendedPositions();
  }
  if (D6.reachedDestination() === false) {
    D6.moveToIntendedPositions();
  }
  if (D8.reachedDestination() === false) {
    D8.moveToIntendedPositions();
  }
  if (D10.reachedDestination() === false) {
    D10.moveToIntendedPositions();
  }
  if (D00.reachedDestination() === false) {
    D00.moveToIntendedPositions();
  }
  if (D12.reachedDestination() === false) {
    D12.moveToIntendedPositions();
  }
  if (warpingD20 === false && D20.reachedDestination() === false) {
    D20.moveToIntendedPositions();
  }
  if (warpingD4) {
    for (i = 0; i < D4.diceLimit; i += 1) {
      D4[i].x = D4[i].destinationX + canvasWidth * 7;
    }
    if ((toggle4 === false && camera.x === canvasWidth * 0.5) || (toggle5 && camera.x === canvasWidth * 6.5)) {
      warpingD4 = false;
      for (i = 0; i < D4.diceLimit; i += 1) {
        D4[i].x = D4[i].destinationX;
      }
    }
  }
  if (warpingD20) {
    for (i = 0; i < D4.diceLimit; i += 1) {
      D20[i].x = D20[i].destinationX - canvasWidth * 7;
    }
    if ((toggle5 === false && camera.x === canvasWidth * 6.5) || (toggle4 && camera.x === canvasWidth * 0.5)) {
      warpingD20 = false;
      for (i = 0; i < D4.diceLimit; i += 1) {
        D20[i].x = D20[i].destinationX;
      }
    }
  }
}
function cameraPos() {
  "use strict";
  if (toggle4) { // Move right
    camera.x = camera.x + canvasWidth / 20;
  }
  if (toggle5) { // Move left
    camera.x = camera.x - canvasWidth / 20;
  }
  if (camera.x === canvasWidth / -2) {
    camera.x = canvasWidth * 6.5;
  }
  if (camera.x === canvasWidth * 7.5) {
    camera.x = canvasWidth / 2;
  }
  if (diceSlideCheck) {
    camera.x = ((diceBall.x + 492 - diceBar.x) / 123 - 0.5) * canvasWidth;
    if (camera.mouseX < diceBar.x - 369) {
      camera.x = canvasWidth / 2;
    }
    if (camera.mouseX > diceBar.x + 369) {
      camera.x = canvasWidth * 6.5;
    }
  }
  if (toggle4 === false && toggle5 === false && mousePress === false) { // Round camera.x from camera slider
    camera.x = canvasWidth * Math.round(camera.x / canvasWidth + 0.5) - canvasWidth / 2;
    diceSlideCheck = false;
  }
  camera.mouseX = cursor.x + camera.x - startCam.x;
  camera.mouseY = cursor.y + camera.y - startCam.y;
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
function updateCanvasSize() {
  "use strict";
  if (previousWidth !== window.innerWidth * window.devicePixelRatio - 5 ||
      previousHeight !== window.innerHeight * window.devicePixelRatio - 5) {
    myGameArea.canvas.width = 1000;
    myGameArea.canvas.height = 1000;
    myGameArea.canvas.width = window.innerWidth * window.devicePixelRatio - 5;
    myGameArea.canvas.height = window.innerHeight * window.devicePixelRatio - 5;
    canvasWidth = myGameArea.canvas.width;
    canvasHeight = myGameArea.canvas.height;
    camera.x = (camera.x / previousWidth) * canvasWidth;
    camera.y = canvasHeight / 2;
    startCam.x = canvasWidth / 2;
    startCam.y = canvasHeight / 2;
    D4.changeDestinations();
    D6.changeDestinations();
    D8.changeDestinations();
    D10.changeDestinations();
    D00.changeDestinations();
    D12.changeDestinations();
    D20.changeDestinations();
    D4Text1.x = canvasWidth * 0.5 - 15;
    D4Text2.x = canvasWidth * 7.5 - 15;
    D6Text1.x = canvasWidth * 1.5 - 15;
    D8Text1.x = canvasWidth * 2.5 - 15;
    D10Text1.x = canvasWidth * 3.5 - 30;
    D00Text1.x = canvasWidth * 4.5 - 82;
    D12Text1.x = canvasWidth * 5.5 - 30;
    D20Text1.x = canvasWidth * 6.5 - 30;
    D20Text2.x = canvasWidth * -0.5 - 30;
  }
  previousWidth = window.innerWidth * window.devicePixelRatio - 5;
  previousHeight = window.innerHeight * window.devicePixelRatio - 5;
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
  }
  for (i = 0; i < spriteList.length; i += 1) {
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
  updateCanvasSize();
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
    myGameArea.canvas.width = window.innerWidth * window.devicePixelRatio - 5;
    myGameArea.canvas.height = window.innerHeight * window.devicePixelRatio - 5;
    canvasWidth = myGameArea.canvas.width;
    canvasHeight = myGameArea.canvas.height;
    previousWidth = canvasWidth;
    previousHeight = canvasHeight;
    camera.x = canvasWidth / 2;
    camera.y = canvasHeight / 2;
    startCam.x = camera.x;
    startCam.y = camera.y;
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
