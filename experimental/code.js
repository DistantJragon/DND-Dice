// Spites
var D4_1, D4_2, D4_3, D4_4, D4_5, D4_6, D4_7, D4_8, D4_9;
var D6_1, D6_2, D6_3, D6_4, D6_5, D6_6, D6_7, D6_8, D6_9;
var D8_1, D8_2, D8_3, D8_4, D8_5, D8_6, D8_7, D8_8, D8_9;
var D10_1, D10_2, D10_3, D10_4, D10_5, D10_6, D10_7, D10_8, D10_9, D10_10, D10_11, D10_12;
var D00_1, D00_2, D00_3;
var D12_1, D12_2, D12_3, D12_4, D12_5, D12_6, D12_7, D12_8, D12_9;
var D20_1, D20_2, D20_3, D20_4, D20_5, D20_6, D20_7, D20_8, D20_9;
var diceBar, diceBall;
var numBar, numBall;
var muter;

// Number of Dice per page
var d4n = 1;
var d6n = 1;
var d8n = 1;
var d10n = 1;
var d00n = 1;
var d12n = 1;
var d20n = 1;

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
var errorSound;
var camera = {x: 0, y: 0, mouseX: 0, mouseY: 0};
var startCam = {x: 0, y: 0};
var cursor = {x: 0, y: 0};
var keysPressed = [];
var keysHeld = [];
var keysReleased = [];
var mousePressed = false;
var mousePress = false;
var mouseRelease = false;
var canvasWidth;
var canvasHeight;
var previousWidth;
var previousHeight;
var spriteList = [];
var textList = [];

var myGameArea = {
  canvas : document.createElement("canvas"),
  start : function () {
    myGameArea.canvas.width = window.innerWidth * window.devicePixelRatio;
    myGameArea.canvas.height = window.innerHeight * window.devicePixelRatio;
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
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
};

function goRight() {
  toggle1 = true;
  toggle4 = true;
  timer3 = 10;
  swipeCheck = false;
  if (camera.x == canvasWidth * 6.5) {
    warpingD4 = true;
  }
}
function goLeft() {
  toggle2 = true;
  toggle5 = true;
  timer3 = 10;
  swipeCheck = false;
  if (camera.x == canvasWidth * 0.5) {
    warpingD20 = true;
  }
}
function numUp() {
         if (camera.x == canvasWidth * 0.5 && d4n < 9)  { d4n = d4n + 1; intendedSinglePositions(4);
  } else if (camera.x == canvasWidth * 1.5 && d6n < 9)  { d6n = d6n + 1; intendedSinglePositions(6);
  } else if (camera.x == canvasWidth * 2.5 && d8n < 9)  { d8n = d8n + 1; intendedSinglePositions(8);
  } else if (camera.x == canvasWidth * 3.5 && d10n < 9) { d10n = d10n + 1; intendedSinglePositions(10);
  } else if (camera.x == canvasWidth * 4.5 && d00n < 3) { d00n = d00n + 1; intendedD00Positions(); 
  } else if (camera.x == canvasWidth * 5.5 && d12n < 9) { d12n = d12n + 1; intendedSinglePositions(12);                                                                 
  } else if (camera.x == canvasWidth * 6.5 && d20n < 9) { d20n = d20n + 1; intendedSinglePositions(20);
  } else if (muteAll == -1) { errorSound.play(); }
  swipeCheck = false;
}
function numDown() {
         if (camera.x == canvasWidth * 0.5 && d4n > 1)  { d4n = d4n - 1; intendedSinglePositions(4);
  } else if (camera.x == canvasWidth * 1.5 && d6n > 1)  { d6n = d6n - 1; intendedSinglePositions(6);
  } else if (camera.x == canvasWidth * 2.5 && d8n > 1)  { d8n = d8n - 1; intendedSinglePositions(8);
  } else if (camera.x == canvasWidth * 3.5 && d10n > 1) { d10n = d10n - 1; intendedSinglePositions(10);
  } else if (camera.x == canvasWidth * 4.5 && d00n > 1) { d00n = d00n - 1; intendedD00Positions(); 
  } else if (camera.x == canvasWidth * 5.5 && d12n > 1) { d12n = d12n - 1; intendedSinglePositions(12);                                                                   
  } else if (camera.x == canvasWidth * 6.5 && d20n > 1) { d20n = d20n - 1; intendedSinglePositions(20);
  } else if (muteAll == -1) { errorSound.play(); }
  swipeCheck = false;
}
function control() {
  // Press R
  if (keysPressed[39] == 1) {
    goRight();
  }
  // Hold R
  if (timer1 >= 20 && keysHeld[39] && mousePressOver(diceBar) == false) {
    timer3 = 20; // Stop rolling
    toggle4 = true;
    if (camera.x == 2600) {
      warpingD4 = true;
    }
  }
  // Press L
  if (keysPressed[37] == 1) {
    goLeft();
  }
  // Hold L
  if (timer2 >= 20 && keysHeld[37] && mousePressOver(diceBar) == false) {
    timer3 = 20;  // Stop rolling
    toggle5 = true;
    if (camera.x == 200) {
      warpingD20 = true;
    }
  }
  // Press Up
  if (keysPressed[38] == 1) {
    numUp();
  }
  // Press Down
  if (keysPressed[40] == 1) {
    numDown();
  }
  // Press Space
  if (keysPressed[32] == 1) {
    toggle3 = true;  // For rolling 
  }
  // Prepare to determine a swipe or tap
  if (mousePressed && mouseIsOver(muter) == false && mouseIsOver(diceBar) == false && mouseIsOver(numBar) == false) {
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
  
  timer6 = timer6 + 1 // For Dice Bar Icon
  if (timer6 >= 31) {
    timer6 = 0;
  }
}
function mute() {
  if (mouseIsOver(muter) && mousePressed) {
    muteAll = muteAll * -1;
    PAS = true;
  }
  muter.sourceX = (muteAll * -58) + 58;
  muter.x = camera.x - canvasWidth / 2 + 75;
  muter.y = 75;
}
function sliders() {
  var currentNumberOfDice;
  if (camera.x == canvasWidth * 0.5) {
    currentNumberOfDice = d4n;
  } else if (camera.x == canvasWidth * 1.5) {
    currentNumberOfDice = d6n;
  } else if (camera.x == canvasWidth * 2.5) {
    currentNumberOfDice = d8n;
  } else if (camera.x == canvasWidth * 3.5) {
    currentNumberOfDice = d10n;
  } else if (camera.x == canvasWidth * 4.5) {
    currentNumberOfDice = d00n;
  } else if (camera.x == canvasWidth * 5.5) {
    currentNumberOfDice = d12n;
  } else if (camera.x == canvasWidth * 6.5) {
    currentNumberOfDice = d20n;
  }
  diceBar.x = camera.x + 36;
  diceBar.y = canvasHeight - 63;
  diceBarIcon.x = diceBar.x - 441;
  diceBarIcon.y = diceBar.y;
  numBar.x = camera.x + canvasWidth / 2 - 63;
  numBar.y = canvasHeight / 2 - 36;
  numBarIcon.x = numBar.x;
  numBarIcon.y = numBar.y + 441;
  if (timer6 == 30) {
    diceBarIcon.sourceX = diceBarIcon.sourceX + 62;
    if (diceBarIcon.sourceX >= 310) {
      diceBarIcon.sourceX = 0;
    }
  }
  if (mouseRelease) {
    PAS = false;
    numSlideCheck = false;
    
  }
  if (mousePressOver(diceBar) == false) {
    diceBall.x = diceBar.x + (camera.x/canvasWidth + 0.5) * 123 - 492;
    diceBall.y = diceBar.y;
  } else if (PAS == false) {
    diceSlideCheck = true;
    toggle4 = false;
    toggle5 = false;
  }
  if (mousePressOver(numBar) == false) {
    numBall.x = numBar.x;
    if (currentNumberOfDice != undefined) {
      numBall.y = numBar.y - currentNumberOfDice * 92 + 460;
    }
  } else if (PAS == false) {
    numSlideCheck = true;
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
    if (camera.x == canvasWidth * 4.5 && numBall.y < numBar.y + 184) {
      numBall.y = numBar.y + 184;
    }
    if (camera.mouseY < numBar.y - 369) {
      numBall.y = numBar.y - 369;
    }
    if (camera.mouseY > numBar.y + 369) {
      numBall.y = numBar.y + 369;
    }
    currentNumberOfDice = Math.round((numBall.y - 460 - numBar.y) / -92);
  }
  if (camera.x == canvasWidth * 0.5) {
    d4n = currentNumberOfDice;
  } else if (camera.x == canvasWidth * 1.5) {
    d6n = currentNumberOfDice;
  } else if (camera.x == canvasWidth * 2.5) {
    d8n = currentNumberOfDice;
  } else if (camera.x == canvasWidth * 3.5) {
    d10n = currentNumberOfDice;
  } else if (camera.x == canvasWidth * 4.5) {
    d00n = currentNumberOfDice;
    if (d00n > 3) {
      d00n = 3;
    }
  } else if (camera.x == canvasWidth * 5.5) {
    d12n = currentNumberOfDice;
  } else if (camera.x == canvasWidth * 6.5) {
    d20n = currentNumberOfDice;
  }
  if (numSlideCheck) {
    if (camera.x == canvasWidth * 0.5) {
      intendedSinglePositions(4);
    } else if (camera.x == canvasWidth * 1.5) {
      intendedSinglePositions(6);
    } else if (camera.x == canvasWidth * 2.5) {
      intendedSinglePositions(8);
    } else if (camera.x == canvasWidth * 3.5) {
      intendedSinglePositions(10);
    } else if (camera.x == canvasWidth * 4.5) {
      intendedD00Positions();
    } else if (camera.x == canvasWidth * 5.5) {
      intendedSinglePositions(12);
    } else if (camera.x == canvasWidth * 6.5) {
      intendedSinglePositions(20);
    }
  }
}
function spriteAnimation() {
  if (warpingD4 == false) {
    D4();
  }
  D6();
  D8();
  D10();
  D00();
  D12();
  if (warpingD20 == false) {
    D20();
  }
  if (warpingD4) {
    D4_1.x = D4_1.destinationX + canvasWidth * 7;
    D4_2.x = D4_2.destinationX + canvasWidth * 7;
    D4_3.x = D4_3.destinationX + canvasWidth * 7;
    D4_4.x = D4_4.destinationX + canvasWidth * 7;
    D4_5.x = D4_5.destinationX + canvasWidth * 7;
    D4_6.x = D4_6.destinationX + canvasWidth * 7;
    D4_7.x = D4_7.destinationX + canvasWidth * 7;
    D4_8.x = D4_8.destinationX + canvasWidth * 7;
    D4_9.x = D4_9.destinationX + canvasWidth * 7;
    if ((toggle4 == false && camera.x == canvasWidth * 0.5) || (toggle5 && camera.x == canvasWidth * 6.5)) {
      warpingD4 = false;
      D4_1.x = D4_1.destinationX;
      D4_2.x = D4_2.destinationX;
      D4_3.x = D4_3.destinationX;
      D4_4.x = D4_4.destinationX;
      D4_5.x = D4_5.destinationX;
      D4_6.x = D4_6.destinationX;
      D4_7.x = D4_7.destinationX;
      D4_8.x = D4_8.destinationX;
      D4_9.x = D4_9.destinationX;
    }
  }
  if (warpingD20) {
    D20_1.x = D20_1.destinationX - canvasWidth * 7;
    D20_2.x = D20_2.destinationX - canvasWidth * 7;
    D20_3.x = D20_3.destinationX - canvasWidth * 7;
    D20_4.x = D20_4.destinationX - canvasWidth * 7;
    D20_5.x = D20_5.destinationX - canvasWidth * 7;
    D20_6.x = D20_6.destinationX - canvasWidth * 7;
    D20_7.x = D20_7.destinationX - canvasWidth * 7;
    D20_8.x = D20_8.destinationX - canvasWidth * 7;
    D20_9.x = D20_9.destinationX - canvasWidth * 7;
    if ((toggle5 == false && camera.x == canvasWidth * 6.5) || (toggle4 && camera.x == canvasWidth * 0.5)) {
      warpingD20 = false;
      D20_1.x = D20_1.destinationX;
      D20_2.x = D20_2.destinationX;
      D20_3.x = D20_3.destinationX;
      D20_4.x = D20_4.destinationX;
      D20_5.x = D20_5.destinationX;
      D20_6.x = D20_6.destinationX;
      D20_7.x = D20_7.destinationX;
      D20_8.x = D20_8.destinationX;
      D20_9.x = D20_9.destinationX;
    }
  }
}
function intendedSinglePositions(diceType) {
  for (var i = 1; i < 10; i++) {
    eval("var X" + i + " = D" + diceType + "_" + i + ".destinationX;");
    eval("var Y" + i + " = D" + diceType + "_" + i + ".destinationY;")
  }
  eval("var N = d" + diceType + "n;");
  var multiplier;
  if (diceType == 4) {
    multiplier = 0
  } else if (diceType == 6) {
    multiplier = 1
  } else if (diceType == 8) {
    multiplier = 2
  } else if (diceType == 10) {
    multiplier = 3
  } else if (diceType == 12) {
    multiplier = 5
  } else if (diceType == 20) {
    multiplier = 6
  }
  if (N == 1) {
    X1 = canvasWidth * (0.5 + multiplier);
    Y1 = canvasHeight * 0.5;
    X2 = canvasWidth * (1.5 + multiplier);
    Y2 = canvasHeight * -0.5;
  }
  if (N == 2) {
    X1 = canvasWidth * multiplier + (canvasWidth / 3);
    Y1 = canvasHeight * 0.5;
    X2 = canvasWidth * multiplier + (canvasWidth * 2 / 3);
  }
  if (N == 3) {
    X1 = canvasWidth * multiplier + (canvasWidth / 3);
    Y1 = canvasHeight / 3;
    X2 = canvasWidth * multiplier + (2 * canvasWidth / 3);
    X3 = canvasWidth * (0.5 + multiplier);
    Y3 = canvasHeight * 2 / 3
  }
  if (N == 4) {
    X1 = canvasWidth * multiplier + (canvasWidth / 3);
    Y1 = canvasHeight / 3;
    X2 = canvasWidth * multiplier + (2 * canvasWidth / 3);
    X3 = canvasWidth * multiplier + (canvasWidth / 3);
    Y3 = canvasHeight * 2 / 3;
    X4 = canvasWidth * multiplier + (2 * canvasWidth / 3);
    Y4 = canvasHeight * 2 / 3;
  }
  if (N == 5) {
    X1 = canvasWidth * multiplier + (canvasWidth / 4);
    Y1 = canvasHeight / 3;
    X2 = canvasWidth * (0.5 + multiplier);
    X3 = canvasWidth * multiplier + (canvasWidth / 3);
    Y3 = canvasHeight * 2 / 3;
    X4 = canvasWidth * multiplier + (2 * canvasWidth / 3);
    Y4 = canvasHeight * 2 / 3;
    X5 = canvasWidth * multiplier + (canvasWidth * 3 / 4);
  }
  if (N == 6) {
    X1 = canvasWidth * multiplier + (canvasWidth / 4);
    Y1 = canvasHeight / 3;
    X2 = canvasWidth * (0.5 + multiplier);
    X3 = canvasWidth * multiplier + (canvasWidth / 4);
    Y3 = canvasHeight * 2 / 3;
    X4 = canvasWidth * (0.5 + multiplier);
    Y4 = canvasHeight * 2 / 3;
    X5 = canvasWidth * multiplier + (canvasWidth * 3 / 4);
    X6 = canvasWidth * multiplier + (canvasWidth * 3 / 4);
    Y6 = canvasHeight * 2 / 3;
  }
  if (N == 7) {
    X7 = canvasWidth * (0.5 + multiplier);
    Y7 = canvasHeight * 3 / 4;
  }
  if (N == 8) {
    X7 = canvasWidth * multiplier + (canvasWidth / 3);
    Y7 = canvasHeight * 3 / 4;
    X8 = canvasWidth * multiplier + (canvasWidth * 2 / 3);
    Y8 = canvasHeight * 3 / 4;
  }
  if (N == 9) {
    X7 = canvasWidth * multiplier + (canvasWidth / 4);
    Y7 = canvasHeight * 3 / 4;
    X8 = canvasWidth * (0.5 + multiplier);
    Y8 = canvasHeight * 3 / 4;
    X9 = canvasWidth * multiplier + (canvasWidth * 3 / 4);
    Y9 = canvasHeight * 3 / 4;
  }
  if (N < 3) {
    X3 = canvasWidth * (-0.5 + multiplier);
    Y3 = canvasHeight * 1.5;
  }
  if (N < 4) {
    X4 = canvasWidth * (1.5 + multiplier);
    Y4 = canvasHeight * 1.5;
  }
  if (N < 5) {
    X5 = canvasWidth * (1.5 + multiplier);
    Y5 = canvasHeight * -0.5;
  }
  if (N < 6) {
    X6 = canvasWidth * (1.5 + multiplier);
    Y6 = canvasHeight * 1.5;
  }
  if (N < 7) {
    X7 = canvasWidth * (0.5 + multiplier);
    Y7 = canvasHeight * 1.5;
  } else {
    X1 = canvasWidth * multiplier + (canvasWidth / 4);
    Y1 = canvasHeight / 4;
    X2 = canvasWidth * (0.5 + multiplier);
    X3 = canvasWidth * multiplier + (canvasWidth / 4);
    Y3 = canvasHeight / 2;
    X4 = canvasWidth * (0.5 + multiplier);
    Y4 = canvasHeight / 2;
    X5 = canvasWidth * multiplier + (canvasWidth * 3 / 4);
    X6 = canvasWidth * multiplier + (canvasWidth * 3 / 4);
    Y6 = canvasHeight / 2;
  }
  if (N < 8) {
    X8 = canvasWidth * (1.5 + multiplier);
    Y8 = canvasHeight * 1.5;
  }
  if (N < 9) {
    X9 = canvasWidth * (1.5 + multiplier);
    Y9 = canvasHeight * 1.5;
  }
  if (N > 1) {
    Y2 = Y1;
  }
  if (N >= 5) {
    Y5 = Y1;
  }
  for (var v = 1; v < 10; v++) {
    eval("D" + diceType + "_" + v + ".destinationX = X" + v + ";");
    eval("D" + diceType + "_" + v + ".destinationY = Y" + v + ";")
  }
}
function intendedD00Positions() {
  var multiplier = 4;
  if (d00n == 1) {
    D00_1.destinationX = canvasWidth * multiplier + (canvasWidth / 3);
    D00_1.destinationY = canvasHeight * 0.5;
    D00_2.destinationX = canvasWidth * (-0.5 + multiplier);
    D00_2.destinationY = canvasHeight * 1.5;
    D00_3.destinationX = canvasWidth * (-0.5 + multiplier);
    D00_3.destinationY = canvasHeight * 1.5;
    D10_10.destinationX = canvasWidth * multiplier + (canvasWidth * 2 / 3);
    D10_10.destinationY = canvasHeight * 0.5;
    D10_11.destinationX = canvasWidth * (1.5 + multiplier);
    D10_11.destinationY = canvasHeight * 1.5;
    D10_12.destinationX = canvasWidth * (1.5 + multiplier);
    D10_12.destinationY = canvasHeight * 1.5;
  }
  if (d00n == 2) {
    D00_1.destinationX = canvasWidth * multiplier + (canvasWidth / 3);
    D00_1.destinationY = canvasHeight / 3;
    D00_2.destinationX = canvasWidth * multiplier + (canvasWidth / 3);
    D00_2.destinationY = canvasHeight * 2 / 3;
    D00_3.destinationX = canvasWidth * (-0.5 + multiplier);
    D00_3.destinationY = canvasHeight * 1.5;
    D10_10.destinationX = canvasWidth * multiplier + (canvasWidth * 2 / 3);
    D10_10.destinationY = canvasHeight / 3;
    D10_11.destinationX = canvasWidth * multiplier + (canvasWidth * 2 / 3);
    D10_11.destinationY = canvasHeight * 2 / 3;
    D10_12.destinationX = canvasWidth * (1.5 + multiplier);
    D10_12.destinationY = canvasHeight * 1.5;
  }
  if (d00n == 3) {
    D00_1.destinationX = canvasWidth * multiplier + (canvasWidth / 3);
    D00_1.destinationY = canvasHeight / 4;
    D00_2.destinationX = canvasWidth * multiplier + (canvasWidth / 3);
    D00_2.destinationY = canvasHeight * 0.5;
    D00_3.destinationX = canvasWidth * multiplier + (canvasWidth / 3);
    D00_3.destinationY = canvasHeight * 3 / 4;
    D10_10.destinationX = canvasWidth * multiplier + (canvasWidth * 2 / 3);
    D10_10.destinationY = canvasHeight / 4;
    D10_11.destinationX = canvasWidth * multiplier + (canvasWidth * 2 / 3);
    D10_11.destinationY = canvasHeight * 0.5;
    D10_12.destinationX = canvasWidth * multiplier + (canvasWidth * 2 / 3);
    D10_12.destinationY = canvasHeight * 3 / 4;
  }
}
function D4() {
  D4_1.velocityX = (D4_1.destinationX - D4_1.x) / 10;
  if (Math.abs(D4_1.x - D4_1.destinationX) < 1) {
    D4_1.x = D4_1.destinationX;
  }
  D4_1.velocityY = (D4_1.destinationY - D4_1.y) / 10;
  if (Math.abs(D4_1.y - D4_1.destinationY) < 1) {
    D4_1.y = D4_1.destinationY;
  }
  D4_2.velocityX = (D4_2.destinationX - D4_2.x) / 10;
  if (Math.abs(D4_2.x - D4_2.destinationX) < 1) {
    D4_2.x = D4_2.destinationX;
  }
  D4_2.velocityY = (D4_2.destinationY - D4_2.y) / 10;
  if (Math.abs(D4_2.y - D4_2.destinationY) < 1) {
    D4_2.y = D4_2.destinationY;
  }
  D4_3.velocityX = (D4_3.destinationX - D4_3.x) / 10;
  if (Math.abs(D4_3.x - D4_3.destinationX) < 1) {
    D4_3.x = D4_3.destinationX;
  }
  D4_3.velocityY = (D4_3.destinationY - D4_3.y) / 10;
  if (Math.abs(D4_3.y - D4_3.destinationY) < 1) {
    D4_3.y = D4_3.destinationY;
  }
  D4_4.velocityX = (D4_4.destinationX - D4_4.x) / 10;
  if (Math.abs(D4_4.x - D4_4.destinationX) < 1) {
    D4_4.x = D4_4.destinationX;
  }
  D4_4.velocityY = (D4_4.destinationY - D4_4.y) / 10;
  if (Math.abs(D4_4.y - D4_4.destinationY) < 1) {
    D4_4.y = D4_4.destinationY;
  }
  D4_5.velocityX = (D4_5.destinationX - D4_5.x) / 10;
  if (Math.abs(D4_5.x - D4_5.destinationX) < 1) {
    D4_5.x = D4_5.destinationX;
  }
  D4_5.velocityY = (D4_5.destinationY - D4_5.y) / 10;
  if (Math.abs(D4_5.y - D4_5.destinationY) < 1) {
    D4_5.y = D4_5.destinationY;
  }
  D4_6.velocityX = (D4_6.destinationX - D4_6.x) / 10;
  if (Math.abs(D4_6.x - D4_6.destinationX) < 1) {
    D4_6.x = D4_6.destinationX;
  }
  D4_6.velocityY = (D4_6.destinationY - D4_6.y) / 10;
  if (Math.abs(D4_6.y - D4_6.destinationY) < 1) {
    D4_6.y = D4_6.destinationY;
  }
  D4_7.velocityX = (D4_7.destinationX - D4_7.x) / 10;
  if (Math.abs(D4_7.x - D4_7.destinationX) < 1) {
    D4_7.x = D4_7.destinationX;
  }
  D4_7.velocityY = (D4_7.destinationY - D4_7.y) / 10;
  if (Math.abs(D4_7.y - D4_7.destinationY) < 1) {
    D4_7.y = D4_7.destinationY;
  }
  D4_8.velocityX = (D4_8.destinationX - D4_8.x) / 10;
  if (Math.abs(D4_8.x - D4_8.destinationX) < 1) {
    D4_8.x = D4_8.destinationX;
  }
  D4_8.velocityY = (D4_8.destinationY - D4_8.y) / 10;
  if (Math.abs(D4_8.y - D4_8.destinationY) < 1) {
    D4_8.y = D4_8.destinationY;
  }
  D4_9.velocityX = (D4_9.destinationX - D4_9.x) / 10;
  if (Math.abs(D4_9.x - D4_9.destinationX) < 1) {
    D4_9.x = D4_9.destinationX;
  }
  D4_9.velocityY = (D4_9.destinationY - D4_9.y) / 10;
  if (Math.abs(D4_9.y - D4_9.destinationY) < 1) {
    D4_9.y = D4_9.destinationY;
  }
}
function D6() {
  D6_1.velocityX = (D6_1.destinationX - D6_1.x) / 10;
  if (Math.abs(D6_1.x - D6_1.destinationX) < 1) {
    D6_1.x = D6_1.destinationX;
  }
  D6_1.velocityY = (D6_1.destinationY - D6_1.y) / 10;
  if (Math.abs(D6_1.y - D6_1.destinationY) < 1) {
    D6_1.y = D6_1.destinationY;
  }
  D6_2.velocityX = (D6_2.destinationX - D6_2.x) / 10;
  if (Math.abs(D6_2.x - D6_2.destinationX) < 1) {
    D6_2.x = D6_2.destinationX;
  }
  D6_2.velocityY = (D6_2.destinationY - D6_2.y) / 10;
  if (Math.abs(D6_2.y - D6_2.destinationY) < 1) {
    D6_2.y = D6_2.destinationY;
  }
  D6_3.velocityX = (D6_3.destinationX - D6_3.x) / 10;
  if (Math.abs(D6_3.x - D6_3.destinationX) < 1) {
    D6_3.x = D6_3.destinationX;
  }
  D6_3.velocityY = (D6_3.destinationY - D6_3.y) / 10;
  if (Math.abs(D6_3.y - D6_3.destinationY) < 1) {
    D6_3.y = D6_3.destinationY;
  }
  D6_4.velocityX = (D6_4.destinationX - D6_4.x) / 10;
  if (Math.abs(D6_4.x - D6_4.destinationX) < 1) {
    D6_4.x = D6_4.destinationX;
  }
  D6_4.velocityY = (D6_4.destinationY - D6_4.y) / 10;
  if (Math.abs(D6_4.y - D6_4.destinationY) < 1) {
    D6_4.y = D6_4.destinationY;
  }
  D6_5.velocityX = (D6_5.destinationX - D6_5.x) / 10;
  if (Math.abs(D6_5.x - D6_5.destinationX) < 1) {
    D6_5.x = D6_5.destinationX;
  }
  D6_5.velocityY = (D6_5.destinationY - D6_5.y) / 10;
  if (Math.abs(D6_5.y - D6_5.destinationY) < 1) {
    D6_5.y = D6_5.destinationY;
  }
  D6_6.velocityX = (D6_6.destinationX - D6_6.x) / 10;
  if (Math.abs(D6_6.x - D6_6.destinationX) < 1) {
    D6_6.x = D6_6.destinationX;
  }
  D6_6.velocityY = (D6_6.destinationY - D6_6.y) / 10;
  if (Math.abs(D6_6.y - D6_6.destinationY) < 1) {
    D6_6.y = D6_6.destinationY;
  }
  D6_7.velocityX = (D6_7.destinationX - D6_7.x) / 10;
  if (Math.abs(D6_7.x - D6_7.destinationX) < 1) {
    D6_7.x = D6_7.destinationX;
  }
  D6_7.velocityY = (D6_7.destinationY - D6_7.y) / 10;
  if (Math.abs(D6_7.y - D6_7.destinationY) < 1) {
    D6_7.y = D6_7.destinationY;
  }
  D6_8.velocityX = (D6_8.destinationX - D6_8.x) / 10;
  if (Math.abs(D6_8.x - D6_8.destinationX) < 1) {
    D6_8.x = D6_8.destinationX;
  }
  D6_8.velocityY = (D6_8.destinationY - D6_8.y) / 10;
  if (Math.abs(D6_8.y - D6_8.destinationY) < 1) {
    D6_8.y = D6_8.destinationY;
  }
  D6_9.velocityX = (D6_9.destinationX - D6_9.x) / 10;
  if (Math.abs(D6_9.x - D6_9.destinationX) < 1) {
    D6_9.x = D6_9.destinationX;
  }
  D6_9.velocityY = (D6_9.destinationY - D6_9.y) / 10;
  if (Math.abs(D6_9.y - D6_9.destinationY) < 1) {
    D6_9.y = D6_9.destinationY;
  }
}
function D8() {
  D8_1.velocityX = (D8_1.destinationX - D8_1.x) / 10;
  if (Math.abs(D8_1.x - D8_1.destinationX) < 1) {
    D8_1.x = D8_1.destinationX;
  }
  D8_1.velocityY = (D8_1.destinationY - D8_1.y) / 10;
  if (Math.abs(D8_1.y - D8_1.destinationY) < 1) {
    D8_1.y = D8_1.destinationY;
  }
  D8_2.velocityX = (D8_2.destinationX - D8_2.x) / 10;
  if (Math.abs(D8_2.x - D8_2.destinationX) < 1) {
    D8_2.x = D8_2.destinationX;
  }
  D8_2.velocityY = (D8_2.destinationY - D8_2.y) / 10;
  if (Math.abs(D8_2.y - D8_2.destinationY) < 1) {
    D8_2.y = D8_2.destinationY;
  }
  D8_3.velocityX = (D8_3.destinationX - D8_3.x) / 10;
  if (Math.abs(D8_3.x - D8_3.destinationX) < 1) {
    D8_3.x = D8_3.destinationX;
  }
  D8_3.velocityY = (D8_3.destinationY - D8_3.y) / 10;
  if (Math.abs(D8_3.y - D8_3.destinationY) < 1) {
    D8_3.y = D8_3.destinationY;
  }
  D8_4.velocityX = (D8_4.destinationX - D8_4.x) / 10;
  if (Math.abs(D8_4.x - D8_4.destinationX) < 1) {
    D8_4.x = D8_4.destinationX;
  }
  D8_4.velocityY = (D8_4.destinationY - D8_4.y) / 10;
  if (Math.abs(D8_4.y - D8_4.destinationY) < 1) {
    D8_4.y = D8_4.destinationY;
  }
  D8_5.velocityX = (D8_5.destinationX - D8_5.x) / 10;
  if (Math.abs(D8_5.x - D8_5.destinationX) < 1) {
    D8_5.x = D8_5.destinationX;
  }
  D8_5.velocityY = (D8_5.destinationY - D8_5.y) / 10;
  if (Math.abs(D8_5.y - D8_5.destinationY) < 1) {
    D8_5.y = D8_5.destinationY;
  }
  D8_6.velocityX = (D8_6.destinationX - D8_6.x) / 10;
  if (Math.abs(D8_6.x - D8_6.destinationX) < 1) {
    D8_6.x = D8_6.destinationX;
  }
  D8_6.velocityY = (D8_6.destinationY - D8_6.y) / 10;
  if (Math.abs(D8_6.y - D8_6.destinationY) < 1) {
    D8_6.y = D8_6.destinationY;
  }
  D8_7.velocityX = (D8_7.destinationX - D8_7.x) / 10;
  if (Math.abs(D8_7.x - D8_7.destinationX) < 1) {
    D8_7.x = D8_7.destinationX;
  }
  D8_7.velocityY = (D8_7.destinationY - D8_7.y) / 10;
  if (Math.abs(D8_7.y - D8_7.destinationY) < 1) {
    D8_7.y = D8_7.destinationY;
  }
  D8_8.velocityX = (D8_8.destinationX - D8_8.x) / 10;
  if (Math.abs(D8_8.x - D8_8.destinationX) < 1) {
    D8_8.x = D8_8.destinationX;
  }
  D8_8.velocityY = (D8_8.destinationY - D8_8.y) / 10;
  if (Math.abs(D8_8.y - D8_8.destinationY) < 1) {
    D8_8.y = D8_8.destinationY;
  }
  D8_9.velocityX = (D8_9.destinationX - D8_9.x) / 10;
  if (Math.abs(D8_9.x - D8_9.destinationX) < 1) {
    D8_9.x = D8_9.destinationX;
  }
  D8_9.velocityY = (D8_9.destinationY - D8_9.y) / 10;
  if (Math.abs(D8_9.y - D8_9.destinationY) < 1) {
    D8_9.y = D8_9.destinationY;
  }
}
function D10() {
  D10_1.velocityX = (D10_1.destinationX - D10_1.x) / 10;
  if (Math.abs(D10_1.x - D10_1.destinationX) < 1) {
    D10_1.x = D10_1.destinationX;
  }
  D10_1.velocityY = (D10_1.destinationY - D10_1.y) / 10;
  if (Math.abs(D10_1.y - D10_1.destinationY) < 1) {
    D10_1.y = D10_1.destinationY;
  }
  D10_2.velocityX = (D10_2.destinationX - D10_2.x) / 10;
  if (Math.abs(D10_2.x - D10_2.destinationX) < 1) {
    D10_2.x = D10_2.destinationX;
  }
  D10_2.velocityY = (D10_2.destinationY - D10_2.y) / 10;
  if (Math.abs(D10_2.y - D10_2.destinationY) < 1) {
    D10_2.y = D10_2.destinationY;
  }
  D10_3.velocityX = (D10_3.destinationX - D10_3.x) / 10;
  if (Math.abs(D10_3.x - D10_3.destinationX) < 1) {
    D10_3.x = D10_3.destinationX;
  }
  D10_3.velocityY = (D10_3.destinationY - D10_3.y) / 10;
  if (Math.abs(D10_3.y - D10_3.destinationY) < 1) {
    D10_3.y = D10_3.destinationY;
  }
  D10_4.velocityX = (D10_4.destinationX - D10_4.x) / 10;
  if (Math.abs(D10_4.x - D10_4.destinationX) < 1) {
    D10_4.x = D10_4.destinationX;
  }
  D10_4.velocityY = (D10_4.destinationY - D10_4.y) / 10;
  if (Math.abs(D10_4.y - D10_4.destinationY) < 1) {
    D10_4.y = D10_4.destinationY;
  }
  D10_5.velocityX = (D10_5.destinationX - D10_5.x) / 10;
  if (Math.abs(D10_5.x - D10_5.destinationX) < 1) {
    D10_5.x = D10_5.destinationX;
  }
  D10_5.velocityY = (D10_5.destinationY - D10_5.y) / 10;
  if (Math.abs(D10_5.y - D10_5.destinationY) < 1) {
    D10_5.y = D10_5.destinationY;
  }
  D10_6.velocityX = (D10_6.destinationX - D10_6.x) / 10;
  if (Math.abs(D10_6.x - D10_6.destinationX) < 1) {
    D10_6.x = D10_6.destinationX;
  }
  D10_6.velocityY = (D10_6.destinationY - D10_6.y) / 10;
  if (Math.abs(D10_6.y - D10_6.destinationY) < 1) {
    D10_6.y = D10_6.destinationY;
  }
  D10_7.velocityX = (D10_7.destinationX - D10_7.x) / 10;
  if (Math.abs(D10_7.x - D10_7.destinationX) < 1) {
    D10_7.x = D10_7.destinationX;
  }
  D10_7.velocityY = (D10_7.destinationY - D10_7.y) / 10;
  if (Math.abs(D10_7.y - D10_7.destinationY) < 1) {
    D10_7.y = D10_7.destinationY;
  }
  D10_8.velocityX = (D10_8.destinationX - D10_8.x) / 10;
  if (Math.abs(D10_8.x - D10_8.destinationX) < 1) {
    D10_8.x = D10_8.destinationX;
  }
  D10_8.velocityY = (D10_8.destinationY - D10_8.y) / 10;
  if (Math.abs(D10_8.y - D10_8.destinationY) < 1) {
    D10_8.y = D10_8.destinationY;
  }
  D10_9.velocityX = (D10_9.destinationX - D10_9.x) / 10;
  if (Math.abs(D10_9.x - D10_9.destinationX) < 1) {
    D10_9.x = D10_9.destinationX;
  }
  D10_9.velocityY = (D10_9.destinationY - D10_9.y) / 10;
  if (Math.abs(D10_9.y - D10_9.destinationY) < 1) {
    D10_9.y = D10_9.destinationY;
  }
}
function D00() {
  D00_1.velocityX = (D00_1.destinationX - D00_1.x) / 10;
  if (Math.abs(D00_1.x - D00_1.destinationX) < 1) {
    D00_1.x = D00_1.destinationX;
  }
  D00_1.velocityY = (D00_1.destinationY - D00_1.y) / 10;
  if (Math.abs(D00_1.y - D00_1.destinationY) < 1) {
    D00_1.y = D00_1.destinationY;
  }
  D00_2.velocityX = (D00_2.destinationX - D00_2.x) / 10;
  if (Math.abs(D00_2.x - D00_2.destinationX) < 1) {
    D00_2.x = D00_2.destinationX;
  }
  D00_2.velocityY = (D00_2.destinationY - D00_2.y) / 10;
  if (Math.abs(D00_2.y - D00_2.destinationY) < 1) {
    D00_2.y = D00_2.destinationY;
  }
  D00_3.velocityX = (D00_3.destinationX - D00_3.x) / 10;
  if (Math.abs(D00_3.x - D00_3.destinationX) < 1) {
    D00_3.x = D00_3.destinationX;
  }
  D00_3.velocityY = (D00_3.destinationY - D00_3.y) / 10;
  if (Math.abs(D00_3.y - D00_3.destinationY) < 1) {
    D00_3.y = D00_3.destinationY;
  }
  D10_10.velocityX = (D10_10.destinationX - D10_10.x) / 10;
  if (Math.abs(D10_10.x - D10_10.destinationX) < 1) {
    D10_10.x = D10_10.destinationX;
  }
  D10_10.velocityY = (D10_10.destinationY - D10_10.y) / 10;
  if (Math.abs(D10_10.y - D10_10.destinationY) < 1) {
    D10_10.y = D10_10.destinationY;
  }
  D10_11.velocityX = (D10_11.destinationX - D10_11.x) / 10;
  if (Math.abs(D10_11.x - D10_11.destinationX) < 1) {
    D10_11.x = D10_11.destinationX;
  }
  D10_11.velocityY = (D10_11.destinationY - D10_11.y) / 10;
  if (Math.abs(D10_11.y - D10_11.destinationY) < 1) {
    D10_11.y = D10_11.destinationY;
  }
  D10_12.velocityX = (D10_12.destinationX - D10_12.x) / 10;
  if (Math.abs(D10_12.x - D10_12.destinationX) < 1) {
    D10_12.x = D10_12.destinationX;
  }
  D10_12.velocityY = (D10_12.destinationY - D10_12.y) / 10;
  if (Math.abs(D10_12.y - D10_12.destinationY) < 1) {
    D10_12.y = D10_12.destinationY;
  }
}
function D12() {
  D12_1.velocityX = (D12_1.destinationX - D12_1.x) / 10;
  if (Math.abs(D12_1.x - D12_1.destinationX) < 1) {
    D12_1.x = D12_1.destinationX;
  }
  D12_1.velocityY = (D12_1.destinationY - D12_1.y) / 10;
  if (Math.abs(D12_1.y - D12_1.destinationY) < 1) {
    D12_1.y = D12_1.destinationY;
  }
  D12_2.velocityX = (D12_2.destinationX - D12_2.x) / 10;
  if (Math.abs(D12_2.x - D12_2.destinationX) < 1) {
    D12_2.x = D12_2.destinationX;
  }
  D12_2.velocityY = (D12_2.destinationY - D12_2.y) / 10;
  if (Math.abs(D12_2.y - D12_2.destinationY) < 1) {
    D12_2.y = D12_2.destinationY;
  }
  D12_3.velocityX = (D12_3.destinationX - D12_3.x) / 10;
  if (Math.abs(D12_3.x - D12_3.destinationX) < 1) {
    D12_3.x = D12_3.destinationX;
  }
  D12_3.velocityY = (D12_3.destinationY - D12_3.y) / 10;
  if (Math.abs(D12_3.y - D12_3.destinationY) < 1) {
    D12_3.y = D12_3.destinationY;
  }
  D12_4.velocityX = (D12_4.destinationX - D12_4.x) / 10;
  if (Math.abs(D12_4.x - D12_4.destinationX) < 1) {
    D12_4.x = D12_4.destinationX;
  }
  D12_4.velocityY = (D12_4.destinationY - D12_4.y) / 10;
  if (Math.abs(D12_4.y - D12_4.destinationY) < 1) {
    D12_4.y = D12_4.destinationY;
  }
  D12_5.velocityX = (D12_5.destinationX - D12_5.x) / 10;
  if (Math.abs(D12_5.x - D12_5.destinationX) < 1) {
    D12_5.x = D12_5.destinationX;
  }
  D12_5.velocityY = (D12_5.destinationY - D12_5.y) / 10;
  if (Math.abs(D12_5.y - D12_5.destinationY) < 1) {
    D12_5.y = D12_5.destinationY;
  }
  D12_6.velocityX = (D12_6.destinationX - D12_6.x) / 10;
  if (Math.abs(D12_6.x - D12_6.destinationX) < 1) {
    D12_6.x = D12_6.destinationX;
  }
  D12_6.velocityY = (D12_6.destinationY - D12_6.y) / 10;
  if (Math.abs(D12_6.y - D12_6.destinationY) < 1) {
    D12_6.y = D12_6.destinationY;
  }
  D12_7.velocityX = (D12_7.destinationX - D12_7.x) / 10;
  if (Math.abs(D12_7.x - D12_7.destinationX) < 1) {
    D12_7.x = D12_7.destinationX;
  }
  D12_7.velocityY = (D12_7.destinationY - D12_7.y) / 10;
  if (Math.abs(D12_7.y - D12_7.destinationY) < 1) {
    D12_7.y = D12_7.destinationY;
  }
  D12_8.velocityX = (D12_8.destinationX - D12_8.x) / 10;
  if (Math.abs(D12_8.x - D12_8.destinationX) < 1) {
    D12_8.x = D12_8.destinationX;
  }
  D12_8.velocityY = (D12_8.destinationY - D12_8.y) / 10;
  if (Math.abs(D12_8.y - D12_8.destinationY) < 1) {
    D12_8.y = D12_8.destinationY;
  }
  D12_9.velocityX = (D12_9.destinationX - D12_9.x) / 10;
  if (Math.abs(D12_9.x - D12_9.destinationX) < 1) {
    D12_9.x = D12_9.destinationX;
  }
  D12_9.velocityY = (D12_9.destinationY - D12_9.y) / 10;
  if (Math.abs(D12_9.y - D12_9.destinationY) < 1) {
    D12_9.y = D12_9.destinationY;
  }
}
function D20() {
  D20_1.velocityX = (D20_1.destinationX - D20_1.x) / 10;
  if (Math.abs(D20_1.x - D20_1.destinationX) < 1) {
    D20_1.x = D20_1.destinationX;
  }
  D20_1.velocityY = (D20_1.destinationY - D20_1.y) / 10;
  if (Math.abs(D20_1.y - D20_1.destinationY) < 1) {
    D20_1.y = D20_1.destinationY;
  }
  D20_2.velocityX = (D20_2.destinationX - D20_2.x) / 10;
  if (Math.abs(D20_2.x - D20_2.destinationX) < 1) {
    D20_2.x = D20_2.destinationX;
  }
  D20_2.velocityY = (D20_2.destinationY - D20_2.y) / 10;
  if (Math.abs(D20_2.y - D20_2.destinationY) < 1) {
    D20_2.y = D20_2.destinationY;
  }
  D20_3.velocityX = (D20_3.destinationX - D20_3.x) / 10;
  if (Math.abs(D20_3.x - D20_3.destinationX) < 1) {
    D20_3.x = D20_3.destinationX;
  }
  D20_3.velocityY = (D20_3.destinationY - D20_3.y) / 10;
  if (Math.abs(D20_3.y - D20_3.destinationY) < 1) {
    D20_3.y = D20_3.destinationY;
  }
  D20_4.velocityX = (D20_4.destinationX - D20_4.x) / 10;
  if (Math.abs(D20_4.x - D20_4.destinationX) < 1) {
    D20_4.x = D20_4.destinationX;
  }
  D20_4.velocityY = (D20_4.destinationY - D20_4.y) / 10;
  if (Math.abs(D20_4.y - D20_4.destinationY) < 1) {
    D20_4.y = D20_4.destinationY;
  }
  D20_5.velocityX = (D20_5.destinationX - D20_5.x) / 10;
  if (Math.abs(D20_5.x - D20_5.destinationX) < 1) {
    D20_5.x = D20_5.destinationX;
  }
  D20_5.velocityY = (D20_5.destinationY - D20_5.y) / 10;
  if (Math.abs(D20_5.y - D20_5.destinationY) < 1) {
    D20_5.y = D20_5.destinationY;
  }
  D20_6.velocityX = (D20_6.destinationX - D20_6.x) / 10;
  if (Math.abs(D20_6.x - D20_6.destinationX) < 1) {
    D20_6.x = D20_6.destinationX;
  }
  D20_6.velocityY = (D20_6.destinationY - D20_6.y) / 10;
  if (Math.abs(D20_6.y - D20_6.destinationY) < 1) {
    D20_6.y = D20_6.destinationY;
  }
  D20_7.velocityX = (D20_7.destinationX - D20_7.x) / 10;
  if (Math.abs(D20_7.x - D20_7.destinationX) < 1) {
    D20_7.x = D20_7.destinationX;
  }
  D20_7.velocityY = (D20_7.destinationY - D20_7.y) / 10;
  if (Math.abs(D20_7.y - D20_7.destinationY) < 1) {
    D20_7.y = D20_7.destinationY;
  }
  D20_8.velocityX = (D20_8.destinationX - D20_8.x) / 10;
  if (Math.abs(D20_8.x - D20_8.destinationX) < 1) {
    D20_8.x = D20_8.destinationX;
  }
  D20_8.velocityY = (D20_8.destinationY - D20_8.y) / 10;
  if (Math.abs(D20_8.y - D20_8.destinationY) < 1) {
    D20_8.y = D20_8.destinationY;
  }
  D20_9.velocityX = (D20_9.destinationX - D20_9.x) / 10;
  if (Math.abs(D20_9.x - D20_9.destinationX) < 1) {
    D20_9.x = D20_9.destinationX;
  }
  D20_9.velocityY = (D20_9.destinationY - D20_9.y) / 10;
  if (Math.abs(D20_9.y - D20_9.destinationY) < 1) {
    D20_9.y = D20_9.destinationY;
  }
}
function cameraPos() {
  if (toggle4) { // Move right
    camera.x = camera.x + canvasWidth/20;
  }
  if (toggle5) { // Move left
    camera.x = camera.x - canvasWidth/20;
  }
  if (camera.x == canvasWidth/-2) {
    camera.x = canvasWidth * 6.5;
  }
  if (camera.x == canvasWidth * 7.5) {
    camera.x = canvasWidth/2;
  }
  if (diceSlideCheck) {
    camera.x = ((diceBall.x + 492 - diceBar.x) / 123 - 0.5) * canvasWidth;
    if (camera.mouseX < diceBar.x - 369) {
      camera.x = canvasWidth/2;
    }
    if (camera.mouseX > diceBar.x + 369) {
      camera.x = canvasWidth * 6.5;
    }
  }
  if (toggle4 == false && toggle5 == false && mousePress == false) { // Round camera.x from camera slider
    camera.x = canvasWidth * Math.round(camera.x/canvasWidth + 0.5) - canvasWidth/2;
    diceSlideCheck = false;
  }
  camera.mouseX = cursor.x + camera.x - startCam.x;
  camera.mouseY = cursor.y + camera.y - startCam.y;
}
function roll() {
  // Rolls dice when camera is on them
  if (camera.x == canvasWidth * 0.5) {
    D4_1.sourceX = randomNumber(1, 4) * D4_1.width;
    D4_2.sourceX = randomNumber(1, 4) * D4_2.width;
    D4_3.sourceX = randomNumber(1, 4) * D4_3.width;
    D4_4.sourceX = randomNumber(1, 4) * D4_4.width;
    D4_5.sourceX = randomNumber(1, 4) * D4_5.width;
    D4_6.sourceX = randomNumber(1, 4) * D4_6.width;
    D4_7.sourceX = randomNumber(1, 4) * D4_7.width;
    D4_8.sourceX = randomNumber(1, 4) * D4_8.width;
    D4_9.sourceX = randomNumber(1, 4) * D4_9.width;
  } else if (camera.x == canvasWidth * 1.5) {
    D6_1.sourceX = randomNumber(1, 6) * D6_1.width;
    D6_2.sourceX = randomNumber(1, 6) * D6_2.width;
    D6_3.sourceX = randomNumber(1, 6) * D6_3.width;
    D6_4.sourceX = randomNumber(1, 6) * D6_4.width;
    D6_5.sourceX = randomNumber(1, 6) * D6_5.width;
    D6_6.sourceX = randomNumber(1, 6) * D6_6.width;
    D6_7.sourceX = randomNumber(1, 6) * D6_7.width;
    D6_8.sourceX = randomNumber(1, 6) * D6_8.width;
    D6_9.sourceX = randomNumber(1, 6) * D6_9.width;
  } else if (camera.x == canvasWidth * 2.5) {
    D8_1.sourceX = randomNumber(1, 8) * D8_1.width;
    D8_2.sourceX = randomNumber(1, 8) * D8_2.width;
    D8_3.sourceX = randomNumber(1, 8) * D8_3.width;
    D8_4.sourceX = randomNumber(1, 8) * D8_4.width;
    D8_5.sourceX = randomNumber(1, 8) * D8_5.width;
    D8_6.sourceX = randomNumber(1, 8) * D8_6.width;
    D8_7.sourceX = randomNumber(1, 8) * D8_7.width;
    D8_8.sourceX = randomNumber(1, 8) * D8_8.width;
    D8_9.sourceX = randomNumber(1, 8) * D8_9.width;
  } else if (camera.x == canvasWidth * 3.5) {
    D10_1.sourceX = randomNumber(1, 10) * D10_1.width;
    D10_2.sourceX = randomNumber(1, 10) * D10_2.width;
    D10_3.sourceX = randomNumber(1, 10) * D10_3.width;
    D10_4.sourceX = randomNumber(1, 10) * D10_4.width;
    D10_5.sourceX = randomNumber(1, 10) * D10_5.width;
    D10_6.sourceX = randomNumber(1, 10) * D10_6.width;
    D10_7.sourceX = randomNumber(1, 10) * D10_7.width;
    D10_8.sourceX = randomNumber(1, 10) * D10_8.width;
    D10_9.sourceX = randomNumber(1, 10) * D10_9.width;
  } else if (camera.x == canvasWidth * 4.5) {
    D10_10.sourceX = randomNumber(1, 10) * D10_10.width;
    D10_11.sourceX = randomNumber(1, 10) * D10_11.width;
    D10_12.sourceX = randomNumber(1, 10) * D10_12.width;
    D00_1.sourceX = randomNumber(1, 10) * D00_1.width;
    D00_2.sourceX = randomNumber(1, 10) * D00_2.width;
    D00_3.sourceX = randomNumber(1, 10) * D00_3.width;
  } else if (camera.x == canvasWidth * 5.5) {
    D12_1.sourceX = randomNumber(1, 12) * D12_1.width;
    D12_2.sourceX = randomNumber(1, 12) * D12_2.width;
    D12_3.sourceX = randomNumber(1, 12) * D12_3.width;
    D12_4.sourceX = randomNumber(1, 12) * D12_4.width;
    D12_5.sourceX = randomNumber(1, 12) * D12_5.width;
    D12_6.sourceX = randomNumber(1, 12) * D12_6.width;
    D12_7.sourceX = randomNumber(1, 12) * D12_7.width;
    D12_8.sourceX = randomNumber(1, 12) * D12_8.width;
    D12_9.sourceX = randomNumber(1, 12) * D12_9.width;
  } else if (camera.x == canvasWidth * 6.5) {
    D20_1.sourceX = randomNumber(1, 20) * D20_1.width;
    D20_2.sourceX = randomNumber(1, 20) * D20_2.width;
    D20_3.sourceX = randomNumber(1, 20) * D20_3.width;
    D20_4.sourceX = randomNumber(1, 20) * D20_4.width;
    D20_5.sourceX = randomNumber(1, 20) * D20_5.width;
    D20_6.sourceX = randomNumber(1, 20) * D20_6.width;
    D20_7.sourceX = randomNumber(1, 20) * D20_7.width;
    D20_8.sourceX = randomNumber(1, 20) * D20_8.width;
    D20_9.sourceX = randomNumber(1, 20) * D20_9.width;
  }
  swipeCheck = false;
}

function updateGameArea() {
  myGameArea.clear();
  updateCanvasSize();
  cameraPos();
  control();
  timers();
  mute();
  sliders();
  spriteAnimation();
  
  updateText();
  updateSpritePos();
  drawSprites();
  resetPressedKeys();
  resetReleasedKeys();
  resetMouseClick();
}                                       // Draw Function
function Component(width, height, color, x, y, type) {
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
function allSprites() {
  var multiplier = 0;
  D4_1 = new Component(250, 218, "D4.png", canvasWidth * (0.5 + multiplier), canvasHeight * 0.5, "image");
  D4_2 = new Component(250, 218, "D4.png", canvasWidth * (1.5 + multiplier), canvasHeight * -0.5, "image");
  D4_3 = new Component(250, 218, "D4.png", canvasWidth * (-0.5 + multiplier), canvasHeight * 1.5, "image");
  D4_4 = new Component(250, 218, "D4.png", canvasWidth * (1.5 + multiplier), canvasHeight * 1.5, "image");
  D4_5 = new Component(250, 218, "D4.png", canvasWidth * (1.5 + multiplier), canvasHeight * -0.5, "image");
  D4_6 = new Component(250, 218, "D4.png", canvasWidth * (1.5 + multiplier), canvasHeight * 1.5, "image");
  D4_7 = new Component(250, 218, "D4.png", canvasWidth * (0.5 + multiplier), canvasHeight * 1.5, "image");
  D4_8 = new Component(250, 218, "D4.png", canvasWidth * (1.5 + multiplier), canvasHeight * 1.5, "image");
  D4_9 = new Component(250, 218, "D4.png", canvasWidth * (-0.5 + multiplier), canvasHeight * 1.5, "image");
  
  multiplier = 1;
  D6_1 = new Component(250, 250, "D6.png", canvasWidth * (0.5 + multiplier), canvasHeight * 0.5, "image");
  D6_2 = new Component(250, 250, "D6.png", canvasWidth * (1.5 + multiplier), canvasHeight * -0.5, "image");
  D6_3 = new Component(250, 250, "D6.png", canvasWidth * (-0.5 + multiplier), canvasHeight * 1.5, "image");
  D6_4 = new Component(250, 250, "D6.png", canvasWidth * (1.5 + multiplier), canvasHeight * 1.5, "image");
  D6_5 = new Component(250, 250, "D6.png", canvasWidth * (1.5 + multiplier), canvasHeight * -0.5, "image");
  D6_6 = new Component(250, 250, "D6.png", canvasWidth * (1.5 + multiplier), canvasHeight * 1.5, "image");
  D6_7 = new Component(250, 250, "D6.png", canvasWidth * (0.5 + multiplier), canvasHeight * 1.5, "image");
  D6_8 = new Component(250, 250, "D6.png", canvasWidth * (1.5 + multiplier), canvasHeight * 1.5, "image");
  D6_9 = new Component(250, 250, "D6.png", canvasWidth * (-0.5 + multiplier), canvasHeight * 1.5, "image");
  
  multiplier = 2;
  D8_1 = new Component(250, 250, "D8.png", canvasWidth * (0.5 + multiplier), canvasHeight * 0.5, "image");
  D8_2 = new Component(250, 250, "D8.png", canvasWidth * (1.5 + multiplier), canvasHeight * -0.5, "image");
  D8_3 = new Component(250, 250, "D8.png", canvasWidth * (-0.5 + multiplier), canvasHeight * 1.5, "image");
  D8_4 = new Component(250, 250, "D8.png", canvasWidth * (1.5 + multiplier), canvasHeight * 1.5, "image");
  D8_5 = new Component(250, 250, "D8.png", canvasWidth * (1.5 + multiplier), canvasHeight * -0.5, "image");
  D8_6 = new Component(250, 250, "D8.png", canvasWidth * (1.5 + multiplier), canvasHeight * 1.5, "image");
  D8_7 = new Component(250, 250, "D8.png", canvasWidth * (0.5 + multiplier), canvasHeight * 1.5, "image");
  D8_8 = new Component(250, 250, "D8.png", canvasWidth * (1.5 + multiplier), canvasHeight * 1.5, "image");
  D8_9 = new Component(250, 250, "D8.png", canvasWidth * (-0.5 + multiplier), canvasHeight * 1.5, "image");
  
  multiplier = 3;
  D10_1 = new Component(250, 250, "D10.png", canvasWidth * (0.5 + multiplier), canvasHeight * 0.5, "image");
  D10_2 = new Component(250, 250, "D10.png", canvasWidth * (1.5 + multiplier), canvasHeight * -0.5, "image");
  D10_3 = new Component(250, 250, "D10.png", canvasWidth * (-0.5 + multiplier), canvasHeight * 1.5, "image");
  D10_4 = new Component(250, 250, "D10.png", canvasWidth * (1.5 + multiplier), canvasHeight * 1.5, "image");
  D10_5 = new Component(250, 250, "D10.png", canvasWidth * (1.5 + multiplier), canvasHeight * -0.5, "image");
  D10_6 = new Component(250, 250, "D10.png", canvasWidth * (1.5 + multiplier), canvasHeight * 1.5, "image");
  D10_7 = new Component(250, 250, "D10.png", canvasWidth * (0.5 + multiplier), canvasHeight * 1.5, "image");
  D10_8 = new Component(250, 250, "D10.png", canvasWidth * (1.5 + multiplier), canvasHeight * 1.5, "image");
  D10_9 = new Component(250, 250, "D10.png", canvasWidth * (-0.5 + multiplier), canvasHeight * 1.5, "image");
  multiplier = 4;
  D10_10 = new Component(250, 250, "D10.png", canvasWidth * multiplier + (canvasWidth * 2 / 3), canvasHeight * 0.5, "image");
  D10_11 = new Component(250, 250, "D10.png", canvasWidth * (1.5 + multiplier), canvasHeight * 1.5, "image");
  D10_12 = new Component(250, 250, "D10.png", canvasWidth * (1.5 + multiplier), canvasHeight * 1.5, "image");
  
  multiplier = 4;
  D00_1 = new Component(250, 250, "D00.png", canvasWidth * multiplier + (canvasWidth / 3), canvasHeight * 0.5, "image");
  D00_2 = new Component(250, 250, "D00.png", canvasWidth * (-0.5 + multiplier), canvasHeight * 1.5, "image");
  D00_3 = new Component(250, 250, "D00.png", canvasWidth * (-0.5 + multiplier), canvasHeight * 1.5, "image");
  
  multiplier = 5;
  D12_1 = new Component(250, 250, "D12.png", canvasWidth * (0.5 + multiplier), canvasHeight * 0.5, "image");
  D12_2 = new Component(250, 250, "D12.png", canvasWidth * (1.5 + multiplier), canvasHeight * -0.5, "image");
  D12_3 = new Component(250, 250, "D12.png", canvasWidth * (-0.5 + multiplier), canvasHeight * 1.5, "image");
  D12_4 = new Component(250, 250, "D12.png", canvasWidth * (1.5 + multiplier), canvasHeight * 1.5, "image");
  D12_5 = new Component(250, 250, "D12.png", canvasWidth * (1.5 + multiplier), canvasHeight * -0.5, "image");
  D12_6 = new Component(250, 250, "D12.png", canvasWidth * (1.5 + multiplier), canvasHeight * 1.5, "image");
  D12_7 = new Component(250, 250, "D12.png", canvasWidth * (0.5 + multiplier), canvasHeight * 1.5, "image");
  D12_8 = new Component(250, 250, "D12.png", canvasWidth * (1.5 + multiplier), canvasHeight * 1.5, "image");
  D12_9 = new Component(250, 250, "D12.png", canvasWidth * (-0.5 + multiplier), canvasHeight * 1.5, "image");
  
  multiplier = 6;
  D20_1 = new Component(250, 218, "D20.png", canvasWidth * (0.5 + multiplier), canvasHeight * 0.5, "image");
  D20_2 = new Component(250, 218, "D20.png", canvasWidth * (1.5 + multiplier), canvasHeight * -0.5, "image");
  D20_3 = new Component(250, 218, "D20.png", canvasWidth * (-0.5 + multiplier), canvasHeight * 1.5, "image");
  D20_4 = new Component(250, 218, "D20.png", canvasWidth * (1.5 + multiplier), canvasHeight * 1.5, "image");
  D20_5 = new Component(250, 218, "D20.png", canvasWidth * (1.5 + multiplier), canvasHeight * -0.5, "image");
  D20_6 = new Component(250, 218, "D20.png", canvasWidth * (1.5 + multiplier), canvasHeight * 1.5, "image");
  D20_7 = new Component(250, 218, "D20.png", canvasWidth * (0.5 + multiplier), canvasHeight * 1.5, "image");
  D20_8 = new Component(250, 218, "D20.png", canvasWidth * (1.5 + multiplier), canvasHeight * 1.5, "image");
  D20_9 = new Component(250, 218, "D20.png", canvasWidth * (-0.5 + multiplier), canvasHeight * 1.5, "image");
  
  diceBar = new Component(800, 62, "Dice Bar.png", 425, 625, "image");
  diceBall = new Component(37, 37, "Ball.png", 22, 375, "image");
  diceBarIcon = new Component(62, 62, "Dice Bar Icon.png", 425, 625, "image");
  numBar = new Component(62, 800, "Number Bar.png", 425, 500, "image");
  numBall = new Component(37, 37, "Ball.png", 22, 375, "image");
  numBarIcon = new Component(62, 62, "Number Sign.png", 425, 500, "image");
  muter = new Component(116, 130, "Sound.png", 370, 370, "image");
}
function createText() {
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
function startGame() {
  myGameArea.start();
}
function listenForControls() {
  myGameArea.canvas.addEventListener('mousemove', function (e) {
    cursor.x = (e.pageX - myGameArea.canvas.offsetLeft) * window.devicePixelRatio;
    cursor.y = (e.pageY - myGameArea.canvas.offsetTop) * window.devicePixelRatio;
  })
  myGameArea.canvas.addEventListener('mousedown', function (e) {
    mousePress = true;
    mousePressed = true;
  })
  myGameArea.canvas.addEventListener('mouseup', function (e) {
    mousePress = false;
    mouseRelease = true;
  })
  myGameArea.canvas.addEventListener('touchstart', function (e) {
    cursor.x = (e.touches[0].clientX - myGameArea.canvas.offsetLeft) * window.devicePixelRatio;
    cursor.y = (e.touches[0].clientY - myGameArea.canvas.offsetTop) * window.devicePixelRatio;
    mousePress = true;
    mousePressed = true;
    e.preventDefault();
  })
  myGameArea.canvas.addEventListener('touchmove', function (e) {
    cursor.x = (e.touches[0].clientX - myGameArea.canvas.offsetLeft) * window.devicePixelRatio;
    cursor.y = (e.touches[0].clientY - myGameArea.canvas.offsetTop) * window.devicePixelRatio;
    e.preventDefault();
  })
  myGameArea.canvas.addEventListener('touchend', function (e) {
    mousePress = false;
    mouseRelease = true;
    e.preventDefault();
  })
  myGameArea.canvas.addEventListener('touchcancel', function (e) {
    mousePressed = false;
    mousePress = false;
    mouseRelease = true;
  })
  window.addEventListener('keydown', function (e) {
    keysHeld[e.keyCode] = true;
    if (keysPressed[e.keyCode] != 2) {
      keysPressed[e.keyCode] = 1;
    }
  })
  window.addEventListener('keyup', function (e) {
    keysHeld[e.keyCode] = false;
    keysPressed[e.keyCode] = 0;
    keysReleased[e.keyCode] = true;
  })
}
function updateText() {
  for (var i = 0; i < textList.length; i++) {
    textList[i].vroom();
  }
  for (var i = 0; i < textList.length; i++) {
    textList[i].update();
  }
}
function updateSpritePos() {
  for (var i = 0; i < spriteList.length; i++) {
    spriteList[i].vroom();
  }
}
function drawSprites() {
  for (var i = 0; i < spriteList.length; i++) {
    spriteList[i].update();
  }
}
function mousePressOver(sprite) {
  if ((camera.mouseX >= sprite.x - sprite.width/2) && 
      (camera.mouseY >= sprite.y - sprite.height/2) && 
      (camera.mouseX <= sprite.x + sprite.width/2) && 
      (camera.mouseY <= sprite.y + sprite.height/2) && 
       mousePress) {
    return true;
  } else {
    return false;
  }
}
function mouseIsOver(sprite) {
  if ((camera.mouseX >= sprite.x - sprite.width/2) && 
      (camera.mouseY >= sprite.y - sprite.height/2) && 
      (camera.mouseX <= (sprite.x + sprite.width/2)) && 
      (camera.mouseY <= (sprite.y + sprite.height/2))) {
    return true;
  } else {
    return false;
  }
}
function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}
function resetPressedKeys() {
  for (var i = 0; i < keysPressed.length; i++) {
    if (keysPressed[i] == 1) {
      keysPressed[i] = 2;
    }
  }
}
function resetReleasedKeys() {
  for (var i = 0; i < keysReleased.length; i++) {
    if (keysReleased[i] == true) {
      keysReleased[i] = false;
    }
  }
}
function resetMouseClick() {
  mousePressed = false;
  mouseRelease = false;
}
function Sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = "./media/" + src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function(){
    this.sound.play();
  }
  this.stop = function(){
    this.sound.pause();
  }
}
function updateCanvasSize() {
  if (previousWidth != window.innerWidth * window.devicePixelRatio || 
      previousHeight != window.innerHeight * window.devicePixelRatio) {
    myGameArea.canvas.width = 1000;
    myGameArea.canvas.height = 1000;
    myGameArea.canvas.width = window.innerWidth * window.devicePixelRatio;
    myGameArea.canvas.height = window.innerHeight * window.devicePixelRatio;
    canvasWidth = myGameArea.canvas.width;
    canvasHeight = myGameArea.canvas.height;
    camera.x = (camera.x / previousWidth) * canvasWidth;
    camera.y = canvasHeight / 2;
    startCam.x = canvasWidth / 2;
    startCam.y = canvasHeight / 2;
    intendedSinglePositions(4);
    intendedSinglePositions(6);
    intendedSinglePositions(8);
    intendedSinglePositions(10);
    intendedD00Positions();
    intendedSinglePositions(12);
    intendedSinglePositions(20);
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
  previousWidth = window.innerWidth * window.devicePixelRatio;
  previousHeight = window.innerHeight * window.devicePixelRatio;
}
