'use strict'

const RandomWalkCircleElement = require('./randomwalkcircleelement')
const ElementList = require('./elementlist')
const Burst = require('./burst')
const Word = require('./word')

module.exports = class RegenerateBoss extends RandomWalkCircleElement {
    constructor(game, health=3 ) {
        super(game)
        this.x = 300;
        this.speed = 0.2
        this.health = health;
        this.radius = 30;

        this.boss1 = new Image();
        this.boss1.src = 'img/heart.png'; //placeholder
        

    }

    draw(ctx) {
        ctx.save();
            
            ctx.beginPath()
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true)
            ctx.closePath()

            ctx.clip();
            ctx.drawImage( //bild in kreis zentrieren 
                this.bild,
                this.x - this.radius,
                this.y - this.radius,
                this.radius * 2,
                this.radius * 2
            );
            ctx.restore();
        /*
        ctx.beginPath()
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true)
            ctx.closePath()
            
            ctx.fillStyle =  "black"
            ctx.fill()
            */
    }

    bulletMet() {
        if(this.health > 1){
            this.health -= 1;
            const nextBoss = new RegenerateBoss(this.game, this.health );
            nextBoss.x = this.x;
            nextBoss.y = this.y;
            this.game.elementList.add(nextBoss);
            this.game.elementList.delete(this.instanceId)
        }else{
            this.health=3;
            this.hasCollided = true
            this.game.elementList.delete(this.instanceId)
            this.callBurst()
        }
        
    }
}