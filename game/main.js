"use strict"
 
const Game = require("./game")
let myGame = new Game()
myGame.start()
// beim tasten druck canvas zeigen und menü verstecken 
const startButton = document.getElementById("start-button"); 
startButton.onclick = () => {
    document.getElementById("main-menu").style.display = "none"; // versteckt das main menü 
    document.getElementById("mycanvas").style.display = "flex"; // zeigt canvas wieder auf
    myGame.start();
};
