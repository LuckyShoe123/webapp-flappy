// the Game object used by the phaser.io library
var stateActions = { preload: preload, create: create, update: update };
var score = -2;
var labelScore;
var player;
var pipes = [];
var tubeNumber = 1;


// Phaser parameters:
// - game width
// - game height
// - renderer (go for Phaser.AUTO)
// - element where the game will be drawn ('game')
// - actions on the game state (or null for nothing)
var game = new Phaser.Game(790, 400, Phaser.AUTO, 'game', stateActions);

/*
 * Loads all resources for the game and gives them names.
 */
function preload() {
    game.load.image("backgroundImg", "../assets/beach.png");
    game.load.image("playerImg", "../assets/betterflappybird.png");
    game.load.audio("sound", "../assets/point.ogg");
    game.load.image("pipe1", "../assets/pipe1.png");
    game.load.image("pipe2", "../assets/pipe2.png");
    game.load.image("pipe3", "../assets/pipe3.png");
    game.load.image("pipe4", "../assets/pipe4.png");
    game.load.image("pipe5", "../assets/pipe5.png");
    game.load.image("pipe6", "../assets/pipe6.png");
    game.load.image("pipe7", "../assets/pipe7.png");
    game.load.image("pipe8", "../assets/pipe8.png");

}
/*
 * Initialises the game. This function is only called once.
 */

function create() {
    // set the background colour of the scene
    game.stage.setBackgroundColor("FF0066");
    var background = game.add.image(0,0, "backgroundImg");
    background.width = 790;
    background.height = 400;


    game.input
        .onDown
        .add(clickHandler);

    game.input
        .keyboard.addKey(Phaser.Keyboard.SPACEBAR)
        .onDown.add(spaceHandler);

    labelScore = game.add.text(20, 20, "0");
    player = game.add.sprite(100, 200, "playerImg");

    generatePipe();

    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.enable(player);

    player.body.gravity.y = 400;

    game.input.keyboard
        .addKey(Phaser.Keyboard.SPACEBAR)
        .onDown.add(playerJump);

    var pipeInterval = 1.25;
    game.time.events
        .loop(pipeInterval*Phaser.Timer.SECOND,generatePipe);
}

function clickHandler(event) {
    game.add.sprite(event.x-30, event.y-30, "playerImg");

}

function spaceHandler() {
    game.sound.play("sound");
}

/*
 * This function updates the scene. It is called for every new frame.
 */
function update() {
    for (var index = 0; index < pipes.length; index++) {
        game.physics.arcade
            .overlap(player,
            pipes[index],
            gameOver);
    }
}

function gameOver(){
    alert("Too bad - you died! Your score was " + score)
    location.reload();
}

function changeScore() {
    score = score + 1;
    labelScore.setText(score.toString());
}

function generatePipe() {
    //calculate a random position for the gap
    var gapStart = game.rnd.integerInRange(1, 5);
    // generate the pipes, except where the gap should be
    for (var count=0; count<8; count++){
        if (count != gapStart && count != gapStart + 1) {
            addPipeBlock(750, count * 50);
        }
    }
    changeScore();
}

function addPipeBlock(x, y){
    //create a new pipe block

    var block = game.add.sprite(x,y, "pipe" + tubeNumber);
    //insert it in the 'pipes array
    pipes.push(block);
    game.physics.arcade.enable(block);
    block.body.velocity.x = -200;
    tubeNumber = tubeNumber + 1;
    if (tubeNumber > 8){
        tubeNumber = 1
    }
}

function playerJump(){
    player.body.velocity.y = -200;
}