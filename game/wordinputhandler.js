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