export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        // Carrega as imagens necessárias para o jogo
        this.load.image('sky', 'assets/sky.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('apple', 'assets/apple.png');
        this.load.image('saw', 'assets/saw.png');
        this.load.spritesheet('turtle', 'assets/turtle.png', { frameWidth: 32, frameHeight: 32 });
    }

    create() {
        // Adiciona o fundo do jogo
        this.add.image(400, 300, 'sky');
        
        // Adiciona instruções de controle
        this.add.text(400, 500, 'Mexa-se com seta para esquerda/direita', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
        this.add.text(400, 450, 'Pule com seta para cima', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);

        // Cria as plataformas
        const platforms = this.physics.add.staticGroup();
        platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        platforms.create(600, 400, 'ground');
        platforms.create(50, 250, 'ground');
        platforms.create(750, 220, 'ground');

        // Cria o jogador e define suas propriedades
        this.player = this.physics.add.sprite(100, 450, 'turtle');
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        // Cria as animações do jogador
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('turtle', { start: 0, end: 10 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('turtle', { start: 11, end: 22 }),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('turtle', { start: 23, end: 34 }),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'hit',
            frames: this.anims.generateFrameNumbers('turtle', { start: 35, end: 41 }),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNumbers('turtle', { start: 42, end: 42 }),
            frameRate: 5,
            repeat: -1
        });

        // Cria as teclas de controle
        this.cursors = this.input.keyboard.createCursorKeys();

        // Cria as maçãs
        this.apples = this.physics.add.group({
            key: 'apple',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });

        this.apples.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });

        // Cria as serras
        this.saws = this.physics.add.group();

        // Cria o texto de pontuação
        this.score = 0;
        this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });

        // Adiciona colisões
        this.physics.add.collider(this.player, platforms);
        this.physics.add.collider(this.apples, platforms);
        this.physics.add.collider(this.saws, platforms);

        // Adiciona sobreposição entre o jogador e as maçãs
        this.physics.add.overlap(this.player, this.apples, this.collectApple, null, this);
        // Adiciona colisão entre o jogador e as serras
        this.physics.add.collider(this.player, this.saws, this.hitSaw, null, this);
    }

    update() {
        // Verifica se o jogo acabou
        if (this.gameOver) {
            return;
        }

        // Controle do jogador
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
            this.player.anims.play('left', true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
            this.player.anims.play('right', true);
        } else {
            this.player.setVelocityX(0);
            this.player.anims.play('idle', true);
        }

        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-330);
            this.player.anims.play('jump', true);
        }
    }

    collectApple(player, apple) {
        // Desativa a maçã coletada
        apple.disableBody(true, true);

        // Atualiza a pontuação
        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);

        // Verifica se todas as maçãs foram coletadas
        if (this.apples.countActive(true) === 0) {
            this.apples.children.iterate(function (child) {
                child.enableBody(true, child.x, 0, true, true);
            });

            // Cria uma nova serra
            const x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
            const saw = this.saws.create(x, 16, 'saw');
            saw.setBounce(1);
            saw.setCollideWorldBounds(true);
            saw.setVelocity(Phaser.Math.Between(-200, 200), 20);
            saw.allowGravity = false;
        }
    }

    hitSaw(player, saw) {
        // Pausa a física do jogo
        this.physics.pause();
        // Muda a cor do jogador para vermelho
        player.setTint(0xff0000);
        // Toca a animação de hit
        player.anims.play('hit');
        // Define o estado de game over
        this.gameOver = true;

        // Após 1 segundo, inicia a cena de Game Over
        this.time.delayedCall(1000, () => {
            this.scene.start('GameOverScene', { score: this.score });
        }, [], this);
    }
}