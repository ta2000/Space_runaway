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
		// Gets level from server, can't get locally
		var url = "http://ta2000.github.io/Game/levels/level" + levelNum + ".json";
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (xhttp.readyState == 4) {
				var json = xhttp.responseText;
				var obj = {};
				obj = JSON.parse(json);
				for (var i = 0; i < obj.board.length; i++) {
					switch (obj.board[i].type) {
						case 1:
							entities['player'] = new Player("images/sprites/player.png", (obj.board[i].x*Game.scale), (obj.board[i].y*Game.scale));
							entities['player'].color = "green";
							break;
						case 2:
							entities['entity'+i] = new Goblin("images/sprites/space_goblin.png", (obj.board[i].x*Game.scale), (obj.board[i].y*Game.scale));
							entities['entity'+i].color = "red";
							if (obj.board[i].tree != undefined) {
								entities['entity'+i].tree = obj.board[i].tree;
							}
							break;
						case 3:
							entities['entity'+i] = new Wall("images/sprites/wall.png", (obj.board[i].x*Game.scale), (obj.board[i].y*Game.scale));
							entities['entity'+i].color = "blue";
							break;
						case 4:
							entities['entity'+i] = new Portal("images/sprites/portal.png", (obj.board[i].x*Game.scale), (obj.board[i].y*Game.scale));
							entities['entity'+i].color = "purple";
							break;
						default:
							console.log("Error loading tile: invalid type");
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
	},
	popup : false
}
