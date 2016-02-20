HTMLCanvasElement.onresize = function () {
    //change the size of the canvas if it isn't equal to the client's size
    var height = window.innerHeight;
    var width = window.innerWidth;
    if (HTMLCanvasElement.innerWidth !== width || HTMLCanvasElement.innerHeight !== height) {
        canvasNode.width = width;
        canvasNode.height = height;
    }
};