"use strict";


class BackgroundTile extends Sprite {
	constructor(imgArr,x,y) {
		var img = imgArr[Math.floor(Math.random()*imgArr.length)];
		super(img,x,y);
	}

    update() {

    }
}
