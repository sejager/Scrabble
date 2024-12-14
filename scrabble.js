/*
File: scrabble.js
Created by sejager
This is the .js page for a single line of scrabble game.
*/

// Variables used to track the pile and hand
var ScrabbleTiles = [];
var tilePile = [];
var allTiles = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "_"];

// Set up the initial game
setScrabbleTiles();
generatePile();

$(document).ready(function () {

    // Make tiles draggable and return to origin if not placed on a droppable surface
    $('.draggable').draggable( {
        revert: 'invalid'
    });

    // Make the tile holder 'cells' droppable surfaces
    $('.tileHolderCell').droppable( {

        tolerance: 'intersect',

        // What happens when a tile is dropped
        drop: function(event, ui) {

            // Change the class of the area it was on to mark it as empty
            if ($(ui.draggable).parent().hasClass('boardSpace')) {
                $(ui.draggable).parent().addClass('emptySpace');
                $(ui.draggable).parent().removeClass('occupiedSpace');
            }
            else if ($(ui.draggable).parent().hasClass('tileHolderCell')) {
                $(ui.draggable).parent().addClass('emptyCell');
                $(ui.draggable).parent().removeClass('occupiedCell');
            }
            
            // Snap the tile into the cell
            var tilePos = $(this).position().left;
            $(ui.draggable).css({'top' : '', 'left' : '', 'position' : 'absolute', 'z-index' : '1'});
            $(this).append(ui.draggable);
            // Change classes
            $(this).addClass('occupiedCell');
            $(this).removeClass('emptyCell');
        }
    })

    // Make the board spaces droppable surfaces, similar to the above code
    $('.boardSpace').droppable( {

        tolerance: 'intersect',

        drop: function(event, ui) {
            // Change former parent classes
            if ($(ui.draggable).parent().hasClass('boardSpace')) {
                $(ui.draggable).parent().addClass('emptySpace');
                $(ui.draggable).parent().removeClass('occupiedSpace');
            }
            else if ($(ui.draggable).parent().hasClass('tileHolderCell')) {
                $(ui.draggable).parent().addClass('emptyCell');
                $(ui.draggable).parent().removeClass('occupiedCell');
            }
            // Snap the tile into the space
            $(ui.draggable).css({'top' : $(this).position().top - 1, 'left' : $(this).position().left + 2, 'position' : 'absolute', 'z-index' : '1'});
            $(this).append(ui.draggable);
            // Change classes
            $(this).addClass('occupiedSpace');
            $(this).removeClass('emptySpace');
            // Check if it's a special board space
            if ($(this).is('.doubleLetter')) {
                //console.log('doubleLetter');
            }
            else if ($(this).is('.doubleWord')) {
                //console.log('doubleWord');
            }
            // Thanks to https://stackoverflow.com/a/3239600 for getting attr
            //console.log($(this).attr('id'));
            // Get what letter has just been dropped by extracting the class and removing the 'letter' part of the class name
            // Thanks to https://stackoverflow.com/a/52454460 for getting attr of dropped object
            // Thanks to https://stackoverflow.com/a/10343518 for getting specific class from an array
            // var letter = ui.draggable.attr('class').split(" ")[2].substr(6);
            //console.log(letter);
        },
    });

    // Buttons
    $('#newHand').click(function () {
        console.log('here are some fingers');
    });

    $('#submit').click(function () {
        generateHand();
    });

    console.log(tilePile);
});

// Create the pile of tiles that will be taken from to regenerate the player's hand
function generatePile() {
    allTiles.forEach(function (value, index, array) {
        for (let x = 0; x < ScrabbleTiles[value].number; x++) {
            tilePile.push(value);
        }
    });
}

// Generates enough tiles to have a complete hand (unless the pile becomes empty)
function generateHand() {
    // For each empty cell pick a random tile from the pile and change the cell's classes
    $('.emptyCell').each(function() {
        var newTile = getTile();
        var newTileWidget = (document.createElement('div'));
        var attributes = 'ui-widget-content draggable letter' + newTile;
        newTileWidget.setAttribute('class', attributes);
        newTileWidget.innerHTML = '<img class="tiles" src="' + ScrabbleTiles[newTile].imageLink + '.">';
        $(this).append(newTileWidget);
        $(this).addClass('occupiedCell');
        $(this).removeClass('emptyCell');
    });

    $('.draggable').draggable( {
        revert: 'invalid'
    });
}

// Function returns a random tile from the remaining pile and then removes that tile from the pile and decrements the number in the ScrabbleTiles array for that tile
// Thanks to https://stackoverflow.com/a/4550514 for getting a random object out of an array
function getTile () {
    var index = Math.floor(Math.random() * tilePile.length);
    var tile = tilePile[index];
    tilePile.splice(index, 1);
    ScrabbleTiles[tile].number--;
    return tile;
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
    ScrabbleTiles["A"] = { "value" : 1, "number" : 9, "imageLink" : "./graphics_data/Scrabble_Tiles/Scrabble_Tile_A.jpg"  } ;
    ScrabbleTiles["B"] = { "value" : 3, "number" : 2, "imageLink" : "./graphics_data/Scrabble_Tiles/Scrabble_Tile_B.jpg"  } ;
    ScrabbleTiles["C"] = { "value" : 3, "number" : 2, "imageLink" : "./graphics_data/Scrabble_Tiles/Scrabble_Tile_C.jpg"  } ;
    ScrabbleTiles["D"] = { "value" : 2, "number" : 4, "imageLink" : "./graphics_data/Scrabble_Tiles/Scrabble_Tile_D.jpg"  } ;
    ScrabbleTiles["E"] = { "value" : 1, "number" : 12, "imageLink" : "./graphics_data/Scrabble_Tiles/Scrabble_Tile_E.jpg" } ;
    ScrabbleTiles["F"] = { "value" : 4, "number" : 2, "imageLink" : "./graphics_data/Scrabble_Tiles/Scrabble_Tile_F.jpg"  } ;
    ScrabbleTiles["G"] = { "value" : 2, "number" : 3, "imageLink" : "./graphics_data/Scrabble_Tiles/Scrabble_Tile_G.jpg"  } ;
    ScrabbleTiles["H"] = { "value" : 4, "number" : 2, "imageLink" : "./graphics_data/Scrabble_Tiles/Scrabble_Tile_H.jpg"  } ;
    ScrabbleTiles["I"] = { "value" : 1, "number" : 9, "imageLink" : "./graphics_data/Scrabble_Tiles/Scrabble_Tile_I.jpg"  } ;
    ScrabbleTiles["J"] = { "value" : 8, "number" : 1, "imageLink" : "./graphics_data/Scrabble_Tiles/Scrabble_Tile_J.jpg"  } ;
    ScrabbleTiles["K"] = { "value" : 5, "number" : 1, "imageLink" : "./graphics_data/Scrabble_Tiles/Scrabble_Tile_K.jpg"  } ;
    ScrabbleTiles["L"] = { "value" : 1, "number" : 4, "imageLink" : "./graphics_data/Scrabble_Tiles/Scrabble_Tile_L.jpg"  } ;
    ScrabbleTiles["M"] = { "value" : 3, "number" : 2, "imageLink" : "./graphics_data/Scrabble_Tiles/Scrabble_Tile_M.jpg"  } ;
    ScrabbleTiles["N"] = { "value" : 1, "number" : 6, "imageLink" : "./graphics_data/Scrabble_Tiles/Scrabble_Tile_N.jpg"  } ;
    ScrabbleTiles["O"] = { "value" : 1, "number" : 8, "imageLink" : "./graphics_data/Scrabble_Tiles/Scrabble_Tile_O.jpg"  } ;
    ScrabbleTiles["P"] = { "value" : 3, "number" : 2, "imageLink" : "./graphics_data/Scrabble_Tiles/Scrabble_Tile_P.jpg"  } ;
    ScrabbleTiles["Q"] = { "value" : 10, "number" : 1, "imageLink" : "./graphics_data/Scrabble_Tiles/Scrabble_Tile_Q.jpg"  } ;
    ScrabbleTiles["R"] = { "value" : 1, "number" : 6, "imageLink" : "./graphics_data/Scrabble_Tiles/Scrabble_Tile_R.jpg"  } ;
    ScrabbleTiles["S"] = { "value" : 1, "number" : 4, "imageLink" : "./graphics_data/Scrabble_Tiles/Scrabble_Tile_S.jpg"  } ;
    ScrabbleTiles["T"] = { "value" : 1, "number" : 6, "imageLink" : "./graphics_data/Scrabble_Tiles/Scrabble_Tile_T.jpg"  } ;
    ScrabbleTiles["U"] = { "value" : 1, "number" : 4, "imageLink" : "./graphics_data/Scrabble_Tiles/Scrabble_Tile_U.jpg"  } ;
    ScrabbleTiles["V"] = { "value" : 4, "number" : 2, "imageLink" : "./graphics_data/Scrabble_Tiles/Scrabble_Tile_V.jpg"  } ;
    ScrabbleTiles["W"] = { "value" : 4, "number" : 2, "imageLink" : "./graphics_data/Scrabble_Tiles/Scrabble_Tile_W.jpg"  } ;
    ScrabbleTiles["X"] = { "value" : 8, "number" : 1, "imageLink" : "./graphics_data/Scrabble_Tiles/Scrabble_Tile_X.jpg"  } ;
    ScrabbleTiles["Y"] = { "value" : 4, "number" : 2, "imageLink" : "./graphics_data/Scrabble_Tiles/Scrabble_Tile_Y.jpg"  } ;
    ScrabbleTiles["Z"] = { "value" : 10, "number" : 1, "imageLink" : "./graphics_data/Scrabble_Tiles/Scrabble_Tile_Z.jpg"  } ;
    ScrabbleTiles["_"] = { "value" : 0, "number" : 2, "imageLink" : "./graphics_data/Scrabble_Tiles/Scrabble_Tile_Blank.jpg"  } ;
}


