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
		collided = false;
		// Working collision detection code
		return collided;
	}

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

	// Put key handling here
}

// Classes to add
/*
	-Space Goblin
	-

*/
