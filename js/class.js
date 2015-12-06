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

	draw() {
		ctx.drawImage(this.image, this.x, this.y);
	}

	collision( obj ) {
		// Haven't tested, probably won't work
		// Checks hitboxes rather than distance like in PQ
		collided = false;
		if ( (obj.x < (this.x+this.image.width)) && (obj.y < (this.y+this.image.height)) ) {
			collided = true;
		}
		if ( (this.x < (obj.x+obj.image.width)) && (this.y < (obj.y+obj.image.height)) ) {
			collided = true;
		}
		return collided;
	}

	// Needed functions
	/*
	rotate(){}
	
	*/
}

// Check out inheritance link on trello if you don't understand this
class Player extends Sprite {
	constructor(img,x,y,speed) {
		super(img,x,y);
		this.speed = speed;
		this.keysDown = {};
		// Continue adding player traits here
		/*
		this.viewDist
		this.ability
		this.
		*/
	}

	// Put key handling here?
	// Use ctx translate if >one screen levels
}

// Classes to add
/*
	-Space Goblin
	-

*/
