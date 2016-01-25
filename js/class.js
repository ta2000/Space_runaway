"use strict";

var entities = {};

class Sprite {
	constructor(img,x,y) {
		this.image = new Image();
		this.image.src = img;
		this.x = x;
		this.y = y;
		this.solid = true;
	}

	draw( ctx ) {
		ctx.drawImage(this.image, this.x, this.y);
	}

	drawMinimap( ctx ) {
		// Draw onto minimap
		var xDist = this.x - entities.player.x;
		var yDist = this.y - entities.player.y;

		if (this.color!==undefined) {
			ctx.fillStyle = this.color;
		} else { ctx.fillStyle = "black"; }

		if (this.primitiveDistance(minimap.x+xDist/5, minimap.y+yDist/5, minimap.x, minimap.y) <= minimap.r*2.1) {
			ctx.fillRect(minimap.x+xDist/minimap.scale, minimap.y+yDist/minimap.scale, Game.scale/minimap.scale, Game.scale/minimap.scale);
		}
	}

	collision( obj ) {
		var collided = false;

		if (this!=obj) {
			if (this.x < obj.x + obj.image.width &&
				this.x + this.image.width > obj.x &&
				this.y < obj.y + obj.image.height &&
				this.image.height + this.y > obj.y) {
				collided = true;
			}
		}

		return collided;
	}

	distance( obj ) {
		var dx 	= Math.abs((this.x+this.image.width/2) - (obj.x+obj.image.width/2))
		var dy 	= Math.abs((this.y+this.image.height/2) - (obj.y+obj.image.height/2));
		var hyp	= Math.sqrt( (dx*dx)+(dy*dy) );

		return hyp;
	}

	primitiveDistance( x1, y1, x2, y2 ) {
		var dx 	= Math.abs(x1 - x2)
		var dy 	= Math.abs(y1 - y2);
		var hyp	= Math.sqrt( (dx*dx)+(dy*dy) );

		return hyp;
	}

}

class Player extends Sprite {
	constructor(img,x,y) {
		super(img,x,y);
		this.speed = 3;
		this.keysDown = {};
		this.direction = 90;
		this.visibleObjs = [];
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
	}

}

class NPC extends Sprite {
	constructor(img,x,y) {
		super(img,x,y);
		this.speed = 0.8;
		this.tree;
		this.curretQuery = 0;
		this.direction;
		this.currentSteps = 0;
	}

	popup(text, options) {
		if (document.getElementsByClassName('popup')[0]===undefined) {
			var obj = this;

			var div = document.createElement('div');
			div.className = 'popup';
			div.style.left = Game.canvas.width/10 + "px";
			div.style.top = Game.canvas.height/10 + "px";
			div.style.width = (Game.canvas.width - Game.canvas.width/5)+"px";
			div.style.height = (Game.canvas.height - Game.canvas.height/5)+"px";

			// Container for query and responses
			var textContainer = document.createElement('div');
			textContainer.className = "textContainer";
			div.appendChild(textContainer);

			// NPC query
			var querybox = document.createElement('div');
			querybox.className = "querybox";
			var querytext = document.createTextNode("");
			querybox.appendChild(querytext);

			textContainer.appendChild(querybox);

			// Scrolling text
			var i=0;
			var textscroll = setInterval(function () {
				querytext.nodeValue += text.charAt(i);
				i++;
				if (i==text.length) {
					clearInterval(textscroll);
				}
			}, 40); // Text scroll speed

			// Player response options
			for (let i = 0; i < options.length; i++) {
				var dialogueOption = document.createElement('p');
				// Set styling
				dialogueOption.className = "dialogueOption";
				dialogueOption.innerHTML = (options[i][0]);
				textContainer.appendChild(dialogueOption);

				// Check which option was chosen
				dialogueOption.addEventListener('click', function newQuery() {
					obj.curretQuery = options[i][1][0]-1;
					document.body.removeChild(document.getElementsByClassName('popup')[0]);
					obj.dialogue();
				}, false);
				// NOTE: Referencing dialogueOption below causes it and event listener to be retained in memory
			}

			document.body.appendChild(div);
		}
	}


	move(ctx) {
		// ======================
		//  NPC AI CODE GOES HERE
		// ======================

















		// ======================
		//  NPC AI CODE ENDS HERE
		// ======================

		// Dialogue tree
		if (this.tree != undefined) {
			if (this.distance(entities.player)<=Game.scale*2 && 69 in entities.player.keysDown) {
				this.dialogue();
			}
		}
	}

	dialogue() {
		var options = [];
		for (var i = 0; i < this.tree.npcText[this.curretQuery][1].length; i++) {
			options.push(this.tree.playerText[this.tree.npcText[this.curretQuery][1][i]-1]);
		}
		this.popup(this.tree.npcText[this.curretQuery][0], options);
	}

}

class Goblin extends NPC {
	constructor(img,x,y) {
		super(img,x,y);
	}
}

class Wall extends Sprite {
	constructor(img,x,y) {
		super(img,x,y);
	}
}

class Portal extends Sprite {
	constructor(img,x,y) {
		super(img,x,y);
	}
}
