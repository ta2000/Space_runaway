"use strict";

var entities = {};

class Sprite {
	constructor(img,x,y) {
		this.image = new Image();
		this.image.src = img;
		this.x = x;
		this.y = y;
		this.alpha = 0;
		this.solid = false;
	}

	draw( ctx ) {
		ctx.globalAlpha = this.alpha;
		ctx.drawImage(this.image, this.x, this.y);
		ctx.globalAlpha = 1;
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

	getVisibleObjs() {
		this.visibleObjs = [];
		this.visibleObjs.push(this);
		for (var i in entities) {
			if (this.distance(entities[i]) <= this.viewDist) {
				if (entities[i].alpha < 1) { entities[i].alpha+=0.08; };

				this.visibleObjs.push(entities[i]);
			} else {
				if (entities[i].alpha > 0) {
					entities[i].alpha -= 0.08;
					if (entities[i].alpha < 0) {
						entities[i].alpha = 0;
					}
				}
			}
		}
	}

	move(ctx) {
		this.getVisibleObjs();
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
