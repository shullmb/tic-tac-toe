// Global Variables

var turn = null;
var infoBox = null;
var gameOver = null;

var squares = {
    'one': 0,
    'two': 0,
    'three': 0,
    'four': 0,
    'five': 0,
    'six': 0,
    'seven': 0,
    'eight': 0,
    'nine': 0
}

// helper functions
var checkPlayer = function (turn) {
    return turn % 2 ? 'shroom' : 'snail';
}

var capitalizePlayer = function (token) {
    var splitToken = token.split('');
    splitToken[0] = splitToken[0].toUpperCase();
    return splitToken.join('');
}

var chooseRandomSquare = function () {
    // pull random square from squares object keys
    return Object.keys(squares)[Math.floor(Math.random() * 9)];
}

// game logic
var initGame = function() {
    // set turn count
    turn = 1;
    infoBox.textContent = "Get ready to rumble... slowly.";
    gameOver = false;
    
    // show player and open squares to clickability
    setTimeout(function () {
        // apply unselected to squares to open up clickability
        for (let square in squares) {
            document.getElementById(square).classList.add('unselected');
        }
        infoBox.textContent = "Shroom makes the first move!";
    }, 1000)
}

var reset = function() {
    console.log('reset clicked');
    for (let square in squares) {
        //reset values in object
        squares[square] = 0;
        //remove player tokens

        document.getElementById(square).classList.remove('snail');
        document.getElementById(square).classList.remove('shroom');
        if (document.getElementById(square).classList.contains('winning-combo')){
            document.getElementById(square).classList.remove('winning-combo')
        }
    }
    initGame();
}

var endGame = function(winCondition, playerToken) {
    // disable clicking
    for (square in squares) {
        document.getElementById(square).classList.remove('unselected');
    }
    
    // update infobox
    infoBox.textContent = capitalizePlayer(playerToken) + " claims the forest!";
    
    // highlight class of winning squares
    var winningSquares = document.getElementsByClassName(winCondition);
    for(square of winningSquares) {
        square.classList.add('winning-combo');
    }

    // highlight reset button
    document.querySelector('#reset').classList.add('win');

    // set gameOver to true
    gameOver = true;

}


var checkWinCondition = function(square,playerToken) {
    console.log('checkWin fires')
    //check win conditions that correspond to classes included included in square
    var winValues = {
        snail: 3,
        shroom: 30
    }

    var possibleWinConditions = [];

    // filter doesn't work on classList -- strip out classes unrelated to condition
    square.classList.forEach( function(cls){
        if (cls !== 'square' && cls !== 'shroom' && cls !== 'snail') {
            possibleWinConditions.push(cls);
        }
    })
    
    // check each relevant win condition
    possibleWinConditions.forEach( function(winCondition){
        // win check logic
        var squareValues = [];

        // grab html elements associated with the win condition
        var elements = document.getElementsByClassName(winCondition);
        
        // push values to squareValues array
        if (squareValues.length < 3){
            for (let i = 0; i < elements.length; i++) {
                squareValues.push(squares[elements[i].id]);        
                if (squareValues.length === 3){
                    // reduce to find sum of 3 squares in a win condition
                    var rowValue = squareValues.reduce( function(acc, sum){
                        return acc + sum;
                    })
                    
                    // check to see if rowValue is equal to 3, 30 or other
                    if (rowValue === winValues[playerToken]){
                        endGame(winCondition, playerToken);
                    }
                    squareValues.length = 0;
                }
            }
        }
    })
    
}

var playSquare = function() {
    // determine who is playing    
    var playerToken = checkPlayer(turn);
    //update message in infobox
    infoBox.textContent = capitalizePlayer(checkPlayer(turn + 1)) + "'s turn.";
    // check to see if square is free
    if (this.classList.contains('unselected')){
        // swap empty square for token
        this.classList.replace('unselected', playerToken);
        
        // add value to square object for win check
        playerToken === 'snail' ? squares[this.id]+= 1 : squares[this.id] += 10;
        
        // check for win
        if (turn >= 5) {
            checkWinCondition(this, playerToken);
            // console.log('here');
        } 
        // increment turn
        turn++
        
        // handle stalemate
        if (turn === 10 && gameOver === false){
            infoBox.textContent = "Uh-oh, looks like a... snaaaailmate.";
            gameOver = true;
        }
        
    } 
}

var playRandomSquare = function() {
    console.log('playRandomSquare fired')
    var squareChosen = document.getElementById(chooseRandomSquare());
    
    if (squareChosen.classList.contains('unselected')){
        squareChosen.click();
    } else if (gameOver !== true) {
        console.log('Recursive call', squareChosen.id);
        playRandomSquare();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    
    for (let square in squares){
        document.getElementById(square).addEventListener('click', playSquare);
    }
    document.getElementById('reset').addEventListener('click', reset);  
    infoBox = document.querySelector('#infobox h2');
    
    initGame();
})