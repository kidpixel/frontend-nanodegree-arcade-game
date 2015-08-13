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
    this.speed = 30 + Math.random()*175;
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
    // Resets the x position of enemies once they go off screen.
    if (this.x < 500) {
        this.x = this.x + this.speed * dt;  // All that is needed for enemy movement...
    }
    else {
        //Enemy.prototype.setRandoms();  // Doesn't do what i thought it would.
        this.speed = 30 + Math.random()*175;
        this.x = -100; // If x position exceeds max x, above, bring it back.
        this.y = eRows[Math.round(Math.random()*2)];
    }


};




// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var playerObject = function() {
    this.hero = 'images/char-boy.png';
    //Starting place for hero sprite
    this.x = 101;
    this.y = 405;
};

playerObject.prototype.update = function(){


};

//Draw the hero sprite on the board
playerObject.prototype.render = function() {
    ctx.drawImage(Resources.get(this.hero), this.x, this.y);
};

playerObject.prototype.handleInput = function() {

// Not yet.

};


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var allEnemies = [];
for(var i = 0; i < 8; i++) {
    allEnemies.push(new Enemy());
} // After creating the array of enemies, create 20 and push instances of Enemy object into it.

var player = new playerObject;


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
