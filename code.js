var canvas = document.getElementById("theCanvas");
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;
var ctx = canvas.getContext("2d");
function init() {
    if (canvas.getContext) {
        setInterval(gameLoop(), 10);
    }
}