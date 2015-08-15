/* Front-End Web Developer Nanodegree - P3: Frogger Clone
 * Student: CJ.Jonson / GH: Kidtexel
 * Last Modified: 2015.8.15 ~10:20am
 * 
 * Comments: 
 * This code is part of the third FEND project, classic arcade game clone.
 * After getting the basic functionality down, I wanted to show my son
 * how I could make programming fun.  Recently he's been playing Plants vs.
 * Zombies 2, so I incorporated a "Zomboni" enemy vehicle instead of the 
 * crawling ladybug enemies... and since PvZ zombies always go from right
 * to left, I reversed the enemy flow accordingly.  Crazy Dave's taco 
 * obsession is also funny so I added a taco "gem" object and then a sound
 * track and sound effects for fun!
 * 
 * Latest Modifications: 
 *  - Ran code through JSHint and JSBeautifier
 *  - Took comment and README feedback to heart and re-did almost
 *    all of the comments by either repositioning/re-writing for a 
 *    (hopefully) Udacious "exceeds specs" result.
 *
 * Possible future updates: 
 *  - Lives counter, taco fill bar to a power-up.
 *  - Intro screen or header image
 */

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // Define the enemy-hero kill sound
    this.killSound = new Audio('audio/pvz-crazydave-win.mp3');

    /* Functional block areas are 101x83 pixels according to my Photoshopping
     * "Old" x-position was -100, but when I reversed the flow of the enemies, 
     * the starting enemy init position (or enitX) is 600.
     */
    this.enitX = 600;
    /* Initialize enemy y-position outside of this block because it is called
     * first to instantiate enemies, but also to reset and randomize them.
     */
    this.enitY = this.initializeY();

    console.log(this.enitX); // Debug info to console.
    console.log(this.enitY); // Made me realize i should return this.y in initializeY
    
    /* Instead of completely initializing all of the this.x and this.y here,
     * there was value in reducing code duplication by initializing this.x in
     * this.reset() and this.y through this.initializeY()
     */
    this.reset(); 
    /* In my way to mix it up a bit, i wanted to give 3 different ranges of color
     * based on the speed at shich each enemy was randomized to. 
     * setSprite() does that, and a TO-DO for me here is to make this implementation
     * a bit more elegant by setting 3 range variables in this block or simply
     * finding a better implementation as it feels clunky.
     */
    this.setSprite();
};

Enemy.prototype.reset = function() {
    /* Set minimum speed value and then add to it a value that can be from
     * near zero up to nearly 228, resulting in a 88 to 316 "effective range."
     */
    this.speed = 88 + Math.random() * 228; 
    // Resets x-position back to starting position
    this.x = this.enitX; 
    // Randomly alculate and set the "row" the enemy will appear on.
    this.initializeY(); 
    // As above, call setSprite() code to re-randomize color based on speed.
    this.sprite = this.setSprite();
};

Enemy.prototype.setSprite = function() {
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    
    console.log('Enemy Speed: ' + this.speed);  // Debug code.
    
    /* Originally just a blue Zomboni enemy, once my code worked I wanted to
     * make the enemies less boring. This calculates the red fast ones, 
     * the yellow medium speed ones, and green slow/blind Zombinis.
     */
    if (this.speed <= 316 && this.speed >= 228) {
        this.sprite = 'images/enemy-zomboni-red.png';
    } else if (this.speed <= 227 && this.speed >= 120) {
        this.sprite = 'images/enemy-zomboni-yellow.png';
    } else if (this.speed <= 119 && this.speed >= 0) {
        this.sprite = 'images/enemy-zomboni-green.png';
    }
    return this.sprite;
};

Enemy.prototype.initializeY = function() {
    /* Sets static "y" starting point array in 83 pixel increments
     * 226 was old third row value before I put a gras strip inbetween 2 and 3.
     */
    var eRows = [60, 143, 309]; 

    // Generates a random integer between 0 and 2 to select the y-position
    this.y = eRows[Math.round(Math.random() * 2)];
    return this.y;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    // Resets the x position of enemies once they go off screen.
    if (this.x > -100) {
        this.x = this.x - this.speed * dt; // All that is needed for enemy movement...
        // changing to negative reverses the direction of movement
    } else {
        this.reset();
    }

    // Check Enemy vs Player collision here instead.
    /* Since the blocks are 101 wide, check to see if this current enemy is less than 
     * a block away from the player, then also check to see if player and the enemy 
     * are on the same "y" level.  UPDATE: Changing it to 80 or less to make it closer 
     * to player width instead.  Around 50-ish seems to be where it feels good yet 
     * still collides.
     */
    if ((Math.abs(player.x - this.x) < 80) && (player.y === (this.y + 13))) {

        /* (Debugging comment) Match values to 73, 156, and 239... 
         * 13 apart for collision calculation. This kept me sane.
         */
        console.log('Collision. ' + this.x + '(' + Math.round(this.x) + ') ' + this.y + '(' + (this.y + 13) + ')'); 

        // Play the collision sound and then reset the player.
        this.killSound.play();
        player.reset();
    }

};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/* Introduce a gem class. The gem should behave similar to an enemy, but  
 * not move and draw at the "ground level" underneath the Zombonis.
 * This gemClass block sets some audio, speed, and sprite image.
 */ 
var gemClass = function() {
    console.log('gemclass');

    /*  Similar to the single audio object above, here in gemClass and also 
     *  in the playerClass, a small array of audio objects is created.
     */
    this.audio = [];
    this.audio[0] = new Audio('audio/pvz-tacocrunch.mp3');
    this.audio[1] = new Audio('audio/pvz-zombiescoming.mp3');
    this.audio[1].play();

    // Starting x-position for Crazy Dave's infamous taco. 
    this.enitX = 404; 

    /* I was thinking about making the tacos move in incremental "jumps" but
     * kept them static and only move when the hero touches them.
     * Keeping this here in case I want to implement something.
     */
    this.speed = 0;

    /* Set the "gem" sprite to the taco and then call reser() similar to 
     * the way I do it above in the Enemy class.
     */
    this.sprite = 'images/gem-daves-taco.png';
    this.reset();
};

// Sets gem x-position and y-position 
gemClass.prototype.reset = function() {
    console.log('reset');
    var eRows = [60, 143, 309]; // 226 old third row value

    // Move the taco along the x-axis on reset 101 to 404 to the left of enitX
    this.x = this.enitX - (101 * Math.round(Math.random() * 3));

    // Reference: Math.round(Math.random()*2) does 0-2, so 3 values
    this.y = eRows[Math.round(Math.random() * 2)];
};


// Taco "gem" collision gets calculated here
gemClass.prototype.update = function() {
    console.log('update'); // Debugging code.

    // Taco-hero collision - better known as a TACOLLISION.
    if ((Math.abs(player.x - this.x) < 50) && (player.y === (this.y + 13))) {
        console.log('TACOLLISION. ' + this.x + '(' + Math.round(this.x) + ') ' + this.y + '(' + (this.y + 13) + ')');

        /* Play the taco crunch sound to inicate a player has successfully 
         * allowed Crazy Dave to eat his taco... again.  Then re-randomize gem.
         */
        this.audio[0].play(); 
        this.reset();
    }
};

gemClass.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var playerClass = function() {
    this.hero = 'images/char-crazydave-left.png';

    // Similar to the audio arrays defined elsewhere, above.
    this.audio = [];
    this.audio[0] = new Audio('audio/pvz-gardenwarfare.mp3');
    this.audio[1] = new Audio('audio/pvz-yeehaa.mp3');

    // Here, an 'ended' event is listened for so music can be looped.
    this.audio[0].addEventListener('ended', function() {
        this.currentTime = 0;
        this.play();
    }, false);
    this.audio[0].play();

    this.initX = 505;
    this.initY = 405;
    this.reset();
};

playerClass.prototype.update = function() {

    /* I could use an allEnemies.forEach call and iterate through the enemies 
     * array here (like in the Engine.js updateEntities, but instead of
     * doing all that, we can 'hijack' Enemy.prototype.update since we're
     * checking for coordinate conditions there, too.)
     */   

};

// Draw the hero sprite on the board
playerClass.prototype.render = function() {
    ctx.drawImage(Resources.get(this.hero), this.x, this.y);
};

/* So we can reset the player from both "winning" in handleInput and
 * on an enemy collision, reset() here sets this.x and this.y instead.
 */ 
playerClass.prototype.reset = function() {
    this.x = this.initX;
    this.y = this.initY;
};

// Handle the player's keyboard input via the UP, LEFT, DOWN, RIGHT arrows.
playerClass.prototype.handleInput = function(allowedKeys) {

    if (allowedKeys === 'left') {
        this.x = this.x - 101;
        // Player presses left, Crazy Dave faces left.
        this.hero = 'images/char-crazydave-left.png';
        if (this.x < 0) {
            this.x = this.x + 101;
        }
    }
    if (allowedKeys === 'right') {
        this.x = this.x + 101;
        // Player presses right, Crazy Dave faces right... CRAZY!
        this.hero = 'images/char-crazydave-right.png';
        if (this.x > 505) {
            this.x = this.x - 101;
        }
    }
    if (allowedKeys === 'down') {
        this.y = this.y + 83;
        if (this.y > 405) {
            this.y = this.y - 83;
        }
    }
    if (allowedKeys === 'up') {
        this.y = this.y - 83;
    }

    // Checks if our hero has "won" by getting to the top.
    if (this.y < 50) {

        // Play the "yehaa" sound.
        this.audio[1].play(); 
        this.reset();
        console.log("Victory!");
    }

    console.log('Player ' + this.x + ' ' + this.y); // For player debug purposes
};


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var allEnemies = [];
for (var enemies = 0; enemies < 8; enemies++) {
 
    /* Placing the taco first in array sends it to the 'back' of the stack.
     * This felt better than setting it on top and always being above the 
     * Zombonis riding underneath it.  0 = bottom  8 = on top.
     */
    if (enemies === 0) {
        allEnemies.push(new gemClass());
    }

    // Push all the Zomboni instances into the array as it loops.
    allEnemies.push(new Enemy());
} 

var player = new playerClass();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

    /*
     *
     */