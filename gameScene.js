import Explosion from "./explosion.js";

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'gameScene' })
    }

    init() {
        this.starfield = null;
        this.player = null;
        this.cursors = null;
        this.boundary = null;
        this.asteroids = null;
        this.planet1 = null;
        this.planet2 = null;
        this.planet3 = null;
        this.planet4 = null;
        this.planet5 = null;
        this.bullets = null;
        this.explosions = null;
        this.lives = 5;
        this.points = 0;
        this.maxpoints = 150;
        this.pointsText = null;
        this.livesText = null;
        this.numOfPlanets = 0;
        // this.gameOver = false;
        this.bulletTime = 0;
        //this.bulletFiring = null;
        //this.explsoionSound = null;
    }

    preload() {
        this.load.image("starfield", "assets/starfield.png");
        this.load.image("boundary", "assets/boundary.png");
        this.load.image("player", "assets/player.png", {
            frameWidth: 32,
            frameHeight: 48,
        });
        this.load.image("asteroid", "assets/asteroid.png", {
            frameWidth: 32,
            frameHeight: 48,
        });
        this.load.image("planet1", "assets/planet_1.png", {
            frameWidth: 32,
            frameHeight: 48,
        });
        this.load.image("planet2", "assets/planet_2.png", {
            frameWidth: 32,
            frameHeight: 48,
        });
        this.load.image("planet3", "assets/planet_3.png", {
            frameWidth: 32,
            frameHeight: 48,
        });
        this.load.image("planet4", "assets/planet_4.png", {
            frameWidth: 32,
            frameHeight: 48,
        });
        this.load.image("planet5", "assets/planet_5.png", {
            frameWidth: 32,
            frameHeight: 48,
        });
        this.load.spritesheet("explode", "assets/explode.png", {
            frameWidth: 128,
            frameHeight: 128,
        });
        this.load.image("bullet", "assets/bullet.png", {
            frameWidth: 32,
            frameHeight: 48,
        });
        //this.load.audio("bulletFiring", "assets/shoot.wav");
        //this.load.audio("explosionSound", "assets/explosion.wav");
    }

    create() {
        this.starfield = this.add.tileSprite(0, 0, 4000, 1400, "starfield");
        this.boundary = this.physics.add
            .sprite(0, 450, "boundary")
            .setScale(2.23)
            .setImmovable(true);
        this.player = this.physics.add.sprite(400, 500, "player");
        this.player.setScale(1.2);
        this.player.setCollideWorldBounds(true);

        const collisionHandler = (boundary, obj) => {
            obj.setBounce(1)
        };

        this.livesText = this.add.text(16, 16, "Lives left: " + this.lives, {
            fontSize: "32px",
            fill: "#fff",
        });

        this.pointsText = this.add.text(16, 50, "Points: " + this.points, {
            fontSize: "32px",
            fill: "#fff",
        });

        this.cursors = this.input.keyboard.createCursorKeys();
        this.cursors.left.isDown=false;
        this.cursors.right.isDown=false;
        this.cursors.down.isDown=false;
        this.cursors.up.isDown=false;

        this.asteroids = this.physics.add.group({
            maxSize: 30,
            runChildUpdate: true,
        });

        for (let y = 0; y < 30; y++) {
            this.asteroids.create(
                Phaser.Math.Between(0, 1300),
                Phaser.Math.Between(0, 350),
                "asteroid"
            );
        }

        this.bullets = this.physics.add.group({
            runChildUpdate: true,
        });

        this.asteroids.getChildren().forEach(function(asteroid) {
            asteroid.setCollideWorldBounds(true);
            this.physics.add.collider(this.boundary, asteroid, collisionHandler);
            asteroid.setBounce(1);
            asteroid.setVelocityX(Phaser.Math.Between(-100, 100));
            asteroid.setVelocityY(Phaser.Math.Between(-100, 100));
        }, this);

        this.explosions = this.physics.add.group({
            max: 0,
        });

        this.anims.create({
            key: "explode",
            frames: this.anims.generateFrameNumbers("explode", {
                start: 0,
                end: 15,
            }),
            frameRate: 24,
            repeat: 0,
            hideOnComplete: true,
        });


        this.physics.add.overlap(
            this.bullets,
            this.asteroids,
            this.bulletHitAsteroid,
            null,
            this
        );

        //this.bulletFiring = this.sound.add("bulletFiring");
        //this.explosionSound = this.sound.add("explsoionSound");
    }

    update() {

        if (this.lives == 0) {
            this.end();
        }

        if (this.numOfPlanets == 0) {
            this.numOfPlanets += 1;
            this.time.delayedCall(1000, this.nextLevel, [], this);
        }

        // if (this.gameOver) {
        //     this.livesText.setText(
        //         "Lives left: " +
        //         this.lives +
        //         ". Thankyou for playing :) Your score: " +
        //         this.points
        //     );
        //     this.scene.pause();
        //     this.endPage();
        //     return;
        // }

        this.starfield.tilePositionY -= 2;

        if (this.cursors.space.isDown) {
            if (this.time.now > this.bulletTime) {
                //this.bulletFiring.play();
                var bullet = this.bullets.getFirst(
                    false,
                    true,
                    this.player.x,
                    this.player.y + 8,
                    "bullet"
                );
                bullet.setVelocityY(-500);
                this.bulletTime = this.time.now + 200;
            }
        }

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-180);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(180);
        } else if (this.cursors.up.isDown) {
            this.player.setVelocityY(-180);
        } else if (this.cursors.down.isDown) {
            this.player.setVelocityY(+180);
        } else {
            this.player.setVelocityY(0);
            this.player.setVelocityX(0);
        }

        this.physics.add.overlap(this.player, this.planet1, this.playerHitPlanet, null, this);
        this.physics.add.overlap(this.player, this.planet2, this.playerHitPlanet, null, this);
        this.physics.add.overlap(this.player, this.planet3, this.playerHitPlanet, null, this);
        this.physics.add.overlap(this.player, this.planet4, this.playerHitPlanet, null, this);
        this.physics.add.overlap(this.player, this.planet5, this.playerHitPlanet, null, this);
    }

    bulletHitAsteroid(bullet, asteroid) {
        //this.explosionSound.play();
        var explosion = new Explosion(this, asteroid.x, asteroid.y);
        explosion.setScale(0.5);
        explosion.explode();
        bullet.destroy();
        asteroid.destroy();

        this.points = this.points + 5;
        this.pointsText.setText("Points: " + this.points);
        if (this.points == this.maxpoints) {
            // this.gameOver = true;
            this.end();
        }
    }

    playerHitPlanet(ply, planet) {
        //this.explosionSound.play();
        var explosion = new Explosion(this, this.player.x, this.player.y);
        explosion.explode();
        this.player.disableBody(false, true);
        this.lives -= 1;
        this.livesText.setText("Lives left: " + this.lives);
        this.numOfPlanets += 1;

        if (this.lives <= 0) {
            this.gameOver = true;
        }

        this.time.delayedCall(1000, this.nextLevel, [], this);
        this.time.delayedCall(1000, this.respawnPlayer, [], this);
    }

    respawnPlayer() {
        if (this.lives != 1) this.player.enableBody(true, 600, 500, true, true);
        else this.player.enableBody(true, 1200, 800, true, true);
    }

    nextLevel() {
        if (this.numOfPlanets == 1) {
            this.planet1 = this.physics.add.sprite(30, 30, "planet1");
            this.planet1.setScale(1);
            this.planet1.setBounce(1);
            this.planet1.setCollideWorldBounds(true);
            this.planet1.x = 30;
            this.planet1.y = 30;
            var velocityCoin = Phaser.Math.FloatBetween(0, 1);
            this.planet1.setVelocityX(
                Phaser.Math.Between(
                    velocityCoin > 0.5 ? 100 : -300,
                    velocityCoin > 0.5 ? 300 : -100
                )
            );
            velocityCoin = Phaser.Math.FloatBetween(0, 1);
            this.planet1.setVelocityY(
                Phaser.Math.Between(
                    velocityCoin > 0.5 ? 100 : -300,
                    velocityCoin > 0.5 ? 300 : -100
                )
            );
        }
        if (this.numOfPlanets == 2) {
            this.planet2 = this.physics.add.sprite(700, 15, "planet2");
            this.planet2.setScale(0.9);
            this.planet2.setBounce(1);
            this.planet2.setCollideWorldBounds(true);
            this.planet2.x = 700;
            this.planet2.y = 15;
            var velocityCoin = Phaser.Math.FloatBetween(0, 1);
            this.planet2.setVelocityX(
                Phaser.Math.Between(
                    velocityCoin > 0.5 ? 100 : -300,
                    velocityCoin > 0.5 ? 300 : -100
                )
            );
            velocityCoin = Phaser.Math.FloatBetween(0, 1);
            this.planet2.setVelocityY(
                Phaser.Math.Between(
                    velocityCoin > 0.5 ? 100 : -300,
                    velocityCoin > 0.5 ? 300 : -100
                )
            );
        }
        if (this.numOfPlanets == 3) {
            this.planet3 = this.physics.add.sprite(1000, 15, "planet3");
            this.planet3.setScale(0.25);
            this.planet3.setBounce(1);
            this.planet3.setCollideWorldBounds(true);
            this.planet3.x = 1000;
            this.planet3.y = 15;
            var ve3ocityCoin = Phaser.Math.FloatBetween(0, 1);
            this.planet3.setVelocityX(
                Phaser.Math.Between(
                    velocityCoin > 0.5 ? 100 : -400,
                    velocityCoin > 0.5 ? 400 : -100
                )
            );
            velocityCoin = Phaser.Math.FloatBetween(0, 1);
            this.planet3.setVelocityY(
                Phaser.Math.Between(
                    velocityCoin > 0.5 ? 100 : -400,
                    velocityCoin > 0.5 ? 400 : -100
                )
            );
        }
        if (this.numOfPlanets == 4) {
            this.planet4 = this.physics.add.sprite(1300, 15, "planet4");
            this.planet4.setScale(0.25);
            this.planet4.setBounce(1);
            this.planet4.setCollideWorldBounds(true);
            this.planet4.x = 1300;
            this.planet4.y = 15;
            var velocityCoin = Phaser.Math.FloatBetween(0, 1);
            this.planet4.setVelocityX(
                Phaser.Math.Between(
                    velocityCoin > 0.5 ? 100 : -400,
                    velocityCoin > 0.5 ? 400 : -100
                )
            );
            velocityCoin = Phaser.Math.FloatBetween(0, 1);
            this.planet4.setVelocityY(
                Phaser.Math.Between(
                    velocityCoin > 0.5 ? 100 : -400,
                    velocityCoin > 0.5 ? 400 : -100
                )
            );
        }
        if (this.numOfPlanets == 5) {
            this.planet5 = this.physics.add.sprite(350, 15, "planet5");
            this.planet5.setScale(0.25);
            this.planet5.setBounce(1);
            this.planet5.setCollideWorldBounds(true);
            this.planet5.x = 350;
            this.planet5.y = 15;
            var velocityCoin = Phaser.Math.FloatBetween(0, 1);
            this.planet5.setVelocityX(
                Phaser.Math.Between(
                    velocityCoin > 0.5 ? 90 : -100,
                    velocityCoin > 0.5 ? 100 : -90
                )
            );
            velocityCoin = Phaser.Math.FloatBetween(0, 1);
            this.planet5.setVelocityY(
                Phaser.Math.Between(
                    velocityCoin > 0.5 ? 100 : -100,
                    velocityCoin > 0.5 ? 100 : -100
                )
            );
        }
    }

    end() {
        this.livesText.setText(
            "Lives left: " +
            this.lives +
            ". Thankyou for playing :) Your score: " +
            this.points
        );
        this.scene.stop();
        this.scene.start('endScene', {points:this.points});
    }

}

export default GameScene;