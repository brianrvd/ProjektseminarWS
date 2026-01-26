'use strict'

module.exports = class AudioManager {

    constructor(){
        this.sounds= {};
        this.muted= false;
        this.sounds.explosion = new Audio('sounds/explosion.mp3');
        this.sounds.laser = new Audio('sounds/laserShot.mp3');
        this.sounds.error = new Audio('sounds/error.mp3');
        this.sounds.background = new Audio('sounds/background.mp3');
        this.sounds.gameOver = new Audio('sounds/gameOver.mp3')


        //Sounds laden
        Object.values(this.sounds).forEach(sound => {
            sound.preload = 'auto';
        });


        //Toneinstellungen
        this.sounds.explosion.volume = 0.4;
        this.sounds.laser.volume = 0.03;
        this.sounds.error.volume = 0.5;
        this.sounds.background.volume = 0.1;
        this.sounds.gameOver.volume = 0.1;
        this.sounds.background.loop = true;
        

        
    }

    playSound(name){
        if(!this.muted && this.sounds[name]){
            this.sounds[name].currentTime = 0;
            this.sounds[name].play();
        }
    }

    stopSound(name){
        if(this.sounds[name]){
            this.sounds[name].pause();
            this.sounds[name].currentTime = 0;
        }
    }

}