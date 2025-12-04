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

},{"./element":3}],2:[function(require,module,exports){
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
},{"./element":3,"./elementlist":4,"./game":5}],3:[function(require,module,exports){
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
},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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


module.exports = class Game {

    constructor() {
        this.raf                       // request animation frame handle
        this.elementList =[]
        this.health = new Health();

        this.score = 0 
        this.currentInput = ''
        // Änderungen von Brian
        this.validator = new Validator();
        this.wordInputhander = new WordInputHandler();
        this.activeWordElement = null;
        this.wordInputhander.setLetterCallback(this.handleLetterInput.bind(this));
        this.isInputSet = false


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
    
        for (let i = 0; i < 60; i++) {
            setTimeout(() => {
                if(this.elementList != null) {
                    this.elementList.add(new RandomWalkCircleElement(this));
                } 
            }, 3000 * i);
        }
        this.elementList.add(new Stage())

        this.timeOfLastFrame = Date.now()
        this.raf = window.requestAnimationFrame(this.tick.bind(this))
      
    }

    //----------------------

    stop() {
        window.cancelAnimationFrame(this.raf)
        this.elementList = null
    }
    // menü nach tod einblinden 
    gameOver() {
        this.stop();
        document.getElementById("mycanvas").style.display = "none";      // Canvas verstecken
        document.getElementById("game-wrapper").style.display = "flex";    // Menü zeigen 
        this.health = new Health();                                    // leben wieder zurück setzen 
        this.score = 0;
    }
    //----------------------

    tick() {
        let mycanvas = window.document.getElementById("mycanvas")
        let ctx = mycanvas.getContext('2d')
        ctx.font = "18px Arial";

        //--- clear screen
        ctx.fillStyle = 'rgba(235, 250, 255, 0.1)' // alpha < 1 löscht den Bildschrim nur teilweise -> bewegte Gegenstände erzeugen Spuren
        ctx.fillRect(0, 0, mycanvas.clientWidth, mycanvas.clientHeight)

        //Änderungen von Brian (test)         

        //--- draw elements
        this.elementList.draw(ctx)

        //--- execute elemenSt actions
        this.elementList.action()

        //--- check element collisions
        this.elementList.checkCollision()
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
        word.word.toLowerCase().startsWith(firstLetter)
    );
    
    if (matchingWord) {
        this.activeWordElement = matchingWord;
        this.currentInput = firstLetter;
        
    }
}

    // Tippe am aktiven Wort weiter
    continueTypingWord(letter) {
        const expectedNextLetter = this.activeWordElement.word.toLowerCase()[this.currentInput.length];
    
        // Prüfe ob der Buchstabe korrekt ist
        if (letter === expectedNextLetter) {
            this.currentInput += letter;
        
        
            // Prüfe ob Wort vollständig
            if (this.currentInput === this.activeWordElement.word.toLowerCase()) {
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



}

},{"./bullet":1,"./burst":2,"./elementlist":4,"./health":6,"./randomwalkcircleelement":9,"./stage":10,"./validator":11,"./word":12,"./wordinputhandler":13}],6:[function(require,module,exports){
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
            ctx.drawImage(this.heart, 10,10,25,25);
        }
        if (this.health >= 2) {
            ctx.drawImage(this.heart, 40,10,25,25);
        }
        if (this.health >= 3) {
            ctx.drawImage(this.heart, 70,10,25,25);
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
},{"./element":3}],7:[function(require,module,exports){
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
        document.getElementById("output").textContent = JSON.stringify(this.Inputlist, null);
    }
    
    static isEmpty(){
        return this.Inputlist.length == 0;
    }
}


},{}],8:[function(require,module,exports){
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
   
    
},{"./game":5,"./inputfield":7}],9:[function(require,module,exports){
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
},{"./burst":2,"./element":3,"./health":6,"./word":12}],10:[function(require,module,exports){
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
},{"./element":3}],11:[function(require,module,exports){
module.exports = class Validator {

constructor(){
  this.activeWord = "";
  this.currentInput = "";
  //this.currentSpot=0;
  //this.wordLocked = false;
}



setActiveWord(word){
    this.activeWord = word.toLowerCase();
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
},{}],12:[function(require,module,exports){
"use strict"

const Element = require('./element')
const InputField = require('./inputfield')

module.exports = class Word extends Element {
    constructor(game, x, y, circleId, speed) {
        super()
        this.destroyed = false 
        this.game = game
        this.circleId = circleId
        this.speed = speed
        let wordList = [];
        //  hole input raus 
        if (InputField.isEmpty()) {
            wordList = ['Rock','Paper','Scissor','Apple','Orange','Banana','Grape','Mango','Lemon','Lime','Cherry','Pear','Peach','Plum','Apricot','Fig','Date','Kiwi','Melon','Berry','Straw','Stone','Water','Fire','Earth','Wind','Sky','Cloud','Rain','Storm','Thunder','Lightning','River','Ocean','Sea','Lake','Pond','Stream','Hill','Mountain','Valley','Forest','Woods','Jungle','Desert','Island','Coast','Shore','Beach','Sand','Dirt','Soil','Grass','Leaf','Tree','Branch','Root','Flower','Petal','Seed','Plant','Herb','Vine','Bark','Stem','Moss','Fungi','Mushroom','Animal','Bird','Fish','Insect','Beast','Creature','Human','Person','Child','Adult','Man','Woman','Boy','Girl','Friend','Neighbor','Doctor','Teacher','Student','Pilot','Driver','Farmer','Hunter','Singer','Dancer','Artist','Writer','Reader','Leader','Worker','Builder','Maker','Cook','Baker','Soldier','Officer','Guard','King','Queen','Prince','Princess','Knight','Wizard','Hero','Giant','Dwarf','Robot','Alien','Monster','Angel','Demon','Spirit','Ghost','Shadow','Light','Dark','Bright','Dim','Sharp','Blunt','Soft','Hard','Strong','Weak','Quick','Slow','Fast','Heavy','Lightweight','Small','Large','Huge','Tiny','Short','Tall','Wide','Narrow','Deep','Shallow','New','Old','Young','Ancient','Fresh','Stale','Hot','Cold','Warm','Cool','Dry','Wet','Clean','Dirty','Sweet','Sour','Bitter','Salty','Spicy','Plain','Happy','Sad','Angry','Calm','Brave','Shy','Polite','Rude','Kind','Mean','Smart','Dull','Clever','Wise','Silly','Funny','Serious','Ready','Basic','Simple','Complex','Difficult','Easy','Possible','Certain','Random','Common','Rare','Famous','Unknown','Empty','Full','Open','Closed','Early','Late','First','Last','Right','Left','North','South','East','West','Inside','Outside','Above','Below','Front','Back','Near','Far','Here','There','Everywhere','Somewhere','Nowhere','Always','Never','Sometimes','Often','Seldom','Daily','Weekly','Monthly','Yearly','Moment','Second','Minute','Hour','Day','Week','Month','Year','Decade','Century','Time','Clock','Watch','Morning','Noon','Evening','Night','Midnight','Sun','Moon','Star','Planet','World','Universe','Galaxy','Space','Void','Energy','Power','Force','Motion','Speed','Gravity','Atom','Cell','Matter','Object','Item','Thing','Tool','Device','Machine','Engine','Motor','Car','Truck','Bus','Train','Plane','Boat','Ship','Bike','Cycle','Wheel','Road','Path','Trail','Bridge','Tunnel','Tower','House','Home','Room','Door','Window','Wall','Floor','Ceiling','Roof','Hall','Garden','Yard','Farm','Barn','Market','Store','Shop','Mall','Library','School','Office','Factory','Church','Temple','Castle','Palace','Village','Town','City','Country','Nation','Kingdom','Empire','Army','Navy','Police','Court','Law','Judge','Crime','Jury','Trial','Money','Cash','Coin','Credit','Debit','Bank','Value','Price','Cost','Trade','Sale','Store','Buyer','Seller','Gift','Present','Prize','Reward','Treasure','Gold','Silver','Copper','Iron','Steel','Stone','Brick','Wood','Paper','Cloth','Leather','Glass','Plastic','Rubber','String','Rope','Chain','Blade','Sword','Knife','Axe','Hammer','Wrench','Screw','Nail','Bolt','Drill','Saw','Brush','Paint','Color','Ink','Pen','Pencil','Marker','Book','Page','Story','Poem','Song','Music','Sound','Noise','Voice','Word','Letter','Phrase','Sentence','Line','Paragraph','Novel','Drama','Comedy','Tragedy','Movie','Film','Scene','Actor','Stage','Screen','Image','Picture','Photo','Video','Camera','Light','Lamp','Candle','Fireplace','Oven','Stove','Fridge','Table','Chair','Desk','Bed','Couch','Sofa','Shelf','Cabinet','Mirror','Clock','Bag','Box','Bottle','Cup','Glass','Plate','Bowl','Fork','Spoon','Knife','Meal','Food','Drink','Bread','Rice','Meat','Fish','Egg','Milk','Cheese','Butter','Sugar','Salt','Pepper','Spice','Soup','Stew','Sauce','Fruit','Vegetable','Carrot','Potato','Tomato','Onion','Garlic','Pepper','Corn','Bean','Pea','Spinach','Broccoli','Cabbage','Lettuce','Tea','Coffee','Juice','Water','Soda','Wine','Beer','Breakfast','Lunch','Dinner','Snack','Feast','Party','Game','Sport','Match','Win','Loss','Score','Goal','Point','Team','Player','Coach','Judge','Referee','Race','Run','Walk','Jump','Swim','Climb','Throw','Catch','Hit','Kick','Push','Pull','Lift','Drop','Hold','Touch','Look','See','Hear','Listen','Speak','Talk','Say','Tell','Write','Read','Think','Know','Learn','Teach','Understand','Believe','Imagine','Remember','Forget','Love','Hate','Fear','Hope','Dream','Sleep','Wake','Live','Die','Grow','Shrink','Change','Stay','Move','Travel','Visit','Explore','Search','Find','Lose','Build','Break','Fix','Create','Destroy','Open','Close','Start','Stop','Begin','End','Continue','Return','Follow','Lead','Support','Help','Save','Protect','Attack','Defend','Join','Leave','Enter','Exit','Cloth','Shirt','Pants','Dress','Skirt','Coat','Hat','Boot','Shoe','Sock','Glove','Belt','Ring','Necklace','Bracelet','Watch','Wallet','Purse','Phone','Tablet','Laptop','Computer','Keyboard','Mouse','Screen','Monitor','Cable','Wire','Signal','Network','Website','Internet','Software','Program','File','Folder','Data','Code','Error','System','Logic','Method','Theory','Model','Pattern','Structure','Shape','Form','Circle','Square','Triangle','Cube','Sphere','Line','Point','Angle','Curve','Edge','Side','Center','Level','Status','Option','Choice','Chance','Risk','Plan','Idea','Goal','Dream','Wish','Order','Rule','Guide','Map','List','Chart','Graph','Table','Test','Exam','Quiz','Lesson','Class','Course','Skill','Talent','Art','Science','Math','History','Geography','Physics','Chemistry','Biology','Economy','Market','Trade','Business','Company','Office','Worker','Manager','Leader','Boss','Owner','Partner','Client','Customer','Service','Product','Brand','Model','Version','Market','Industry','Technology','Design','Style','Quality','Feature','Function','Purpose','Effect','Cause','Result','Victory','Failure','Success','Effort','Focus','Honor','Glory','Truth','Faith','Trust','Peace','War','Battle','Fight','Weapon','Shield','Armor','Flag','Symbol','Sign','Message','Notice','News','Report','Paper','Article','Letter','Email','Text','Chat','Call','Signal','Alert','Warning','Danger','Safety','Health','Body','Heart','Mind','Brain','Hand','Foot','Eye','Ear','Mouth','Nose','Face','Hair','Skin','Bone','Blood','Breath','Life','Death','Birth','Childhood','Youth','Adult','Elder','Future','Past','Present']
        }
        else {
           wordList= InputField.Inputlist;  
        }
    
        this.word = wordList[Math.floor(Math.random()*wordList.length)]
        while (game.isWordOnDisplay(this.word)) {
            this.word = wordList[Math.floor(Math.random()*wordList.length)]
        }
        this.x = x - this.word.length*8/2
        this.y = y + 30
    }

    draw(ctx) {
        ctx.fillStyle = "white"
        ctx.fillText(this.word, this.x, this.y);
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
        /*änderungen von Brian
        if (this.game.activeWordElement === this){
            this.game.resetActiveWord();
        }*/
    }

}

},{"./element":3,"./inputfield":7}],13:[function(require,module,exports){
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
},{}]},{},[8]);
