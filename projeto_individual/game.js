import GameScene from './gameScene.js';
import GameOverScene from './gameOverScene.js';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [GameScene, GameOverScene]
};

const game = new Phaser.Game(config);