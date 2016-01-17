"use strict";

var entities = {};

class Sprite {
	constructor(img,x,y) {
		this.image = new Image();
		this.image.src = img;
		this.x = x;
		this.y = y;
		this.solid = false;
	}

	draw( ctx ) {
		ctx.drawImage(this.image, this.x, this.y);
	}

	drawMinimap( ctx ) {
		// Draw onto minimap
		var xDist = this.x - entities.player.x;
		var yDist = this.y - entities.player.y;

		if (this.color!==undefined) {
			ctx.fillStyle = this.color;
		} else { ctx.fillStyle = "black"; }

		if (this.primitiveDistance(minimap.x+xDist/5, minimap.y+yDist/5, minimap.x, minimap.y) <= minimap.r*2.1) {
			ctx.fillRect(minimap.x+xDist/10, minimap.y+yDist/10, 3.2, 3.2);
		}
	}

	collision( obj ) {
		var collided = false;

		if (this.x < obj.x + obj.image.width &&
			this.x + this.image.width > obj.x &&
			this.y < obj.y + obj.image.height &&
			this.image.height + this.y > obj.y) {
			collided = true;
		}

		return collided;
	}

	distance( obj ) {
		var dx 	= Math.abs(this.x - obj.x)
		var dy 	= Math.abs(this.y - obj.y);
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

class Player extends Sprite {
	constructor(img,x,y) {
		super(img,x,y);
		this.speed = 3;
		this.keysDown = {};
		this.direction = 90;
		this.viewDist = 160;
		this.visibleObjs = [];
	}

	move(ctx) {
		/*--W--*/
		if ( 87 in this.keysDown ) {
			for (var i in entities) { entities[i].y+=this.speed }
			this.y-=this.speed;
			this.direction = 360;
		};
		/*--A--*/
		if ( 65 in this.keysDown ) {
			for (var i in entities) { entities[i].x+=this.speed }
			this.x-=this.speed;
			this.direction = 270;
		};
		/*--S--*/
		if ( 83 in this.keysDown ) {
			for (var i in entities) { entities[i].y-=this.speed }
			this.y+=this.speed;
			this.direction = 180;
		};
		/*--D--*/
		if ( 68 in this.keysDown ) {
			for (var i in entities) { entities[i].x-=this.speed }
			this.x+=this.speed;
			this.direction = 90;
		};

		// Collision
		for (var i in entities) {
			if (entities[i].solid==true) {
				if (this.collision(entities[i])) {
					if ( 87 in this.keysDown ) {
						for (var i in entities) { entities[i].y-=this.speed; }
						this.y+=this.speed;
					};
					if ( 65 in this.keysDown ) {
						for (var i in entities) { entities[i].x-=this.speed; }
						this.x+=this.speed;
					};
					if ( 83 in this.keysDown ) {
						for (var i in entities) { entities[i].y+=this.speed; }
						this.y-=this.speed;
					};
					if ( 68 in this.keysDown ) {
						for (var i in entities) { entities[i].x+=this.speed; }
						this.x-=this.speed;
					};
				};
			};
		}
	}

}

class Goblin extends Sprite {
	constructor(img,x,y) {
		super(img,x,y);
		this.speed = 1.5;
		this.viewDist = 10;
	}
}

class Wall extends Sprite {
	constructor(img,x,y) {
		super(img,x,y);
		this.solid = true;
	}
}

class Portal extends Sprite {
	constructor(img,x,y) {
		super(img,x,y);
	}
}
