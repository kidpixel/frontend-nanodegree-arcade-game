// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    // Functional block areas are 101x83 pixels according to my Photoshopping
    // x position ... -100 is left off screen starting position
    // 101 (above) times 5 is 505, so I'll send the off screen ones back after x > 505
    this.x = -100;

    // "y" starting point array in 83 pixel increments
    var eRows = [60,143,226]; 
    // generates a random integer between 0 and 2 to select the y row
    this.y = eRows[Math.round(Math.random()*2)];
    // set minimum speed to "30" on up based on multiplier
    //this.speed = 30 + Math.random()*175;
    this.speed = 42 + Math.random()*143;
}

// Doesn't do what i thought it would.
/*
Enemy.prototype.setRandoms = function() {
        console.log('hi');
        var eRows = [60,143,226]; 
        this.speed = 30 + Math.random()*175;
        this.x = -100; // If x position exceeds max x, above, bring it back.
        this.y = eRows[Math.round(Math.random()*2)];
        return this.x,this.y,this.speed;
}
*/

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    var eRows = [60,143,226]; 
    // (Debugging comment) Match values to 73, 156, and 239... 
    // 13 apart!

    // Resets the x position of enemies once they go off screen.
    if (this.x < 500) {
        this.x = this.x + this.speed*dt;  // All that is needed for enemy movement...
    }
    else {
        //Enemy.prototype.setRandoms();  // Doesn't do what i thought it would.
        this.speed = 42 + Math.random()*143;
        this.x = -100; // If x position exceeds max x, above, bring it back.
        this.y = eRows[Math.round(Math.random()*2)];
    }

    // Check Enemy vs Player collision here.
    // Since the blocks are 101 wide, check to see if this current enemy is less than a block away from the player, then also check to see if the player and the enemy are on the same "y" level.  UPDATE: Changing it to 80 to make it closer to player width instead.     
    if ( (Math.abs(player.x-this.x)<80) && (player.y === (this.y+13)) ) {
        console.log('Collision. ' + this.x + '(' + Math.round(this.x) +') '+ this.y + '(' + (this.y+13) +')'); // this debugging line kept me sane
        player.reset();
    }

};


// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var playerClass = function() {
    this.hero = 'images/char-boy.png';
    this.x = 101;
    this.y = 405; // How can I reuse this?  Duplicate code.
};

playerClass.prototype.update = function(){

// I could use an allEnemies.forEach call and iterate through the enemies array here (like in the Engine.js updateEntities, but instead of doing all that, we can 'hijack' Enemy.prototype.update since we're checking for coordinate conditions there, too.)

};

//Draw the hero sprite on the board
playerClass.prototype.render = function() {
    ctx.drawImage(Resources.get(this.hero), this.x, this.y);
};

playerClass.prototype.reset = function() {
    this.x = 101;
    this.y = 405; // How can I reuse the playerClass this.x and this.y ?
};

playerClass.prototype.handleInput = function(allowedKeys) {

    if(allowedKeys === 'left') {
        this.x = this.x - 101;
        if (this.x < 0) { this.x = this.x + 101 };
    }
    if(allowedKeys === 'right') {
        this.x = this.x + 101;
        if(this.x > 404) { this.x = this.x - 101 };
    }
    if(allowedKeys === 'down') {
        this.y = this.y + 83;
        if(this.y > 405) { this.y = this.y - 83 };
    }
    if(allowedKeys === 'up') { this.y = this.y - 83 };

    if(this.y < 50) { 
        this.reset();
        console.log("Victory!");
    }

console.log('Player ' + this.x + ' ' + this.y); // For player debug purposes
};


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var allEnemies = [];
for(var enemies = 0; enemies < 8; enemies++) {
    allEnemies.push(new Enemy());
} // After creating the array of enemies, create a few and push instances of Enemy object into it.

var player = new playerClass;


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
