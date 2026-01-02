'use strict'


const RandomWalkCircleElement = require('./randomwalkcircleelement')
const ElementList = require('./elementlist')    
const Burst = require('./burst')
const Word = require('./word')

module.exports = class SpawnerBoss extends RandomWalkCircleElement {

    /*constructor(game) {
        super(game)
        this.x = 300;
        this.speed = 0.2



        
        this.spawn();
        this.spawnInterval = 5000  // spawn every x seconds
        this.lastSpawnTime = Date.now();
        
    }*/
    constructor(game) {
        super(game)
        this.speed = 0.2
            
        this.spawnAtRandomPosition(); // Zufällige Startposition
        this.spawnInterval = this.getRandomSpawnInterval();
        this.lastSpawnTime = Date.now();
    }

    spawnAtRandomPosition() {
        // Zufällige X-Position 
        this.x = Math.random() * 400 + 100;
        this.y = 0; 
    }

    startSpawning() {
        const currentTime = Date.now();
        if(currentTime - this.lastSpawnTime >= this.spawnInterval){
            this.spawn();
            this.lastSpawnTime = currentTime;
            this.spawnInterval = this.getRandomSpawnInterval();
            this.spawnAtRandomPosition(); 
        }       
    }

     draw(ctx) {
            ctx.beginPath()
            ctx.arc(this.x, this.y, 30, 0, Math.PI * 2, true)
            ctx.closePath()
            
            ctx.fillStyle =  "orange"
            ctx.fill()

    }

    action(){
        super.action();
        this.startSpawning();

    }

    startSpawning() {
        
        const currentTime = Date.now();
        if( currentTime - this.lastSpawnTime >= this.spawnInterval){
            this.spawn();
            this.lastSpawnTime = currentTime;


        }       
            
    }

    spawn() {
        for (let i = 0; i < 2; i++) {
            if(this.game.elementList) {
                const minion = new RandomWalkCircleElement(this.game);
                minion.x =  this.x + (i - 1) * 60; 
                minion.y = this.y +10;
                this.game.elementList.add(minion);

            }
        }
    }
    

}