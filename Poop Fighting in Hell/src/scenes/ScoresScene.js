import Phaser from "phaser";

export default class ScoresScene extends Phaser.Scene {
  constructor() {
    super({ key: "ScoresScene" });
  }
  
  init(data) {
    this.fromGame = data.fromGame || false;
  }

  create() {
    const { width, height } = this.scale;
    

    this.add.rectangle(0, 0, width, height, 0x000000, 0.9)
      .setOrigin(0, 0);
    
 
    this.add.text(width / 2, height * 0.15, "HIGH SCORES", {
      fontSize: "48px",
      fill: "#ffff00",
    }).setOrigin(0.5);
    

    this.displayHighScores(width, height);
    

    const backButton = this.add.text(width / 2, height * 0.85, "Back", {
      fontSize: "32px",
      fill: "#ffffff",
      backgroundColor: "#333333",
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive();
    

    backButton.on('pointerover', () => {
      backButton.setStyle({ fill: '#ffff00' });
    });
    
    backButton.on('pointerout', () => {
      backButton.setStyle({ fill: '#ffffff' });
    });
    

    backButton.on("pointerdown", () => {
      this.scene.stop(); 
      
      if (this.fromGame) {

        this.scene.resume("GameScene");
      } else {
   
        this.scene.start("MainMenuScene");
      }
    });
    

    this.input.keyboard.once("keydown-ESC", () => {
      this.scene.stop();
      
      if (this.fromGame) {

        this.scene.resume("GameScene");
      } else {
   
        this.scene.start("MainMenuScene");
      }
    });
  }

  displayHighScores(width, height) {

    const highScores = JSON.parse(localStorage.getItem('poopFightingHighScores')) || [];
    

    const scoreStartY = height * 0.3;
    const scoreSpacing = 40;
    

    const displayScores = highScores.slice(0, 10);
    

    if (displayScores.length > 0) {
      this.add.rectangle(
        width / 2,
        scoreStartY + ((displayScores.length - 1) * scoreSpacing) / 2,
        width * 0.7,
        displayScores.length * scoreSpacing + 40,
        0x333333,
        0.7
      ).setOrigin(0.5, 0.5);
      

      this.add.text(width * 0.25, scoreStartY - 50, "RANK", {
        fontSize: "24px",
        fill: "#aaaaaa"
      }).setOrigin(0.5, 0.5);
      
      this.add.text(width * 0.5, scoreStartY - 50, "SCORE", {
        fontSize: "24px",
        fill: "#aaaaaa"
      }).setOrigin(0.5, 0.5);
      
      this.add.text(width * 0.75, scoreStartY - 50, "DATE", {
        fontSize: "24px",
        fill: "#aaaaaa"
      }).setOrigin(0.5, 0.5);
    }
    
    displayScores.forEach((scoreData, index) => {

      const scoreDate = new Date(scoreData.date);
      const dateStr = `${scoreDate.toLocaleDateString()}`;
      

      this.add.text(
        width * 0.25,
        scoreStartY + (index * scoreSpacing),
        `${index + 1}`,
        { fontSize: "28px", fill: index < 3 ? "#ffff00" : "#ffffff" }
      ).setOrigin(0.5, 0.5);
      
 
      this.add.text(
        width * 0.5,
        scoreStartY + (index * scoreSpacing),
        `${scoreData.score}`,
        { fontSize: "28px", fill: "#ffffff" }
      ).setOrigin(0.5, 0.5);
      

      this.add.text(
        width * 0.75,
        scoreStartY + (index * scoreSpacing),
        dateStr,
        { fontSize: "22px", fill: "#cccccc" }
      ).setOrigin(0.5, 0.5);
    });
    

    if (displayScores.length === 0) {
      this.add.text(width / 2, scoreStartY + 40, "No scores yet!", {
        fontSize: "28px",
        fill: "#ffffff",
      }).setOrigin(0.5);
      
      this.add.text(width / 2, scoreStartY + 90, "Play the game to set a high score!", {
        fontSize: "22px",
        fill: "#cccccc",
      }).setOrigin(0.5);
    }
  }
}