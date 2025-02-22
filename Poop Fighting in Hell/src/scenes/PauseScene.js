import Phaser from 'phaser';

export default class PauseScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PauseScene' });
    }

    create() {
        const { width, height } = this.scale;
        
       
        const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.7);
        overlay.setOrigin(0);

        
        this.add.text(width/2, height/3, 'PAUSED', {
            fontSize: '32px',
            fill: '#fff'
        }).setOrigin(0.5);

       
        const resumeButton = this.add.text(width/2, height/2, 'Resume', {
            fontSize: '24px',
            fill: '#fff'
        }).setOrigin(0.5)
        .setInteractive()
        .on('pointerover', () => resumeButton.setStyle({ fill: '#ff0' }))
        .on('pointerout', () => resumeButton.setStyle({ fill: '#fff' }))
        .on('pointerdown', () => this.resumeGame());

   
        const menuButton = this.add.text(width/2, height/2 + 60, 'Main Menu', {
            fontSize: '24px',
            fill: '#fff'
        }).setOrigin(0.5)
        .setInteractive()
        .on('pointerover', () => menuButton.setStyle({ fill: '#ff0' }))
        .on('pointerout', () => menuButton.setStyle({ fill: '#fff' }))
        .on('pointerdown', () => this.returnToMenu());
    }

    resumeGame() {
        this.scene.resume('GameScene');
        this.scene.stop();
    }

    returnToMenu() {
        this.scene.stop('GameScene');
        this.scene.start('BootScene');
    }
}