/* ------------- Winter 2024 EECS 493 Assignment 3 Starter Code ------------ */

/* ------------------------ GLOBAL HELPER VARAIBLES ------------------------ */
// Difficulty Helpers
let astProjectileSpeed = 3;            // easy: 1, norm: 3, hard: 5
let astSpawnRate = 800;             // easy: 1000, norm: 800, hard: 600
var danger = 20;                      // easy: 10, norm: 20, hard: 30

// Game Object Helpers
let currentAsteroid = 1;
const AST_OBJECT_REFRESH_RATE = 15;
const maxPersonPosX = 1218;
const maxPersonPosY = 658;
const PERSON_SPEED = 5;                // #pixels each time player moves by
const portalOccurrence = 15000;        // portal spawns every 15 seconds
const portalGone = 5000;               // portal disappears in 5 seconds
const shieldOccurrence = 10000;        // shield spawns every 10 seconds
const shieldGone = 5000;               // shield disappears in 5 seconds

// Game States
var playCtr = 0;
var gameOver = false;
var level = 1;
var score = 0;
var currDiff = 'normal';

var shielded = false;

// Sounds
var collectSound = new Audio("src/audio/collect.mp3");
var deathSound = new Audio("src/audio/die.mp3");

// Movement Helpers
let LEFT = false;
let RIGHT = false;
let UP = false;
let DOWN = false;

// TODO: ADD YOUR GLOBAL HELPER VARIABLES (IF NEEDED)

/* --------------------------------- MAIN ---------------------------------- */
$(document).ready(function () {
  // jQuery selectors
  game_window = $('.game-window');
  game_screen = $("#actual-game");
  asteroid_section = $('.asteroidSection');
  landing_page = $("#main");
  getReady = $('#getReady');
  gameOvah = $('#gameOver');
  scoreboard = $('#scorePanel');
  // hide all other pages initially except landing page
  game_screen.hide();
  // landing_page.hide();
  // start_game();

  console.log("Up and runnin'!");
  // Example: Spawn an asteroid that travels from one border to another
  // spawn(); // Uncomment me to test out the effect!
});


/* ---------------------------- EVENT HANDLERS ----------------------------- */
// Keydown event handler
document.onkeydown = function (e) {
  if (e.key == 'ArrowLeft') LEFT = true;
  if (e.key == 'ArrowRight') RIGHT = true;
  if (e.key == 'ArrowUp') UP = true;
  if (e.key == 'ArrowDown') DOWN = true;
}

// Keyup event handler
document.onkeyup = function (e) {
  if (e.key == 'ArrowLeft') LEFT = false;
  if (e.key == 'ArrowRight') RIGHT = false;
  if (e.key == 'ArrowUp') UP = false;
  if (e.key == 'ArrowDown') DOWN = false;
}

/* ------------------ ASSIGNMENT 2 EVENT HANDLERS BEGIN ------------------ */
var volumeSlider = document.getElementById('volume-slider');
var volumeVal = document.getElementById('volume-val');
var settingsPanel = document.getElementById('settings');
var tutorialPanel = document.getElementById('tutorial');
var getReadyDiv = document.getElementById('getReady');
var scoreDiv = document.getElementById('score');
var lvlDiv = document.getElementById('level');
var dangerDiv = document.getElementById('danger');
var finalDiv = document.getElementById('finalScore');
var container = document.getElementById('container');
var shipObj = tutorialPanel; // Temp
var shipImg = shipObj; // Temp
var shield = shipImg; // Temp
var portal = shield; // Temp
var asterInterval;
var shipInt;
var portalInt;
var shieldInt;
var shieldExp;
var portalExp;
var deathSoundExp;
var scoreInt;

volumeVal.style.fontWeight = "normal";

volumeSlider.oninput = function() {
  volumeVal.innerHTML = this.value;
  volumeVal.style.fontWeight = "normal";
}

collectSound.volume = volumeVal.innerHTML / 100;
deathSound.volume = volumeVal.innerHTML / 100;

let difficultyBtns = document.querySelectorAll("#difficulty");

function difficulty(event) {
  for (let button of difficultyBtns) {
    button.classList.remove("selected");
  }
  event.target.classList.add("selected");
  if (event.target.innerHTML == "Easy") {
    astProjectileSpeed = 1;
    astSpawnRate = 1000;
    danger = 10;
    dangerDiv.innerHTML = danger;
    currDiff = 'easy';
    console.log("Difficulty changed to Easy.");
    console.log("Projectile speed changed to " + astProjectileSpeed + ".");
    console.log("Asteroid spawn rate changed to " + astSpawnRate + ".");
  } else if (event.target.innerHTML == "Normal") {
    astProjectileSpeed = 3;
    astSpawnRate = 800;
    danger = 20;
    dangerDiv.innerHTML = danger;
    currDiff = 'normal';
    console.log("Difficulty changed to Normal.");
    console.log("Projectile speed changed to " + astProjectileSpeed + ".");
    console.log("Asteroid spawn rate changed to " + astSpawnRate + ".");
  } else {
    astProjectileSpeed = 5;
    astSpawnRate = 600;
    danger = 30;
    dangerDiv.innerHTML = danger;
    currDiff = 'hard';
    console.log("Difficulty changed to Hard.");
    console.log("Projectile speed changed to " + astProjectileSpeed + ".");
    console.log("Asteroid spawn rate changed to " + astSpawnRate + ".");
  }
}

for (let button of difficultyBtns) {
  button.addEventListener("click", difficulty);
}

function tutorial_play() {
  $('#tutorial').hide();
  landing_page.hide();
  game_screen.show();
  $('#scorePanel').show();
  start_game();
}

function play_click() {
  // Transition to tutorial panel.
  console.log("play button works");
  if (playCtr == 0) {
    $('#tutorial').show();
    tutorialPanel.style.display = "flex";
    tutorialPanel.style.flexDirection = "column";
    tutorialPanel.style.justifyContent = "space-between";
  } else {
    landing_page.hide();
    game_screen.show();
    $('#getReady').show();
    $('#scorePanel').show();
    getReadyDiv.style.display = "flex";
    getReadyDiv.style.flexDirection = "column";
    getReadyDiv.style.justifyContent = "space-evenly";
    setTimeout(function() {
      $('#getReady').hide();
      start_game();
    }, 3000);
  }
  playCtr += 1;
}

function settings_click() {
  // Transition to settings panel.
  console.log("settings button works");
  $('#settings').show();
}

function settings_close() {
  settingsPanel.style.display = "none";
}
/* ------------------- ASSIGNMENT 2 EVENT HANDLERS END ------------------- */

function reset_game() {
  portal.remove();
  shield.remove();
  level = 1;
  score = 0;
  if (currDiff == 'easy') {
    danger = 10;
    astProjectileSpeed = 1;
    astSpawnRate = 1000;
  } else if (currDiff == 'normal') {
    danger = 20;
    astProjectileSpeed = 3;
    astSpawnRate = 800;
  } else { // Hard
    danger = 30;
    astProjectileSpeed = 5;
    astSpawnRate = 600;
  }
  lvlDiv.innerHTML = level;
  scoreDiv.innerHTML = score;
  dangerDiv.innerHTML = danger;
  gameOver = false;
  gameOvah.hide();
  landing_page.show();
  shipObj.remove();
  scoreboard.hide();
  game_screen.hide();
}

function start_game() {
  dangerDiv.innerHTML = danger;
  dangerDiv.style.color = 'darkblue';
  dangerDiv.style.fontSize = '40px';
  let ship = new Ship();
  shipObj = $('#ship');
  shipImg = document.getElementById('shipimg');
  let shipInterval = setInterval(ship.move_ship, 20);
  let asteroidInterval = setInterval(spawn, astSpawnRate);
  let portalInterval = setInterval(spawn_portal, 15000);
  let shieldInterval = setInterval(spawn_shield, 10000);
  let scoreInterval = setInterval(function() {
    score += 40;
    scoreDiv.innerHTML = score;
  }, 500);
  shipInt = shipInterval;
  asterInterval = asteroidInterval;
  portalInt = portalInterval;
  shieldInt = shieldInterval;
  scoreInt = scoreInterval;
}

function game_over(ship, ast, port, shield, pDis, sDis, sound, sscore) {
  astProjectileSpeed = 0;
  clearInterval(ship);
  clearInterval(ast);
  clearInterval(port);
  clearInterval(shield);
  clearTimeout(pDis);
  clearTimeout(sDis);
  clearTimeout(sound);
  clearInterval(sscore);
  // Transition to Game Over screen (2second timeout)
  setTimeout(function() {
    let prefix = 'a-';
    let divsToRemove = document.querySelectorAll('div[id^="' + prefix + '"]');
    divsToRemove.forEach(function(div) {
      div.remove();
      console.log("deleting stray asts");
    });
    gameOvah.show();
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.justifyContent = "space-evenly";
    finalDiv.innerHTML = score;
    
    console.log("game over should be showing");
  }, 2000);
}

function spawn_portal() {
  let objectString = "<div id = 'portal' class = 'portal' > <img src = 'src/port.gif'/></div>";
  asteroid_section.append(objectString);
  portal = document.getElementById('portal');
  jPortal = $('#portal')

  let x = getRandomNumber(12, 1230);
  let y = getRandomNumber(15, 655);

  portal.style.right = x;
  portal.style.top = y;

  // Spaceship collision-handling
  let idk = setInterval(function() {
    check = isColliding(jPortal, shipObj)
    if (check) {
      level += 1;
      astProjectileSpeed *= 1.5;
      danger += 2;
      lvlDiv.innerHTML = level;
      dangerDiv.innerHTML = danger;
      collectSound.volume = volumeVal.innerHTML / 100;
      collectSound.play();
      portal.remove();
    }
  }, AST_OBJECT_REFRESH_RATE);

  portalExp = setTimeout(function() {
    portal.remove();
  }, 5000);
}

function spawn_shield() {
  let objectString = "<div id = 'shield' class = 'shield' > <img src = 'src/shield.gif'/></div>";
  asteroid_section.append(objectString);
  shield = document.getElementById('shield');
  jShield = $('#shield')

  let x = getRandomNumber(12, 1230);
  let y = getRandomNumber(15, 655);

  shield.style.right = x;
  shield.style.top = y;

  // Spaceship collision-handling
  let idk = setInterval(function() {
    check = isColliding(jShield, shipObj)
    if (check) {
      shielded = true;
      collectSound.volume = volumeVal.innerHTML / 100;
      collectSound.play();
      shield.remove();
    }
  }, AST_OBJECT_REFRESH_RATE);

  shieldExp = setTimeout(function() {
    shield.remove();
  }, 5000);
}

/* ---------------------------- GAME FUNCTIONS ----------------------------- */
class Ship {
  constructor() {
    let objectString = "<div id = 'ship' class = 'ship' > <img id = 'shipimg' src = 'src/player/player.gif'/></div>";
    asteroid_section.append(objectString);
    console.log("ship made!");
  }

  move_ship() {
    //console.log("maybe moving!");
    let currRight = parseInt(shipObj.css('right'));
    let currTop = parseInt(shipObj.css('top'));
    //console.log(currRight + " " + currTop);
    if (!gameOver) {
      if (RIGHT) {
        let newRight = currRight - PERSON_SPEED;
        //console.log(newRight);
        if (shielded) {
          shipImg.src = 'src/player/player_shielded_right.gif';
        } else { // Not shielded
          shipImg.src = 'src/player/player_right.gif';
          console.log("img should have changed")
        }
        if (newRight <= 1230 && newRight >= 12) {
          shipObj.css("right", newRight);
        } else if (newRight < 12) {
          shipObj.css("right", 12);
        }
        //console.log("movin right");
      } else if (LEFT) {
        let newRight = currRight + PERSON_SPEED;
        if (newRight >= 12 && newRight <= 1230) {
          shipObj.css("right", newRight);
        } else if (newRight > 1230) {
          shipObj.css("right", 1230);
        }
        if (shielded) {
          shipImg.src = "src/player/player_shielded_left.gif";
        } else { // Not shielded
          shipImg.src = "src/player/player_left.gif";
        }
        //console.log("movin left");
      }
      if (UP) {
        let newTop = currTop - PERSON_SPEED;
        if (newTop <= 655 && newTop >= 15) {
          shipObj.css("top", newTop);
        } else if (newTop < 15) {
          shipObj.css("top", 15);
        }
        if (shielded) {
          shipImg.src = "src/player/player_shielded_up.gif";
        } else { // Not shielded
          shipImg.src = "src/player/player_up.gif";
        }
        //console.log("movin up");
      } else if (DOWN) {
        let newTop = currTop + PERSON_SPEED;
        if (newTop >= 15 && newTop <= 655) {
          shipObj.css("top", newTop);
        } else if (newTop > 655) {
          shipObj.css("top", 655);
        }
        if (shielded) {
          shipImg.src = "src/player/player_shielded_down.gif";
        } else { // Not shielded
          shipImg.src = "src/player/player_down.gif";
        }
        //console.log("movin down");
      }
      if (!LEFT && !RIGHT && !UP && !DOWN) {
        if (shielded) {
          shipImg.src = "src/player/player_shielded.gif";
        } else {
          shipImg.src = "src/player/player.gif";
        }
      }
    }
  }
}

// Starter Code for randomly generating and moving an asteroid on screen
class Asteroid {
  // constructs an Asteroid object
  constructor() {
    /*------------------------Public Member Variables------------------------*/
    // create a new Asteroid div and append it to DOM so it can be modified later
    let objectString = "<div id = 'a-" + currentAsteroid + "' class = 'curAsteroid' > <img src = 'src/asteroid.png'/></div>";
    asteroid_section.append(objectString);
    // select id of this Asteroid
    this.id = $('#a-' + currentAsteroid);
    currentAsteroid++; // ensure each Asteroid has its own id
    // current x, y position of this Asteroid
    this.cur_x = 0; // number of pixels from right
    this.cur_y = 0; // number of pixels from top

    /*------------------------Private Member Variables------------------------*/
    // member variables for how to move the Asteroid
    this.x_dest = 0;
    this.y_dest = 0;
    // member variables indicating when the Asteroid has reached the boarder
    this.hide_axis = 'x';
    this.hide_after = 0;
    this.sign_of_switch = 'neg';
    // spawn an Asteroid at a random location on a random side of the board
    this.#spawnAsteroid();
  }

  // Requires: called by the user
  // Modifies:
  // Effects: return true if current Asteroid has reached its destination, i.e., it should now disappear
  //          return false otherwise
  hasReachedEnd() {
    if (this.hide_axis == 'x') {
      if (this.sign_of_switch == 'pos') {
        if (this.cur_x > this.hide_after) {
          return true;
        }
      }
      else {
        if (this.cur_x < this.hide_after) {
          return true;
        }
      }
    }
    else {
      if (this.sign_of_switch == 'pos') {
        if (this.cur_y > this.hide_after) {
          return true;
        }
      }
      else {
        if (this.cur_y < this.hide_after) {
          return true;
        }
      }
    }
    return false;
  }

  // Requires: called by the user
  // Modifies: cur_y, cur_x
  // Effects: move this Asteroid 1 unit in its designated direction
  updatePosition() {
    // ensures all asteroids travel at current level's speed
    this.cur_y += this.y_dest * astProjectileSpeed;
    this.cur_x += this.x_dest * astProjectileSpeed;
    // update asteroid's css position
    this.id.css('top', this.cur_y);
    this.id.css('right', this.cur_x);
  }

  // Requires: this method should ONLY be called by the constructor
  // Modifies: cur_x, cur_y, x_dest, y_dest, num_ticks, hide_axis, hide_after, sign_of_switch
  // Effects: randomly determines an appropriate starting/ending location for this Asteroid
  //          all asteroids travel at the same speed
  #spawnAsteroid() {
    // REMARK: YOU DO NOT NEED TO KNOW HOW THIS METHOD'S SOURCE CODE WORKS
    let x = getRandomNumber(0, 1280);
    let y = getRandomNumber(0, 720);
    let floor = 784;
    let ceiling = -64;
    let left = 1344;
    let right = -64;
    let major_axis = Math.floor(getRandomNumber(0, 2));
    let minor_aix = Math.floor(getRandomNumber(0, 2));
    let num_ticks;

    if (major_axis == 0 && minor_aix == 0) {
      this.cur_y = floor;
      this.cur_x = x;
      let bottomOfScreen = game_screen.height();
      num_ticks = Math.floor((bottomOfScreen + 64) / astProjectileSpeed) || 1;

      this.x_dest = (game_screen.width() - x);
      this.x_dest = (this.x_dest - x) / num_ticks + getRandomNumber(-.5, .5);
      this.y_dest = -astProjectileSpeed - getRandomNumber(0, .5);
      this.hide_axis = 'y';
      this.hide_after = -64;
      this.sign_of_switch = 'neg';
    }
    if (major_axis == 0 && minor_aix == 1) {
      this.cur_y = ceiling;
      this.cur_x = x;
      let bottomOfScreen = game_screen.height();
      num_ticks = Math.floor((bottomOfScreen + 64) / astProjectileSpeed) || 1;

      this.x_dest = (game_screen.width() - x);
      this.x_dest = (this.x_dest - x) / num_ticks + getRandomNumber(-.5, .5);
      this.y_dest = astProjectileSpeed + getRandomNumber(0, .5);
      this.hide_axis = 'y';
      this.hide_after = 784;
      this.sign_of_switch = 'pos';
    }
    if (major_axis == 1 && minor_aix == 0) {
      this.cur_y = y;
      this.cur_x = left;
      let bottomOfScreen = game_screen.width();
      num_ticks = Math.floor((bottomOfScreen + 64) / astProjectileSpeed) || 1;

      this.x_dest = -astProjectileSpeed - getRandomNumber(0, .5);
      this.y_dest = (game_screen.height() - y);
      this.y_dest = (this.y_dest - y) / num_ticks + getRandomNumber(-.5, .5);
      this.hide_axis = 'x';
      this.hide_after = -64;
      this.sign_of_switch = 'neg';
    }
    if (major_axis == 1 && minor_aix == 1) {
      this.cur_y = y;
      this.cur_x = right;
      let bottomOfScreen = game_screen.width();
      num_ticks = Math.floor((bottomOfScreen + 64) / astProjectileSpeed) || 1;

      this.x_dest = astProjectileSpeed + getRandomNumber(0, .5);
      this.y_dest = (game_screen.height() - y);
      this.y_dest = (this.y_dest - y) / num_ticks + getRandomNumber(-.5, .5);
      this.hide_axis = 'x';
      this.hide_after = 1344;
      this.sign_of_switch = 'pos';
    }
    // show this Asteroid's initial position on screen
    this.id.css("top", this.cur_y);
    this.id.css("right", this.cur_x);
    // normalize the speed s.t. all Asteroids travel at the same speed
    let speed = Math.sqrt((this.x_dest) * (this.x_dest) + (this.y_dest) * (this.y_dest));
    this.x_dest = this.x_dest / speed;
    this.y_dest = this.y_dest / speed;
  }
}

// Spawns an asteroid travelling from one border to another
function spawn() {
  let asteroid = new Asteroid();
  setTimeout(spawn_helper(asteroid), 0);
}

function spawn_helper(asteroid) {
  let astermovement = setInterval(function () {
    deathSoundExp = astermovement;
    // update Asteroid position on screen
    asteroid.updatePosition();
    // Rocket-Collision Detection
    check = isColliding(asteroid.id, shipObj);
    if (check) {
      if (!shielded) {
        gameOver = true;
        shipImg.src = 'src/player/player_touched.gif';
        deathSound.volume = volumeVal.innerHTML / 100;
        deathSound.play();
        console.log("WE'VE BEEN HIT!");
        game_over(shipInt, asterInterval, portalInt, shieldInt, deathSoundExp, portalExp, shieldExp, scoreInt);
      } else {
        asteroid.id.remove();
        shielded = false;
      }
    }
    // determine whether Asteroid has reached its end position
    if (asteroid.hasReachedEnd()) { // i.e. outside the game boarder
      asteroid.id.remove();
      clearInterval(astermovement);
    }
  }, AST_OBJECT_REFRESH_RATE);
}

/* --------------------- Additional Utility Functions  --------------------- */
// Are two elements currently colliding?
function isColliding(o1, o2) {
  return isOrWillCollide(o1, o2, 0, 0);
}

// Will two elements collide soon? 
// NOT USED BY ME
// Input: Two elements, upcoming change in position for the moving element
function willCollide(o1, o2, o1_xChange, o1_yChange) {
  return isOrWillCollide(o1, o2, o1_xChange, o1_yChange);
}

// Are two elements colliding or will they collide soon?
// Input: Two elements, upcoming change in position for the moving element
// Use example: isOrWillCollide(paradeFloat2, person, FLOAT_SPEED, 0)
function isOrWillCollide(o1, o2, o1_xChange, o1_yChange) {
  const o1D = {
    'left': o1.offset().left + o1_xChange,
    'right': o1.offset().left + o1.width() + o1_xChange,
    'top': o1.offset().top + o1_yChange,
    'bottom': o1.offset().top + o1.height() + o1_yChange
  };
  const o2D = {
    'left': o2.offset().left,
    'right': o2.offset().left + o2.width(),
    'top': o2.offset().top,
    'bottom': o2.offset().top + o2.height()
  };
  // Adapted from https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
  if (o1D.left < o2D.right &&
    o1D.right > o2D.left &&
    o1D.top < o2D.bottom &&
    o1D.bottom > o2D.top) {
    // collision detected!
    return true;
  }
  return false;
}

// Get random number between min and max integer
function getRandomNumber(min, max) {
  return (Math.random() * (max - min)) + min;
}
