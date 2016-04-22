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
				switch (this.direction) {
					case "left":
						Game.loadLevel(this.levelToLoad, this.x-Game.scale, this.y, this.id);
						break;
					case "right":
						Game.loadLevel(this.levelToLoad, this.x+Game.scale, this.y, this.id);
						break;
					case "up":
						Game.loadLevel(this.levelToLoad, this.x, this.y-Game.scale, this.id);
						break;
					case "down":
						Game.loadLevel(this.levelToLoad, this.x, this.y+Game.scale, this.id);
						break;
					default:
						console.error("Could not load level: direction unspecified.");
				}
				this.triggered = true;
			}
		}
	}
}
Game.LevelExit = LevelExit;
