"use strict"
 
const Game = require("./game")
const InputField = require("./inputfield")
let myGame = new Game()

// canvas
window.onload = () => {
    const speicherButton = window.document.getElementById("speicher-button") 
    speicherButton.onclick = () => {
        InputField.saveWords(); 
}
// problem punkt merg: startbutton 2x
    const startButton = window.document.getElementById("start-button") 
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
