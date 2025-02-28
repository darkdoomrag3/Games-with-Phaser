import Phaser from "phaser";

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: "BootScene" });
  }

  preload() {
  
    const { width, height } = this.scale;
    

    const loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading...', {
      fontSize: '32px',
      fill: '#ffffff'
    }).setOrigin(0.5);
    

    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width / 2 - 160, height / 2, 320, 30);
    

    const progressBar = this.add.graphics();
    

    this.load.on('progress', (value) => {
      progressBar.clear();
      progressBar.fillStyle(0xff9900, 1);
      progressBar.fillRect(width / 2 - 150, height / 2 + 10, 300 * value, 10);
    });
    
    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
    });
    

    this.load.image("sky", "assets/download.png");
    this.load.image("player", "assets/player.png", {
      scale: {
        width: 200, 
        height: 200 
      }
    });
    this.load.spritesheet("icons", "assets/poop-bag.png", {
      frameWidth: 1024,
      frameHeight: 1024,
      scale: {
        width: 60,
        height: 60
      }
    });
  }

  create() {
  
    this.scene.start("MainMenuScene");
  }
}