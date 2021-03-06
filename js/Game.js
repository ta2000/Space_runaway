var entities = {};
var backgroundTiles = {};
var Game = {
	levelURL : false,
	levelNum : 1,
	scale : 64,
	params : {},
	then : Date.now(),
	mouse : {x:0,y:0,click:false},
	trackLevelExits : {},
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
		//when the canvas is clicked, call the click_up function
		this.canvas.onclick = this.click_up;
		// Create background tiles
		var tiles = 0;
		for (var i=-128; i< Game.canvas.width+128; i+=128) {
			for (var j=-128; j<Game.canvas.height+128; j+=128) {
				backgroundTiles['backgroundTile'+tiles] = new BackgroundTile(
					["images/sprites/grass1.png",
					"images/sprites/grass2.png",
					"images/sprites/grass3.png",
					"images/sprites/grass4.png"],
					i,
					j
				);
				tiles++;
			}
		}
		// Load the levelURL if its not false, otherwise we load levelNum
		var firstLoad = {
			levelLoadOpX: function () {
				return 0;
			},
			levelLoadOpY: function () {
				return 0;
			},
			loadPosID: undefined
		};
		this.loadLevel(Game.levelURL || "http://ta2000.github.io/Space_runaway/levels/level1.json", firstLoad, this.draw.bind(this));
	},
	clear : function() {
		Game.ctx.clearRect(0, 0, Game.canvas.width, Game.canvas.height);
	},
	draw : function() {
		Game.clear();

		var now = Date.now();
		var delta = now - Game.then;
		var modifier = delta / 1000;

		var exitInView = {};
		for (var i in Game.trackLevelExits) {
			exitInView[i] = true;
			for (var j in Game.trackLevelExits[i]) {
				if (Game.trackLevelExits[i][j].distance(Game.player) > (Game.canvas.width * 4)) {
					console.log(i, "is not in view");
					exitInView[i] = false;
				}
			}
		}
		for (var i in exitInView) {
			if (exitInView[i] === false) {
				console.log("Unloading level", i);
				delete Game.trackLevelExits[i];
				delete entities[i];
			}
		}
		// Background tiles
		for (var i in backgroundTiles) {
			backgroundTiles[i].update();
			backgroundTiles[i].draw(Game.ctx);
		}
		// Entities
		for (var i in entities) {
			for (var j in entities[i]) {
				// Call update() if entity can
				if (entities[i][j].update!==undefined) {
					entities[i][j].update(modifier);
				}
				// Call draw on the entity if image exists
				if (entities[i][j].image!==undefined) {
					// Only draw if not hidden
					if (entities[i][j].hidden != undefined) {
						if (entities[i][j].hidden == "false") {
							entities[i][j].draw(Game.ctx);
						}
					} else { // If hidden is undefined draw it anyways
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
		Game.player.update(modifier);
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
	click_up : function(e) {
		Game.mouse.click = true;
		Game.mouse.x = e.clientX;
		Game.mouse.y = e.clientY;
		Game.player.spawnCarpet();
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
	loadLevel : function(url, align, callback) {
		entities[url] = {};
		Game.trackLevelExits[url] = {};
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (xhttp.readyState == 4) {
				var x = align.levelLoadOpX();
				var y = align.levelLoadOpY();
				var loadPosID = align.id;
				var alignmentX = 0;
				var alignmentY = 0;

				var json = xhttp.responseText;
				var level = JSON.parse(json);
				for (var i = 0; i < level.board.length; i++) {
					try { // If className is valid create normally
						// If tile's class is Player assign to Game.player
						if ( level.board[i].className == "Player" ) {
							if (Game.player == undefined) {
								Game.player = new Game[level.board[i].className](
									level.images[level.board[i].className],
									(level.board[i].x*Game.scale)+x,
									(level.board[i].y*Game.scale)+y
								);
							}
						// Otherwise create the object as normal entity with it's className
						} else {
							// Create entity
							entities[url]['entity'+i] = new Game[level.board[i].className](
								level.images[level.board[i].className],
								(level.board[i].x*Game.scale)+x,
								(level.board[i].y*Game.scale)+y
							);
							if (level.board[i].className === "LevelExit") {
								Game.trackLevelExits[url]['entity'+i] = entities[url]['entity'+i];
							}
							// Add other properties to entity, including dialogue
							for (var j in level.board[i]) {
								if (j != "className") { // Only needed for loading
									if (entities[url]['entity'+i][j] == undefined) {
										entities[url]['entity'+i][j] = level.board[i][j];
									}
								}
							}
							if (entities[url]['entity'+i].id != undefined && entities[url]['entity'+i].id == loadPosID)
							{
								alignmentX = (entities[url]['entity'+i].x - x);
								alignmentY = (entities[url]['entity'+i].y - y);
							}
							// Set minimap color
							entities[url]['entity'+i].color = "lime"; // Minimap color
						}
					} catch (err) { // Don't create anything if className is invalid
						console.warn("Could not load tile. Class \"" + level.board[i].className + "\" does not exist.");
					}
				}
				// Align level based on levelExit id
				for (var i in entities[url]) {
					entities[url][i].x -= alignmentX;
					entities[url][i].y -= alignmentY;
				}

				// Set the view on the player
				Game.setView(Game.player, true);
				if (typeof callback === "function") {
					callback();
				}
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
