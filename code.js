function init() {
    canvas = document.getElementById("theCanvas");
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
    canvasW = canvas.width;
    canvasH = canvas.height;

    if (canvas.getContext) {
        setInterval(run , 33);
    }
}