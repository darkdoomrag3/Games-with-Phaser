import Phaser from "phaser";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
  }

  init(data) {
   
    this.score = 0;
    this.playerHealth = 100;
    this.isInvulnerable = false;
    this.invulnerabilityDuration = 1000;
    this.lastSpawnTime = 0;
    

    this.itemSpeed = -200;
    this.spawnDelay = 1000;
    this.minSpawnDelay = 200;
    this.gameTime = 60000; 
    
    this.difficulty = data?.difficulty || 'normal';
    

    if (this.difficulty === 'custom' && data.customSettings) {
      // Apply custom settings
      this.itemSpeed = -data.customSettings.enemySpeed;
      this.gameTime = data.customSettings.gameTime * 1000; // Convert to milliseconds
      this.spawnDelay = 1000 - (data.customSettings.enemySpeed - 200); // Adjust spawn delay based on speed
      this.spawnDelay = Phaser.Math.Clamp(this.spawnDelay, 200, 1500); // Ensure reasonable bounds
      this.minSpawnDelay = this.spawnDelay / 4;
    } else {
      this.applyDifficultySettings();
    }
    
    this.timeRemaining = this.gameTime;
  }
  
  applyDifficultySettings() {
    switch(this.difficulty) {
      case 'easy':
        this.itemSpeed = -150;
        this.spawnDelay = 1500;
        this.minSpawnDelay = 400;
        this.gameTime = 45000; 
        break;
      case 'normal':
   
        break;
      case 'hard':
        this.itemSpeed = -300;
        this.spawnDelay = 800;
        this.minSpawnDelay = 150;
        this.gameTime = 90000; 
        break;
    }
    
    this.timeRemaining = this.gameTime;
  }

  create() {
    const { width, height } = this.scale;

    this.createBackground();
    this.createplayer();
    this.createHealthBar();
    this.createItems();
    this.createControls();
    this.createTimer();
    this.createScoreDisplay();
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

  createTimer() {
    const { width } = this.scale;
    const seconds = Math.ceil(this.timeRemaining / 1000);
    this.timerText = this.add.text(width / 2, 20, `Time: ${seconds}`, {
      fontSize: "24px",
      fill: "#ffffff",
    }).setOrigin(0.5, 0);
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

  createScoreDisplay() {
    const { width } = this.scale;
    this.scoreText = this.add.text(width - 20, 60, "Score: 0", {
      fontSize: "24px",
      fill: "#ffffff",
    }).setOrigin(1, 0);
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

    if (this.timerText) {
      this.timerText.setPosition(width / 2, 20);
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
    if (this.scoreText) {
      this.scoreText.setPosition(width - 20, 60);
    }
  }

  createplayer() {
    const { width, height } = this.scale;

    this.player = this.physics.add
      .sprite(width * 0.1, height * 0.5, "player")
      .setOrigin(0);

    // Make player bigger - adjust this number to change size
    const playerScale = 0.13; 
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

  update(time, delta) {
    this.handleplayerMovement();
    this.handleItemSpawning(time);
    this.updateItems();
    this.updateTimer(delta);
    this.updateScore(delta);
    if (Phaser.Input.Keyboard.JustDown(this.pauseKey)) {
      this.pauseGame();
    }
  }

  updateTimer(delta) {
    this.timeRemaining -= delta;
    
    if (this.timeRemaining <= 0) {
      this.timeRemaining = 0;
      this.timerText.setText("Time: 0");
      this.playerWin();
      return;
    }
    
    const seconds = Math.ceil(this.timeRemaining / 1000);
    this.timerText.setText(`Time: ${seconds}`);
    
    const timeProgress = 1 - (this.timeRemaining / this.gameTime);
    this.spawnDelay = Math.max(
      this.minSpawnDelay,
      1000 - (800 * timeProgress) 
    );
  }

  updateScore(delta) {
    this.score += delta / 100; 
    this.scoreText.setText(`Score: ${Math.floor(this.score)}`);
  }

  playerWin() {
    const finalScore = Math.floor(this.score) + 500; // Bonus for winning
    this.saveScore(finalScore);
    this.scene.start("GameOverScene", { 
      score: finalScore, 
      win: true,
      message: "You survived! Victory!"
    });
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
    const frame = Phaser.Math.Between(0, 0); 

    const item = this.items.create(
      width,
      Phaser.Math.Between(0, height),
      "icons",
      frame
    );

    const scaleFactor = 90 / 1024; 
    item.setScale(scaleFactor);

    item.setOrigin(0);
    item.body.allowGravity = false;

    const collisionWidth = 90 * 0.6;
    const collisionHeight = 90 * 0.6;
    item.body.setSize(collisionWidth, collisionHeight);
    item.body.offset.x = (item.width * scaleFactor - collisionWidth) / 2;
    item.body.offset.y = (item.height * scaleFactor - collisionHeight) / 2;
  }

  handleCollision(player, item) {
    if (this.isInvulnerable) {
      return;
    }

    this.playerHealth -= 25;
    this.updateHealthBar();
    
    // Decrease score when hit by enemy
    const scoreDeduction = 50; 
    this.score = Math.max(0, this.score - scoreDeduction); 
    this.scoreText.setText(`Score: ${Math.floor(this.score)}`);
    
    // Visual feedback for score loss
    this.tweens.add({
      targets: this.scoreText,
      scale: 1.5,
      duration: 200,
      yoyo: true,
      ease: 'Sine.easeInOut',
      onStart: () => {
        this.scoreText.setColor('#ff0000'); 
      },
      onComplete: () => {
        this.scoreText.setColor('#ffffff'); 
      }
    });
    
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

    this.time.delayedCall(this.invulnerabilityDuration, () => {
      this.isInvulnerable = false;
      this.player.alpha = 1;
    });

    if (this.playerHealth <= 0) {
      this.saveScore(Math.floor(this.score));
      this.scene.start("GameOverScene", { 
        score: Math.floor(this.score),
        win: false,
        message: "Game Over!"
      });
    }
  }

  saveScore(score) {
    let highScores = JSON.parse(localStorage.getItem('poopFightingHighScores')) || [];
   
    highScores.push({
      score: score,
      date: new Date().toISOString()
    });
    
    highScores.sort((a, b) => b.score - a.score);
    
    highScores = highScores.slice(0, 10);
    
    localStorage.setItem('poopFightingHighScores', JSON.stringify(highScores));
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