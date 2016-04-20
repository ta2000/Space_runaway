"use strict";

class LevelExit extends Sprite {
	constructor(img,x,y) {
		super(img,x,y);
		this.triggered = false;
		this.solid = false;
	}

	update() {
		if (this.collision(Game.player) && !this.triggered) {
			console.log(this);
			Game.loadLevel(this.levelToLoad, this.x+this.image.width, this.y+this.image.height);
			this.triggered = true;
		}
	}
}
Game.LevelExit = LevelExit;
