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
		ctx.drawImage(this.image, this.x, this.y);
	}

	collision( obj ) {
		var collided = false;
		if ( ((this.y > obj.y) && (this.y < obj.y+obj.image.height)) && (this.x < obj.x + obj.image.width) ) {	collided = true;	}
		if ( ((this.y > obj.y) && (this.y < obj.y+obj.image.height)) && (this.x > obj.x) ) {					collided = true;	}
		if ( ((this.x > obj.x) && (this.x < obj.x+obj.image.width)) && (this.y < obj.y) ) {						collided = true;	}
		if ( ((this.x > obj.x) && (this.x < obj.x+obj.image.width)) && (this.y > obj.y + obj.image.height) ) {	collided = true;	}
		if (obj==this) {	collided=false;	}
		return collided;
	}

}

// Check out inheritance link on trello if you don't understand this
class Player extends Sprite {
	constructor(img,x,y,speed) {
		super(img,x,y);
		this.speed = speed/10;
		this.keysDown = {};
		this.viewDist = 10;
	}

	move() {
		var canmove = true;
		for (var i in entities) {
			if (this.collision(entities[i])) { canmove=false }
		}
		if (canmove) {
			/*--W--*/
			if ( 87 in this.keysDown ) {
				this.y -= this.speed;
			};
			/*--A--*/
			if ( 65 in this.keysDown ) {
				this.x -= this.speed;
			};
			/*--S--*/
			if ( 83 in this.keysDown ) {
				this.y += this.speed;
			};
			/*--D--*/
			if ( 68 in this.keysDown ) {
				this.x += this.speed;
			};
		}
	}

}

class Goblin extends Sprite {
	constructor(img,x,y,speed) {
		super(img,x,y);
		this.speed = speed/10;
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
