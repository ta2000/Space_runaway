"use strict";

class Player extends Sprite {
	constructor(img,x,y) {
		super(img,x,y);
		this.speed = 250;
		this.energy = 100;
		this.keysDown = {};
		this.carpets = [];
		this.imgIndex = 0;
	}

	draw(ctx)
	{
		Sprite.prototype.draw.call(this, ctx);
		for (var i=0; i<this.carpets.length; i++)
		{
			this.carpets[i].draw(ctx);
		}
	}

	spawnCarpet()
	{
		if(Game.mouse.click == true)
		{
			this.carpets.push(new Carpet("images/sprites/carpet1.png", this.x, this.y, 550));
		}
	}

	update(modifier) {
		if (Object.keys(this.keysDown).length === 0) {
			this.imgIndex = 0;
		} else {
			this.imgIndex++;
			if (this.imgIndex == 7) {
				this.imgIndex = 0;
			}
		}
		this.image.src = "http://ta2000.github.io/Game/images/sprites/player/player" + this.imgIndex + ".png"

		// Update all carpets
		for (var i=0; i<this.carpets.length; i++)
		{
			this.carpets[i].update(modifier);
			if (this.carpets[i].lifeSpan <= 0)
			{
				this.carpets.splice(i, 1);
			}
		}

		// Changes to the game over screen when the player's energy reaches zero
		if( this.energy <= 0) {
			window.location.href = 'gameOver.html';
		}

		// Remove popup
		if ( 87 in this.keysDown || 65 in this.keysDown || 83 in this.keysDown || 68 in this.keysDown) {
			if (document.getElementsByClassName('popup')[0]!==undefined) {
				document.body.removeChild(document.getElementsByClassName('popup')[0]);
			}
		}
		/*--W--*/
		if ( 87 in this.keysDown ) {
			for (var i in backgroundTiles) { // Move background tiles
				backgroundTiles[i].y+=(this.speed*modifier);
				if (backgroundTiles[i].y > Game.canvas.height) {
					backgroundTiles[i].y -= (Game.canvas.height+backgroundTiles[i].image.height);
				}
			}
			for (var i in entities) { // Move entities
				for (var j in entities[i]) { entities[i][j].y+=(this.speed*modifier); }
			}
			for (var i=0; i<this.carpets.length; i++) { // Move carpets
				this.carpets[i].y+=(this.speed*modifier);
				this.carpets[i].targetY+=(this.speed*modifier);
			}
		};
		/*--A--*/
		if ( 65 in this.keysDown ) {
			for (var i in backgroundTiles) { // Move background tiles
				backgroundTiles[i].x+=(this.speed*modifier);
				if (backgroundTiles[i].x > Game.canvas.width) {
					backgroundTiles[i].x -= (Game.canvas.width+backgroundTiles[i].image.height);
				}
			}
			for (var i in entities) { // Move entities
				for (var j in entities[i]) { entities[i][j].x+=(this.speed*modifier); }
			}
			for (var i=0; i<this.carpets.length; i++) { // Move carpets
				this.carpets[i].x+=(this.speed*modifier);
				this.carpets[i].targetX+=(this.speed*modifier);
			}
		};
		/*--S--*/
		if ( 83 in this.keysDown ) {
			for (var i in backgroundTiles) { // Move background tiles
				backgroundTiles[i].y-=(this.speed*modifier);
				if (backgroundTiles[i].y+backgroundTiles[i].image.height < 0) {
					backgroundTiles[i].y += (Game.canvas.height+backgroundTiles[i].image.height);
				}
			}
			for (var i in entities) { // Move entities
				for (var j in entities[i]) { entities[i][j].y-=(this.speed*modifier); }
			}
			for (var i=0; i<this.carpets.length; i++) { // Move carpets
				this.carpets[i].y-=(this.speed*modifier);
				this.carpets[i].targetY-=(this.speed*modifier);
			}
		};
		/*--D--*/
		if ( 68 in this.keysDown ) {
			for (var i in backgroundTiles) { // Move background tiles
				backgroundTiles[i].x-=(this.speed*modifier);
				if (backgroundTiles[i].x+backgroundTiles[i].image.height < 0) {
					backgroundTiles[i].x += (Game.canvas.width+backgroundTiles[i].image.width);
				}
			}
			for (var i in entities) { // Move entities
				for (var j in entities[i]) { entities[i][j].x-=(this.speed*modifier); }
			}
			for (var i=0; i<this.carpets.length; i++) { // Move carpets
				this.carpets[i].x-=(this.speed*modifier);
				this.carpets[i].targetX-=(this.speed*modifier);
			}
		};

		// Collision
		var collision = false;
		for (var i in entities) {
			for (var j in entities[i]) {
				// Check for solid object collision
				if (entities[i][j].solid==true) {
					if (this.collision(entities[i][j])) {
						collision = true;
						// Check for goblin soldier collision
						if (entities[i][j].constructor == GoblinSoldier)
						{
							this.energy-=0.3; // Deplete energy
						}
					}
				}
			}
		}
		if (collision) {
			if ( 87 in this.keysDown ) {
				for (var i in backgroundTiles) { // Move background tiles
					backgroundTiles[i].y-=(this.speed*modifier);
				}
				for (var k in entities) { // Move entities
					for (var n in entities[k]) { entities[k][n].y-=(this.speed*modifier); }
				}
				for (var k=0; k<this.carpets.length; k++) { // Move carpets
					this.carpets[k].y-=(this.speed*modifier);
					this.carpets[k].targetY-=(this.speed*modifier);
				}
			}
			if ( 65 in this.keysDown ) {
				for (var i in backgroundTiles) { // Move background tiles
					backgroundTiles[i].x-=(this.speed*modifier);
				}
				for (var k in entities) { // Move entities
					for (var n in entities[k]) { entities[k][n].x-=(this.speed*modifier); }
				}
				for (var k=0; k<this.carpets.length; k++) { // Move carpets
					this.carpets[k].x-=(this.speed*modifier);
					this.carpets[k].targetX-=(this.speed*modifier);
				}
			}
			if ( 83 in this.keysDown ) {
				for (var i in backgroundTiles) { // Move background tiles
					backgroundTiles[i].y+=(this.speed*modifier);
				}
				for (var k in entities) { // Move entities
					for (var n in entities[k]) { entities[k][n].y+=(this.speed*modifier); }
				}
				for (var k=0; k<this.carpets.length; k++) { // Move carpets
					this.carpets[k].y+=(this.speed*modifier);
					this.carpets[k].targetY+=(this.speed*modifier);
				}
			}
			if ( 68 in this.keysDown ) {
				for (var i in backgroundTiles) { // Move background tiles
					backgroundTiles[i].x+=(this.speed*modifier);
				}
				for (var k in entities) { // Move entities
					for (var n in entities[k]) { entities[k][n].x+=(this.speed*modifier); }
				}
				for (var k=0; k<this.carpets.length; k++) { // Move carpets
					this.carpets[k].x+=(this.speed*modifier);
					this.carpets[k].targetX+=(this.speed*modifier);
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
