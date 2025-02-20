import Phaser from "phaser";

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: "BootScene" });
  }

  preload() {
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
        width: 60,    // Increased from 80 to 120
        height: 60    // Increased from 80 to 120
      }
    });
  }

  create() {
    this.scene.start("GameScene");
  }
}