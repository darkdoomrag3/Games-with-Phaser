import Phaser from "phaser";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
  }

  init() {
    this.itemSpeed = -200;
    this.spawnDelay = 1000;
    this.lastSpawnTime = 0;
    this.playerHealth = 100;
    this.isInvulnerable = false;
    this.invulnerabilityDuration = 1000;
  }

  create() {
    const { width, height } = this.scale;

    this.createBackground();

    this.createplayer();
    this.createHealthBar();
    this.createItems();
    this.createControls();
    this.pauseKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ESC
    );


    const pauseButton = this.add
      .text(this.scale.width - 20, 20, "⏸️", {
        fontSize: "24px",
        fill: "#fff",
      })
      .setOrigin(1, 0)
      .setInteractive()
      .on("pointerdown", () => this.pauseGame());
    this.scale.on("resize", this.resize, this);
  }

  createBackground() {
    const { width, height } = this.scale;

    const bg = this.add
      .image(width / 2, height / 2, "sky")
      .setName("sky")
      .setDepth(0);

    const scaleX = width / bg.width;
    const scaleY = height / bg.height;
    const scale = Math.max(scaleX, scaleY);
    bg.setScale(scale);
  }

  resize(gameSize) {
    const { width, height } = gameSize;

    const bg = this.children.getByName("sky");
    if (bg) {
      const scaleX = width / bg.width;
      const scaleY = height / bg.height;
      const scale = Math.max(scaleX, scaleY);
      bg.setScale(scale);
      bg.setPosition(width / 2, height / 2);
    }

    if (this.player) {
      this.player.x = width * 0.1;
      this.player.y = height * 0.5;

      const playerScale = 0.07;
      this.player.setScale(playerScale);
    }

    if (this.healthBar) {
      this.healthBar.clear();
      this.updateHealthBar();
    }

    if (this.healthText) {
      this.healthText.setPosition(width * 0.2, height * 0.05);
    }
  }

  createplayer() {
    const { width, height } = this.scale;

    this.player = this.physics.add
      .sprite(width * 0.1, height * 0.5, "player")
      .setOrigin(0);

    // Make player bigger - adjust this number to change size
    const playerScale = 0.13; // Try different values: 0.05 for smaller, 0.1 for bigger
    this.player.setScale(playerScale);

    this.player.setDepth(1);
    this.player.body.allowGravity = false;

    // Adjust collision box to match new scale
    const collisionWidth = this.player.width * 0.8;
    const collisionHeight = this.player.height * 0.8;
    this.player.body.setSize(collisionWidth, collisionHeight);
    this.player.body.offset.x = this.player.width * 0.1;
    this.player.body.offset.y = this.player.height * 0.1;
  }

  createHealthBar() {
    this.healthBar = this.add.graphics();
    this.healthText = this.add.text(220, 10, "", {
      fontSize: "20px",
      fill: "#ffffff",
    });

    this.updateHealthBar();
  }

  createItems() {
    this.items = this.physics.add.group();
    this.physics.add.collider(
      this.player,
      this.items,
      this.handleCollision,
      null,
      this
    );
  }

  createControls() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update(time) {
    this.handleplayerMovement();
    this.handleItemSpawning(time);
    this.updateItems();
    if (Phaser.Input.Keyboard.JustDown(this.pauseKey)) {
      this.pauseGame();
    }
  }

  pauseGame() {
    this.scene.pause();
    this.scene.launch("PauseScene");
  }

  handleplayerMovement() {
    const { width, height } = this.scale;
    this.player.body.velocity.x = 0;
    this.player.body.velocity.y = 0;

    if (this.cursors.left.isDown) {
      this.player.body.velocity.x = -300;
    } else if (this.cursors.right.isDown) {
      this.player.body.velocity.x = 300;
    }

    if (this.cursors.up.isDown) {
      this.player.body.velocity.y = -300;
    } else if (this.cursors.down.isDown) {
      this.player.body.velocity.y = 300;
    }

    // Adjust the clamping to account for the scaled size
    const scaledWidth = this.player.width * this.player.scaleX;
    const scaledHeight = this.player.height * this.player.scaleY;

    this.player.x = Phaser.Math.Clamp(this.player.x, 0, width - scaledWidth);
    this.player.y = Phaser.Math.Clamp(this.player.y, 0, height - scaledHeight);
  }

  handleItemSpawning(time) {
    if (time > this.lastSpawnTime + this.spawnDelay) {
      this.spawnItem();
      this.lastSpawnTime = time;
    }
  }

  updateItems() {
    this.items.getChildren().forEach((item) => {
      item.x += this.itemSpeed * (this.game.loop.delta / 1000);

      if (item.x < -item.width) {
        this.items.killAndHide(item);
      }
    });
  }

  spawnItem() {
    const { width, height } = this.scale;
    const frame = Phaser.Math.Between(0);

    const item = this.items.create(
      width,
      Phaser.Math.Between(0, height),
      "icons",
      frame
    );

    // Increase this value to make enemies bigger
    const scaleFactor = 90 / 1024; // Changed from 50 to 120
    item.setScale(scaleFactor);

    item.setOrigin(0);
    item.body.allowGravity = false;

    // Adjust collision box to match new scale
    const collisionWidth = 90 * 0.6; // Changed from 50 to 120
    const collisionHeight = 90 * 0.6;
    item.body.setSize(collisionWidth, collisionHeight);
    item.body.offset.x = (item.width * scaleFactor - collisionWidth) / 2;
    item.body.offset.y = (item.height * scaleFactor - collisionHeight) / 2;
  }

  handleCollision(player, item) {
    // If player is invulnerable, ignore the collision
    if (this.isInvulnerable) {
      return;
    }

    this.playerHealth -= 15;
    this.updateHealthBar();
    this.items.killAndHide(item);
    item.destroy();

    this.isInvulnerable = true;

    this.tweens.add({
      targets: this.player,
      alpha: 0.5,
      duration: 100,
      yoyo: false,
      repeat: 2,
    });

    // Reset invulnerability after duration
    this.time.delayedCall(this.invulnerabilityDuration, () => {
      this.isInvulnerable = false;
      this.player.alpha = 1;
    });

    if (this.playerHealth <= 0) {
      this.scene.start("GameOverScene", { score: 0 });
    }
  }

  updateHealthBar() {
    this.healthBar.clear();

    this.healthBar.fillStyle(0xff0000);
    this.healthBar.fillRect(10, 10, 200, 20);
    this.healthBar.fillStyle(0x00ff00);
    this.healthBar.fillRect(10, 10, 200 * (this.playerHealth / 100), 20);

    if (this.healthText) {
      this.healthText.setText(`Health: ${this.playerHealth}%`);
    }
  }
}
