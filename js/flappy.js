// the Game object used by the phaser.io library
var stateActions = { preload: preload, create: create, update: update };
var score = -2;
var labelScore;
var player;
var pipes = [];
var tubeNumber = 1;
var paused = false;
var gameGravity = 400;
var jumpPower = -200;
var gameSpeed = 1.25;
var splashDisplay = 0;
var splashImage = 0;


var gapSize = 100;
var gapMargin = 100;
var blockHeight = 50;

var pipeEndHeight = 33;
var pipeEndExtraWidth = 33;

var width = 790;
var height = 400;

var potOfGold = [];
var rainbow = [];
var stars = [];


jQuery("#greeting-form").on("submit", function(event_details) {
    var greeting = "Hello ";
    var name = jQuery("#fullName").val();
    var greeting_message = greeting + name;
    var email = $("#email").val();
    jQuery("#greeting-form").fadeOut(600);
    jQuery("#greeting").append("<p>" + greeting_message + " (" + email + ")" + "</p>" + "<p>"+ "Score: " + score + "</p>");
    //event_details.preventDefault();
});

// Phaser parameters:
// - game width
// - game height
// - renderer (go for Phaser.AUTO)
// - element where the game will be drawn ('game')
// - actions on the game state (or null for nothing)
var game = new Phaser.Game(width, height, Phaser.AUTO, 'game', stateActions);

/*
 * Loads all resources for the game and gives them names.
 */
function preload() {
    game.load.image("backgroundImg", "../assets/grass.jpg");
    game.load.image("playerImg", "../assets/fairysmall.png");
    game.load.audio("sound", "../assets/point.ogg");
    game.load.image("pipe1", "../assets/pipe1.png");
    game.load.image("pipe2", "../assets/pipe2.png");
    game.load.image("pipe3", "../assets/pipe3.png");
    game.load.image("pipe4", "../assets/pipe4.png");
    game.load.image("pipe5", "../assets/pipe5.png");
    game.load.image("pipe6", "../assets/pipe6.png");
    game.load.image("pipe7", "../assets/pipe7.png");
    game.load.image("pipe8", "../assets/pipe8.png");
    game.load.image("pipe-end", "../assets/cloudlong.png");
    game.load.image("potofgold", "../assets/potofgold.png");
    game.load.image("rainbow","../assets/littlerainbow.png");
    game.load.image("magicfairy", "../assets/magic fairy.gif");
    game.load.image("pixelstar", "../assets/star.png");
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
    labelScore = game.add.text(20, 20, "0");
    player = game.add.sprite(100, 200, "playerImg");
    player.anchor.setTo(0.5, 0.5);
    game.physics.arcade.enable(player);


    game.input
        .onDown
        .add(clickHandler);

    //game.input
      //  .keyboard.addKey(Phaser.Keyboard.P)
        //.onDown.add(gamePaused);

    game.input.keyboard.addKey(Phaser.Keyboard.ENTER).onDown.add(start);

    splashDisplay = game.add.text(100,200, "Press ENTER to start and SPACEBAR to jump");
    splashImage = game.add.sprite(350,75, "magicfairy");

}

function start(){
    splashDisplay.destroy();
    splashImage.destroy();
    game.input
        .keyboard.addKey(Phaser.Keyboard.SPACEBAR)
        .onDown.add(spaceHandler);

    game.physics.startSystem(Phaser.Physics.ARCADE);

    player.body.gravity.y = gameGravity;

    game.input.keyboard
        .addKey(Phaser.Keyboard.SPACEBAR)
        .onDown.add(playerJump);

    var pipeInterval = gameSpeed;
    game.time.events
        .loop(pipeInterval*Phaser.Timer.SECOND,generate);
}

function generate(){
    var diceRoll = game.rnd.integerInRange(1, 10);
    if (diceRoll==1){
        generateRainbows();
    } else if(diceRoll == 2){
        generatePotOfGold();
    }else{
        generatePipe();
    }
}

function clickHandler(event) {
    game.add.sprite(event.x-30, event.y-30, "playerImg");

}

function spaceHandler() {
    game.sound.play("sound");
}

/*function gamePaused(){
    game.paused=true;
    pause = true;

}*/

function update() {
    for (var index = 0; index < pipes.length; index++) {
        game.physics.arcade
            .overlap(player,
            pipes[index],
            gameOver);
    }

    for (var j = 0; j < stars.length; j++) {
        game.physics.arcade.overlap(player, stars[j], changeScore);
        stars[j].destroy();


    }
    if (player.body.y < 0 || player.body.y > 400) {
        gameOver();
    }

    player.rotation = Math.atan(player.body.velocity.y / 400);

    for (var i=rainbow.length-1; i>=0; i--){
        game.physics.arcade.overlap(player, rainbow[i], function(){
            changeGravity(-50);
            rainbow[i].destroy();
            rainbow.splice(i, 1);
        })
    }

    for (var count=potOfGold.length-1; count>=0; count--){
        game.physics.arcade.overlap(player, potOfGold[count], function(){
            changeGravity(50);
            potOfGold[count].destroy();
            potOfGold.splice(count, 1);
        })
    }
    /*for (var count2=stars.length-1; count2>=0; count2--){
        game.physics.arcade.overlap(player, stars[count2], function(){
            stars[count2].destroy();
            stars.splice(count2, 1);

        })

    }*/
}



function gameOver(){
    game.destroy();
    $("#score").val(score.toString());
    $("#greeting").show();
    score = -2;
    gameGravity = 200;
    stars = []
}

function changeScore() {
    score = score + 1;
    labelScore.setText(score.toString());

}

function generatePipe() {
    var gapStart = game.rnd.integerInRange(gapMargin, height - gapSize - gapMargin);

    addPipeEnd(width-(pipeEndExtraWidth/2), gapStart-pipeEndHeight);
    for(var y=gapStart-pipeEndHeight; y > 0 ; y -= blockHeight){
        addPipeBlock(width,y - blockHeight);
    }
    addPipeEnd(width-(pipeEndExtraWidth/2), gapStart+gapSize);
    for(var y = gapStart + gapSize + pipeEndHeight; y < height; y += blockHeight) {
        addPipeBlock(width, y);
    }
    addStar(780, gapStart);

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
        tubeNumber = 1;
    }
}

function addPipeEnd(x, y){
    var end = game.add.sprite(x,y,"pipe-end");
    pipes.push(end);
    game.physics.arcade.enable(end);
    end.body.velocity.x = -200;
}

function playerJump(){
    if (paused = true){
        game.paused = false;
        paused = false;


    }
    player.body.velocity.y = jumpPower;
}

function changeGravity(g){
    gameGravity += g;
    player.body.gravity.y = gameGravity;
}

function cancelButton(){
    $("#greeting").hide();
    location.reload();
    score = -2;

}

$.get("/score", function(scores){
    scores.sort(function (scoreA, scoreB){
        var difference = scoreB.score - scoreA.score;
        return difference;
    });
    for (var i = 0; i < 3; i++) {
        $("#scoreBoard").append(
            "<li>" +
            scores[i].name + ": " + scores[i].score +
            "</li>");
    }
});

function generateRainbows(){
    var bonus = game.add.sprite(width, height, "rainbow");
    rainbow.push(bonus);
    game.physics.arcade.enable(bonus);
    bonus.body.velocity.x = -200;
    bonus.body.velocity.y = -game.rnd.integerInRange(60, 100);
}

function generatePotOfGold(){
    var bonus = game.add.sprite(width, 0, "potofgold");
    potOfGold.push(bonus);
    game.physics.arcade.enable(bonus);
    bonus.body.velocity.x = -200;
    bonus.body.velocity.y = game.rnd.integerInRange(60, 100);
}

function addStar(x, y){
    var star = game.add.sprite(x, y, "pixelstar");
    stars.push(stars);
    game.physics.arcade.enable(star);
    star.body.velocity.x = -200;

}
