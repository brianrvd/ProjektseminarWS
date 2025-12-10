"use strict"
 
const Game = require("./game")
const InputField = require("./inputfield")
let myGame = new Game()

// canvas
window.onload = () => {
    const ownWordsButton = window.document.getElementById("own-words") 
    const speicherButton = window.document.getElementById("speicher-button") 
    const modeEnglishButton = document.getElementById("mode-english");
    const modeGermanButton = document.getElementById("mode-german");
    const pauseButton = window.document.getElementById("pauseButton");
    const closeInputPopup = window.document.getElementById("close-input-popup");
    const continueButton = window.document.getElementById("continue-button");
    const homeButton = window.document.getElementById("home-button");
    
    ownWordsButton.onclick = () => {
        document.getElementById("input-popup").style.display = "block";
    }

    speicherButton.onclick = () => {
        InputField.saveWords(); 
        document.getElementById("main-menu").style.display = "none";
        document.getElementById("input-popup").style.display = "none";
        myGame.start();
    }

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
    
    pauseButton.onclick = function() { 
        myGame.pause(); 
        document.getElementById("mode-selection").style.display = "none";
        document.getElementById("start-button").style.display = "block";
    }

    closeInputPopup.onclick = () => {
        document.getElementById("input-popup").style.display = "none";
    }

    continueButton.onclick = () => {
        document.getElementById("main-menu").style.display = "none"
        document.getElementById("continue-button").style.display = "none"
        myGame.continue()
    }

    homeButton.onclick = () => {
        document.getElementById("mode-selection").style.display = "flex"
        document.getElementById("home-button").style.display = "none"
    }
};
