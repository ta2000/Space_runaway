"use strict";

class LevelExit extends Sprite {
	constructor(img,x,y) {
		super(img,x,y);
		this.triggered = false;
		this.solid = false;
	}

	update() {
		if (this.collision(Game.player) && !this.triggered) {
			if (Game.loadedLevels.indexOf(this.levelToLoad) == -1) {
				console.log(this);
				Game.loadLevel(this.levelToLoad, this.x, this.y, this.id);
				this.triggered = true;
			}
		}
	}
}
Game.LevelExit = LevelExit;
