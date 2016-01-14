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

}

class Player extends Sprite {
	constructor(img,x,y) {
		super(img,x,y);
		this.speed = 3;
		this.keysDown = {};
		this.viewDist = 10;
		this.visibleObjs = [];
	}

	getVisibleObjs() {
		
	}

	move(ctx) {
		/*--W--*/
		if ( 87 in this.keysDown ) {
			for (var i in entities) { entities[i].y+=this.speed }
			this.y-=this.speed;
		};
		/*--A--*/
		if ( 65 in this.keysDown ) {
			for (var i in entities) { entities[i].x+=this.speed }
			this.x-=this.speed;
		};
		/*--S--*/
		if ( 83 in this.keysDown ) {
			for (var i in entities) { entities[i].y-=this.speed }
			this.y+=this.speed;
		};
		/*--D--*/
		if ( 68 in this.keysDown ) {
			for (var i in entities) { entities[i].x-=this.speed }
			this.x+=this.speed;
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
