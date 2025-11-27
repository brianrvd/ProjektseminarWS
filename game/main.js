"use strict"
 
const Game = require("./game")
let myGame = new Game()

// beim tasten druck canvas zeigen und menü verstecken 
window.onload = () => {
    const startButton = window.document.getElementById("start-button") 
    startButton.onclick = () => {
        document.getElementById("main-menu").style.display = "none" // versteckt das main menü 
        myGame.start()
    }
    const pauseButton = window.document.getElementById("pauseButton");
    pauseButton.onclick = function() { myGame.pause(); }
};
