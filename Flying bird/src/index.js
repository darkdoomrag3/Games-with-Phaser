import Phaser from "phaser";

const config = {
  type: Phaser.AUTO,
  width: 900,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 }, // No gravity
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

function preload() {
  this.load.image("sky", "assets/hell.png");
  this.load.image("bird", "assets/91.png");


  this.load.spritesheet("icons", "assets/poopiii.png", {
    frameWidth: 100,
    frameHeight: 100,
  });
}

let bird;
let items;
let itemSpeed = -200;
let spawnDelay = 1000;
let lastSpawnTime = 0;

function create() {
  this.add.image(400, 300, "sky").setOrigin(0.5, 0.5);

  bird = this.physics.add.sprite(config.width / 10, config.height / 2, "bird").setOrigin(0);
  bird.body.allowGravity = false;

  // Adjust the bird's collision area
  bird.body.setSize(bird.width * 0.8, bird.height * 0.8); // Shrink the collision box
  bird.body.offset.x = bird.width * 0.1; // Center the collision box horizontally
  bird.body.offset.y = bird.height * 0.1; // Center the collision box vertically


  items = this.physics.add.group();


  this.physics.add.collider(bird, items, gameOver, null, this);

  this.cursors = this.input.keyboard.createCursorKeys();
}

function update(time) {
  // Handle bird movement
  bird.body.velocity.x = 0;
  bird.body.velocity.y = 0;

  if (this.cursors.left.isDown) {
    bird.body.velocity.x = -300; // Move left
  } else if (this.cursors.right.isDown) {
    bird.body.velocity.x = 300; // Move right
  }

  if (this.cursors.up.isDown) {
    bird.body.velocity.y = -300; // Move up
  } else if (this.cursors.down.isDown) {
    bird.body.velocity.y = 300; // Move down
  }


  bird.x = Phaser.Math.Clamp(bird.x, 0, config.width - bird.width);
  bird.y = Phaser.Math.Clamp(bird.y, 0, config.height - bird.height);


  if (time > lastSpawnTime + spawnDelay) {
    spawnItem();
    lastSpawnTime = time;
  }


  items.getChildren().forEach((item) => {
    item.x += itemSpeed * (this.game.loop.delta / 1000); 

    if (item.x < -item.width) {
      items.killAndHide(item); 
    }
  });
}

function spawnItem() {
 
  const frame = Phaser.Math.Between(0);

 
  const item = items.create(
    config.width, 
    Phaser.Math.Between(0, config.height), 
    "icons", 
    frame 
  );

  item.setOrigin(0);
  item.body.allowGravity = false;


  item.body.setSize(item.width * 0.6, item.height * 0.6); 
  item.body.offset.x = item.width * 0.1;
  item.body.offset.y = item.height * 0.1; 
}

function gameOver() {
  console.log("Game Over!");
  this.scene.restart();
}

new Phaser.Game(config);