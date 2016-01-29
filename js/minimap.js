var minimap = {
	x : Math.round(document.documentElement.clientWidth * .10),
	y : Math.round(document.documentElement.clientWidth * .10),
	r : Math.round(document.documentElement.clientWidth * .07),
	scale : 5.5,
	draw : function(ctx) {
		// Fill
		ctx.fillStyle = "#EEEECC";
		ctx.fill();
        
        //draws map in minimap
		for (var i in entities) {
			entities[i].drawMinimap(ctx);
		}

		// Outline
		ctx.beginPath();
		ctx.lineWidth = Math.round(document.documentElement.clientWidth * .005);
		ctx.arc(this.x, this.y, this.r+ctx.lineWidth/2, 0, 2*Math.PI);
		ctx.strokeStyle = "#000000";
		ctx.stroke();
	}
}
