"use strict"
 
const Game = require("./game")
let myGame = new Game()

// canvas
window.onload = () => {
    const modeEnglishButton = document.getElementById("mode-english");
    const modeGermanButton = document.getElementById("mode-german");
    const startButton = window.document.getElementById("start-button");
    
    // english
    modeEnglishButton.onclick = () => {
        myGame.gameMode = 'english';
        document.getElementById("main-menu").style.display = "none";
        myGame.start();
    };
    
    // german
    modeGermanButton.onclick = () => {
        myGame.gameMode = 'german';
        document.getElementById("main-menu").style.display = "none";
        myGame.start();
    };
    
    startButton.onclick = () => {
        document.getElementById("main-menu").style.display = "none" // versteckt das main menü 
        myGame.start()
    }
    
    const pauseButton = window.document.getElementById("pauseButton");
    pauseButton.onclick = function() { myGame.pause(); }
};
