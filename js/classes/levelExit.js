"use strict";

class LevelExit extends Sprite {
	constructor(img,x,y) {
		super(img,x,y);
		this.hidden = true;
		this.solid = false;
	}

	update(modifier) {
		if (this.distance(Game.player) < Game.canvas.width) {
			// Determine if the level is loaded
			var levelLoaded = false;
			for (var i in entities) {
				if (i == this.levelToLoad) {
					levelLoaded = true;
				}
			}
			// If the level is not loaded, call loadLevel
			if (!levelLoaded) {
				switch (this.direction) {
					case "left":
						this.levelLoadOpX = function () {
							return this.x - Game.scale;
						};
						this.levelLoadOpY = function () {
							return this.y;
						};
						Game.loadLevel(this.levelToLoad, this);
						break;
					case "right":
						this.levelLoadOpX = function () {
							return this.x + Game.scale;
						};
						this.levelLoadOpY = function () {
							return this.y;
						};
						Game.loadLevel(this.levelToLoad, this);
						break;
					case "up":
						this.levelLoadOpX = function () {
							return this.x;
						};
						this.levelLoadOpY = function () {
							return this.y - Game.scale;
						};
						Game.loadLevel(this.levelToLoad, this);
						break;
					case "down":
						this.levelLoadOpX = function () {
							return this.x;
						};
						this.levelLoadOpY = function () {
							return this.y + Game.scale;
						};
						Game.loadLevel(this.levelToLoad, this);
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
