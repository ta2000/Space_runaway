"use strict";

class LevelExit extends Sprite {
	constructor(img,x,y) {
		super(img,x,y);
		this.solid = false;
	}

	update() {
		if (this.collision(Game.player)) {
			// Determine if the level is loaded
			var levelLoaded = false;
			for (var i in entities) {
				if (i == this.levelToLoad) {
					levelLoaded = true;
				}
			}
			// If the level is not loaded, call loadLevel
			if (!levelLoaded) {
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
