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
        this.x = 300
        this.y = 465
        
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
        ctx.fillStyle = '#ff0'
        ctx.beginPath()
        ctx.arc(this.x, this.y, 5, 0, Math.PI * 2)
        ctx.fill()
        
        ctx.shadowBlur = 10
        ctx.shadowColor = '#ff0'
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
            "strong": "stark", "summer": "Sommer", "sun": "Sonne", "sweet": "süß",

            "table": "Tisch", "teacher": "Lehrer", "tea": "Tee", "team": "Team",
            "ten": "zehn", "test": "Test", "thing": "Ding", "thought": "Gedanke",
            "time": "Zeit", "tired": "müde", "tomorrow": "morgen", "town": "Stadt",
            "tree": "Baum", "train": "Zug", "travel": "reisen",

            "under": "unter", "uncle": "Onkel", "up": "hoch", "use": "benutzen",

            "village": "Dorf", "voice": "Stimme",

            "walk": "gehen", "warm": "warm", "water": "Wasser", "way": "Weg",
            "week": "Woche", "welcome": "willkommen", "white": "weiß",
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

},{"./audioManager":1,"./bullet":2,"./burst":3,"./elementlist":6,"./health":8,"./randomwalkcircleelement":11,"./regenerateBoss":12,"./spawnerboss":13,"./splitterBoss":14,"./stage":15,"./validator":16,"./word":17,"./wordinputhandler":18}],8:[function(require,module,exports){
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
        
        if (this.health >= 1) {
            ctx.drawImage(this.heart, 10,30,25,25);
        }
        if (this.health >= 2) {
            ctx.drawImage(this.heart, 40,30,25,25);
        }
        if (this.health >= 3) {
            ctx.drawImage(this.heart, 70,30,25,25);
        }
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
        myGame.continue()
    }

    homeButton.onclick = () => {
        document.getElementById("mode-selection").style.display = "flex"
        document.getElementById("home-button").style.display = "none"
        document.getElementById("scoreblock").style.display = "none"
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
        const baseSpeed = 0.7;
        const speedIncrease = Math.floor(this.game.score / 5) * 0.075;
        this.speed = Math.min(baseSpeed + speedIncrease, 100.0)
        
        setTimeout(() => { 
            let word = new Word(this.game, this.x, this.y, this.instanceId, this.speed)
            this.game.elementList.add(word)
        }, 100);
        
    }

    draw(ctx) {
            ctx.beginPath()
            ctx.arc(this.x, this.y, 15, 0, Math.PI * 2, true)
            ctx.closePath()
            
            ctx.fillStyle =  "grey"
            ctx.fill()

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
       

    }

    draw(ctx) {
        ctx.beginPath()
            ctx.arc(this.x, this.y, 30, 0, Math.PI * 2, true)
            ctx.closePath()
            
            ctx.fillStyle =  "black"
            ctx.fill()
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

    constructor(game) {
        super(game)
        this.x = 300;
        this.speed = 0.15



        
        this.spawn();
        this.spawnInterval = 11000  // spawn every x seconds
        this.lastSpawnTime = Date.now();
        
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

    constructor() {
        super()
        this.x = 0
        this.y = 0
    }

    draw(ctx) {
        var img = new Image();
        img.onload = function() {
            ctx.drawImage(img, 0, 0);
        }
        img.src = 'img/background.png';
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
},{}]},{},[10])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJnYW1lL2F1ZGlvTWFuYWdlci5qcyIsImdhbWUvYnVsbGV0LmpzIiwiZ2FtZS9idXJzdC5qcyIsImdhbWUvZGljdGlvbmFyeS5qcyIsImdhbWUvZWxlbWVudC5qcyIsImdhbWUvZWxlbWVudGxpc3QuanMiLCJnYW1lL2dhbWUuanMiLCJnYW1lL2hlYWx0aC5qcyIsImdhbWUvaW5wdXRmaWVsZC5qcyIsImdhbWUvbWFpbi5qcyIsImdhbWUvcmFuZG9td2Fsa2NpcmNsZWVsZW1lbnQuanMiLCJnYW1lL3JlZ2VuZXJhdGVCb3NzLmpzIiwiZ2FtZS9zcGF3bmVyYm9zcy5qcyIsImdhbWUvc3BsaXR0ZXJCb3NzLmpzIiwiZ2FtZS9zdGFnZS5qcyIsImdhbWUvdmFsaWRhdG9yLmpzIiwiZ2FtZS93b3JkLmpzIiwiZ2FtZS93b3JkaW5wdXRoYW5kbGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0tBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIndXNlIHN0cmljdCdcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgQXVkaW9NYW5hZ2VyIHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHRoaXMuc291bmRzPSB7fTtcclxuICAgICAgICB0aGlzLm11dGVkPSBmYWxzZTtcclxuICAgICAgICB0aGlzLnNvdW5kcy5leHBsb3Npb24gPSBuZXcgQXVkaW8oJ3NvdW5kcy9leHBsb3Npb24ubXAzJyk7XHJcbiAgICAgICAgdGhpcy5zb3VuZHMubGFzZXIgPSBuZXcgQXVkaW8oJ3NvdW5kcy9sYXNlclNob3QubXAzJyk7XHJcbiAgICAgICAgdGhpcy5zb3VuZHMuZXJyb3IgPSBuZXcgQXVkaW8oJ3NvdW5kcy9lcnJvci5tcDMnKTtcclxuICAgICAgICB0aGlzLnNvdW5kcy5iYWNrZ3JvdW5kID0gbmV3IEF1ZGlvKCdzb3VuZHMvYmFja2dyb3VuZC5tcDMnKTtcclxuICAgICAgICB0aGlzLnNvdW5kcy5nYW1lT3ZlciA9IG5ldyBBdWRpbygnc291bmRzL2dhbWVPdmVyLm1wMycpXHJcblxyXG5cclxuICAgICAgICAvL1NvdW5kcyBsYWRlblxyXG4gICAgICAgIE9iamVjdC52YWx1ZXModGhpcy5zb3VuZHMpLmZvckVhY2goc291bmQgPT4ge1xyXG4gICAgICAgICAgICBzb3VuZC5wcmVsb2FkID0gJ2F1dG8nO1xyXG4gICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgLy9Ub25laW5zdGVsbHVuZ2VuXHJcbiAgICAgICAgdGhpcy5zb3VuZHMuZXhwbG9zaW9uLnZvbHVtZSA9IDAuNDtcclxuICAgICAgICB0aGlzLnNvdW5kcy5sYXNlci52b2x1bWUgPSAwLjAzO1xyXG4gICAgICAgIHRoaXMuc291bmRzLmVycm9yLnZvbHVtZSA9IDAuNTtcclxuICAgICAgICB0aGlzLnNvdW5kcy5iYWNrZ3JvdW5kLnZvbHVtZSA9IDAuMTtcclxuICAgICAgICB0aGlzLnNvdW5kcy5nYW1lT3Zlci52b2x1bWUgPSAwLjE7XHJcbiAgICAgICAgdGhpcy5zb3VuZHMuYmFja2dyb3VuZC5sb29wID0gdHJ1ZTtcclxuICAgICAgICBcclxuXHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgcGxheVNvdW5kKG5hbWUpe1xyXG4gICAgICAgIGlmKCF0aGlzLm11dGVkICYmIHRoaXMuc291bmRzW25hbWVdKXtcclxuICAgICAgICAgICAgdGhpcy5zb3VuZHNbbmFtZV0uY3VycmVudFRpbWUgPSAwO1xyXG4gICAgICAgICAgICB0aGlzLnNvdW5kc1tuYW1lXS5wbGF5KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0b3BTb3VuZChuYW1lKXtcclxuICAgICAgICBpZih0aGlzLnNvdW5kc1tuYW1lXSl7XHJcbiAgICAgICAgICAgIHRoaXMuc291bmRzW25hbWVdLnBhdXNlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuc291bmRzW25hbWVdLmN1cnJlbnRUaW1lID0gMDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59IiwiY29uc3QgRWxlbWVudCA9IHJlcXVpcmUoJy4vZWxlbWVudCcpXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIEJ1bGxldCBleHRlbmRzIEVsZW1lbnQge1xyXG4gICAgY29uc3RydWN0b3IodGFyZ2V0WCwgdGFyZ2V0WSwgdGFyZ2V0SWQsIGdhbWUpIHtcclxuICAgICAgICBzdXBlcigpXHJcbiAgICAgICAgLy8gU3RhcnRwb3NpdGlvbjogRmVzdCwgd2llIGR1IHdpbGxzdFxyXG4gICAgICAgIHRoaXMueCA9IDMwMFxyXG4gICAgICAgIHRoaXMueSA9IDQ2NVxyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMudGFyZ2V0WCA9IHRhcmdldFhcclxuICAgICAgICB0aGlzLnRhcmdldFkgPSB0YXJnZXRZXHJcbiAgICAgICAgdGhpcy50YXJnZXRJZCA9IHRhcmdldElkICAvLyBpbnN0YW5jZUlkIGRlcyBaSUVMLUtyZWlzZXNcclxuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lXHJcbiAgICAgICAgdGhpcy5oYXNDb2xsaWRlZCA9IGZhbHNlXHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gUmljaHR1bmdzdmVrdG9yXHJcbiAgICAgICAgY29uc3QgZHggPSB0YXJnZXRYIC0gdGhpcy54XHJcbiAgICAgICAgY29uc3QgZHkgPSB0YXJnZXRZIC0gdGhpcy55XHJcbiAgICAgICAgY29uc3QgZGlzdCA9IE1hdGguaHlwb3QoZHgsIGR5KSB8fCAxXHJcbiAgICAgICAgdGhpcy52eCA9IChkeCAvIGRpc3QpICogOFxyXG4gICAgICAgIHRoaXMudnkgPSAoZHkgLyBkaXN0KSAqIDhcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZ2FtZSAmJiB0aGlzLmdhbWUuYXVkaW9NYW5hZ2VyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5hdWRpb01hbmFnZXIucGxheVNvdW5kKCdsYXNlcicpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGRyYXcoY3R4KSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaGFzQ29sbGlkZWQpIHJldHVyblxyXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSAnI2ZmMCdcclxuICAgICAgICBjdHguYmVnaW5QYXRoKClcclxuICAgICAgICBjdHguYXJjKHRoaXMueCwgdGhpcy55LCA1LCAwLCBNYXRoLlBJICogMilcclxuICAgICAgICBjdHguZmlsbCgpXHJcbiAgICAgICAgXHJcbiAgICAgICAgY3R4LnNoYWRvd0JsdXIgPSAxMFxyXG4gICAgICAgIGN0eC5zaGFkb3dDb2xvciA9ICcjZmYwJ1xyXG4gICAgICAgIGN0eC5maWxsKClcclxuICAgICAgICBjdHguc2hhZG93Qmx1ciA9IDBcclxuICAgIH1cclxuXHJcbiAgICBhY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaGFzQ29sbGlkZWQpIHJldHVyblxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIFppZWwtS3JlaXMtUG9zaXRpb24gYWt0dWFsaXNpZXJlbiAoZXIgYmV3ZWd0IHNpY2ghKVxyXG4gICAgICAgIGNvbnN0IHRhcmdldCA9IHRoaXMuZ2FtZS5lbGVtZW50TGlzdC5nZXQodGhpcy50YXJnZXRJZClcclxuICAgICAgICBpZiAodGFyZ2V0KSB7XHJcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0WCA9IHRhcmdldC54XHJcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0WSA9IHRhcmdldC55XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjb25zdCBkeCA9IHRoaXMudGFyZ2V0WCAtIHRoaXMueFxyXG4gICAgICAgICAgICBjb25zdCBkeSA9IHRoaXMudGFyZ2V0WSAtIHRoaXMueVxyXG4gICAgICAgICAgICBjb25zdCBkaXN0ID0gTWF0aC5oeXBvdChkeCwgZHkpIHx8IDFcclxuICAgICAgICAgICAgdGhpcy52eCA9IChkeCAvIGRpc3QpICogOFxyXG4gICAgICAgICAgICB0aGlzLnZ5ID0gKGR5IC8gZGlzdCkgKiA4XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMueCArPSB0aGlzLnZ4XHJcbiAgICAgICAgdGhpcy55ICs9IHRoaXMudnlcclxuICAgIH1cclxuXHJcbiAgICBjaGVja0NvbGxpc2lvbigpIHtcclxuICAgICAgICBpZiAodGhpcy5nYW1lLmVsZW1lbnRMaXN0LmdldCh0aGlzLnRhcmdldElkKSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMub25Db2xsaXNpb24oKVxyXG4gICAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgZGlzdCA9IE1hdGguaHlwb3QodGhpcy50YXJnZXRYIC0gdGhpcy54LCB0aGlzLnRhcmdldFkgLSB0aGlzLnkpXHJcbiAgICAgICAgaWYgKGRpc3QgPCAxNSkge1xyXG4gICAgICAgICAgICB0aGlzLm9uQ29sbGlzaW9uKClcclxuICAgICAgICAgICAgdGhpcy5nYW1lLmVsZW1lbnRMaXN0LmdldCh0aGlzLnRhcmdldElkKS5idWxsZXRNZXQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMueCA8IDAgfHwgdGhpcy54ID4gd2luZG93LmlubmVyV2lkdGggfHwgXHJcbiAgICAgICAgICAgIHRoaXMueSA8IDAgfHwgdGhpcy55ID4gd2luZG93LmlubmVySGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIHRoaXMub25Db2xsaXNpb24oKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBvbkNvbGxpc2lvbigpIHtcclxuICAgICAgICB0aGlzLmhhc0NvbGxpZGVkID0gdHJ1ZVxyXG4gICAgICAgIHRoaXMuZ2FtZS5lbGVtZW50TGlzdC5kZWxldGUodGhpcy5pbnN0YW5jZUlkKVxyXG4gICAgfVxyXG59XHJcbiIsIlwidXNlIHN0cmljdFwiXHJcblxyXG5jb25zdCBFbGVtZW50ID0gcmVxdWlyZSgnLi9lbGVtZW50JylcclxuY29uc3QgRWxlbWVudExpc3QgPSByZXF1aXJlKCcuL2VsZW1lbnRsaXN0JylcclxuY29uc3QgR2FtZSA9IHJlcXVpcmUoJy4vZ2FtZScpXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIEJ1cnN0IGV4dGVuZHMgRWxlbWVudCB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoeCwgeSwgZ2FtZSkge1xyXG4gICAgICAgIHN1cGVyKClcclxuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lXHJcbiAgICAgICAgdGhpcy54ID0geFxyXG4gICAgICAgIHRoaXMueSA9IHlcclxuICAgICAgICB0aGlzLnNpemUgPSAxNSAgXHJcblxyXG4gICAgICAgIGlmICh0aGlzLmdhbWUgJiYgdGhpcy5nYW1lLmF1ZGlvTWFuYWdlcikge1xyXG4gICAgICAgICAgICB0aGlzLmdhbWUuYXVkaW9NYW5hZ2VyLnBsYXlTb3VuZCgnZXhwbG9zaW9uJylcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jaGVja0NvbGxpc2lvbigpXHJcblxyXG4gICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIGRyYXcoY3R4KSB7XHJcbiAgICAgICAgdmFyIGltZyA9IG5ldyBJbWFnZSgpO1xyXG4gICAgICAgIGltZy5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGN0eC5kcmF3SW1hZ2UoaW1nLCB0aGlzLnggLSAxMCwgdGhpcy55IC0gMTAsIDMwLCAzMCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBpbWcuc3JjID0gJ2ltZy9leHBsb3Npb24ucG5nJztcclxuICAgIH1cclxuXHJcbiAgICBhY3Rpb24oKSB7XHJcbiAgICAgICAgLy90aGlzLnggKz0gTWF0aC5yYW5kb20oKSAqIDIgLSAxXHJcbiAgICB9XHJcbiAgICBcclxuICAgIGNoZWNrQ29sbGlzaW9uKCkgeyBcclxuICAgICAgICBpZih0aGlzLmluc3RhbmNlSWQgIT0gLTEpIHtcclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uQ29sbGlzaW9uKClcclxuICAgICAgICAgICAgfSwgNzAwKTsgIFxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBvbkNvbGxpc2lvbigpIHtcclxuICAgICAgICB0aGlzLmhhc0NvbGxpZGVkID0gdHJ1ZVxyXG4gICAgICAgIHRoaXMuZ2FtZS5lbGVtZW50TGlzdC5kZWxldGUodGhpcy5pbnN0YW5jZUlkKVxyXG4gICAgfVxyXG59IiwiY2xhc3MgRW5nbGlzaEdlcm1hbkRpY3Rpb25hcnkge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcblxyXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgICAgIC8vIPCflLkgMS4gRW5nbGlzY2hlIFfDtnJ0ZXJsaXN0ZSAoTlVSIEVuZ2xpc2ggV29yZHMpXHJcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAgICAgdGhpcy53b3JkcyA9IFsgLy9saXN0ZSAxIFxyXG4gICAgICAgICAgICBcImFwcGxlXCIsIFwiYW5pbWFsXCIsIFwiYW5zd2VyXCIsIFwiYWlyXCIsIFwiYWdlXCIsIFwiYXJlYVwiLCBcImFybVwiLCBcImFza1wiLFxyXG4gICAgICAgICAgICBcImFsd2F5c1wiLCBcImFueXRoaW5nXCIsXHJcbiAgICAgICAgICAgIFwiYmFieVwiLCBcImJhZ1wiLCBcImJhbGxcIiwgXCJiYW5rXCIsIFwiYmF0aFwiLCBcImJlYWNoXCIsIFwiYmVhclwiLCBcImJlYXV0aWZ1bFwiLFxyXG4gICAgICAgICAgICBcImJlY2F1c2VcIiwgXCJiZWRcIiwgXCJiZWVyXCIsIFwiYmVmb3JlXCIsIFwiYmVnaW5cIiwgXCJiZWhpbmRcIiwgXCJiaWdcIiwgXCJiaXJkXCIsXHJcbiAgICAgICAgICAgIFwiYmlydGhkYXlcIiwgXCJibGFja1wiLCBcImJsb29kXCIsIFwiYmx1ZVwiLCBcImJvb2tcIiwgXCJib290XCIsIFwiYnJlYWRcIixcclxuICAgICAgICAgICAgXCJicmVha1wiLCBcImJyb3RoZXJcIixcclxuICAgICAgICAgICAgXCJjYWtlXCIsIFwiY2FyXCIsIFwiY2F0XCIsIFwiY2hhaXJcIiwgXCJjaGVlc2VcIiwgXCJjaGlsZFwiLCBcImNpdHlcIiwgXCJjbGVhblwiLFxyXG4gICAgICAgICAgICBcImNsb3NlXCIsIFwiY2xvdWRcIiwgXCJjb2ZmZWVcIiwgXCJjb2xkXCIsIFwiY29sb3JcIiwgXCJjb3VudHJ5XCIsIFwiY3VwXCIsXHJcbiAgICAgICAgICAgIFwiZGF5XCIsIFwiZGFkXCIsIFwiZGFuY2VcIiwgXCJkYXJrXCIsIFwiZGF1Z2h0ZXJcIiwgXCJkZWFkXCIsIFwiZGVhclwiLCBcImRlZXBcIixcclxuICAgICAgICAgICAgXCJkZXNrXCIsIFwiZGlubmVyXCIsIFwiZG9nXCIsIFwiZG9vclwiLCBcImRyZWFtXCIsIFwiZHJpbmtcIiwgXCJkcml2ZVwiLFxyXG4gICAgICAgICAgICBcImVhclwiLCBcImVhcnRoXCIsIFwiZWFzeVwiLCBcImVhdFwiLCBcImVnZ1wiLCBcImVuZXJneVwiLCBcImV2ZW5pbmdcIiwgXCJleWVcIixcclxuICAgICAgICAgICAgXCJldmVyeXRoaW5nXCIsXHJcbiAgICAgICAgICAgIFwiZmFjZVwiLCBcImZhbWlseVwiLCBcImZhclwiLCBcImZhcm1cIiwgXCJmYXN0XCIsIFwiZmF0aGVyXCIsIFwiZmVldFwiLCBcImZpZ2h0XCIsXHJcbiAgICAgICAgICAgIFwiZmlyZVwiLCBcImZpc2hcIiwgXCJmbG9vclwiLCBcImZsb3dlclwiLCBcImZvb2RcIiwgXCJmb290XCIsIFwiZnJpZW5kXCIsXHJcbiAgICAgICAgICAgIFwiZ2FyZGVuXCIsIFwiZ2lybFwiLCBcImdsYXNzXCIsIFwiZ29cIiwgXCJnb29kXCIsIFwiZ3JlZW5cIiwgXCJncm91bmRcIiwgXCJncm91cFwiLFxyXG4gICAgICAgICAgICBcImhhaXJcIiwgXCJoYW5kXCIsIFwiaGFuZ1wiLCBcImhhcHB5XCIsIFwiaGF0XCIsIFwiaGVhZFwiLCBcImhlYWx0aFwiLCBcImhlYXJ0XCIsXHJcbiAgICAgICAgICAgIFwiaGVhdFwiLCBcImhlYXZ5XCIsIFwiaGVsbG9cIiwgXCJoZXJlXCIsIFwiaGlnaFwiLCBcImhvbWVcIiwgXCJob3JzZVwiLCBcImhvdXNlXCIsXHJcbiAgICAgICAgICAgIFwiaWNlXCIsIFwiaWRlYVwiLCBcImlsbFwiLCBcImltcG9ydGFudFwiLCBcImluc2lkZVwiLCBcImlzbGFuZFwiLFxyXG4gICAgICAgICAgICBcImpvYlwiLCBcImp1aWNlXCIsIFwianVtcFwiLFxyXG4gICAgICAgICAgICBcImtleVwiLCBcImtpbGxcIiwgXCJraW5nXCIsIFwia2l0Y2hlblwiLCBcImtpc3NcIiwgXCJrbm93XCIsXHJcbiAgICAgICAgICAgIFwibGFrZVwiLCBcImxhbmRcIiwgXCJsYW5ndWFnZVwiLCBcImxhcmdlXCIsIFwibGF1Z2hcIiwgXCJsZWFyblwiLCBcImxlZnRcIixcclxuICAgICAgICAgICAgXCJsZWdcIiwgXCJsaWZlXCIsIFwibGlnaHRcIiwgXCJsaWtlXCIsIFwibGlvblwiLCBcImxpdHRsZVwiLCBcImxvbmdcIiwgXCJsb3ZlXCIsXHJcbiAgICAgICAgICAgIFwibWFjaGluZVwiLCBcIm1ha2VcIiwgXCJtYW5cIiwgXCJtYW55XCIsIFwibWlsa1wiLCBcIm1pbnV0ZVwiLCBcIm1vbmV5XCIsXHJcbiAgICAgICAgICAgIFwibW9udGhcIiwgXCJtb3JuaW5nXCIsIFwibW90aGVyXCIsIFwibW91bnRhaW5cIixcclxuICAgICAgICAgICAgXCJuYW1lXCIsIFwibmF0aW9uXCIsIFwibmVhclwiLCBcIm5lY2tcIiwgXCJuaWdodFwiLCBcIm5vaXNlXCIsIFwibm9ydGhcIixcclxuICAgICAgICAgICAgXCJvY2VhblwiLCBcIm9mZlwiLCBcIm9mZmljZVwiLCBcIm9pbFwiLCBcIm9sZFwiLCBcIm9wZW5cIiwgXCJvcmFuZ2VcIiwgXCJvcmRlclwiLFxyXG4gICAgICAgICAgICBcInBhZ2VcIiwgXCJwYXBlclwiLCBcInBhcmVudFwiLCBcInBhcmtcIiwgXCJwYXJ0eVwiLCBcInBlblwiLCBcInBlb3BsZVwiLFxyXG4gICAgICAgICAgICBcInBob25lXCIsIFwicGljdHVyZVwiLCBcInBsYWNlXCIsIFwicGxhbnRcIiwgXCJwbGF5XCIsIFwicG9ja2V0XCIsIFwicG9saWNlXCIsXHJcbiAgICAgICAgICAgIFwicG90YXRvXCIsIFwicHJvYmxlbVwiLFxyXG4gICAgICAgICAgICBcInF1ZWVuXCIsIFwicXVlc3Rpb25cIixcclxuICAgICAgICAgICAgXCJyYWluXCIsIFwicmVzdGF1cmFudFwiLCBcInJlZFwiLCBcInJpZ2h0XCIsIFwicml2ZXJcIiwgXCJyb2FkXCIsIFwicm9vbVwiLCBcInJ1blwiLFxyXG4gICAgICAgICAgICBcInNhbHRcIiwgXCJzYW5kXCIsIFwic2Nob29sXCIsIFwic2VhXCIsIFwic2Vhc29uXCIsIFwic2VlXCIsIFwic2hpcnRcIixcclxuICAgICAgICAgICAgXCJzaG9lXCIsIFwic2hvcFwiLCBcInNob3J0XCIsIFwic2xlZXBcIiwgXCJzbG93XCIsIFwic21hbGxcIiwgXCJzbWlsZVwiLCBcInNub3dcIixcclxuICAgICAgICAgICAgXCJzb25cIiwgXCJzb3VuZFwiLCBcInNvdXBcIiwgXCJzcG9ydFwiLCBcInNwcmluZ1wiLCBcInN0YXJcIiwgXCJzdG9uZVwiLFxyXG4gICAgICAgICAgICBcInN0cmVldFwiLCBcInN0cm9uZ1wiLCBcInN1bW1lclwiLCBcInN1blwiLCBcInN3ZWV0XCIsXHJcbiAgICAgICAgICAgIFwidGFibGVcIiwgXCJ0ZWFjaGVyXCIsIFwidGVhXCIsIFwidGVhbVwiLCBcInRlblwiLCBcInRlc3RcIiwgXCJ0aGluZ1wiLFxyXG4gICAgICAgICAgICBcInRob3VnaHRcIiwgXCJ0aW1lXCIsIFwidGlyZWRcIiwgXCJ0b21vcnJvd1wiLCBcInRvd25cIiwgXCJ0cmVlXCIsIFwidHJhaW5cIixcclxuICAgICAgICAgICAgXCJ0cmF2ZWxcIixcclxuICAgICAgICAgICAgXCJ1bmRlclwiLCBcInVuY2xlXCIsIFwidXBcIiwgXCJ1c2VcIixcclxuICAgICAgICAgICAgXCJ2aWxsYWdlXCIsIFwidm9pY2VcIixcclxuICAgICAgICAgICAgXCJ3YWxrXCIsIFwid2FybVwiLCBcIndhdGVyXCIsIFwid2F5XCIsIFwid2Vla1wiLCBcIndlbGNvbWVcIiwgXCJ3aGl0ZVwiLFxyXG4gICAgICAgICAgICBcIndpbmRvd1wiLCBcIndpbmRcIiwgXCJ3aW50ZXJcIiwgXCJ3b21hblwiLCBcIndvcmRcIiwgXCJ3b3JrXCIsIFwid29ybGRcIixcclxuICAgICAgICAgICAgXCJ3cml0ZVwiLFxyXG4gICAgICAgICAgICBcInllYXJcIiwgXCJ5ZWxsb3dcIiwgXCJ5b3VuZ1wiLFxyXG4gICAgICAgICAgICBcInpvb1wiXHJcbiAgICAgICAgXTtcclxuXHJcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAgICAgLy8g8J+UuSAyLiBFbmdsaXNjaGUgV8O2cnRlciDihpIgRGV1dHNjaGUgw5xiZXJzZXR6dW5nZW5cclxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgICAgICB0aGlzLnRyYW5zbGF0aW9ucyA9IHtcclxuICAgICAgICAgICAgXCJhcHBsZVwiOiBcIkFwZmVsXCIsIFwiYW5pbWFsXCI6IFwiVGllclwiLCBcImFuc3dlclwiOiBcIkFudHdvcnRcIiwgXCJhaXJcIjogXCJMdWZ0XCIsXHJcbiAgICAgICAgICAgIFwiYWdlXCI6IFwiQWx0ZXJcIiwgXCJhcmVhXCI6IFwiQmVyZWljaFwiLCBcImFybVwiOiBcIkFybVwiLCBcImFza1wiOiBcImZyYWdlblwiLFxyXG4gICAgICAgICAgICBcImFsd2F5c1wiOiBcImltbWVyXCIsIFwiYW55dGhpbmdcIjogXCJldHdhc1wiLFxyXG5cclxuICAgICAgICAgICAgXCJiYWJ5XCI6IFwiQmFieVwiLCBcImJhZ1wiOiBcIlRhc2NoZVwiLCBcImJhbGxcIjogXCJCYWxsXCIsIFwiYmFua1wiOiBcIkJhbmtcIixcclxuICAgICAgICAgICAgXCJiYXRoXCI6IFwiQmFkXCIsIFwiYmVhY2hcIjogXCJTdHJhbmRcIiwgXCJiZWFyXCI6IFwiQsOkclwiLCBcImJlYXV0aWZ1bFwiOiBcInNjaMO2blwiLFxyXG4gICAgICAgICAgICBcImJlY2F1c2VcIjogXCJ3ZWlsXCIsIFwiYmVkXCI6IFwiQmV0dFwiLCBcImJlZXJcIjogXCJCaWVyXCIsIFwiYmVmb3JlXCI6IFwidm9yaGVyXCIsXHJcbiAgICAgICAgICAgIFwiYmVnaW5cIjogXCJiZWdpbm5lblwiLCBcImJlaGluZFwiOiBcImhpbnRlclwiLCBcImJpZ1wiOiBcImdyb8OfXCIsIFwiYmlyZFwiOiBcIlZvZ2VsXCIsXHJcbiAgICAgICAgICAgIFwiYmlydGhkYXlcIjogXCJHZWJ1cnRzdGFnXCIsIFwiYmxhY2tcIjogXCJzY2h3YXJ6XCIsIFwiYmxvb2RcIjogXCJCbHV0XCIsXHJcbiAgICAgICAgICAgIFwiYmx1ZVwiOiBcImJsYXVcIiwgXCJib29rXCI6IFwiQnVjaFwiLCBcImJvb3RcIjogXCJTdGllZmVsXCIsIFwiYnJlYWRcIjogXCJCcm90XCIsXHJcbiAgICAgICAgICAgIFwiYnJlYWtcIjogXCJQYXVzZVwiLCBcImJyb3RoZXJcIjogXCJCcnVkZXJcIixcclxuXHJcbiAgICAgICAgICAgIFwiY2FrZVwiOiBcIkt1Y2hlblwiLCBcImNhclwiOiBcIkF1dG9cIiwgXCJjYXRcIjogXCJLYXR6ZVwiLCBcImNoYWlyXCI6IFwiU3R1aGxcIixcclxuICAgICAgICAgICAgXCJjaGVlc2VcIjogXCJLw6RzZVwiLCBcImNoaWxkXCI6IFwiS2luZFwiLCBcImNpdHlcIjogXCJTdGFkdFwiLCBcImNsZWFuXCI6IFwic2F1YmVyXCIsXHJcbiAgICAgICAgICAgIFwiY2xvc2VcIjogXCJzY2hsaWXDn2VuXCIsIFwiY2xvdWRcIjogXCJXb2xrZVwiLCBcImNvZmZlZVwiOiBcIkthZmZlZVwiLFxyXG4gICAgICAgICAgICBcImNvbGRcIjogXCJrYWx0XCIsIFwiY29sb3JcIjogXCJGYXJiZVwiLCBcImNvdW50cnlcIjogXCJMYW5kXCIsIFwiY3VwXCI6IFwiVGFzc2VcIixcclxuXHJcbiAgICAgICAgICAgIFwiZGF5XCI6IFwiVGFnXCIsIFwiZGFkXCI6IFwiUGFwYVwiLCBcImRhbmNlXCI6IFwidGFuemVuXCIsIFwiZGFya1wiOiBcImR1bmtlbFwiLFxyXG4gICAgICAgICAgICBcImRhdWdodGVyXCI6IFwiVG9jaHRlclwiLCBcImRlYWRcIjogXCJ0b3RcIiwgXCJkZWFyXCI6IFwibGllYlwiLCBcImRlZXBcIjogXCJ0aWVmXCIsXHJcbiAgICAgICAgICAgIFwiZGVza1wiOiBcIlNjaHJlaWJ0aXNjaFwiLCBcImRpbm5lclwiOiBcIkFiZW5kZXNzZW5cIiwgXCJkb2dcIjogXCJIdW5kXCIsXHJcbiAgICAgICAgICAgIFwiZG9vclwiOiBcIlTDvHJcIiwgXCJkcmVhbVwiOiBcIlRyYXVtXCIsIFwiZHJpbmtcIjogXCJHZXRyw6Rua1wiLCBcImRyaXZlXCI6IFwiZmFocmVuXCIsXHJcblxyXG4gICAgICAgICAgICBcImVhclwiOiBcIk9oclwiLCBcImVhcnRoXCI6IFwiRXJkZVwiLCBcImVhc3lcIjogXCJlaW5mYWNoXCIsIFwiZWF0XCI6IFwiZXNzZW5cIixcclxuICAgICAgICAgICAgXCJlZ2dcIjogXCJFaVwiLCBcImVuZXJneVwiOiBcIkVuZXJnaWVcIiwgXCJldmVuaW5nXCI6IFwiQWJlbmRcIixcclxuICAgICAgICAgICAgXCJleWVcIjogXCJBdWdlXCIsIFwiZXZlcnl0aGluZ1wiOiBcImFsbGVzXCIsXHJcblxyXG4gICAgICAgICAgICBcImZhY2VcIjogXCJHZXNpY2h0XCIsIFwiZmFtaWx5XCI6IFwiRmFtaWxpZVwiLCBcImZhclwiOiBcIndlaXRcIiwgXCJmYXJtXCI6IFwiQmF1ZXJuaG9mXCIsXHJcbiAgICAgICAgICAgIFwiZmFzdFwiOiBcInNjaG5lbGxcIiwgXCJmYXRoZXJcIjogXCJWYXRlclwiLCBcImZlZXRcIjogXCJGw7zDn2VcIiwgXCJmaWdodFwiOiBcImvDpG1wZmVuXCIsXHJcbiAgICAgICAgICAgIFwiZmlyZVwiOiBcIkZldWVyXCIsIFwiZmlzaFwiOiBcIkZpc2NoXCIsIFwiZmxvb3JcIjogXCJCb2RlblwiLCBcImZsb3dlclwiOiBcIkJsdW1lXCIsXHJcbiAgICAgICAgICAgIFwiZm9vZFwiOiBcIkVzc2VuXCIsIFwiZm9vdFwiOiBcIkZ1w59cIiwgXCJmcmllbmRcIjogXCJGcmV1bmRcIixcclxuXHJcbiAgICAgICAgICAgIFwiZ2FyZGVuXCI6IFwiR2FydGVuXCIsIFwiZ2lybFwiOiBcIk3DpGRjaGVuXCIsIFwiZ2xhc3NcIjogXCJHbGFzXCIsIFwiZ29cIjogXCJnZWhlblwiLFxyXG4gICAgICAgICAgICBcImdvb2RcIjogXCJndXRcIiwgXCJncmVlblwiOiBcImdyw7xuXCIsIFwiZ3JvdW5kXCI6IFwiQm9kZW5cIiwgXCJncm91cFwiOiBcIkdydXBwZVwiLFxyXG5cclxuICAgICAgICAgICAgXCJoYWlyXCI6IFwiSGFhcmVcIiwgXCJoYW5kXCI6IFwiSGFuZFwiLCBcImhhbmdcIjogXCJow6RuZ2VuXCIsIFwiaGFwcHlcIjogXCJnbMO8Y2tsaWNoXCIsXHJcbiAgICAgICAgICAgIFwiaGF0XCI6IFwiSHV0XCIsIFwiaGVhZFwiOiBcIktvcGZcIiwgXCJoZWFsdGhcIjogXCJHZXN1bmRoZWl0XCIsIFwiaGVhcnRcIjogXCJIZXJ6XCIsXHJcbiAgICAgICAgICAgIFwiaGVhdFwiOiBcIkhpdHplXCIsIFwiaGVhdnlcIjogXCJzY2h3ZXJcIiwgXCJoZWxsb1wiOiBcImhhbGxvXCIsIFwiaGVyZVwiOiBcImhpZXJcIixcclxuICAgICAgICAgICAgXCJoaWdoXCI6IFwiaG9jaFwiLCBcImhvbWVcIjogXCJadWhhdXNlXCIsIFwiaG9yc2VcIjogXCJQZmVyZFwiLCBcImhvdXNlXCI6IFwiSGF1c1wiLFxyXG5cclxuICAgICAgICAgICAgXCJpY2VcIjogXCJFaXNcIiwgXCJpZGVhXCI6IFwiSWRlZVwiLCBcImlsbFwiOiBcImtyYW5rXCIsIFwiaW1wb3J0YW50XCI6IFwid2ljaHRpZ1wiLFxyXG4gICAgICAgICAgICBcImluc2lkZVwiOiBcImRyaW5uZW5cIiwgXCJpc2xhbmRcIjogXCJJbnNlbFwiLFxyXG5cclxuICAgICAgICAgICAgXCJqb2JcIjogXCJKb2JcIiwgXCJqdWljZVwiOiBcIlNhZnRcIiwgXCJqdW1wXCI6IFwic3ByaW5nZW5cIixcclxuXHJcbiAgICAgICAgICAgIFwia2V5XCI6IFwiU2NobMO8c3NlbFwiLCBcImtpbGxcIjogXCJ0w7Z0ZW5cIiwgXCJraW5nXCI6IFwiS8O2bmlnXCIsIFwia2l0Y2hlblwiOiBcIkvDvGNoZVwiLFxyXG4gICAgICAgICAgICBcImtpc3NcIjogXCJLdXNzXCIsIFwia25vd1wiOiBcIndpc3NlblwiLFxyXG5cclxuICAgICAgICAgICAgXCJsYWtlXCI6IFwiU2VlXCIsIFwibGFuZFwiOiBcIkxhbmRcIiwgXCJsYW5ndWFnZVwiOiBcIlNwcmFjaGVcIixcclxuICAgICAgICAgICAgXCJsYXJnZVwiOiBcImdyb8OfXCIsIFwibGF1Z2hcIjogXCJsYWNoZW5cIiwgXCJsZWFyblwiOiBcImxlcm5lblwiLFxyXG4gICAgICAgICAgICBcImxlZnRcIjogXCJsaW5rc1wiLCBcImxlZ1wiOiBcIkJlaW5cIiwgXCJsaWZlXCI6IFwiTGViZW5cIiwgXCJsaWdodFwiOiBcIkxpY2h0XCIsXHJcbiAgICAgICAgICAgIFwibGlrZVwiOiBcIm3DtmdlblwiLCBcImxpb25cIjogXCJMw7Z3ZVwiLCBcImxpdHRsZVwiOiBcImtsZWluXCIsIFwibG9uZ1wiOiBcImxhbmdcIixcclxuICAgICAgICAgICAgXCJsb3ZlXCI6IFwiTGllYmVcIixcclxuXHJcbiAgICAgICAgICAgIFwibWFjaGluZVwiOiBcIk1hc2NoaW5lXCIsIFwibWFrZVwiOiBcIm1hY2hlblwiLCBcIm1hblwiOiBcIk1hbm5cIiwgXCJtYW55XCI6IFwidmllbGVcIixcclxuICAgICAgICAgICAgXCJtaWxrXCI6IFwiTWlsY2hcIiwgXCJtaW51dGVcIjogXCJNaW51dGVcIiwgXCJtb25leVwiOiBcIkdlbGRcIixcclxuICAgICAgICAgICAgXCJtb250aFwiOiBcIk1vbmF0XCIsIFwibW9ybmluZ1wiOiBcIk1vcmdlblwiLCBcIm1vdGhlclwiOiBcIk11dHRlclwiLFxyXG4gICAgICAgICAgICBcIm1vdW50YWluXCI6IFwiQmVyZ1wiLFxyXG5cclxuICAgICAgICAgICAgXCJuYW1lXCI6IFwiTmFtZVwiLCBcIm5hdGlvblwiOiBcIk5hdGlvblwiLCBcIm5lYXJcIjogXCJuYWhcIiwgXCJuZWNrXCI6IFwiTmFja2VuXCIsXHJcbiAgICAgICAgICAgIFwibmlnaHRcIjogXCJOYWNodFwiLCBcIm5vaXNlXCI6IFwiTMOkcm1cIiwgXCJub3J0aFwiOiBcIk5vcmRlblwiLFxyXG5cclxuICAgICAgICAgICAgXCJvY2VhblwiOiBcIk96ZWFuXCIsIFwib2ZmXCI6IFwiYXVzXCIsIFwib2ZmaWNlXCI6IFwiQsO8cm9cIiwgXCJvaWxcIjogXCLDlmxcIixcclxuICAgICAgICAgICAgXCJvbGRcIjogXCJhbHRcIiwgXCJvcGVuXCI6IFwiw7ZmZm5lblwiLCBcIm9yYW5nZVwiOiBcIk9yYW5nZVwiLCBcIm9yZGVyXCI6IFwiYmVzdGVsbGVuXCIsXHJcblxyXG4gICAgICAgICAgICBcInBhZ2VcIjogXCJTZWl0ZVwiLCBcInBhcGVyXCI6IFwiUGFwaWVyXCIsIFwicGFyZW50XCI6IFwiRWx0ZXJuXCIsIFwicGFya1wiOiBcIlBhcmtcIixcclxuICAgICAgICAgICAgXCJwYXJ0eVwiOiBcIlBhcnR5XCIsIFwicGVuXCI6IFwiU3RpZnRcIiwgXCJwZW9wbGVcIjogXCJNZW5zY2hlblwiLCBcInBob25lXCI6IFwiVGVsZWZvblwiLFxyXG4gICAgICAgICAgICBcInBpY3R1cmVcIjogXCJCaWxkXCIsIFwicGxhY2VcIjogXCJPcnRcIiwgXCJwbGFudFwiOiBcIlBmbGFuemVcIiwgXCJwbGF5XCI6IFwic3BpZWxlblwiLFxyXG4gICAgICAgICAgICBcInBvY2tldFwiOiBcIlRhc2NoZVwiLCBcInBvbGljZVwiOiBcIlBvbGl6ZWlcIiwgXCJwb3RhdG9cIjogXCJLYXJ0b2ZmZWxcIixcclxuICAgICAgICAgICAgXCJwcm9ibGVtXCI6IFwiUHJvYmxlbVwiLFxyXG5cclxuICAgICAgICAgICAgXCJxdWVlblwiOiBcIkvDtm5pZ2luXCIsIFwicXVlc3Rpb25cIjogXCJGcmFnZVwiLFxyXG5cclxuICAgICAgICAgICAgXCJyYWluXCI6IFwiUmVnZW5cIiwgXCJyZXN0YXVyYW50XCI6IFwiUmVzdGF1cmFudFwiLCBcInJlZFwiOiBcInJvdFwiLFxyXG4gICAgICAgICAgICBcInJpZ2h0XCI6IFwicmVjaHRzXCIsIFwicml2ZXJcIjogXCJGbHVzc1wiLCBcInJvYWRcIjogXCJTdHJhw59lXCIsXHJcbiAgICAgICAgICAgIFwicm9vbVwiOiBcIlppbW1lclwiLCBcInJ1blwiOiBcInJlbm5lblwiLFxyXG5cclxuICAgICAgICAgICAgXCJzYWx0XCI6IFwiU2FselwiLCBcInNhbmRcIjogXCJTYW5kXCIsIFwic2Nob29sXCI6IFwiU2NodWxlXCIsIFwic2VhXCI6IFwiTWVlclwiLFxyXG4gICAgICAgICAgICBcInNlYXNvblwiOiBcIkphaHJlc3plaXRcIiwgXCJzZWVcIjogXCJzZWhlblwiLCBcInNoaXJ0XCI6IFwiSGVtZFwiLFxyXG4gICAgICAgICAgICBcInNob2VcIjogXCJTY2h1aFwiLCBcInNob3BcIjogXCJMYWRlblwiLCBcInNob3J0XCI6IFwia3VyelwiLCBcInNsZWVwXCI6IFwic2NobGFmZW5cIixcclxuICAgICAgICAgICAgXCJzbG93XCI6IFwibGFuZ3NhbVwiLCBcInNtYWxsXCI6IFwia2xlaW5cIiwgXCJzbWlsZVwiOiBcIkzDpGNoZWxuXCIsIFwic25vd1wiOiBcIlNjaG5lZVwiLFxyXG4gICAgICAgICAgICBcInNvblwiOiBcIlNvaG5cIiwgXCJzb3VuZFwiOiBcIkdlcsOkdXNjaFwiLCBcInNvdXBcIjogXCJTdXBwZVwiLCBcInNwb3J0XCI6IFwiU3BvcnRcIixcclxuICAgICAgICAgICAgXCJzcHJpbmdcIjogXCJGcsO8aGxpbmdcIiwgXCJzdGFyXCI6IFwiU3Rlcm5cIiwgXCJzdG9uZVwiOiBcIlN0ZWluXCIsIFwic3RyZWV0XCI6IFwiU3RyYcOfZVwiLFxyXG4gICAgICAgICAgICBcInN0cm9uZ1wiOiBcInN0YXJrXCIsIFwic3VtbWVyXCI6IFwiU29tbWVyXCIsIFwic3VuXCI6IFwiU29ubmVcIiwgXCJzd2VldFwiOiBcInPDvMOfXCIsXHJcblxyXG4gICAgICAgICAgICBcInRhYmxlXCI6IFwiVGlzY2hcIiwgXCJ0ZWFjaGVyXCI6IFwiTGVocmVyXCIsIFwidGVhXCI6IFwiVGVlXCIsIFwidGVhbVwiOiBcIlRlYW1cIixcclxuICAgICAgICAgICAgXCJ0ZW5cIjogXCJ6ZWhuXCIsIFwidGVzdFwiOiBcIlRlc3RcIiwgXCJ0aGluZ1wiOiBcIkRpbmdcIiwgXCJ0aG91Z2h0XCI6IFwiR2VkYW5rZVwiLFxyXG4gICAgICAgICAgICBcInRpbWVcIjogXCJaZWl0XCIsIFwidGlyZWRcIjogXCJtw7xkZVwiLCBcInRvbW9ycm93XCI6IFwibW9yZ2VuXCIsIFwidG93blwiOiBcIlN0YWR0XCIsXHJcbiAgICAgICAgICAgIFwidHJlZVwiOiBcIkJhdW1cIiwgXCJ0cmFpblwiOiBcIlp1Z1wiLCBcInRyYXZlbFwiOiBcInJlaXNlblwiLFxyXG5cclxuICAgICAgICAgICAgXCJ1bmRlclwiOiBcInVudGVyXCIsIFwidW5jbGVcIjogXCJPbmtlbFwiLCBcInVwXCI6IFwiaG9jaFwiLCBcInVzZVwiOiBcImJlbnV0emVuXCIsXHJcblxyXG4gICAgICAgICAgICBcInZpbGxhZ2VcIjogXCJEb3JmXCIsIFwidm9pY2VcIjogXCJTdGltbWVcIixcclxuXHJcbiAgICAgICAgICAgIFwid2Fsa1wiOiBcImdlaGVuXCIsIFwid2FybVwiOiBcIndhcm1cIiwgXCJ3YXRlclwiOiBcIldhc3NlclwiLCBcIndheVwiOiBcIldlZ1wiLFxyXG4gICAgICAgICAgICBcIndlZWtcIjogXCJXb2NoZVwiLCBcIndlbGNvbWVcIjogXCJ3aWxsa29tbWVuXCIsIFwid2hpdGVcIjogXCJ3ZWnDn1wiLFxyXG4gICAgICAgICAgICBcIndpbmRvd1wiOiBcIkZlbnN0ZXJcIiwgXCJ3aW5kXCI6IFwiV2luZFwiLCBcIndpbnRlclwiOiBcIldpbnRlclwiLFxyXG4gICAgICAgICAgICBcIndvbWFuXCI6IFwiRnJhdVwiLCBcIndvcmRcIjogXCJXb3J0XCIsIFwid29ya1wiOiBcIkFyYmVpdFwiLCBcIndvcmxkXCI6IFwiV2VsdFwiLFxyXG4gICAgICAgICAgICBcIndyaXRlXCI6IFwic2NocmVpYmVuXCIsXHJcblxyXG4gICAgICAgICAgICBcInllYXJcIjogXCJKYWhyXCIsIFwieWVsbG93XCI6IFwiZ2VsYlwiLCBcInlvdW5nXCI6IFwianVuZ1wiLFxyXG5cclxuICAgICAgICAgICAgXCJ6b29cIjogXCJab29cIlxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgdHJhbnNsYXRlKGVuZ2xpc2hXb3JkKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudHJhbnNsYXRpb25zW2VuZ2xpc2hXb3JkLnRvTG93ZXJDYXNlKCldID8/IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0V29yZHMobmV3V29yZExpc3QpIHtcclxuICAgICAgICB0aGlzLndvcmRzID0gbmV3V29yZExpc3Q7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRW5nbGlzaEdlcm1hbkRpY3Rpb25hcnk7XHJcbiIsIlwidXNlIHN0cmljdFwiXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIEVsZW1lbnQge1xyXG5cclxuICAgIGhhc0NvbGxpZGVkID0gZmFsc2VcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmluc3RhbmNlSWQgPSAtMVxyXG4gICAgfVxyXG5cclxuICAgIGFjdGlvbigpIHsgfVxyXG5cclxuICAgIGRyYXcoY3R4KSB7IH1cclxuXHJcbiAgICBjaGVja0NvbGxpc2lvbigpIHsgfVxyXG5cclxuICAgIG9uQ29sbGlzaW9uKCkgeyB9XHJcblxyXG4gICAgc2V0SWQoaWQpIHtcclxuICAgICAgICB0aGlzLmluc3RhbmNlSWQgPSBpZFxyXG4gICAgfVxyXG59IiwiXCJ1c2Ugc3RyaWN0XCJcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgRWxlbWVudExpc3QgZXh0ZW5kcyBBcnJheSB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKVxyXG4gICAgfVxyXG5cclxuICAgIGFkZChlbGVtZW50KSB7XHJcbiAgICAgICAgdGhpcy5wdXNoKGVsZW1lbnQpXHJcbiAgICAgICAgZWxlbWVudC5zZXRJZCh0aGlzLmxlbmd0aCAtIDEpIFxyXG4gICAgfVxyXG5cclxuICAgIGdldChpKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXNbaV1cclxuICAgIH1cclxuXHJcbiAgICBkZWxldGUoaSkge1xyXG4gICAgICAgIC8vdGhpcy5zcGxpY2UoaSwgMSlcclxuICAgICAgICB0aGlzW2ldID0gbnVsbFxyXG4gICAgICAgIC8vw4RuZGVydW5nIHZvbiBCcmlhblxyXG4gICAgICAgXHJcblxyXG4gICAgfVxyXG5cclxuICAgIGRyYXcoY3R4KSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmKHRoaXNbaV0gIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdGhpc1tpXS5kcmF3KGN0eClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBcclxuICAgIGFjdGlvbigpIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gdGhpcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgeyAgICBcclxuICAgICAgICAgICAgaWYodGhpc1tpXSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzW2ldLmFjdGlvbigpXHJcbiAgICAgICAgICAgICAgICAvLyBORVU6IEJ1bGxldCB1bmQgV29yZCBjbGVhbnVwXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpc1tpXS5oYXNDb2xsaWRlZCB8fCB0aGlzW2ldLmRlc3Ryb3llZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3BsaWNlKGksIDEpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY2hlY2tDb2xsaXNpb24oKSB7IFxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZih0aGlzW2ldICE9IG51bGwgJiYgIXRoaXNbaV0uaGFzQ29sbGlkZWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXNbaV0uY2hlY2tDb2xsaXNpb24oKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsIlwidXNlIHN0cmljdFwiXHJcblxyXG5jb25zdCBCdWxsZXQgPSByZXF1aXJlKCcuL2J1bGxldCcpXHJcbmNvbnN0IFJhbmRvbVdhbGtDaXJjbGVFbGVtZW50ID0gcmVxdWlyZSgnLi9yYW5kb213YWxrY2lyY2xlZWxlbWVudCcpXHJcbmNvbnN0IEVsZW1lbnRMaXN0ID0gcmVxdWlyZSgnLi9lbGVtZW50bGlzdCcpXHJcbmNvbnN0IFN0YWdlID0gcmVxdWlyZSgnLi9zdGFnZScpXHJcbmNvbnN0IEJ1cnN0ID0gcmVxdWlyZSgnLi9idXJzdCcpXHJcbmNvbnN0IFdvcmQgPSByZXF1aXJlKFwiLi93b3JkXCIpXHJcbmNvbnN0IFZhbGlkYXRvciA9IHJlcXVpcmUoJy4vdmFsaWRhdG9yJylcclxuY29uc3QgV29yZElucHV0SGFuZGxlciA9IHJlcXVpcmUoJy4vd29yZGlucHV0aGFuZGxlcicpXHJcbmNvbnN0IEhlYWx0aCA9IHJlcXVpcmUoXCIuL2hlYWx0aFwiKVxyXG5jb25zdCBTcGF3bmVyQm9zcyA9IHJlcXVpcmUoXCIuL3NwYXduZXJib3NzXCIpXHJcbmNvbnN0IFJlZ2VuZXJhdGVCb3NzID0gcmVxdWlyZShcIi4vcmVnZW5lcmF0ZUJvc3NcIilcclxuY29uc3QgU3BsaXR0ZXJCb3NzID0gcmVxdWlyZShcIi4vc3BsaXR0ZXJCb3NzXCIpXHJcbmNvbnN0IEF1ZGlvTWFuYWdlciA9IHJlcXVpcmUoXCIuL2F1ZGlvTWFuYWdlclwiKVxyXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIEdhbWUge1xyXG5cclxuICAgIGludGVydmFsSWQgPSAwXHJcbiAgICBjb21ldGVzQ291bnQgPSAwXHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5yYWY7ICAgICAgICAgICAgICAgICAgICAgICAvLyByZXF1ZXN0IGFuaW1hdGlvbiBmcmFtZSBoYW5kbGVcclxuICAgICAgICB0aGlzLmVsZW1lbnRMaXN0ID1bXTtcclxuICAgICAgICB0aGlzLmhlYWx0aCA9IG5ldyBIZWFsdGgoKTtcclxuXHJcbiAgICAgICAgdGhpcy5zY29yZSA9IDA7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50SW5wdXQgPSAnJztcclxuICAgICAgICAvLyDDhG5kZXJ1bmdlbiB2b24gQnJpYW5cclxuICAgICAgICB0aGlzLnZhbGlkYXRvciA9IG5ldyBWYWxpZGF0b3IoKTtcclxuICAgICAgICB0aGlzLndvcmRJbnB1dGhhbmRlciA9IG5ldyBXb3JkSW5wdXRIYW5kbGVyKCk7XHJcbiAgICAgICAgdGhpcy5hY3RpdmVXb3JkRWxlbWVudCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy53b3JkSW5wdXRoYW5kZXIuc2V0TGV0dGVyQ2FsbGJhY2sodGhpcy5oYW5kbGVMZXR0ZXJJbnB1dC5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLmlzSW5wdXRTZXQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmlzUGF1c2VkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5sYXN0Qm9zc1Njb3JlID0gMDtcclxuICAgICAgICB0aGlzLmJvc3NBY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmF1ZGlvTWFuYWdlciA9IG5ldyBBdWRpb01hbmFnZXIoKTtcclxuICAgICAgICB0aGlzLmdlbmVyYXRlSW50ZXJ2YWwgPSA1MDAwOyBcclxuICAgICAgICB0aGlzLmxhc3RVcGRhdGVTb3JlID0gMDtcclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgICBzdGFydCgpIHtcclxuICAgICAgICB0aGlzLmVsZW1lbnRMaXN0ID0gbmV3IEVsZW1lbnRMaXN0KClcclxuICAgICAgICBpZighdGhpcy5pc0lucHV0U2V0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuaXNJbnB1dFNldCA9IHRydWVcclxuICAgICAgICAgICAgdGhpcy5zZXR1cElucHV0KClcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5lbGVtZW50TGlzdC5hZGQobmV3IFN0YWdlKCkpOyAgXHJcbiAgICAgICAgdGhpcy5lbGVtZW50TGlzdC5hZGQodGhpcy5oZWFsdGgpO1xyXG4gICAgXHJcbiAgICAgICAgLypmb3IgKGxldCBpID0gMDsgaSA8IDYwOyBpKyspIHtcclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLmVsZW1lbnRMaXN0ICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnRMaXN0LmFkZChuZXcgUmFuZG9tV2Fsa0NpcmNsZUVsZW1lbnQodGhpcykpO1xyXG4gICAgICAgICAgICAgICAgfSBcclxuICAgICAgICAgICAgfSwgMzAwMCAqIGkpO1xyXG4gICAgICAgIH0qL1xyXG4gICAgICAgIHRoaXMuZ2VuZXJhdGVDb21ldGVzKCk7XHJcblxyXG4gICAgICAgIHRoaXMuZWxlbWVudExpc3QuYWRkKG5ldyBTdGFnZSgpKVxyXG5cclxuICAgICAgICB0aGlzLnRpbWVPZkxhc3RGcmFtZSA9IERhdGUubm93KClcclxuICAgICAgICB0aGlzLnJhZiA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy50aWNrLmJpbmQodGhpcykpXHJcbiAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIGdlbmVyYXRlQ29tZXRlcygpIHtcclxuICAgICAgICB0aGlzLmVsZW1lbnRMaXN0LmFkZChuZXcgUmFuZG9tV2Fsa0NpcmNsZUVsZW1lbnQodGhpcykpO1xyXG4gICAgICAgIHRoaXMuaW50ZXJ2YWxJZCA9IHNldEludGVydmFsKCgpID0+IHtcclxuICAgICAgICAgICAgaWYodGhpcy5lbGVtZW50TGlzdCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnRMaXN0LmFkZChuZXcgUmFuZG9tV2Fsa0NpcmNsZUVsZW1lbnQodGhpcykpO1xyXG4gICAgICAgICAgICB9IFxyXG4gICAgICAgICAgICB0aGlzLmNvbWV0ZXNDb3VudCsrO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jb21ldGVzQ291bnQgPj0gMTApIHtcclxuICAgICAgICAgICAgICAgIHN0b3BMb29wKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LCB0aGlzLmdlbmVyYXRlSW50ZXJ2YWwpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZUdlbmVyYXRlSW50ZXJ2YWwoKSB7XHJcbiAgICAgICAgaWYodGhpcy5zY29yZSA+MCAmJiB0aGlzLnNjb3JlICUgNSA9PSAwJiZ0aGlzLmdlbmVyYXRlSW50ZXJ2YWwgPiAxMDAwICYmIHRoaXMubGFzdFVwZGF0ZVNvcmUgIT0gdGhpcy5zY29yZSkge1xyXG4gICAgICAgICAgICB0aGlzLmxhc3RVcGRhdGVTb3JlID0gdGhpcy5zY29yZTtcclxuICAgICAgICAgICAgdGhpcy5nZW5lcmF0ZUludGVydmFsIC09IDEwMDtcclxuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLmludGVydmFsSWQpO1xyXG4gICAgICAgICAgICB0aGlzLmdlbmVyYXRlQ29tZXRlcygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICBzdG9wR2VuZXJhdGluZ0NvbWV0ZXMoKSB7XHJcbiAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLmludGVydmFsSWQpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiTG9vcCBzdG9wcGVkLlwiKTtcclxuICAgIH1cclxuXHJcbiAgICBzdG9wKCkge1xyXG4gICAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLnJhZilcclxuICAgICAgICB0aGlzLmVsZW1lbnRMaXN0ID0gbnVsbFxyXG4gICAgfVxyXG5cclxuICAgIHBhdXNlKCkge1xyXG4gICAgICAgIHRoaXMuaXNQYXVzZWQgPSB0cnVlXHJcbiAgICAgICAgdGhpcy5zdG9wR2VuZXJhdGluZ0NvbWV0ZXMoKVxyXG5cclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1haW4tbWVudVwiKS5zdHlsZS5kaXNwbGF5ID0gXCJmbGV4XCJcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbnRpbnVlLWJ1dHRvblwiKS5zdHlsZS5kaXNwbGF5ID0gXCJmbGV4XCJcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1vZGUtc2VsZWN0aW9uXCIpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgIH1cclxuXHJcbiAgICBjb250aW51ZSgpIHtcclxuICAgICAgICB0aGlzLmlzUGF1c2VkID0gZmFsc2VcclxuICAgICAgICB0aGlzLmdlbmVyYXRlQ29tZXRlcygpXHJcbiAgICB9XHJcblxyXG4gICAgbG9hZFNjb3JlcygpIHtcclxuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImhpZ2hTY29yZXNcIikpIHx8IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIHNhdmVTY29yZShuYW1lLCBzY29yZSkge1xyXG4gICAgICAgIGNvbnN0IHNjb3JlcyA9IHRoaXMubG9hZFNjb3JlcygpO1xyXG4gICAgICAgIHNjb3Jlcy5wdXNoKHsgbmFtZSwgc2NvcmUsIGRhdGU6IERhdGUubm93KCkgfSk7XHJcbiAgICAgICAgc2NvcmVzLnNvcnQoKGEsIGIpID0+IGIuc2NvcmUgLSBhLnNjb3JlKTtcclxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImhpZ2hTY29yZXNcIiwgSlNPTi5zdHJpbmdpZnkoc2NvcmVzLnNsaWNlKDAsIDEwKSkpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaGlnaHNjb3JlLXZhbHVlXCIpLnRleHRDb250ZW50ID0gc2NvcmVzWzBdLnNjb3JlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIG1lbsO8IG5hY2ggdG9kIGVpbmJsaW5kZW4gXHJcbiAgICBnYW1lT3ZlcigpIHtcclxuICAgICAgIFxyXG4gICAgICAgIHRoaXMuc3RvcCgpO1xyXG4gICAgICAgIHRoaXMuc3RvcEdlbmVyYXRpbmdDb21ldGVzKClcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1haW4tbWVudVwiKS5zdHlsZS5kaXNwbGF5ID0gXCJmbGV4XCI7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJob21lLWJ1dHRvblwiKS5zdHlsZS5kaXNwbGF5ID0gXCJmbGV4XCI7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtb2RlLXNlbGVjdGlvblwiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzY29yZWJsb2NrXCIpLnN0eWxlLmRpc3BsYXkgPSBcImZsZXhcIjtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNjb3JlYmxvY2stdmFsdWVcIikudGV4dENvbnRlbnQgPSB0aGlzLnNjb3JlO1xyXG4gICAgICAgIHRoaXMuaGVhbHRoID0gbmV3IEhlYWx0aCgpOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGxlYmVuIHdpZWRlciB6dXLDvGNrIHNldHplbiBcclxuICAgICAgICB0aGlzLnNjb3JlID0gMDtcclxuICAgICAgICB0aGlzLnVwZGF0ZVVJKCk7XHJcbiAgICAgICAgd2luZG93LmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiam9pbi1oaWdoc2NvcmVcIikuZGlzYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICBcclxuICAgIH1cclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAgIHRpY2soKSB7XHJcbiAgICAgICAgbGV0IG15Y2FudmFzID0gd2luZG93LmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibXljYW52YXNcIilcclxuICAgICAgICBsZXQgY3R4ID0gbXljYW52YXMuZ2V0Q29udGV4dCgnMmQnKVxyXG4gICAgICAgIGN0eC5mb250ID0gXCIxOHB4IEFyaWFsXCI7XHJcblxyXG4gICAgICAgIC8vLS0tIGNsZWFyIHNjcmVlblxyXG4gICAgICAgIC8vY3R4LmZpbGxTdHlsZSA9ICdyZ2JhKDIzNSwgMjUwLCAyNTUsIDAuMSknIC8vIGFscGhhIDwgMSBsw7ZzY2h0IGRlbiBCaWxkc2NocmltIG51ciB0ZWlsd2Vpc2UgLT4gYmV3ZWd0ZSBHZWdlbnN0w6RuZGUgZXJ6ZXVnZW4gU3B1cmVuXHJcbiAgICAgICAgLy9jdHguZmlsbFJlY3QoMCwgMCwgbXljYW52YXMuY2xpZW50V2lkdGgsIG15Y2FudmFzLmNsaWVudEhlaWdodClcclxuXHJcbiAgICAgICAgaWYoIWRvY3VtZW50Lmhhc0ZvY3VzKCkpIHtcclxuICAgICAgICAgICAgdGhpcy5wYXVzZSgpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy0tLSBkcmF3IGVsZW1lbnRzXHJcbiAgICAgICAgdGhpcy5lbGVtZW50TGlzdC5kcmF3KGN0eClcclxuXHJcbiAgICAgICAgaWYoIXRoaXMuaXNQYXVzZWQpIHtcclxuICAgICAgICAgICAgLy8tLS0gZXhlY3V0ZSBlbGVtZW5TdCBhY3Rpb25zXHJcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudExpc3QuYWN0aW9uKClcclxuXHJcbiAgICAgICAgICAgIC8vLS0tIGNoZWNrIGVsZW1lbnQgY29sbGlzaW9uc1xyXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnRMaXN0LmNoZWNrQ29sbGlzaW9uKClcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zcGF3bkJvc3MoKTtcclxuICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICAvLyBTcGllbGVyIHRvZCA/IFxyXG4gICAgICAgIGlmICh0aGlzLmhlYWx0aC5pc0RlYWQoKSkge1xyXG4gICAgICAgICAgICB0aGlzLmdhbWVPdmVyKCk7XHJcbiAgICAgICAgICAgIHRoaXMuYXVkaW9NYW5hZ2VyLnN0b3BTb3VuZCgnYmFja2dyb3VuZCcpO1xyXG4gICAgICAgICAgICB0aGlzLmF1ZGlvTWFuYWdlci5wbGF5U291bmQoJ2dhbWVPdmVyJyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy51cGRhdGVHZW5lcmF0ZUludGVydmFsKCk7XHJcbiAgICAgICAgdGhpcy5zZXRCb3NzSW5hY3RpdmUyKCk7XHJcblxyXG4gICAgICAgIHRoaXMudXBkYXRlVUkoKVxyXG5cclxuICAgICAgICB0aGlzLnJhZiA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy50aWNrLmJpbmQodGhpcykpXHJcblxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBcclxuICAgIFxyXG5cclxuXHJcbiAgICBpc1dvcmRPbkRpc3BsYXkod29yZCkge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5lbGVtZW50TGlzdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZih0aGlzLmVsZW1lbnRMaXN0W2ldICE9IG51bGwgJiYgdGhpcy5lbGVtZW50TGlzdFtpXSBpbnN0YW5jZW9mIFdvcmQgJiYgdGhpcy5lbGVtZW50TGlzdFtpXS53b3JkLmNoYXJBdCgwKSA9PSB3b3JkLmNoYXJBdCgwKSApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICB9XHJcbiAgICBcclxuICAgIHNldHVwSW5wdXQoKSB7XHJcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChlKSA9PiB7XHJcbi8vICAgICAgICAgICAgaWYgKGUua2V5ID09PSAnRW50ZXInKSB0aGlzLnNob290VG9DaXJjbGUoKVxyXG4gICAgICAgICAgICAvKmVsc2UqLyBpZiAoZS5rZXkgPT09ICdCYWNrc3BhY2UnKSB0aGlzLmN1cnJlbnRJbnB1dCA9IHRoaXMuY3VycmVudElucHV0LnNsaWNlKDAsIC0xKVxyXG4vLyAgICAgICAgICAgIGVsc2UgaWYgKC9bYS16QS1aXS8udGVzdChlLmtleSkpIHRoaXMuY3VycmVudElucHV0ICs9IGUua2V5LnRvTG93ZXJDYXNlKClcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVVSSgpXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBzaG9vdFRvQ2lyY2xlKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5jdXJyZW50SW5wdXQpIHJldHVybjtcclxuICAgIFxyXG4gICAgICAgIC8vIEZpbmRlIGRhcyBXT1JUIGluIGRlciBlbGVtZW50TGlzdFxyXG4gICAgICAgIGlmKHRoaXMuZWxlbWVudExpc3QgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICBjb25zdCB0YXJnZXRXb3JkID0gdGhpcy5lbGVtZW50TGlzdC5maW5kKGVsID0+IFxyXG4gICAgICAgICAgICAgICAgZWwgaW5zdGFuY2VvZiBXb3JkICYmICFlbC5oYXNDb2xsaWRlZCAmJiBlbC53b3JkID09PSB0aGlzLmdldEN1cnJlbnRXb3JkKClcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgIH1cclxuICAgIFxyXG4gICAgICAgICAgICBpZiAoIXRhcmdldFdvcmQpIHJldHVyblxyXG4gICAgXHJcbiAgICAgICAgLy8gRGllIEJ1bGxldCBmbGllZ3QgenVtIENJUkNMRS1FTEVNRU5UIChuaWNodCB6dW0gV29ydClcclxuICAgICAgICAvLyB0YXJnZXRXb3JkLmNpcmNsZUlkIGlzdCBkaWUgaW5zdGFuY2VJZCBkZXMgS3JlaXNlc1xyXG4gICAgICAgIHRoaXMuZWxlbWVudExpc3QuYWRkKG5ldyBCdWxsZXQoXHJcbiAgICAgICAgICAgIHRhcmdldFdvcmQueCwgICAgICAgICAgIC8vIFpJRUwgWCBkZXMgS3JlaXNlc1xyXG4gICAgICAgICAgICB0YXJnZXRXb3JkLnksICAgICAgICAgICAvLyBaSUVMIFkgZGVzIEtyZWlzZXNcclxuICAgICAgICAgICAgdGFyZ2V0V29yZC5jaXJjbGVJZCwgICAgLy8gVGFyZ2V0IGlzdCBkZXIgS1JFSVNcclxuICAgICAgICAgICAgdGhpc1xyXG4gICAgICAgICkpXHJcbiAgICAgICAgdGhpcy5jdXJyZW50SW5wdXQgPSAnJ1xyXG4gICAgfVxyXG5cclxuICAgIGdldEN1cnJlbnRXb3JkKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRJbnB1dFxyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZVVJKCkge1xyXG4gICAgICAgIGNvbnN0IGVsID0gaWQgPT4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpXHJcbiAgICAgICAgaWYgKGVsKCdjdXJyZW50LWlucHV0JykpIGVsKCdjdXJyZW50LWlucHV0JykudGV4dENvbnRlbnQgPSB0aGlzLmdldEN1cnJlbnRXb3JkKClcclxuICAgICAgICBpZiAoZWwoJ3Njb3JlJykpIGVsKCdzY29yZScpLnRleHRDb250ZW50ID0gdGhpcy5zY29yZVxyXG4gICAgfVxyXG4gICAgXHJcblxyXG5oYW5kbGVMZXR0ZXJJbnB1dChsZXR0ZXIpIHtcclxuICAgIC8vIFdlbm4ga2VpbiBXb3J0IGFrdGl2IGlzdCwgc3VjaGUgZWluIG5ldWVzXHJcbiAgICBpZiAoIXRoaXMuYWN0aXZlV29yZEVsZW1lbnQpIHtcclxuICAgICAgICB0aGlzLmZpbmROZXdXb3JkKGxldHRlcik7XHJcbiAgICB9IFxyXG4gICAgLy8gV2VubiBXb3J0IGFrdGl2IGlzdCwgdGlwcGUgd2VpdGVyXHJcbiAgICBlbHNlIHtcclxuICAgICAgICB0aGlzLmNvbnRpbnVlVHlwaW5nV29yZChsZXR0ZXIpO1xyXG4gICAgfVxyXG59XHJcblxyXG4vLyBTdWNodCBlaW4gbmV1ZXMgV29ydCBiYXNpZXJlbmQgYXVmIGVyc3RlbSBCdWNoc3RhYmVuXHJcbmZpbmROZXdXb3JkKGZpcnN0TGV0dGVyKSB7XHJcbiAgICBcclxuICAgIGNvbnN0IGFjdGl2ZVdvcmRzID0gW107XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZWxlbWVudExpc3QubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBjb25zdCBlbCA9IHRoaXMuZWxlbWVudExpc3RbaV07XHJcbiAgICAgICAgaWYgKGVsIGluc3RhbmNlb2YgV29yZCAmJiAhZWwuaGFzQ29sbGlkZWQpIHtcclxuICAgICAgICAgICAgYWN0aXZlV29yZHMucHVzaChlbCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvLyBGaW5kZSBkYXMgRVJTVEUgV29ydCBkYXMgbWl0IGRlbSBCdWNoc3RhYmVuIGJlZ2lubnRcclxuICAgIGNvbnN0IG1hdGNoaW5nV29yZCA9IGFjdGl2ZVdvcmRzLmZpbmQod29yZCA9PiBcclxuICAgICAgICAvL3dvcmQud29yZC50b0xvd2VyQ2FzZSgpLnN0YXJ0c1dpdGgoZmlyc3RMZXR0ZXIpXHJcbiAgICAgICAgd29yZC53b3JkLnN0YXJ0c1dpdGgoZmlyc3RMZXR0ZXIpXHJcbiAgICApO1xyXG4gICAgXHJcbiAgICBpZiAobWF0Y2hpbmdXb3JkKSB7XHJcbiAgICAgICAgdGhpcy5hY3RpdmVXb3JkRWxlbWVudCA9IG1hdGNoaW5nV29yZDtcclxuICAgICAgICB0aGlzLmN1cnJlbnRJbnB1dCA9IGZpcnN0TGV0dGVyO1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG59XHJcblxyXG4gICAgLy8gVGlwcGUgYW0gYWt0aXZlbiBXb3J0IHdlaXRlclxyXG4gICAgY29udGludWVUeXBpbmdXb3JkKGxldHRlcikge1xyXG4gICAgICAgIC8vY29uc3QgZXhwZWN0ZWROZXh0TGV0dGVyID0gdGhpcy5hY3RpdmVXb3JkRWxlbWVudC53b3JkLnRvTG93ZXJDYXNlKClbdGhpcy5jdXJyZW50SW5wdXQubGVuZ3RoXTtcclxuICAgICAgICBjb25zdCBleHBlY3RlZE5leHRMZXR0ZXIgPSB0aGlzLmFjdGl2ZVdvcmRFbGVtZW50LndvcmRbdGhpcy5jdXJyZW50SW5wdXQubGVuZ3RoXTtcclxuICAgIFxyXG4gICAgICAgIC8vIFByw7xmZSBvYiBkZXIgQnVjaHN0YWJlIGtvcnJla3QgaXN0XHJcbiAgICAgICAgaWYgKGxldHRlciA9PT0gZXhwZWN0ZWROZXh0TGV0dGVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudElucHV0ICs9IGxldHRlcjtcclxuICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICAgICAgLy8gUHLDvGZlIG9iIFdvcnQgdm9sbHN0w6RuZGlnXHJcbiAgICAgICAgICAgIC8vaWYgKHRoaXMuY3VycmVudElucHV0ID09PSB0aGlzLmFjdGl2ZVdvcmRFbGVtZW50LndvcmQudG9Mb3dlckNhc2UoKSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50SW5wdXQgPT09IHRoaXMuYWN0aXZlV29yZEVsZW1lbnQud29yZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vbldvcmRDb21wbGV0ZWQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gRmFsc2NoZXIgQnVjaHN0YWJlIC0gUmVzZXRcclxuICAgICAgICAgICAgICAgIHRoaXMucmVzZXRBY3RpdmVXb3JkKHRydWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG4gICAgLy8gV29ydCBlcmZvbGdyZWljaCBhYmdldGlwcHRcclxuICAgIG9uV29yZENvbXBsZXRlZCgpIHtcclxuICAgICAgICBcclxuICAgICAgICAvLyBLdWdlbCBhdWYgZGVuIEtyZWlzIHNjaGllw59lblxyXG4gICAgICAgIGNvbnN0IHRhcmdldENpcmNsZSA9IHRoaXMuZWxlbWVudExpc3QuZ2V0KHRoaXMuYWN0aXZlV29yZEVsZW1lbnQuY2lyY2xlSWQpO1xyXG4gICAgICAgIGlmICh0YXJnZXRDaXJjbGUpIHtcclxuICAgICAgICAgICAgdGhpcy5zY29yZSsrO1xyXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnRMaXN0LmFkZChuZXcgQnVsbGV0KFxyXG4gICAgICAgICAgICAgICAgdGFyZ2V0Q2lyY2xlLngsXHJcbiAgICAgICAgICAgICAgICB0YXJnZXRDaXJjbGUueSxcclxuICAgICAgICAgICAgICAgIHRoaXMuYWN0aXZlV29yZEVsZW1lbnQuY2lyY2xlSWQsdGhpcykpO1xyXG4gICAgICAgIH1cclxuICAgIFxyXG4gICAgICAgIHRoaXMucmVzZXRBY3RpdmVXb3JkKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQWt0aXZlcyBXb3J0IHp1csO8Y2tzZXR6ZW5cclxuICAgIHJlc2V0QWN0aXZlV29yZChtaXN0YWtlKSB7XHJcbiAgICAgICAgdGhpcy5hY3RpdmVXb3JkRWxlbWVudCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50SW5wdXQgPSAnJztcclxuICAgICAgICBpZihtaXN0YWtlKSB7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVkU2NyZWVuXCIpLnN0eWxlLm9wYWNpdHkgPSBcIjAuNVwiO1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVkU2NyZWVuXCIpLnN0eWxlLm9wYWNpdHkgPSBcIjBcIjtcclxuICAgICAgICAgICAgfSwgMzAwKTsgXHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5hdWRpb01hbmFnZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5hdWRpb01hbmFnZXIucGxheVNvdW5kKCdlcnJvcicpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBQcsO8ZmUgaW4gamVkZW0gRnJhbWUgb2IgYWt0aXZlcyBXb3J0IG5vY2ggZXhpc3RpZXJ0XHJcbiAgICBjaGVja0FjdGl2ZVdvcmRWYWxpZGl0eSgpIHtcclxuICAgICAgICBpZiAodGhpcy5hY3RpdmVXb3JkRWxlbWVudCkge1xyXG4gICAgICAgICAgICBsZXQgd29yZFN0aWxsRXhpc3RzID0gZmFsc2U7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIER1cmNoc3VjaGUgZGllIEVsZW1lbnRMaXN0IG1hbnVlbGxcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmVsZW1lbnRMaXN0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBlbCA9IHRoaXMuZWxlbWVudExpc3RbaV07XHJcbiAgICAgICAgICAgICAgICBpZiAoZWwgPT09IHRoaXMuYWN0aXZlV29yZEVsZW1lbnQgJiYgIWVsLmhhc0NvbGxpZGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgd29yZFN0aWxsRXhpc3RzID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICBpZiAoIXdvcmRTdGlsbEV4aXN0cykge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHRoaXMucmVzZXRBY3RpdmVXb3JkKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbnNwYXduQm9zcygpIHtcclxuICAgIGlmKHRoaXMuYm9zc0FjdGl2ZSl7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgaWYodGhpcy5zY29yZSA+IDAgJiYgdGhpcy5zY29yZSAlIDIwID09PSAwICYmIHRoaXMuc2NvcmUgIT09IHRoaXMubGFzdEJvc3NTY29yZSkge1xyXG4gICAgICAgIHRoaXMubGFzdEJvc3NTY29yZSA9IHRoaXMuc2NvcmU7XHJcbiAgICAgICAgdGhpcy5ib3NzQWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICBcclxuICAgICAgICBpZih0aGlzLnNjb3JlICA8IDMwKXtcclxuICAgICAgICAgICAgdGhpcy5lbGVtZW50TGlzdC5hZGQobmV3IFNwbGl0dGVyQm9zcyh0aGlzKSk7XHJcbiAgICAgICAgICAgIC8vdGhpcy5lbGVtZW50TGlzdC5hZGQobmV3IFNwYXduZXJCb3NzKHRoaXMpKTtcclxuICAgICAgICAgICAgLy90aGlzLmVsZW1lbnRMaXN0LmFkZChuZXcgUmVnZW5lcmF0ZUJvc3ModGhpcykpO1xyXG4gICAgICAgIH1lbHNlIGlmKHRoaXMuc2NvcmUgIDwgNjApe1xyXG4gICAgICAgICAgICAgLy90aGlzLmVsZW1lbnRMaXN0LmFkZChuZXcgU3BsaXR0ZXJCb3NzKHRoaXMpKTtcclxuICAgICAgICAgICAgLy90aGlzLmVsZW1lbnRMaXN0LmFkZChuZXcgU3Bhd25lckJvc3ModGhpcykpO1xyXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnRMaXN0LmFkZChuZXcgUmVnZW5lcmF0ZUJvc3ModGhpcykpOyBcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgdGhpcy5lbGVtZW50TGlzdC5hZGQobmV3IFNwbGl0dGVyQm9zcyh0aGlzKSk7XHJcbiAgICAgICAgICAgIC8vdGhpcy5lbGVtZW50TGlzdC5hZGQobmV3IFNwYXduZXJCb3NzKHRoaXMpKTtcclxuICAgICAgICAgICAgLy90aGlzLmVsZW1lbnRMaXN0LmFkZChuZXcgUmVnZW5lcmF0ZUJvc3ModGhpcykpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBcclxuICAgIH1cclxuICAgIFxyXG59XHJcblxyXG5zZXRCb3NzSW5hY3RpdmUyKCkge1xyXG4gICAgLy8gc2NoYXVlbiBvYiBub2NoIGJvc3MgZWxlbWVudGUgaW4gZGVyIGVsZW1lbnRsaXN0IG9kZXIgYXVmIGRlbSBiaWxkc2NoaXJtIHNpbmRcclxuXHJcbiAgICB2YXIgYm9zc0ZvdW5kID0gZmFsc2U7XHJcbiAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmVsZW1lbnRMaXN0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgY29uc3QgZWwgPSB0aGlzLmVsZW1lbnRMaXN0W2ldO1xyXG4gICAgICAgIGlmIChlbCBpbnN0YW5jZW9mIFJlZ2VuZXJhdGVCb3NzIHx8IGVsIGluc3RhbmNlb2YgU3Bhd25lckJvc3MgfHwgZWwgaW5zdGFuY2VvZiBTcGxpdHRlckJvc3MpIHtcclxuICAgICAgICAgICAgYm9zc0ZvdW5kID0gdHJ1ZTtcclxuICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICB9XHJcblxyXG4gICAgIH1cclxuICAgICB0aGlzLmJvc3NBY3RpdmUgPSBib3NzRm91bmQ7XHJcbn1cclxuXHJcblxyXG5cclxuXHJcbn1cclxuIiwiXCJ1c2Ugc3RyaWN0XCJcclxuXHJcbmNvbnN0IEVsZW1lbnQgPSByZXF1aXJlKCcuL2VsZW1lbnQnKVxyXG4vL2NvbnN0IHJhbmRvbXdhbGtjaXJjbGVlbGVtZW50ID0gcmVxdWlyZSgnLi9yYW5kb213YWxrY2lyY2xlZWxlbWVudCcpXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIEhlYWx0aCBleHRlbmRzIEVsZW1lbnQge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkgeyAgXHJcbiAgICAgICAgc3VwZXIoKSAgICAgICAgICAgIFxyXG4gICAgICAgIHRoaXMuaGVhbHRoID0gMztcclxuICAgICAgICB0aGlzLmhlYXJ0ID0gbmV3IEltYWdlKCk7XHJcbiAgICAgICAgdGhpcy5oZWFydC5zcmMgPSAnaW1nL2hlYXJ0LnBuZyc7XHJcblxyXG4gICAgICAgIHRoaXMubG9hZGVkID0gZmFsc2U7IFxyXG4gICAgICAgIHRoaXMuaGVhcnQub25sb2FkID0gKCkgPT4geyAgICAgICAgICAgICAgICAgICAgLy9sYWRldCBkYXMgYmlsZCBoZWFydFxyXG4gICAgICAgICAgICB0aGlzLmxvYWRlZCA9IHRydWU7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIFxyXG5cclxuICAgIGRyYXcoY3R4KXtcclxuICAgICAgICBpZiAoIXRoaXMubG9hZGVkKSByZXR1cm47ICAgICAgICAgICAgICAgICAgICAgICAgICAvL3dlbm4gZGFzIGJpbGQgZ2VsYWRlbiBpc3Qgc29sbHRlIGVzIGRpZSBoZXJ6ZW4gemVpY2huZW5cclxuICAgICAgICBcclxuICAgICAgICBpZiAodGhpcy5oZWFsdGggPj0gMSkge1xyXG4gICAgICAgICAgICBjdHguZHJhd0ltYWdlKHRoaXMuaGVhcnQsIDEwLDMwLDI1LDI1KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuaGVhbHRoID49IDIpIHtcclxuICAgICAgICAgICAgY3R4LmRyYXdJbWFnZSh0aGlzLmhlYXJ0LCA0MCwzMCwyNSwyNSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmhlYWx0aCA+PSAzKSB7XHJcbiAgICAgICAgICAgIGN0eC5kcmF3SW1hZ2UodGhpcy5oZWFydCwgNzAsMzAsMjUsMjUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHJlZHVjZSgpe1xyXG4gICAgICAgdGhpcy5oZWFsdGgtLTtcclxuICAgIH1cclxuICAgIGlzRGVhZCgpIHtcclxuICAgIHJldHVybiB0aGlzLmhlYWx0aCA8PSAwO1xyXG59XHJcblxyXG4gICAgLypcclxuICAgICAgXHJcbiAgICB1cGRhdGUoKSB7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDDnGJlcnByw7xmdCBkZW4gZnJhbWUgb2IgaGFzQ29sbGlkZWQgPSB0cnVlIFxyXG4gICAgICAgIGlmICh0aGlzLnJhbmRvbXdhbGtjaXJjbGVlbGVtZW50Lmhhc0NvbGxpZGVkKSB7ICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMuaGVhbHRoLS07XHJcbiAgICAgICAgICAgIHRoaXMucmFuZG9tV2Fsa0NpcmNsZUVsZW1lbnQuaGFzQ29sbGlkZWQgPSBmYWxzZTsgIC8vIHNldHp0IGNvbGxpZGVkIGF1ZiBmYWxzZSBzbyBkYXNzIG51ciBlaW5lIGhlcnogcHJvIGNvbGxpc2lvbiBhYmdlem9nZW4gd2lyZCBcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAgICAgICovIFxyXG59IiwiXCJ1c2Ugc3RyaWN0XCJcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gIGNsYXNzIElucHV0RmllbGQge1xyXG4gICAgc3RhdGljIElucHV0bGlzdCA9IFtdO1xyXG4gICAgc3RhdGljICBzYXZlV29yZHMoKSB7XHJcbiAgICAgICAgY29uc3QgaW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRleHRJbnB1dFwiKS52YWx1ZTtcclxuICAgICAgICBjb25zdCBuZXVlV29lcnRlciA9IGlucHV0XHJcbiAgICAgICAgICAgIC50cmltKClcclxuICAgICAgICAgICAgLnNwbGl0KC9bLFxcc10rLykgICAgICAgICAgICAvL2ZpbHRlciBcclxuXHJcbiAgICAgICAgSW5wdXRGaWVsZC5JbnB1dGxpc3QucHVzaCguLi5uZXVlV29lcnRlcik7IC8vIGFtIGVuZGUgb3ZuIGlucHV0bGlzdCBoaW56dWbDvGdlbi4gXHJcblxyXG4gICAgICAgIC8vIEF1c2dhYmUgYWt0dWFsaXNpZXJlblxyXG4gICAgICAgIC8vIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3V0cHV0XCIpLnRleHRDb250ZW50ID0gSlNPTi5zdHJpbmdpZnkodGhpcy5JbnB1dGxpc3QsIG51bGwpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBzdGF0aWMgaXNFbXB0eSgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLklucHV0bGlzdC5sZW5ndGggPT0gMDtcclxuICAgIH1cclxufVxyXG5cclxuIiwiXCJ1c2Ugc3RyaWN0XCJcclxuIFxyXG5jb25zdCBHYW1lID0gcmVxdWlyZShcIi4vZ2FtZVwiKVxyXG5jb25zdCBJbnB1dEZpZWxkID0gcmVxdWlyZShcIi4vaW5wdXRmaWVsZFwiKVxyXG5sZXQgbXlHYW1lID0gbmV3IEdhbWUoKVxyXG5cclxuLy8gY2FudmFzXHJcbndpbmRvdy5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICBpZihteUdhbWUubG9hZFNjb3JlcygpLmxlbmd0aCAhPSAwKSB7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJoaWdoc2NvcmUtdmFsdWVcIikudGV4dENvbnRlbnQgPSBteUdhbWUubG9hZFNjb3JlcygpWzBdLnNjb3JlO1xyXG4gICAgfVxyXG4gICAgY29uc3Qgb3duV29yZHNCdXR0b24gPSB3aW5kb3cuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvd24td29yZHNcIik7XHJcbiAgICBjb25zdCBzcGVpY2hlckJ1dHRvbiA9IHdpbmRvdy5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNwZWljaGVyLWJ1dHRvblwiKTsgXHJcbiAgICBjb25zdCBtb2RlRW5nbGlzaEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibW9kZS1lbmdsaXNoXCIpO1xyXG4gICAgY29uc3QgbW9kZUdlcm1hbkJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibW9kZS1nZXJtYW5cIik7XHJcbiAgICBjb25zdCBwYXVzZUJ1dHRvbiA9IHdpbmRvdy5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBhdXNlQnV0dG9uXCIpO1xyXG4gICAgY29uc3QgY2xvc2VJbnB1dFBvcHVwID0gd2luZG93LmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2xvc2UtaW5wdXQtcG9wdXBcIik7XHJcbiAgICBjb25zdCBjbG9zZUhpZ2hzY29yZVBvcHVwID0gd2luZG93LmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2xvc2UtaGlnaHNjb3JlLXBvcHVwXCIpO1xyXG4gICAgY29uc3QgY29udGludWVCdXR0b24gPSB3aW5kb3cuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb250aW51ZS1idXR0b25cIik7XHJcbiAgICBjb25zdCBob21lQnV0dG9uID0gd2luZG93LmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaG9tZS1idXR0b25cIik7XHJcbiAgICBjb25zdCBzaG93SGlnaFNjb3JlTGlzdEJ1dHRvbiA9IHdpbmRvdy5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImhpZ2hzY29yZS1idXR0b25cIik7XHJcbiAgICBjb25zdCBqb2luSGlnaFNjb3JlQnV0dG9uID0gd2luZG93LmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiam9pbi1oaWdoc2NvcmVcIik7XHJcbiAgICBcclxuICAgIG93bldvcmRzQnV0dG9uLm9uY2xpY2sgPSAoKSA9PiB7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpbnB1dC1wb3B1cFwiKS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG4gICAgfVxyXG5cclxuICAgIHNwZWljaGVyQnV0dG9uLm9uY2xpY2sgPSAoKSA9PiB7XHJcbiAgICAgICAgSW5wdXRGaWVsZC5zYXZlV29yZHMoKTsgXHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtYWluLW1lbnVcIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaW5wdXQtcG9wdXBcIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICAgIG15R2FtZS5hdWRpb01hbmFnZXIucGxheVNvdW5kKCdiYWNrZ3JvdW5kJylcclxuICAgICAgICBteUdhbWUuc3RhcnQoKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBlbmdsaXNoXHJcbiAgICBtb2RlRW5nbGlzaEJ1dHRvbi5vbmNsaWNrID0gKCkgPT4ge1xyXG4gICAgICAgIG15R2FtZS5nYW1lTW9kZSA9ICdlbmdsaXNoJztcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1haW4tbWVudVwiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgICAgbXlHYW1lLmF1ZGlvTWFuYWdlci5wbGF5U291bmQoJ2JhY2tncm91bmQnKVxyXG4gICAgICAgIG15R2FtZS5zdGFydCgpO1xyXG4gICAgfTtcclxuICAgIFxyXG4gICAgLy8gZ2VybWFuXHJcbiAgICBtb2RlR2VybWFuQnV0dG9uLm9uY2xpY2sgPSAoKSA9PiB7XHJcbiAgICAgICAgbXlHYW1lLmdhbWVNb2RlID0gJ2dlcm1hbic7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtYWluLW1lbnVcIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICAgIG15R2FtZS5hdWRpb01hbmFnZXIucGxheVNvdW5kKCdiYWNrZ3JvdW5kJylcclxuICAgICAgICBteUdhbWUuc3RhcnQoKTtcclxuICAgIH07XHJcbiAgICBcclxuICAgIHBhdXNlQnV0dG9uLm9uY2xpY2sgPSBmdW5jdGlvbigpIHsgXHJcbiAgICAgICAgbXlHYW1lLnBhdXNlKCk7IFxyXG4gICAgfVxyXG5cclxuICAgIGNsb3NlSW5wdXRQb3B1cC5vbmNsaWNrID0gKCkgPT4ge1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaW5wdXQtcG9wdXBcIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgfVxyXG5cclxuICAgIGNsb3NlSGlnaHNjb3JlUG9wdXAub25jbGljayA9ICgpID0+IHtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImhpZ2hzY29yZS1wb3B1cFwiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICB9XHJcblxyXG4gICAgY29udGludWVCdXR0b24ub25jbGljayA9ICgpID0+IHtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1haW4tbWVudVwiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCJcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbnRpbnVlLWJ1dHRvblwiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCJcclxuICAgICAgICBteUdhbWUuY29udGludWUoKVxyXG4gICAgfVxyXG5cclxuICAgIGhvbWVCdXR0b24ub25jbGljayA9ICgpID0+IHtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1vZGUtc2VsZWN0aW9uXCIpLnN0eWxlLmRpc3BsYXkgPSBcImZsZXhcIlxyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaG9tZS1idXR0b25cIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiXHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzY29yZWJsb2NrXCIpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIlxyXG4gICAgfVxyXG5cclxuICAgIHNob3dIaWdoU2NvcmVMaXN0QnV0dG9uLm9uY2xpY2sgPSAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgbGlzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaGlnaHNjb3JlLWxpc3RcIik7XHJcbiAgICAgICAgY29uc3Qgc2NvcmVzID0gbXlHYW1lLmxvYWRTY29yZXMoKTtcclxuXHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJoaWdoc2NvcmUtcG9wdXBcIikuc3R5bGUuZGlzcGxheSA9IFwiZmxleFwiO1xyXG4gICAgICAgIGxpc3QuaW5uZXJIVE1MID0gXCJcIjsgLy8gY2xlYXIgb2xkIGVudHJpZXNcclxuXHJcbiAgICAgICAgaWYgKHNjb3Jlcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgY29uc3QgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlcIik7XHJcbiAgICAgICAgICAgIGxpLnRleHRDb250ZW50ID0gXCJObyBzY29yZXMgeWV0IVwiO1xyXG4gICAgICAgICAgICBsaXN0LmFwcGVuZENoaWxkKGxpKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2NvcmVzLmZvckVhY2goKHsgbmFtZSwgc2NvcmUgfSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaVwiKTtcclxuICAgICAgICAgICAgbGkudGV4dENvbnRlbnQgPSBgJHtuYW1lfSDigJMgJHtzY29yZX1gO1xyXG4gICAgICAgICAgICBsaXN0LmFwcGVuZENoaWxkKGxpKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBqb2luSGlnaFNjb3JlQnV0dG9uLm9uY2xpY2sgPSAoKSA9PiB7XHJcbiAgICAgICAgbXlHYW1lLnNhdmVTY29yZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmFtZUlucHV0JykudmFsdWUsIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzY29yZWJsb2NrLXZhbHVlJykudGV4dENvbnRlbnQpO1xyXG4gICAgICAgIGpvaW5IaWdoU2NvcmVCdXR0b24uZGlzYWJsZWQgPSB0cnVlO1xyXG4gICAgfVxyXG59O1xyXG4iLCJcInVzZSBzdHJpY3RcIlxyXG5cclxuY29uc3QgRWxlbWVudCA9IHJlcXVpcmUoJy4vZWxlbWVudCcpXHJcbmNvbnN0IEJ1cnN0ID0gcmVxdWlyZSgnLi9idXJzdCcpXHJcbmNvbnN0IFdvcmQgPSByZXF1aXJlKCcuL3dvcmQnKVxyXG5jb25zdCBIZWFsdGggPSByZXF1aXJlKCcuL2hlYWx0aCcpXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFJhbmRvbVdhbGtDaXJjbGVFbGVtZW50IGV4dGVuZHMgRWxlbWVudCB7XHJcbiAgICBjb25zdHJ1Y3RvcihnYW1lKSB7XHJcbiAgICAgICAgc3VwZXIoKVxyXG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWVcclxuICAgICAgICB0aGlzLnggPSBNYXRoLnJhbmRvbSgpICogNTMwICsgNDBcclxuICAgICAgICB0aGlzLnkgPSAwXHJcbiAgICAgICAgY29uc3QgYmFzZVNwZWVkID0gMC43O1xyXG4gICAgICAgIGNvbnN0IHNwZWVkSW5jcmVhc2UgPSBNYXRoLmZsb29yKHRoaXMuZ2FtZS5zY29yZSAvIDUpICogMC4wNzU7XHJcbiAgICAgICAgdGhpcy5zcGVlZCA9IE1hdGgubWluKGJhc2VTcGVlZCArIHNwZWVkSW5jcmVhc2UsIDEwMC4wKVxyXG4gICAgICAgIFxyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4geyBcclxuICAgICAgICAgICAgbGV0IHdvcmQgPSBuZXcgV29yZCh0aGlzLmdhbWUsIHRoaXMueCwgdGhpcy55LCB0aGlzLmluc3RhbmNlSWQsIHRoaXMuc3BlZWQpXHJcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5lbGVtZW50TGlzdC5hZGQod29yZClcclxuICAgICAgICB9LCAxMDApO1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIGRyYXcoY3R4KSB7XHJcbiAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKVxyXG4gICAgICAgICAgICBjdHguYXJjKHRoaXMueCwgdGhpcy55LCAxNSwgMCwgTWF0aC5QSSAqIDIsIHRydWUpXHJcbiAgICAgICAgICAgIGN0eC5jbG9zZVBhdGgoKVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICBcImdyZXlcIlxyXG4gICAgICAgICAgICBjdHguZmlsbCgpXHJcblxyXG4gICAgfVxyXG5cclxuICAgIGNhbGxCdXJzdCgpIHtcclxuICAgICAgICB2YXIgYnVyc3QgPSBuZXcgQnVyc3QodGhpcy54LCB0aGlzLnksIHRoaXMuZ2FtZSlcclxuICAgICAgICB0aGlzLmdhbWUuZWxlbWVudExpc3QuYWRkKGJ1cnN0KVxyXG4gICAgfVxyXG5cclxuICAgIGFjdGlvbigpIHtcclxuICAgICAgICAvL3RoaXMueCArPSBNYXRoLnJhbmRvbSgpICogMiAtIDFcclxuICAgICAgICB0aGlzLnkgKz0gdGhpcy5zcGVlZFxyXG4gICAgfVxyXG5cclxuICAgIGNoZWNrQ29sbGlzaW9uKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnkgPiA1NTAgJiYgdGhpcy55IDw9IDU1MCArIHRoaXMuc3BlZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5vbkNvbGxpc2lvbigpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG9uQ29sbGlzaW9uKCkge1xyXG4gICAgICAgIHRoaXMuaGFzQ29sbGlkZWQgPSB0cnVlXHJcbiAgICAgICAgdGhpcy5nYW1lLmVsZW1lbnRMaXN0LmRlbGV0ZSh0aGlzLmluc3RhbmNlSWQpXHJcbiAgICAgICAgdGhpcy5jYWxsQnVyc3QoKVxyXG4gICAgICAgIHRoaXMuZ2FtZS5oZWFsdGgucmVkdWNlKCkgICAgICAgICAgICAgXHJcbiAgICB9XHJcbiAgICBcclxuICAgIGJ1bGxldE1ldCgpIHtcclxuICAgICAgICB0aGlzLmhhc0NvbGxpZGVkID0gdHJ1ZVxyXG4gICAgICAgIHRoaXMuZ2FtZS5lbGVtZW50TGlzdC5kZWxldGUodGhpcy5pbnN0YW5jZUlkKVxyXG4gICAgICAgIHRoaXMuY2FsbEJ1cnN0KClcclxuICAgIH1cclxufSIsIid1c2Ugc3RyaWN0J1xyXG5cclxuY29uc3QgUmFuZG9tV2Fsa0NpcmNsZUVsZW1lbnQgPSByZXF1aXJlKCcuL3JhbmRvbXdhbGtjaXJjbGVlbGVtZW50JylcclxuY29uc3QgRWxlbWVudExpc3QgPSByZXF1aXJlKCcuL2VsZW1lbnRsaXN0JylcclxuY29uc3QgQnVyc3QgPSByZXF1aXJlKCcuL2J1cnN0JylcclxuY29uc3QgV29yZCA9IHJlcXVpcmUoJy4vd29yZCcpXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFJlZ2VuZXJhdGVCb3NzIGV4dGVuZHMgUmFuZG9tV2Fsa0NpcmNsZUVsZW1lbnQge1xyXG4gICAgY29uc3RydWN0b3IoZ2FtZSwgaGVhbHRoPTMgKSB7XHJcbiAgICAgICAgc3VwZXIoZ2FtZSlcclxuICAgICAgICB0aGlzLnggPSAzMDA7XHJcbiAgICAgICAgdGhpcy5zcGVlZCA9IDAuMlxyXG4gICAgICAgIHRoaXMuaGVhbHRoID0gaGVhbHRoO1xyXG4gICAgICAgXHJcblxyXG4gICAgfVxyXG5cclxuICAgIGRyYXcoY3R4KSB7XHJcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpXHJcbiAgICAgICAgICAgIGN0eC5hcmModGhpcy54LCB0aGlzLnksIDMwLCAwLCBNYXRoLlBJICogMiwgdHJ1ZSlcclxuICAgICAgICAgICAgY3R4LmNsb3NlUGF0aCgpXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gIFwiYmxhY2tcIlxyXG4gICAgICAgICAgICBjdHguZmlsbCgpXHJcbiAgICB9XHJcblxyXG4gICAgYnVsbGV0TWV0KCkge1xyXG4gICAgICAgIGlmKHRoaXMuaGVhbHRoID4gMSl7XHJcbiAgICAgICAgICAgIHRoaXMuaGVhbHRoIC09IDE7XHJcbiAgICAgICAgICAgIGNvbnN0IG5leHRCb3NzID0gbmV3IFJlZ2VuZXJhdGVCb3NzKHRoaXMuZ2FtZSwgdGhpcy5oZWFsdGggKTtcclxuICAgICAgICAgICAgbmV4dEJvc3MueCA9IHRoaXMueDtcclxuICAgICAgICAgICAgbmV4dEJvc3MueSA9IHRoaXMueTtcclxuICAgICAgICAgICAgdGhpcy5nYW1lLmVsZW1lbnRMaXN0LmFkZChuZXh0Qm9zcyk7XHJcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5lbGVtZW50TGlzdC5kZWxldGUodGhpcy5pbnN0YW5jZUlkKVxyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICB0aGlzLmhlYWx0aD0zO1xyXG4gICAgICAgICAgICB0aGlzLmhhc0NvbGxpZGVkID0gdHJ1ZVxyXG4gICAgICAgICAgICB0aGlzLmdhbWUuZWxlbWVudExpc3QuZGVsZXRlKHRoaXMuaW5zdGFuY2VJZClcclxuICAgICAgICAgICAgdGhpcy5jYWxsQnVyc3QoKVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgIH1cclxufSIsIid1c2Ugc3RyaWN0J1xyXG5cclxuXHJcbmNvbnN0IFJhbmRvbVdhbGtDaXJjbGVFbGVtZW50ID0gcmVxdWlyZSgnLi9yYW5kb213YWxrY2lyY2xlZWxlbWVudCcpXHJcbmNvbnN0IEVsZW1lbnRMaXN0ID0gcmVxdWlyZSgnLi9lbGVtZW50bGlzdCcpICAgIFxyXG5jb25zdCBCdXJzdCA9IHJlcXVpcmUoJy4vYnVyc3QnKVxyXG5jb25zdCBXb3JkID0gcmVxdWlyZSgnLi93b3JkJylcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgU3Bhd25lckJvc3MgZXh0ZW5kcyBSYW5kb21XYWxrQ2lyY2xlRWxlbWVudCB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZ2FtZSkge1xyXG4gICAgICAgIHN1cGVyKGdhbWUpXHJcbiAgICAgICAgdGhpcy54ID0gMzAwO1xyXG4gICAgICAgIHRoaXMuc3BlZWQgPSAwLjE1XHJcblxyXG5cclxuXHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5zcGF3bigpO1xyXG4gICAgICAgIHRoaXMuc3Bhd25JbnRlcnZhbCA9IDExMDAwICAvLyBzcGF3biBldmVyeSB4IHNlY29uZHNcclxuICAgICAgICB0aGlzLmxhc3RTcGF3blRpbWUgPSBEYXRlLm5vdygpO1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgICBkcmF3KGN0eCkge1xyXG4gICAgICAgICAgICBjdHguYmVnaW5QYXRoKClcclxuICAgICAgICAgICAgY3R4LmFyYyh0aGlzLngsIHRoaXMueSwgMzAsIDAsIE1hdGguUEkgKiAyLCB0cnVlKVxyXG4gICAgICAgICAgICBjdHguY2xvc2VQYXRoKClcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSAgXCJvcmFuZ2VcIlxyXG4gICAgICAgICAgICBjdHguZmlsbCgpXHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFjdGlvbigpe1xyXG4gICAgICAgIHN1cGVyLmFjdGlvbigpO1xyXG4gICAgICAgIHRoaXMuc3RhcnRTcGF3bmluZygpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBzdGFydFNwYXduaW5nKCkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IGN1cnJlbnRUaW1lID0gRGF0ZS5ub3coKTtcclxuICAgICAgICBpZiggY3VycmVudFRpbWUgLSB0aGlzLmxhc3RTcGF3blRpbWUgPj0gdGhpcy5zcGF3bkludGVydmFsKXtcclxuICAgICAgICAgICAgdGhpcy5zcGF3bigpO1xyXG4gICAgICAgICAgICB0aGlzLmxhc3RTcGF3blRpbWUgPSBjdXJyZW50VGltZTtcclxuXHJcblxyXG4gICAgICAgIH0gICAgICAgXHJcbiAgICAgICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIHNwYXduKCkge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMjsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuZ2FtZS5lbGVtZW50TGlzdCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbWluaW9uID0gbmV3IFJhbmRvbVdhbGtDaXJjbGVFbGVtZW50KHRoaXMuZ2FtZSk7XHJcbiAgICAgICAgICAgICAgICBtaW5pb24ueCA9ICB0aGlzLnggKyAoaSAqIDYwIC0zMCk7OyBcclxuICAgICAgICAgICAgICAgIG1pbmlvbi55ID0gdGhpcy55ICsxMDtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5lbGVtZW50TGlzdC5hZGQobWluaW9uKTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAgb25Db2xsaXNpb24oKSB7XHJcbiAgICAgICAgdGhpcy5nYW1lLnNldEJvc3NJbmFjdGl2ZSgpO1xyXG4gICAgICAgIHRoaXMuaGFzQ29sbGlkZWQgPSB0cnVlXHJcbiAgICAgICAgdGhpcy5nYW1lLmVsZW1lbnRMaXN0LmRlbGV0ZSh0aGlzLmluc3RhbmNlSWQpXHJcbiAgICAgICAgdGhpcy5jYWxsQnVyc3QoKVxyXG4gICAgICAgIHRoaXMuZ2FtZS5oZWFsdGgucmVkdWNlKCkgICBcclxuICAgIH1cclxuXHJcbiAgICBidWxsZXRNZXQoKXtcclxuICAgICAgICB0aGlzLmdhbWUuc2V0Qm9zc0luYWN0aXZlKCk7XHJcbiAgICAgICAgc3VwZXIuYnVsbGV0TWV0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgIFxyXG5cclxufSIsIid1c2Ugc3RyaWN0J1xyXG5jb25zdCBFbGVtZW50ID0gcmVxdWlyZSgnLi9lbGVtZW50JylcclxuY29uc3QgUmFuZG9tV2Fsa0NpcmNsZUVsZW1lbnQgPSByZXF1aXJlKCcuL3JhbmRvbXdhbGtjaXJjbGVlbGVtZW50JylcclxuY29uc3QgRWxlbWVudExpc3QgPSByZXF1aXJlKCcuL2VsZW1lbnRsaXN0JykgICAgXHJcbmNvbnN0IEJ1cnN0ID0gcmVxdWlyZSgnLi9idXJzdCcpXHJcbmNvbnN0IFdvcmQgPSByZXF1aXJlKCcuL3dvcmQnKVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBTcGxpdHRlckJvc3MgZXh0ZW5kcyBSYW5kb21XYWxrQ2lyY2xlRWxlbWVudCB7XHJcbiBzdGF0aWMgdG90YWxMaXZlcyA9IDQ7XHJcbiAgICBjb25zdHJ1Y3RvcihnYW1lLCBoZWFsdGg9Miwgc2l6ZT0zMCwgYWJzdGFuZD0xNTApIHtcclxuICAgICAgICBzdXBlcihnYW1lKVxyXG4gICAgICAgIHRoaXMueCA9IDMwMDtcclxuICAgICAgICB0aGlzLnNwZWVkID0gMC4xXHJcbiAgICAgICAgdGhpcy5oZWFsdGggPSBoZWFsdGg7XHJcbiAgICAgICAgdGhpcy5zaXplID0gc2l6ZTtcclxuICAgICAgICB0aGlzLmFic3RhbmQgPSBhYnN0YW5kO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBkcmF3KGN0eCkge1xyXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKVxyXG4gICAgICAgICAgICBjdHguYXJjKHRoaXMueCwgdGhpcy55LCB0aGlzLnNpemUsIDAsIE1hdGguUEkgKiAyLCB0cnVlKVxyXG4gICAgICAgICAgICBjdHguY2xvc2VQYXRoKClcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSAgXCJibHVlXCJcclxuICAgICAgICAgICAgY3R4LmZpbGwoKVxyXG4gICAgfVxyXG5cclxuICAgIGJ1bGxldE1ldCgpIHtcclxuICAgICAgICBpZih0aGlzLmhlYWx0aCA+PSAxKXsgICBcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAyOyBpKyspIHtcclxuICAgICAgICAgICAgaWYodGhpcy5nYW1lLmVsZW1lbnRMaXN0KSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBtaW5pb24gPSBuZXcgU3BsaXR0ZXJCb3NzKHRoaXMuZ2FtZSwgdGhpcy5oZWFsdGggLTEsIHRoaXMuc2l6ZS04LCB0aGlzLmFic3RhbmQtNzApO1xyXG4gICAgICAgICAgICAgICAgbWluaW9uLnggPSAgdGhpcy54ICsgKGkgKiB0aGlzLmFic3RhbmQgLSB0aGlzLmFic3RhbmQvMik7OyBcclxuICAgICAgICAgICAgICAgIG1pbmlvbi55ID0gdGhpcy55ICsxMDtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5lbGVtZW50TGlzdC5hZGQobWluaW9uKTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5nYW1lLmVsZW1lbnRMaXN0LmRlbGV0ZSh0aGlzLmluc3RhbmNlSWQpXHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIGlmKFNwbGl0dGVyQm9zcy50b3RhbExpdmVzIDw9MSl7XHJcbiAgICAgICAgICAgICAgICAvL3RoaXMuZ2FtZS5zZXRCb3NzSW5hY3RpdmUoKTtcclxuICAgICAgICAgICAgICAgIFNwbGl0dGVyQm9zcy50b3RhbExpdmVzPTQ7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmhlYWx0aD0yO1xyXG4gICAgICAgICAgICBTcGxpdHRlckJvc3MudG90YWxMaXZlcy0tO1xyXG4gICAgICAgICAgICB0aGlzLmhhc0NvbGxpZGVkID0gdHJ1ZVxyXG4gICAgICAgICAgICB0aGlzLmdhbWUuZWxlbWVudExpc3QuZGVsZXRlKHRoaXMuaW5zdGFuY2VJZClcclxuICAgICAgICAgICAgdGhpcy5jYWxsQnVyc3QoKVxyXG4gICAgICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgIG9uQ29sbGlzaW9uKCkge1xyXG4gICAgICAgIHRoaXMuZ2FtZS5zZXRCb3NzSW5hY3RpdmUoKTtcclxuICAgICAgICB0aGlzLmhhc0NvbGxpZGVkID0gdHJ1ZVxyXG4gICAgICAgIHRoaXMuZ2FtZS5lbGVtZW50TGlzdC5kZWxldGUodGhpcy5pbnN0YW5jZUlkKVxyXG4gICAgICAgIHRoaXMuY2FsbEJ1cnN0KClcclxuICAgICAgICB0aGlzLmdhbWUuaGVhbHRoLnJlZHVjZSgpICAgXHJcbiAgICB9XHJcblxyXG59XHJcblxyXG4iLCJcInVzZSBzdHJpY3RcIlxyXG5cclxuY29uc3QgRWxlbWVudCA9IHJlcXVpcmUoJy4vZWxlbWVudCcpXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFN0YWdlIGV4dGVuZHMgRWxlbWVudCB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKVxyXG4gICAgICAgIHRoaXMueCA9IDBcclxuICAgICAgICB0aGlzLnkgPSAwXHJcbiAgICB9XHJcblxyXG4gICAgZHJhdyhjdHgpIHtcclxuICAgICAgICB2YXIgaW1nID0gbmV3IEltYWdlKCk7XHJcbiAgICAgICAgaW1nLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjdHguZHJhd0ltYWdlKGltZywgMCwgMCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGltZy5zcmMgPSAnaW1nL2JhY2tncm91bmQucG5nJztcclxuICAgIH1cclxuXHJcbiAgICBhY3Rpb24oKSB7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcbn0iLCJtb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFZhbGlkYXRvciB7XHJcblxyXG5jb25zdHJ1Y3Rvcigpe1xyXG4gIHRoaXMuYWN0aXZlV29yZCA9IFwiXCI7XHJcbiAgdGhpcy5jdXJyZW50SW5wdXQgPSBcIlwiO1xyXG4gIC8vdGhpcy5jdXJyZW50U3BvdD0wO1xyXG4gIC8vdGhpcy53b3JkTG9ja2VkID0gZmFsc2U7XHJcbn1cclxuXHJcblxyXG5cclxuc2V0QWN0aXZlV29yZCh3b3JkKXtcclxuICAgIC8vdGhpcy5hY3RpdmVXb3JkID0gd29yZC50b0xvd2VyQ2FzZSgpO1xyXG4gICAgdGhpcy5hY3RpdmVXb3JkID0gd29yZDtcclxuICAgIHRoaXMuY3VycmVudElucHV0ID0gXCJcIlxyXG4gICAgLy90aGlzLndvcmRMb2NrZWQgPSBmYWxzZTtcclxuICAgIC8vdGhpcy5jdXJyZW50U3BvdCA9IDA7XHJcbn1cclxuXHJcbmNoZWNrTGV0dGVyKGxldHRlcil7XHJcbiAgICAvL2NvbnN0IGV4cGVjdGVkQ2hhciA9IHRoaXMudGFyZ2V0V29yZFt0aGlzLmN1cnJlbnRTcG90XTtcclxuICAgIGlmKC8qIXRoaXMud29yZExvY2tlZCB8fCovICF0aGlzLmFjdGl2ZVdvcmQpe1xyXG4gICAgICAgIHJldHVybiBmYWxzZTsgICAgXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZXhwZWN0ZWRDaGFyID0gdGhpcy5hY3RpdmVXb3JkW3RoaXMuY3VycmVudElucHV0Lmxlbmd0aF07XHJcblxyXG4gICAgaWYobGV0dGVyID09PSBleHBlY3RlZENoYXIpe1xyXG4gICAgICAgIHRoaXMuY3VycmVudElucHV0ICs9IGxldHRlcjtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZTtcclxuXHJcblxyXG59XHJcblxyXG5cclxuaXNXb3JkQ29tcGxldGUoKXtcclxuICAgIHJldHVybiB0aGlzLmFjdGl2ZVdvcmQgJiYgdGhpcy5jdXJyZW50SW5wdXQgPT09IHRoaXMuYWN0aXZlV29yZDtcclxufVxyXG5nZXRBY3RpdmVXb3JkKCl7XHJcbiAgICByZXR1cm4gdGhpcy5hY3RpdmVXb3JkO1xyXG59XHJcbnJlc2V0KCl7XHJcbiAgICB0aGlzLmN1cnJlbnRJbnB1dCA9IFwiXCI7XHJcbiAgICB0aGlzLmFjdGl2ZVdvcmQgPSBudWxsO1xyXG4gICAgLy90aGlzLndvcmRMb2NrZWQgPSBmYWxzZTtcclxufVxyXG5cclxuZ2V0Q3VycmVudElucHV0KCl7XHJcbiAgICByZXR1cm4gdGhpcy5jdXJyZW50SW5wdXQ7XHJcbn1cclxuaGFzQWN0aXZlV29yZCgpe1xyXG4gICAgcmV0dXJuIHRoaXMuYWN0aXZlV29yZCAhPT0gXCJcIjtcclxufVxyXG5cclxufSIsIlwidXNlIHN0cmljdFwiXHJcblxyXG5jb25zdCBFbGVtZW50ID0gcmVxdWlyZSgnLi9lbGVtZW50JylcclxuY29uc3QgRW5nbGlzaEdlcm1hbkRpY3Rpb25hcnkgPSByZXF1aXJlKCcuL2RpY3Rpb25hcnknKVxyXG5jb25zdCBJbnB1dEZpZWxkID0gcmVxdWlyZSgnLi9pbnB1dGZpZWxkJylcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgV29yZCBleHRlbmRzIEVsZW1lbnQge1xyXG4gICAgY29uc3RydWN0b3IoZ2FtZSwgeCwgeSwgY2lyY2xlSWQsIHNwZWVkKSB7XHJcbiAgICAgICAgc3VwZXIoKVxyXG4gICAgICAgIHRoaXMuZGVzdHJveWVkID0gZmFsc2UgXHJcbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZVxyXG4gICAgICAgIHRoaXMuY2lyY2xlSWQgPSBjaXJjbGVJZFxyXG4gICAgICAgIHRoaXMuc3BlZWQgPSBzcGVlZFxyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBkaWN0aW9uYXJ5ID0gbmV3IEVuZ2xpc2hHZXJtYW5EaWN0aW9uYXJ5KCk7XHJcbiAgICAgICAgaWYoSW5wdXRGaWVsZC5JbnB1dGxpc3QubGVuZ3RoICE9IDApIHtcclxuICAgICAgICAgICAgZGljdGlvbmFyeS5zZXRXb3JkcyhJbnB1dEZpZWxkLklucHV0bGlzdCk7XHJcbiAgICAgICAgICAgIGdhbWUuZ2FtZU1vZGUgPSBcIm93bldvcmRzXCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCByYW5kb21JbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGRpY3Rpb25hcnkud29yZHMubGVuZ3RoKTtcclxuICAgICAgICBsZXQgZW5nbGlzaFdvcmQgPSBkaWN0aW9uYXJ5LndvcmRzW3JhbmRvbUluZGV4XTtcclxuICAgICAgICBcclxuICAgICAgICBpZiAoZ2FtZS5nYW1lTW9kZSA9PT0gJ2dlcm1hbicpIHtcclxuICAgICAgICAgICAgdGhpcy5kaXNwbGF5V29yZCA9IGRpY3Rpb25hcnkudHJhbnNsYXRlKGVuZ2xpc2hXb3JkKTtcclxuICAgICAgICAgICAgdGhpcy53b3JkID0gZW5nbGlzaFdvcmQ7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5kaXNwbGF5V29yZCA9IGVuZ2xpc2hXb3JkO1xyXG4gICAgICAgICAgICB0aGlzLndvcmQgPSBlbmdsaXNoV29yZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgd2hpbGUgKGdhbWUuaXNXb3JkT25EaXNwbGF5KHRoaXMud29yZCkpIHtcclxuICAgICAgICAgICAgY29uc3QgbmV3SW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBkaWN0aW9uYXJ5LndvcmRzLmxlbmd0aCk7XHJcbiAgICAgICAgICAgIGVuZ2xpc2hXb3JkID0gZGljdGlvbmFyeS53b3Jkc1tuZXdJbmRleF07XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAoZ2FtZS5nYW1lTW9kZSA9PT0gJ2dlcm1hbicpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGlzcGxheVdvcmQgPSBkaWN0aW9uYXJ5LnRyYW5zbGF0ZShlbmdsaXNoV29yZCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndvcmQgPSBlbmdsaXNoV29yZDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGlzcGxheVdvcmQgPSBlbmdsaXNoV29yZDtcclxuICAgICAgICAgICAgICAgIHRoaXMud29yZCA9IGVuZ2xpc2hXb3JkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMueCA9IHggLSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm15Y2FudmFzXCIpLmdldENvbnRleHQoJzJkJykubWVhc3VyZVRleHQodGhpcy5kaXNwbGF5V29yZCkud2lkdGggLyAyIC8vdGhpcy5kaXNwbGF5V29yZC5sZW5ndGgqOC8yXHJcbiAgICAgICAgdGhpcy55ID0geSArIDMwXHJcbiAgICB9XHJcblxyXG4gICAgZHJhdyhjdHgpIHtcclxuICAgICAgICBsZXQgY3VycmVudElucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjdXJyZW50LWlucHV0XCIpXHJcbiAgICAgICAgaWYoY3VycmVudElucHV0LnRleHRDb250ZW50LmF0KDApID09IHRoaXMuZGlzcGxheVdvcmQuYXQoMCkpIHtcclxuICAgICAgICAgICAgbGV0IGN1cnJlbnRJbnB1dExlbmd0aCA9IGN1cnJlbnRJbnB1dC50ZXh0Q29udGVudC5sZW5ndGhcclxuICAgICAgICAgICAgY29uc3QgZmlyc3RQYXJ0ID0gdGhpcy5kaXNwbGF5V29yZC5zbGljZSgwLCBjdXJyZW50SW5wdXRMZW5ndGgpO1xyXG4gICAgICAgICAgICBjb25zdCByZXN0UGFydCAgPSB0aGlzLmRpc3BsYXlXb3JkLnNsaWNlKGN1cnJlbnRJbnB1dExlbmd0aCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHR5cGVkVGV4dFdpZHRoID0gY3R4Lm1lYXN1cmVUZXh0KGZpcnN0UGFydCkud2lkdGg7XHJcblxyXG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gXCJncmV5XCI7XHJcbiAgICAgICAgICAgIGN0eC5maWxsVGV4dChmaXJzdFBhcnQsIHRoaXMueCwgdGhpcy55KTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSBcIndoaXRlXCJcclxuICAgICAgICAgICAgY3R4LmZpbGxUZXh0KHJlc3RQYXJ0LCB0aGlzLnggKyB0eXBlZFRleHRXaWR0aCwgdGhpcy55KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gXCJ3aGl0ZVwiXHJcbiAgICAgICAgICAgIGN0eC5maWxsVGV4dCh0aGlzLmRpc3BsYXlXb3JkLCB0aGlzLngsIHRoaXMueSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGFjdGlvbigpIHtcclxuICAgICAgICAvL3RoaXMueCArPSBNYXRoLnJhbmRvbSgpICogMiAtIDFcclxuICAgICAgICB0aGlzLnkgKz0gdGhpcy5zcGVlZFxyXG4gICAgICAgICAgICBpZiAodGhpcy55ID4gd2luZG93LmlubmVySGVpZ2h0IC0gODApIHRoaXMuZGVzdHJveWVkID0gdHJ1ZVxyXG4gICAgfVxyXG5cclxuICAgIGNoZWNrQ29sbGlzaW9uKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmdhbWUuZWxlbWVudExpc3QuZ2V0KHRoaXMuY2lyY2xlSWQpID09IG51bGwpIHsgLy9pZiBpdCBpcyBudWxsLCB0aGF0IG1lYW5zIHRoZSBjaXJjbGUgaGFzIGNvbGxpZGVkXHJcbiAgICAgICAgICAgIHRoaXMub25Db2xsaXNpb24oKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBvbkNvbGxpc2lvbigpIHtcclxuICAgICAgICB0aGlzLmhhc0NvbGxpZGVkID0gdHJ1ZVxyXG4gICAgICAgIHRoaXMuZ2FtZS5lbGVtZW50TGlzdC5kZWxldGUodGhpcy5pbnN0YW5jZUlkKTtcclxuICAgIH1cclxuXHJcbn1cclxuIiwiJ3VzZSBzdHJpY3QnXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFdvcmRJbnB1dEhhbmRsZXJ7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICB0aGlzLmlucHV0TGluZT0gbnVsbDtcclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5oYW5kbGVJbnB1dC5iaW5kKHRoaXMpKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRMZXR0ZXJDYWxsYmFjayhjYWxsYmFjayl7XHJcbiAgICAgICAgdGhpcy5pbnB1dExpbmUgPSBjYWxsYmFjaztcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVJbnB1dChldmVudCl7XHJcbiAgICAgIC8vICBpZihldmVudC5rZXkubGVuZ3RoPT0xICYmIC9bYS16QS1aXS8udGVzdChldmVudC5rZXkpKXsgLy8gb3JnaW5hbGUgXHJcbiAgICAgIGlmIChldmVudC5rZXkubGVuZ3RoID09PSAxICYmIC9cXHB7TH0vdS50ZXN0KGV2ZW50LmtleSkpIHsgLy8gQWxsZSBBU0NJSSByZWdlc3RyaWVydGUgYnVjaHN0YWJlblxyXG5cclxuICAgICAgICAgICAgY29uc3QgbGV0dGVyPSBldmVudC5rZXkudG9Mb3dlckNhc2UoKTtcclxuXHJcbiAgICAgICAgICAgIGlmKHRoaXMuaW5wdXRMaW5lKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuaW5wdXRMaW5lKGxldHRlcik7XHJcbiAgICAgICAgICAgIH0gICBcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKlxyXG4gICAgbm90aWZ5KGxldHRlcil7XHJcbiAgICAgICAgLy9oaWVyIHdlcmRlbiBkaWUgYW5kZXJlbiBrbGFzc2VuIHZvbiBkZW0gbmV1ZW4gYnVjaHN0YWJlbiBub3RpZmllcnRcclxuICAgICAgICAvLyBldnRsIMO8YmVyZmzDvHNzaWdcclxuICAgIH1cclxuXHJcbiAgICBnZXRJbnB1dCgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmlucHV0O1xyXG4gICAgfVxyXG5cclxuICAgIHJlc2V0SW5wdXQoKXtcclxuICAgICAgICB0aGlzLmlucHV0PSBcIlwiO1xyXG4gICAgfSovXHJcbn0iXX0=
