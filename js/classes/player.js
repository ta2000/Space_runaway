"use strict";

class Player extends Sprite {
	constructor(img,x,y) {
		super(img,x,y);
		this.speed = 5;
		this.energy = 100;
		this.keysDown = {};
		this.direction = 90;
	}

	move(ctx) {
		if ( 87 in this.keysDown || 65 in this.keysDown || 83 in this.keysDown || 68 in this.keysDown) {
			if (document.getElementsByClassName('popup')[0]!==undefined) {
				document.body.removeChild(document.getElementsByClassName('popup')[0]);
			}
		}
		/*--W--*/
		if ( 87 in this.keysDown ) {
			for (var i in entities) { entities[i].y+=this.speed }
			this.y-=this.speed;
			this.direction = 360;
		};
		/*--A--*/
		if ( 65 in this.keysDown ) {
			for (var i in entities) { entities[i].x+=this.speed }
			this.x-=this.speed;
			this.direction = 270;
		};
		/*--S--*/
		if ( 83 in this.keysDown ) {
			for (var i in entities) { entities[i].y-=this.speed }
			this.y+=this.speed;
			this.direction = 180;
		};
		/*--D--*/
		if ( 68 in this.keysDown ) {
			for (var i in entities) { entities[i].x-=this.speed }
			this.x+=this.speed;
			this.direction = 90;
		};

		// Collision
		for (var i in entities) {
			// Check for goblin soldier collision
			if (this.collision(entities[i]) && entities[i].constructor == GoblinSoldier)
			{
				this.energy--; // Deplete energy
			}
			// Check for solid object collision
			if (entities[i].solid==true) {
				if (this.collision(entities[i])) {
					if ( 87 in this.keysDown ) {
						for (var i in entities) { entities[i].y-=this.speed; }
						this.y+=this.speed;
					};
					if ( 65 in this.keysDown ) {
						for (var i in entities) { entities[i].x-=this.speed; }
						this.x+=this.speed;
					};
					if ( 83 in this.keysDown ) {
						for (var i in entities) { entities[i].y+=this.speed; }
						this.y-=this.speed;
					};
					if ( 68 in this.keysDown ) {
						for (var i in entities) { entities[i].x+=this.speed; }
						this.x-=this.speed;
					};
				};
			};
		}
		
		// Regenerate energy
		if (this.energy < 100)
		{
			this.energy+=0.02;
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
