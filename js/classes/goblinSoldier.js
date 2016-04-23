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

		// Delete carpets if collision
		for (var i = 0; i < Game.player.carpets.length; i++) {
			if (this.collision(Game.player.carpets[i])) {
				Game.player.carpets.splice(i, 1);
			}
		}

		if (this.distance(Game.player) > 200) {
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

			if (Game.player.carpets[0] != null) {
				this.currentSteps++;
				this.angle = Math.atan2(
					Game.player.carpets[0].y - this.y,
					Game.player.carpets[0].x - this.x
				)
			}
		}

		// Collisions
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
			this.angle += 3.14;
			this.x += Math.cos(this.angle)*(this.speed*modifier);
			this.y += Math.sin(this.angle)*(this.speed*modifier);
		}
	}
}
Game.GoblinSoldier = GoblinSoldier;
