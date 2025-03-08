export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    init(data) {
        this.score = data.score;
    }

    create() {
        // Adiciona o texto de Game Over e a pontuação final
        this.add.text(400, 300, 'Game Over', { fontSize: '64px', fill: '#fff' }).setOrigin(0.5);
        this.add.text(400, 400, 'Score: ' + this.score, { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
        this.add.text(400, 500, 'Press SPACE to Restart', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);

        // Adiciona um evento para reiniciar o jogo quando a tecla espaço for pressionada
        this.input.keyboard.on('keydown-SPACE', () => {
            this.scene.start('GameScene');
        });
    }
}