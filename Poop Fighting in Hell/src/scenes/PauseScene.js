import Phaser from "phaser";

export default class PauseScene extends Phaser.Scene {
  constructor() {
    super({ key: "PauseScene" });
  }

  create() {
    const { width, height } = this.scale;
    

    this.add.rectangle(0, 0, width, height, 0x000000, 0.8)
      .setOrigin(0, 0);
    

    const panelWidth = width * 0.5;
    const panelHeight = height * 0.6;
    this.add.rectangle(
      width / 2,
      height / 2,
      panelWidth,
      panelHeight,
      0x222222,
      0.9
    ).setOrigin(0.5);

    const border = this.add.graphics();
    border.lineStyle(4, 0xff9900, 1);
    border.strokeRect(
      width / 2 - panelWidth / 2,
      height / 2 - panelHeight / 2,
      panelWidth,
      panelHeight
    );
    

    const pauseTitle = this.add.text(width / 2, height * 0.3, "PAUSED", {
      fontSize: "48px",
      fontFamily: "Arial",
      fill: "#ffffff",
    }).setOrigin(0.5);
    

    pauseTitle.setStroke('#ff9900', 6);
    pauseTitle.setShadow(2, 2, '#000000', 5, true, true);
    
    const buttonY = height * 0.45;
    const buttonSpacing = 70;
    
 
    this.createButton(width / 2, buttonY, "Resume", () => {
      this.scene.stop();
      this.scene.resume("GameScene"); 
    });
    
    this.createButton(width / 2, buttonY + buttonSpacing, "High Scores", () => {
      this.scene.stop(); 
      this.scene.launch("ScoresScene", { fromGame: true });
    });
    
    this.createButton(width / 2, buttonY + buttonSpacing * 2, "Main Menu", () => {
      this.scene.stop(); 
      this.scene.stop("GameScene"); 
      this.scene.start("MainMenuScene"); 
    });
    
   
    this.add.text(width / 2, height / 2 + panelHeight / 2 - 20, "Poop Fighting in Hell v1.0", {
      fontSize: "14px",
      fontFamily: "Arial",
      fill: "#777777",
    }).setOrigin(0.5);
    
 
    this.input.keyboard.once("keydown-ESC", () => {
      this.scene.stop(); 
      this.scene.resume("GameScene"); 
    });
  }
  
  createButton(x, y, text, callback) {

    const buttonWidth = 220;
    const buttonHeight = 60;
    

    const buttonBg = this.add.graphics();
    buttonBg.fillStyle(0x333333, 1);
    buttonBg.fillRect(x - buttonWidth/2, y - buttonHeight/2, buttonWidth, buttonHeight);
    

    const gradientBg = this.add.graphics();
    gradientBg.fillGradientStyle(0x444444, 0x444444, 0x333333, 0x333333, 1);
    gradientBg.fillRect(x - buttonWidth/2, y - buttonHeight/2, buttonWidth, buttonHeight/2);
    

    const buttonBorder = this.add.graphics();
    buttonBorder.lineStyle(2, 0xff9900, 1);
    buttonBorder.strokeRect(x - buttonWidth/2, y - buttonHeight/2, buttonWidth, buttonHeight);
    

    const buttonText = this.add.text(x, y, text, {
      fontSize: "28px",
      fontFamily: "Arial",
      fill: "#ffffff",
    }).setOrigin(0.5);

    const hitArea = this.add.zone(x, y, buttonWidth, buttonHeight)
      .setOrigin(0.5)
      .setInteractive();
    

    hitArea.on('pointerover', () => {
      buttonBg.clear();
      buttonBg.fillStyle(0x444444, 1);
      buttonBg.fillRect(x - buttonWidth/2, y - buttonHeight/2, buttonWidth, buttonHeight);
      
      gradientBg.clear();
      gradientBg.fillGradientStyle(0x555555, 0x555555, 0x444444, 0x444444, 1);
      gradientBg.fillRect(x - buttonWidth/2, y - buttonHeight/2, buttonWidth, buttonHeight/2);
      
      buttonText.setColor('#ffff00');
      

      this.tweens.add({
        targets: buttonText,
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 100
      });
    });
    
    hitArea.on('pointerout', () => {
      buttonBg.clear();
      buttonBg.fillStyle(0x333333, 1);
      buttonBg.fillRect(x - buttonWidth/2, y - buttonHeight/2, buttonWidth, buttonHeight);
      
      gradientBg.clear();
      gradientBg.fillGradientStyle(0x444444, 0x444444, 0x333333, 0x333333, 1);
      gradientBg.fillRect(x - buttonWidth/2, y - buttonHeight/2, buttonWidth, buttonHeight/2);
      
      buttonText.setColor('#ffffff');
      

      this.tweens.add({
        targets: buttonText,
        scaleX: 1,
        scaleY: 1,
        duration: 100
      });
    });
    

    hitArea.on('pointerdown', () => {
      buttonBg.clear();
      buttonBg.fillStyle(0x222222, 1);
      buttonBg.fillRect(x - buttonWidth/2, y - buttonHeight/2, buttonWidth, buttonHeight);
      

      this.tweens.add({
        targets: buttonText,
        y: y + 2,
        duration: 50,
        yoyo: true,
        onComplete: callback
      });
    });
    
    return { hitArea, buttonText };
  }
}