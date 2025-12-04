"use strict"
 
const Game = require("./game")
const InputField = require("./inputfield")
let myGame = new Game()
//myGame.start()

// beim tasten druck canvas zeigen und menü verstecken 
window.onload = () => {
    const speicherButton = window.document.getElementById("speicher-button") 
    speicherButton.onclick = () => {
        InputField.saveWords(); 
}

    const startButton = window.document.getElementById("start-button") 
    startButton.onclick = () => {
        document.getElementById("game-wrapper").style.display = "none" // versteckt das main menü 
        document.getElementById("mycanvas").style.display = "flex" // zeigt canvas wieder auf
        myGame.start()
    }
}
   
    