var entities = {};
var Game = {
	levelURL : false,
	levelNum : 1,
	scale : 64,
	params : {},
	then : 0,
	levelID : 0,
	canvas : document.createElement("canvas"),
	start : function() {
		this.update_from_params();
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		this.ctx = this.canvas.getContext("2d");
		document.body.insertBefore(this.canvas, document.body.childNodes[0]);
		// Key handling
		window.onkeydown = this.key_down;
		window.onkeyup = this.key_up;
		// Load the levelURL if its not false, otherwise we load levelNum
		this.loadLevel(Game.levelURL || Game.levelNum);
	},
	clear : function() {
		Game.ctx.clearRect(0, 0, Game.canvas.width, Game.canvas.height);
	},
	draw : function() {
		Game.clear();

		var now = Date.now();
		var delta = now - Game.then;
		var modifier = delta / 1000;

		// Entities
		for (var i in entities) {
			for (var j in entities[i]) {
				// Call update() if entity can
				if (entities[i][j].update!==undefined) {
					entities[i][j].update(Game.ctx, modifier);
				}
				// Call draw on the entity if image exists
				if (entities[i][j].image!==undefined) {
					// Only draw if not hidden
					if (entities[i][j].hidden != undefined && entities[i][j].hidden == false) {
						entities[i][j].draw(Game.ctx);
					}
					// Delete entities with invalid images
					if (!entities[i][j].image.exists) {
						delete entities[i][j];
					}
				}
			}
		}
		Game.player.draw(Game.ctx);
		Game.player.update(Game.ctx, modifier);
		Game.player.drawEnergy(Game.ctx);

		// Minimap
		minimap.draw(Game.ctx);

		Game.then = now;


		window.requestAnimationFrame(Game.draw);
	},
	// Key handling
	key_down : function(e) {
		if (Game.player.keysDown!==undefined) {
			Game.player.keysDown[e.keyCode]=true;
		}
	},
	key_up : function(e) {
		if (Game.player.keysDown!==undefined) {
			delete Game.player.keysDown[e.keyCode];
		}
	},
	update_from_params : function () {
		// Grab the params from after the pound in the URL
		this.params = this.page_params();
		// Any paramaters that are present in params that are also be present
		// in Game will be updated so that the Game key will be the same as the
		// value for the same key in params.
		// Example: this.levelNum will equal this.params["levelNum"] if levelNum
		// is present in this.params
		for (var key in this.params) {
			if (this.params.hasOwnProperty(key) && this.hasOwnProperty(key)) {
				this[key] = this.params[key];
			}
		}
	},
	page_params : function () {
		// Get parameters after pound in URL
		// Example: http://ta2000.github.io/Game/#name=someuser&levelNum=6
		var pairs = location.hash.substr(1).split('&').map(function (pair) {
			var kv = pair.split('=', 2);
			return [decodeURIComponent(kv[0]), kv.length === 2 ? decodeURIComponent(kv[1]) : null];
		});
		var asObject = {};
		for (var i = 0; i < pairs.length; i++) {
			asObject[pairs[i][0]] = pairs[i][1]
		}
		// This gets added for some reason
		delete asObject[""];
		return asObject;
	},
	// Level loading and parsing
	loadLevel : function(level) {
		var url;
		// Check if we are loading an offical level or user created
		// If the level is a number then it is an offical level
		if (isNaN(level)) {
			// The level is a url given by the user because it is not a number
			url = level;
		} else {
			// Gets level from server by number
			url = "http://ta2000.github.io/Game/levels/level" + level + ".json";
		}

		entities[Game.levelID] = {};

		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (xhttp.readyState == 4) {
				var json = xhttp.responseText;
				var level = JSON.parse(json);
				for (var i = 0; i < level.board.length; i++) {
					try { // If className is valid create normally
						// If tile's class is Player assign to Game.player
						if ( level.board[i].className == "Player" ) {
							Game.player = new Game[level.board[i].className]( level.board[i].imageURL, (level.board[i].x*Game.scale), (level.board[i].y*Game.scale) );
						// Otherwise create the levelect as normal entity with it's className
						} else {
							// Create entity
							entities[Game.levelID]['entity'+i] = new Game[level.board[i].className](
								level.board[i].imageURL,
								(level.board[i].x*Game.scale),
								(level.board[i].y*Game.scale)
							);
							// Add other properties to entity, including dialogue
							for (var j in level.board[i]) {
								if (j != "imageURL" && j != "className") { // Already used these properties
									if (entities[Game.levelID]['entity'+i][j] == undefined) {
										entities[Game.levelID]['entity'+i][j] = level.board[i][j];
									}
								}
							}
							// Set minimap color
							entities[Game.levelID]['entity'+i].color = "lime"; // Minimap color
						}
					} catch (err) { // Don't create anything if className is invalid
						console.warn("Could not load tile. Class \"" + level.board[i].className + "\" does not exist.");
					}
				}
				// Set the view on the player
				Game.setView(Game.player, true);
				// Increase levelID
				Game.levelID++;
				// Draw after loading
				Game.draw();
			}
		};
		xhttp.open("GET", url, true);
		xhttp.send();
	},
	setView : function(obj, isPlayer) {
		var xDif = (Game.canvas.width/2.05 - obj.x)
		var yDif = (Game.canvas.height/2.3 - obj.y);
		if (isPlayer) {
			obj.x+=xDif;
			obj.y+=yDif;
		}
		for (var i in entities) {
			for (var j in entities[i]) {
				entities[i][j].x+=xDif;
				entities[i][j].y+=yDif;
			}
		}
	}
}
