import Phaser from "phaser";

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameOverScene" });
  }

  create() {
    const { width, height } = this.scale;
    
    this.add.text(width / 2, height / 2 - 50, "Game Over!", {
      fontSize: "48px",
      fill: "#fff",
    }).setOrigin(0.5);

    const restartButton = this.add.text(width / 2, height / 2 + 50, "Click to Restart", {
      fontSize: "32px",
      fill: "#fff",
    }).setOrigin(0.5);

    restartButton.setInteractive();
    restartButton.on("pointerdown", () => {
      this.scene.start("GameScene");
    });
  }
}