function generateWinningNumber(){
    var num;
    num = Math.floor((Math.random() * 100) + 1);
    return num
}

function shuffle(arr) {
    var m = arr.length, t, i;
    while (m) {
    i = Math.floor(Math.random() * m--);
    t = arr[m];
    arr[m] = arr[i];
    arr[i] = t;
  }
  return arr;
}

function Game(){
    this.playersGuess = null;
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function(){
    var value = this.playersGuess - this.winningNumber;
    return Math.abs(value);
}

Game.prototype.isLower = function(){
    if (this.playersGuess < this.winningNumber)
        return true;
    else 
        return false;
}

Game.prototype.playersGuessSubmission = function(guess){
    if ((guess < 1) || (guess > 100) || 
        (typeof guess != "number")){
        throw "That is an invalid guess.";
    }
    else{ 
        this.playersGuess = guess;
    }
    return this.checkGuess(guess)
}   

Game.prototype.checkGuess = function(guess){
    if (guess == this.winningNumber)
        return "You Win!"
    else if (this.pastGuesses.includes(guess))
        return  ("Already guessed " + guess);
    else {
        this.pastGuesses.push(guess);
        if (this.pastGuesses.length == 5)
            return "You Lose. The winning number was " + this.winningNumber + ".";
        else if (this.difference() < 10)
            return "You\'re burning up!";
        else if (this.difference() < 25)
            return "You\'re lukewarm."; 
        else if (this.difference() < 50)
            return "You\'re a bit chilly.";
        else if (this.difference() < 100)
            return "You\'re ice cold!";
    }
}

Game.prototype.provideHint = function() {
    var arr = [];
    arr.push(this.winningNumber);
    arr.push(generateWinningNumber());
    arr.push(generateWinningNumber());
    return shuffle(arr);
}


function newGame(){
    var obj = new Game;
    return obj;
}

function getGuess(obj){
    var guess = +$('#player-input').val();
    $('#player-input').val('');
    var output = obj.playersGuessSubmission(guess);
    console.log(output);
    return output;
}


function processGuess(output, game){
    console.log("process");
    if (output.indexOf("Already guessed") == 0){
        console.log("here");
        $('h1').text(output + " -- Guess again!");
    } else if (output == "You Win!" || (output.indexOf("You Lose.") == 0)) {
        $('h1').text(output);        
        $('h2').text("Click the Reset button to try again.")
        
        $('#hint, #submit, #player-input').prop('disabled', true);
        if (output == "You Win!"){
            $('#player-input').removeClass('input');
            $('#player-input').removeClass('losing');
            $('#player-input').addClass('winning');
            $('.guess').addClass('neutralBorder');
            $('#player-input').val(game.winningNumber);
        } else{
            $('#guess' + game.pastGuesses.length).text(game.playersGuess)
            $('#guess' + game.pastGuesses.length).removeClass('neutralBorder');
            $('#guess' + game.pastGuesses.length).addClass('wrongBorder');
            
            
            $('#player-input').val(game.pastGuesses[4]);
            $('#player-input').removeClass('input');

            $('#player-input').addClass('losing');
        }

    } else {
        $('#guess' + game.pastGuesses.length).text(game.playersGuess)
        $('#guess' + game.pastGuesses.length).removeClass('neutralBorder');
        $('#guess' + game.pastGuesses.length).addClass('wrongBorder');
        $('h1').text(output);
        var guessHelp = (game.isLower() ? "Guess higher..." : "Guess lower...");
        $('h2').text(guessHelp);
    }

}

$(document).ready(function() {
    var game = new Game()
    var output;
    console.log(game.winningNumber);
    $('.guess').addClass('neutralBorder');
    $('#submit').click(function(){
       output = getGuess(game);
       processGuess(output, game);
    });
    $('#player-input').keydown(function(e) {
        if (e.which == 13 ){
           output = getGuess(game);
           processGuess(output, game);
        }
    });
    $('#reset').click(function(){
        console.log("reset");
        game = newGame();
        $('h1').text("Guessing Game!")
        $('h2').text("Guess a number between 1 and 100");
        $('li').text('-');
        $('#player-input').removeClass('winning')
        $('#player-input').addClass('input');
        $('#player-input').val("");
        $('#hint, #submit, #player-input').prop('disabled', false);
        $('.guess').addClass('neutralBorder');
    });
    $('#hint').click(function(){
        $('h1').text('The secret number is one the following: ' + game.provideHint() + ".");
    });
});