$(document).ready(function () {
    console.log('oops');
    $('.draggable').draggable();

    $('.boardTile').droppable( {
        tolerance: 'intersect',
        drop: function(event, ui) {
            if ($(this).is('.doubleLetter')) {
                console.log('doubleLetter');
            }
            else if ($(this).is('.doubleWord')) {
                console.log('doubleWord');
            }
            // Thanks to https://stackoverflow.com/a/3239600 for getting attr
            console.log($(this).attr('id'));
            // Thanks to https://stackoverflow.com/a/52454460 for getting attr of dropped object
            // Thanks to https://stackoverflow.com/a/10343518 for getting specific class from an array
            console.log(ui.draggable.attr('class').split(" ")[2]);
        }
    });

    var pos = $('#scrabbleBoard').position();
    console.log(pos.top);
    console.log(pos.left);
    console.log(pos.right);

});

