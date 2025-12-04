(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const Element = require('./element')

module.exports = class Bullet extends Element {
    constructor(targetX, targetY, targetId, game) {
        super()
        // Startposition: Fest, wie du willst
        this.x = 270
        this.y = 520
        
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

},{"./element":4}],2:[function(require,module,exports){
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
},{"./element":4,"./elementlist":5,"./game":6}],3:[function(require,module,exports){
class EnglishGermanDictionary {
    constructor() {

        // ---------------------------------------------------------
        // 🔹 1. Englische Wörterliste (NUR English Words)
        // ---------------------------------------------------------
        this.words = [
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
}

module.exports = EnglishGermanDictionary;

},{}],4:[function(require,module,exports){
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
},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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


module.exports = class Game {

    intervalId = 0
    cometesCount = 0

    constructor() {
        this.raf                       // request animation frame handle
        this.elementList = null
        this.health = new Health();

        this.score = 0 
        this.currentInput = ''
        // Änderungen von Brian
        this.validator = new Validator();
        this.wordInputhander = new WordInputHandler();
        this.activeWordElement = null;
        this.wordInputhander.setLetterCallback(this.handleLetterInput.bind(this));
        this.isInputSet = false
        this.isPaused = false
        this.lastBossScore = 0
        this.bossActive = false;

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
        }, 3000);
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

        const startButton = window.document.getElementById("start-button") 
        startButton.textContent = "Continue"
        startButton.onclick = () => {
            document.getElementById("main-menu").style.display = "none"
            this.continue()
        }
    }

    continue() {
        this.isPaused = false
        this.generateCometes()
    }

    // menü nach tod einblinden 
    gameOver() {
        this.stop();
        this.stopGeneratingCometes()
        document.getElementById("main-menu").style.display = "flex";    // Menü zeigen 
        this.health = new Health();                                    // leben wieder zurück setzen 
        this.score = 0;

        const startButton = window.document.getElementById("start-button") 
        startButton.textContent = "Restart"
        startButton.onclick = () => {
            document.getElementById("main-menu").style.display = "none" // versteckt das main menü 
            this.start()
        }
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
            return;
        }

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
                this.resetActiveWord();
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
    resetActiveWord() {
    this.activeWordElement = null;
    this.currentInput = '';
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
    if(this.score > 0 && this.score % 2 === 0 && this.score !== this.lastBossScore) {
        this.lastBossScore = this.score;
        this.bossActive = true;
        //this.elementList.add(new SpawnerBoss(this));
        this.elementList.add(new RegenerateBoss(this));
        
    }
    
}



}

},{"./bullet":1,"./burst":2,"./elementlist":5,"./health":7,"./randomwalkcircleelement":9,"./regenerateBoss":10,"./spawnerboss":11,"./stage":12,"./validator":13,"./word":14,"./wordinputhandler":15}],7:[function(require,module,exports){
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
},{"./element":4}],8:[function(require,module,exports){
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

},{"./game":6}],9:[function(require,module,exports){
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
},{"./burst":2,"./element":4,"./health":7,"./word":14}],10:[function(require,module,exports){
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
},{"./burst":2,"./elementlist":5,"./randomwalkcircleelement":9,"./word":14}],11:[function(require,module,exports){
'use strict'


const RandomWalkCircleElement = require('./randomwalkcircleelement')
const ElementList = require('./elementlist')    
const Burst = require('./burst')
const Word = require('./word')

module.exports = class SpawnerBoss extends RandomWalkCircleElement {

    constructor(game) {
        super(game)
        this.x = 300;
        this.speed = 0.2



        
        this.spawn();
        this.spawnInterval = 5000  // spawn every x seconds
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
                minion.x =  this.x + (i - 1) * 60; 
                minion.y = this.y +10;
                this.game.elementList.add(minion);

            }
        }
    }
    

}
},{"./burst":2,"./elementlist":5,"./randomwalkcircleelement":9,"./word":14}],12:[function(require,module,exports){
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
},{"./element":4}],13:[function(require,module,exports){
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
},{}],14:[function(require,module,exports){
"use strict"

const Element = require('./element')
const EnglishGermanDictionary = require('./dictionary')

module.exports = class Word extends Element {
    constructor(game, x, y, circleId, speed) {
        super()
        this.destroyed = false 
        this.game = game
        this.circleId = circleId
        this.speed = speed
        
        const dictionary = new EnglishGermanDictionary();
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
        
        this.x = x - this.displayWord.length*8/2
        this.y = y + 30
    }

    draw(ctx) {
        ctx.fillStyle = "white"
        ctx.fillText(this.displayWord, this.x, this.y);
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

},{"./dictionary":3,"./element":4}],15:[function(require,module,exports){
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
        if(event.key.length==1 && /[a-zA-Z]/.test(event.key)){
            //const letter= event.key.toLowerCase();
            const letter= event.key;
            
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
},{}]},{},[8])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJnYW1lL2J1bGxldC5qcyIsImdhbWUvYnVyc3QuanMiLCJnYW1lL2RpY3Rpb25hcnkuanMiLCJnYW1lL2VsZW1lbnQuanMiLCJnYW1lL2VsZW1lbnRsaXN0LmpzIiwiZ2FtZS9nYW1lLmpzIiwiZ2FtZS9oZWFsdGguanMiLCJnYW1lL21haW4uanMiLCJnYW1lL3JhbmRvbXdhbGtjaXJjbGVlbGVtZW50LmpzIiwiZ2FtZS9yZWdlbmVyYXRlQm9zcy5qcyIsImdhbWUvc3Bhd25lcmJvc3MuanMiLCJnYW1lL3N0YWdlLmpzIiwiZ2FtZS92YWxpZGF0b3IuanMiLCJnYW1lL3dvcmQuanMiLCJnYW1lL3dvcmRpbnB1dGhhbmRsZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL1VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJjb25zdCBFbGVtZW50ID0gcmVxdWlyZSgnLi9lbGVtZW50JylcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgQnVsbGV0IGV4dGVuZHMgRWxlbWVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcih0YXJnZXRYLCB0YXJnZXRZLCB0YXJnZXRJZCwgZ2FtZSkge1xyXG4gICAgICAgIHN1cGVyKClcclxuICAgICAgICAvLyBTdGFydHBvc2l0aW9uOiBGZXN0LCB3aWUgZHUgd2lsbHN0XHJcbiAgICAgICAgdGhpcy54ID0gMjcwXHJcbiAgICAgICAgdGhpcy55ID0gNTIwXHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy50YXJnZXRYID0gdGFyZ2V0WFxyXG4gICAgICAgIHRoaXMudGFyZ2V0WSA9IHRhcmdldFlcclxuICAgICAgICB0aGlzLnRhcmdldElkID0gdGFyZ2V0SWQgIC8vIGluc3RhbmNlSWQgZGVzIFpJRUwtS3JlaXNlc1xyXG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWVcclxuICAgICAgICB0aGlzLmhhc0NvbGxpZGVkID0gZmFsc2VcclxuICAgICAgICBcclxuICAgICAgICAvLyBSaWNodHVuZ3N2ZWt0b3JcclxuICAgICAgICBjb25zdCBkeCA9IHRhcmdldFggLSB0aGlzLnhcclxuICAgICAgICBjb25zdCBkeSA9IHRhcmdldFkgLSB0aGlzLnlcclxuICAgICAgICBjb25zdCBkaXN0ID0gTWF0aC5oeXBvdChkeCwgZHkpIHx8IDFcclxuICAgICAgICB0aGlzLnZ4ID0gKGR4IC8gZGlzdCkgKiA4XHJcbiAgICAgICAgdGhpcy52eSA9IChkeSAvIGRpc3QpICogOFxyXG4gICAgfVxyXG5cclxuICAgIGRyYXcoY3R4KSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaGFzQ29sbGlkZWQpIHJldHVyblxyXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSAnI2ZmMCdcclxuICAgICAgICBjdHguYmVnaW5QYXRoKClcclxuICAgICAgICBjdHguYXJjKHRoaXMueCwgdGhpcy55LCA1LCAwLCBNYXRoLlBJICogMilcclxuICAgICAgICBjdHguZmlsbCgpXHJcbiAgICAgICAgXHJcbiAgICAgICAgY3R4LnNoYWRvd0JsdXIgPSAxMFxyXG4gICAgICAgIGN0eC5zaGFkb3dDb2xvciA9ICcjZmYwJ1xyXG4gICAgICAgIGN0eC5maWxsKClcclxuICAgICAgICBjdHguc2hhZG93Qmx1ciA9IDBcclxuICAgIH1cclxuXHJcbiAgICBhY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaGFzQ29sbGlkZWQpIHJldHVyblxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIFppZWwtS3JlaXMtUG9zaXRpb24gYWt0dWFsaXNpZXJlbiAoZXIgYmV3ZWd0IHNpY2ghKVxyXG4gICAgICAgIGNvbnN0IHRhcmdldCA9IHRoaXMuZ2FtZS5lbGVtZW50TGlzdC5nZXQodGhpcy50YXJnZXRJZClcclxuICAgICAgICBpZiAodGFyZ2V0KSB7XHJcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0WCA9IHRhcmdldC54XHJcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0WSA9IHRhcmdldC55XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjb25zdCBkeCA9IHRoaXMudGFyZ2V0WCAtIHRoaXMueFxyXG4gICAgICAgICAgICBjb25zdCBkeSA9IHRoaXMudGFyZ2V0WSAtIHRoaXMueVxyXG4gICAgICAgICAgICBjb25zdCBkaXN0ID0gTWF0aC5oeXBvdChkeCwgZHkpIHx8IDFcclxuICAgICAgICAgICAgdGhpcy52eCA9IChkeCAvIGRpc3QpICogOFxyXG4gICAgICAgICAgICB0aGlzLnZ5ID0gKGR5IC8gZGlzdCkgKiA4XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMueCArPSB0aGlzLnZ4XHJcbiAgICAgICAgdGhpcy55ICs9IHRoaXMudnlcclxuICAgIH1cclxuXHJcbiAgICBjaGVja0NvbGxpc2lvbigpIHtcclxuICAgICAgICBpZiAodGhpcy5nYW1lLmVsZW1lbnRMaXN0LmdldCh0aGlzLnRhcmdldElkKSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMub25Db2xsaXNpb24oKVxyXG4gICAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgZGlzdCA9IE1hdGguaHlwb3QodGhpcy50YXJnZXRYIC0gdGhpcy54LCB0aGlzLnRhcmdldFkgLSB0aGlzLnkpXHJcbiAgICAgICAgaWYgKGRpc3QgPCAxNSkge1xyXG4gICAgICAgICAgICB0aGlzLm9uQ29sbGlzaW9uKClcclxuICAgICAgICAgICAgdGhpcy5nYW1lLmVsZW1lbnRMaXN0LmdldCh0aGlzLnRhcmdldElkKS5idWxsZXRNZXQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMueCA8IDAgfHwgdGhpcy54ID4gd2luZG93LmlubmVyV2lkdGggfHwgXHJcbiAgICAgICAgICAgIHRoaXMueSA8IDAgfHwgdGhpcy55ID4gd2luZG93LmlubmVySGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIHRoaXMub25Db2xsaXNpb24oKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBvbkNvbGxpc2lvbigpIHtcclxuICAgICAgICB0aGlzLmhhc0NvbGxpZGVkID0gdHJ1ZVxyXG4gICAgICAgIHRoaXMuZ2FtZS5lbGVtZW50TGlzdC5kZWxldGUodGhpcy5pbnN0YW5jZUlkKVxyXG4gICAgfVxyXG59XHJcbiIsIlwidXNlIHN0cmljdFwiXHJcblxyXG5jb25zdCBFbGVtZW50ID0gcmVxdWlyZSgnLi9lbGVtZW50JylcclxuY29uc3QgRWxlbWVudExpc3QgPSByZXF1aXJlKCcuL2VsZW1lbnRsaXN0JylcclxuY29uc3QgR2FtZSA9IHJlcXVpcmUoJy4vZ2FtZScpXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIEJ1cnN0IGV4dGVuZHMgRWxlbWVudCB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoeCwgeSwgZ2FtZSkge1xyXG4gICAgICAgIHN1cGVyKClcclxuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lXHJcbiAgICAgICAgdGhpcy54ID0geFxyXG4gICAgICAgIHRoaXMueSA9IHlcclxuICAgICAgICB0aGlzLnNpemUgPSAxNSAgIFxyXG4gICAgICAgIHRoaXMuY2hlY2tDb2xsaXNpb24oKVxyXG4gICAgfVxyXG5cclxuICAgIGRyYXcoY3R4KSB7XHJcbiAgICAgICAgdmFyIGltZyA9IG5ldyBJbWFnZSgpO1xyXG4gICAgICAgIGltZy5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGN0eC5kcmF3SW1hZ2UoaW1nLCB0aGlzLnggLSAxMCwgdGhpcy55IC0gMTAsIDMwLCAzMCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBpbWcuc3JjID0gJ2ltZy9leHBsb3Npb24ucG5nJztcclxuICAgIH1cclxuXHJcbiAgICBhY3Rpb24oKSB7XHJcbiAgICAgICAgLy90aGlzLnggKz0gTWF0aC5yYW5kb20oKSAqIDIgLSAxXHJcbiAgICB9XHJcbiAgICBcclxuICAgIGNoZWNrQ29sbGlzaW9uKCkgeyBcclxuICAgICAgICBpZih0aGlzLmluc3RhbmNlSWQgIT0gLTEpIHtcclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uQ29sbGlzaW9uKClcclxuICAgICAgICAgICAgfSwgNzAwKTsgIFxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBvbkNvbGxpc2lvbigpIHtcclxuICAgICAgICB0aGlzLmhhc0NvbGxpZGVkID0gdHJ1ZVxyXG4gICAgICAgIHRoaXMuZ2FtZS5lbGVtZW50TGlzdC5kZWxldGUodGhpcy5pbnN0YW5jZUlkKVxyXG4gICAgfVxyXG59IiwiY2xhc3MgRW5nbGlzaEdlcm1hbkRpY3Rpb25hcnkge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcblxyXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgICAgIC8vIPCflLkgMS4gRW5nbGlzY2hlIFfDtnJ0ZXJsaXN0ZSAoTlVSIEVuZ2xpc2ggV29yZHMpXHJcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAgICAgdGhpcy53b3JkcyA9IFtcclxuICAgICAgICAgICAgXCJhcHBsZVwiLCBcImFuaW1hbFwiLCBcImFuc3dlclwiLCBcImFpclwiLCBcImFnZVwiLCBcImFyZWFcIiwgXCJhcm1cIiwgXCJhc2tcIixcclxuICAgICAgICAgICAgXCJhbHdheXNcIiwgXCJhbnl0aGluZ1wiLFxyXG4gICAgICAgICAgICBcImJhYnlcIiwgXCJiYWdcIiwgXCJiYWxsXCIsIFwiYmFua1wiLCBcImJhdGhcIiwgXCJiZWFjaFwiLCBcImJlYXJcIiwgXCJiZWF1dGlmdWxcIixcclxuICAgICAgICAgICAgXCJiZWNhdXNlXCIsIFwiYmVkXCIsIFwiYmVlclwiLCBcImJlZm9yZVwiLCBcImJlZ2luXCIsIFwiYmVoaW5kXCIsIFwiYmlnXCIsIFwiYmlyZFwiLFxyXG4gICAgICAgICAgICBcImJpcnRoZGF5XCIsIFwiYmxhY2tcIiwgXCJibG9vZFwiLCBcImJsdWVcIiwgXCJib29rXCIsIFwiYm9vdFwiLCBcImJyZWFkXCIsXHJcbiAgICAgICAgICAgIFwiYnJlYWtcIiwgXCJicm90aGVyXCIsXHJcbiAgICAgICAgICAgIFwiY2FrZVwiLCBcImNhclwiLCBcImNhdFwiLCBcImNoYWlyXCIsIFwiY2hlZXNlXCIsIFwiY2hpbGRcIiwgXCJjaXR5XCIsIFwiY2xlYW5cIixcclxuICAgICAgICAgICAgXCJjbG9zZVwiLCBcImNsb3VkXCIsIFwiY29mZmVlXCIsIFwiY29sZFwiLCBcImNvbG9yXCIsIFwiY291bnRyeVwiLCBcImN1cFwiLFxyXG4gICAgICAgICAgICBcImRheVwiLCBcImRhZFwiLCBcImRhbmNlXCIsIFwiZGFya1wiLCBcImRhdWdodGVyXCIsIFwiZGVhZFwiLCBcImRlYXJcIiwgXCJkZWVwXCIsXHJcbiAgICAgICAgICAgIFwiZGVza1wiLCBcImRpbm5lclwiLCBcImRvZ1wiLCBcImRvb3JcIiwgXCJkcmVhbVwiLCBcImRyaW5rXCIsIFwiZHJpdmVcIixcclxuICAgICAgICAgICAgXCJlYXJcIiwgXCJlYXJ0aFwiLCBcImVhc3lcIiwgXCJlYXRcIiwgXCJlZ2dcIiwgXCJlbmVyZ3lcIiwgXCJldmVuaW5nXCIsIFwiZXllXCIsXHJcbiAgICAgICAgICAgIFwiZXZlcnl0aGluZ1wiLFxyXG4gICAgICAgICAgICBcImZhY2VcIiwgXCJmYW1pbHlcIiwgXCJmYXJcIiwgXCJmYXJtXCIsIFwiZmFzdFwiLCBcImZhdGhlclwiLCBcImZlZXRcIiwgXCJmaWdodFwiLFxyXG4gICAgICAgICAgICBcImZpcmVcIiwgXCJmaXNoXCIsIFwiZmxvb3JcIiwgXCJmbG93ZXJcIiwgXCJmb29kXCIsIFwiZm9vdFwiLCBcImZyaWVuZFwiLFxyXG4gICAgICAgICAgICBcImdhcmRlblwiLCBcImdpcmxcIiwgXCJnbGFzc1wiLCBcImdvXCIsIFwiZ29vZFwiLCBcImdyZWVuXCIsIFwiZ3JvdW5kXCIsIFwiZ3JvdXBcIixcclxuICAgICAgICAgICAgXCJoYWlyXCIsIFwiaGFuZFwiLCBcImhhbmdcIiwgXCJoYXBweVwiLCBcImhhdFwiLCBcImhlYWRcIiwgXCJoZWFsdGhcIiwgXCJoZWFydFwiLFxyXG4gICAgICAgICAgICBcImhlYXRcIiwgXCJoZWF2eVwiLCBcImhlbGxvXCIsIFwiaGVyZVwiLCBcImhpZ2hcIiwgXCJob21lXCIsIFwiaG9yc2VcIiwgXCJob3VzZVwiLFxyXG4gICAgICAgICAgICBcImljZVwiLCBcImlkZWFcIiwgXCJpbGxcIiwgXCJpbXBvcnRhbnRcIiwgXCJpbnNpZGVcIiwgXCJpc2xhbmRcIixcclxuICAgICAgICAgICAgXCJqb2JcIiwgXCJqdWljZVwiLCBcImp1bXBcIixcclxuICAgICAgICAgICAgXCJrZXlcIiwgXCJraWxsXCIsIFwia2luZ1wiLCBcImtpdGNoZW5cIiwgXCJraXNzXCIsIFwia25vd1wiLFxyXG4gICAgICAgICAgICBcImxha2VcIiwgXCJsYW5kXCIsIFwibGFuZ3VhZ2VcIiwgXCJsYXJnZVwiLCBcImxhdWdoXCIsIFwibGVhcm5cIiwgXCJsZWZ0XCIsXHJcbiAgICAgICAgICAgIFwibGVnXCIsIFwibGlmZVwiLCBcImxpZ2h0XCIsIFwibGlrZVwiLCBcImxpb25cIiwgXCJsaXR0bGVcIiwgXCJsb25nXCIsIFwibG92ZVwiLFxyXG4gICAgICAgICAgICBcIm1hY2hpbmVcIiwgXCJtYWtlXCIsIFwibWFuXCIsIFwibWFueVwiLCBcIm1pbGtcIiwgXCJtaW51dGVcIiwgXCJtb25leVwiLFxyXG4gICAgICAgICAgICBcIm1vbnRoXCIsIFwibW9ybmluZ1wiLCBcIm1vdGhlclwiLCBcIm1vdW50YWluXCIsXHJcbiAgICAgICAgICAgIFwibmFtZVwiLCBcIm5hdGlvblwiLCBcIm5lYXJcIiwgXCJuZWNrXCIsIFwibmlnaHRcIiwgXCJub2lzZVwiLCBcIm5vcnRoXCIsXHJcbiAgICAgICAgICAgIFwib2NlYW5cIiwgXCJvZmZcIiwgXCJvZmZpY2VcIiwgXCJvaWxcIiwgXCJvbGRcIiwgXCJvcGVuXCIsIFwib3JhbmdlXCIsIFwib3JkZXJcIixcclxuICAgICAgICAgICAgXCJwYWdlXCIsIFwicGFwZXJcIiwgXCJwYXJlbnRcIiwgXCJwYXJrXCIsIFwicGFydHlcIiwgXCJwZW5cIiwgXCJwZW9wbGVcIixcclxuICAgICAgICAgICAgXCJwaG9uZVwiLCBcInBpY3R1cmVcIiwgXCJwbGFjZVwiLCBcInBsYW50XCIsIFwicGxheVwiLCBcInBvY2tldFwiLCBcInBvbGljZVwiLFxyXG4gICAgICAgICAgICBcInBvdGF0b1wiLCBcInByb2JsZW1cIixcclxuICAgICAgICAgICAgXCJxdWVlblwiLCBcInF1ZXN0aW9uXCIsXHJcbiAgICAgICAgICAgIFwicmFpblwiLCBcInJlc3RhdXJhbnRcIiwgXCJyZWRcIiwgXCJyaWdodFwiLCBcInJpdmVyXCIsIFwicm9hZFwiLCBcInJvb21cIiwgXCJydW5cIixcclxuICAgICAgICAgICAgXCJzYWx0XCIsIFwic2FuZFwiLCBcInNjaG9vbFwiLCBcInNlYVwiLCBcInNlYXNvblwiLCBcInNlZVwiLCBcInNoaXJ0XCIsXHJcbiAgICAgICAgICAgIFwic2hvZVwiLCBcInNob3BcIiwgXCJzaG9ydFwiLCBcInNsZWVwXCIsIFwic2xvd1wiLCBcInNtYWxsXCIsIFwic21pbGVcIiwgXCJzbm93XCIsXHJcbiAgICAgICAgICAgIFwic29uXCIsIFwic291bmRcIiwgXCJzb3VwXCIsIFwic3BvcnRcIiwgXCJzcHJpbmdcIiwgXCJzdGFyXCIsIFwic3RvbmVcIixcclxuICAgICAgICAgICAgXCJzdHJlZXRcIiwgXCJzdHJvbmdcIiwgXCJzdW1tZXJcIiwgXCJzdW5cIiwgXCJzd2VldFwiLFxyXG4gICAgICAgICAgICBcInRhYmxlXCIsIFwidGVhY2hlclwiLCBcInRlYVwiLCBcInRlYW1cIiwgXCJ0ZW5cIiwgXCJ0ZXN0XCIsIFwidGhpbmdcIixcclxuICAgICAgICAgICAgXCJ0aG91Z2h0XCIsIFwidGltZVwiLCBcInRpcmVkXCIsIFwidG9tb3Jyb3dcIiwgXCJ0b3duXCIsIFwidHJlZVwiLCBcInRyYWluXCIsXHJcbiAgICAgICAgICAgIFwidHJhdmVsXCIsXHJcbiAgICAgICAgICAgIFwidW5kZXJcIiwgXCJ1bmNsZVwiLCBcInVwXCIsIFwidXNlXCIsXHJcbiAgICAgICAgICAgIFwidmlsbGFnZVwiLCBcInZvaWNlXCIsXHJcbiAgICAgICAgICAgIFwid2Fsa1wiLCBcIndhcm1cIiwgXCJ3YXRlclwiLCBcIndheVwiLCBcIndlZWtcIiwgXCJ3ZWxjb21lXCIsIFwid2hpdGVcIixcclxuICAgICAgICAgICAgXCJ3aW5kb3dcIiwgXCJ3aW5kXCIsIFwid2ludGVyXCIsIFwid29tYW5cIiwgXCJ3b3JkXCIsIFwid29ya1wiLCBcIndvcmxkXCIsXHJcbiAgICAgICAgICAgIFwid3JpdGVcIixcclxuICAgICAgICAgICAgXCJ5ZWFyXCIsIFwieWVsbG93XCIsIFwieW91bmdcIixcclxuICAgICAgICAgICAgXCJ6b29cIlxyXG4gICAgICAgIF07XHJcblxyXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgICAgIC8vIPCflLkgMi4gRW5nbGlzY2hlIFfDtnJ0ZXIg4oaSIERldXRzY2hlIMOcYmVyc2V0enVuZ2VuXHJcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAgICAgdGhpcy50cmFuc2xhdGlvbnMgPSB7XHJcbiAgICAgICAgICAgIFwiYXBwbGVcIjogXCJBcGZlbFwiLCBcImFuaW1hbFwiOiBcIlRpZXJcIiwgXCJhbnN3ZXJcIjogXCJBbnR3b3J0XCIsIFwiYWlyXCI6IFwiTHVmdFwiLFxyXG4gICAgICAgICAgICBcImFnZVwiOiBcIkFsdGVyXCIsIFwiYXJlYVwiOiBcIkJlcmVpY2hcIiwgXCJhcm1cIjogXCJBcm1cIiwgXCJhc2tcIjogXCJmcmFnZW5cIixcclxuICAgICAgICAgICAgXCJhbHdheXNcIjogXCJpbW1lclwiLCBcImFueXRoaW5nXCI6IFwiZXR3YXNcIixcclxuXHJcbiAgICAgICAgICAgIFwiYmFieVwiOiBcIkJhYnlcIiwgXCJiYWdcIjogXCJUYXNjaGVcIiwgXCJiYWxsXCI6IFwiQmFsbFwiLCBcImJhbmtcIjogXCJCYW5rXCIsXHJcbiAgICAgICAgICAgIFwiYmF0aFwiOiBcIkJhZFwiLCBcImJlYWNoXCI6IFwiU3RyYW5kXCIsIFwiYmVhclwiOiBcIkLDpHJcIiwgXCJiZWF1dGlmdWxcIjogXCJzY2jDtm5cIixcclxuICAgICAgICAgICAgXCJiZWNhdXNlXCI6IFwid2VpbFwiLCBcImJlZFwiOiBcIkJldHRcIiwgXCJiZWVyXCI6IFwiQmllclwiLCBcImJlZm9yZVwiOiBcInZvcmhlclwiLFxyXG4gICAgICAgICAgICBcImJlZ2luXCI6IFwiYmVnaW5uZW5cIiwgXCJiZWhpbmRcIjogXCJoaW50ZXJcIiwgXCJiaWdcIjogXCJncm/Dn1wiLCBcImJpcmRcIjogXCJWb2dlbFwiLFxyXG4gICAgICAgICAgICBcImJpcnRoZGF5XCI6IFwiR2VidXJ0c3RhZ1wiLCBcImJsYWNrXCI6IFwic2Nod2FyelwiLCBcImJsb29kXCI6IFwiQmx1dFwiLFxyXG4gICAgICAgICAgICBcImJsdWVcIjogXCJibGF1XCIsIFwiYm9va1wiOiBcIkJ1Y2hcIiwgXCJib290XCI6IFwiU3RpZWZlbFwiLCBcImJyZWFkXCI6IFwiQnJvdFwiLFxyXG4gICAgICAgICAgICBcImJyZWFrXCI6IFwiUGF1c2VcIiwgXCJicm90aGVyXCI6IFwiQnJ1ZGVyXCIsXHJcblxyXG4gICAgICAgICAgICBcImNha2VcIjogXCJLdWNoZW5cIiwgXCJjYXJcIjogXCJBdXRvXCIsIFwiY2F0XCI6IFwiS2F0emVcIiwgXCJjaGFpclwiOiBcIlN0dWhsXCIsXHJcbiAgICAgICAgICAgIFwiY2hlZXNlXCI6IFwiS8Okc2VcIiwgXCJjaGlsZFwiOiBcIktpbmRcIiwgXCJjaXR5XCI6IFwiU3RhZHRcIiwgXCJjbGVhblwiOiBcInNhdWJlclwiLFxyXG4gICAgICAgICAgICBcImNsb3NlXCI6IFwic2NobGllw59lblwiLCBcImNsb3VkXCI6IFwiV29sa2VcIiwgXCJjb2ZmZWVcIjogXCJLYWZmZWVcIixcclxuICAgICAgICAgICAgXCJjb2xkXCI6IFwia2FsdFwiLCBcImNvbG9yXCI6IFwiRmFyYmVcIiwgXCJjb3VudHJ5XCI6IFwiTGFuZFwiLCBcImN1cFwiOiBcIlRhc3NlXCIsXHJcblxyXG4gICAgICAgICAgICBcImRheVwiOiBcIlRhZ1wiLCBcImRhZFwiOiBcIlBhcGFcIiwgXCJkYW5jZVwiOiBcInRhbnplblwiLCBcImRhcmtcIjogXCJkdW5rZWxcIixcclxuICAgICAgICAgICAgXCJkYXVnaHRlclwiOiBcIlRvY2h0ZXJcIiwgXCJkZWFkXCI6IFwidG90XCIsIFwiZGVhclwiOiBcImxpZWJcIiwgXCJkZWVwXCI6IFwidGllZlwiLFxyXG4gICAgICAgICAgICBcImRlc2tcIjogXCJTY2hyZWlidGlzY2hcIiwgXCJkaW5uZXJcIjogXCJBYmVuZGVzc2VuXCIsIFwiZG9nXCI6IFwiSHVuZFwiLFxyXG4gICAgICAgICAgICBcImRvb3JcIjogXCJUw7xyXCIsIFwiZHJlYW1cIjogXCJUcmF1bVwiLCBcImRyaW5rXCI6IFwiR2V0csOkbmtcIiwgXCJkcml2ZVwiOiBcImZhaHJlblwiLFxyXG5cclxuICAgICAgICAgICAgXCJlYXJcIjogXCJPaHJcIiwgXCJlYXJ0aFwiOiBcIkVyZGVcIiwgXCJlYXN5XCI6IFwiZWluZmFjaFwiLCBcImVhdFwiOiBcImVzc2VuXCIsXHJcbiAgICAgICAgICAgIFwiZWdnXCI6IFwiRWlcIiwgXCJlbmVyZ3lcIjogXCJFbmVyZ2llXCIsIFwiZXZlbmluZ1wiOiBcIkFiZW5kXCIsXHJcbiAgICAgICAgICAgIFwiZXllXCI6IFwiQXVnZVwiLCBcImV2ZXJ5dGhpbmdcIjogXCJhbGxlc1wiLFxyXG5cclxuICAgICAgICAgICAgXCJmYWNlXCI6IFwiR2VzaWNodFwiLCBcImZhbWlseVwiOiBcIkZhbWlsaWVcIiwgXCJmYXJcIjogXCJ3ZWl0XCIsIFwiZmFybVwiOiBcIkJhdWVybmhvZlwiLFxyXG4gICAgICAgICAgICBcImZhc3RcIjogXCJzY2huZWxsXCIsIFwiZmF0aGVyXCI6IFwiVmF0ZXJcIiwgXCJmZWV0XCI6IFwiRsO8w59lXCIsIFwiZmlnaHRcIjogXCJrw6RtcGZlblwiLFxyXG4gICAgICAgICAgICBcImZpcmVcIjogXCJGZXVlclwiLCBcImZpc2hcIjogXCJGaXNjaFwiLCBcImZsb29yXCI6IFwiQm9kZW5cIiwgXCJmbG93ZXJcIjogXCJCbHVtZVwiLFxyXG4gICAgICAgICAgICBcImZvb2RcIjogXCJFc3NlblwiLCBcImZvb3RcIjogXCJGdcOfXCIsIFwiZnJpZW5kXCI6IFwiRnJldW5kXCIsXHJcblxyXG4gICAgICAgICAgICBcImdhcmRlblwiOiBcIkdhcnRlblwiLCBcImdpcmxcIjogXCJNw6RkY2hlblwiLCBcImdsYXNzXCI6IFwiR2xhc1wiLCBcImdvXCI6IFwiZ2VoZW5cIixcclxuICAgICAgICAgICAgXCJnb29kXCI6IFwiZ3V0XCIsIFwiZ3JlZW5cIjogXCJncsO8blwiLCBcImdyb3VuZFwiOiBcIkJvZGVuXCIsIFwiZ3JvdXBcIjogXCJHcnVwcGVcIixcclxuXHJcbiAgICAgICAgICAgIFwiaGFpclwiOiBcIkhhYXJlXCIsIFwiaGFuZFwiOiBcIkhhbmRcIiwgXCJoYW5nXCI6IFwiaMOkbmdlblwiLCBcImhhcHB5XCI6IFwiZ2zDvGNrbGljaFwiLFxyXG4gICAgICAgICAgICBcImhhdFwiOiBcIkh1dFwiLCBcImhlYWRcIjogXCJLb3BmXCIsIFwiaGVhbHRoXCI6IFwiR2VzdW5kaGVpdFwiLCBcImhlYXJ0XCI6IFwiSGVyelwiLFxyXG4gICAgICAgICAgICBcImhlYXRcIjogXCJIaXR6ZVwiLCBcImhlYXZ5XCI6IFwic2Nod2VyXCIsIFwiaGVsbG9cIjogXCJoYWxsb1wiLCBcImhlcmVcIjogXCJoaWVyXCIsXHJcbiAgICAgICAgICAgIFwiaGlnaFwiOiBcImhvY2hcIiwgXCJob21lXCI6IFwiWnVoYXVzZVwiLCBcImhvcnNlXCI6IFwiUGZlcmRcIiwgXCJob3VzZVwiOiBcIkhhdXNcIixcclxuXHJcbiAgICAgICAgICAgIFwiaWNlXCI6IFwiRWlzXCIsIFwiaWRlYVwiOiBcIklkZWVcIiwgXCJpbGxcIjogXCJrcmFua1wiLCBcImltcG9ydGFudFwiOiBcIndpY2h0aWdcIixcclxuICAgICAgICAgICAgXCJpbnNpZGVcIjogXCJkcmlubmVuXCIsIFwiaXNsYW5kXCI6IFwiSW5zZWxcIixcclxuXHJcbiAgICAgICAgICAgIFwiam9iXCI6IFwiSm9iXCIsIFwianVpY2VcIjogXCJTYWZ0XCIsIFwianVtcFwiOiBcInNwcmluZ2VuXCIsXHJcblxyXG4gICAgICAgICAgICBcImtleVwiOiBcIlNjaGzDvHNzZWxcIiwgXCJraWxsXCI6IFwidMO2dGVuXCIsIFwia2luZ1wiOiBcIkvDtm5pZ1wiLCBcImtpdGNoZW5cIjogXCJLw7xjaGVcIixcclxuICAgICAgICAgICAgXCJraXNzXCI6IFwiS3Vzc1wiLCBcImtub3dcIjogXCJ3aXNzZW5cIixcclxuXHJcbiAgICAgICAgICAgIFwibGFrZVwiOiBcIlNlZVwiLCBcImxhbmRcIjogXCJMYW5kXCIsIFwibGFuZ3VhZ2VcIjogXCJTcHJhY2hlXCIsXHJcbiAgICAgICAgICAgIFwibGFyZ2VcIjogXCJncm/Dn1wiLCBcImxhdWdoXCI6IFwibGFjaGVuXCIsIFwibGVhcm5cIjogXCJsZXJuZW5cIixcclxuICAgICAgICAgICAgXCJsZWZ0XCI6IFwibGlua3NcIiwgXCJsZWdcIjogXCJCZWluXCIsIFwibGlmZVwiOiBcIkxlYmVuXCIsIFwibGlnaHRcIjogXCJMaWNodFwiLFxyXG4gICAgICAgICAgICBcImxpa2VcIjogXCJtw7ZnZW5cIiwgXCJsaW9uXCI6IFwiTMO2d2VcIiwgXCJsaXR0bGVcIjogXCJrbGVpblwiLCBcImxvbmdcIjogXCJsYW5nXCIsXHJcbiAgICAgICAgICAgIFwibG92ZVwiOiBcIkxpZWJlXCIsXHJcblxyXG4gICAgICAgICAgICBcIm1hY2hpbmVcIjogXCJNYXNjaGluZVwiLCBcIm1ha2VcIjogXCJtYWNoZW5cIiwgXCJtYW5cIjogXCJNYW5uXCIsIFwibWFueVwiOiBcInZpZWxlXCIsXHJcbiAgICAgICAgICAgIFwibWlsa1wiOiBcIk1pbGNoXCIsIFwibWludXRlXCI6IFwiTWludXRlXCIsIFwibW9uZXlcIjogXCJHZWxkXCIsXHJcbiAgICAgICAgICAgIFwibW9udGhcIjogXCJNb25hdFwiLCBcIm1vcm5pbmdcIjogXCJNb3JnZW5cIiwgXCJtb3RoZXJcIjogXCJNdXR0ZXJcIixcclxuICAgICAgICAgICAgXCJtb3VudGFpblwiOiBcIkJlcmdcIixcclxuXHJcbiAgICAgICAgICAgIFwibmFtZVwiOiBcIk5hbWVcIiwgXCJuYXRpb25cIjogXCJOYXRpb25cIiwgXCJuZWFyXCI6IFwibmFoXCIsIFwibmVja1wiOiBcIk5hY2tlblwiLFxyXG4gICAgICAgICAgICBcIm5pZ2h0XCI6IFwiTmFjaHRcIiwgXCJub2lzZVwiOiBcIkzDpHJtXCIsIFwibm9ydGhcIjogXCJOb3JkZW5cIixcclxuXHJcbiAgICAgICAgICAgIFwib2NlYW5cIjogXCJPemVhblwiLCBcIm9mZlwiOiBcImF1c1wiLCBcIm9mZmljZVwiOiBcIkLDvHJvXCIsIFwib2lsXCI6IFwiw5ZsXCIsXHJcbiAgICAgICAgICAgIFwib2xkXCI6IFwiYWx0XCIsIFwib3BlblwiOiBcIsO2ZmZuZW5cIiwgXCJvcmFuZ2VcIjogXCJPcmFuZ2VcIiwgXCJvcmRlclwiOiBcImJlc3RlbGxlblwiLFxyXG5cclxuICAgICAgICAgICAgXCJwYWdlXCI6IFwiU2VpdGVcIiwgXCJwYXBlclwiOiBcIlBhcGllclwiLCBcInBhcmVudFwiOiBcIkVsdGVyblwiLCBcInBhcmtcIjogXCJQYXJrXCIsXHJcbiAgICAgICAgICAgIFwicGFydHlcIjogXCJQYXJ0eVwiLCBcInBlblwiOiBcIlN0aWZ0XCIsIFwicGVvcGxlXCI6IFwiTWVuc2NoZW5cIiwgXCJwaG9uZVwiOiBcIlRlbGVmb25cIixcclxuICAgICAgICAgICAgXCJwaWN0dXJlXCI6IFwiQmlsZFwiLCBcInBsYWNlXCI6IFwiT3J0XCIsIFwicGxhbnRcIjogXCJQZmxhbnplXCIsIFwicGxheVwiOiBcInNwaWVsZW5cIixcclxuICAgICAgICAgICAgXCJwb2NrZXRcIjogXCJUYXNjaGVcIiwgXCJwb2xpY2VcIjogXCJQb2xpemVpXCIsIFwicG90YXRvXCI6IFwiS2FydG9mZmVsXCIsXHJcbiAgICAgICAgICAgIFwicHJvYmxlbVwiOiBcIlByb2JsZW1cIixcclxuXHJcbiAgICAgICAgICAgIFwicXVlZW5cIjogXCJLw7ZuaWdpblwiLCBcInF1ZXN0aW9uXCI6IFwiRnJhZ2VcIixcclxuXHJcbiAgICAgICAgICAgIFwicmFpblwiOiBcIlJlZ2VuXCIsIFwicmVzdGF1cmFudFwiOiBcIlJlc3RhdXJhbnRcIiwgXCJyZWRcIjogXCJyb3RcIixcclxuICAgICAgICAgICAgXCJyaWdodFwiOiBcInJlY2h0c1wiLCBcInJpdmVyXCI6IFwiRmx1c3NcIiwgXCJyb2FkXCI6IFwiU3RyYcOfZVwiLFxyXG4gICAgICAgICAgICBcInJvb21cIjogXCJaaW1tZXJcIiwgXCJydW5cIjogXCJyZW5uZW5cIixcclxuXHJcbiAgICAgICAgICAgIFwic2FsdFwiOiBcIlNhbHpcIiwgXCJzYW5kXCI6IFwiU2FuZFwiLCBcInNjaG9vbFwiOiBcIlNjaHVsZVwiLCBcInNlYVwiOiBcIk1lZXJcIixcclxuICAgICAgICAgICAgXCJzZWFzb25cIjogXCJKYWhyZXN6ZWl0XCIsIFwic2VlXCI6IFwic2VoZW5cIiwgXCJzaGlydFwiOiBcIkhlbWRcIixcclxuICAgICAgICAgICAgXCJzaG9lXCI6IFwiU2NodWhcIiwgXCJzaG9wXCI6IFwiTGFkZW5cIiwgXCJzaG9ydFwiOiBcImt1cnpcIiwgXCJzbGVlcFwiOiBcInNjaGxhZmVuXCIsXHJcbiAgICAgICAgICAgIFwic2xvd1wiOiBcImxhbmdzYW1cIiwgXCJzbWFsbFwiOiBcImtsZWluXCIsIFwic21pbGVcIjogXCJMw6RjaGVsblwiLCBcInNub3dcIjogXCJTY2huZWVcIixcclxuICAgICAgICAgICAgXCJzb25cIjogXCJTb2huXCIsIFwic291bmRcIjogXCJHZXLDpHVzY2hcIiwgXCJzb3VwXCI6IFwiU3VwcGVcIiwgXCJzcG9ydFwiOiBcIlNwb3J0XCIsXHJcbiAgICAgICAgICAgIFwic3ByaW5nXCI6IFwiRnLDvGhsaW5nXCIsIFwic3RhclwiOiBcIlN0ZXJuXCIsIFwic3RvbmVcIjogXCJTdGVpblwiLCBcInN0cmVldFwiOiBcIlN0cmHDn2VcIixcclxuICAgICAgICAgICAgXCJzdHJvbmdcIjogXCJzdGFya1wiLCBcInN1bW1lclwiOiBcIlNvbW1lclwiLCBcInN1blwiOiBcIlNvbm5lXCIsIFwic3dlZXRcIjogXCJzw7zDn1wiLFxyXG5cclxuICAgICAgICAgICAgXCJ0YWJsZVwiOiBcIlRpc2NoXCIsIFwidGVhY2hlclwiOiBcIkxlaHJlclwiLCBcInRlYVwiOiBcIlRlZVwiLCBcInRlYW1cIjogXCJUZWFtXCIsXHJcbiAgICAgICAgICAgIFwidGVuXCI6IFwiemVoblwiLCBcInRlc3RcIjogXCJUZXN0XCIsIFwidGhpbmdcIjogXCJEaW5nXCIsIFwidGhvdWdodFwiOiBcIkdlZGFua2VcIixcclxuICAgICAgICAgICAgXCJ0aW1lXCI6IFwiWmVpdFwiLCBcInRpcmVkXCI6IFwibcO8ZGVcIiwgXCJ0b21vcnJvd1wiOiBcIm1vcmdlblwiLCBcInRvd25cIjogXCJTdGFkdFwiLFxyXG4gICAgICAgICAgICBcInRyZWVcIjogXCJCYXVtXCIsIFwidHJhaW5cIjogXCJadWdcIiwgXCJ0cmF2ZWxcIjogXCJyZWlzZW5cIixcclxuXHJcbiAgICAgICAgICAgIFwidW5kZXJcIjogXCJ1bnRlclwiLCBcInVuY2xlXCI6IFwiT25rZWxcIiwgXCJ1cFwiOiBcImhvY2hcIiwgXCJ1c2VcIjogXCJiZW51dHplblwiLFxyXG5cclxuICAgICAgICAgICAgXCJ2aWxsYWdlXCI6IFwiRG9yZlwiLCBcInZvaWNlXCI6IFwiU3RpbW1lXCIsXHJcblxyXG4gICAgICAgICAgICBcIndhbGtcIjogXCJnZWhlblwiLCBcIndhcm1cIjogXCJ3YXJtXCIsIFwid2F0ZXJcIjogXCJXYXNzZXJcIiwgXCJ3YXlcIjogXCJXZWdcIixcclxuICAgICAgICAgICAgXCJ3ZWVrXCI6IFwiV29jaGVcIiwgXCJ3ZWxjb21lXCI6IFwid2lsbGtvbW1lblwiLCBcIndoaXRlXCI6IFwid2Vpw59cIixcclxuICAgICAgICAgICAgXCJ3aW5kb3dcIjogXCJGZW5zdGVyXCIsIFwid2luZFwiOiBcIldpbmRcIiwgXCJ3aW50ZXJcIjogXCJXaW50ZXJcIixcclxuICAgICAgICAgICAgXCJ3b21hblwiOiBcIkZyYXVcIiwgXCJ3b3JkXCI6IFwiV29ydFwiLCBcIndvcmtcIjogXCJBcmJlaXRcIiwgXCJ3b3JsZFwiOiBcIldlbHRcIixcclxuICAgICAgICAgICAgXCJ3cml0ZVwiOiBcInNjaHJlaWJlblwiLFxyXG5cclxuICAgICAgICAgICAgXCJ5ZWFyXCI6IFwiSmFoclwiLCBcInllbGxvd1wiOiBcImdlbGJcIiwgXCJ5b3VuZ1wiOiBcImp1bmdcIixcclxuXHJcbiAgICAgICAgICAgIFwiem9vXCI6IFwiWm9vXCJcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHRyYW5zbGF0ZShlbmdsaXNoV29yZCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnRyYW5zbGF0aW9uc1tlbmdsaXNoV29yZC50b0xvd2VyQ2FzZSgpXSA/PyBudWxsO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEVuZ2xpc2hHZXJtYW5EaWN0aW9uYXJ5O1xyXG4iLCJcInVzZSBzdHJpY3RcIlxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBFbGVtZW50IHtcclxuXHJcbiAgICBoYXNDb2xsaWRlZCA9IGZhbHNlXHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5pbnN0YW5jZUlkID0gLTFcclxuICAgIH1cclxuXHJcbiAgICBhY3Rpb24oKSB7IH1cclxuXHJcbiAgICBkcmF3KGN0eCkgeyB9XHJcblxyXG4gICAgY2hlY2tDb2xsaXNpb24oKSB7IH1cclxuXHJcbiAgICBvbkNvbGxpc2lvbigpIHsgfVxyXG5cclxuICAgIHNldElkKGlkKSB7XHJcbiAgICAgICAgdGhpcy5pbnN0YW5jZUlkID0gaWRcclxuICAgIH1cclxufSIsIlwidXNlIHN0cmljdFwiXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIEVsZW1lbnRMaXN0IGV4dGVuZHMgQXJyYXkge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKClcclxuICAgIH1cclxuXHJcbiAgICBhZGQoZWxlbWVudCkge1xyXG4gICAgICAgIHRoaXMucHVzaChlbGVtZW50KVxyXG4gICAgICAgIGVsZW1lbnQuc2V0SWQodGhpcy5sZW5ndGggLSAxKSBcclxuICAgIH1cclxuXHJcbiAgICBnZXQoaSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzW2ldXHJcbiAgICB9XHJcblxyXG4gICAgZGVsZXRlKGkpIHtcclxuICAgICAgICAvL3RoaXMuc3BsaWNlKGksIDEpXHJcbiAgICAgICAgdGhpc1tpXSA9IG51bGxcclxuICAgICAgICAvL8OEbmRlcnVuZyB2b24gQnJpYW5cclxuICAgICAgIFxyXG5cclxuICAgIH1cclxuXHJcbiAgICBkcmF3KGN0eCkge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZih0aGlzW2ldICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXNbaV0uZHJhdyhjdHgpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgXHJcbiAgICBhY3Rpb24oKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IHRoaXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHsgICAgXHJcbiAgICAgICAgICAgIGlmKHRoaXNbaV0gIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdGhpc1tpXS5hY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAgLy8gTkVVOiBCdWxsZXQgdW5kIFdvcmQgY2xlYW51cFxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXNbaV0uaGFzQ29sbGlkZWQgfHwgdGhpc1tpXS5kZXN0cm95ZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNwbGljZShpLCAxKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNoZWNrQ29sbGlzaW9uKCkgeyBcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYodGhpc1tpXSAhPSBudWxsICYmICF0aGlzW2ldLmhhc0NvbGxpZGVkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzW2ldLmNoZWNrQ29sbGlzaW9uKClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJcInVzZSBzdHJpY3RcIlxyXG5cclxuY29uc3QgQnVsbGV0ID0gcmVxdWlyZSgnLi9idWxsZXQnKVxyXG5jb25zdCBSYW5kb21XYWxrQ2lyY2xlRWxlbWVudCA9IHJlcXVpcmUoJy4vcmFuZG9td2Fsa2NpcmNsZWVsZW1lbnQnKVxyXG5jb25zdCBFbGVtZW50TGlzdCA9IHJlcXVpcmUoJy4vZWxlbWVudGxpc3QnKVxyXG5jb25zdCBTdGFnZSA9IHJlcXVpcmUoJy4vc3RhZ2UnKVxyXG5jb25zdCBCdXJzdCA9IHJlcXVpcmUoJy4vYnVyc3QnKVxyXG5jb25zdCBXb3JkID0gcmVxdWlyZShcIi4vd29yZFwiKVxyXG5jb25zdCBWYWxpZGF0b3IgPSByZXF1aXJlKCcuL3ZhbGlkYXRvcicpXHJcbmNvbnN0IFdvcmRJbnB1dEhhbmRsZXIgPSByZXF1aXJlKCcuL3dvcmRpbnB1dGhhbmRsZXInKVxyXG5jb25zdCBIZWFsdGggPSByZXF1aXJlKFwiLi9oZWFsdGhcIilcclxuY29uc3QgU3Bhd25lckJvc3MgPSByZXF1aXJlKFwiLi9zcGF3bmVyYm9zc1wiKVxyXG5jb25zdCBSZWdlbmVyYXRlQm9zcyA9IHJlcXVpcmUoXCIuL3JlZ2VuZXJhdGVCb3NzXCIpXHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBHYW1lIHtcclxuXHJcbiAgICBpbnRlcnZhbElkID0gMFxyXG4gICAgY29tZXRlc0NvdW50ID0gMFxyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMucmFmICAgICAgICAgICAgICAgICAgICAgICAvLyByZXF1ZXN0IGFuaW1hdGlvbiBmcmFtZSBoYW5kbGVcclxuICAgICAgICB0aGlzLmVsZW1lbnRMaXN0ID0gbnVsbFxyXG4gICAgICAgIHRoaXMuaGVhbHRoID0gbmV3IEhlYWx0aCgpO1xyXG5cclxuICAgICAgICB0aGlzLnNjb3JlID0gMCBcclxuICAgICAgICB0aGlzLmN1cnJlbnRJbnB1dCA9ICcnXHJcbiAgICAgICAgLy8gw4RuZGVydW5nZW4gdm9uIEJyaWFuXHJcbiAgICAgICAgdGhpcy52YWxpZGF0b3IgPSBuZXcgVmFsaWRhdG9yKCk7XHJcbiAgICAgICAgdGhpcy53b3JkSW5wdXRoYW5kZXIgPSBuZXcgV29yZElucHV0SGFuZGxlcigpO1xyXG4gICAgICAgIHRoaXMuYWN0aXZlV29yZEVsZW1lbnQgPSBudWxsO1xyXG4gICAgICAgIHRoaXMud29yZElucHV0aGFuZGVyLnNldExldHRlckNhbGxiYWNrKHRoaXMuaGFuZGxlTGV0dGVySW5wdXQuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5pc0lucHV0U2V0ID0gZmFsc2VcclxuICAgICAgICB0aGlzLmlzUGF1c2VkID0gZmFsc2VcclxuICAgICAgICB0aGlzLmxhc3RCb3NzU2NvcmUgPSAwXHJcbiAgICAgICAgdGhpcy5ib3NzQWN0aXZlID0gZmFsc2U7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAgIHN0YXJ0KCkge1xyXG4gICAgICAgIHRoaXMuZWxlbWVudExpc3QgPSBuZXcgRWxlbWVudExpc3QoKVxyXG4gICAgICAgIGlmKCF0aGlzLmlzSW5wdXRTZXQpIHtcclxuICAgICAgICAgICAgdGhpcy5pc0lucHV0U2V0ID0gdHJ1ZVxyXG4gICAgICAgICAgICB0aGlzLnNldHVwSW5wdXQoKVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmVsZW1lbnRMaXN0LmFkZChuZXcgU3RhZ2UoKSk7ICBcclxuICAgICAgICB0aGlzLmVsZW1lbnRMaXN0LmFkZCh0aGlzLmhlYWx0aCk7XHJcbiAgICBcclxuICAgICAgICAvKmZvciAobGV0IGkgPSAwOyBpIDwgNjA7IGkrKykge1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMuZWxlbWVudExpc3QgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudExpc3QuYWRkKG5ldyBSYW5kb21XYWxrQ2lyY2xlRWxlbWVudCh0aGlzKSk7XHJcbiAgICAgICAgICAgICAgICB9IFxyXG4gICAgICAgICAgICB9LCAzMDAwICogaSk7XHJcbiAgICAgICAgfSovXHJcbiAgICAgICAgdGhpcy5nZW5lcmF0ZUNvbWV0ZXMoKTtcclxuXHJcbiAgICAgICAgdGhpcy5lbGVtZW50TGlzdC5hZGQobmV3IFN0YWdlKCkpXHJcblxyXG4gICAgICAgIHRoaXMudGltZU9mTGFzdEZyYW1lID0gRGF0ZS5ub3coKVxyXG4gICAgICAgIHRoaXMucmFmID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnRpY2suYmluZCh0aGlzKSlcclxuICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgZ2VuZXJhdGVDb21ldGVzKCkge1xyXG4gICAgICAgIHRoaXMuZWxlbWVudExpc3QuYWRkKG5ldyBSYW5kb21XYWxrQ2lyY2xlRWxlbWVudCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5pbnRlcnZhbElkID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgICAgICBpZih0aGlzLmVsZW1lbnRMaXN0ICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudExpc3QuYWRkKG5ldyBSYW5kb21XYWxrQ2lyY2xlRWxlbWVudCh0aGlzKSk7XHJcbiAgICAgICAgICAgIH0gXHJcbiAgICAgICAgICAgIHRoaXMuY29tZXRlc0NvdW50Kys7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNvbWV0ZXNDb3VudCA+PSAxMCkge1xyXG4gICAgICAgICAgICAgICAgc3RvcExvb3AoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sIDMwMDApO1xyXG4gICAgfVxyXG5cclxuICAgIHN0b3BHZW5lcmF0aW5nQ29tZXRlcygpIHtcclxuICAgICAgICBjbGVhckludGVydmFsKHRoaXMuaW50ZXJ2YWxJZCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJMb29wIHN0b3BwZWQuXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0b3AoKSB7XHJcbiAgICAgICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMucmFmKVxyXG4gICAgICAgIHRoaXMuZWxlbWVudExpc3QgPSBudWxsXHJcbiAgICB9XHJcblxyXG4gICAgcGF1c2UoKSB7XHJcbiAgICAgICAgdGhpcy5pc1BhdXNlZCA9IHRydWVcclxuICAgICAgICB0aGlzLnN0b3BHZW5lcmF0aW5nQ29tZXRlcygpXHJcblxyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWFpbi1tZW51XCIpLnN0eWxlLmRpc3BsYXkgPSBcImZsZXhcIlxyXG5cclxuICAgICAgICBjb25zdCBzdGFydEJ1dHRvbiA9IHdpbmRvdy5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN0YXJ0LWJ1dHRvblwiKSBcclxuICAgICAgICBzdGFydEJ1dHRvbi50ZXh0Q29udGVudCA9IFwiQ29udGludWVcIlxyXG4gICAgICAgIHN0YXJ0QnV0dG9uLm9uY2xpY2sgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWFpbi1tZW51XCIpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIlxyXG4gICAgICAgICAgICB0aGlzLmNvbnRpbnVlKClcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29udGludWUoKSB7XHJcbiAgICAgICAgdGhpcy5pc1BhdXNlZCA9IGZhbHNlXHJcbiAgICAgICAgdGhpcy5nZW5lcmF0ZUNvbWV0ZXMoKVxyXG4gICAgfVxyXG5cclxuICAgIC8vIG1lbsO8IG5hY2ggdG9kIGVpbmJsaW5kZW4gXHJcbiAgICBnYW1lT3ZlcigpIHtcclxuICAgICAgICB0aGlzLnN0b3AoKTtcclxuICAgICAgICB0aGlzLnN0b3BHZW5lcmF0aW5nQ29tZXRlcygpXHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtYWluLW1lbnVcIikuc3R5bGUuZGlzcGxheSA9IFwiZmxleFwiOyAgICAvLyBNZW7DvCB6ZWlnZW4gXHJcbiAgICAgICAgdGhpcy5oZWFsdGggPSBuZXcgSGVhbHRoKCk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbGViZW4gd2llZGVyIHp1csO8Y2sgc2V0emVuIFxyXG4gICAgICAgIHRoaXMuc2NvcmUgPSAwO1xyXG5cclxuICAgICAgICBjb25zdCBzdGFydEJ1dHRvbiA9IHdpbmRvdy5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN0YXJ0LWJ1dHRvblwiKSBcclxuICAgICAgICBzdGFydEJ1dHRvbi50ZXh0Q29udGVudCA9IFwiUmVzdGFydFwiXHJcbiAgICAgICAgc3RhcnRCdXR0b24ub25jbGljayA9ICgpID0+IHtcclxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtYWluLW1lbnVcIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiIC8vIHZlcnN0ZWNrdCBkYXMgbWFpbiBtZW7DvCBcclxuICAgICAgICAgICAgdGhpcy5zdGFydCgpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gICAgdGljaygpIHtcclxuICAgICAgICBsZXQgbXljYW52YXMgPSB3aW5kb3cuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJteWNhbnZhc1wiKVxyXG4gICAgICAgIGxldCBjdHggPSBteWNhbnZhcy5nZXRDb250ZXh0KCcyZCcpXHJcbiAgICAgICAgY3R4LmZvbnQgPSBcIjE4cHggQXJpYWxcIjtcclxuXHJcbiAgICAgICAgLy8tLS0gY2xlYXIgc2NyZWVuXHJcbiAgICAgICAgLy9jdHguZmlsbFN0eWxlID0gJ3JnYmEoMjM1LCAyNTAsIDI1NSwgMC4xKScgLy8gYWxwaGEgPCAxIGzDtnNjaHQgZGVuIEJpbGRzY2hyaW0gbnVyIHRlaWx3ZWlzZSAtPiBiZXdlZ3RlIEdlZ2Vuc3TDpG5kZSBlcnpldWdlbiBTcHVyZW5cclxuICAgICAgICAvL2N0eC5maWxsUmVjdCgwLCAwLCBteWNhbnZhcy5jbGllbnRXaWR0aCwgbXljYW52YXMuY2xpZW50SGVpZ2h0KVxyXG5cclxuICAgICAgICBpZighZG9jdW1lbnQuaGFzRm9jdXMoKSkge1xyXG4gICAgICAgICAgICB0aGlzLnBhdXNlKClcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLS0tIGRyYXcgZWxlbWVudHNcclxuICAgICAgICB0aGlzLmVsZW1lbnRMaXN0LmRyYXcoY3R4KVxyXG5cclxuICAgICAgICBpZighdGhpcy5pc1BhdXNlZCkge1xyXG4gICAgICAgICAgICAvLy0tLSBleGVjdXRlIGVsZW1lblN0IGFjdGlvbnNcclxuICAgICAgICAgICAgdGhpcy5lbGVtZW50TGlzdC5hY3Rpb24oKVxyXG5cclxuICAgICAgICAgICAgLy8tLS0gY2hlY2sgZWxlbWVudCBjb2xsaXNpb25zXHJcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudExpc3QuY2hlY2tDb2xsaXNpb24oKVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnNwYXduQm9zcygpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIFNwaWVsZXIgdG9kID8gXHJcbiAgICAgICAgaWYgKHRoaXMuaGVhbHRoLmlzRGVhZCgpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZ2FtZU92ZXIoKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGVVSSgpXHJcblxyXG4gICAgICAgIHRoaXMucmFmID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnRpY2suYmluZCh0aGlzKSlcclxuXHJcbiAgICB9XHJcbiAgICBcclxuICAgIFxyXG4gICAgXHJcblxyXG5cclxuICAgIGlzV29yZE9uRGlzcGxheSh3b3JkKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmVsZW1lbnRMaXN0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuZWxlbWVudExpc3RbaV0gIT0gbnVsbCAmJiB0aGlzLmVsZW1lbnRMaXN0W2ldIGluc3RhbmNlb2YgV29yZCAmJiB0aGlzLmVsZW1lbnRMaXN0W2ldLndvcmQuY2hhckF0KDApID09IHdvcmQuY2hhckF0KDApICkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgIH1cclxuICAgIFxyXG4gICAgc2V0dXBJbnB1dCgpIHtcclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGUpID0+IHtcclxuLy8gICAgICAgICAgICBpZiAoZS5rZXkgPT09ICdFbnRlcicpIHRoaXMuc2hvb3RUb0NpcmNsZSgpXHJcbiAgICAgICAgICAgIC8qZWxzZSovIGlmIChlLmtleSA9PT0gJ0JhY2tzcGFjZScpIHRoaXMuY3VycmVudElucHV0ID0gdGhpcy5jdXJyZW50SW5wdXQuc2xpY2UoMCwgLTEpXHJcbi8vICAgICAgICAgICAgZWxzZSBpZiAoL1thLXpBLVpdLy50ZXN0KGUua2V5KSkgdGhpcy5jdXJyZW50SW5wdXQgKz0gZS5rZXkudG9Mb3dlckNhc2UoKVxyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVVJKClcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIHNob290VG9DaXJjbGUoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmN1cnJlbnRJbnB1dCkgcmV0dXJuO1xyXG4gICAgXHJcbiAgICAgICAgLy8gRmluZGUgZGFzIFdPUlQgaW4gZGVyIGVsZW1lbnRMaXN0XHJcbiAgICAgICAgaWYodGhpcy5lbGVtZW50TGlzdCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldFdvcmQgPSB0aGlzLmVsZW1lbnRMaXN0LmZpbmQoZWwgPT4gXHJcbiAgICAgICAgICAgICAgICBlbCBpbnN0YW5jZW9mIFdvcmQgJiYgIWVsLmhhc0NvbGxpZGVkICYmIGVsLndvcmQgPT09IHRoaXMuZ2V0Q3VycmVudFdvcmQoKVxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgfVxyXG4gICAgXHJcbiAgICAgICAgICAgIGlmICghdGFyZ2V0V29yZCkgcmV0dXJuXHJcbiAgICBcclxuICAgICAgICAvLyBEaWUgQnVsbGV0IGZsaWVndCB6dW0gQ0lSQ0xFLUVMRU1FTlQgKG5pY2h0IHp1bSBXb3J0KVxyXG4gICAgICAgIC8vIHRhcmdldFdvcmQuY2lyY2xlSWQgaXN0IGRpZSBpbnN0YW5jZUlkIGRlcyBLcmVpc2VzXHJcbiAgICAgICAgdGhpcy5lbGVtZW50TGlzdC5hZGQobmV3IEJ1bGxldChcclxuICAgICAgICAgICAgdGFyZ2V0V29yZC54LCAgICAgICAgICAgLy8gWklFTCBYIGRlcyBLcmVpc2VzXHJcbiAgICAgICAgICAgIHRhcmdldFdvcmQueSwgICAgICAgICAgIC8vIFpJRUwgWSBkZXMgS3JlaXNlc1xyXG4gICAgICAgICAgICB0YXJnZXRXb3JkLmNpcmNsZUlkLCAgICAvLyBUYXJnZXQgaXN0IGRlciBLUkVJU1xyXG4gICAgICAgICAgICB0aGlzXHJcbiAgICAgICAgKSlcclxuICAgICAgICB0aGlzLmN1cnJlbnRJbnB1dCA9ICcnXHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Q3VycmVudFdvcmQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudElucHV0XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlVUkoKSB7XHJcbiAgICAgICAgY29uc3QgZWwgPSBpZCA9PiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZClcclxuICAgICAgICBpZiAoZWwoJ2N1cnJlbnQtaW5wdXQnKSkgZWwoJ2N1cnJlbnQtaW5wdXQnKS50ZXh0Q29udGVudCA9IHRoaXMuZ2V0Q3VycmVudFdvcmQoKVxyXG4gICAgICAgIGlmIChlbCgnc2NvcmUnKSkgZWwoJ3Njb3JlJykudGV4dENvbnRlbnQgPSB0aGlzLnNjb3JlXHJcbiAgICB9XHJcbiAgICBcclxuXHJcbmhhbmRsZUxldHRlcklucHV0KGxldHRlcikge1xyXG4gICAgLy8gV2VubiBrZWluIFdvcnQgYWt0aXYgaXN0LCBzdWNoZSBlaW4gbmV1ZXNcclxuICAgIGlmICghdGhpcy5hY3RpdmVXb3JkRWxlbWVudCkge1xyXG4gICAgICAgIHRoaXMuZmluZE5ld1dvcmQobGV0dGVyKTtcclxuICAgIH0gXHJcbiAgICAvLyBXZW5uIFdvcnQgYWt0aXYgaXN0LCB0aXBwZSB3ZWl0ZXJcclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHRoaXMuY29udGludWVUeXBpbmdXb3JkKGxldHRlcik7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vIFN1Y2h0IGVpbiBuZXVlcyBXb3J0IGJhc2llcmVuZCBhdWYgZXJzdGVtIEJ1Y2hzdGFiZW5cclxuZmluZE5ld1dvcmQoZmlyc3RMZXR0ZXIpIHtcclxuICAgIFxyXG4gICAgY29uc3QgYWN0aXZlV29yZHMgPSBbXTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5lbGVtZW50TGlzdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGNvbnN0IGVsID0gdGhpcy5lbGVtZW50TGlzdFtpXTtcclxuICAgICAgICBpZiAoZWwgaW5zdGFuY2VvZiBXb3JkICYmICFlbC5oYXNDb2xsaWRlZCkge1xyXG4gICAgICAgICAgICBhY3RpdmVXb3Jkcy5wdXNoKGVsKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8vIEZpbmRlIGRhcyBFUlNURSBXb3J0IGRhcyBtaXQgZGVtIEJ1Y2hzdGFiZW4gYmVnaW5udFxyXG4gICAgY29uc3QgbWF0Y2hpbmdXb3JkID0gYWN0aXZlV29yZHMuZmluZCh3b3JkID0+IFxyXG4gICAgICAgIC8vd29yZC53b3JkLnRvTG93ZXJDYXNlKCkuc3RhcnRzV2l0aChmaXJzdExldHRlcilcclxuICAgICAgICB3b3JkLndvcmQuc3RhcnRzV2l0aChmaXJzdExldHRlcilcclxuICAgICk7XHJcbiAgICBcclxuICAgIGlmIChtYXRjaGluZ1dvcmQpIHtcclxuICAgICAgICB0aGlzLmFjdGl2ZVdvcmRFbGVtZW50ID0gbWF0Y2hpbmdXb3JkO1xyXG4gICAgICAgIHRoaXMuY3VycmVudElucHV0ID0gZmlyc3RMZXR0ZXI7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcbn1cclxuXHJcbiAgICAvLyBUaXBwZSBhbSBha3RpdmVuIFdvcnQgd2VpdGVyXHJcbiAgICBjb250aW51ZVR5cGluZ1dvcmQobGV0dGVyKSB7XHJcbiAgICAgICAgLy9jb25zdCBleHBlY3RlZE5leHRMZXR0ZXIgPSB0aGlzLmFjdGl2ZVdvcmRFbGVtZW50LndvcmQudG9Mb3dlckNhc2UoKVt0aGlzLmN1cnJlbnRJbnB1dC5sZW5ndGhdO1xyXG4gICAgICAgIGNvbnN0IGV4cGVjdGVkTmV4dExldHRlciA9IHRoaXMuYWN0aXZlV29yZEVsZW1lbnQud29yZFt0aGlzLmN1cnJlbnRJbnB1dC5sZW5ndGhdO1xyXG4gICAgXHJcbiAgICAgICAgLy8gUHLDvGZlIG9iIGRlciBCdWNoc3RhYmUga29ycmVrdCBpc3RcclxuICAgICAgICBpZiAobGV0dGVyID09PSBleHBlY3RlZE5leHRMZXR0ZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50SW5wdXQgKz0gbGV0dGVyO1xyXG4gICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAvLyBQcsO8ZmUgb2IgV29ydCB2b2xsc3TDpG5kaWdcclxuICAgICAgICAgICAgLy9pZiAodGhpcy5jdXJyZW50SW5wdXQgPT09IHRoaXMuYWN0aXZlV29yZEVsZW1lbnQud29yZC50b0xvd2VyQ2FzZSgpKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRJbnB1dCA9PT0gdGhpcy5hY3RpdmVXb3JkRWxlbWVudC53b3JkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uV29yZENvbXBsZXRlZCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBGYWxzY2hlciBCdWNoc3RhYmUgLSBSZXNldFxyXG4gICAgICAgICAgICAgICAgdGhpcy5yZXNldEFjdGl2ZVdvcmQoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8vIFdvcnQgZXJmb2xncmVpY2ggYWJnZXRpcHB0XHJcbiAgICBvbldvcmRDb21wbGV0ZWQoKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gS3VnZWwgYXVmIGRlbiBLcmVpcyBzY2hpZcOfZW5cclxuICAgICAgICBjb25zdCB0YXJnZXRDaXJjbGUgPSB0aGlzLmVsZW1lbnRMaXN0LmdldCh0aGlzLmFjdGl2ZVdvcmRFbGVtZW50LmNpcmNsZUlkKTtcclxuICAgICAgICBpZiAodGFyZ2V0Q2lyY2xlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2NvcmUrKztcclxuICAgICAgICAgICAgdGhpcy5lbGVtZW50TGlzdC5hZGQobmV3IEJ1bGxldChcclxuICAgICAgICAgICAgICAgIHRhcmdldENpcmNsZS54LFxyXG4gICAgICAgICAgICAgICAgdGFyZ2V0Q2lyY2xlLnksXHJcbiAgICAgICAgICAgICAgICB0aGlzLmFjdGl2ZVdvcmRFbGVtZW50LmNpcmNsZUlkLHRoaXMpKTtcclxuICAgICAgICB9XHJcbiAgICBcclxuICAgICAgICB0aGlzLnJlc2V0QWN0aXZlV29yZCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEFrdGl2ZXMgV29ydCB6dXLDvGNrc2V0emVuXHJcbiAgICByZXNldEFjdGl2ZVdvcmQoKSB7XHJcbiAgICB0aGlzLmFjdGl2ZVdvcmRFbGVtZW50ID0gbnVsbDtcclxuICAgIHRoaXMuY3VycmVudElucHV0ID0gJyc7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUHLDvGZlIGluIGplZGVtIEZyYW1lIG9iIGFrdGl2ZXMgV29ydCBub2NoIGV4aXN0aWVydFxyXG5jaGVja0FjdGl2ZVdvcmRWYWxpZGl0eSgpIHtcclxuICAgIGlmICh0aGlzLmFjdGl2ZVdvcmRFbGVtZW50KSB7XHJcbiAgICAgICAgbGV0IHdvcmRTdGlsbEV4aXN0cyA9IGZhbHNlO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIER1cmNoc3VjaGUgZGllIEVsZW1lbnRMaXN0IG1hbnVlbGxcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZWxlbWVudExpc3QubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgZWwgPSB0aGlzLmVsZW1lbnRMaXN0W2ldO1xyXG4gICAgICAgICAgICBpZiAoZWwgPT09IHRoaXMuYWN0aXZlV29yZEVsZW1lbnQgJiYgIWVsLmhhc0NvbGxpZGVkKSB7XHJcbiAgICAgICAgICAgICAgICB3b3JkU3RpbGxFeGlzdHMgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKCF3b3JkU3RpbGxFeGlzdHMpIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMucmVzZXRBY3RpdmVXb3JkKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbnNwYXduQm9zcygpIHtcclxuICAgIGlmKHRoaXMuYm9zc0FjdGl2ZSl7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgaWYodGhpcy5zY29yZSA+IDAgJiYgdGhpcy5zY29yZSAlIDIgPT09IDAgJiYgdGhpcy5zY29yZSAhPT0gdGhpcy5sYXN0Qm9zc1Njb3JlKSB7XHJcbiAgICAgICAgdGhpcy5sYXN0Qm9zc1Njb3JlID0gdGhpcy5zY29yZTtcclxuICAgICAgICB0aGlzLmJvc3NBY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgIC8vdGhpcy5lbGVtZW50TGlzdC5hZGQobmV3IFNwYXduZXJCb3NzKHRoaXMpKTtcclxuICAgICAgICB0aGlzLmVsZW1lbnRMaXN0LmFkZChuZXcgUmVnZW5lcmF0ZUJvc3ModGhpcykpO1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG4gICAgXHJcbn1cclxuXHJcblxyXG5cclxufVxyXG4iLCJcInVzZSBzdHJpY3RcIlxyXG5cclxuY29uc3QgRWxlbWVudCA9IHJlcXVpcmUoJy4vZWxlbWVudCcpXHJcbi8vY29uc3QgcmFuZG9td2Fsa2NpcmNsZWVsZW1lbnQgPSByZXF1aXJlKCcuL3JhbmRvbXdhbGtjaXJjbGVlbGVtZW50JylcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgSGVhbHRoIGV4dGVuZHMgRWxlbWVudCB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7ICBcclxuICAgICAgICBzdXBlcigpICAgICAgICAgICAgXHJcbiAgICAgICAgdGhpcy5oZWFsdGggPSAzO1xyXG4gICAgICAgIHRoaXMuaGVhcnQgPSBuZXcgSW1hZ2UoKTtcclxuICAgICAgICB0aGlzLmhlYXJ0LnNyYyA9ICdpbWcvaGVhcnQucG5nJztcclxuXHJcbiAgICAgICAgdGhpcy5sb2FkZWQgPSBmYWxzZTsgXHJcbiAgICAgICAgdGhpcy5oZWFydC5vbmxvYWQgPSAoKSA9PiB7ICAgICAgICAgICAgICAgICAgICAvL2xhZGV0IGRhcyBiaWxkIGhlYXJ0XHJcbiAgICAgICAgICAgIHRoaXMubG9hZGVkID0gdHJ1ZTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgXHJcblxyXG4gICAgZHJhdyhjdHgpe1xyXG4gICAgICAgIGlmICghdGhpcy5sb2FkZWQpIHJldHVybjsgICAgICAgICAgICAgICAgICAgICAgICAgIC8vd2VubiBkYXMgYmlsZCBnZWxhZGVuIGlzdCBzb2xsdGUgZXMgZGllIGhlcnplbiB6ZWljaG5lblxyXG4gICAgICAgIFxyXG4gICAgICAgIGlmICh0aGlzLmhlYWx0aCA+PSAxKSB7XHJcbiAgICAgICAgICAgIGN0eC5kcmF3SW1hZ2UodGhpcy5oZWFydCwgMTAsMzAsMjUsMjUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5oZWFsdGggPj0gMikge1xyXG4gICAgICAgICAgICBjdHguZHJhd0ltYWdlKHRoaXMuaGVhcnQsIDQwLDMwLDI1LDI1KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuaGVhbHRoID49IDMpIHtcclxuICAgICAgICAgICAgY3R4LmRyYXdJbWFnZSh0aGlzLmhlYXJ0LCA3MCwzMCwyNSwyNSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgcmVkdWNlKCl7XHJcbiAgICAgICB0aGlzLmhlYWx0aC0tO1xyXG4gICAgfVxyXG4gICAgaXNEZWFkKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuaGVhbHRoIDw9IDA7XHJcbn1cclxuXHJcbiAgICAvKlxyXG4gICAgICBcclxuICAgIHVwZGF0ZSgpIHsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIMOcYmVycHLDvGZ0IGRlbiBmcmFtZSBvYiBoYXNDb2xsaWRlZCA9IHRydWUgXHJcbiAgICAgICAgaWYgKHRoaXMucmFuZG9td2Fsa2NpcmNsZWVsZW1lbnQuaGFzQ29sbGlkZWQpIHsgICAgICAgICBcclxuICAgICAgICAgICAgdGhpcy5oZWFsdGgtLTtcclxuICAgICAgICAgICAgdGhpcy5yYW5kb21XYWxrQ2lyY2xlRWxlbWVudC5oYXNDb2xsaWRlZCA9IGZhbHNlOyAgLy8gc2V0enQgY29sbGlkZWQgYXVmIGZhbHNlIHNvIGRhc3MgbnVyIGVpbmUgaGVyeiBwcm8gY29sbGlzaW9uIGFiZ2V6b2dlbiB3aXJkIFxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgICAgICAgKi8gXHJcbn0iLCJcInVzZSBzdHJpY3RcIlxyXG4gXHJcbmNvbnN0IEdhbWUgPSByZXF1aXJlKFwiLi9nYW1lXCIpXHJcbmxldCBteUdhbWUgPSBuZXcgR2FtZSgpXHJcblxyXG4vLyBjYW52YXNcclxud2luZG93Lm9ubG9hZCA9ICgpID0+IHtcclxuICAgIGNvbnN0IG1vZGVFbmdsaXNoQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtb2RlLWVuZ2xpc2hcIik7XHJcbiAgICBjb25zdCBtb2RlR2VybWFuQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtb2RlLWdlcm1hblwiKTtcclxuICAgIGNvbnN0IHN0YXJ0QnV0dG9uID0gd2luZG93LmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3RhcnQtYnV0dG9uXCIpO1xyXG4gICAgXHJcbiAgICAvLyBlbmdsaXNoXHJcbiAgICBtb2RlRW5nbGlzaEJ1dHRvbi5vbmNsaWNrID0gKCkgPT4ge1xyXG4gICAgICAgIG15R2FtZS5nYW1lTW9kZSA9ICdlbmdsaXNoJztcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1haW4tbWVudVwiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgICAgbXlHYW1lLnN0YXJ0KCk7XHJcbiAgICB9O1xyXG4gICAgXHJcbiAgICAvLyBnZXJtYW5cclxuICAgIG1vZGVHZXJtYW5CdXR0b24ub25jbGljayA9ICgpID0+IHtcclxuICAgICAgICBteUdhbWUuZ2FtZU1vZGUgPSAnZ2VybWFuJztcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1haW4tbWVudVwiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgICAgbXlHYW1lLnN0YXJ0KCk7XHJcbiAgICB9O1xyXG4gICAgXHJcbiAgICBzdGFydEJ1dHRvbi5vbmNsaWNrID0gKCkgPT4ge1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWFpbi1tZW51XCIpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIiAvLyB2ZXJzdGVja3QgZGFzIG1haW4gbWVuw7wgXHJcbiAgICAgICAgbXlHYW1lLnN0YXJ0KClcclxuICAgIH1cclxuICAgIFxyXG4gICAgY29uc3QgcGF1c2VCdXR0b24gPSB3aW5kb3cuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwYXVzZUJ1dHRvblwiKTtcclxuICAgIHBhdXNlQnV0dG9uLm9uY2xpY2sgPSBmdW5jdGlvbigpIHsgbXlHYW1lLnBhdXNlKCk7IH1cclxufTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCJcclxuXHJcbmNvbnN0IEVsZW1lbnQgPSByZXF1aXJlKCcuL2VsZW1lbnQnKVxyXG5jb25zdCBCdXJzdCA9IHJlcXVpcmUoJy4vYnVyc3QnKVxyXG5jb25zdCBXb3JkID0gcmVxdWlyZSgnLi93b3JkJylcclxuY29uc3QgSGVhbHRoID0gcmVxdWlyZSgnLi9oZWFsdGgnKVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBSYW5kb21XYWxrQ2lyY2xlRWxlbWVudCBleHRlbmRzIEVsZW1lbnQge1xyXG4gICAgY29uc3RydWN0b3IoZ2FtZSkge1xyXG4gICAgICAgIHN1cGVyKClcclxuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lXHJcbiAgICAgICAgdGhpcy54ID0gTWF0aC5yYW5kb20oKSAqIDUzMCArIDQwXHJcbiAgICAgICAgdGhpcy55ID0gMFxyXG4gICAgICAgIHRoaXMuc3BlZWQgPSAwLjdcclxuICAgICAgICBcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHsgXHJcbiAgICAgICAgICAgIGxldCB3b3JkID0gbmV3IFdvcmQodGhpcy5nYW1lLCB0aGlzLngsIHRoaXMueSwgdGhpcy5pbnN0YW5jZUlkLCB0aGlzLnNwZWVkKVxyXG4gICAgICAgICAgICB0aGlzLmdhbWUuZWxlbWVudExpc3QuYWRkKHdvcmQpXHJcbiAgICAgICAgfSwgMTAwKTtcclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICBkcmF3KGN0eCkge1xyXG4gICAgICAgICAgICBjdHguYmVnaW5QYXRoKClcclxuICAgICAgICAgICAgY3R4LmFyYyh0aGlzLngsIHRoaXMueSwgMTUsIDAsIE1hdGguUEkgKiAyLCB0cnVlKVxyXG4gICAgICAgICAgICBjdHguY2xvc2VQYXRoKClcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSAgXCJncmV5XCJcclxuICAgICAgICAgICAgY3R4LmZpbGwoKVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBjYWxsQnVyc3QoKSB7XHJcbiAgICAgICAgdmFyIGJ1cnN0ID0gbmV3IEJ1cnN0KHRoaXMueCwgdGhpcy55LCB0aGlzLmdhbWUpXHJcbiAgICAgICAgdGhpcy5nYW1lLmVsZW1lbnRMaXN0LmFkZChidXJzdClcclxuICAgIH1cclxuXHJcbiAgICBhY3Rpb24oKSB7XHJcbiAgICAgICAgLy90aGlzLnggKz0gTWF0aC5yYW5kb20oKSAqIDIgLSAxXHJcbiAgICAgICAgdGhpcy55ICs9IHRoaXMuc3BlZWRcclxuICAgIH1cclxuXHJcbiAgICBjaGVja0NvbGxpc2lvbigpIHtcclxuICAgICAgICBpZiAodGhpcy55ID4gNTUwICYmIHRoaXMueSA8PSA1NTAgKyB0aGlzLnNwZWVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMub25Db2xsaXNpb24oKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBvbkNvbGxpc2lvbigpIHtcclxuICAgICAgICB0aGlzLmhhc0NvbGxpZGVkID0gdHJ1ZVxyXG4gICAgICAgIHRoaXMuZ2FtZS5lbGVtZW50TGlzdC5kZWxldGUodGhpcy5pbnN0YW5jZUlkKVxyXG4gICAgICAgIHRoaXMuY2FsbEJ1cnN0KClcclxuICAgICAgICB0aGlzLmdhbWUuaGVhbHRoLnJlZHVjZSgpICAgICAgICAgICAgIFxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBidWxsZXRNZXQoKSB7XHJcbiAgICAgICAgdGhpcy5oYXNDb2xsaWRlZCA9IHRydWVcclxuICAgICAgICB0aGlzLmdhbWUuZWxlbWVudExpc3QuZGVsZXRlKHRoaXMuaW5zdGFuY2VJZClcclxuICAgICAgICB0aGlzLmNhbGxCdXJzdCgpXHJcbiAgICB9XHJcbn0iLCIndXNlIHN0cmljdCdcclxuXHJcbmNvbnN0IFJhbmRvbVdhbGtDaXJjbGVFbGVtZW50ID0gcmVxdWlyZSgnLi9yYW5kb213YWxrY2lyY2xlZWxlbWVudCcpXHJcbmNvbnN0IEVsZW1lbnRMaXN0ID0gcmVxdWlyZSgnLi9lbGVtZW50bGlzdCcpXHJcbmNvbnN0IEJ1cnN0ID0gcmVxdWlyZSgnLi9idXJzdCcpXHJcbmNvbnN0IFdvcmQgPSByZXF1aXJlKCcuL3dvcmQnKVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBSZWdlbmVyYXRlQm9zcyBleHRlbmRzIFJhbmRvbVdhbGtDaXJjbGVFbGVtZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKGdhbWUsIGhlYWx0aD0zICkge1xyXG4gICAgICAgIHN1cGVyKGdhbWUpXHJcbiAgICAgICAgdGhpcy54ID0gMzAwO1xyXG4gICAgICAgIHRoaXMuc3BlZWQgPSAwLjJcclxuICAgICAgICB0aGlzLmhlYWx0aCA9IGhlYWx0aDtcclxuICAgICAgIFxyXG5cclxuICAgIH1cclxuXHJcbiAgICBkcmF3KGN0eCkge1xyXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKVxyXG4gICAgICAgICAgICBjdHguYXJjKHRoaXMueCwgdGhpcy55LCAzMCwgMCwgTWF0aC5QSSAqIDIsIHRydWUpXHJcbiAgICAgICAgICAgIGN0eC5jbG9zZVBhdGgoKVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICBcImJsYWNrXCJcclxuICAgICAgICAgICAgY3R4LmZpbGwoKVxyXG4gICAgfVxyXG5cclxuICAgIGJ1bGxldE1ldCgpIHtcclxuICAgICAgICBpZih0aGlzLmhlYWx0aCA+IDEpe1xyXG4gICAgICAgICAgICB0aGlzLmhlYWx0aCAtPSAxO1xyXG4gICAgICAgICAgICBjb25zdCBuZXh0Qm9zcyA9IG5ldyBSZWdlbmVyYXRlQm9zcyh0aGlzLmdhbWUsIHRoaXMuaGVhbHRoICk7XHJcbiAgICAgICAgICAgIG5leHRCb3NzLnggPSB0aGlzLng7XHJcbiAgICAgICAgICAgIG5leHRCb3NzLnkgPSB0aGlzLnk7XHJcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5lbGVtZW50TGlzdC5hZGQobmV4dEJvc3MpO1xyXG4gICAgICAgICAgICB0aGlzLmdhbWUuZWxlbWVudExpc3QuZGVsZXRlKHRoaXMuaW5zdGFuY2VJZClcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgdGhpcy5oZWFsdGg9MztcclxuICAgICAgICAgICAgdGhpcy5oYXNDb2xsaWRlZCA9IHRydWVcclxuICAgICAgICAgICAgdGhpcy5nYW1lLmVsZW1lbnRMaXN0LmRlbGV0ZSh0aGlzLmluc3RhbmNlSWQpXHJcbiAgICAgICAgICAgIHRoaXMuY2FsbEJ1cnN0KClcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICB9XHJcbn0iLCIndXNlIHN0cmljdCdcclxuXHJcblxyXG5jb25zdCBSYW5kb21XYWxrQ2lyY2xlRWxlbWVudCA9IHJlcXVpcmUoJy4vcmFuZG9td2Fsa2NpcmNsZWVsZW1lbnQnKVxyXG5jb25zdCBFbGVtZW50TGlzdCA9IHJlcXVpcmUoJy4vZWxlbWVudGxpc3QnKSAgICBcclxuY29uc3QgQnVyc3QgPSByZXF1aXJlKCcuL2J1cnN0JylcclxuY29uc3QgV29yZCA9IHJlcXVpcmUoJy4vd29yZCcpXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFNwYXduZXJCb3NzIGV4dGVuZHMgUmFuZG9tV2Fsa0NpcmNsZUVsZW1lbnQge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGdhbWUpIHtcclxuICAgICAgICBzdXBlcihnYW1lKVxyXG4gICAgICAgIHRoaXMueCA9IDMwMDtcclxuICAgICAgICB0aGlzLnNwZWVkID0gMC4yXHJcblxyXG5cclxuXHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5zcGF3bigpO1xyXG4gICAgICAgIHRoaXMuc3Bhd25JbnRlcnZhbCA9IDUwMDAgIC8vIHNwYXduIGV2ZXJ5IHggc2Vjb25kc1xyXG4gICAgICAgIHRoaXMubGFzdFNwYXduVGltZSA9IERhdGUubm93KCk7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgIGRyYXcoY3R4KSB7XHJcbiAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKVxyXG4gICAgICAgICAgICBjdHguYXJjKHRoaXMueCwgdGhpcy55LCAzMCwgMCwgTWF0aC5QSSAqIDIsIHRydWUpXHJcbiAgICAgICAgICAgIGN0eC5jbG9zZVBhdGgoKVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICBcIm9yYW5nZVwiXHJcbiAgICAgICAgICAgIGN0eC5maWxsKClcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYWN0aW9uKCl7XHJcbiAgICAgICAgc3VwZXIuYWN0aW9uKCk7XHJcbiAgICAgICAgdGhpcy5zdGFydFNwYXduaW5nKCk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHN0YXJ0U3Bhd25pbmcoKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3QgY3VycmVudFRpbWUgPSBEYXRlLm5vdygpO1xyXG4gICAgICAgIGlmKCBjdXJyZW50VGltZSAtIHRoaXMubGFzdFNwYXduVGltZSA+PSB0aGlzLnNwYXduSW50ZXJ2YWwpe1xyXG4gICAgICAgICAgICB0aGlzLnNwYXduKCk7XHJcbiAgICAgICAgICAgIHRoaXMubGFzdFNwYXduVGltZSA9IGN1cnJlbnRUaW1lO1xyXG5cclxuXHJcbiAgICAgICAgfSAgICAgICBcclxuICAgICAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgc3Bhd24oKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAyOyBpKyspIHtcclxuICAgICAgICAgICAgaWYodGhpcy5nYW1lLmVsZW1lbnRMaXN0KSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBtaW5pb24gPSBuZXcgUmFuZG9tV2Fsa0NpcmNsZUVsZW1lbnQodGhpcy5nYW1lKTtcclxuICAgICAgICAgICAgICAgIG1pbmlvbi54ID0gIHRoaXMueCArIChpIC0gMSkgKiA2MDsgXHJcbiAgICAgICAgICAgICAgICBtaW5pb24ueSA9IHRoaXMueSArMTA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUuZWxlbWVudExpc3QuYWRkKG1pbmlvbik7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcblxyXG59IiwiXCJ1c2Ugc3RyaWN0XCJcclxuXHJcbmNvbnN0IEVsZW1lbnQgPSByZXF1aXJlKCcuL2VsZW1lbnQnKVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBTdGFnZSBleHRlbmRzIEVsZW1lbnQge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKClcclxuICAgICAgICB0aGlzLnggPSAwXHJcbiAgICAgICAgdGhpcy55ID0gMFxyXG4gICAgfVxyXG5cclxuICAgIGRyYXcoY3R4KSB7XHJcbiAgICAgICAgdmFyIGltZyA9IG5ldyBJbWFnZSgpO1xyXG4gICAgICAgIGltZy5vbmxvYWQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgY3R4LmRyYXdJbWFnZShpbWcsIDAsIDApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpbWcuc3JjID0gJ2ltZy9iYWNrZ3JvdW5kLnBuZyc7XHJcbiAgICB9XHJcblxyXG4gICAgYWN0aW9uKCkge1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG59IiwibW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBWYWxpZGF0b3Ige1xyXG5cclxuY29uc3RydWN0b3IoKXtcclxuICB0aGlzLmFjdGl2ZVdvcmQgPSBcIlwiO1xyXG4gIHRoaXMuY3VycmVudElucHV0ID0gXCJcIjtcclxuICAvL3RoaXMuY3VycmVudFNwb3Q9MDtcclxuICAvL3RoaXMud29yZExvY2tlZCA9IGZhbHNlO1xyXG59XHJcblxyXG5cclxuXHJcbnNldEFjdGl2ZVdvcmQod29yZCl7XHJcbiAgICAvL3RoaXMuYWN0aXZlV29yZCA9IHdvcmQudG9Mb3dlckNhc2UoKTtcclxuICAgIHRoaXMuYWN0aXZlV29yZCA9IHdvcmQ7XHJcbiAgICB0aGlzLmN1cnJlbnRJbnB1dCA9IFwiXCJcclxuICAgIC8vdGhpcy53b3JkTG9ja2VkID0gZmFsc2U7XHJcbiAgICAvL3RoaXMuY3VycmVudFNwb3QgPSAwO1xyXG59XHJcblxyXG5jaGVja0xldHRlcihsZXR0ZXIpe1xyXG4gICAgLy9jb25zdCBleHBlY3RlZENoYXIgPSB0aGlzLnRhcmdldFdvcmRbdGhpcy5jdXJyZW50U3BvdF07XHJcbiAgICBpZigvKiF0aGlzLndvcmRMb2NrZWQgfHwqLyAhdGhpcy5hY3RpdmVXb3JkKXtcclxuICAgICAgICByZXR1cm4gZmFsc2U7ICAgIFxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGV4cGVjdGVkQ2hhciA9IHRoaXMuYWN0aXZlV29yZFt0aGlzLmN1cnJlbnRJbnB1dC5sZW5ndGhdO1xyXG5cclxuICAgIGlmKGxldHRlciA9PT0gZXhwZWN0ZWRDaGFyKXtcclxuICAgICAgICB0aGlzLmN1cnJlbnRJbnB1dCArPSBsZXR0ZXI7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcblxyXG5cclxufVxyXG5cclxuXHJcbmlzV29yZENvbXBsZXRlKCl7XHJcbiAgICByZXR1cm4gdGhpcy5hY3RpdmVXb3JkICYmIHRoaXMuY3VycmVudElucHV0ID09PSB0aGlzLmFjdGl2ZVdvcmQ7XHJcbn1cclxuZ2V0QWN0aXZlV29yZCgpe1xyXG4gICAgcmV0dXJuIHRoaXMuYWN0aXZlV29yZDtcclxufVxyXG5yZXNldCgpe1xyXG4gICAgdGhpcy5jdXJyZW50SW5wdXQgPSBcIlwiO1xyXG4gICAgdGhpcy5hY3RpdmVXb3JkID0gbnVsbDtcclxuICAgIC8vdGhpcy53b3JkTG9ja2VkID0gZmFsc2U7XHJcbn1cclxuXHJcbmdldEN1cnJlbnRJbnB1dCgpe1xyXG4gICAgcmV0dXJuIHRoaXMuY3VycmVudElucHV0O1xyXG59XHJcbmhhc0FjdGl2ZVdvcmQoKXtcclxuICAgIHJldHVybiB0aGlzLmFjdGl2ZVdvcmQgIT09IFwiXCI7XHJcbn1cclxuXHJcbn0iLCJcInVzZSBzdHJpY3RcIlxyXG5cclxuY29uc3QgRWxlbWVudCA9IHJlcXVpcmUoJy4vZWxlbWVudCcpXHJcbmNvbnN0IEVuZ2xpc2hHZXJtYW5EaWN0aW9uYXJ5ID0gcmVxdWlyZSgnLi9kaWN0aW9uYXJ5JylcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgV29yZCBleHRlbmRzIEVsZW1lbnQge1xyXG4gICAgY29uc3RydWN0b3IoZ2FtZSwgeCwgeSwgY2lyY2xlSWQsIHNwZWVkKSB7XHJcbiAgICAgICAgc3VwZXIoKVxyXG4gICAgICAgIHRoaXMuZGVzdHJveWVkID0gZmFsc2UgXHJcbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZVxyXG4gICAgICAgIHRoaXMuY2lyY2xlSWQgPSBjaXJjbGVJZFxyXG4gICAgICAgIHRoaXMuc3BlZWQgPSBzcGVlZFxyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IGRpY3Rpb25hcnkgPSBuZXcgRW5nbGlzaEdlcm1hbkRpY3Rpb25hcnkoKTtcclxuICAgICAgICBjb25zdCByYW5kb21JbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGRpY3Rpb25hcnkud29yZHMubGVuZ3RoKTtcclxuICAgICAgICBsZXQgZW5nbGlzaFdvcmQgPSBkaWN0aW9uYXJ5LndvcmRzW3JhbmRvbUluZGV4XTtcclxuICAgICAgICBcclxuICAgICAgICBpZiAoZ2FtZS5nYW1lTW9kZSA9PT0gJ2dlcm1hbicpIHtcclxuICAgICAgICAgICAgdGhpcy5kaXNwbGF5V29yZCA9IGRpY3Rpb25hcnkudHJhbnNsYXRlKGVuZ2xpc2hXb3JkKTtcclxuICAgICAgICAgICAgdGhpcy53b3JkID0gZW5nbGlzaFdvcmQ7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5kaXNwbGF5V29yZCA9IGVuZ2xpc2hXb3JkO1xyXG4gICAgICAgICAgICB0aGlzLndvcmQgPSBlbmdsaXNoV29yZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgd2hpbGUgKGdhbWUuaXNXb3JkT25EaXNwbGF5KHRoaXMud29yZCkpIHtcclxuICAgICAgICAgICAgY29uc3QgbmV3SW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBkaWN0aW9uYXJ5LndvcmRzLmxlbmd0aCk7XHJcbiAgICAgICAgICAgIGVuZ2xpc2hXb3JkID0gZGljdGlvbmFyeS53b3Jkc1tuZXdJbmRleF07XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAoZ2FtZS5nYW1lTW9kZSA9PT0gJ2dlcm1hbicpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGlzcGxheVdvcmQgPSBkaWN0aW9uYXJ5LnRyYW5zbGF0ZShlbmdsaXNoV29yZCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndvcmQgPSBlbmdsaXNoV29yZDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGlzcGxheVdvcmQgPSBlbmdsaXNoV29yZDtcclxuICAgICAgICAgICAgICAgIHRoaXMud29yZCA9IGVuZ2xpc2hXb3JkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMueCA9IHggLSB0aGlzLmRpc3BsYXlXb3JkLmxlbmd0aCo4LzJcclxuICAgICAgICB0aGlzLnkgPSB5ICsgMzBcclxuICAgIH1cclxuXHJcbiAgICBkcmF3KGN0eCkge1xyXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSBcIndoaXRlXCJcclxuICAgICAgICBjdHguZmlsbFRleHQodGhpcy5kaXNwbGF5V29yZCwgdGhpcy54LCB0aGlzLnkpO1xyXG4gICAgfVxyXG5cclxuICAgIGFjdGlvbigpIHtcclxuICAgICAgICAvL3RoaXMueCArPSBNYXRoLnJhbmRvbSgpICogMiAtIDFcclxuICAgICAgICB0aGlzLnkgKz0gdGhpcy5zcGVlZFxyXG4gICAgICAgICAgICBpZiAodGhpcy55ID4gd2luZG93LmlubmVySGVpZ2h0IC0gODApIHRoaXMuZGVzdHJveWVkID0gdHJ1ZVxyXG4gICAgfVxyXG5cclxuICAgIGNoZWNrQ29sbGlzaW9uKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmdhbWUuZWxlbWVudExpc3QuZ2V0KHRoaXMuY2lyY2xlSWQpID09IG51bGwpIHsgLy9pZiBpdCBpcyBudWxsLCB0aGF0IG1lYW5zIHRoZSBjaXJjbGUgaGFzIGNvbGxpZGVkXHJcbiAgICAgICAgICAgIHRoaXMub25Db2xsaXNpb24oKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBvbkNvbGxpc2lvbigpIHtcclxuICAgICAgICB0aGlzLmhhc0NvbGxpZGVkID0gdHJ1ZVxyXG4gICAgICAgIHRoaXMuZ2FtZS5lbGVtZW50TGlzdC5kZWxldGUodGhpcy5pbnN0YW5jZUlkKTtcclxuICAgIH1cclxufVxyXG4iLCIndXNlIHN0cmljdCdcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgV29yZElucHV0SGFuZGxlcntcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHRoaXMuaW5wdXRMaW5lPSBudWxsO1xyXG4gICAgICAgIFxyXG5cclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5oYW5kbGVJbnB1dC5iaW5kKHRoaXMpKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRMZXR0ZXJDYWxsYmFjayhjYWxsYmFjayl7XHJcbiAgICAgICAgdGhpcy5pbnB1dExpbmUgPSBjYWxsYmFjaztcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVJbnB1dChldmVudCl7XHJcbiAgICAgICAgaWYoZXZlbnQua2V5Lmxlbmd0aD09MSAmJiAvW2EtekEtWl0vLnRlc3QoZXZlbnQua2V5KSl7XHJcbiAgICAgICAgICAgIC8vY29uc3QgbGV0dGVyPSBldmVudC5rZXkudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICAgICAgY29uc3QgbGV0dGVyPSBldmVudC5rZXk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZih0aGlzLmlucHV0TGluZSl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmlucHV0TGluZShsZXR0ZXIpO1xyXG4gICAgICAgICAgICB9ICAgXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgLypcclxuICAgIG5vdGlmeShsZXR0ZXIpe1xyXG4gICAgICAgIC8vaGllciB3ZXJkZW4gZGllIGFuZGVyZW4ga2xhc3NlbiB2b24gZGVtIG5ldWVuIGJ1Y2hzdGFiZW4gbm90aWZpZXJ0XHJcbiAgICAgICAgLy8gZXZ0bCDDvGJlcmZsw7xzc2lnXHJcbiAgICB9XHJcblxyXG4gICAgZ2V0SW5wdXQoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5pbnB1dDtcclxuICAgIH1cclxuXHJcbiAgICByZXNldElucHV0KCl7XHJcbiAgICAgICAgdGhpcy5pbnB1dD0gXCJcIjtcclxuICAgIH0qL1xyXG59Il19
