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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJnYW1lL2F1ZGlvTWFuYWdlci5qcyIsImdhbWUvYnVsbGV0LmpzIiwiZ2FtZS9idXJzdC5qcyIsImdhbWUvZGljdGlvbmFyeS5qcyIsImdhbWUvZWxlbWVudC5qcyIsImdhbWUvZWxlbWVudGxpc3QuanMiLCJnYW1lL2dhbWUuanMiLCJnYW1lL2hlYWx0aC5qcyIsImdhbWUvaW5wdXRmaWVsZC5qcyIsImdhbWUvbWFpbi5qcyIsImdhbWUvcmFuZG9td2Fsa2NpcmNsZWVsZW1lbnQuanMiLCJnYW1lL3JlZ2VuZXJhdGVCb3NzLmpzIiwiZ2FtZS9zcGF3bmVyYm9zcy5qcyIsImdhbWUvc3BsaXR0ZXJCb3NzLmpzIiwiZ2FtZS9zdGFnZS5qcyIsImdhbWUvdmFsaWRhdG9yLmpzIiwiZ2FtZS93b3JkLmpzIiwiZ2FtZS93b3JkaW5wdXRoYW5kbGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25aQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIid1c2Ugc3RyaWN0J1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBBdWRpb01hbmFnZXIge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgdGhpcy5zb3VuZHM9IHt9O1xyXG4gICAgICAgIHRoaXMubXV0ZWQ9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuc291bmRzLmV4cGxvc2lvbiA9IG5ldyBBdWRpbygnc291bmRzL2V4cGxvc2lvbi5tcDMnKTtcclxuICAgICAgICB0aGlzLnNvdW5kcy5sYXNlciA9IG5ldyBBdWRpbygnc291bmRzL2xhc2VyU2hvdC5tcDMnKTtcclxuICAgICAgICB0aGlzLnNvdW5kcy5lcnJvciA9IG5ldyBBdWRpbygnc291bmRzL2Vycm9yLm1wMycpO1xyXG4gICAgICAgIHRoaXMuc291bmRzLmJhY2tncm91bmQgPSBuZXcgQXVkaW8oJ3NvdW5kcy9iYWNrZ3JvdW5kLm1wMycpO1xyXG4gICAgICAgIHRoaXMuc291bmRzLmdhbWVPdmVyID0gbmV3IEF1ZGlvKCdzb3VuZHMvZ2FtZU92ZXIubXAzJylcclxuXHJcblxyXG4gICAgICAgIC8vU291bmRzIGxhZGVuXHJcbiAgICAgICAgT2JqZWN0LnZhbHVlcyh0aGlzLnNvdW5kcykuZm9yRWFjaChzb3VuZCA9PiB7XHJcbiAgICAgICAgICAgIHNvdW5kLnByZWxvYWQgPSAnYXV0byc7XHJcbiAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICAvL1RvbmVpbnN0ZWxsdW5nZW5cclxuICAgICAgICB0aGlzLnNvdW5kcy5leHBsb3Npb24udm9sdW1lID0gMC40O1xyXG4gICAgICAgIHRoaXMuc291bmRzLmxhc2VyLnZvbHVtZSA9IDAuMDM7XHJcbiAgICAgICAgdGhpcy5zb3VuZHMuZXJyb3Iudm9sdW1lID0gMC41O1xyXG4gICAgICAgIHRoaXMuc291bmRzLmJhY2tncm91bmQudm9sdW1lID0gMC4xO1xyXG4gICAgICAgIHRoaXMuc291bmRzLmdhbWVPdmVyLnZvbHVtZSA9IDAuMTtcclxuICAgICAgICB0aGlzLnNvdW5kcy5iYWNrZ3JvdW5kLmxvb3AgPSB0cnVlO1xyXG4gICAgICAgIFxyXG5cclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICBwbGF5U291bmQobmFtZSl7XHJcbiAgICAgICAgaWYoIXRoaXMubXV0ZWQgJiYgdGhpcy5zb3VuZHNbbmFtZV0pe1xyXG4gICAgICAgICAgICB0aGlzLnNvdW5kc1tuYW1lXS5jdXJyZW50VGltZSA9IDA7XHJcbiAgICAgICAgICAgIHRoaXMuc291bmRzW25hbWVdLnBsYXkoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RvcFNvdW5kKG5hbWUpe1xyXG4gICAgICAgIGlmKHRoaXMuc291bmRzW25hbWVdKXtcclxuICAgICAgICAgICAgdGhpcy5zb3VuZHNbbmFtZV0ucGF1c2UoKTtcclxuICAgICAgICAgICAgdGhpcy5zb3VuZHNbbmFtZV0uY3VycmVudFRpbWUgPSAwO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0iLCJjb25zdCBFbGVtZW50ID0gcmVxdWlyZSgnLi9lbGVtZW50JylcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgQnVsbGV0IGV4dGVuZHMgRWxlbWVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcih0YXJnZXRYLCB0YXJnZXRZLCB0YXJnZXRJZCwgZ2FtZSkge1xyXG4gICAgICAgIHN1cGVyKClcclxuICAgICAgICAvLyBTdGFydHBvc2l0aW9uOiBGZXN0LCB3aWUgZHUgd2lsbHN0XHJcbiAgICAgICAgdGhpcy54ID0gMzAwXHJcbiAgICAgICAgdGhpcy55ID0gNDY1XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy50YXJnZXRYID0gdGFyZ2V0WFxyXG4gICAgICAgIHRoaXMudGFyZ2V0WSA9IHRhcmdldFlcclxuICAgICAgICB0aGlzLnRhcmdldElkID0gdGFyZ2V0SWQgIC8vIGluc3RhbmNlSWQgZGVzIFpJRUwtS3JlaXNlc1xyXG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWVcclxuICAgICAgICB0aGlzLmhhc0NvbGxpZGVkID0gZmFsc2VcclxuICAgICAgICBcclxuICAgICAgICAvLyBSaWNodHVuZ3N2ZWt0b3JcclxuICAgICAgICBjb25zdCBkeCA9IHRhcmdldFggLSB0aGlzLnhcclxuICAgICAgICBjb25zdCBkeSA9IHRhcmdldFkgLSB0aGlzLnlcclxuICAgICAgICBjb25zdCBkaXN0ID0gTWF0aC5oeXBvdChkeCwgZHkpIHx8IDFcclxuICAgICAgICB0aGlzLnZ4ID0gKGR4IC8gZGlzdCkgKiA4XHJcbiAgICAgICAgdGhpcy52eSA9IChkeSAvIGRpc3QpICogOFxyXG5cclxuICAgICAgICBpZiAodGhpcy5nYW1lICYmIHRoaXMuZ2FtZS5hdWRpb01hbmFnZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5nYW1lLmF1ZGlvTWFuYWdlci5wbGF5U291bmQoJ2xhc2VyJylcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZHJhdyhjdHgpIHtcclxuICAgICAgICBpZiAodGhpcy5oYXNDb2xsaWRlZCkgcmV0dXJuXHJcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICcjZmYwJ1xyXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKVxyXG4gICAgICAgIGN0eC5hcmModGhpcy54LCB0aGlzLnksIDUsIDAsIE1hdGguUEkgKiAyKVxyXG4gICAgICAgIGN0eC5maWxsKClcclxuICAgICAgICBcclxuICAgICAgICBjdHguc2hhZG93Qmx1ciA9IDEwXHJcbiAgICAgICAgY3R4LnNoYWRvd0NvbG9yID0gJyNmZjAnXHJcbiAgICAgICAgY3R4LmZpbGwoKVxyXG4gICAgICAgIGN0eC5zaGFkb3dCbHVyID0gMFxyXG4gICAgfVxyXG5cclxuICAgIGFjdGlvbigpIHtcclxuICAgICAgICBpZiAodGhpcy5oYXNDb2xsaWRlZCkgcmV0dXJuXHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gWmllbC1LcmVpcy1Qb3NpdGlvbiBha3R1YWxpc2llcmVuIChlciBiZXdlZ3Qgc2ljaCEpXHJcbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gdGhpcy5nYW1lLmVsZW1lbnRMaXN0LmdldCh0aGlzLnRhcmdldElkKVxyXG4gICAgICAgIGlmICh0YXJnZXQpIHtcclxuICAgICAgICAgICAgdGhpcy50YXJnZXRYID0gdGFyZ2V0LnhcclxuICAgICAgICAgICAgdGhpcy50YXJnZXRZID0gdGFyZ2V0LnlcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGNvbnN0IGR4ID0gdGhpcy50YXJnZXRYIC0gdGhpcy54XHJcbiAgICAgICAgICAgIGNvbnN0IGR5ID0gdGhpcy50YXJnZXRZIC0gdGhpcy55XHJcbiAgICAgICAgICAgIGNvbnN0IGRpc3QgPSBNYXRoLmh5cG90KGR4LCBkeSkgfHwgMVxyXG4gICAgICAgICAgICB0aGlzLnZ4ID0gKGR4IC8gZGlzdCkgKiA4XHJcbiAgICAgICAgICAgIHRoaXMudnkgPSAoZHkgLyBkaXN0KSAqIDhcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy54ICs9IHRoaXMudnhcclxuICAgICAgICB0aGlzLnkgKz0gdGhpcy52eVxyXG4gICAgfVxyXG5cclxuICAgIGNoZWNrQ29sbGlzaW9uKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmdhbWUuZWxlbWVudExpc3QuZ2V0KHRoaXMudGFyZ2V0SWQpID09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5vbkNvbGxpc2lvbigpXHJcbiAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBkaXN0ID0gTWF0aC5oeXBvdCh0aGlzLnRhcmdldFggLSB0aGlzLngsIHRoaXMudGFyZ2V0WSAtIHRoaXMueSlcclxuICAgICAgICBpZiAoZGlzdCA8IDE1KSB7XHJcbiAgICAgICAgICAgIHRoaXMub25Db2xsaXNpb24oKVxyXG4gICAgICAgICAgICB0aGlzLmdhbWUuZWxlbWVudExpc3QuZ2V0KHRoaXMudGFyZ2V0SWQpLmJ1bGxldE1ldCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy54IDwgMCB8fCB0aGlzLnggPiB3aW5kb3cuaW5uZXJXaWR0aCB8fCBcclxuICAgICAgICAgICAgdGhpcy55IDwgMCB8fCB0aGlzLnkgPiB3aW5kb3cuaW5uZXJIZWlnaHQpIHtcclxuICAgICAgICAgICAgdGhpcy5vbkNvbGxpc2lvbigpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG9uQ29sbGlzaW9uKCkge1xyXG4gICAgICAgIHRoaXMuaGFzQ29sbGlkZWQgPSB0cnVlXHJcbiAgICAgICAgdGhpcy5nYW1lLmVsZW1lbnRMaXN0LmRlbGV0ZSh0aGlzLmluc3RhbmNlSWQpXHJcbiAgICB9XHJcbn1cclxuIiwiXCJ1c2Ugc3RyaWN0XCJcclxuXHJcbmNvbnN0IEVsZW1lbnQgPSByZXF1aXJlKCcuL2VsZW1lbnQnKVxyXG5jb25zdCBFbGVtZW50TGlzdCA9IHJlcXVpcmUoJy4vZWxlbWVudGxpc3QnKVxyXG5jb25zdCBHYW1lID0gcmVxdWlyZSgnLi9nYW1lJylcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgQnVyc3QgZXh0ZW5kcyBFbGVtZW50IHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih4LCB5LCBnYW1lKSB7XHJcbiAgICAgICAgc3VwZXIoKVxyXG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWVcclxuICAgICAgICB0aGlzLnggPSB4XHJcbiAgICAgICAgdGhpcy55ID0geVxyXG4gICAgICAgIHRoaXMuc2l6ZSA9IDE1ICBcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuZ2FtZSAmJiB0aGlzLmdhbWUuYXVkaW9NYW5hZ2VyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5hdWRpb01hbmFnZXIucGxheVNvdW5kKCdleHBsb3Npb24nKVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmNoZWNrQ29sbGlzaW9uKClcclxuXHJcbiAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgZHJhdyhjdHgpIHtcclxuICAgICAgICB2YXIgaW1nID0gbmV3IEltYWdlKCk7XHJcbiAgICAgICAgaW1nLm9ubG9hZCA9ICgpID0+IHtcclxuICAgICAgICAgICAgY3R4LmRyYXdJbWFnZShpbWcsIHRoaXMueCAtIDEwLCB0aGlzLnkgLSAxMCwgMzAsIDMwKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIGltZy5zcmMgPSAnaW1nL2V4cGxvc2lvbi5wbmcnO1xyXG4gICAgfVxyXG5cclxuICAgIGFjdGlvbigpIHtcclxuICAgICAgICAvL3RoaXMueCArPSBNYXRoLnJhbmRvbSgpICogMiAtIDFcclxuICAgIH1cclxuICAgIFxyXG4gICAgY2hlY2tDb2xsaXNpb24oKSB7IFxyXG4gICAgICAgIGlmKHRoaXMuaW5zdGFuY2VJZCAhPSAtMSkge1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMub25Db2xsaXNpb24oKVxyXG4gICAgICAgICAgICB9LCA3MDApOyAgXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG9uQ29sbGlzaW9uKCkge1xyXG4gICAgICAgIHRoaXMuaGFzQ29sbGlkZWQgPSB0cnVlXHJcbiAgICAgICAgdGhpcy5nYW1lLmVsZW1lbnRMaXN0LmRlbGV0ZSh0aGlzLmluc3RhbmNlSWQpXHJcbiAgICB9XHJcbn0iLCJjbGFzcyBFbmdsaXNoR2VybWFuRGljdGlvbmFyeSB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuXHJcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAgICAgLy8g8J+UuSAxLiBFbmdsaXNjaGUgV8O2cnRlcmxpc3RlIChOVVIgRW5nbGlzaCBXb3JkcylcclxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgICAgICB0aGlzLndvcmRzID0gWyAvL2xpc3RlIDEgXHJcbiAgICAgICAgICAgIFwiYXBwbGVcIiwgXCJhbmltYWxcIiwgXCJhbnN3ZXJcIiwgXCJhaXJcIiwgXCJhZ2VcIiwgXCJhcmVhXCIsIFwiYXJtXCIsIFwiYXNrXCIsXHJcbiAgICAgICAgICAgIFwiYWx3YXlzXCIsIFwiYW55dGhpbmdcIixcclxuICAgICAgICAgICAgXCJiYWJ5XCIsIFwiYmFnXCIsIFwiYmFsbFwiLCBcImJhbmtcIiwgXCJiYXRoXCIsIFwiYmVhY2hcIiwgXCJiZWFyXCIsIFwiYmVhdXRpZnVsXCIsXHJcbiAgICAgICAgICAgIFwiYmVjYXVzZVwiLCBcImJlZFwiLCBcImJlZXJcIiwgXCJiZWZvcmVcIiwgXCJiZWdpblwiLCBcImJlaGluZFwiLCBcImJpZ1wiLCBcImJpcmRcIixcclxuICAgICAgICAgICAgXCJiaXJ0aGRheVwiLCBcImJsYWNrXCIsIFwiYmxvb2RcIiwgXCJibHVlXCIsIFwiYm9va1wiLCBcImJvb3RcIiwgXCJicmVhZFwiLFxyXG4gICAgICAgICAgICBcImJyZWFrXCIsIFwiYnJvdGhlclwiLFxyXG4gICAgICAgICAgICBcImNha2VcIiwgXCJjYXJcIiwgXCJjYXRcIiwgXCJjaGFpclwiLCBcImNoZWVzZVwiLCBcImNoaWxkXCIsIFwiY2l0eVwiLCBcImNsZWFuXCIsXHJcbiAgICAgICAgICAgIFwiY2xvc2VcIiwgXCJjbG91ZFwiLCBcImNvZmZlZVwiLCBcImNvbGRcIiwgXCJjb2xvclwiLCBcImNvdW50cnlcIiwgXCJjdXBcIixcclxuICAgICAgICAgICAgXCJkYXlcIiwgXCJkYWRcIiwgXCJkYW5jZVwiLCBcImRhcmtcIiwgXCJkYXVnaHRlclwiLCBcImRlYWRcIiwgXCJkZWFyXCIsIFwiZGVlcFwiLFxyXG4gICAgICAgICAgICBcImRlc2tcIiwgXCJkaW5uZXJcIiwgXCJkb2dcIiwgXCJkb29yXCIsIFwiZHJlYW1cIiwgXCJkcmlua1wiLCBcImRyaXZlXCIsXHJcbiAgICAgICAgICAgIFwiZWFyXCIsIFwiZWFydGhcIiwgXCJlYXN5XCIsIFwiZWF0XCIsIFwiZWdnXCIsIFwiZW5lcmd5XCIsIFwiZXZlbmluZ1wiLCBcImV5ZVwiLFxyXG4gICAgICAgICAgICBcImV2ZXJ5dGhpbmdcIixcclxuICAgICAgICAgICAgXCJmYWNlXCIsIFwiZmFtaWx5XCIsIFwiZmFyXCIsIFwiZmFybVwiLCBcImZhc3RcIiwgXCJmYXRoZXJcIiwgXCJmZWV0XCIsIFwiZmlnaHRcIixcclxuICAgICAgICAgICAgXCJmaXJlXCIsIFwiZmlzaFwiLCBcImZsb29yXCIsIFwiZmxvd2VyXCIsIFwiZm9vZFwiLCBcImZvb3RcIiwgXCJmcmllbmRcIixcclxuICAgICAgICAgICAgXCJnYXJkZW5cIiwgXCJnaXJsXCIsIFwiZ2xhc3NcIiwgXCJnb1wiLCBcImdvb2RcIiwgXCJncmVlblwiLCBcImdyb3VuZFwiLCBcImdyb3VwXCIsXHJcbiAgICAgICAgICAgIFwiaGFpclwiLCBcImhhbmRcIiwgXCJoYW5nXCIsIFwiaGFwcHlcIiwgXCJoYXRcIiwgXCJoZWFkXCIsIFwiaGVhbHRoXCIsIFwiaGVhcnRcIixcclxuICAgICAgICAgICAgXCJoZWF0XCIsIFwiaGVhdnlcIiwgXCJoZWxsb1wiLCBcImhlcmVcIiwgXCJoaWdoXCIsIFwiaG9tZVwiLCBcImhvcnNlXCIsIFwiaG91c2VcIixcclxuICAgICAgICAgICAgXCJpY2VcIiwgXCJpZGVhXCIsIFwiaWxsXCIsIFwiaW1wb3J0YW50XCIsIFwiaW5zaWRlXCIsIFwiaXNsYW5kXCIsXHJcbiAgICAgICAgICAgIFwiam9iXCIsIFwianVpY2VcIiwgXCJqdW1wXCIsXHJcbiAgICAgICAgICAgIFwia2V5XCIsIFwia2lsbFwiLCBcImtpbmdcIiwgXCJraXRjaGVuXCIsIFwia2lzc1wiLCBcImtub3dcIixcclxuICAgICAgICAgICAgXCJsYWtlXCIsIFwibGFuZFwiLCBcImxhbmd1YWdlXCIsIFwibGFyZ2VcIiwgXCJsYXVnaFwiLCBcImxlYXJuXCIsIFwibGVmdFwiLFxyXG4gICAgICAgICAgICBcImxlZ1wiLCBcImxpZmVcIiwgXCJsaWdodFwiLCBcImxpa2VcIiwgXCJsaW9uXCIsIFwibGl0dGxlXCIsIFwibG9uZ1wiLCBcImxvdmVcIixcclxuICAgICAgICAgICAgXCJtYWNoaW5lXCIsIFwibWFrZVwiLCBcIm1hblwiLCBcIm1hbnlcIiwgXCJtaWxrXCIsIFwibWludXRlXCIsIFwibW9uZXlcIixcclxuICAgICAgICAgICAgXCJtb250aFwiLCBcIm1vcm5pbmdcIiwgXCJtb3RoZXJcIiwgXCJtb3VudGFpblwiLFxyXG4gICAgICAgICAgICBcIm5hbWVcIiwgXCJuYXRpb25cIiwgXCJuZWFyXCIsIFwibmVja1wiLCBcIm5pZ2h0XCIsIFwibm9pc2VcIiwgXCJub3J0aFwiLFxyXG4gICAgICAgICAgICBcIm9jZWFuXCIsIFwib2ZmXCIsIFwib2ZmaWNlXCIsIFwib2lsXCIsIFwib2xkXCIsIFwib3BlblwiLCBcIm9yYW5nZVwiLCBcIm9yZGVyXCIsXHJcbiAgICAgICAgICAgIFwicGFnZVwiLCBcInBhcGVyXCIsIFwicGFyZW50XCIsIFwicGFya1wiLCBcInBhcnR5XCIsIFwicGVuXCIsIFwicGVvcGxlXCIsXHJcbiAgICAgICAgICAgIFwicGhvbmVcIiwgXCJwaWN0dXJlXCIsIFwicGxhY2VcIiwgXCJwbGFudFwiLCBcInBsYXlcIiwgXCJwb2NrZXRcIiwgXCJwb2xpY2VcIixcclxuICAgICAgICAgICAgXCJwb3RhdG9cIiwgXCJwcm9ibGVtXCIsXHJcbiAgICAgICAgICAgIFwicXVlZW5cIiwgXCJxdWVzdGlvblwiLFxyXG4gICAgICAgICAgICBcInJhaW5cIiwgXCJyZXN0YXVyYW50XCIsIFwicmVkXCIsIFwicmlnaHRcIiwgXCJyaXZlclwiLCBcInJvYWRcIiwgXCJyb29tXCIsIFwicnVuXCIsXHJcbiAgICAgICAgICAgIFwic2FsdFwiLCBcInNhbmRcIiwgXCJzY2hvb2xcIiwgXCJzZWFcIiwgXCJzZWFzb25cIiwgXCJzZWVcIiwgXCJzaGlydFwiLFxyXG4gICAgICAgICAgICBcInNob2VcIiwgXCJzaG9wXCIsIFwic2hvcnRcIiwgXCJzbGVlcFwiLCBcInNsb3dcIiwgXCJzbWFsbFwiLCBcInNtaWxlXCIsIFwic25vd1wiLFxyXG4gICAgICAgICAgICBcInNvblwiLCBcInNvdW5kXCIsIFwic291cFwiLCBcInNwb3J0XCIsIFwic3ByaW5nXCIsIFwic3RhclwiLCBcInN0b25lXCIsXHJcbiAgICAgICAgICAgIFwic3RyZWV0XCIsIFwic3Ryb25nXCIsIFwic3VtbWVyXCIsIFwic3VuXCIsIFwic3dlZXRcIixcclxuICAgICAgICAgICAgXCJ0YWJsZVwiLCBcInRlYWNoZXJcIiwgXCJ0ZWFcIiwgXCJ0ZWFtXCIsIFwidGVuXCIsIFwidGVzdFwiLCBcInRoaW5nXCIsXHJcbiAgICAgICAgICAgIFwidGhvdWdodFwiLCBcInRpbWVcIiwgXCJ0aXJlZFwiLCBcInRvbW9ycm93XCIsIFwidG93blwiLCBcInRyZWVcIiwgXCJ0cmFpblwiLFxyXG4gICAgICAgICAgICBcInRyYXZlbFwiLFxyXG4gICAgICAgICAgICBcInVuZGVyXCIsIFwidW5jbGVcIiwgXCJ1cFwiLCBcInVzZVwiLFxyXG4gICAgICAgICAgICBcInZpbGxhZ2VcIiwgXCJ2b2ljZVwiLFxyXG4gICAgICAgICAgICBcIndhbGtcIiwgXCJ3YXJtXCIsIFwid2F0ZXJcIiwgXCJ3YXlcIiwgXCJ3ZWVrXCIsIFwid2VsY29tZVwiLCBcIndoaXRlXCIsXHJcbiAgICAgICAgICAgIFwid2luZG93XCIsIFwid2luZFwiLCBcIndpbnRlclwiLCBcIndvbWFuXCIsIFwid29yZFwiLCBcIndvcmtcIiwgXCJ3b3JsZFwiLFxyXG4gICAgICAgICAgICBcIndyaXRlXCIsXHJcbiAgICAgICAgICAgIFwieWVhclwiLCBcInllbGxvd1wiLCBcInlvdW5nXCIsXHJcbiAgICAgICAgICAgIFwiem9vXCJcclxuICAgICAgICBdO1xyXG5cclxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgICAgICAvLyDwn5S5IDIuIEVuZ2xpc2NoZSBXw7ZydGVyIOKGkiBEZXV0c2NoZSDDnGJlcnNldHp1bmdlblxyXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgICAgIHRoaXMudHJhbnNsYXRpb25zID0ge1xyXG4gICAgICAgICAgICBcImFwcGxlXCI6IFwiQXBmZWxcIiwgXCJhbmltYWxcIjogXCJUaWVyXCIsIFwiYW5zd2VyXCI6IFwiQW50d29ydFwiLCBcImFpclwiOiBcIkx1ZnRcIixcclxuICAgICAgICAgICAgXCJhZ2VcIjogXCJBbHRlclwiLCBcImFyZWFcIjogXCJCZXJlaWNoXCIsIFwiYXJtXCI6IFwiQXJtXCIsIFwiYXNrXCI6IFwiZnJhZ2VuXCIsXHJcbiAgICAgICAgICAgIFwiYWx3YXlzXCI6IFwiaW1tZXJcIiwgXCJhbnl0aGluZ1wiOiBcImV0d2FzXCIsXHJcblxyXG4gICAgICAgICAgICBcImJhYnlcIjogXCJCYWJ5XCIsIFwiYmFnXCI6IFwiVGFzY2hlXCIsIFwiYmFsbFwiOiBcIkJhbGxcIiwgXCJiYW5rXCI6IFwiQmFua1wiLFxyXG4gICAgICAgICAgICBcImJhdGhcIjogXCJCYWRcIiwgXCJiZWFjaFwiOiBcIlN0cmFuZFwiLCBcImJlYXJcIjogXCJCw6RyXCIsIFwiYmVhdXRpZnVsXCI6IFwic2Now7ZuXCIsXHJcbiAgICAgICAgICAgIFwiYmVjYXVzZVwiOiBcIndlaWxcIiwgXCJiZWRcIjogXCJCZXR0XCIsIFwiYmVlclwiOiBcIkJpZXJcIiwgXCJiZWZvcmVcIjogXCJ2b3JoZXJcIixcclxuICAgICAgICAgICAgXCJiZWdpblwiOiBcImJlZ2lubmVuXCIsIFwiYmVoaW5kXCI6IFwiaGludGVyXCIsIFwiYmlnXCI6IFwiZ3Jvw59cIiwgXCJiaXJkXCI6IFwiVm9nZWxcIixcclxuICAgICAgICAgICAgXCJiaXJ0aGRheVwiOiBcIkdlYnVydHN0YWdcIiwgXCJibGFja1wiOiBcInNjaHdhcnpcIiwgXCJibG9vZFwiOiBcIkJsdXRcIixcclxuICAgICAgICAgICAgXCJibHVlXCI6IFwiYmxhdVwiLCBcImJvb2tcIjogXCJCdWNoXCIsIFwiYm9vdFwiOiBcIlN0aWVmZWxcIiwgXCJicmVhZFwiOiBcIkJyb3RcIixcclxuICAgICAgICAgICAgXCJicmVha1wiOiBcIlBhdXNlXCIsIFwiYnJvdGhlclwiOiBcIkJydWRlclwiLFxyXG5cclxuICAgICAgICAgICAgXCJjYWtlXCI6IFwiS3VjaGVuXCIsIFwiY2FyXCI6IFwiQXV0b1wiLCBcImNhdFwiOiBcIkthdHplXCIsIFwiY2hhaXJcIjogXCJTdHVobFwiLFxyXG4gICAgICAgICAgICBcImNoZWVzZVwiOiBcIkvDpHNlXCIsIFwiY2hpbGRcIjogXCJLaW5kXCIsIFwiY2l0eVwiOiBcIlN0YWR0XCIsIFwiY2xlYW5cIjogXCJzYXViZXJcIixcclxuICAgICAgICAgICAgXCJjbG9zZVwiOiBcInNjaGxpZcOfZW5cIiwgXCJjbG91ZFwiOiBcIldvbGtlXCIsIFwiY29mZmVlXCI6IFwiS2FmZmVlXCIsXHJcbiAgICAgICAgICAgIFwiY29sZFwiOiBcImthbHRcIiwgXCJjb2xvclwiOiBcIkZhcmJlXCIsIFwiY291bnRyeVwiOiBcIkxhbmRcIiwgXCJjdXBcIjogXCJUYXNzZVwiLFxyXG5cclxuICAgICAgICAgICAgXCJkYXlcIjogXCJUYWdcIiwgXCJkYWRcIjogXCJQYXBhXCIsIFwiZGFuY2VcIjogXCJ0YW56ZW5cIiwgXCJkYXJrXCI6IFwiZHVua2VsXCIsXHJcbiAgICAgICAgICAgIFwiZGF1Z2h0ZXJcIjogXCJUb2NodGVyXCIsIFwiZGVhZFwiOiBcInRvdFwiLCBcImRlYXJcIjogXCJsaWViXCIsIFwiZGVlcFwiOiBcInRpZWZcIixcclxuICAgICAgICAgICAgXCJkZXNrXCI6IFwiU2NocmVpYnRpc2NoXCIsIFwiZGlubmVyXCI6IFwiQWJlbmRlc3NlblwiLCBcImRvZ1wiOiBcIkh1bmRcIixcclxuICAgICAgICAgICAgXCJkb29yXCI6IFwiVMO8clwiLCBcImRyZWFtXCI6IFwiVHJhdW1cIiwgXCJkcmlua1wiOiBcIkdldHLDpG5rXCIsIFwiZHJpdmVcIjogXCJmYWhyZW5cIixcclxuXHJcbiAgICAgICAgICAgIFwiZWFyXCI6IFwiT2hyXCIsIFwiZWFydGhcIjogXCJFcmRlXCIsIFwiZWFzeVwiOiBcImVpbmZhY2hcIiwgXCJlYXRcIjogXCJlc3NlblwiLFxyXG4gICAgICAgICAgICBcImVnZ1wiOiBcIkVpXCIsIFwiZW5lcmd5XCI6IFwiRW5lcmdpZVwiLCBcImV2ZW5pbmdcIjogXCJBYmVuZFwiLFxyXG4gICAgICAgICAgICBcImV5ZVwiOiBcIkF1Z2VcIiwgXCJldmVyeXRoaW5nXCI6IFwiYWxsZXNcIixcclxuXHJcbiAgICAgICAgICAgIFwiZmFjZVwiOiBcIkdlc2ljaHRcIiwgXCJmYW1pbHlcIjogXCJGYW1pbGllXCIsIFwiZmFyXCI6IFwid2VpdFwiLCBcImZhcm1cIjogXCJCYXVlcm5ob2ZcIixcclxuICAgICAgICAgICAgXCJmYXN0XCI6IFwic2NobmVsbFwiLCBcImZhdGhlclwiOiBcIlZhdGVyXCIsIFwiZmVldFwiOiBcIkbDvMOfZVwiLCBcImZpZ2h0XCI6IFwia8OkbXBmZW5cIixcclxuICAgICAgICAgICAgXCJmaXJlXCI6IFwiRmV1ZXJcIiwgXCJmaXNoXCI6IFwiRmlzY2hcIiwgXCJmbG9vclwiOiBcIkJvZGVuXCIsIFwiZmxvd2VyXCI6IFwiQmx1bWVcIixcclxuICAgICAgICAgICAgXCJmb29kXCI6IFwiRXNzZW5cIiwgXCJmb290XCI6IFwiRnXDn1wiLCBcImZyaWVuZFwiOiBcIkZyZXVuZFwiLFxyXG5cclxuICAgICAgICAgICAgXCJnYXJkZW5cIjogXCJHYXJ0ZW5cIiwgXCJnaXJsXCI6IFwiTcOkZGNoZW5cIiwgXCJnbGFzc1wiOiBcIkdsYXNcIiwgXCJnb1wiOiBcImdlaGVuXCIsXHJcbiAgICAgICAgICAgIFwiZ29vZFwiOiBcImd1dFwiLCBcImdyZWVuXCI6IFwiZ3LDvG5cIiwgXCJncm91bmRcIjogXCJCb2RlblwiLCBcImdyb3VwXCI6IFwiR3J1cHBlXCIsXHJcblxyXG4gICAgICAgICAgICBcImhhaXJcIjogXCJIYWFyZVwiLCBcImhhbmRcIjogXCJIYW5kXCIsIFwiaGFuZ1wiOiBcImjDpG5nZW5cIiwgXCJoYXBweVwiOiBcImdsw7xja2xpY2hcIixcclxuICAgICAgICAgICAgXCJoYXRcIjogXCJIdXRcIiwgXCJoZWFkXCI6IFwiS29wZlwiLCBcImhlYWx0aFwiOiBcIkdlc3VuZGhlaXRcIiwgXCJoZWFydFwiOiBcIkhlcnpcIixcclxuICAgICAgICAgICAgXCJoZWF0XCI6IFwiSGl0emVcIiwgXCJoZWF2eVwiOiBcInNjaHdlclwiLCBcImhlbGxvXCI6IFwiaGFsbG9cIiwgXCJoZXJlXCI6IFwiaGllclwiLFxyXG4gICAgICAgICAgICBcImhpZ2hcIjogXCJob2NoXCIsIFwiaG9tZVwiOiBcIlp1aGF1c2VcIiwgXCJob3JzZVwiOiBcIlBmZXJkXCIsIFwiaG91c2VcIjogXCJIYXVzXCIsXHJcblxyXG4gICAgICAgICAgICBcImljZVwiOiBcIkVpc1wiLCBcImlkZWFcIjogXCJJZGVlXCIsIFwiaWxsXCI6IFwia3JhbmtcIiwgXCJpbXBvcnRhbnRcIjogXCJ3aWNodGlnXCIsXHJcbiAgICAgICAgICAgIFwiaW5zaWRlXCI6IFwiZHJpbm5lblwiLCBcImlzbGFuZFwiOiBcIkluc2VsXCIsXHJcblxyXG4gICAgICAgICAgICBcImpvYlwiOiBcIkpvYlwiLCBcImp1aWNlXCI6IFwiU2FmdFwiLCBcImp1bXBcIjogXCJzcHJpbmdlblwiLFxyXG5cclxuICAgICAgICAgICAgXCJrZXlcIjogXCJTY2hsw7xzc2VsXCIsIFwia2lsbFwiOiBcInTDtnRlblwiLCBcImtpbmdcIjogXCJLw7ZuaWdcIiwgXCJraXRjaGVuXCI6IFwiS8O8Y2hlXCIsXHJcbiAgICAgICAgICAgIFwia2lzc1wiOiBcIkt1c3NcIiwgXCJrbm93XCI6IFwid2lzc2VuXCIsXHJcblxyXG4gICAgICAgICAgICBcImxha2VcIjogXCJTZWVcIiwgXCJsYW5kXCI6IFwiTGFuZFwiLCBcImxhbmd1YWdlXCI6IFwiU3ByYWNoZVwiLFxyXG4gICAgICAgICAgICBcImxhcmdlXCI6IFwiZ3Jvw59cIiwgXCJsYXVnaFwiOiBcImxhY2hlblwiLCBcImxlYXJuXCI6IFwibGVybmVuXCIsXHJcbiAgICAgICAgICAgIFwibGVmdFwiOiBcImxpbmtzXCIsIFwibGVnXCI6IFwiQmVpblwiLCBcImxpZmVcIjogXCJMZWJlblwiLCBcImxpZ2h0XCI6IFwiTGljaHRcIixcclxuICAgICAgICAgICAgXCJsaWtlXCI6IFwibcO2Z2VuXCIsIFwibGlvblwiOiBcIkzDtndlXCIsIFwibGl0dGxlXCI6IFwia2xlaW5cIiwgXCJsb25nXCI6IFwibGFuZ1wiLFxyXG4gICAgICAgICAgICBcImxvdmVcIjogXCJMaWViZVwiLFxyXG5cclxuICAgICAgICAgICAgXCJtYWNoaW5lXCI6IFwiTWFzY2hpbmVcIiwgXCJtYWtlXCI6IFwibWFjaGVuXCIsIFwibWFuXCI6IFwiTWFublwiLCBcIm1hbnlcIjogXCJ2aWVsZVwiLFxyXG4gICAgICAgICAgICBcIm1pbGtcIjogXCJNaWxjaFwiLCBcIm1pbnV0ZVwiOiBcIk1pbnV0ZVwiLCBcIm1vbmV5XCI6IFwiR2VsZFwiLFxyXG4gICAgICAgICAgICBcIm1vbnRoXCI6IFwiTW9uYXRcIiwgXCJtb3JuaW5nXCI6IFwiTW9yZ2VuXCIsIFwibW90aGVyXCI6IFwiTXV0dGVyXCIsIFwibW91bnRhaW5cIjogXCJCZXJnXCIsXHJcbiAgICAgICAgICAgIFwibW9udGhcIjogXCJNb25hdFwiLCBcIm1vcm5pbmdcIjogXCJNb3JnZW5cIiwgXCJtb3RoZXJcIjogXCJNdXR0ZXJcIixcclxuICAgICAgICAgICAgXCJtb3VudGFpblwiOiBcIkJlcmdcIixcclxuXHJcbiAgICAgICAgICAgIFwibmFtZVwiOiBcIk5hbWVcIiwgXCJuYXRpb25cIjogXCJOYXRpb25cIiwgXCJuZWFyXCI6IFwibmFoXCIsIFwibmVja1wiOiBcIk5hY2tlblwiLFxyXG4gICAgICAgICAgICBcIm5pZ2h0XCI6IFwiTmFjaHRcIiwgXCJub2lzZVwiOiBcIkzDpHJtXCIsIFwibm9ydGhcIjogXCJOb3JkZW5cIixcclxuXHJcbiAgICAgICAgICAgIFwib2NlYW5cIjogXCJPemVhblwiLCBcIm9mZlwiOiBcImF1c1wiLCBcIm9mZmljZVwiOiBcIkLDvHJvXCIsIFwib2lsXCI6IFwiw5ZsXCIsXHJcbiAgICAgICAgICAgIFwib2xkXCI6IFwiYWx0XCIsIFwib3BlblwiOiBcIsO2ZmZuZW5cIiwgXCJvcmFuZ2VcIjogXCJPcmFuZ2VcIiwgXCJvcmRlclwiOiBcImJlc3RlbGxlblwiLFxyXG5cclxuICAgICAgICAgICAgXCJwYWdlXCI6IFwiU2VpdGVcIiwgXCJwYXBlclwiOiBcIlBhcGllclwiLCBcInBhcmVudFwiOiBcIkVsdGVyblwiLCBcInBhcmtcIjogXCJQYXJrXCIsXHJcbiAgICAgICAgICAgIFwicGFydHlcIjogXCJQYXJ0eVwiLCBcInBlblwiOiBcIlN0aWZ0XCIsIFwicGVvcGxlXCI6IFwiTWVuc2NoZW5cIiwgXCJwaG9uZVwiOiBcIlRlbGVmb25cIixcclxuICAgICAgICAgICAgXCJwaWN0dXJlXCI6IFwiQmlsZFwiLCBcInBsYWNlXCI6IFwiT3J0XCIsIFwicGxhbnRcIjogXCJQZmxhbnplXCIsIFwicGxheVwiOiBcInNwaWVsZW5cIixcclxuICAgICAgICAgICAgXCJwb2NrZXRcIjogXCJUYXNjaGVcIiwgXCJwb2xpY2VcIjogXCJQb2xpemVpXCIsIFwicG90YXRvXCI6IFwiS2FydG9mZmVsXCIsXHJcbiAgICAgICAgICAgIFwicHJvYmxlbVwiOiBcIlByb2JsZW1cIixcclxuXHJcbiAgICAgICAgICAgIFwicXVlZW5cIjogXCJLw7ZuaWdpblwiLCBcInF1ZXN0aW9uXCI6IFwiRnJhZ2VcIixcclxuXHJcbiAgICAgICAgICAgIFwicmFpblwiOiBcIlJlZ2VuXCIsIFwicmVzdGF1cmFudFwiOiBcIlJlc3RhdXJhbnRcIiwgXCJyZWRcIjogXCJyb3RcIixcclxuICAgICAgICAgICAgXCJyaWdodFwiOiBcInJlY2h0c1wiLCBcInJpdmVyXCI6IFwiRmx1c3NcIiwgXCJyb2FkXCI6IFwiU3RyYcOfZVwiLFxyXG4gICAgICAgICAgICBcInJvb21cIjogXCJaaW1tZXJcIiwgXCJydW5cIjogXCJyZW5uZW5cIixcclxuXHJcbiAgICAgICAgICAgIFwic2FsdFwiOiBcIlNhbHpcIiwgXCJzYW5kXCI6IFwiU2FuZFwiLCBcInNjaG9vbFwiOiBcIlNjaHVsZVwiLCBcInNlYVwiOiBcIk1lZXJcIixcclxuICAgICAgICAgICAgXCJzZWFzb25cIjogXCJKYWhyZXN6ZWl0XCIsIFwic2VlXCI6IFwic2VoZW5cIiwgXCJzaGlydFwiOiBcIkhlbWRcIixcclxuICAgICAgICAgICAgXCJzaG9lXCI6IFwiU2NodWhcIiwgXCJzaG9wXCI6IFwiTGFkZW5cIiwgXCJzaG9ydFwiOiBcImt1cnpcIiwgXCJzbGVlcFwiOiBcInNjaGxhZmVuXCIsXHJcbiAgICAgICAgICAgIFwic2xvd1wiOiBcImxhbmdzYW1cIiwgXCJzbWFsbFwiOiBcImtsZWluXCIsIFwic21pbGVcIjogXCJMw6RjaGVsblwiLCBcInNub3dcIjogXCJTY2huZWVcIixcclxuICAgICAgICAgICAgXCJzb25cIjogXCJTb2huXCIsIFwic291bmRcIjogXCJHZXLDpHVzY2hcIiwgXCJzb3VwXCI6IFwiU3VwcGVcIiwgXCJzcG9ydFwiOiBcIlNwb3J0XCIsXHJcbiAgICAgICAgICAgIFwic3ByaW5nXCI6IFwiRnLDvGhsaW5nXCIsIFwic3RhclwiOiBcIlN0ZXJuXCIsIFwic3RvbmVcIjogXCJTdGVpblwiLCBcInN0cmVldFwiOiBcIlN0cmHDn2VcIixcclxuICAgICAgICAgICAgXCJzbG93XCI6IFwibGFuZ3NhbVwiLCBcInNtYWxsXCI6IFwia2xlaW5cIiwgXCJzbWlsZVwiOiBcIkzDpGNoZWxuXCIsXHJcbiAgICAgICAgICAgIFwic25vd1wiOiBcIlNjaG5lZVwiLCBcInNvblwiOiBcIlNvaG5cIiwgXCJzb3VuZFwiOiBcIkdlcsOkdXNjaFwiLFxyXG4gICAgICAgICAgICBcInNvdXBcIjogXCJTdXBwZVwiLCBcInNwb3J0XCI6IFwiU3BvcnRcIiwgXCJzcHJpbmdcIjogXCJGcsO8aGxpbmdcIixcclxuICAgICAgICAgICAgXCJzdGFyXCI6IFwiU3Rlcm5cIiwgXCJzdG9uZVwiOiBcIlN0ZWluXCIsIFwic3RyZWV0XCI6IFwiU3RyYcOfZVwiLFxyXG4gICAgICAgICAgICBcInN0cm9uZ1wiOiBcInN0YXJrXCIsIFwic3VtbWVyXCI6IFwiU29tbWVyXCIsIFwic3VuXCI6IFwiU29ubmVcIiwgXCJzd2VldFwiOiBcInPDvMOfXCIsXHJcblxyXG4gICAgICAgICAgICBcInRhYmxlXCI6IFwiVGlzY2hcIiwgXCJ0ZWFjaGVyXCI6IFwiTGVocmVyXCIsIFwidGVhXCI6IFwiVGVlXCIsIFwidGVhbVwiOiBcIlRlYW1cIixcclxuICAgICAgICAgICAgXCJ0ZW5cIjogXCJ6ZWhuXCIsIFwidGVzdFwiOiBcIlRlc3RcIiwgXCJ0aGluZ1wiOiBcIkRpbmdcIiwgXCJ0aG91Z2h0XCI6IFwiR2VkYW5rZVwiLFxyXG4gICAgICAgICAgICBcInRpbWVcIjogXCJaZWl0XCIsIFwidGlyZWRcIjogXCJtw7xkZVwiLCBcInRvbW9ycm93XCI6IFwibW9yZ2VuXCIsIFwidG93blwiOiBcIlN0YWR0XCIsXHJcbiAgICAgICAgICAgIFwidHJlZVwiOiBcIkJhdW1cIiwgXCJ0cmFpblwiOiBcIlp1Z1wiLCBcInRyYXZlbFwiOiBcInJlaXNlblwiLFxyXG5cclxuICAgICAgICAgICAgXCJ1bmRlclwiOiBcInVudGVyXCIsIFwidW5jbGVcIjogXCJPbmtlbFwiLCBcInVwXCI6IFwiaG9jaFwiLCBcInVzZVwiOiBcImJlbnV0emVuXCIsXHJcblxyXG4gICAgICAgICAgICBcInZpbGxhZ2VcIjogXCJEb3JmXCIsIFwidm9pY2VcIjogXCJTdGltbWVcIixcclxuXHJcbiAgICAgICAgICAgIFwid2Fsa1wiOiBcImdlaGVuXCIsIFwid2FybVwiOiBcIndhcm1cIiwgXCJ3YXRlclwiOiBcIldhc3NlclwiLCBcIndheVwiOiBcIldlZ1wiLFxyXG4gICAgICAgICAgICBcIndlZWtcIjogXCJXb2NoZVwiLCBcIndlbGNvbWVcIjogXCJ3aWxsa29tbWVuXCIsIFwid2hpdGVcIjogXCJ3ZWnDn1wiLFxyXG4gICAgICAgICAgICBcIndpbmRvd1wiOiBcIkZlbnN0ZXJcIiwgXCJ3aW5kXCI6IFwiV2luZFwiLCBcIndpbnRlclwiOiBcIldpbnRlclwiLCBcIndvbWFuXCI6IFwiRnJhdVwiLFxyXG4gICAgICAgICAgICBcIndvcmRcIjogXCJXb3J0XCIsIFwid29ya1wiOiBcIkFyYmVpdFwiLCBcIndvcmxkXCI6IFwiV2VsdFwiLCBcIndyaXRlXCI6IFwic2NocmVpYmVuXCIsXHJcbiAgICAgICAgICAgIFwid2luZG93XCI6IFwiRmVuc3RlclwiLCBcIndpbmRcIjogXCJXaW5kXCIsIFwid2ludGVyXCI6IFwiV2ludGVyXCIsXHJcbiAgICAgICAgICAgIFwid29tYW5cIjogXCJGcmF1XCIsIFwid29yZFwiOiBcIldvcnRcIiwgXCJ3b3JrXCI6IFwiQXJiZWl0XCIsIFwid29ybGRcIjogXCJXZWx0XCIsXHJcbiAgICAgICAgICAgIFwid3JpdGVcIjogXCJzY2hyZWliZW5cIixcclxuXHJcbiAgICAgICAgICAgIFwieWVhclwiOiBcIkphaHJcIiwgXCJ5ZWxsb3dcIjogXCJnZWxiXCIsIFwieW91bmdcIjogXCJqdW5nXCIsXHJcblxyXG4gICAgICAgICAgICBcInpvb1wiOiBcIlpvb1wiXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICB0cmFuc2xhdGUoZW5nbGlzaFdvcmQpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy50cmFuc2xhdGlvbnNbZW5nbGlzaFdvcmQudG9Mb3dlckNhc2UoKV0gPz8gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBzZXRXb3JkcyhuZXdXb3JkTGlzdCkge1xyXG4gICAgICAgIHRoaXMud29yZHMgPSBuZXdXb3JkTGlzdDtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBFbmdsaXNoR2VybWFuRGljdGlvbmFyeTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCJcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgRWxlbWVudCB7XHJcblxyXG4gICAgaGFzQ29sbGlkZWQgPSBmYWxzZVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuaW5zdGFuY2VJZCA9IC0xXHJcbiAgICB9XHJcblxyXG4gICAgYWN0aW9uKCkgeyB9XHJcblxyXG4gICAgZHJhdyhjdHgpIHsgfVxyXG5cclxuICAgIGNoZWNrQ29sbGlzaW9uKCkgeyB9XHJcblxyXG4gICAgb25Db2xsaXNpb24oKSB7IH1cclxuXHJcbiAgICBzZXRJZChpZCkge1xyXG4gICAgICAgIHRoaXMuaW5zdGFuY2VJZCA9IGlkXHJcbiAgICB9XHJcbn0iLCJcInVzZSBzdHJpY3RcIlxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBFbGVtZW50TGlzdCBleHRlbmRzIEFycmF5IHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpXHJcbiAgICB9XHJcblxyXG4gICAgYWRkKGVsZW1lbnQpIHtcclxuICAgICAgICB0aGlzLnB1c2goZWxlbWVudClcclxuICAgICAgICBlbGVtZW50LnNldElkKHRoaXMubGVuZ3RoIC0gMSkgXHJcbiAgICB9XHJcblxyXG4gICAgZ2V0KGkpIHtcclxuICAgICAgICByZXR1cm4gdGhpc1tpXVxyXG4gICAgfVxyXG5cclxuICAgIGRlbGV0ZShpKSB7XHJcbiAgICAgICAgLy90aGlzLnNwbGljZShpLCAxKVxyXG4gICAgICAgIHRoaXNbaV0gPSBudWxsXHJcbiAgICAgICAgLy/DhG5kZXJ1bmcgdm9uIEJyaWFuXHJcbiAgICAgICBcclxuXHJcbiAgICB9XHJcblxyXG4gICAgZHJhdyhjdHgpIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYodGhpc1tpXSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzW2ldLmRyYXcoY3R4KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIFxyXG4gICAgYWN0aW9uKCkge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSB0aGlzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7ICAgIFxyXG4gICAgICAgICAgICBpZih0aGlzW2ldICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXNbaV0uYWN0aW9uKClcclxuICAgICAgICAgICAgICAgIC8vIE5FVTogQnVsbGV0IHVuZCBXb3JkIGNsZWFudXBcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzW2ldLmhhc0NvbGxpZGVkIHx8IHRoaXNbaV0uZGVzdHJveWVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zcGxpY2UoaSwgMSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjaGVja0NvbGxpc2lvbigpIHsgXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmKHRoaXNbaV0gIT0gbnVsbCAmJiAhdGhpc1tpXS5oYXNDb2xsaWRlZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpc1tpXS5jaGVja0NvbGxpc2lvbigpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiXCJ1c2Ugc3RyaWN0XCJcclxuXHJcbmNvbnN0IEJ1bGxldCA9IHJlcXVpcmUoJy4vYnVsbGV0JylcclxuY29uc3QgUmFuZG9tV2Fsa0NpcmNsZUVsZW1lbnQgPSByZXF1aXJlKCcuL3JhbmRvbXdhbGtjaXJjbGVlbGVtZW50JylcclxuY29uc3QgRWxlbWVudExpc3QgPSByZXF1aXJlKCcuL2VsZW1lbnRsaXN0JylcclxuY29uc3QgU3RhZ2UgPSByZXF1aXJlKCcuL3N0YWdlJylcclxuY29uc3QgQnVyc3QgPSByZXF1aXJlKCcuL2J1cnN0JylcclxuY29uc3QgV29yZCA9IHJlcXVpcmUoXCIuL3dvcmRcIilcclxuY29uc3QgVmFsaWRhdG9yID0gcmVxdWlyZSgnLi92YWxpZGF0b3InKVxyXG5jb25zdCBXb3JkSW5wdXRIYW5kbGVyID0gcmVxdWlyZSgnLi93b3JkaW5wdXRoYW5kbGVyJylcclxuY29uc3QgSGVhbHRoID0gcmVxdWlyZShcIi4vaGVhbHRoXCIpXHJcbmNvbnN0IFNwYXduZXJCb3NzID0gcmVxdWlyZShcIi4vc3Bhd25lcmJvc3NcIilcclxuY29uc3QgUmVnZW5lcmF0ZUJvc3MgPSByZXF1aXJlKFwiLi9yZWdlbmVyYXRlQm9zc1wiKVxyXG5jb25zdCBTcGxpdHRlckJvc3MgPSByZXF1aXJlKFwiLi9zcGxpdHRlckJvc3NcIilcclxuY29uc3QgQXVkaW9NYW5hZ2VyID0gcmVxdWlyZShcIi4vYXVkaW9NYW5hZ2VyXCIpXHJcbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgR2FtZSB7XHJcblxyXG4gICAgaW50ZXJ2YWxJZCA9IDBcclxuICAgIGNvbWV0ZXNDb3VudCA9IDBcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLnJhZjsgICAgICAgICAgICAgICAgICAgICAgIC8vIHJlcXVlc3QgYW5pbWF0aW9uIGZyYW1lIGhhbmRsZVxyXG4gICAgICAgIHRoaXMuZWxlbWVudExpc3QgPVtdO1xyXG4gICAgICAgIHRoaXMuaGVhbHRoID0gbmV3IEhlYWx0aCgpO1xyXG5cclxuICAgICAgICB0aGlzLnNjb3JlID0gMDtcclxuICAgICAgICB0aGlzLmN1cnJlbnRJbnB1dCA9ICcnO1xyXG4gICAgICAgIC8vIMOEbmRlcnVuZ2VuIHZvbiBCcmlhblxyXG4gICAgICAgIHRoaXMudmFsaWRhdG9yID0gbmV3IFZhbGlkYXRvcigpO1xyXG4gICAgICAgIHRoaXMud29yZElucHV0aGFuZGVyID0gbmV3IFdvcmRJbnB1dEhhbmRsZXIoKTtcclxuICAgICAgICB0aGlzLmFjdGl2ZVdvcmRFbGVtZW50ID0gbnVsbDtcclxuICAgICAgICB0aGlzLndvcmRJbnB1dGhhbmRlci5zZXRMZXR0ZXJDYWxsYmFjayh0aGlzLmhhbmRsZUxldHRlcklucHV0LmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMuaXNJbnB1dFNldCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuaXNQYXVzZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmxhc3RCb3NzU2NvcmUgPSAwO1xyXG4gICAgICAgIHRoaXMuYm9zc0FjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuYXVkaW9NYW5hZ2VyID0gbmV3IEF1ZGlvTWFuYWdlcigpO1xyXG4gICAgICAgIHRoaXMuZ2VuZXJhdGVJbnRlcnZhbCA9IDUwMDA7IFxyXG4gICAgICAgIHRoaXMubGFzdFVwZGF0ZVNvcmUgPSAwO1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAgIHN0YXJ0KCkge1xyXG4gICAgICAgIHRoaXMuZWxlbWVudExpc3QgPSBuZXcgRWxlbWVudExpc3QoKVxyXG4gICAgICAgIGlmKCF0aGlzLmlzSW5wdXRTZXQpIHtcclxuICAgICAgICAgICAgdGhpcy5pc0lucHV0U2V0ID0gdHJ1ZVxyXG4gICAgICAgICAgICB0aGlzLnNldHVwSW5wdXQoKVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmVsZW1lbnRMaXN0LmFkZChuZXcgU3RhZ2UoKSk7ICBcclxuICAgICAgICB0aGlzLmVsZW1lbnRMaXN0LmFkZCh0aGlzLmhlYWx0aCk7XHJcbiAgICBcclxuICAgICAgICAvKmZvciAobGV0IGkgPSAwOyBpIDwgNjA7IGkrKykge1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMuZWxlbWVudExpc3QgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudExpc3QuYWRkKG5ldyBSYW5kb21XYWxrQ2lyY2xlRWxlbWVudCh0aGlzKSk7XHJcbiAgICAgICAgICAgICAgICB9IFxyXG4gICAgICAgICAgICB9LCAzMDAwICogaSk7XHJcbiAgICAgICAgfSovXHJcbiAgICAgICAgdGhpcy5nZW5lcmF0ZUNvbWV0ZXMoKTtcclxuXHJcbiAgICAgICAgdGhpcy5lbGVtZW50TGlzdC5hZGQobmV3IFN0YWdlKCkpXHJcblxyXG4gICAgICAgIHRoaXMudGltZU9mTGFzdEZyYW1lID0gRGF0ZS5ub3coKVxyXG4gICAgICAgIHRoaXMucmFmID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnRpY2suYmluZCh0aGlzKSlcclxuICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgZ2VuZXJhdGVDb21ldGVzKCkge1xyXG4gICAgICAgIHRoaXMuZWxlbWVudExpc3QuYWRkKG5ldyBSYW5kb21XYWxrQ2lyY2xlRWxlbWVudCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5pbnRlcnZhbElkID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgICAgICBpZih0aGlzLmVsZW1lbnRMaXN0ICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudExpc3QuYWRkKG5ldyBSYW5kb21XYWxrQ2lyY2xlRWxlbWVudCh0aGlzKSk7XHJcbiAgICAgICAgICAgIH0gXHJcbiAgICAgICAgICAgIHRoaXMuY29tZXRlc0NvdW50Kys7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNvbWV0ZXNDb3VudCA+PSAxMCkge1xyXG4gICAgICAgICAgICAgICAgc3RvcExvb3AoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sIHRoaXMuZ2VuZXJhdGVJbnRlcnZhbCk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlR2VuZXJhdGVJbnRlcnZhbCgpIHtcclxuICAgICAgICBpZih0aGlzLnNjb3JlID4wICYmIHRoaXMuc2NvcmUgJSA1ID09IDAmJnRoaXMuZ2VuZXJhdGVJbnRlcnZhbCA+IDEwMDAgJiYgdGhpcy5sYXN0VXBkYXRlU29yZSAhPSB0aGlzLnNjb3JlKSB7XHJcbiAgICAgICAgICAgIHRoaXMubGFzdFVwZGF0ZVNvcmUgPSB0aGlzLnNjb3JlO1xyXG4gICAgICAgICAgICB0aGlzLmdlbmVyYXRlSW50ZXJ2YWwgLT0gMTAwO1xyXG4gICAgICAgICAgICBjbGVhckludGVydmFsKHRoaXMuaW50ZXJ2YWxJZCk7XHJcbiAgICAgICAgICAgIHRoaXMuZ2VuZXJhdGVDb21ldGVzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIHN0b3BHZW5lcmF0aW5nQ29tZXRlcygpIHtcclxuICAgICAgICBjbGVhckludGVydmFsKHRoaXMuaW50ZXJ2YWxJZCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJMb29wIHN0b3BwZWQuXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0b3AoKSB7XHJcbiAgICAgICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMucmFmKVxyXG4gICAgICAgIHRoaXMuZWxlbWVudExpc3QgPSBudWxsXHJcbiAgICB9XHJcblxyXG4gICAgcGF1c2UoKSB7XHJcbiAgICAgICAgdGhpcy5pc1BhdXNlZCA9IHRydWVcclxuICAgICAgICB0aGlzLnN0b3BHZW5lcmF0aW5nQ29tZXRlcygpXHJcblxyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWFpbi1tZW51XCIpLnN0eWxlLmRpc3BsYXkgPSBcImZsZXhcIlxyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29udGludWUtYnV0dG9uXCIpLnN0eWxlLmRpc3BsYXkgPSBcImZsZXhcIlxyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibW9kZS1zZWxlY3Rpb25cIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnRpbnVlKCkge1xyXG4gICAgICAgIHRoaXMuaXNQYXVzZWQgPSBmYWxzZVxyXG4gICAgICAgIHRoaXMuZ2VuZXJhdGVDb21ldGVzKClcclxuICAgIH1cclxuXHJcbiAgICBsb2FkU2NvcmVzKCkge1xyXG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiaGlnaFNjb3Jlc1wiKSkgfHwgW107XHJcbiAgICB9XHJcblxyXG4gICAgc2F2ZVNjb3JlKG5hbWUsIHNjb3JlKSB7XHJcbiAgICAgICAgY29uc3Qgc2NvcmVzID0gdGhpcy5sb2FkU2NvcmVzKCk7XHJcbiAgICAgICAgc2NvcmVzLnB1c2goeyBuYW1lLCBzY29yZSwgZGF0ZTogRGF0ZS5ub3coKSB9KTtcclxuICAgICAgICBzY29yZXMuc29ydCgoYSwgYikgPT4gYi5zY29yZSAtIGEuc2NvcmUpO1xyXG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiaGlnaFNjb3Jlc1wiLCBKU09OLnN0cmluZ2lmeShzY29yZXMuc2xpY2UoMCwgMTApKSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJoaWdoc2NvcmUtdmFsdWVcIikudGV4dENvbnRlbnQgPSBzY29yZXNbMF0uc2NvcmU7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gbWVuw7wgbmFjaCB0b2QgZWluYmxpbmRlbiBcclxuICAgIGdhbWVPdmVyKCkge1xyXG4gICAgICAgXHJcbiAgICAgICAgdGhpcy5zdG9wKCk7XHJcbiAgICAgICAgdGhpcy5zdG9wR2VuZXJhdGluZ0NvbWV0ZXMoKVxyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWFpbi1tZW51XCIpLnN0eWxlLmRpc3BsYXkgPSBcImZsZXhcIjtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImhvbWUtYnV0dG9uXCIpLnN0eWxlLmRpc3BsYXkgPSBcImZsZXhcIjtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1vZGUtc2VsZWN0aW9uXCIpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNjb3JlYmxvY2tcIikuc3R5bGUuZGlzcGxheSA9IFwiZmxleFwiO1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2NvcmVibG9jay12YWx1ZVwiKS50ZXh0Q29udGVudCA9IHRoaXMuc2NvcmU7XHJcbiAgICAgICAgdGhpcy5oZWFsdGggPSBuZXcgSGVhbHRoKCk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbGViZW4gd2llZGVyIHp1csO8Y2sgc2V0emVuIFxyXG4gICAgICAgIHRoaXMuc2NvcmUgPSAwO1xyXG4gICAgICAgIHRoaXMudXBkYXRlVUkoKTtcclxuICAgICAgICB3aW5kb3cuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJqb2luLWhpZ2hzY29yZVwiKS5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gICAgdGljaygpIHtcclxuICAgICAgICBsZXQgbXljYW52YXMgPSB3aW5kb3cuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJteWNhbnZhc1wiKVxyXG4gICAgICAgIGxldCBjdHggPSBteWNhbnZhcy5nZXRDb250ZXh0KCcyZCcpXHJcbiAgICAgICAgY3R4LmZvbnQgPSBcIjE4cHggQXJpYWxcIjtcclxuXHJcbiAgICAgICAgLy8tLS0gY2xlYXIgc2NyZWVuXHJcbiAgICAgICAgLy9jdHguZmlsbFN0eWxlID0gJ3JnYmEoMjM1LCAyNTAsIDI1NSwgMC4xKScgLy8gYWxwaGEgPCAxIGzDtnNjaHQgZGVuIEJpbGRzY2hyaW0gbnVyIHRlaWx3ZWlzZSAtPiBiZXdlZ3RlIEdlZ2Vuc3TDpG5kZSBlcnpldWdlbiBTcHVyZW5cclxuICAgICAgICAvL2N0eC5maWxsUmVjdCgwLCAwLCBteWNhbnZhcy5jbGllbnRXaWR0aCwgbXljYW52YXMuY2xpZW50SGVpZ2h0KVxyXG5cclxuICAgICAgICBpZighZG9jdW1lbnQuaGFzRm9jdXMoKSkge1xyXG4gICAgICAgICAgICB0aGlzLnBhdXNlKClcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLS0tIGRyYXcgZWxlbWVudHNcclxuICAgICAgICB0aGlzLmVsZW1lbnRMaXN0LmRyYXcoY3R4KVxyXG5cclxuICAgICAgICBpZighdGhpcy5pc1BhdXNlZCkge1xyXG4gICAgICAgICAgICAvLy0tLSBleGVjdXRlIGVsZW1lblN0IGFjdGlvbnNcclxuICAgICAgICAgICAgdGhpcy5lbGVtZW50TGlzdC5hY3Rpb24oKVxyXG5cclxuICAgICAgICAgICAgLy8tLS0gY2hlY2sgZWxlbWVudCBjb2xsaXNpb25zXHJcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudExpc3QuY2hlY2tDb2xsaXNpb24oKVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnNwYXduQm9zcygpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIFNwaWVsZXIgdG9kID8gXHJcbiAgICAgICAgaWYgKHRoaXMuaGVhbHRoLmlzRGVhZCgpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZ2FtZU92ZXIoKTtcclxuICAgICAgICAgICAgdGhpcy5hdWRpb01hbmFnZXIuc3RvcFNvdW5kKCdiYWNrZ3JvdW5kJyk7XHJcbiAgICAgICAgICAgIHRoaXMuYXVkaW9NYW5hZ2VyLnBsYXlTb3VuZCgnZ2FtZU92ZXInKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnVwZGF0ZUdlbmVyYXRlSW50ZXJ2YWwoKTtcclxuICAgICAgICB0aGlzLnNldEJvc3NJbmFjdGl2ZTIoKTtcclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGVVSSgpXHJcblxyXG4gICAgICAgIHRoaXMucmFmID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnRpY2suYmluZCh0aGlzKSlcclxuXHJcbiAgICB9XHJcbiAgICBcclxuICAgIFxyXG4gICAgXHJcblxyXG5cclxuICAgIGlzV29yZE9uRGlzcGxheSh3b3JkKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmVsZW1lbnRMaXN0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuZWxlbWVudExpc3RbaV0gIT0gbnVsbCAmJiB0aGlzLmVsZW1lbnRMaXN0W2ldIGluc3RhbmNlb2YgV29yZCAmJiB0aGlzLmVsZW1lbnRMaXN0W2ldLndvcmQuY2hhckF0KDApID09IHdvcmQuY2hhckF0KDApICkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgIH1cclxuICAgIFxyXG4gICAgc2V0dXBJbnB1dCgpIHtcclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGUpID0+IHtcclxuLy8gICAgICAgICAgICBpZiAoZS5rZXkgPT09ICdFbnRlcicpIHRoaXMuc2hvb3RUb0NpcmNsZSgpXHJcbiAgICAgICAgICAgIC8qZWxzZSovIGlmIChlLmtleSA9PT0gJ0JhY2tzcGFjZScpIHRoaXMuY3VycmVudElucHV0ID0gdGhpcy5jdXJyZW50SW5wdXQuc2xpY2UoMCwgLTEpXHJcbi8vICAgICAgICAgICAgZWxzZSBpZiAoL1thLXpBLVpdLy50ZXN0KGUua2V5KSkgdGhpcy5jdXJyZW50SW5wdXQgKz0gZS5rZXkudG9Mb3dlckNhc2UoKVxyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVVJKClcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIHNob290VG9DaXJjbGUoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmN1cnJlbnRJbnB1dCkgcmV0dXJuO1xyXG4gICAgXHJcbiAgICAgICAgLy8gRmluZGUgZGFzIFdPUlQgaW4gZGVyIGVsZW1lbnRMaXN0XHJcbiAgICAgICAgaWYodGhpcy5lbGVtZW50TGlzdCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldFdvcmQgPSB0aGlzLmVsZW1lbnRMaXN0LmZpbmQoZWwgPT4gXHJcbiAgICAgICAgICAgICAgICBlbCBpbnN0YW5jZW9mIFdvcmQgJiYgIWVsLmhhc0NvbGxpZGVkICYmIGVsLndvcmQgPT09IHRoaXMuZ2V0Q3VycmVudFdvcmQoKVxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgfVxyXG4gICAgXHJcbiAgICAgICAgICAgIGlmICghdGFyZ2V0V29yZCkgcmV0dXJuXHJcbiAgICBcclxuICAgICAgICAvLyBEaWUgQnVsbGV0IGZsaWVndCB6dW0gQ0lSQ0xFLUVMRU1FTlQgKG5pY2h0IHp1bSBXb3J0KVxyXG4gICAgICAgIC8vIHRhcmdldFdvcmQuY2lyY2xlSWQgaXN0IGRpZSBpbnN0YW5jZUlkIGRlcyBLcmVpc2VzXHJcbiAgICAgICAgdGhpcy5lbGVtZW50TGlzdC5hZGQobmV3IEJ1bGxldChcclxuICAgICAgICAgICAgdGFyZ2V0V29yZC54LCAgICAgICAgICAgLy8gWklFTCBYIGRlcyBLcmVpc2VzXHJcbiAgICAgICAgICAgIHRhcmdldFdvcmQueSwgICAgICAgICAgIC8vIFpJRUwgWSBkZXMgS3JlaXNlc1xyXG4gICAgICAgICAgICB0YXJnZXRXb3JkLmNpcmNsZUlkLCAgICAvLyBUYXJnZXQgaXN0IGRlciBLUkVJU1xyXG4gICAgICAgICAgICB0aGlzXHJcbiAgICAgICAgKSlcclxuICAgICAgICB0aGlzLmN1cnJlbnRJbnB1dCA9ICcnXHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Q3VycmVudFdvcmQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudElucHV0XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlVUkoKSB7XHJcbiAgICAgICAgY29uc3QgZWwgPSBpZCA9PiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZClcclxuICAgICAgICBpZiAoZWwoJ2N1cnJlbnQtaW5wdXQnKSkgZWwoJ2N1cnJlbnQtaW5wdXQnKS50ZXh0Q29udGVudCA9IHRoaXMuZ2V0Q3VycmVudFdvcmQoKVxyXG4gICAgICAgIGlmIChlbCgnc2NvcmUnKSkgZWwoJ3Njb3JlJykudGV4dENvbnRlbnQgPSB0aGlzLnNjb3JlXHJcbiAgICB9XHJcbiAgICBcclxuXHJcbmhhbmRsZUxldHRlcklucHV0KGxldHRlcikge1xyXG4gICAgLy8gV2VubiBrZWluIFdvcnQgYWt0aXYgaXN0LCBzdWNoZSBlaW4gbmV1ZXNcclxuICAgIGlmICghdGhpcy5hY3RpdmVXb3JkRWxlbWVudCkge1xyXG4gICAgICAgIHRoaXMuZmluZE5ld1dvcmQobGV0dGVyKTtcclxuICAgIH0gXHJcbiAgICAvLyBXZW5uIFdvcnQgYWt0aXYgaXN0LCB0aXBwZSB3ZWl0ZXJcclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHRoaXMuY29udGludWVUeXBpbmdXb3JkKGxldHRlcik7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vIFN1Y2h0IGVpbiBuZXVlcyBXb3J0IGJhc2llcmVuZCBhdWYgZXJzdGVtIEJ1Y2hzdGFiZW5cclxuZmluZE5ld1dvcmQoZmlyc3RMZXR0ZXIpIHtcclxuICAgIFxyXG4gICAgY29uc3QgYWN0aXZlV29yZHMgPSBbXTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5lbGVtZW50TGlzdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGNvbnN0IGVsID0gdGhpcy5lbGVtZW50TGlzdFtpXTtcclxuICAgICAgICBpZiAoZWwgaW5zdGFuY2VvZiBXb3JkICYmICFlbC5oYXNDb2xsaWRlZCkge1xyXG4gICAgICAgICAgICBhY3RpdmVXb3Jkcy5wdXNoKGVsKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8vIEZpbmRlIGRhcyBFUlNURSBXb3J0IGRhcyBtaXQgZGVtIEJ1Y2hzdGFiZW4gYmVnaW5udFxyXG4gICAgY29uc3QgbWF0Y2hpbmdXb3JkID0gYWN0aXZlV29yZHMuZmluZCh3b3JkID0+IFxyXG4gICAgICAgIC8vd29yZC53b3JkLnRvTG93ZXJDYXNlKCkuc3RhcnRzV2l0aChmaXJzdExldHRlcilcclxuICAgICAgICB3b3JkLndvcmQuc3RhcnRzV2l0aChmaXJzdExldHRlcilcclxuICAgICk7XHJcbiAgICBcclxuICAgIGlmIChtYXRjaGluZ1dvcmQpIHtcclxuICAgICAgICB0aGlzLmFjdGl2ZVdvcmRFbGVtZW50ID0gbWF0Y2hpbmdXb3JkO1xyXG4gICAgICAgIHRoaXMuY3VycmVudElucHV0ID0gZmlyc3RMZXR0ZXI7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcbn1cclxuXHJcbiAgICAvLyBUaXBwZSBhbSBha3RpdmVuIFdvcnQgd2VpdGVyXHJcbiAgICBjb250aW51ZVR5cGluZ1dvcmQobGV0dGVyKSB7XHJcbiAgICAgICAgLy9jb25zdCBleHBlY3RlZE5leHRMZXR0ZXIgPSB0aGlzLmFjdGl2ZVdvcmRFbGVtZW50LndvcmQudG9Mb3dlckNhc2UoKVt0aGlzLmN1cnJlbnRJbnB1dC5sZW5ndGhdO1xyXG4gICAgICAgIGNvbnN0IGV4cGVjdGVkTmV4dExldHRlciA9IHRoaXMuYWN0aXZlV29yZEVsZW1lbnQud29yZFt0aGlzLmN1cnJlbnRJbnB1dC5sZW5ndGhdO1xyXG4gICAgXHJcbiAgICAgICAgLy8gUHLDvGZlIG9iIGRlciBCdWNoc3RhYmUga29ycmVrdCBpc3RcclxuICAgICAgICBpZiAobGV0dGVyID09PSBleHBlY3RlZE5leHRMZXR0ZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50SW5wdXQgKz0gbGV0dGVyO1xyXG4gICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAvLyBQcsO8ZmUgb2IgV29ydCB2b2xsc3TDpG5kaWdcclxuICAgICAgICAgICAgLy9pZiAodGhpcy5jdXJyZW50SW5wdXQgPT09IHRoaXMuYWN0aXZlV29yZEVsZW1lbnQud29yZC50b0xvd2VyQ2FzZSgpKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRJbnB1dCA9PT0gdGhpcy5hY3RpdmVXb3JkRWxlbWVudC53b3JkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uV29yZENvbXBsZXRlZCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBGYWxzY2hlciBCdWNoc3RhYmUgLSBSZXNldFxyXG4gICAgICAgICAgICAgICAgdGhpcy5yZXNldEFjdGl2ZVdvcmQodHJ1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvLyBXb3J0IGVyZm9sZ3JlaWNoIGFiZ2V0aXBwdFxyXG4gICAgb25Xb3JkQ29tcGxldGVkKCkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIEt1Z2VsIGF1ZiBkZW4gS3JlaXMgc2NoaWXDn2VuXHJcbiAgICAgICAgY29uc3QgdGFyZ2V0Q2lyY2xlID0gdGhpcy5lbGVtZW50TGlzdC5nZXQodGhpcy5hY3RpdmVXb3JkRWxlbWVudC5jaXJjbGVJZCk7XHJcbiAgICAgICAgaWYgKHRhcmdldENpcmNsZSkge1xyXG4gICAgICAgICAgICB0aGlzLnNjb3JlKys7XHJcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudExpc3QuYWRkKG5ldyBCdWxsZXQoXHJcbiAgICAgICAgICAgICAgICB0YXJnZXRDaXJjbGUueCxcclxuICAgICAgICAgICAgICAgIHRhcmdldENpcmNsZS55LFxyXG4gICAgICAgICAgICAgICAgdGhpcy5hY3RpdmVXb3JkRWxlbWVudC5jaXJjbGVJZCx0aGlzKSk7XHJcbiAgICAgICAgfVxyXG4gICAgXHJcbiAgICAgICAgdGhpcy5yZXNldEFjdGl2ZVdvcmQoKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBBa3RpdmVzIFdvcnQgenVyw7xja3NldHplblxyXG4gICAgcmVzZXRBY3RpdmVXb3JkKG1pc3Rha2UpIHtcclxuICAgICAgICB0aGlzLmFjdGl2ZVdvcmRFbGVtZW50ID0gbnVsbDtcclxuICAgICAgICB0aGlzLmN1cnJlbnRJbnB1dCA9ICcnO1xyXG4gICAgICAgIGlmKG1pc3Rha2UpIHtcclxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZWRTY3JlZW5cIikuc3R5bGUub3BhY2l0eSA9IFwiMC41XCI7XHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZWRTY3JlZW5cIikuc3R5bGUub3BhY2l0eSA9IFwiMFwiO1xyXG4gICAgICAgICAgICB9LCAzMDApOyBcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmF1ZGlvTWFuYWdlcikge1xyXG4gICAgICAgICAgICB0aGlzLmF1ZGlvTWFuYWdlci5wbGF5U291bmQoJ2Vycm9yJylcclxuICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIFByw7xmZSBpbiBqZWRlbSBGcmFtZSBvYiBha3RpdmVzIFdvcnQgbm9jaCBleGlzdGllcnRcclxuICAgIGNoZWNrQWN0aXZlV29yZFZhbGlkaXR5KCkge1xyXG4gICAgICAgIGlmICh0aGlzLmFjdGl2ZVdvcmRFbGVtZW50KSB7XHJcbiAgICAgICAgICAgIGxldCB3b3JkU3RpbGxFeGlzdHMgPSBmYWxzZTtcclxuICAgICAgICBcclxuICAgICAgICAgICAgLy8gRHVyY2hzdWNoZSBkaWUgRWxlbWVudExpc3QgbWFudWVsbFxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZWxlbWVudExpc3QubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGVsID0gdGhpcy5lbGVtZW50TGlzdFtpXTtcclxuICAgICAgICAgICAgICAgIGlmIChlbCA9PT0gdGhpcy5hY3RpdmVXb3JkRWxlbWVudCAmJiAhZWwuaGFzQ29sbGlkZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB3b3JkU3RpbGxFeGlzdHMgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIGlmICghd29yZFN0aWxsRXhpc3RzKSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgdGhpcy5yZXNldEFjdGl2ZVdvcmQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG5cclxuc3Bhd25Cb3NzKCkge1xyXG4gICAgaWYodGhpcy5ib3NzQWN0aXZlKXtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBpZih0aGlzLnNjb3JlID4gMCAmJiB0aGlzLnNjb3JlICUgMjAgPT09IDAgJiYgdGhpcy5zY29yZSAhPT0gdGhpcy5sYXN0Qm9zc1Njb3JlKSB7XHJcbiAgICAgICAgdGhpcy5sYXN0Qm9zc1Njb3JlID0gdGhpcy5zY29yZTtcclxuICAgICAgICB0aGlzLmJvc3NBY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmKHRoaXMuc2NvcmUgIDwgMzApe1xyXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnRMaXN0LmFkZChuZXcgU3BsaXR0ZXJCb3NzKHRoaXMpKTtcclxuICAgICAgICAgICAgLy90aGlzLmVsZW1lbnRMaXN0LmFkZChuZXcgU3Bhd25lckJvc3ModGhpcykpO1xyXG4gICAgICAgICAgICAvL3RoaXMuZWxlbWVudExpc3QuYWRkKG5ldyBSZWdlbmVyYXRlQm9zcyh0aGlzKSk7XHJcbiAgICAgICAgfWVsc2UgaWYodGhpcy5zY29yZSAgPCA2MCl7XHJcbiAgICAgICAgICAgICAvL3RoaXMuZWxlbWVudExpc3QuYWRkKG5ldyBTcGxpdHRlckJvc3ModGhpcykpO1xyXG4gICAgICAgICAgICAvL3RoaXMuZWxlbWVudExpc3QuYWRkKG5ldyBTcGF3bmVyQm9zcyh0aGlzKSk7XHJcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudExpc3QuYWRkKG5ldyBSZWdlbmVyYXRlQm9zcyh0aGlzKSk7IFxyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnRMaXN0LmFkZChuZXcgU3BsaXR0ZXJCb3NzKHRoaXMpKTtcclxuICAgICAgICAgICAgLy90aGlzLmVsZW1lbnRMaXN0LmFkZChuZXcgU3Bhd25lckJvc3ModGhpcykpO1xyXG4gICAgICAgICAgICAvL3RoaXMuZWxlbWVudExpc3QuYWRkKG5ldyBSZWdlbmVyYXRlQm9zcyh0aGlzKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgfVxyXG4gICAgXHJcbn1cclxuXHJcbnNldEJvc3NJbmFjdGl2ZTIoKSB7XHJcbiAgICAvLyBzY2hhdWVuIG9iIG5vY2ggYm9zcyBlbGVtZW50ZSBpbiBkZXIgZWxlbWVudGxpc3Qgb2RlciBhdWYgZGVtIGJpbGRzY2hpcm0gc2luZFxyXG5cclxuICAgIHZhciBib3NzRm91bmQgPSBmYWxzZTtcclxuICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZWxlbWVudExpc3QubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBjb25zdCBlbCA9IHRoaXMuZWxlbWVudExpc3RbaV07XHJcbiAgICAgICAgaWYgKGVsIGluc3RhbmNlb2YgUmVnZW5lcmF0ZUJvc3MgfHwgZWwgaW5zdGFuY2VvZiBTcGF3bmVyQm9zcyB8fCBlbCBpbnN0YW5jZW9mIFNwbGl0dGVyQm9zcykge1xyXG4gICAgICAgICAgICBib3NzRm91bmQgPSB0cnVlO1xyXG4gICAgICAgICAgICBicmVha1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgfVxyXG4gICAgIHRoaXMuYm9zc0FjdGl2ZSA9IGJvc3NGb3VuZDtcclxufVxyXG5cclxuXHJcblxyXG5cclxufVxyXG4iLCJcInVzZSBzdHJpY3RcIlxyXG5cclxuY29uc3QgRWxlbWVudCA9IHJlcXVpcmUoJy4vZWxlbWVudCcpXHJcbi8vY29uc3QgcmFuZG9td2Fsa2NpcmNsZWVsZW1lbnQgPSByZXF1aXJlKCcuL3JhbmRvbXdhbGtjaXJjbGVlbGVtZW50JylcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgSGVhbHRoIGV4dGVuZHMgRWxlbWVudCB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7ICBcclxuICAgICAgICBzdXBlcigpICAgICAgICAgICAgXHJcbiAgICAgICAgdGhpcy5oZWFsdGggPSAzO1xyXG4gICAgICAgIHRoaXMuaGVhcnQgPSBuZXcgSW1hZ2UoKTtcclxuICAgICAgICB0aGlzLmhlYXJ0LnNyYyA9ICdpbWcvaGVhcnQucG5nJztcclxuXHJcbiAgICAgICAgdGhpcy5sb2FkZWQgPSBmYWxzZTsgXHJcbiAgICAgICAgdGhpcy5oZWFydC5vbmxvYWQgPSAoKSA9PiB7ICAgICAgICAgICAgICAgICAgICAvL2xhZGV0IGRhcyBiaWxkIGhlYXJ0XHJcbiAgICAgICAgICAgIHRoaXMubG9hZGVkID0gdHJ1ZTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgXHJcblxyXG4gICAgZHJhdyhjdHgpe1xyXG4gICAgICAgIGlmICghdGhpcy5sb2FkZWQpIHJldHVybjsgICAgICAgICAgICAgICAgICAgICAgICAgIC8vd2VubiBkYXMgYmlsZCBnZWxhZGVuIGlzdCBzb2xsdGUgZXMgZGllIGhlcnplbiB6ZWljaG5lblxyXG4gICAgICAgIFxyXG4gICAgICAgIGlmICh0aGlzLmhlYWx0aCA+PSAxKSB7XHJcbiAgICAgICAgICAgIGN0eC5kcmF3SW1hZ2UodGhpcy5oZWFydCwgMTAsMzAsMjUsMjUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5oZWFsdGggPj0gMikge1xyXG4gICAgICAgICAgICBjdHguZHJhd0ltYWdlKHRoaXMuaGVhcnQsIDQwLDMwLDI1LDI1KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuaGVhbHRoID49IDMpIHtcclxuICAgICAgICAgICAgY3R4LmRyYXdJbWFnZSh0aGlzLmhlYXJ0LCA3MCwzMCwyNSwyNSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgcmVkdWNlKCl7XHJcbiAgICAgICB0aGlzLmhlYWx0aC0tO1xyXG4gICAgfVxyXG4gICAgaXNEZWFkKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuaGVhbHRoIDw9IDA7XHJcbn1cclxuXHJcbiAgICAvKlxyXG4gICAgICBcclxuICAgIHVwZGF0ZSgpIHsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIMOcYmVycHLDvGZ0IGRlbiBmcmFtZSBvYiBoYXNDb2xsaWRlZCA9IHRydWUgXHJcbiAgICAgICAgaWYgKHRoaXMucmFuZG9td2Fsa2NpcmNsZWVsZW1lbnQuaGFzQ29sbGlkZWQpIHsgICAgICAgICBcclxuICAgICAgICAgICAgdGhpcy5oZWFsdGgtLTtcclxuICAgICAgICAgICAgdGhpcy5yYW5kb21XYWxrQ2lyY2xlRWxlbWVudC5oYXNDb2xsaWRlZCA9IGZhbHNlOyAgLy8gc2V0enQgY29sbGlkZWQgYXVmIGZhbHNlIHNvIGRhc3MgbnVyIGVpbmUgaGVyeiBwcm8gY29sbGlzaW9uIGFiZ2V6b2dlbiB3aXJkIFxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgICAgICAgKi8gXHJcbn0iLCJcInVzZSBzdHJpY3RcIlxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSAgY2xhc3MgSW5wdXRGaWVsZCB7XHJcbiAgICBzdGF0aWMgSW5wdXRsaXN0ID0gW107XHJcbiAgICBzdGF0aWMgIHNhdmVXb3JkcygpIHtcclxuICAgICAgICBjb25zdCBpbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidGV4dElucHV0XCIpLnZhbHVlO1xyXG4gICAgICAgIGNvbnN0IG5ldWVXb2VydGVyID0gaW5wdXRcclxuICAgICAgICAgICAgLnRyaW0oKVxyXG4gICAgICAgICAgICAuc3BsaXQoL1ssXFxzXSsvKSAgICAgICAgICAgIC8vZmlsdGVyIFxyXG5cclxuICAgICAgICBJbnB1dEZpZWxkLklucHV0bGlzdC5wdXNoKC4uLm5ldWVXb2VydGVyKTsgLy8gYW0gZW5kZSBvdm4gaW5wdXRsaXN0IGhpbnp1ZsO8Z2VuLiBcclxuXHJcbiAgICAgICAgLy8gQXVzZ2FiZSBha3R1YWxpc2llcmVuXHJcbiAgICAgICAgLy8gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvdXRwdXRcIikudGV4dENvbnRlbnQgPSBKU09OLnN0cmluZ2lmeSh0aGlzLklucHV0bGlzdCwgbnVsbCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHN0YXRpYyBpc0VtcHR5KCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuSW5wdXRsaXN0Lmxlbmd0aCA9PSAwO1xyXG4gICAgfVxyXG59XHJcblxyXG4iLCJcInVzZSBzdHJpY3RcIlxyXG4gXHJcbmNvbnN0IEdhbWUgPSByZXF1aXJlKFwiLi9nYW1lXCIpXHJcbmNvbnN0IElucHV0RmllbGQgPSByZXF1aXJlKFwiLi9pbnB1dGZpZWxkXCIpXHJcbmxldCBteUdhbWUgPSBuZXcgR2FtZSgpXHJcblxyXG4vLyBjYW52YXNcclxud2luZG93Lm9ubG9hZCA9ICgpID0+IHtcclxuICAgIGlmKG15R2FtZS5sb2FkU2NvcmVzKCkubGVuZ3RoICE9IDApIHtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImhpZ2hzY29yZS12YWx1ZVwiKS50ZXh0Q29udGVudCA9IG15R2FtZS5sb2FkU2NvcmVzKClbMF0uc2NvcmU7XHJcbiAgICB9XHJcbiAgICBjb25zdCBvd25Xb3Jkc0J1dHRvbiA9IHdpbmRvdy5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm93bi13b3Jkc1wiKTtcclxuICAgIGNvbnN0IHNwZWljaGVyQnV0dG9uID0gd2luZG93LmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3BlaWNoZXItYnV0dG9uXCIpOyBcclxuICAgIGNvbnN0IG1vZGVFbmdsaXNoQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtb2RlLWVuZ2xpc2hcIik7XHJcbiAgICBjb25zdCBtb2RlR2VybWFuQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtb2RlLWdlcm1hblwiKTtcclxuICAgIGNvbnN0IHBhdXNlQnV0dG9uID0gd2luZG93LmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGF1c2VCdXR0b25cIik7XHJcbiAgICBjb25zdCBjbG9zZUlucHV0UG9wdXAgPSB3aW5kb3cuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjbG9zZS1pbnB1dC1wb3B1cFwiKTtcclxuICAgIGNvbnN0IGNsb3NlSGlnaHNjb3JlUG9wdXAgPSB3aW5kb3cuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjbG9zZS1oaWdoc2NvcmUtcG9wdXBcIik7XHJcbiAgICBjb25zdCBjb250aW51ZUJ1dHRvbiA9IHdpbmRvdy5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbnRpbnVlLWJ1dHRvblwiKTtcclxuICAgIGNvbnN0IGhvbWVCdXR0b24gPSB3aW5kb3cuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJob21lLWJ1dHRvblwiKTtcclxuICAgIGNvbnN0IHNob3dIaWdoU2NvcmVMaXN0QnV0dG9uID0gd2luZG93LmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaGlnaHNjb3JlLWJ1dHRvblwiKTtcclxuICAgIGNvbnN0IGpvaW5IaWdoU2NvcmVCdXR0b24gPSB3aW5kb3cuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJqb2luLWhpZ2hzY29yZVwiKTtcclxuICAgIFxyXG4gICAgb3duV29yZHNCdXR0b24ub25jbGljayA9ICgpID0+IHtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImlucHV0LXBvcHVwXCIpLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcbiAgICB9XHJcblxyXG4gICAgc3BlaWNoZXJCdXR0b24ub25jbGljayA9ICgpID0+IHtcclxuICAgICAgICBJbnB1dEZpZWxkLnNhdmVXb3JkcygpOyBcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1haW4tbWVudVwiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpbnB1dC1wb3B1cFwiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgICAgbXlHYW1lLmF1ZGlvTWFuYWdlci5wbGF5U291bmQoJ2JhY2tncm91bmQnKVxyXG4gICAgICAgIG15R2FtZS5zdGFydCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGVuZ2xpc2hcclxuICAgIG1vZGVFbmdsaXNoQnV0dG9uLm9uY2xpY2sgPSAoKSA9PiB7XHJcbiAgICAgICAgbXlHYW1lLmdhbWVNb2RlID0gJ2VuZ2xpc2gnO1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWFpbi1tZW51XCIpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgICAgICBteUdhbWUuYXVkaW9NYW5hZ2VyLnBsYXlTb3VuZCgnYmFja2dyb3VuZCcpXHJcbiAgICAgICAgbXlHYW1lLnN0YXJ0KCk7XHJcbiAgICB9O1xyXG4gICAgXHJcbiAgICAvLyBnZXJtYW5cclxuICAgIG1vZGVHZXJtYW5CdXR0b24ub25jbGljayA9ICgpID0+IHtcclxuICAgICAgICBteUdhbWUuZ2FtZU1vZGUgPSAnZ2VybWFuJztcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1haW4tbWVudVwiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgICAgbXlHYW1lLmF1ZGlvTWFuYWdlci5wbGF5U291bmQoJ2JhY2tncm91bmQnKVxyXG4gICAgICAgIG15R2FtZS5zdGFydCgpO1xyXG4gICAgfTtcclxuICAgIFxyXG4gICAgcGF1c2VCdXR0b24ub25jbGljayA9IGZ1bmN0aW9uKCkgeyBcclxuICAgICAgICBteUdhbWUucGF1c2UoKTsgXHJcbiAgICB9XHJcblxyXG4gICAgY2xvc2VJbnB1dFBvcHVwLm9uY2xpY2sgPSAoKSA9PiB7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpbnB1dC1wb3B1cFwiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICB9XHJcblxyXG4gICAgY2xvc2VIaWdoc2NvcmVQb3B1cC5vbmNsaWNrID0gKCkgPT4ge1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaGlnaHNjb3JlLXBvcHVwXCIpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgIH1cclxuXHJcbiAgICBjb250aW51ZUJ1dHRvbi5vbmNsaWNrID0gKCkgPT4ge1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWFpbi1tZW51XCIpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIlxyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29udGludWUtYnV0dG9uXCIpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIlxyXG4gICAgICAgIG15R2FtZS5jb250aW51ZSgpXHJcbiAgICB9XHJcblxyXG4gICAgaG9tZUJ1dHRvbi5vbmNsaWNrID0gKCkgPT4ge1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibW9kZS1zZWxlY3Rpb25cIikuc3R5bGUuZGlzcGxheSA9IFwiZmxleFwiXHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJob21lLWJ1dHRvblwiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCJcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNjb3JlYmxvY2tcIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiXHJcbiAgICB9XHJcblxyXG4gICAgc2hvd0hpZ2hTY29yZUxpc3RCdXR0b24ub25jbGljayA9ICgpID0+IHtcclxuICAgICAgICBjb25zdCBsaXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJoaWdoc2NvcmUtbGlzdFwiKTtcclxuICAgICAgICBjb25zdCBzY29yZXMgPSBteUdhbWUubG9hZFNjb3JlcygpO1xyXG5cclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImhpZ2hzY29yZS1wb3B1cFwiKS5zdHlsZS5kaXNwbGF5ID0gXCJmbGV4XCI7XHJcbiAgICAgICAgbGlzdC5pbm5lckhUTUwgPSBcIlwiOyAvLyBjbGVhciBvbGQgZW50cmllc1xyXG5cclxuICAgICAgICBpZiAoc2NvcmVzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICBjb25zdCBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaVwiKTtcclxuICAgICAgICAgICAgbGkudGV4dENvbnRlbnQgPSBcIk5vIHNjb3JlcyB5ZXQhXCI7XHJcbiAgICAgICAgICAgIGxpc3QuYXBwZW5kQ2hpbGQobGkpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzY29yZXMuZm9yRWFjaCgoeyBuYW1lLCBzY29yZSB9KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpXCIpO1xyXG4gICAgICAgICAgICBsaS50ZXh0Q29udGVudCA9IGAke25hbWV9IOKAkyAke3Njb3JlfWA7XHJcbiAgICAgICAgICAgIGxpc3QuYXBwZW5kQ2hpbGQobGkpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGpvaW5IaWdoU2NvcmVCdXR0b24ub25jbGljayA9ICgpID0+IHtcclxuICAgICAgICBteUdhbWUuc2F2ZVNjb3JlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduYW1lSW5wdXQnKS52YWx1ZSwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Njb3JlYmxvY2stdmFsdWUnKS50ZXh0Q29udGVudCk7XHJcbiAgICAgICAgam9pbkhpZ2hTY29yZUJ1dHRvbi5kaXNhYmxlZCA9IHRydWU7XHJcbiAgICB9XHJcbn07XHJcbiIsIlwidXNlIHN0cmljdFwiXHJcblxyXG5jb25zdCBFbGVtZW50ID0gcmVxdWlyZSgnLi9lbGVtZW50JylcclxuY29uc3QgQnVyc3QgPSByZXF1aXJlKCcuL2J1cnN0JylcclxuY29uc3QgV29yZCA9IHJlcXVpcmUoJy4vd29yZCcpXHJcbmNvbnN0IEhlYWx0aCA9IHJlcXVpcmUoJy4vaGVhbHRoJylcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgUmFuZG9tV2Fsa0NpcmNsZUVsZW1lbnQgZXh0ZW5kcyBFbGVtZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKGdhbWUpIHtcclxuICAgICAgICBzdXBlcigpXHJcbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZVxyXG4gICAgICAgIHRoaXMueCA9IE1hdGgucmFuZG9tKCkgKiA1MzAgKyA0MFxyXG4gICAgICAgIHRoaXMueSA9IDBcclxuICAgICAgICBjb25zdCBiYXNlU3BlZWQgPSAwLjc7XHJcbiAgICAgICAgY29uc3Qgc3BlZWRJbmNyZWFzZSA9IE1hdGguZmxvb3IodGhpcy5nYW1lLnNjb3JlIC8gNSkgKiAwLjA3NTtcclxuICAgICAgICB0aGlzLnNwZWVkID0gTWF0aC5taW4oYmFzZVNwZWVkICsgc3BlZWRJbmNyZWFzZSwgMTAwLjApXHJcbiAgICAgICAgXHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7IFxyXG4gICAgICAgICAgICBsZXQgd29yZCA9IG5ldyBXb3JkKHRoaXMuZ2FtZSwgdGhpcy54LCB0aGlzLnksIHRoaXMuaW5zdGFuY2VJZCwgdGhpcy5zcGVlZClcclxuICAgICAgICAgICAgdGhpcy5nYW1lLmVsZW1lbnRMaXN0LmFkZCh3b3JkKVxyXG4gICAgICAgIH0sIDEwMCk7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgZHJhdyhjdHgpIHtcclxuICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpXHJcbiAgICAgICAgICAgIGN0eC5hcmModGhpcy54LCB0aGlzLnksIDE1LCAwLCBNYXRoLlBJICogMiwgdHJ1ZSlcclxuICAgICAgICAgICAgY3R4LmNsb3NlUGF0aCgpXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gIFwiZ3JleVwiXHJcbiAgICAgICAgICAgIGN0eC5maWxsKClcclxuXHJcbiAgICB9XHJcblxyXG4gICAgY2FsbEJ1cnN0KCkge1xyXG4gICAgICAgIHZhciBidXJzdCA9IG5ldyBCdXJzdCh0aGlzLngsIHRoaXMueSwgdGhpcy5nYW1lKVxyXG4gICAgICAgIHRoaXMuZ2FtZS5lbGVtZW50TGlzdC5hZGQoYnVyc3QpXHJcbiAgICB9XHJcblxyXG4gICAgYWN0aW9uKCkge1xyXG4gICAgICAgIC8vdGhpcy54ICs9IE1hdGgucmFuZG9tKCkgKiAyIC0gMVxyXG4gICAgICAgIHRoaXMueSArPSB0aGlzLnNwZWVkXHJcbiAgICB9XHJcblxyXG4gICAgY2hlY2tDb2xsaXNpb24oKSB7XHJcbiAgICAgICAgaWYgKHRoaXMueSA+IDU1MCAmJiB0aGlzLnkgPD0gNTUwICsgdGhpcy5zcGVlZCkge1xyXG4gICAgICAgICAgICB0aGlzLm9uQ29sbGlzaW9uKClcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgb25Db2xsaXNpb24oKSB7XHJcbiAgICAgICAgdGhpcy5oYXNDb2xsaWRlZCA9IHRydWVcclxuICAgICAgICB0aGlzLmdhbWUuZWxlbWVudExpc3QuZGVsZXRlKHRoaXMuaW5zdGFuY2VJZClcclxuICAgICAgICB0aGlzLmNhbGxCdXJzdCgpXHJcbiAgICAgICAgdGhpcy5nYW1lLmhlYWx0aC5yZWR1Y2UoKSAgICAgICAgICAgICBcclxuICAgIH1cclxuICAgIFxyXG4gICAgYnVsbGV0TWV0KCkge1xyXG4gICAgICAgIHRoaXMuaGFzQ29sbGlkZWQgPSB0cnVlXHJcbiAgICAgICAgdGhpcy5nYW1lLmVsZW1lbnRMaXN0LmRlbGV0ZSh0aGlzLmluc3RhbmNlSWQpXHJcbiAgICAgICAgdGhpcy5jYWxsQnVyc3QoKVxyXG4gICAgfVxyXG59IiwiJ3VzZSBzdHJpY3QnXHJcblxyXG5jb25zdCBSYW5kb21XYWxrQ2lyY2xlRWxlbWVudCA9IHJlcXVpcmUoJy4vcmFuZG9td2Fsa2NpcmNsZWVsZW1lbnQnKVxyXG5jb25zdCBFbGVtZW50TGlzdCA9IHJlcXVpcmUoJy4vZWxlbWVudGxpc3QnKVxyXG5jb25zdCBCdXJzdCA9IHJlcXVpcmUoJy4vYnVyc3QnKVxyXG5jb25zdCBXb3JkID0gcmVxdWlyZSgnLi93b3JkJylcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgUmVnZW5lcmF0ZUJvc3MgZXh0ZW5kcyBSYW5kb21XYWxrQ2lyY2xlRWxlbWVudCB7XHJcbiAgICBjb25zdHJ1Y3RvcihnYW1lLCBoZWFsdGg9MyApIHtcclxuICAgICAgICBzdXBlcihnYW1lKVxyXG4gICAgICAgIHRoaXMueCA9IDMwMDtcclxuICAgICAgICB0aGlzLnNwZWVkID0gMC4yXHJcbiAgICAgICAgdGhpcy5oZWFsdGggPSBoZWFsdGg7XHJcbiAgICAgICBcclxuXHJcbiAgICB9XHJcblxyXG4gICAgZHJhdyhjdHgpIHtcclxuICAgICAgICBjdHguYmVnaW5QYXRoKClcclxuICAgICAgICAgICAgY3R4LmFyYyh0aGlzLngsIHRoaXMueSwgMzAsIDAsIE1hdGguUEkgKiAyLCB0cnVlKVxyXG4gICAgICAgICAgICBjdHguY2xvc2VQYXRoKClcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSAgXCJibGFja1wiXHJcbiAgICAgICAgICAgIGN0eC5maWxsKClcclxuICAgIH1cclxuXHJcbiAgICBidWxsZXRNZXQoKSB7XHJcbiAgICAgICAgaWYodGhpcy5oZWFsdGggPiAxKXtcclxuICAgICAgICAgICAgdGhpcy5oZWFsdGggLT0gMTtcclxuICAgICAgICAgICAgY29uc3QgbmV4dEJvc3MgPSBuZXcgUmVnZW5lcmF0ZUJvc3ModGhpcy5nYW1lLCB0aGlzLmhlYWx0aCApO1xyXG4gICAgICAgICAgICBuZXh0Qm9zcy54ID0gdGhpcy54O1xyXG4gICAgICAgICAgICBuZXh0Qm9zcy55ID0gdGhpcy55O1xyXG4gICAgICAgICAgICB0aGlzLmdhbWUuZWxlbWVudExpc3QuYWRkKG5leHRCb3NzKTtcclxuICAgICAgICAgICAgdGhpcy5nYW1lLmVsZW1lbnRMaXN0LmRlbGV0ZSh0aGlzLmluc3RhbmNlSWQpXHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIHRoaXMuaGVhbHRoPTM7XHJcbiAgICAgICAgICAgIHRoaXMuaGFzQ29sbGlkZWQgPSB0cnVlXHJcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5lbGVtZW50TGlzdC5kZWxldGUodGhpcy5pbnN0YW5jZUlkKVxyXG4gICAgICAgICAgICB0aGlzLmNhbGxCdXJzdCgpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgfVxyXG59IiwiJ3VzZSBzdHJpY3QnXHJcblxyXG5cclxuY29uc3QgUmFuZG9tV2Fsa0NpcmNsZUVsZW1lbnQgPSByZXF1aXJlKCcuL3JhbmRvbXdhbGtjaXJjbGVlbGVtZW50JylcclxuY29uc3QgRWxlbWVudExpc3QgPSByZXF1aXJlKCcuL2VsZW1lbnRsaXN0JykgICAgXHJcbmNvbnN0IEJ1cnN0ID0gcmVxdWlyZSgnLi9idXJzdCcpXHJcbmNvbnN0IFdvcmQgPSByZXF1aXJlKCcuL3dvcmQnKVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBTcGF3bmVyQm9zcyBleHRlbmRzIFJhbmRvbVdhbGtDaXJjbGVFbGVtZW50IHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihnYW1lKSB7XHJcbiAgICAgICAgc3VwZXIoZ2FtZSlcclxuICAgICAgICB0aGlzLnggPSAzMDA7XHJcbiAgICAgICAgdGhpcy5zcGVlZCA9IDAuMTVcclxuXHJcblxyXG5cclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnNwYXduKCk7XHJcbiAgICAgICAgdGhpcy5zcGF3bkludGVydmFsID0gMTEwMDAgIC8vIHNwYXduIGV2ZXJ5IHggc2Vjb25kc1xyXG4gICAgICAgIHRoaXMubGFzdFNwYXduVGltZSA9IERhdGUubm93KCk7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgIGRyYXcoY3R4KSB7XHJcbiAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKVxyXG4gICAgICAgICAgICBjdHguYXJjKHRoaXMueCwgdGhpcy55LCAzMCwgMCwgTWF0aC5QSSAqIDIsIHRydWUpXHJcbiAgICAgICAgICAgIGN0eC5jbG9zZVBhdGgoKVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICBcIm9yYW5nZVwiXHJcbiAgICAgICAgICAgIGN0eC5maWxsKClcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYWN0aW9uKCl7XHJcbiAgICAgICAgc3VwZXIuYWN0aW9uKCk7XHJcbiAgICAgICAgdGhpcy5zdGFydFNwYXduaW5nKCk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHN0YXJ0U3Bhd25pbmcoKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3QgY3VycmVudFRpbWUgPSBEYXRlLm5vdygpO1xyXG4gICAgICAgIGlmKCBjdXJyZW50VGltZSAtIHRoaXMubGFzdFNwYXduVGltZSA+PSB0aGlzLnNwYXduSW50ZXJ2YWwpe1xyXG4gICAgICAgICAgICB0aGlzLnNwYXduKCk7XHJcbiAgICAgICAgICAgIHRoaXMubGFzdFNwYXduVGltZSA9IGN1cnJlbnRUaW1lO1xyXG5cclxuXHJcbiAgICAgICAgfSAgICAgICBcclxuICAgICAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgc3Bhd24oKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAyOyBpKyspIHtcclxuICAgICAgICAgICAgaWYodGhpcy5nYW1lLmVsZW1lbnRMaXN0KSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBtaW5pb24gPSBuZXcgUmFuZG9tV2Fsa0NpcmNsZUVsZW1lbnQodGhpcy5nYW1lKTtcclxuICAgICAgICAgICAgICAgIG1pbmlvbi54ID0gIHRoaXMueCArIChpICogNjAgLTMwKTs7IFxyXG4gICAgICAgICAgICAgICAgbWluaW9uLnkgPSB0aGlzLnkgKzEwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLmVsZW1lbnRMaXN0LmFkZChtaW5pb24pO1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgICBvbkNvbGxpc2lvbigpIHtcclxuICAgICAgICB0aGlzLmdhbWUuc2V0Qm9zc0luYWN0aXZlKCk7XHJcbiAgICAgICAgdGhpcy5oYXNDb2xsaWRlZCA9IHRydWVcclxuICAgICAgICB0aGlzLmdhbWUuZWxlbWVudExpc3QuZGVsZXRlKHRoaXMuaW5zdGFuY2VJZClcclxuICAgICAgICB0aGlzLmNhbGxCdXJzdCgpXHJcbiAgICAgICAgdGhpcy5nYW1lLmhlYWx0aC5yZWR1Y2UoKSAgIFxyXG4gICAgfVxyXG5cclxuICAgIGJ1bGxldE1ldCgpe1xyXG4gICAgICAgIHRoaXMuZ2FtZS5zZXRCb3NzSW5hY3RpdmUoKTtcclxuICAgICAgICBzdXBlci5idWxsZXRNZXQoKTtcclxuICAgIH1cclxuXHJcbiAgICAgXHJcblxyXG59IiwiJ3VzZSBzdHJpY3QnXHJcbmNvbnN0IEVsZW1lbnQgPSByZXF1aXJlKCcuL2VsZW1lbnQnKVxyXG5jb25zdCBSYW5kb21XYWxrQ2lyY2xlRWxlbWVudCA9IHJlcXVpcmUoJy4vcmFuZG9td2Fsa2NpcmNsZWVsZW1lbnQnKVxyXG5jb25zdCBFbGVtZW50TGlzdCA9IHJlcXVpcmUoJy4vZWxlbWVudGxpc3QnKSAgICBcclxuY29uc3QgQnVyc3QgPSByZXF1aXJlKCcuL2J1cnN0JylcclxuY29uc3QgV29yZCA9IHJlcXVpcmUoJy4vd29yZCcpXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFNwbGl0dGVyQm9zcyBleHRlbmRzIFJhbmRvbVdhbGtDaXJjbGVFbGVtZW50IHtcclxuIHN0YXRpYyB0b3RhbExpdmVzID0gNDtcclxuICAgIGNvbnN0cnVjdG9yKGdhbWUsIGhlYWx0aD0yLCBzaXplPTMwLCBhYnN0YW5kPTE1MCkge1xyXG4gICAgICAgIHN1cGVyKGdhbWUpXHJcbiAgICAgICAgdGhpcy54ID0gMzAwO1xyXG4gICAgICAgIHRoaXMuc3BlZWQgPSAwLjFcclxuICAgICAgICB0aGlzLmhlYWx0aCA9IGhlYWx0aDtcclxuICAgICAgICB0aGlzLnNpemUgPSBzaXplO1xyXG4gICAgICAgIHRoaXMuYWJzdGFuZCA9IGFic3RhbmQ7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGRyYXcoY3R4KSB7XHJcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpXHJcbiAgICAgICAgICAgIGN0eC5hcmModGhpcy54LCB0aGlzLnksIHRoaXMuc2l6ZSwgMCwgTWF0aC5QSSAqIDIsIHRydWUpXHJcbiAgICAgICAgICAgIGN0eC5jbG9zZVBhdGgoKVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICBcImJsdWVcIlxyXG4gICAgICAgICAgICBjdHguZmlsbCgpXHJcbiAgICB9XHJcblxyXG4gICAgYnVsbGV0TWV0KCkge1xyXG4gICAgICAgIGlmKHRoaXMuaGVhbHRoID49IDEpeyAgIFxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDI7IGkrKykge1xyXG4gICAgICAgICAgICBpZih0aGlzLmdhbWUuZWxlbWVudExpc3QpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG1pbmlvbiA9IG5ldyBTcGxpdHRlckJvc3ModGhpcy5nYW1lLCB0aGlzLmhlYWx0aCAtMSwgdGhpcy5zaXplLTgsIHRoaXMuYWJzdGFuZC03MCk7XHJcbiAgICAgICAgICAgICAgICBtaW5pb24ueCA9ICB0aGlzLnggKyAoaSAqIHRoaXMuYWJzdGFuZCAtIHRoaXMuYWJzdGFuZC8yKTs7IFxyXG4gICAgICAgICAgICAgICAgbWluaW9uLnkgPSB0aGlzLnkgKzEwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLmVsZW1lbnRMaXN0LmFkZChtaW5pb24pO1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmdhbWUuZWxlbWVudExpc3QuZGVsZXRlKHRoaXMuaW5zdGFuY2VJZClcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgaWYoU3BsaXR0ZXJCb3NzLnRvdGFsTGl2ZXMgPD0xKXtcclxuICAgICAgICAgICAgICAgIC8vdGhpcy5nYW1lLnNldEJvc3NJbmFjdGl2ZSgpO1xyXG4gICAgICAgICAgICAgICAgU3BsaXR0ZXJCb3NzLnRvdGFsTGl2ZXM9NDtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuaGVhbHRoPTI7XHJcbiAgICAgICAgICAgIFNwbGl0dGVyQm9zcy50b3RhbExpdmVzLS07XHJcbiAgICAgICAgICAgIHRoaXMuaGFzQ29sbGlkZWQgPSB0cnVlXHJcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5lbGVtZW50TGlzdC5kZWxldGUodGhpcy5pbnN0YW5jZUlkKVxyXG4gICAgICAgICAgICB0aGlzLmNhbGxCdXJzdCgpXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICAgb25Db2xsaXNpb24oKSB7XHJcbiAgICAgICAgdGhpcy5nYW1lLnNldEJvc3NJbmFjdGl2ZSgpO1xyXG4gICAgICAgIHRoaXMuaGFzQ29sbGlkZWQgPSB0cnVlXHJcbiAgICAgICAgdGhpcy5nYW1lLmVsZW1lbnRMaXN0LmRlbGV0ZSh0aGlzLmluc3RhbmNlSWQpXHJcbiAgICAgICAgdGhpcy5jYWxsQnVyc3QoKVxyXG4gICAgICAgIHRoaXMuZ2FtZS5oZWFsdGgucmVkdWNlKCkgICBcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbiIsIlwidXNlIHN0cmljdFwiXHJcblxyXG5jb25zdCBFbGVtZW50ID0gcmVxdWlyZSgnLi9lbGVtZW50JylcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgU3RhZ2UgZXh0ZW5kcyBFbGVtZW50IHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpXHJcbiAgICAgICAgdGhpcy54ID0gMFxyXG4gICAgICAgIHRoaXMueSA9IDBcclxuICAgIH1cclxuXHJcbiAgICBkcmF3KGN0eCkge1xyXG4gICAgICAgIHZhciBpbWcgPSBuZXcgSW1hZ2UoKTtcclxuICAgICAgICBpbWcub25sb2FkID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGN0eC5kcmF3SW1hZ2UoaW1nLCAwLCAwKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaW1nLnNyYyA9ICdpbWcvYmFja2dyb3VuZC5wbmcnO1xyXG4gICAgfVxyXG5cclxuICAgIGFjdGlvbigpIHtcclxuICAgICAgICBcclxuICAgIH1cclxufSIsIm1vZHVsZS5leHBvcnRzID0gY2xhc3MgVmFsaWRhdG9yIHtcclxuXHJcbmNvbnN0cnVjdG9yKCl7XHJcbiAgdGhpcy5hY3RpdmVXb3JkID0gXCJcIjtcclxuICB0aGlzLmN1cnJlbnRJbnB1dCA9IFwiXCI7XHJcbiAgLy90aGlzLmN1cnJlbnRTcG90PTA7XHJcbiAgLy90aGlzLndvcmRMb2NrZWQgPSBmYWxzZTtcclxufVxyXG5cclxuXHJcblxyXG5zZXRBY3RpdmVXb3JkKHdvcmQpe1xyXG4gICAgLy90aGlzLmFjdGl2ZVdvcmQgPSB3b3JkLnRvTG93ZXJDYXNlKCk7XHJcbiAgICB0aGlzLmFjdGl2ZVdvcmQgPSB3b3JkO1xyXG4gICAgdGhpcy5jdXJyZW50SW5wdXQgPSBcIlwiXHJcbiAgICAvL3RoaXMud29yZExvY2tlZCA9IGZhbHNlO1xyXG4gICAgLy90aGlzLmN1cnJlbnRTcG90ID0gMDtcclxufVxyXG5cclxuY2hlY2tMZXR0ZXIobGV0dGVyKXtcclxuICAgIC8vY29uc3QgZXhwZWN0ZWRDaGFyID0gdGhpcy50YXJnZXRXb3JkW3RoaXMuY3VycmVudFNwb3RdO1xyXG4gICAgaWYoLyohdGhpcy53b3JkTG9ja2VkIHx8Ki8gIXRoaXMuYWN0aXZlV29yZCl7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlOyAgICBcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBleHBlY3RlZENoYXIgPSB0aGlzLmFjdGl2ZVdvcmRbdGhpcy5jdXJyZW50SW5wdXQubGVuZ3RoXTtcclxuXHJcbiAgICBpZihsZXR0ZXIgPT09IGV4cGVjdGVkQ2hhcil7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50SW5wdXQgKz0gbGV0dGVyO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG5cclxuXHJcbn1cclxuXHJcblxyXG5pc1dvcmRDb21wbGV0ZSgpe1xyXG4gICAgcmV0dXJuIHRoaXMuYWN0aXZlV29yZCAmJiB0aGlzLmN1cnJlbnRJbnB1dCA9PT0gdGhpcy5hY3RpdmVXb3JkO1xyXG59XHJcbmdldEFjdGl2ZVdvcmQoKXtcclxuICAgIHJldHVybiB0aGlzLmFjdGl2ZVdvcmQ7XHJcbn1cclxucmVzZXQoKXtcclxuICAgIHRoaXMuY3VycmVudElucHV0ID0gXCJcIjtcclxuICAgIHRoaXMuYWN0aXZlV29yZCA9IG51bGw7XHJcbiAgICAvL3RoaXMud29yZExvY2tlZCA9IGZhbHNlO1xyXG59XHJcblxyXG5nZXRDdXJyZW50SW5wdXQoKXtcclxuICAgIHJldHVybiB0aGlzLmN1cnJlbnRJbnB1dDtcclxufVxyXG5oYXNBY3RpdmVXb3JkKCl7XHJcbiAgICByZXR1cm4gdGhpcy5hY3RpdmVXb3JkICE9PSBcIlwiO1xyXG59XHJcblxyXG59IiwiXCJ1c2Ugc3RyaWN0XCJcclxuXHJcbmNvbnN0IEVsZW1lbnQgPSByZXF1aXJlKCcuL2VsZW1lbnQnKVxyXG5jb25zdCBFbmdsaXNoR2VybWFuRGljdGlvbmFyeSA9IHJlcXVpcmUoJy4vZGljdGlvbmFyeScpXHJcbmNvbnN0IElucHV0RmllbGQgPSByZXF1aXJlKCcuL2lucHV0ZmllbGQnKVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBXb3JkIGV4dGVuZHMgRWxlbWVudCB7XHJcbiAgICBjb25zdHJ1Y3RvcihnYW1lLCB4LCB5LCBjaXJjbGVJZCwgc3BlZWQpIHtcclxuICAgICAgICBzdXBlcigpXHJcbiAgICAgICAgdGhpcy5kZXN0cm95ZWQgPSBmYWxzZSBcclxuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lXHJcbiAgICAgICAgdGhpcy5jaXJjbGVJZCA9IGNpcmNsZUlkXHJcbiAgICAgICAgdGhpcy5zcGVlZCA9IHNwZWVkXHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IGRpY3Rpb25hcnkgPSBuZXcgRW5nbGlzaEdlcm1hbkRpY3Rpb25hcnkoKTtcclxuICAgICAgICBpZihJbnB1dEZpZWxkLklucHV0bGlzdC5sZW5ndGggIT0gMCkge1xyXG4gICAgICAgICAgICBkaWN0aW9uYXJ5LnNldFdvcmRzKElucHV0RmllbGQuSW5wdXRsaXN0KTtcclxuICAgICAgICAgICAgZ2FtZS5nYW1lTW9kZSA9IFwib3duV29yZHNcIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHJhbmRvbUluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogZGljdGlvbmFyeS53b3Jkcy5sZW5ndGgpO1xyXG4gICAgICAgIGxldCBlbmdsaXNoV29yZCA9IGRpY3Rpb25hcnkud29yZHNbcmFuZG9tSW5kZXhdO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmIChnYW1lLmdhbWVNb2RlID09PSAnZ2VybWFuJykge1xyXG4gICAgICAgICAgICB0aGlzLmRpc3BsYXlXb3JkID0gZGljdGlvbmFyeS50cmFuc2xhdGUoZW5nbGlzaFdvcmQpO1xyXG4gICAgICAgICAgICB0aGlzLndvcmQgPSBlbmdsaXNoV29yZDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmRpc3BsYXlXb3JkID0gZW5nbGlzaFdvcmQ7XHJcbiAgICAgICAgICAgIHRoaXMud29yZCA9IGVuZ2xpc2hXb3JkO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICB3aGlsZSAoZ2FtZS5pc1dvcmRPbkRpc3BsYXkodGhpcy53b3JkKSkge1xyXG4gICAgICAgICAgICBjb25zdCBuZXdJbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGRpY3Rpb25hcnkud29yZHMubGVuZ3RoKTtcclxuICAgICAgICAgICAgZW5nbGlzaFdvcmQgPSBkaWN0aW9uYXJ5LndvcmRzW25ld0luZGV4XTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmIChnYW1lLmdhbWVNb2RlID09PSAnZ2VybWFuJykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5V29yZCA9IGRpY3Rpb25hcnkudHJhbnNsYXRlKGVuZ2xpc2hXb3JkKTtcclxuICAgICAgICAgICAgICAgIHRoaXMud29yZCA9IGVuZ2xpc2hXb3JkO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5V29yZCA9IGVuZ2xpc2hXb3JkO1xyXG4gICAgICAgICAgICAgICAgdGhpcy53b3JkID0gZW5nbGlzaFdvcmQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy54ID0geCAtIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibXljYW52YXNcIikuZ2V0Q29udGV4dCgnMmQnKS5tZWFzdXJlVGV4dCh0aGlzLmRpc3BsYXlXb3JkKS53aWR0aCAvIDIgLy90aGlzLmRpc3BsYXlXb3JkLmxlbmd0aCo4LzJcclxuICAgICAgICB0aGlzLnkgPSB5ICsgMzBcclxuICAgIH1cclxuXHJcbiAgICBkcmF3KGN0eCkge1xyXG4gICAgICAgIGxldCBjdXJyZW50SW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImN1cnJlbnQtaW5wdXRcIilcclxuICAgICAgICBpZihjdXJyZW50SW5wdXQudGV4dENvbnRlbnQuYXQoMCkgPT0gdGhpcy5kaXNwbGF5V29yZC5hdCgwKSkge1xyXG4gICAgICAgICAgICBsZXQgY3VycmVudElucHV0TGVuZ3RoID0gY3VycmVudElucHV0LnRleHRDb250ZW50Lmxlbmd0aFxyXG4gICAgICAgICAgICBjb25zdCBmaXJzdFBhcnQgPSB0aGlzLmRpc3BsYXlXb3JkLnNsaWNlKDAsIGN1cnJlbnRJbnB1dExlbmd0aCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3RQYXJ0ICA9IHRoaXMuZGlzcGxheVdvcmQuc2xpY2UoY3VycmVudElucHV0TGVuZ3RoKTtcclxuICAgICAgICAgICAgY29uc3QgdHlwZWRUZXh0V2lkdGggPSBjdHgubWVhc3VyZVRleHQoZmlyc3RQYXJ0KS53aWR0aDtcclxuXHJcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSBcImdyZXlcIjtcclxuICAgICAgICAgICAgY3R4LmZpbGxUZXh0KGZpcnN0UGFydCwgdGhpcy54LCB0aGlzLnkpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IFwid2hpdGVcIlxyXG4gICAgICAgICAgICBjdHguZmlsbFRleHQocmVzdFBhcnQsIHRoaXMueCArIHR5cGVkVGV4dFdpZHRoLCB0aGlzLnkpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSBcIndoaXRlXCJcclxuICAgICAgICAgICAgY3R4LmZpbGxUZXh0KHRoaXMuZGlzcGxheVdvcmQsIHRoaXMueCwgdGhpcy55KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYWN0aW9uKCkge1xyXG4gICAgICAgIC8vdGhpcy54ICs9IE1hdGgucmFuZG9tKCkgKiAyIC0gMVxyXG4gICAgICAgIHRoaXMueSArPSB0aGlzLnNwZWVkXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnkgPiB3aW5kb3cuaW5uZXJIZWlnaHQgLSA4MCkgdGhpcy5kZXN0cm95ZWQgPSB0cnVlXHJcbiAgICB9XHJcblxyXG4gICAgY2hlY2tDb2xsaXNpb24oKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZ2FtZS5lbGVtZW50TGlzdC5nZXQodGhpcy5jaXJjbGVJZCkgPT0gbnVsbCkgeyAvL2lmIGl0IGlzIG51bGwsIHRoYXQgbWVhbnMgdGhlIGNpcmNsZSBoYXMgY29sbGlkZWRcclxuICAgICAgICAgICAgdGhpcy5vbkNvbGxpc2lvbigpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG9uQ29sbGlzaW9uKCkge1xyXG4gICAgICAgIHRoaXMuaGFzQ29sbGlkZWQgPSB0cnVlXHJcbiAgICAgICAgdGhpcy5nYW1lLmVsZW1lbnRMaXN0LmRlbGV0ZSh0aGlzLmluc3RhbmNlSWQpO1xyXG4gICAgfVxyXG5cclxufVxyXG4iLCIndXNlIHN0cmljdCdcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgV29yZElucHV0SGFuZGxlcntcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHRoaXMuaW5wdXRMaW5lPSBudWxsO1xyXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmhhbmRsZUlucHV0LmJpbmQodGhpcykpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldExldHRlckNhbGxiYWNrKGNhbGxiYWNrKXtcclxuICAgICAgICB0aGlzLmlucHV0TGluZSA9IGNhbGxiYWNrO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZUlucHV0KGV2ZW50KXtcclxuICAgICAgLy8gIGlmKGV2ZW50LmtleS5sZW5ndGg9PTEgJiYgL1thLXpBLVpdLy50ZXN0KGV2ZW50LmtleSkpeyAvLyBvcmdpbmFsZSBcclxuICAgICAgaWYgKGV2ZW50LmtleS5sZW5ndGggPT09IDEgJiYgL1xccHtMfS91LnRlc3QoZXZlbnQua2V5KSkgeyAvLyBBbGxlIEFTQ0lJIHJlZ2VzdHJpZXJ0ZSBidWNoc3RhYmVuXHJcblxyXG4gICAgICAgICAgICBjb25zdCBsZXR0ZXI9IGV2ZW50LmtleS50b0xvd2VyQ2FzZSgpO1xyXG5cclxuICAgICAgICAgICAgaWYodGhpcy5pbnB1dExpbmUpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pbnB1dExpbmUobGV0dGVyKTtcclxuICAgICAgICAgICAgfSAgIFxyXG4gICAgICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qXHJcbiAgICBub3RpZnkobGV0dGVyKXtcclxuICAgICAgICAvL2hpZXIgd2VyZGVuIGRpZSBhbmRlcmVuIGtsYXNzZW4gdm9uIGRlbSBuZXVlbiBidWNoc3RhYmVuIG5vdGlmaWVydFxyXG4gICAgICAgIC8vIGV2dGwgw7xiZXJmbMO8c3NpZ1xyXG4gICAgfVxyXG5cclxuICAgIGdldElucHV0KCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5wdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgcmVzZXRJbnB1dCgpe1xyXG4gICAgICAgIHRoaXMuaW5wdXQ9IFwiXCI7XHJcbiAgICB9Ki9cclxufSJdfQ==
