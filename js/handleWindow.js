window.onresize = function () {
    //change the size of the canvas if it isn't equal to the client's size
    var width = window.innerWidth;
    var height = window.innerHeight;
    if (window.innerWidth !== width || window.innerHeight !== height) {
        canvasNode.width = width;
        canvasNode.height = height;
    }
};