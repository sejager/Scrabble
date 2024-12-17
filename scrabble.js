/*
File: scrabble.js
Created by sejager
This is the .js page for a single line of scrabble game.
*/

// Variables used to track the pile and hand
var totalPoints = 0;
var ScrabbleTiles = [];
var tilePile = [];
var allTiles = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "_"];
var capitalLetters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
var lowercaseLetters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
var letterArray = [];

// Set up the initial game
setScrabbleTiles();
generatePile();
generateHand();
updatePoints(0);
// Use to delete high scores
// localStorage.setItem('scores', '');
setHighScores();

$(document).ready(function () {

    // Make tiles draggable and return to origin if not placed on a droppable surface
    $('.draggable').draggable( { revert: 'invalid' } );

    // Make the tile holder 'cells' droppable surfaces
    $('.tileHolderCell').droppable( {

        tolerance: 'intersect',
        // Start off as disabled since it's already occupied
        disabled: true,

        // What happens when a tile is dropped
        drop: function(event, ui) {
            // Enable dropping on former area
            $(ui.draggable).parent().droppable('option', 'disabled', false);
            
            // Snap the tile into the cell
            var tilePos = $(this).position().left;
            $(ui.draggable).css({'top' : '', 'left' : '', 'position' : 'absolute', 'z-index' : '1'});
            $(this).append(ui.draggable);
            // Disable dropping
            $(this).droppable('option', 'disabled', true);
        }
    });

    // Make the board spaces droppable surfaces, similar to the above code
    $('.boardSpace').droppable( {

        tolerance: 'intersect',

        drop: function(event, ui) {
            // Enable dropping on former area
            $(ui.draggable).parent().droppable('option', 'disabled', false);

            // Snap the tile into the space
            $(ui.draggable).css({'top' : $(this).position().top - 1, 'left' : $(this).position().left + 2, 'position' : 'absolute', 'z-index' : '1'});
            $(this).append(ui.draggable);
            // Disable dropping
            $(this).droppable('option', 'disabled', true);

            // Check if it's a special board space
            if ($(this).is('.doubleLetter')) {
                //console.log('doubleLetter');
            }
            else if ($(this).is('.doubleWord')) {
                //console.log('doubleWord');
            }
            
            //console.log(letter);
        },
    });

    validateLetter();

    // Buttons
    $('#newHand').click(function () {
        newHand();
    });

    $('#submit').click(function () {
        checkSubmission();
    });

    $('#endGameConfirmation').click(function () {
        endGame();
    });

    // Checks if input is valid when asked to select a letter
    $('#letterConfirmation').click(function () {
        if ($('#letterSelection').valid() == true) {
            console.log('hey');
            selectedLetter();
        }
    });

    $('#closeButton').click(function () {
        $('#selectedLetterTwo').attr('disabled', 'true');
    })
});

// Create the pile of tiles that will be taken from to regenerate the player's hand
function generatePile() {
    tilePile = [];
    allTiles.forEach(function (value, index, array) {
        for (let x = 0; x < ScrabbleTiles[value].number; x++) {
            tilePile.push(value);
        }
    });
}

// Generates enough tiles to have a complete hand (unless the pile becomes empty)
function generateHand() {
    // Go through each cell and check if it's empty and if it is then place a new tile on it
    $('.tileHolderCell').each(function() {
        if (tilePile.length == 0) {
            alert('No more tiles!');
            return;
        }
        if (!$(this).hasClass('ui-droppable-disabled')) {
            var newTile = getTile();
            var newTileWidget = (document.createElement('div'));
            var attributes = 'ui-widget-content draggable letter' + newTile;
            newTileWidget.setAttribute('class', attributes);
            newTileWidget.innerHTML = '<img class="tiles" src="' + ScrabbleTiles[newTile].imageLink + '.">';
            $(this).append(newTileWidget);
            $(this).addClass('ui-droppable-disabled');
            $(this).droppable( { disabled: true } );
        }
    });

    $('.draggable').draggable( { revert: 'invalid' } );

    // Update tiles left info
    $('#tilesInfo').text('Tiles Left in Pile: ' + tilePile.length);
}

// Function returns a random tile from the remaining pile and then removes that tile from the pile
// (commented out) Also decrements the number in the ScrabbleTiles array for that tile.
// Thanks to https://stackoverflow.com/a/4550514 for getting a random object out of an array
function getTile () {
    var index = Math.floor(Math.random() * tilePile.length);
    var tile = tilePile[index];
    tilePile.splice(index, 1);
    // ScrabbleTiles[tile].number--;
    return tile;
}

// Checks that the submission is valid; if not, alert the user and exit the function
function checkSubmission() {
    // Get all board spaces
    var emptySpaces = [];
    $('.boardSpace').each(function() {
        emptySpaces.push($(this).hasClass('ui-droppable-disabled'))
    });
    if (!emptySpaces.includes(true)) {
        alert('You must place a tile on the board!');
        return;
    }
    // Thanks to https://www.w3schools.com/Jsref/jsref_lastindexof_array.asp and https://www.w3schools.com/Jsref/jsref_includes_array.asp
    if (emptySpaces.slice(0, emptySpaces.lastIndexOf(true)).includes(false)) {
        alert('There cannot be any gaps in the submission.');
        return;
    }
    // Get the letters and their values and apply any bonuses and then clear the board and refill the hand
    checkForBlanks();
}

// Simply updates the points
function updatePoints(wordPoints) {
    $('#wordPointsInfo').text('Points For Last Word: ' + wordPoints);
    $('#totalPointsInfo').text('Total Points: ' + totalPoints);
}

function checkForBlanks() {
    letterArray = [];
    blankNumber = 0;
    $('.boardSpace').each(function() {
        if($(this).hasClass('ui-droppable-disabled')) {
            // Check if the tile is a blank tile
            if($(this).find('div.draggable').hasClass('letter_')) {
                blankNumber++;
            }
        }
    });
    // Make the player pick a letter for each blank
    if (blankNumber > 0) { selectLetter(blankNumber); }
    // Or just get the word if there are none
    else { getWord(); }
}

// Puts together the word and calculates the points
function getWord() {
    var blankNumber = 0;
    var hasDoubleWord = false;
    var wordPoints = 0;
    var letter = '';
    $('.boardSpace').each(function() {
        if($(this).hasClass('ui-droppable-disabled')) {
            // Check if the tile is a blank tile, if so, get the chosen letters from the array
            if($(this).find('div.draggable').hasClass('letter_')) {
                letter = letterArray[blankNumber];
                blankNumber++;
            }
            // Else get what letter has just been dropped by extracting the class and removing the 'letter' part of the class name
            // Thanks to https://stackoverflow.com/a/52454460 for getting attr of dropped object
            // Thanks to https://stackoverflow.com/a/10343518 for getting specific class from an array
            else { 
                letter = $(this).find('div.draggable').attr('class').split(" ")[2].substr(6);
            } 
            if ($(this).hasClass('doubleLetter')) { wordPoints += ScrabbleTiles[letter].value * 2; }
            else { wordPoints += ScrabbleTiles[letter].value; }
            if ($(this).hasClass('doubleWord')) { hasDoubleWord = true; }
        }
    });
    if (hasDoubleWord) { totalPoints += wordPoints * 2; }
    else { totalPoints += wordPoints; }

    updatePoints(wordPoints);
    clearBoard();
    generateHand();
}

// Opens the select letter modal and enables second input field if there are two blank tiles
function selectLetter(blankNumber = 0) {
    // Thanks to https://www.geeksforgeeks.org/bootstrap-5-modal-via-javascript
    if (blankNumber == 2) {
        $('#selectedLetterTwo').removeAttr('disabled');
    }
    var selectModal = new bootstrap.Modal(document.getElementById('letterSelectModal'));
    selectModal.show();
}

// Push the selected letter(s) to an array
function selectedLetter() {
    var letter = $('#selectedLetterOne').val();
    if (lowercaseLetters.includes(letter)) {
        letterArray.push(capitalLetters[lowercaseLetters.indexOf(letter)]);
    }
    else {
        letterArray.push(letter);
    }
    if (!$('#selectedLetterTwo').attr('disabled')) {
        letter = $('#selectedLetterTwo').val();
        if (lowercaseLetters.includes(letter)) {
            letterArray.push(capitalLetters[lowercaseLetters.indexOf(letter)]);
        }
        else {
            letterArray.push(letter);
        }
    }
    getWord();
}

// Checks that the user input a letter
function validateLetter() {
    jQuery.validator.addMethod('isLetter', function (value, element, param) {
        return capitalLetters.includes(value) || lowercaseLetters.includes(value);
    }, jQuery.validator.format('You must input a single letter.'));

    $('#letterSelection').validate({
        // Thanks to https://stackoverflow.com/a/27430858
        errorElement: 'div',
        rules: {
            selectedLetterOne: {
                isLetter: true
            },
            selectedLetterTwo: {
                isLetter: true
            }
        }
    });
}

// On a successful submission the tiles are removed from the board
function clearBoard() {
    $('.boardSpace').each(function() {
        if($(this).hasClass('ui-droppable-disabled')) {
            // Get the tile and enable dropping
            $(this).children('.draggable').remove();
            $(this).droppable( { disabled: false } );
        }
    });
}

// Clear all tiles from the hand when ending the game
function clearHand() {
    $('.tileHolderCell').each(function() {
        if($(this).hasClass('ui-droppable-disabled')) {
            // Get the tile and enable dropping
            $(this).children('.draggable').remove();
            $(this).droppable( { disabled: false } );
        }
    });
}

// Place all the tiles in the holder back into the pile and get new ones
function newHand() {
    $('.tileHolderCell').each(function() {
        if($(this).hasClass('ui-droppable-disabled')) {
            // Get the letters from the tiles and push those back onto the pile
            var letter = $(this).find('div.draggable').attr('class').split(" ")[2].substr(6);
            tilePile.push(letter);
            // Make the cells draggable again after removing the tiles
            $(this).children('.draggable').remove();
            $(this).droppable( { disabled: false } );
            totalPoints--;
        }
    });
    $('#totalPointsInfo').text('Total Points: ' + totalPoints);
    generateHand();
}

// List the high scores in the modal while also trimming the list to be only the top 10
// Thanks to https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
function setHighScores() {
    document.getElementById('scoresModalBody').innerHTML = '';
    var allScores = localStorage.getItem('scores');
    // Split up the string into an array and sort the high scores
    // Thanks to https://www.w3schools.com/jsref/jsref_sort.asp
    var scoresArray = allScores.split('@').sort(function(a, b){return b-a});
    allScores = '';
    localStorage.setItem('scores', '');
    for (let x = 0; x < 10 && x < scoresArray.length; x++) {
        allScores += scoresArray[x] + '@';
        document.getElementById('scoresModalBody').innerHTML += scoresArray[x] + '<br>';
    }
    // Remove the final break
    document.getElementById('scoresModalBody').innerHTML = document.getElementById('scoresModalBody').innerHTML.slice(0, -4);
    // Remove the final space
    allScores.slice(0,-1);
    // Return the string of the sorted high scores to the storage
    localStorage.setItem('scores', allScores.slice(0,-1));
}

function resetGame() {
    // setScrabbleTiles();
    clearBoard();
    clearHand();
    totalPoints = 0;
    updatePoints(0);
    generatePile();
    generateHand();
}

// Ends the game and starts a new one, if there are points they will be recorded
function endGame() {
    if (totalPoints != 0) {
        var allScores = localStorage.getItem('scores');
        if (allScores.length == 0) { allScores = totalPoints; }
        else { allScores += '@' + totalPoints; }
        localStorage.setItem('scores', allScores);
        setHighScores();
    }
    resetGame();
}

/*  Original File:  /~heines/91.461/91.461-2015-16f/461-assn/Scrabble_Pieces_AssociativeArray_Jesse.js
 *  Jesse M. Heines, UMass Lowell Computer Science, heines@cs.uml.edu
 *  Copyright (c) 2015 by Jesse M. Heines.  All rights reserved.  May be freely 
 *    copied or excerpted for educational purposes with credit to the author.
 *  updated by JMH on November 21, 2015 at 10:27 AM
 *  updated by JMH on November 25, 2015 at 10:58 AM to add the blank tile
 *  updated by JMH on November 27, 2015 at 10:22 AM to add original-distribution
 *  updated by sejager on December 13th, 2024 at 08:01 PM to add urls to each tile and remove original-distribution.
 */

function setScrabbleTiles() {
    ScrabbleTiles["A"] = { "value" : 1,  "number" : 9,  "imageLink" : "./graphics_data/Scrabble_Tiles/Scrabble_Tile_A.jpg"  } ;
    ScrabbleTiles["B"] = { "value" : 3,  "number" : 2,  "imageLink" : "./graphics_data/Scrabble_Tiles/Scrabble_Tile_B.jpg"  } ;
    ScrabbleTiles["C"] = { "value" : 3,  "number" : 2,  "imageLink" : "./graphics_data/Scrabble_Tiles/Scrabble_Tile_C.jpg"  } ;
    ScrabbleTiles["D"] = { "value" : 2,  "number" : 4,  "imageLink" : "./graphics_data/Scrabble_Tiles/Scrabble_Tile_D.jpg"  } ;
    ScrabbleTiles["E"] = { "value" : 1,  "number" : 12,  "imageLink" : "./graphics_data/Scrabble_Tiles/Scrabble_Tile_E.jpg" } ;
    ScrabbleTiles["F"] = { "value" : 4,  "number" : 2,  "imageLink" : "./graphics_data/Scrabble_Tiles/Scrabble_Tile_F.jpg"  } ;
    ScrabbleTiles["G"] = { "value" : 2,  "number" : 3,  "imageLink" : "./graphics_data/Scrabble_Tiles/Scrabble_Tile_G.jpg"  } ;
    ScrabbleTiles["H"] = { "value" : 4,  "number" : 2,  "imageLink" : "./graphics_data/Scrabble_Tiles/Scrabble_Tile_H.jpg"  } ;
    ScrabbleTiles["I"] = { "value" : 1,  "number" : 9,  "imageLink" : "./graphics_data/Scrabble_Tiles/Scrabble_Tile_I.jpg"  } ;
    ScrabbleTiles["J"] = { "value" : 8,  "number" : 1,  "imageLink" : "./graphics_data/Scrabble_Tiles/Scrabble_Tile_J.jpg"  } ;
    ScrabbleTiles["K"] = { "value" : 5,  "number" : 1,  "imageLink" : "./graphics_data/Scrabble_Tiles/Scrabble_Tile_K.jpg"  } ;
    ScrabbleTiles["L"] = { "value" : 1,  "number" : 4,  "imageLink" : "./graphics_data/Scrabble_Tiles/Scrabble_Tile_L.jpg"  } ;
    ScrabbleTiles["M"] = { "value" : 3,  "number" : 2,  "imageLink" : "./graphics_data/Scrabble_Tiles/Scrabble_Tile_M.jpg"  } ;
    ScrabbleTiles["N"] = { "value" : 1,  "number" : 6,  "imageLink" : "./graphics_data/Scrabble_Tiles/Scrabble_Tile_N.jpg"  } ;
    ScrabbleTiles["O"] = { "value" : 1,  "number" : 8,  "imageLink" : "./graphics_data/Scrabble_Tiles/Scrabble_Tile_O.jpg"  } ;
    ScrabbleTiles["P"] = { "value" : 3,  "number" : 2,  "imageLink" : "./graphics_data/Scrabble_Tiles/Scrabble_Tile_P.jpg"  } ;
    ScrabbleTiles["Q"] = { "value" : 10, "number" : 1,  "imageLink" : "./graphics_data/Scrabble_Tiles/Scrabble_Tile_Q.jpg"  } ;
    ScrabbleTiles["R"] = { "value" : 1,  "number" : 6,  "imageLink" : "./graphics_data/Scrabble_Tiles/Scrabble_Tile_R.jpg"  } ;
    ScrabbleTiles["S"] = { "value" : 1,  "number" : 4,  "imageLink" : "./graphics_data/Scrabble_Tiles/Scrabble_Tile_S.jpg"  } ;
    ScrabbleTiles["T"] = { "value" : 1,  "number" : 6,  "imageLink" : "./graphics_data/Scrabble_Tiles/Scrabble_Tile_T.jpg"  } ;
    ScrabbleTiles["U"] = { "value" : 1,  "number" : 4,  "imageLink" : "./graphics_data/Scrabble_Tiles/Scrabble_Tile_U.jpg"  } ;
    ScrabbleTiles["V"] = { "value" : 4,  "number" : 2,  "imageLink" : "./graphics_data/Scrabble_Tiles/Scrabble_Tile_V.jpg"  } ;
    ScrabbleTiles["W"] = { "value" : 4,  "number" : 2,  "imageLink" : "./graphics_data/Scrabble_Tiles/Scrabble_Tile_W.jpg"  } ;
    ScrabbleTiles["X"] = { "value" : 8,  "number" : 1,  "imageLink" : "./graphics_data/Scrabble_Tiles/Scrabble_Tile_X.jpg"  } ;
    ScrabbleTiles["Y"] = { "value" : 4,  "number" : 2,  "imageLink" : "./graphics_data/Scrabble_Tiles/Scrabble_Tile_Y.jpg"  } ;
    ScrabbleTiles["Z"] = { "value" : 10, "number" : 1,  "imageLink" : "./graphics_data/Scrabble_Tiles/Scrabble_Tile_Z.jpg"  } ;
    ScrabbleTiles["_"] = { "value" : 0,  "number" : 2,  "imageLink" : "./graphics_data/Scrabble_Tiles/Scrabble_Tile_Blank.jpg"  } ;
}


