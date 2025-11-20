'use strict'

module.exports = class WordInputHandler{

    constructor(validator){
        this.input= "";
        this.validator = validator;

        document.addEventListener('keydown', this.handleInput.bind(this));
    }

    handleInput(event){
        if(event.key.length==1 && /[a-zA-Z]/.test(event.key)){
            const letter= event.key.toLowerCase();
            
            if(this.validator.checkLetter(letter)){
                this.input += letter;
                this.notify(letter)

            }else{
                //
            }   
            
        }
    }
    

    notify(letter){
        //hier werden die anderen klassen von dem neuen buchstaben notifiert
        // evtl überflüssig
    }

    getInput(){
        return this.input;
    }

    resetInput(){
        this.input= "";
    }
}