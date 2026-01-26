"use strict"

const Element = require('./element')
const Burst = require('./burst')
const Word = require('./word')
const Health = require('./health')

module.exports = class RandomWalkCircleElement extends Element {
    constructor(game) {
        super()
        this.game = game
        this.x = Math.random() * 530 + 40
        this.y = 0
        this.speed = 0.7
        this.radius = 15;

         this.imageOptions = [
            { src: 'img/meteor1.png', probability: 0.1 },   // 40% Wahrscheinlichkeit
            { src: 'img/meteor2.png', probability: 0.2 },  // 25% Wahrscheinlichkeit
            { src: 'img/meteor3.png', probability: 0.4 },   // 20% Wahrscheinlichkeit
            { src: 'img/meteor4.png', probability: 0.25 },   // 10% Wahrscheinlichkeit
            { src: 'img/meteor5.png', probability: 0.05 }   // 5% Wahrscheinlichkeit
        ];

        this.bild = new Image();
        this.bild.src = this.selectRandomImage();
        const baseSpeed = 0.7;
        const speedIncrease = Math.floor(this.game.score / 5) * 0.075;
        this.speed = Math.min(baseSpeed + speedIncrease, 100.0)
        
        setTimeout(() => { 
            let word = new Word(this.game, this.x, this.y, this.instanceId, this.speed)
            this.game.elementList.add(word)
        }, 100);
    }

    selectRandomImage() {
        const random = Math.random();
        let cumulativeProbability = 0;
        
        for (const option of this.imageOptions) {
            cumulativeProbability += option.probability;
            if (random <= cumulativeProbability) {
                return option.src;
            }
        }
        
        // Fallback auf erstes Bild, falls etwas schief geht
        return this.imageOptions[0].src;
        
    }
        
    

    draw(ctx) {
      //if (!this.img.complete) return;//
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
            ctx.fillStyle =  "grey"
            ctx.fill()
            */

    }

    callBurst() {
        var burst = new Burst(this.x, this.y, this.game)
        this.game.elementList.add(burst)
    }

    action() {
        //this.x += Math.random() * 2 - 1
        this.y += this.speed
    }

    checkCollision() {
        if (this.y > 550 && this.y <= 550 + this.speed) {
            this.onCollision()
        }
    }

    onCollision() {
        this.hasCollided = true
        this.game.elementList.delete(this.instanceId)
        this.callBurst()
        this.game.health.reduce()             
    }
    
    bulletMet() {
        this.hasCollided = true
        this.game.elementList.delete(this.instanceId)
        this.callBurst()
    }
}