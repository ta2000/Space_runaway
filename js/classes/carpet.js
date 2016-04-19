"use-strict";

class Carpet extends Sprite
{

  constructor(img, x, y)
  {
    /*var type = 1;
    if(type === 1)
    {
      this.speed = .2;
      img = "carpet1";
    }
    else if(type === 2)
    {
      this.speed = .4;
      img = "carpet2";
    }
    else
    {
      this.speed = .6;
      img = "carpet3";
    }*/
    super(img, x, y);
    this.speed = .000005;
  }

  movement(speed)
  {
    if(Game.click == true)
    {
      var angle = Math.atan2(Game.mouseY, Game.mouseX)
      var xIncrement = Math.cos(angle) * speed;
      var yIncrement = Math.sin(angle) * speed;
      console.log('initial', this.x, this.y);
        if (Game.mouseX > this.x)
        {
          this.x += xIncrement;
        }
        else
        {
          this.x -= xIncrement;
        }
        if (Game.mouseY > this.y)
        {
          this.y += yIncrement;
        }
        else
        {
          this.y -= yIncrement;
        }
    console.log('final', this.x, this.y);
    console.log('mousepos:', Game.mouseX, Game.mouseY);
    Game.click = false;
    }
  }

}

Game.Carpet = Carpet;
