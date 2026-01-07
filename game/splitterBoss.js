'use strict'
const Element = require('./element')
const RandomWalkCircleElement = require('./randomwalkcircleelement')
const ElementList = require('./elementlist')    
const Burst = require('./burst')
const Word = require('./word')

module.exports = class SplitterBoss extends RandomWalkCircleElement {
 static totalLives = 4;
    constructor(game, health=2, size=30, abstand=150) {
        super(game)
        this.x = 300;
        this.speed = 0.1
        this.health = health;
        this.size = size;
        this.abstand = abstand;

    }

    draw(ctx) {
        ctx.beginPath()
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, true)
            ctx.closePath()
            
            ctx.fillStyle =  "blue"
            ctx.fill()
    }

    bulletMet() {
        if(this.health >= 1){   
            for (let i = 0; i < 2; i++) {
            if(this.game.elementList) {
                const minion = new SplitterBoss(this.game, this.health -1, this.size-8, this.abstand-70);
                minion.x =  this.x + (i * this.abstand - this.abstand/2);; 
                minion.y = this.y +10;
                this.game.elementList.add(minion);

            }
        }
        this.game.elementList.delete(this.instanceId)
        }else{
            if(SplitterBoss.totalLives <=1){
                //this.game.setBossInactive();
                SplitterBoss.totalLives=4;
                
            }
            this.health=2;
            SplitterBoss.totalLives--;
            this.hasCollided = true
            this.game.elementList.delete(this.instanceId)
            this.callBurst()
            
        }
        
    }

     onCollision() {
        this.game.setBossInactive();
        this.hasCollided = true
        this.game.elementList.delete(this.instanceId)
        this.callBurst()
        this.game.health.reduce()   
    }

}

