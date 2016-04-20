"use-strict";

class Carpet extends Sprite
{
    constructor(img, x, y, speed)
    {
        super(img, x, y);
        this.speed = speed;
        this.angle = Math.atan2(Game.mouse.y - this.y, Game.mouse.x - this.x);
        this.maxLifeSpan = 450;
        this.lifeSpan = this.maxLifeSpan;
    }

    draw(ctx)
    {
        // Fade out when life almost over
        ctx.globalAlpha = (this.lifeSpan/(this.maxLifeSpan/10));
        Sprite.prototype.draw.call(this, ctx);
        ctx.globalAlpha = 1; // Reset alpha
    }

    update(modifier)
    {
        this.lifeSpan--;

        // Move until speed is zero, decrease speed
        if (this.speed > 0)
        {
            this.x += Math.cos(this.angle)*(this.speed*modifier);
            this.y += Math.sin(this.angle)*(this.speed*modifier);
            this.speed-=10;
        }

        // Bounce off everything
        for (var i in entities) {
			for (var j in entities[i]) {
                if (this.collision(entities[i][j])) {
                    this.angle+=4.71;
                    this.x += Math.cos(this.angle)*(this.speed*modifier);
                    this.y += Math.sin(this.angle)*(this.speed*modifier);
                }
            }
        }
    }
}
Game.Carpet = Carpet;
