"use strict";

class Player extends Sprite {
	constructor(img,x,y) {
		super(img,x,y);
		this.speed = 250;
		this.energy = 100;
		this.keysDown = {};
		this.direction = 90;
	}

	update(ctx, modifier) {
		if ( 87 in this.keysDown || 65 in this.keysDown || 83 in this.keysDown || 68 in this.keysDown) {
			if (document.getElementsByClassName('popup')[0]!==undefined) {
				document.body.removeChild(document.getElementsByClassName('popup')[0]);
			}
		}
		/*--W--*/
		if ( 87 in this.keysDown ) {
			for (var i in entities) {
				for (var j in entities[i]) { entities[i][j].y+=(this.speed*modifier); }
			}
		};
		/*--A--*/
		if ( 65 in this.keysDown ) {
			for (var i in entities) {
				for (var j in entities[i]) { entities[i][j].x+=(this.speed*modifier); }
			}
		};
		/*--S--*/
		if ( 83 in this.keysDown ) {
			for (var i in entities) {
				for (var j in entities[i]) { entities[i][j].y-=(this.speed*modifier); }
			}
		};
		/*--D--*/
		if ( 68 in this.keysDown ) {
			for (var i in entities) {
				for (var j in entities[i]) { entities[i][j].x-=(this.speed*modifier); }
			}
		};

		// Collision
		for (var i in entities) {
			for (var j in entities[i]) {
				// Check for solid object collision
				if (entities[i][j].solid==true) {
					if (this.collision(entities[i][j])) {
						if ( 87 in this.keysDown ) {
							for (var k in entities) {
								for (var n in entities[k]) {
										entities[k][n].y-=(this.speed*modifier);
								}
							}
						}
						if ( 65 in this.keysDown ) {
							for (var k in entities) {
								for (var n in entities[k]) {
										entities[k][n].x-=(this.speed*modifier);
								}
							}
						}
						if ( 83 in this.keysDown ) {
							for (var k in entities) {
								for (var n in entities[k]) {
										entities[k][n].y+=(this.speed*modifier);
								}
							}
						}
						if ( 68 in this.keysDown ) {
							for (var k in entities) {
								for (var n in entities[k]) {
										entities[k][n].x+=(this.speed*modifier);
								}
							}
						}
						// Check for goblin soldier collision
						if (entities[i][j].constructor == GoblinSoldier)
						{
							this.energy-=0.3; // Deplete energy
						}
					}
				}
			}
		}

	}

	drawEnergy(ctx)
	{
		// Hud
		ctx.fillStyle = "black";
		ctx.globalAlpha = .5;
		ctx.fillRect(20, Game.canvas.height-150, 400, 110);
		ctx.globalAlpha = 1;
		ctx.font = "24px Garamond";
		// Energy
		ctx.fillStyle = "lime";
		ctx.fillText("Energy:", 24, Game.canvas.height-120);
		if (this.energy>0) {
			ctx.fillRect(24, Game.canvas.height-100, this.energy*3.8, 40);
		};
	}
}
Game.Player = Player;
