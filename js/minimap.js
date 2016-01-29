var screenRatio = Math.round(document.documentElement.clientHeight + document.documentElement.clientWidth); //would like to use this eventually to be able to have a dynamic minimap scale. Can figure out in the futur.
var minimap = {
	x : Math.round(document.documentElement.clientWidth * 0.10),
	y : Math.round(document.documentElement.clientWidth * 0.10),
	r : Math.round(document.documentElement.clientWidth * 0.07),
	scale : 5.5,
	draw : function (ctx) {
		'use strict';
        //draws map in minimap
		for (var i in entities) {
			entities[i].drawMinimap(ctx);
		}
        
        // Fill
		ctx.fillStyle = "#EEEECC";
		ctx.fill();

		// Outline
		ctx.beginPath();
		ctx.lineWidth = Math.round(document.documentElement.clientWidth * .005);
		ctx.arc(this.x, this.y, this.r+ctx.lineWidth/2, 0, 2*Math.PI);
		ctx.strokeStyle = "#000000";
		ctx.stroke();
	}
}
