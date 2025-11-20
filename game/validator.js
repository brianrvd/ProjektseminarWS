module.exports = class Validator {

constructor(){
  this.targetWord ="";
  this.currentSpot=0;
}

setTargetWord(word){
    this.targetWord = word.toLowerCase();
    this.currentSpot = 0;
}

checkLetter(letter){
const expectedChar = this.targetWord[this.currentSpot];

if(letter === expectedChar){
    this.currentSpot++;
    return true;

}
return false;
}
isWordComplete(){
    if(this.targetWord.length === this.currentSpot){
        return true;
    }
    return false;
}
getCurrentSpot(){
    return this.currentSpot;
}
}