import Phaser from "phaser";
import BootScene from "./scenes/BootScene";
import GameScene from "./scenes/GameScene";
import GameOverScene from "./scenes/GameOverScene";
import PauseScene from "./scenes/PauseScene";
import ScoresScene from "./scenes/ScoresScene";
import MainMenuScene from "./scenes/MainMenuScene";


const config = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.RESIZE,
    parent: 'game',
    width: '100%',
    height: '100%',
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min: {
      width: 800,
      height: 450
    },
    max: {
      width: 1600,
      height: 900
    }
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
    },
  },
  scene: [
    BootScene,
    MainMenuScene,
    GameScene,
    GameOverScene,
    PauseScene,
    ScoresScene
  ]
};

export default config;