import Phaser from "phaser";

export default class MainMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: "MainMenuScene" });
  }

  init() {
    this.difficulty = localStorage.getItem('poopFightingDifficulty') || 'normal';
    this.showingCredits = false;
    this.customSettings = JSON.parse(localStorage.getItem('poopFightingCustomSettings')) || {
      gameTime: 60,
      enemySpeed: 200
    };
  }

  create() {
    const { width, height } = this.scale;
    

    this.add.rectangle(0, 0, width, height, 0x330000, 1)
      .setOrigin(0, 0);
    

    const title = this.add.text(width / 2, height * 0.2, "POOP FIGHTING\nIN HELL", {
      fontSize: "64px",
      fontFamily: "Arial",
      fontStyle: "bold",
      align: "center",
      fill: "#ffffff",
    }).setOrigin(0.5);

    title.setStroke('#ff6600', 8);
    

    const panelWidth = width * 0.6;
    const panelHeight = height * 0.6;
    this.add.rectangle(
      width / 2,
      height * 0.6,
      panelWidth,
      panelHeight,
      0x220000,
      0.8
    ).setOrigin(0.5);

    const border = this.add.graphics();
    border.lineStyle(4, 0xff6600, 1);
    border.strokeRect(
      width / 2 - panelWidth / 2,
      height * 0.6 - panelHeight / 2,
      panelWidth,
      panelHeight
    );
    

    const buttonStyle = {
      fontSize: "32px",
      fill: "#ffffff",
      backgroundColor: "#660000",
      padding: { x: 20, y: 10 }
    };
    
    const buttonY = height * 0.4;
    const buttonSpacing = 60;
    

    const startButton = this.add.text(width / 2, buttonY, "Start Game", buttonStyle)
      .setOrigin(0.5)
      .setInteractive();
    

    const difficultyText = this.formatDifficultyText();
    this.difficultyButton = this.add.text(width / 2, buttonY + buttonSpacing, 
      difficultyText, buttonStyle)
      .setOrigin(0.5)
      .setInteractive();
    

    this.customSettingsButton = this.add.text(width / 2, buttonY + buttonSpacing * 2, 
      "Custom Settings", buttonStyle)
      .setOrigin(0.5)
      .setInteractive();

    this.updateCustomSettingsVisibility();
    

    const scoresButton = this.add.text(width / 2, buttonY + buttonSpacing * 3, "High Scores", buttonStyle)
      .setOrigin(0.5)
      .setInteractive();
    

    const creditsButton = this.add.text(width / 2, buttonY + buttonSpacing * 4, "Credits", buttonStyle)
      .setOrigin(0.5)
      .setInteractive();

    [startButton, this.difficultyButton, this.customSettingsButton, scoresButton, creditsButton].forEach(button => {
      button.on('pointerover', () => {
        button.setStyle({ fill: '#ffff00' });
      });
      
      button.on('pointerout', () => {
        button.setStyle({ fill: '#ffffff' });
      });
    });

    startButton.on("pointerdown", () => {
      const gameData = { difficulty: this.difficulty };
      

      if (this.difficulty === 'custom') {
        gameData.customSettings = this.customSettings;
      }
      
      this.scene.start("GameScene", gameData);
    });
    
    this.difficultyButton.on("pointerdown", () => {
      this.cycleDifficulty();
    });
    
    this.customSettingsButton.on("pointerdown", () => {
      this.showCustomSettings();
    });
    
    scoresButton.on("pointerdown", () => {
      this.scene.start("ScoresScene", { fromGame: false });
    });
    
    creditsButton.on("pointerdown", () => {
      this.showCredits();
    });
    

    this.add.text(width - 10, height - 10, "v1.1", {
      fontSize: "16px",
      fontFamily: "Arial",
      fill: "#777777",
    }).setOrigin(1, 1);

    this.createCreditsPanel();
    

    this.createCustomSettingsPanel();
  }
  
  formatDifficultyText() {
    if (this.difficulty === 'custom') {
      return "Difficulty: I Love to Stay in Hell";
    } else {
      return `Difficulty: ${this.capitalize(this.difficulty)}`;
    }
  }
  
  updateCustomSettingsVisibility() {
    if (this.difficulty === 'custom') {
      this.customSettingsButton.setVisible(true);
    } else {
      this.customSettingsButton.setVisible(false);
    }
  }
  
  createCreditsPanel() {
    const { width, height } = this.scale;
    

    this.creditsPanel = this.add.group();
    

    const bg = this.add.rectangle(width/2, height/2, width * 0.7, height * 0.7, 0x000000, 0.9);
    
  
    const border = this.add.graphics();
    border.lineStyle(4, 0xff6600, 1);
    border.strokeRect(
      width/2 - width * 0.35,
      height/2 - height * 0.35,
      width * 0.7,
      height * 0.7
    );
    

    const title = this.add.text(width/2, height/2 - height * 0.3, "CREDITS", {
      fontSize: "48px",
      fontFamily: "Arial",
      fill: "#ffffff",
    }).setOrigin(0.5);
    
    title.setStroke('#ff6600', 6);
    
 
    const creditsText = [
      "Game Design: Emad Deym",
      "Programming: Emad Deym",
      "Art: Emad Deym",
      "Special Thanks:",
      "Family, Friends, and You for Playing!"
    ];
    
    const textObjects = [];
    let yPos = height/2 - height * 0.15;
    
    creditsText.forEach(line => {
      const text = this.add.text(width/2, yPos, line, {
        fontSize: "24px",
        fontFamily: "Arial",
        fill: "#ffffff",
      }).setOrigin(0.5);
      
      textObjects.push(text);
      yPos += 40;
    });
    

    const closeButton = this.add.text(width/2, height/2 + height * 0.3, "Close", {
      fontSize: "32px",
      fill: "#ffffff",
      backgroundColor: "#660000",
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive();
    
    closeButton.on('pointerover', () => {
      closeButton.setStyle({ fill: '#ffff00' });
    });
    
    closeButton.on('pointerout', () => {
      closeButton.setStyle({ fill: '#ffffff' });
    });
    
    closeButton.on('pointerdown', () => {
      this.hideCredits();
    });
    

    this.creditsPanel.add(bg);
    this.creditsPanel.add(border);
    this.creditsPanel.add(title);
    textObjects.forEach(text => this.creditsPanel.add(text));
    this.creditsPanel.add(closeButton);
    

    this.creditsPanel.setVisible(false);
  }
  
  createCustomSettingsPanel() {
    const { width, height } = this.scale;
    

    this.customSettingsPanel = this.add.group();
    

    const bg = this.add.rectangle(width/2, height/2, width * 0.7, height * 0.7, 0x000000, 0.9);
    
 
    const border = this.add.graphics();
    border.lineStyle(4, 0xff0000, 1);
    border.strokeRect(
      width/2 - width * 0.35,
      height/2 - height * 0.35,
      width * 0.7,
      height * 0.7
    );
    

    const title = this.add.text(width/2, height/2 - height * 0.3, "I LOVE TO STAY IN HELL", {
      fontSize: "40px",
      fontFamily: "Arial",
      fill: "#ff0000",
    }).setOrigin(0.5);
    
    title.setStroke('#ffff00', 6);
    

    const subtitle = this.add.text(width/2, height/2 - height * 0.22, "Custom Settings", {
      fontSize: "28px",
      fontFamily: "Arial",
      fill: "#ffffff",
    }).setOrigin(0.5);
    

    const gameTimeLabel = this.add.text(width/2 - 150, height/2 - height * 0.1, "Game Time (seconds):", {
      fontSize: "24px",
      fontFamily: "Arial",
      fill: "#ffffff",
    }).setOrigin(0, 0.5);
    

    this.gameTimeText = this.add.text(width/2 + 150, height/2 - height * 0.1, this.customSettings.gameTime.toString(), {
      fontSize: "28px",
      fontFamily: "Arial",
      fill: "#ffff00",
    }).setOrigin(0.5);
    

    const gameTimeSlider = this.add.rectangle(width/2, height/2 - height * 0.05, 300, 10, 0x666666);
    

    const gameTimeHandle = this.add.rectangle(
      width/2 - 150 + (300 * (this.customSettings.gameTime - 30) / 270), 
      height/2 - height * 0.05, 
      20, 30, 0xff6600
    ).setInteractive({ draggable: true });
    

    const enemySpeedLabel = this.add.text(width/2 - 150, height/2 + height * 0.05, "Enemy Speed:", {
      fontSize: "24px",
      fontFamily: "Arial",
      fill: "#ffffff",
    }).setOrigin(0, 0.5);
    

    this.enemySpeedText = this.add.text(width/2 + 150, height/2 + height * 0.05, this.customSettings.enemySpeed.toString(), {
      fontSize: "28px",
      fontFamily: "Arial",
      fill: "#ffff00",
    }).setOrigin(0.5);
    
  
    const enemySpeedSlider = this.add.rectangle(width/2, height/2 + height * 0.1, 300, 10, 0x666666);
    
    
    const enemySpeedHandle = this.add.rectangle(
      width/2 - 150 + (300 * (this.customSettings.enemySpeed - 100) / 400), 
      height/2 + height * 0.1, 
      20, 30, 0xff6600
    ).setInteractive({ draggable: true });
    
 
    gameTimeHandle.on('drag', (pointer, dragX) => {
     
      const x = Phaser.Math.Clamp(dragX, width/2 - 150, width/2 + 150);
      gameTimeHandle.x = x;
      
     
      const gameTime = Math.round(30 + ((x - (width/2 - 150)) / 300) * 270);
      this.customSettings.gameTime = gameTime;
      this.gameTimeText.setText(gameTime.toString());
      
    
      this.saveCustomSettings();
    });
    

    enemySpeedHandle.on('drag', (pointer, dragX) => {

      const x = Phaser.Math.Clamp(dragX, width/2 - 150, width/2 + 150);
      enemySpeedHandle.x = x;
      
   
      const enemySpeed = Math.round(100 + ((x - (width/2 - 150)) / 300) * 400);
      this.customSettings.enemySpeed = enemySpeed;
      this.enemySpeedText.setText(enemySpeed.toString());
      
    
      this.saveCustomSettings();
    });
    
  
    const warningText = this.add.text(width/2, height/2 + height * 0.2, "Warning: Higher values may increase difficulty!", {
      fontSize: "20px",
      fontFamily: "Arial",
      fill: "#ff6666",
    }).setOrigin(0.5);
    

    const closeButton = this.add.text(width/2, height/2 + height * 0.3, "Save & Close", {
      fontSize: "32px",
      fill: "#ffffff",
      backgroundColor: "#660000",
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive();
    
    closeButton.on('pointerover', () => {
      closeButton.setStyle({ fill: '#ffff00' });
    });
    
    closeButton.on('pointerout', () => {
      closeButton.setStyle({ fill: '#ffffff' });
    });
    
    closeButton.on('pointerdown', () => {
      this.hideCustomSettings();
    });
    

    this.customSettingsPanel.add(bg);
    this.customSettingsPanel.add(border);
    this.customSettingsPanel.add(title);
    this.customSettingsPanel.add(subtitle);
    this.customSettingsPanel.add(gameTimeLabel);
    this.customSettingsPanel.add(this.gameTimeText);
    this.customSettingsPanel.add(gameTimeSlider);
    this.customSettingsPanel.add(gameTimeHandle);
    this.customSettingsPanel.add(enemySpeedLabel);
    this.customSettingsPanel.add(this.enemySpeedText);
    this.customSettingsPanel.add(enemySpeedSlider);
    this.customSettingsPanel.add(enemySpeedHandle);
    this.customSettingsPanel.add(warningText);
    this.customSettingsPanel.add(closeButton);
    

    this.customSettingsPanel.setVisible(false);
  }
  
  saveCustomSettings() {
    localStorage.setItem('poopFightingCustomSettings', JSON.stringify(this.customSettings));
  }
  
  cycleDifficulty() {
   
    switch(this.difficulty) {
      case 'easy':
        this.difficulty = 'normal';
        break;
      case 'normal':
        this.difficulty = 'hard';
        break;
      case 'hard':
        this.difficulty = 'custom';
        break;
      case 'custom':
        this.difficulty = 'easy';
        break;
      default:
        this.difficulty = 'normal';
    }
    

    localStorage.setItem('poopFightingDifficulty', this.difficulty);
    
    this.difficultyButton.setText(this.formatDifficultyText());
    

    this.updateCustomSettingsVisibility();
  }
  
  showCredits() {
    this.creditsPanel.setVisible(true);
  }
  
  hideCredits() {
    this.creditsPanel.setVisible(false);
  }
  
  showCustomSettings() {
    this.customSettingsPanel.setVisible(true);
  }
  
  hideCustomSettings() {
    this.customSettingsPanel.setVisible(false);
  }
  
  capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}