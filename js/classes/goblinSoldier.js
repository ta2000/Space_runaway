"use strict";

class GoblinSoldier extends NPC {
	constructor(img,x,y) {
		super(img,x,y);
		this.angle = Math.random()*6.28;
		this.currentSteps = Math.floor(Math.random()*200)+200;
		this.waitTime = 20;
	}

	update(modifier) {
		NPC.prototype.update.call(this, modifier);

		var collision = false;
		for (var i in entities) {
			for (var j in entities[i]) {
				if (this.collision(entities[i][j]) && entities[i][j] != this) {
					collision = true;
				}
				if (this.collision(Game.player)) {
					collision = true;
				}
			}
		}
		if (collision) {
			this.angle += 4.71;
		}

		if (this.currentSteps > 0 && this.waitTime > 0) {
			this.waitTime--;
		}
		if (this.currentSteps > 0 && this.waitTime <= 0) {
			this.x += Math.cos(this.angle)*(this.speed*modifier);
			this.y += Math.sin(this.angle)*(this.speed*modifier);
			this.currentSteps--;
		} else {
			if (this.waitTime > 0) {
				this.angle = Math.random()*6.28;
				this.currentSteps = Math.floor(Math.random()*40)+40;
			} else {
				this.waitTime = Math.floor(Math.random()*40)+40;
			}
		}
	}
}
Game.GoblinSoldier = GoblinSoldier;
