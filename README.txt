Single Row Scrabble by sejager
GUI Programming I
This game is playable at https://sejager.github.io/Scrabble.
The repository is located at https://github.com/sejager/Scrabble.
This is a single row implementation of Scrabble where the player can use the tiles in their hand to play words.
The player will get points for that word depending on the letters used and any bonus spaces they may have been on.
If a blank tile is played the player will be asked to choose what letter they want it to be upon hitting submit.
The tiles snap to both the hand and the tileholder.
At the beginning of the game all tiles are added to a pile, from which the player will draw randomly.
Should the player feel they are unable to make a word they can choose to send back whichever tiles are currently in their hand,
these tiles will then be added back to the pile.
They will be deducted a point for each tile they send back as to not encourage simply asking for new tiles over and over again.
The total number of points as well as the number of points for the last word are displayed, as is the number of tiles remaining in the pile.
Once a player has exhausted the tiles or simply wants to quit they can hit end game.
The top 10 scores are saved in the local storage and shown when the High Scores button is pressed.
The How To button goes over some of the rules and mechanics mentioned above.
I believe everything implemented into the game functions fully but if you discover any bugs, please let me know.
I'd like to implement a word check but I'm not sure I'll have time to do that before the project deadline.
All sources I used are notated in the comments of the files at the location they were used.
The comments also explain what is going on in the code in general.