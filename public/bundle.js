(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
},{}],2:[function(require,module,exports){
const Element = require('./element')

module.exports = class Bullet extends Element {
    constructor(targetX, targetY, targetId, game) {
        super()
        // Startposition: Fest, wie du willst
        this.x = 311
        this.y = 472
        
        this.targetX = targetX
        this.targetY = targetY
        this.targetId = targetId  // instanceId des ZIEL-Kreises
        this.game = game
        this.hasCollided = false
        
        // Richtungsvektor
        const dx = targetX - this.x
        const dy = targetY - this.y
        const dist = Math.hypot(dx, dy) || 1
        this.vx = (dx / dist) * 8
        this.vy = (dy / dist) * 8

        if (this.game && this.game.audioManager) {
            this.game.audioManager.playSound('laser')
        }
    }

    draw(ctx) {
        if (this.hasCollided) return
        ctx.fillStyle = 'rgba(255, 17, 0, 1)'
        ctx.beginPath()
        ctx.arc(this.x, this.y, 5, 0, Math.PI * 2)
        ctx.fill()
        
        ctx.shadowBlur = 10
        ctx.shadowColor = 'rgba(226, 47, 11, 1)'
        ctx.fill()
        ctx.shadowBlur = 0
    }

    action() {
        if (this.hasCollided) return
        
        // Ziel-Kreis-Position aktualisieren (er bewegt sich!)
        const target = this.game.elementList.get(this.targetId)
        if (target) {
            this.targetX = target.x
            this.targetY = target.y
            
            const dx = this.targetX - this.x
            const dy = this.targetY - this.y
            const dist = Math.hypot(dx, dy) || 1
            this.vx = (dx / dist) * 8
            this.vy = (dy / dist) * 8
        }
        
        this.x += this.vx
        this.y += this.vy
    }

    checkCollision() {
        if (this.game.elementList.get(this.targetId) == null) {
            this.onCollision()
            return
        }
        const dist = Math.hypot(this.targetX - this.x, this.targetY - this.y)
        if (dist < 15) {
            this.onCollision()
            this.game.elementList.get(this.targetId).bulletMet();
        }
        if (this.x < 0 || this.x > window.innerWidth || 
            this.y < 0 || this.y > window.innerHeight) {
            this.onCollision()
        }
    }

    onCollision() {
        this.hasCollided = true
        this.game.elementList.delete(this.instanceId)
    }
}

},{"./element":5}],3:[function(require,module,exports){
"use strict"

const Element = require('./element')
const ElementList = require('./elementlist')
const Game = require('./game')

module.exports = class Burst extends Element {

    constructor(x, y, game) {
        super()
        this.game = game
        this.x = x
        this.y = y
        this.size = 15  

        if (this.game && this.game.audioManager) {
            this.game.audioManager.playSound('explosion')
        }
        this.checkCollision()

        
        
    }

    draw(ctx) {
        var img = new Image();
        img.onload = () => {
            ctx.drawImage(img, this.x - 10, this.y - 10, 30, 30);
        };
        img.src = 'img/explosion.png';
    }

    action() {
        //this.x += Math.random() * 2 - 1
    }
    
    checkCollision() { 
        if(this.instanceId != -1) {
            setTimeout(() => {
                this.onCollision()
            }, 700);  
        }
    }

    onCollision() {
        this.hasCollided = true
        this.game.elementList.delete(this.instanceId)
    }
}
},{"./element":5,"./elementlist":6,"./game":7}],4:[function(require,module,exports){
class EnglishGermanDictionary {
    constructor() {

        // ---------------------------------------------------------
        // 🔹 1. Englische Wörterliste (NUR English Words)
        // ---------------------------------------------------------
        this.words = [ //liste 1 
            "apple", "animal", "answer", "air", "age", "area", "arm", "ask",
            "always", "anything",
            "baby", "bag", "ball", "bank", "bath", "beach", "bear", "beautiful",
            "because", "bed", "beer", "before", "begin", "behind", "big", "bird",
            "birthday", "black", "blood", "blue", "book", "boot", "bread",
            "break", "brother",
            "cake", "car", "cat", "chair", "cheese", "child", "city", "clean",
            "close", "cloud", "coffee", "cold", "color", "country", "cup",
            "day", "dad", "dance", "dark", "daughter", "dead", "dear", "deep",
            "desk", "dinner", "dog", "door", "dream", "drink", "drive",
            "ear", "earth", "easy", "eat", "egg", "energy", "evening", "eye",
            "everything",
            "face", "family", "far", "farm", "fast", "father", "feet", "fight",
            "fire", "fish", "floor", "flower", "food", "foot", "friend",
            "garden", "girl", "glass", "go", "good", "green", "ground", "group",
            "hair", "hand", "hang", "happy", "hat", "head", "health", "heart",
            "heat", "heavy", "hello", "here", "high", "home", "horse", "house",
            "ice", "idea", "ill", "important", "inside", "island",
            "job", "juice", "jump",
            "key", "kill", "king", "kitchen", "kiss", "know",
            "lake", "land", "language", "large", "laugh", "learn", "left",
            "leg", "life", "light", "like", "lion", "little", "long", "love",
            "machine", "make", "man", "many", "milk", "minute", "money",
            "month", "morning", "mother", "mountain",
            "name", "nation", "near", "neck", "night", "noise", "north",
            "ocean", "off", "office", "oil", "old", "open", "orange", "order",
            "page", "paper", "parent", "park", "party", "pen", "people",
            "phone", "picture", "place", "plant", "play", "pocket", "police",
            "potato", "problem",
            "queen", "question",
            "rain", "restaurant", "red", "right", "river", "road", "room", "run",
            "salt", "sand", "school", "sea", "season", "see", "shirt",
            "shoe", "shop", "short", "sleep", "slow", "small", "smile", "snow",
            "son", "sound", "soup", "sport", "spring", "star", "stone",
            "street", "strong", "summer", "sun", "sweet",
            "table", "teacher", "tea", "team", "ten", "test", "thing",
            "thought", "time", "tired", "tomorrow", "town", "tree", "train",
            "travel",
            "under", "uncle", "up", "use",
            "village", "voice",
            "walk", "warm", "water", "way", "week", "welcome", "white",
            "window", "wind", "winter", "woman", "word", "work", "world",
            "write",
            "year", "yellow", "young",
            "zoo"
        ];

        // ---------------------------------------------------------
        // 🔹 2. Englische Wörter → Deutsche Übersetzungen
        // ---------------------------------------------------------
        this.translations = {
            "apple": "Apfel", "animal": "Tier", "answer": "Antwort", "air": "Luft",
            "age": "Alter", "area": "Bereich", "arm": "Arm", "ask": "fragen",
            "always": "immer", "anything": "etwas",

            "baby": "Baby", "bag": "Tasche", "ball": "Ball", "bank": "Bank",
            "bath": "Bad", "beach": "Strand", "bear": "Bär", "beautiful": "schön",
            "because": "weil", "bed": "Bett", "beer": "Bier", "before": "vorher",
            "begin": "beginnen", "behind": "hinter", "big": "groß", "bird": "Vogel",
            "birthday": "Geburtstag", "black": "schwarz", "blood": "Blut",
            "blue": "blau", "book": "Buch", "boot": "Stiefel", "bread": "Brot",
            "break": "Pause", "brother": "Bruder",

            "cake": "Kuchen", "car": "Auto", "cat": "Katze", "chair": "Stuhl",
            "cheese": "Käse", "child": "Kind", "city": "Stadt", "clean": "sauber",
            "close": "schließen", "cloud": "Wolke", "coffee": "Kaffee",
            "cold": "kalt", "color": "Farbe", "country": "Land", "cup": "Tasse",

            "day": "Tag", "dad": "Papa", "dance": "tanzen", "dark": "dunkel",
            "daughter": "Tochter", "dead": "tot", "dear": "lieb", "deep": "tief",
            "desk": "Schreibtisch", "dinner": "Abendessen", "dog": "Hund",
            "door": "Tür", "dream": "Traum", "drink": "Getränk", "drive": "fahren",

            "ear": "Ohr", "earth": "Erde", "easy": "einfach", "eat": "essen",
            "egg": "Ei", "energy": "Energie", "evening": "Abend",
            "eye": "Auge", "everything": "alles",

            "face": "Gesicht", "family": "Familie", "far": "weit", "farm": "Bauernhof",
            "fast": "schnell", "father": "Vater", "feet": "Füße", "fight": "kämpfen",
            "fire": "Feuer", "fish": "Fisch", "floor": "Boden", "flower": "Blume",
            "food": "Essen", "foot": "Fuß", "friend": "Freund",

            "garden": "Garten", "girl": "Mädchen", "glass": "Glas", "go": "gehen",
            "good": "gut", "green": "grün", "ground": "Boden", "group": "Gruppe",

            "hair": "Haare", "hand": "Hand", "hang": "hängen", "happy": "glücklich",
            "hat": "Hut", "head": "Kopf", "health": "Gesundheit", "heart": "Herz",
            "heat": "Hitze", "heavy": "schwer", "hello": "hallo", "here": "hier",
            "high": "hoch", "home": "Zuhause", "horse": "Pferd", "house": "Haus",

            "ice": "Eis", "idea": "Idee", "ill": "krank", "important": "wichtig",
            "inside": "drinnen", "island": "Insel",

            "job": "Job", "juice": "Saft", "jump": "springen",

            "key": "Schlüssel", "kill": "töten", "king": "König", "kitchen": "Küche",
            "kiss": "Kuss", "know": "wissen",

            "lake": "See", "land": "Land", "language": "Sprache",
            "large": "groß", "laugh": "lachen", "learn": "lernen",
            "left": "links", "leg": "Bein", "life": "Leben", "light": "Licht",
            "like": "mögen", "lion": "Löwe", "little": "klein", "long": "lang",
            "love": "Liebe",

            "machine": "Maschine", "make": "machen", "man": "Mann", "many": "viele",
            "milk": "Milch", "minute": "Minute", "money": "Geld",
            "month": "Monat", "morning": "Morgen", "mother": "Mutter", "mountain": "Berg",
            "month": "Monat", "morning": "Morgen", "mother": "Mutter",
            "mountain": "Berg",

            "name": "Name", "nation": "Nation", "near": "nah", "neck": "Nacken",
            "night": "Nacht", "noise": "Lärm", "north": "Norden",

            "ocean": "Ozean", "off": "aus", "office": "Büro", "oil": "Öl",
            "old": "alt", "open": "öffnen", "orange": "Orange", "order": "bestellen",

            "page": "Seite", "paper": "Papier", "parent": "Eltern", "park": "Park",
            "party": "Party", "pen": "Stift", "people": "Menschen", "phone": "Telefon",
            "picture": "Bild", "place": "Ort", "plant": "Pflanze", "play": "spielen",
            "pocket": "Tasche", "police": "Polizei", "potato": "Kartoffel",
            "problem": "Problem",

            "queen": "Königin", "question": "Frage",

            "rain": "Regen", "restaurant": "Restaurant", "red": "rot",
            "right": "rechts", "river": "Fluss", "road": "Straße",
            "room": "Zimmer", "run": "rennen",

            "salt": "Salz", "sand": "Sand", "school": "Schule", "sea": "Meer",
            "season": "Jahreszeit", "see": "sehen", "shirt": "Hemd",
            "shoe": "Schuh", "shop": "Laden", "short": "kurz", "sleep": "schlafen",
            "slow": "langsam", "small": "klein", "smile": "Lächeln", "snow": "Schnee",
            "son": "Sohn", "sound": "Geräusch", "soup": "Suppe", "sport": "Sport",
            "spring": "Frühling", "star": "Stern", "stone": "Stein", "street": "Straße",
            "slow": "langsam", "small": "klein", "smile": "Lächeln",
            "snow": "Schnee", "son": "Sohn", "sound": "Geräusch",
            "soup": "Suppe", "sport": "Sport", "spring": "Frühling",
            "star": "Stern", "stone": "Stein", "street": "Straße",
            "strong": "stark", "summer": "Sommer", "sun": "Sonne", "sweet": "süß",

            "table": "Tisch", "teacher": "Lehrer", "tea": "Tee", "team": "Team",
            "ten": "zehn", "test": "Test", "thing": "Ding", "thought": "Gedanke",
            "time": "Zeit", "tired": "müde", "tomorrow": "morgen", "town": "Stadt",
            "tree": "Baum", "train": "Zug", "travel": "reisen",

            "under": "unter", "uncle": "Onkel", "up": "hoch", "use": "benutzen",

            "village": "Dorf", "voice": "Stimme",

            "walk": "gehen", "warm": "warm", "water": "Wasser", "way": "Weg",
            "week": "Woche", "welcome": "willkommen", "white": "weiß",
            "window": "Fenster", "wind": "Wind", "winter": "Winter", "woman": "Frau",
            "word": "Wort", "work": "Arbeit", "world": "Welt", "write": "schreiben",
            "window": "Fenster", "wind": "Wind", "winter": "Winter",
            "woman": "Frau", "word": "Wort", "work": "Arbeit", "world": "Welt",
            "write": "schreiben",

            "year": "Jahr", "yellow": "gelb", "young": "jung",

            "zoo": "Zoo"
        };
    }

    translate(englishWord) {
        return this.translations[englishWord.toLowerCase()] ?? null;
    }

    setWords(newWordList) {
        this.words = newWordList;
    }
}

module.exports = EnglishGermanDictionary;

},{}],5:[function(require,module,exports){
"use strict"

module.exports = class Element {

    hasCollided = false

    constructor() {
        this.instanceId = -1
    }

    action() { }

    draw(ctx) { }

    checkCollision() { }

    onCollision() { }

    setId(id) {
        this.instanceId = id
    }
}
},{}],6:[function(require,module,exports){
"use strict"

module.exports = class ElementList extends Array {

    constructor() {
        super()
    }

    add(element) {
        this.push(element)
        element.setId(this.length - 1) 
    }

    get(i) {
        return this[i]
    }

    delete(i) {
        //this.splice(i, 1)
        this[i] = null
        //Änderung von Brian
       

    }

    draw(ctx) {
        for (let i = 0; i < this.length; i++) {
            if(this[i] != null) {
                this[i].draw(ctx)
            }
        }
    }

    
    action() {
        for (let i = this.length - 1; i >= 0; i--) {    
            if(this[i] != null) {
                this[i].action()
                // NEU: Bullet und Word cleanup
                if (this[i].hasCollided || this[i].destroyed) {
                    this.splice(i, 1)
                }
            }
        }
    }

    checkCollision() { 
        for (let i = 0; i < this.length; i++) {
            if(this[i] != null && !this[i].hasCollided) {
                this[i].checkCollision()
            }
        }
    }
}

},{}],7:[function(require,module,exports){
"use strict"

const Bullet = require('./bullet')
const RandomWalkCircleElement = require('./randomwalkcircleelement')
const ElementList = require('./elementlist')
const Stage = require('./stage')
const Burst = require('./burst')
const Word = require("./word")
const Validator = require('./validator')
const WordInputHandler = require('./wordinputhandler')
const Health = require("./health")
const SpawnerBoss = require("./spawnerboss")
const RegenerateBoss = require("./regenerateBoss")
const main = require("./main")


const SplitterBoss = require("./splitterBoss")
const AudioManager = require("./audioManager")
module.exports = class Game {

    intervalId = 0
    cometesCount = 0

    constructor() {
        this.raf;                       // request animation frame handle
        this.elementList =[];
        this.health = new Health();

        this.score = 0;
        this.currentInput = '';
        // Änderungen von Brian
        this.validator = new Validator();
        this.wordInputhander = new WordInputHandler();
        this.activeWordElement = null;
        this.wordInputhander.setLetterCallback(this.handleLetterInput.bind(this));
        this.isInputSet = false;
        this.isPaused = false;
        this.lastBossScore = 0;
        this.bossActive = false;
        this.audioManager = new AudioManager();
        this.generateInterval = 5000; 
        this.lastUpdateSore = 0;
        
    }

    //----------------------

    start() {
        this.elementList = new ElementList()
        if(!this.isInputSet) {
            this.isInputSet = true
            this.setupInput()
        }
        this.elementList.add(new Stage());  
        this.elementList.add(this.health);
    
        /*for (let i = 0; i < 60; i++) {
            setTimeout(() => {
                if(this.elementList != null) {
                    this.elementList.add(new RandomWalkCircleElement(this));
                } 
            }, 3000 * i);
        }*/
        this.generateCometes();

        this.elementList.add(new Stage())

        this.timeOfLastFrame = Date.now()
        this.raf = window.requestAnimationFrame(this.tick.bind(this))

        window.addEventListener("keydown", (e) => {
            if(e.key === "Escape"){
                if (!this.isPaused) {
                    this.pause();
                    
                }
                /*
                    else if(this.isPaused){
                    main.document.getElementById("main-menu").style.display = "none"
                    main.document.getElementById("continue-button").style.display = "none"
                    this.continue()
                }*/
            }
        });
      
    }

    generateCometes() {
        this.elementList.add(new RandomWalkCircleElement(this));
        this.intervalId = setInterval(() => {
            if(this.elementList != null) {
                this.elementList.add(new RandomWalkCircleElement(this));
            } 
            this.cometesCount++;
            if (this.cometesCount >= 10) {
                stopLoop();
            }
        }, this.generateInterval);
    }

    updateGenerateInterval() {
        if(this.score >0 && this.score % 5 == 0&&this.generateInterval > 1000 && this.lastUpdateSore != this.score) {
            this.lastUpdateSore = this.score;
            this.generateInterval -= 100;
            clearInterval(this.intervalId);
            this.generateCometes();
        }
        
    }

    stopGeneratingCometes() {
        clearInterval(this.intervalId);
        console.log("Loop stopped.");
    }

    stop() {
        window.cancelAnimationFrame(this.raf)
        this.elementList = null
    }

    pause() {
        this.isPaused = true
        this.stopGeneratingCometes()

        document.getElementById("main-menu").style.display = "flex"
        document.getElementById("continue-button").style.display = "flex"
        document.getElementById("exit-button").style.display = "flex"
        document.getElementById("mode-selection").style.display = "none";
    }

    continue() {
        this.isPaused = false
        this.generateCometes()
    }

    loadScores() {
        return JSON.parse(localStorage.getItem("highScores")) || [];
    }

    saveScore(name, score) {
        const scores = this.loadScores();
        scores.push({ name, score, date: Date.now() });
        scores.sort((a, b) => b.score - a.score);
        localStorage.setItem("highScores", JSON.stringify(scores.slice(0, 10)));
        
        document.getElementById("highscore-value").textContent = scores[0].score;
    }

    // menü nach tod einblinden 
    gameOver() {
       
        this.stop();
        this.stopGeneratingCometes()
        document.getElementById("main-menu").style.display = "flex";
        document.getElementById("home-button").style.display = "flex";
        document.getElementById("mode-selection").style.display = "none";
        document.getElementById("scoreblock").style.display = "flex";
        document.getElementById("scoreblock-value").textContent = this.score;
        document.getElementById("menu-title").textContent="Game Over";
        this.health = new Health();                                    // leben wieder zurück setzen 
        this.score = 0;
        this.updateUI();
        window.document.getElementById("join-highscore").disabled = false;
        
    }
    //----------------------

    tick() {
        let mycanvas = window.document.getElementById("mycanvas")
        let ctx = mycanvas.getContext('2d')
        ctx.font = "18px Arial";

        //--- clear screen
        //ctx.fillStyle = 'rgba(235, 250, 255, 0.1)' // alpha < 1 löscht den Bildschrim nur teilweise -> bewegte Gegenstände erzeugen Spuren
        //ctx.fillRect(0, 0, mycanvas.clientWidth, mycanvas.clientHeight)
        

        
        if(!document.hasFocus()) {
            this.pause()
        }

        //--- draw elements
        this.elementList.draw(ctx)

        if(!this.isPaused) {
            //--- execute elemenSt actions
            this.elementList.action()

            //--- check element collisions
            this.elementList.checkCollision()
        }
        this.spawnBoss();
        
        
        // Spieler tod ? 
        if (this.health.isDead()) {
            this.gameOver();
            this.audioManager.stopSound('background');
            this.audioManager.playSound('gameOver');
            return;
        }
        this.updateGenerateInterval();
        this.setBossInactive2();

        this.updateUI()

        this.raf = window.requestAnimationFrame(this.tick.bind(this))

    }
    
    
    


    isWordOnDisplay(word) {
        for (let i = 0; i < this.elementList.length; i++) {
            if(this.elementList[i] != null && this.elementList[i] instanceof Word && this.elementList[i].word.charAt(0) == word.charAt(0) ) {
                return true
            }
        }
        return false
    }
    
    setupInput() {
        document.addEventListener('keydown', (e) => {
//            if (e.key === 'Enter') this.shootToCircle()
            /*else*/ if (e.key === 'Backspace') this.currentInput = this.currentInput.slice(0, -1)
//            else if (/[a-zA-Z]/.test(e.key)) this.currentInput += e.key.toLowerCase()
            this.updateUI()
        })
    }

    shootToCircle() {
        if (!this.currentInput) return;
    
        // Finde das WORT in der elementList
        if(this.elementList != null) {
            const targetWord = this.elementList.find(el => 
                el instanceof Word && !el.hasCollided && el.word === this.getCurrentWord()
            )
        }
    
            if (!targetWord) return
    
        // Die Bullet fliegt zum CIRCLE-ELEMENT (nicht zum Wort)
        // targetWord.circleId ist die instanceId des Kreises
        this.elementList.add(new Bullet(
            targetWord.x,           // ZIEL X des Kreises
            targetWord.y,           // ZIEL Y des Kreises
            targetWord.circleId,    // Target ist der KREIS
            this
        ))
        this.currentInput = ''
    }

    getCurrentWord() {
        return this.currentInput
    }

    updateUI() {
        const el = id => document.getElementById(id)
        if (el('current-input')) el('current-input').textContent = this.getCurrentWord()
        if (el('score')) el('score').textContent = this.score
    }
    

handleLetterInput(letter) {
    // Wenn kein Wort aktiv ist, suche ein neues
    if (!this.activeWordElement) {
        this.findNewWord(letter);
    } 
    // Wenn Wort aktiv ist, tippe weiter
    else {
        this.continueTypingWord(letter);
    }
}

// Sucht ein neues Wort basierend auf erstem Buchstaben
findNewWord(firstLetter) {
    
    const activeWords = [];
    for (let i = 0; i < this.elementList.length; i++) {
        const el = this.elementList[i];
        if (el instanceof Word && !el.hasCollided) {
            activeWords.push(el);
        }
    }
    
    // Finde das ERSTE Wort das mit dem Buchstaben beginnt
    const matchingWord = activeWords.find(word => 
        //word.word.toLowerCase().startsWith(firstLetter)
        word.word.startsWith(firstLetter)
    );
    
    if (matchingWord) {
        this.activeWordElement = matchingWord;
        this.currentInput = firstLetter;
        
    }
}

    // Tippe am aktiven Wort weiter
    continueTypingWord(letter) {
        //const expectedNextLetter = this.activeWordElement.word.toLowerCase()[this.currentInput.length];
        const expectedNextLetter = this.activeWordElement.word[this.currentInput.length];
    
        // Prüfe ob der Buchstabe korrekt ist
        if (letter === expectedNextLetter) {
            this.currentInput += letter;
        
        
            // Prüfe ob Wort vollständig
            //if (this.currentInput === this.activeWordElement.word.toLowerCase()) {
            if (this.currentInput === this.activeWordElement.word) {
                this.onWordCompleted();
            }
            } else {
                // Falscher Buchstabe - Reset
                this.resetActiveWord(true);
        }
    }


    // Wort erfolgreich abgetippt
    onWordCompleted() {
        
        // Kugel auf den Kreis schießen
        const targetCircle = this.elementList.get(this.activeWordElement.circleId);
        if (targetCircle) {
            this.score++;
            this.elementList.add(new Bullet(
                targetCircle.x,
                targetCircle.y,
                this.activeWordElement.circleId,this));
        }
    
        this.resetActiveWord();
    }

    // Aktives Wort zurücksetzen
    resetActiveWord(mistake) {
        this.activeWordElement = null;
        this.currentInput = '';
        if(mistake) {
            document.getElementById("redScreen").style.opacity = "0.5";
            setTimeout(() => {
                document.getElementById("redScreen").style.opacity = "0";
            }, 300); 

            if (this.audioManager) {
            this.audioManager.playSound('error')
        }
        }
    }

    // Prüfe in jedem Frame ob aktives Wort noch existiert
    checkActiveWordValidity() {
        if (this.activeWordElement) {
            let wordStillExists = false;
        
            // Durchsuche die ElementList manuell
            for (let i = 0; i < this.elementList.length; i++) {
                const el = this.elementList[i];
                if (el === this.activeWordElement && !el.hasCollided) {
                    wordStillExists = true;
                    break;
                }
            }
        
            if (!wordStillExists) {
            
                this.resetActiveWord();
            }
        }
    }



spawnBoss() {
    if(this.bossActive){
        return;
    }
    if(this.score > 0 && this.score % 20 === 0 && this.score !== this.lastBossScore) {
        this.lastBossScore = this.score;
        this.bossActive = true;
        
        if(this.score  < 30){
            this.elementList.add(new SplitterBoss(this));
            //this.elementList.add(new SpawnerBoss(this));
            //this.elementList.add(new RegenerateBoss(this));
        }else if(this.score  < 60){
             //this.elementList.add(new SplitterBoss(this));
            //this.elementList.add(new SpawnerBoss(this));
            this.elementList.add(new RegenerateBoss(this)); 
        }else{
            this.elementList.add(new SplitterBoss(this));
            //this.elementList.add(new SpawnerBoss(this));
            //this.elementList.add(new RegenerateBoss(this));
        }
        
        
    }
    
}

setBossInactive2() {
    // schauen ob noch boss elemente in der elementlist oder auf dem bildschirm sind

    var bossFound = false;
     for (let i = 0; i < this.elementList.length; i++) {
        const el = this.elementList[i];
        if (el instanceof RegenerateBoss || el instanceof SpawnerBoss || el instanceof SplitterBoss) {
            bossFound = true;
            break
        }

     }
     this.bossActive = bossFound;
}




}

},{"./audioManager":1,"./bullet":2,"./burst":3,"./elementlist":6,"./health":8,"./main":10,"./randomwalkcircleelement":11,"./regenerateBoss":12,"./spawnerboss":13,"./splitterBoss":14,"./stage":15,"./validator":16,"./word":17,"./wordinputhandler":18}],8:[function(require,module,exports){
"use strict"

const Element = require('./element')
//const randomwalkcircleelement = require('./randomwalkcircleelement')

module.exports = class Health extends Element {

    constructor() {  
        super()            
        this.health = 3;
        this.heart = new Image();
        this.heart.src = 'img/heart.png';

        this.loaded = false; 
        this.heart.onload = () => {                    //ladet das bild heart
            this.loaded = true;
        };
    }
    
    draw(ctx){
        if (!this.loaded) return;                          //wenn das bild geladen ist sollte es die herzen zeichnen
        let x = 10;
        for(let i=0; i<this.health;i++){
            ctx.drawImage(this.heart,x,30,25,25);
            x+=30;
        }
    }
    addHealth(){
        this.health++;
    }
    reduce(){
       this.health--;
    }
    isDead() {
    return this.health <= 0;
}

    /*
      
    update() {                                                  // Überprüft den frame ob hasCollided = true 
        if (this.randomwalkcircleelement.hasCollided) {         
            this.health--;
            this.randomWalkCircleElement.hasCollided = false;  // setzt collided auf false so dass nur eine herz pro collision abgezogen wird 
        }
    }
         */ 
}

},{"./element":5}],9:[function(require,module,exports){
"use strict"

module.exports =  class InputField {
    static Inputlist = [];
    static  saveWords() {
        const input = document.getElementById("textInput").value;
        const neueWoerter = input
            .trim()
            .split(/[,\s]+/)            //filter 

        InputField.Inputlist.push(...neueWoerter); // am ende ovn inputlist hinzufügen. 

        // Ausgabe aktualisieren
        // document.getElementById("output").textContent = JSON.stringify(this.Inputlist, null);
    }
    
    static isEmpty(){
        return this.Inputlist.length == 0;
    }
}


},{}],10:[function(require,module,exports){
"use strict"
 
const Game = require("./game")
const InputField = require("./inputfield")
let myGame = new Game()

// canvas
window.onload = () => {
    if(myGame.loadScores().length != 0) {
        document.getElementById("highscore-value").textContent = myGame.loadScores()[0].score;
    }
    const ownWordsButton = window.document.getElementById("own-words");
    const speicherButton = window.document.getElementById("speicher-button"); 
    const modeEnglishButton = document.getElementById("mode-english");
    const modeGermanButton = document.getElementById("mode-german");
    const pauseButton = window.document.getElementById("pauseButton");
    const closeInputPopup = window.document.getElementById("close-input-popup");
    const closeHighscorePopup = window.document.getElementById("close-highscore-popup");
    const continueButton = window.document.getElementById("continue-button");
    const homeButton = window.document.getElementById("home-button");
    const exitButton = window.document.getElementById("exit-button");
    const showHighScoreListButton = window.document.getElementById("highscore-button");
    const joinHighScoreButton = window.document.getElementById("join-highscore");
    
    ownWordsButton.onclick = () => {
        document.getElementById("input-popup").style.display = "block";
    }

    speicherButton.onclick = () => {
        InputField.saveWords(); 
        document.getElementById("main-menu").style.display = "none";
        document.getElementById("input-popup").style.display = "none";
        myGame.audioManager.playSound('background')
        myGame.start();
    }

    // english
    modeEnglishButton.onclick = () => {
        myGame.gameMode = 'english';
        document.getElementById("main-menu").style.display = "none";
        myGame.audioManager.playSound('background')
        myGame.start();
    };
    
    // german
    modeGermanButton.onclick = () => {
        myGame.gameMode = 'german';
        document.getElementById("main-menu").style.display = "none";
        myGame.audioManager.playSound('background')
        myGame.start();
    };
    
    pauseButton.onclick = function() { 
        myGame.pause(); 
        document.getElementById("menu-title").textContent="Game Paused";
    }

    closeInputPopup.onclick = () => {
        document.getElementById("input-popup").style.display = "none";
    }

    closeHighscorePopup.onclick = () => {
        document.getElementById("highscore-popup").style.display = "none";
    }

    continueButton.onclick = () => {
        document.getElementById("main-menu").style.display = "none"
        document.getElementById("continue-button").style.display = "none"
        document.getElementById("exit-button").style.display = "none"
        myGame.continue()
    }

    exitButton.onclick = () => {
        document.getElementById("continue-button").style.display = "none"
        document.getElementById("exit-button").style.display = "none"
        myGame.continue()
        myGame.gameOver()
    }

    homeButton.onclick = () => {
        document.getElementById("mode-selection").style.display = "flex"
        document.getElementById("home-button").style.display = "none"
        document.getElementById("scoreblock").style.display = "none"
        document.getElementById("menu-title").textContent="TypeShooter";
    }

    showHighScoreListButton.onclick = () => {
        const list = document.getElementById("highscore-list");
        const scores = myGame.loadScores();

        document.getElementById("highscore-popup").style.display = "flex";
        list.innerHTML = ""; // clear old entries

        if (scores.length === 0) {
            const li = document.createElement("li");
            li.textContent = "No scores yet!";
            list.appendChild(li);
            return;
        }

        scores.forEach(({ name, score }) => {
            const li = document.createElement("li");
            li.textContent = `${name} – ${score}`;
            list.appendChild(li);
        });
    }

    joinHighScoreButton.onclick = () => {
        myGame.saveScore(document.getElementById('nameInput').value, document.getElementById('scoreblock-value').textContent);
        joinHighScoreButton.disabled = true;
    }
};

},{"./game":7,"./inputfield":9}],11:[function(require,module,exports){
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
},{"./burst":3,"./element":5,"./health":8,"./word":17}],12:[function(require,module,exports){
'use strict'

const RandomWalkCircleElement = require('./randomwalkcircleelement')
const ElementList = require('./elementlist')
const Burst = require('./burst')
const Word = require('./word')

module.exports = class RegenerateBoss extends RandomWalkCircleElement {
    constructor(game, health=3 ) {
        super(game)
        this.x = 300;
        this.speed = 0.2
        this.health = health;
        this.radius = 30;

        this.boss1 = new Image();
        this.boss1.src = 'img/heart.png'; //placeholder
        

    }

    draw(ctx) {
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
        ctx.beginPath()
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true)
            ctx.closePath()
            
            ctx.fillStyle =  "black"
            ctx.fill()
            */
    }

    bulletMet() {
        if(this.health > 1){
            this.health -= 1;
            const nextBoss = new RegenerateBoss(this.game, this.health );
            nextBoss.x = this.x;
            nextBoss.y = this.y;
            this.game.elementList.add(nextBoss);
            this.game.elementList.delete(this.instanceId)
        }else{
            this.health=3;
            this.hasCollided = true
            this.game.elementList.delete(this.instanceId)
            this.callBurst()
        }
        
    }
}
},{"./burst":3,"./elementlist":6,"./randomwalkcircleelement":11,"./word":17}],13:[function(require,module,exports){
'use strict'


const RandomWalkCircleElement = require('./randomwalkcircleelement')
const ElementList = require('./elementlist')    
const Burst = require('./burst')
const Word = require('./word')

module.exports = class SpawnerBoss extends RandomWalkCircleElement {

    /*constructor(game) {
        super(game)
        this.x = 300;
        this.speed = 0.15



        
        this.spawn();
        this.spawnInterval = 11000  // spawn every x seconds
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
                minion.x =  this.x + (i * 60 -30);; 
                minion.y = this.y +10;
                this.game.elementList.add(minion);

            }
        }
    }
     onCollision() {
        this.game.setBossInactive();
        this.hasCollided = true
        this.game.elementList.delete(this.instanceId)
        this.callBurst()
        this.game.health.reduce()   
    }

    bulletMet(){
        this.game.setBossInactive();
        super.bulletMet();
    }

     

}
},{"./burst":3,"./elementlist":6,"./randomwalkcircleelement":11,"./word":17}],14:[function(require,module,exports){
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


},{"./burst":3,"./element":5,"./elementlist":6,"./randomwalkcircleelement":11,"./word":17}],15:[function(require,module,exports){
"use strict"

const Element = require('./element')

module.exports = class Stage extends Element {

    /*constructor() {
        super()
        this.background = new Image()
        this.loaded = false

        this.background.onload = () => {
            this.loaded = true
        }

        this.background.src = 'img/neueHintergrund.png'
    }

    draw(ctx) {
        if (!this.loaded) return
        const canvas = ctx.canvas
        ctx.drawImage(this.background,0,0,canvas.width,canvas.height)
    }*/
    constructor() {
        super()
        this.x = 0
        this.y = 0
    }

    draw(ctx) {
        var img = new Image();
        img.onload = function() {
            ctx.drawImage(img, 0, 0);
        };
        img.src = 'img/neueHintergrund2.png';
    }

    action() {
        
    }
}

},{"./element":5}],16:[function(require,module,exports){
module.exports = class Validator {

constructor(){
  this.activeWord = "";
  this.currentInput = "";
  //this.currentSpot=0;
  //this.wordLocked = false;
}



setActiveWord(word){
    //this.activeWord = word.toLowerCase();
    this.activeWord = word;
    this.currentInput = ""
    //this.wordLocked = false;
    //this.currentSpot = 0;
}

checkLetter(letter){
    //const expectedChar = this.targetWord[this.currentSpot];
    if(/*!this.wordLocked ||*/ !this.activeWord){
        return false;    
    }

    const expectedChar = this.activeWord[this.currentInput.length];

    if(letter === expectedChar){
        this.currentInput += letter;
        return true;
    }
    return false;


}


isWordComplete(){
    return this.activeWord && this.currentInput === this.activeWord;
}
getActiveWord(){
    return this.activeWord;
}
reset(){
    this.currentInput = "";
    this.activeWord = null;
    //this.wordLocked = false;
}

getCurrentInput(){
    return this.currentInput;
}
hasActiveWord(){
    return this.activeWord !== "";
}

}
},{}],17:[function(require,module,exports){
"use strict"

const Element = require('./element')
const EnglishGermanDictionary = require('./dictionary')
const InputField = require('./inputfield')

module.exports = class Word extends Element {
    constructor(game, x, y, circleId, speed) {
        super()
        this.destroyed = false 
        this.game = game
        this.circleId = circleId
        this.speed = speed
        
        let dictionary = new EnglishGermanDictionary();
        if(InputField.Inputlist.length != 0) {
            dictionary.setWords(InputField.Inputlist);
            game.gameMode = "ownWords";
        }

        const randomIndex = Math.floor(Math.random() * dictionary.words.length);
        let englishWord = dictionary.words[randomIndex];
        
        if (game.gameMode === 'german') {
            this.displayWord = dictionary.translate(englishWord);
            this.word = englishWord;
        } else {
            this.displayWord = englishWord;
            this.word = englishWord;
        }
        
        while (game.isWordOnDisplay(this.word)) {
            const newIndex = Math.floor(Math.random() * dictionary.words.length);
            englishWord = dictionary.words[newIndex];
            
            if (game.gameMode === 'german') {
                this.displayWord = dictionary.translate(englishWord);
                this.word = englishWord;
            } else {
                this.displayWord = englishWord;
                this.word = englishWord;
            }
        }
        
        this.x = x - document.getElementById("mycanvas").getContext('2d').measureText(this.displayWord).width / 2 //this.displayWord.length*8/2
        this.y = y + 30
    }

    draw(ctx) {
        let currentInput = document.getElementById("current-input")
        if(currentInput.textContent.at(0) == this.displayWord.at(0)) {
            let currentInputLength = currentInput.textContent.length
            const firstPart = this.displayWord.slice(0, currentInputLength);
            const restPart  = this.displayWord.slice(currentInputLength);
            const typedTextWidth = ctx.measureText(firstPart).width;

            ctx.fillStyle = "grey";
            ctx.fillText(firstPart, this.x, this.y);
            
            ctx.fillStyle = "white"
            ctx.fillText(restPart, this.x + typedTextWidth, this.y);
        } else {
            ctx.fillStyle = "white"
            ctx.fillText(this.displayWord, this.x, this.y);
        }
    }

    action() {
        //this.x += Math.random() * 2 - 1
        this.y += this.speed
            if (this.y > window.innerHeight - 80) this.destroyed = true
    }

    checkCollision() {
        if (this.game.elementList.get(this.circleId) == null) { //if it is null, that means the circle has collided
            this.onCollision()
        }
    }

    onCollision() {
        this.hasCollided = true
        this.game.elementList.delete(this.instanceId);
    }

}

},{"./dictionary":4,"./element":5,"./inputfield":9}],18:[function(require,module,exports){
'use strict'

module.exports = class WordInputHandler{

    constructor(){
        this.inputLine= null;
        document.addEventListener('keydown', this.handleInput.bind(this));
    }

    setLetterCallback(callback){
        this.inputLine = callback;
    }

    handleInput(event){
      //  if(event.key.length==1 && /[a-zA-Z]/.test(event.key)){ // orginale 
      if (event.key.length === 1 && /\p{L}/u.test(event.key)) { // Alle ASCII regestrierte buchstaben

            const letter= event.key.toLowerCase();

            if(this.inputLine){
                this.inputLine(letter);
            }   
            
        }
    }
    
    /*
    notify(letter){
        //hier werden die anderen klassen von dem neuen buchstaben notifiert
        // evtl überflüssig
    }

    getInput(){
        return this.input;
    }

    resetInput(){
        this.input= "";
    }*/
}
},{}]},{},[10]);
