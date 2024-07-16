class EndScene extends Phaser.Scene {

    constructor() {
        super({ key: 'endScene' });
        this.starfield = null;
        this.gameover =null
        this.score = 0;
        this.restart = null;
        this.goToHome = null;
    }

    init(data){
        this.points=data.points;
    }

    preload() {
        this.load.image("starfield", "assets/starfield.png");
        this.load.image("gameover", "assets/gameover.png");
        this.load.image("restart", "assets/replay.png");
        this.load.image("menu", "assets/menu.png");

    }

    create() {
        this.starfield = this.add.tileSprite(0, 0, 4000, 1400, "starfield");
        this.gameover = this.add.image(650, 150, "gameover");
        this.gameover.setScale(0.8);
        this.score = this.add.text(570, 250, 'Your Score:'+ this.points , {
            fill: '#0f0',
            fontSize: '25px'
        });

        // changes the scene to gameScene
        this.restart = this.add.image(500,400, 'restart');
        this.restart.setScale(0.5);

        this.restart.setInteractive({ useHandCursor: true });
        this.restart.on('pointerdown', () => {
            this.scene.stop();
            var gameScene = this.scene.get('gameScene');
            gameScene.scene.restart();
        });
    
        // this.playAgain.on('pointerover', () => {this.text.setColor('#ffff00')});
        // this.playAgain.on('pointerout', () => {this.text.setColor('#0f0')});

        // changes the scene to titleScene
        this.goToHome = this.add.image(800,400, 'menu');
        this.goToHome.setScale(0.52);

        this.goToHome.setInteractive({ useHandCursor: true });
        this.goToHome.on('pointerdown', () => {
            this.scene.stop();
            var titleScene = this.scene.get('titleScene');
            titleScene.scene.restart();
        });
        // this.goToHome.on('pointerover', () => {this.text.setColor('#ffff00')});
        // this.goToHome.on('pointerout', () => {this.text.setColor('#0f0')});
    }

    update() {
        this.starfield.tilePositionY -= 2;
    }

}
export default EndScene;