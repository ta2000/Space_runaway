"use strict";

var entities = {};

class View {
	constructor() {
		this.x = 0;
		this.y = 0;
	}

	setFollowing( following ) {
		this.following = following;
		this.distX = this.x - following.x;
		this.distY = this.y - following.y;
	}

	setPos() {
		if (this.following!=undefined) {
			this.x = this.following.x + this.distX;
			this.y = this.following.y + this.distY;
		}
	}

	clearScreen( ctx ) {
		ctx.clearRect(this.x, this.y, Game.canvas.width, Game.canvas.height);
	}
}

class Sprite {
	constructor(img,x,y) {
		this.image = new Image();
		this.image.src = img;
		this.x = x;
		this.y = y;
	}

	draw( ctx ) {
		if (this.image.src!="") {
			ctx.drawImage(this.image, this.x, this.y);
		};
	}

	collision( obj ) {
		collided = false;
		// Working collision detection code
		return collided;
	}

}

class Player extends Sprite {
	constructor(img,x,y) {
		super(img,x,y);
		this.speed = 3;
		this.keysDown = {};
		this.viewDist = 10;
	}

	move(ctx) {
		/*--W--*/
		if ( 87 in this.keysDown ) {
			ctx.translate(0, this.speed);
			this.y-=this.speed;
		};
		/*--A--*/
		if ( 65 in this.keysDown ) {
			ctx.translate(this.speed, 0);
			this.x-=this.speed;
		};
		/*--S--*/
		if ( 83 in this.keysDown ) {
			ctx.translate(0, 0-this.speed);
			this.y+=this.speed;
		};
		/*--D--*/
		if ( 68 in this.keysDown ) {
			ctx.translate(0-this.speed, 0);
			this.x+=this.speed;
		};
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
	}
}

class Portal extends Sprite {
	constructor(img,x,y) {
		super(img,x,y);
	}
}
