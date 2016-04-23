var minimap = {
	x : 250,
	y : 150,
	r : 110,
	scale : 10,
	lineWidth : 10,
	draw : function(ctx) {
		// Fill
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI);
		ctx.fillStyle = "#EEEECC";
		ctx.fill();

        for (var i in entities) {
        	for (var j in entities[i]) {
				entities[i][j].drawMinimap(ctx);
			}
		}
		Game.player.drawMinimap(ctx);

		// Outline
		ctx.beginPath();
		ctx.lineWidth = this.lineWidth;
		ctx.arc(this.x, this.y, this.r+ctx.lineWidth/2, 0, 2*Math.PI);
		ctx.strokeStyle = "#000000";
		ctx.stroke();
	}
}
