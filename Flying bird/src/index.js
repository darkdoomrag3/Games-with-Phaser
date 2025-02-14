import Phaser from "phaser";

const config = {
  type: Phaser.AUTO,
  width: 980,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 400 },
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

function preload() {
  this.load.image("sky", "assets/sky2.jpg");
  this.load.image("bird", "assets/91.png");
}

let bird;
let flapVelocity = -300;
let initialBirdPosition = {
  x:(config.width * 1) / 10,
  y: config.height / 2,

}


function create() {
  this.add.image(400, 300, "sky").setOrigin(0.5, 0.5);
  bird = this.physics.add
    .sprite((config.width * 1) / 10, config.height / 2, "bird")
    .setOrigin(0);

  this.input.on("pointerdown", flap.bind(this));
  this.input.keyboard.on("keydown-SPACE", flap.bind(this));
}

function update() {

  if (bird.y > config.height || bird.y<-bird.height) {
    restartPosition();

  }
}

function restartPosition(){
  bird.x = initialBirdPosition.x;
  bird.y = initialBirdPosition.y;
  bird.body.velocity.y = 0;
}

function flap() {
  // Only allow flapping if the bird is not at the bottom of the screen
  if (bird.y < config.height - bird.height / 2) {
    bird.body.velocity.y = flapVelocity;
  }
}

new Phaser.Game(config);