class TitleScene extends Phaser.Scene {

    constructor() {
        super({ key: 'titleScene' });
        this.starfield = null;
        this.title = null;
        this.play_btn=null;
    }

    preload() {
        this.load.image("starfield", "assets/starfield.png");
        this.load.image("title", "assets/title.png");
        this.load.image("play_btn", "assets/play.png");
    }

    create() {
		this.starfield = this.add.tileSprite(0, 0, 4000, 1400, "starfield");
        this.title = this.add.image(650,250, "title");
        this.title.setScale(0.7);
        this.play_btn = this.add.image(650,500, 'play_btn');
        this.play_btn.setScale(0.5);

        this.play_btn.setInteractive({ useHandCursor: true });
        this.play_btn.on('pointerdown', () => this.clickButton());
	}
    
    clickButton() {
        this.scene.switch('gameScene');
    }


    update() {
        this.starfield.tilePositionY -= 2;
    }

}
export default TitleScene;