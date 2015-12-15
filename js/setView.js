function setView(obj) {
	var xDif = (Game.canvas.width/2.05 - obj.x)
	var yDif = (Game.canvas.height/2.3 - obj.y);
	for (var i in entities) {
		entities[i].x+=xDif;
		entities[i].y+=yDif;
	}
}
