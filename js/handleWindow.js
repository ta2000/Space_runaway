window.onresize = function () {
    // TODO: Resize minimap
    // minimap.r =
    // Relocate minimap
    minimap.x = minimap.r*2;
    minimap.y = minimap.r*1.5;
    // Change the size of the canvas to the window size
    Game.canvas.width = window.innerWidth;
    Game.canvas.height = window.innerHeight;
    // Call setView to focus on the player
    Game.setView(entities[0].player);
};
