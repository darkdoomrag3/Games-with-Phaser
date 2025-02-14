import Phaser from "phaser";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 400 }
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

function preload () {
  this.load.image('sky', 'assets/sky.png');
  this.load.image('bird', 'assets/bird.png');
}

let bird;
let flapVelocity = -300; 

function create () {
  this.add.image(400, 300, 'sky').setOrigin(0.5, 0.5);
  bird = this.physics.add.sprite(config.width * 1/10, config.height/2, 'bird').setOrigin(0); 


  this.input.on('pointerdown', flap.bind(this));  
  this.input.keyboard.on('keydown-SPACE', flap.bind(this)); 

}

function update () {

}

function flap(){
  bird.body.velocity.y = flapVelocity;
}

new Phaser.Game(config);