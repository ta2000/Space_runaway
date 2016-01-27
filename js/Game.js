var entities = {};
var Game = {
	levelNum : 1,
	scale : 32,
	canvas : document.createElement("canvas"),
	start : function() {
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		this.ctx = this.canvas.getContext("2d");
		document.body.insertBefore(this.canvas, document.body.childNodes[0]);
		// Key handling
		window.onkeydown = this.key_down;
		window.onkeyup = this.key_up;
		// Device orientation
		if (window.DeviceOrientationEvent) {
			window.addEventListener('deviceorientation', function(eventData) {
				var tiltLR = eventData.gamma;
				var tiltFB = eventData.beta;
				if ( typeof Game.original_tiltFB === "undefined" ) {
					Game.original_tiltFB = eventData.beta;
				}
				var dir = eventData.alpha
				Game.deviceOrientationHandler(tiltLR, tiltFB, dir);
				}, false);
		}
		// Level
		this.loadLevel(Game.levelNum);
		// Draw
		Game.draw();
	},
	deviceOrientationHandler : function(tiltLR, tiltFB, dir) {
		try {
			for ( key in entities.player.keysDown ) {
				delete entities.player.keysDown[ key ];
			}
			if ( tiltLR < -5 ) { entities.player.keysDown[65] = true; }
			else if ( tiltLR > 5 ) { entities.player.keysDown[68] = true; }
			else if ( tiltFB  < -5 ) { entities.player.keysDown[87] = true; }
			else if ( tiltFB > 5 ) { entities.player.keysDown[83] = true; }
		} catch (err) {};
	},
	clear : function() {
		Game.ctx.clearRect(0, 0, Game.canvas.width, Game.canvas.height);
	},
	draw : function() {
		Game.clear();

		// Entities
		try {
			for (var i in entities) {
				if (entities[i].move!==undefined) {
					entities[i].move(Game.ctx);
				}
			}
			for (var i in entities) {
				entities[i].draw(Game.ctx);
			}
		} catch (err) {};

		// Minimap
		minimap.draw(Game.ctx);

		window.requestAnimationFrame(Game.draw);
	},
	// Key handling
	key_down : function(e) {
		for (var i in entities) {
			if (entities[i].keysDown!==undefined) {
				entities[i].keysDown[e.keyCode]=true;
			}
		}
	},
	key_up : function(e) {
		for (var i in entities) {
			if (entities[i].keysDown!==undefined) {
				delete entities[i].keysDown[e.keyCode];
			}
		}
	},
	// Level loading and parsing
	loadLevel : function(levelNum) {
		// Get the images from folder
		var images = ["images/sprites/player.png", "images/sprites/space_goblin.png", "images/sprites/wall.png"];

		// Gets level from server, can't get locally
		var url = "http://ta2000.github.io/Game/levels/level" + levelNum + ".json";
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (xhttp.readyState == 4) {
				var json = xhttp.responseText;
				var obj = {};
				obj = JSON.parse(json);
				for (var i = 0; i < obj.board.length; i++) {
					try { // If className is valid create normally
						if ( obj.board[i].imgIndex == 1 ) { // If imgIndex is player imgIndex, set to player
							entities.player = new Game[obj.board[i].className]( images[obj.board[i].imgIndex -1], (obj.board[i].x*Game.scale), (obj.board[i].y*Game.scale) );
						} else { // Otherwise create the object as normal entity with it's className
							entities['entity'+i] = new Game[obj.board[i].className]( images[obj.board[i].imgIndex -1], (obj.board[i].x*Game.scale), (obj.board[i].y*Game.scale) );
							entities['entity'+i].color = "lime";
							// Add tree is exists
							if (obj.board[i].tree != undefined) {
								entities['entity'+i].tree = obj.board[i].tree;
							}
						}
					} catch (err) { // If className is invalid create as Sprite
						if ( images[obj.board[i].imgIndex -1] != undefined ) {
							entities['entity'+i] = new Sprite(  images[obj.board[i].imgIndex -1],(obj.board[i].x*Game.scale), (obj.board[i].y*Game.scale) );
							entities['entity'+i].color = "red";
							console.log("Error loading tile, no valid class. Created as a Sprite.");
						} else { // Don't create anything if className and image are invalid
							console.log("Error loading tile, no valid class or image.");
						}
					}
				}
				// Set the view on the player
				Game.setView(entities.player);
			}
		};
		xhttp.open("GET", url, true);
		xhttp.send();
	},
	setView : function(obj) {
		var xDif = (Game.canvas.width/2.05 - obj.x)
		var yDif = (Game.canvas.height/2.3 - obj.y);
		for (var i in entities) {
			entities[i].x+=xDif;
			entities[i].y+=yDif;
		}
	}
}
