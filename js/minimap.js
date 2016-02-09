var minimap = {
	x : 250,
	y : 150,
	r : 110,
	scale : 10,
	draw : function(ctx) {
		// Fill
		ctx.beginPath();
		ctx.lineWidth = 12;
		ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI);
		ctx.fillStyle = "#EEEECC";
		ctx.fill();
        
        for (var i in entities) {
			entities[i].drawMinimap(ctx);
		}

		// Outline
		ctx.beginPath();
		ctx.lineWidth = 10;
		ctx.arc(this.x, this.y, this.r+ctx.lineWidth/2, 0, 2*Math.PI);
		ctx.strokeStyle = "#000000";
		ctx.stroke();
	}
}
