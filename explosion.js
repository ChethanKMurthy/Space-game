class Explosion extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y);
        scene.add.existing(this);
    }
    explode() {
        this.play("explode");
    }
}
export default Explosion;