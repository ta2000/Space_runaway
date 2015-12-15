"use strict";

var entities = {};

class Sprite {
	// Add depth property to Sprite class? (to draw sprites in proper order) (ur welcome Nes lol)
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

// Check out inheritance link on trello if you don't understand this
class Player extends Sprite {
	constructor(img,x,y) {
		super(img,x,y);
		this.speed = 3;
		this.keysDown = {};
		this.viewDist = 10;
	}

	var playerNum = entityCount(entities, Player);

	move(ctx) {
		/*--W--*/
		if ( 87 in this.keysDown ) {
			ctx.translate(0, this.speed/playerNum);
			this.y-=this.speed;
		};
		/*--A--*/
		if ( 65 in this.keysDown ) {
			ctx.translate(this.speed/playerNum, 0);
			this.x-=this.speed;
		};
		/*--S--*/
		if ( 83 in this.keysDown ) {
			ctx.translate(0, 0-this.speed/playerNum);
			this.y+=this.speed;
		};
		/*--D--*/
		if ( 68 in this.keysDown ) {
			ctx.translate(0-this.speed/playerNum, 0);
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
