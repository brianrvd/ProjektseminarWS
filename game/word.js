"use strict"

const Element = require('./element')

module.exports = class Word extends Element {
    constructor(game, x, y, circleId, speed) {
        super()
        this.game = game
        this.circleId = circleId
        this.speed = speed
        const wordList = ['Rock','Paper','Scissor','Apple','Orange','Banana','Grape','Mango','Lemon','Lime','Cherry','Pear','Peach','Plum','Apricot','Fig','Date','Kiwi','Melon','Berry','Straw','Stone','Water','Fire','Earth','Wind','Sky','Cloud','Rain','Storm','Thunder','Lightning','River','Ocean','Sea','Lake','Pond','Stream','Hill','Mountain','Valley','Forest','Woods','Jungle','Desert','Island','Coast','Shore','Beach','Sand','Dirt','Soil','Grass','Leaf','Tree','Branch','Root','Flower','Petal','Seed','Plant','Herb','Vine','Bark','Stem','Moss','Fungi','Mushroom','Animal','Bird','Fish','Insect','Beast','Creature','Human','Person','Child','Adult','Man','Woman','Boy','Girl','Friend','Neighbor','Doctor','Teacher','Student','Pilot','Driver','Farmer','Hunter','Singer','Dancer','Artist','Writer','Reader','Leader','Worker','Builder','Maker','Cook','Baker','Soldier','Officer','Guard','King','Queen','Prince','Princess','Knight','Wizard','Hero','Giant','Dwarf','Robot','Alien','Monster','Angel','Demon','Spirit','Ghost','Shadow','Light','Dark','Bright','Dim','Sharp','Blunt','Soft','Hard','Strong','Weak','Quick','Slow','Fast','Heavy','Lightweight','Small','Large','Huge','Tiny','Short','Tall','Wide','Narrow','Deep','Shallow','New','Old','Young','Ancient','Fresh','Stale','Hot','Cold','Warm','Cool','Dry','Wet','Clean','Dirty','Sweet','Sour','Bitter','Salty','Spicy','Plain','Happy','Sad','Angry','Calm','Brave','Shy','Polite','Rude','Kind','Mean','Smart','Dull','Clever','Wise','Silly','Funny','Serious','Ready','Basic','Simple','Complex','Difficult','Easy','Possible','Certain','Random','Common','Rare','Famous','Unknown','Empty','Full','Open','Closed','Early','Late','First','Last','Right','Left','North','South','East','West','Inside','Outside','Above','Below','Front','Back','Near','Far','Here','There','Everywhere','Somewhere','Nowhere','Always','Never','Sometimes','Often','Seldom','Daily','Weekly','Monthly','Yearly','Moment','Second','Minute','Hour','Day','Week','Month','Year','Decade','Century','Time','Clock','Watch','Morning','Noon','Evening','Night','Midnight','Sun','Moon','Star','Planet','World','Universe','Galaxy','Space','Void','Energy','Power','Force','Motion','Speed','Gravity','Atom','Cell','Matter','Object','Item','Thing','Tool','Device','Machine','Engine','Motor','Car','Truck','Bus','Train','Plane','Boat','Ship','Bike','Cycle','Wheel','Road','Path','Trail','Bridge','Tunnel','Tower','House','Home','Room','Door','Window','Wall','Floor','Ceiling','Roof','Hall','Garden','Yard','Farm','Barn','Market','Store','Shop','Mall','Library','School','Office','Factory','Church','Temple','Castle','Palace','Village','Town','City','Country','Nation','Kingdom','Empire','Army','Navy','Police','Court','Law','Judge','Crime','Jury','Trial','Money','Cash','Coin','Credit','Debit','Bank','Value','Price','Cost','Trade','Sale','Store','Buyer','Seller','Gift','Present','Prize','Reward','Treasure','Gold','Silver','Copper','Iron','Steel','Stone','Brick','Wood','Paper','Cloth','Leather','Glass','Plastic','Rubber','String','Rope','Chain','Blade','Sword','Knife','Axe','Hammer','Wrench','Screw','Nail','Bolt','Drill','Saw','Brush','Paint','Color','Ink','Pen','Pencil','Marker','Book','Page','Story','Poem','Song','Music','Sound','Noise','Voice','Word','Letter','Phrase','Sentence','Line','Paragraph','Novel','Drama','Comedy','Tragedy','Movie','Film','Scene','Actor','Stage','Screen','Image','Picture','Photo','Video','Camera','Light','Lamp','Candle','Fireplace','Oven','Stove','Fridge','Table','Chair','Desk','Bed','Couch','Sofa','Shelf','Cabinet','Mirror','Clock','Bag','Box','Bottle','Cup','Glass','Plate','Bowl','Fork','Spoon','Knife','Meal','Food','Drink','Bread','Rice','Meat','Fish','Egg','Milk','Cheese','Butter','Sugar','Salt','Pepper','Spice','Soup','Stew','Sauce','Fruit','Vegetable','Carrot','Potato','Tomato','Onion','Garlic','Pepper','Corn','Bean','Pea','Spinach','Broccoli','Cabbage','Lettuce','Tea','Coffee','Juice','Water','Soda','Wine','Beer','Breakfast','Lunch','Dinner','Snack','Feast','Party','Game','Sport','Match','Win','Loss','Score','Goal','Point','Team','Player','Coach','Judge','Referee','Race','Run','Walk','Jump','Swim','Climb','Throw','Catch','Hit','Kick','Push','Pull','Lift','Drop','Hold','Touch','Look','See','Hear','Listen','Speak','Talk','Say','Tell','Write','Read','Think','Know','Learn','Teach','Understand','Believe','Imagine','Remember','Forget','Love','Hate','Fear','Hope','Dream','Sleep','Wake','Live','Die','Grow','Shrink','Change','Stay','Move','Travel','Visit','Explore','Search','Find','Lose','Build','Break','Fix','Create','Destroy','Open','Close','Start','Stop','Begin','End','Continue','Return','Follow','Lead','Support','Help','Save','Protect','Attack','Defend','Join','Leave','Enter','Exit','Cloth','Shirt','Pants','Dress','Skirt','Coat','Hat','Boot','Shoe','Sock','Glove','Belt','Ring','Necklace','Bracelet','Watch','Wallet','Purse','Phone','Tablet','Laptop','Computer','Keyboard','Mouse','Screen','Monitor','Cable','Wire','Signal','Network','Website','Internet','Software','Program','File','Folder','Data','Code','Error','System','Logic','Method','Theory','Model','Pattern','Structure','Shape','Form','Circle','Square','Triangle','Cube','Sphere','Line','Point','Angle','Curve','Edge','Side','Center','Level','Status','Option','Choice','Chance','Risk','Plan','Idea','Goal','Dream','Wish','Order','Rule','Guide','Map','List','Chart','Graph','Table','Test','Exam','Quiz','Lesson','Class','Course','Skill','Talent','Art','Science','Math','History','Geography','Physics','Chemistry','Biology','Economy','Market','Trade','Business','Company','Office','Worker','Manager','Leader','Boss','Owner','Partner','Client','Customer','Service','Product','Brand','Model','Version','Market','Industry','Technology','Design','Style','Quality','Feature','Function','Purpose','Effect','Cause','Result','Victory','Failure','Success','Effort','Focus','Honor','Glory','Truth','Faith','Trust','Peace','War','Battle','Fight','Weapon','Shield','Armor','Flag','Symbol','Sign','Message','Notice','News','Report','Paper','Article','Letter','Email','Text','Chat','Call','Signal','Alert','Warning','Danger','Safety','Health','Body','Heart','Mind','Brain','Hand','Foot','Eye','Ear','Mouth','Nose','Face','Hair','Skin','Bone','Blood','Breath','Life','Death','Birth','Childhood','Youth','Adult','Elder','Future','Past','Present']
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