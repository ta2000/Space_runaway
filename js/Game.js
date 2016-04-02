var entities = {};
var Game = {
	levelURL : false,
	levelNum : 1,
	scale : 32,
	params : {},
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
		// Draw
		Game.draw();
	},
	clear : function() {
		Game.ctx.clearRect(0, 0, Game.canvas.width, Game.canvas.height);
	},
	draw : function() {
		Game.clear();

		// Entities
		for (var i in entities) {
			for (var j in entities[i]) {
				// Call move() if entity can
				if (entities[i][j].move!==undefined) {
					entities[i][j].move(Game.ctx);
				}
				// Call draw on the entity
				entities[i][j].draw(Game.ctx);
				// Delete entities with invalid images
				if (!entities[i][j].image.exists) {
					delete entities[i][j];
				}
			}
		}

		// Minimap
		minimap.draw(Game.ctx);

		// Draw energy meter
		try {
			entities[0].player.drawEnergy(Game.ctx);
		} catch (err) {};


		window.requestAnimationFrame(Game.draw);
	},
	// Key handling
	key_down : function(e) {
		if (entities[0].player.keysDown!==undefined) {
			entities[0].player.keysDown[e.keyCode]=true;
		}
	},
	key_up : function(e) {
		if (entities[0].player.keysDown!==undefined) {
			delete entities[0].player.keysDown[e.keyCode];
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
		// Get the images from folder
		var images = [
			"http://ta2000.github.io/Game/images/sprites/player.png",
			"http://ta2000.github.io/Game/images/sprites/space_goblin.png",
			"http://ta2000.github.io/Game/images/sprites/goblin_soldier.png",
			"http://ta2000.github.io/Game/images/sprites/wall.png",
			"http://ta2000.github.io/Game/images/sprites/crewman.png"
		];

		entities[Game.levelID] = {};

		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (xhttp.readyState == 4) {
				var json = xhttp.responseText;
				var obj = JSON.parse(json);
				for (var i = 0; i < obj.board.length; i++) {
					try { // If className is valid create normally
						if ( obj.board[i].imgIndex == 1 ) { // If imgIndex is player imgIndex, set to player
							entities[Game.levelID].player = new Game[obj.board[i].className]( images[obj.board[i].imgIndex -1], (obj.board[i].x*Game.scale), (obj.board[i].y*Game.scale) );
						} else { // Otherwise create the object as normal entity with it's className
							entities[Game.levelID]['entity'+i] = new Game[obj.board[i].className]( images[obj.board[i].imgIndex -1], (obj.board[i].x*Game.scale), (obj.board[i].y*Game.scale) );
							entities[Game.levelID]['entity'+i].color = "lime";
							// Add tree is exists
							if (obj.board[i].tree != undefined) {
								entities[Game.levelID]['entity'+i].tree = obj.board[i].tree;
							}
						}
					} catch (err) { // If className is invalid create as Sprite
						if ( images[obj.board[i].imgIndex -1] != undefined ) { // Make sure index is within the array
							entities[Game.levelID]['entity'+i] = new Sprite(  images[obj.board[i].imgIndex -1],(obj.board[i].x*Game.scale), (obj.board[i].y*Game.scale) );
							entities[Game.levelID]['entity'+i].color = "red";
							console.warn("Tile created as Sprite. Class \"" + obj.board[i].className + "\" does not exist.");
						} else { // Don't create anything if className and image are invalid
							console.warn("Error loading tile, no valid class or image.");
						}
					}
				}
				// Set the view on the player
				Game.setView(entities[0].player);
				// Increase levelID
				Game.levelID++;
			}
		};
		xhttp.open("GET", url, true);
		xhttp.send();
	},
	setView : function(obj) {
		var xDif = (Game.canvas.width/2.05 - obj.x)
		var yDif = (Game.canvas.height/2.3 - obj.y);
		for (var i in entities) {
			for (var j in entities[i]) {
				entities[i][j].x+=xDif;
				entities[i][j].y+=yDif;
			}
		}
	}
}
