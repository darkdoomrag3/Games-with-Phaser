import Phaser from "phaser";

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameOverScene" });
  }

  init(data) {
    this.score = data.score || 0;
    this.win = data.win || false;
    this.message = data.message || "Game Over!";
  }

  create() {
    const { width, height } = this.scale;
    
    // Game over message
    this.add.text(width / 2, height * 0.15, this.message, {
      fontSize: "48px",
      fill: "#fff",
    }).setOrigin(0.5);

    // Score display
    this.add.text(width / 2, height * 0.25, `Your Score: ${this.score}`, {
      fontSize: "32px",
      fill: "#fff",
    }).setOrigin(0.5);


    this.displayHighScores(width, height);


    const restartButton = this.add.text(width / 2, height * 0.9, "Click to Restart", {
      fontSize: "32px",
      fill: "#fff",
      backgroundColor: "#333",
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive();

 
    restartButton.on('pointerover', () => {
      restartButton.setStyle({ fill: '#ff0' });
    });
    
    restartButton.on('pointerout', () => {
      restartButton.setStyle({ fill: '#fff' });
    });

    restartButton.on("pointerdown", () => {
      this.scene.start("GameScene");
    });
  }

  displayHighScores(width, height) {

    const highScores = JSON.parse(localStorage.getItem('poopFightingHighScores')) || [];
    
    this.add.text(width / 2, height * 0.35, "HIGH SCORES", {
      fontSize: "36px",
      fill: "#ffff00",
    }).setOrigin(0.5);
    
    const scoreStartY = height * 0.42;
    const scoreSpacing = 30;
    
    const displayScores = highScores.slice(0, 10);
    
    if (displayScores.length > 0) {
      this.add.rectangle(
        width / 2,
        scoreStartY + ((displayScores.length - 1) * scoreSpacing) / 2,
        width * 0.6,
        displayScores.length * scoreSpacing + 20,
        0x333333,
        0.7
      ).setOrigin(0.5, 0.5);
    }
    
    displayScores.forEach((scoreData, index) => {
  
      const scoreDate = new Date(scoreData.date);
      const dateStr = `${scoreDate.toLocaleDateString()}`;
      
      const rankText = this.add.text(
        width * 0.25,
        scoreStartY + (index * scoreSpacing),
        `${index + 1}.`,
        { fontSize: "24px", fill: "#fff" }
      ).setOrigin(0, 0.5);
      
      // Score value
      const scoreText = this.add.text(
        width * 0.5,
        scoreStartY + (index * scoreSpacing),
        `${scoreData.score}`,
        { fontSize: "24px", fill: "#fff" }
      ).setOrigin(0.5, 0.5);
      
      const dateText = this.add.text(
        width * 0.75,
        scoreStartY + (index * scoreSpacing),
        dateStr,
        { fontSize: "18px", fill: "#ccc" }
      ).setOrigin(1, 0.5);
      
      if (scoreData.score === this.score && 
          scoreData.date === highScores[highScores.findIndex(s => s.score === this.score)].date) {
        rankText.setStyle({ fill: '#ff0' });
        scoreText.setStyle({ fill: '#ff0' });
        dateText.setStyle({ fill: '#ff0' });
      }
    });
    
    if (displayScores.length === 0) {
      this.add.text(width / 2, scoreStartY + 20, "No scores yet!", {
        fontSize: "24px",
        fill: "#fff",
      }).setOrigin(0.5);
    }
  }
}