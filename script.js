// Select the <canvas> element
var canvas = document.getElementById("canvas");

// Create the canvas context
var context = canvas.getContext('2d');

// Select the two <span> elements in index.html
var playerOneLives = document.getElementById("player-one-lives");
var playerTwoLives = document.getElementById("player-two-lives");

// Array to store all projectile objects
var projectiles = [];

// Configuration
var playerSpeed = 10;
var ammoLimit = 5;

// An object with keys that are keys and values that are booleans representing whether or not
// that key is currently pressed down
var keysDown = {
  w: false,
  a: false,
  s: false,
  d: false,
  p: false,
  l: false,
  ";": false,
  "'": false
}

// All the images that we'll be using
var backgroundImage = new Image();
backgroundImage.src = "https://i.pinimg.com/originals/47/59/b6/4759b6d22851903cdac959d535e297ad.jpg";

var playerOneImage = new Image();
playerOneImage.src = "https://i.pinimg.com/736x/70/fb/42/70fb42f4bc338ff98801e17eda9172bf.jpg";

var playerTwoImage = new Image()
playerTwoImage.src = "http://static.tumblr.com/e540e7a205cbd8bf7742588e48bf0eee/galelgk/QBPnhdh74/tumblr_static_9by2i8fxmyo0wo4s0o0gssoo4.png"

// Define the two player objects
var playerOne = {
  number: 1,
  colour: "blue",
  lives: 10,
  items: [],
  size: 75,
  image: playerOneImage,
  direction: "right",
  initialx: 10,
  initialy: 10,
  x: 10,
  y: 10
}

var playerTwo = {
  number: 2,
  colour: "red",
  lives: 10,
  items: [],
  size: 75,
  image: playerTwoImage,
  direction: "left",
  initialx: canvas.width - 120,
  initialy: canvas.height - 120,
  x: canvas.width - 120,
  y: canvas.height - 120
}

// Takes in a player object as an argument and draws it
function drawPlayer(player) {
  context.drawImage(player.image, player.x, player.y, player.size, player.size);
}

function fireProjectile(player) {
  // If the player has enough ammo
  if (doesPlayerHaveEnoughAmmo(player, ammoLimit)) {
    
    // Create a new projectile
    var newProjectile = {
      playerNumber: player.number,
      x: player.x + player.size / 2,
      y: player.y + player.size / 2,
      direction: player.direction,   // Give it the direction of the player
      size: 10,
      speed: 20
    };
    
    // and add it to the array of projectiles
    projectiles.push(newProjectile);
  }
}

// Draws a given projectiles
function drawProjectile(projectile) {
  context.fillStyle = "black"; // Maybe black is not the best colour
  context.fillRect(projectile.x, projectile.y, projectile.size, projectile.size);
}

function deleteAllOutOfBoundsProjectiles() {
  // An array to store the indexes of all the projectiles that should be deleted
  var deleteAtIndexes = [];

  // Loop throught the projectiles array
  for (var i = 0; i < projectiles.length; i++) {
    var projectile = projectiles[i];

    // If the projectile is out of bounds
    if (projectile.x + projectile.size > canvas.width ||
      projectile.x < 0                                ||
      projectile.y + projectile.size > canvas.height  ||
      projectile.y < 0
    ) {
      // Add its index to the array of to-be deleted indexes
      deleteAtIndexes.push(i);
    }
  }

  // Loop through the array of to-be deleted indexes
  for (var i = 0; i < deleteAtIndexes.length; i++) {
    var deletionIndex = deleteAtIndexes[i];

    // And deleted (splice) the projectile at that index from the projectiles array
    projectiles.splice(deletionIndex, 1);
  }
}

// Given a player and a limit (a number) return true or false depending on whether the player
// has enough ammo
function doesPlayerHaveEnoughAmmo(player, limit) {
  // Initialize our counter at zero
  var onScreenProjectiles = 0;

  // Loop through all the projectiles
  for (var i = 0; i < projectiles.length; i++) {
    var projectile = projectiles[i];

    // If the projectile belongs to the player
    if (projectile.playerNumber === player.number) {

      // Increment the counter by one
      onScreenProjectiles++;      
    }
  }

  // Is the amount of projectiles on screen greater than the limit we passed in as an argument?
  if (onScreenProjectiles < limit) {
    return true;
  } else {
    return false;
  }
}

// Takes two objects and returns true or false depending on whether or not they're touching
function areTheyTouching(thingOne, thingTwo) {
  // Variables for all the positions of thier sides
  var thingOneTop = thingOne.y;
  var thingOneBottom = thingOne.y + thingOne.size;
  var thingOneLeft = thingOne.x;
  var thingOneRight = thingOne.x + thingOne.size;

  var thingTwoTop = thingTwo.y;
  var thingTwoBottom = thingTwo.y + thingTwo.size;
  var thingTwoLeft = thingTwo.x;
  var thingTwoRight = thingTwo.x + thingTwo.size;

  // A little magic
  if (
    thingOneTop < thingTwoBottom &&
    thingOneBottom > thingTwoTop &&
    thingOneRight > thingTwoLeft &&
    thingOneLeft < thingTwoRight
  ) {
    return true;
  } else {
    return false;
  }
}

// Clears the entire board with an image
// Used each frame 
function clearBoard() {
  context.drawImage(backgroundImage, -20, -20, backgroundImage.width * 0.7, backgroundImage.height * 0.7);
}

// Event listeners

// Function is called whenever a key is being pressed down
document.addEventListener("keydown", function(event) {
  // `event.key` stores the key that was pressed when this event occured

  // Update the keysDown object to say that the keys is now pressed down
  keysDown[event.key] = true;
  
  // Change the direction of the player
  // Player One
  if (event.key === "w") { playerOne.direction = "up"; };
  if (event.key === "s") { playerOne.direction = "down"; };
  if (event.key === "a") { playerOne.direction = "left"; };
  if (event.key === "d") { playerOne.direction = "right"; };

  // Player Two
  if (event.key === "ArrowUp") { playerTwo.direction = "up"; };
  if (event.key === "ArrowDown") { playerTwo.direction = "down"; };
  if (event.key === "ArrowLeft") { playerTwo.direction = "left"; };
  if (event.key === "ArrowRight") { playerTwo.direction = "right"; };
});

// Function is called whenever a key is released
document.addEventListener("keyup", function(event) {
  // Update the keysDown object to say that the keys is now pressed up
  keysDown[event.key] = false;

  // Fire buttons
  if (event.code === "Space") {
    fireProjectile(playerTwo);
  } else if (event.code === "Slash") {
    fireProjectile(playerOne);
  }
});

// Called whenever someone is hit by a projectile
function resetRound() {
  // Resets the players back to their initial positions
  playerOne.x = playerOne.initialx;
  playerOne.y = playerOne.initialy;

  playerTwo.x = playerTwo.initialx;
  playerTwo.y = playerTwo.initialy;

  // Deltes all the projectiles
  projectiles = [];

  updatePlayerLives();
}

// Called whenever someone loses all their lives
function resetGame() {
  // Resets the players back to their initial positions
  // And resets their lives back to ten
  playerOne.x = playerOne.initialx;
  playerOne.y = playerOne.initialy;
  playerOne.lives = 10;

  playerTwo.x = playerTwo.initialx;
  playerTwo.y = playerTwo.initialy;
  playerTwo.lives = 10;

  // Deltes all the projectiles
  projectiles = [];
  updatePlayerLives();
}

// Takes the two <span> elements and sets their inner HTML to the number of player lives
function updatePlayerLives() {
  playerOneLives.innerHTML = playerOne.lives;
  playerTwoLives.innerHTML = playerTwo.lives;
}


// Big Game Loop
setInterval(function() {
  // If the right key is being pressed down and the player AND the player is not out of bounds
  // Change the players X or Y position by their speed

  // Player One
  if (keysDown.w && playerOne.y)                                     { playerOne.y -= playerSpeed; };
  if (keysDown.s && playerOne.y + playerOne.size < canvas.height)    { playerOne.y += playerSpeed; };
  if (keysDown.a && playerOne.x > 0)                                 { playerOne.x -= playerSpeed; };
  if (keysDown.d && playerOne.x + playerOne.size < canvas.width)     { playerOne.x += playerSpeed; };
  // Player Two
  if (keysDown.ArrowUp    && playerTwo.y > 0)                                 { playerTwo.y -= playerSpeed; };
  if (keysDown.ArrowDown  && playerTwo.y + playerTwo.size < canvas.height)    { playerTwo.y += playerSpeed; };
  if (keysDown.ArrowLeft  && playerTwo.x > 0)                                 { playerTwo.x -= playerSpeed; };
  if (keysDown.ArrowRight && playerTwo.x + playerTwo.size< canvas.width)      { playerTwo.x += playerSpeed; };

  clearBoard();
  deleteAllOutOfBoundsProjectiles();

  // Loop through all the projectils and, depending on what their direction is, change their
  // X or Y position by the projectiles speed
  for (var i = 0; i < projectiles.length; i++) {
    var projectile = projectiles[i];

    switch (projectile.direction) {
      case "down":
        projectile.y += projectile.speed;
        break;
      case "up":
        projectile.y -= projectile.speed;
        break;
      case "right":
        projectile.x += projectile.speed;
        break;
      case "left":
        projectile.x -= projectile.speed;
        break;
    }

    // Check if player one and player two are touching the projectile
    // And if it's the enemy's projectile, reduce their lives, and reset the round
    if (projectile.playerNumber == 2 && areTheyTouching(playerOne, projectile)) {
      playerOne.lives--;
      resetRound();
    } else if (projectile.playerNumber == 1 && areTheyTouching(playerTwo, projectile)) {
      playerTwo.lives--;
      resetRound();
    }

    // If they're out of lives it's game over!
    if (playerOne.lives === 0) {
      console.log("PLAYER TWO WINS THE GAME!!!!!!!!!!!!!!");
      resetGame();
    } else if (playerTwo.lives === 0) {
      console.log("PLAYER ONE WINS THE GAME!!!!!!!!!!!!!!");
      resetGame();
    }

    // Draw the projectile
    drawProjectile(projectile);
  }
  // Projectile loop ends

  // Draw player one, then player two
  drawPlayer(playerTwo);
  drawPlayer(playerOne);
}, 30);
// ^ Redraw every 30 milliseconds
