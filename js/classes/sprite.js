"use strict";

class Sprite {
	constructor(img,x,y) {
		this.image = new Image();
		this.image.src = img;
		this.image.readyToDraw = false;
		this.image.onload = function (event) {
			this.image.readyToDraw = true;
		}.bind(this);
		this.x = x;
		this.y = y;
		this.solid = true;
	}

	draw( ctx ) {
		if (this.image.readyToDraw === true) {
			ctx.drawImage(this.image, this.x, this.y);
		}
	}

	drawMinimap( ctx ) {
		// Draw onto minimap
		var xDist = this.x - entities.player.x;
		var yDist = this.y - entities.player.y;

        if (this.color!==undefined) {
			ctx.fillStyle = this.color;
		} else { ctx.fillStyle = "black"; }

		if (this.primitiveDistance(minimap.x+xDist/5, minimap.y+yDist/5, minimap.x, minimap.y) <= minimap.r*2.1) {
			ctx.fillRect(minimap.x+xDist/minimap.scale, minimap.y+yDist/minimap.scale, Game.scale/minimap.scale, Game.scale/minimap.scale);
		}
	}

	collision( obj ) {
		var collided = false;

		if (this!=obj) {
			if (this.x < obj.x + obj.image.width &&
				this.x + this.image.width > obj.x &&
				this.y < obj.y + obj.image.height &&
				this.image.height + this.y > obj.y) {
				collided = true;
			}
		}

		return collided;
	}

	distance( obj ) {
		var dx 	= Math.abs((this.x+this.image.width/2) - (obj.x+obj.image.width/2))
		var dy 	= Math.abs((this.y+this.image.height/2) - (obj.y+obj.image.height/2));
		var hyp	= Math.sqrt( (dx*dx)+(dy*dy) );

		return hyp;
	}

	primitiveDistance( x1, y1, x2, y2 ) {
		var dx 	= Math.abs(x1 - x2)
		var dy 	= Math.abs(y1 - y2);
		var hyp	= Math.sqrt( (dx*dx)+(dy*dy) );

		return hyp;
	}

}
Game.Sprite = Sprite;
