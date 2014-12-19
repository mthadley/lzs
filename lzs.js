var screenWidth = 1024;
var screenHeight = 768;

var lzs = new Phaser.Game(screenWidth, screenHeight, Phaser.AUTO, 'lzs', { preload: preload, create: create, update: update, render: render });

function preload() {
	// Load sounds and sprites

	lzs.load.image('ray', 'assets/sprites/ray-front-single.png');
	lzs.load.image('beam', 'assets/sprites/beam-01.png');
	lzs.load.image('background', 'assets/sprites/grass-dirt-mix-pixeled-gray.png');
	lzs.load.image('zombie', 'assets/sprites/placeholder_zombie.png');

	lzs.load.audio('pew', 'assets/sounds/raygun1.mp3');
}

// Game vars

var bulletSpeed = 1500;
var cursors;
var fireButton;
var fireDelay =200;
var fireTime = 0;
var pew;
var ray;
var raySpeed = 1000;
var score = 0;
var scoreText;
var scoreString = 'Score: ';
var zombieHitPoints = 3;
var zombies;
var zombieSpeed = 50;
var zombieWidth;

function create() {
	lzs.add.tileSprite(0, 0, screenWidth, screenHeight, 'background');

	lzs.physics.startSystem(Phaser.Physics.ARCADE);

	ray = lzs.add.sprite(screenWidth * 0.5, screenHeight * 0.8, 'ray');

	//rays
	bullets = lzs.add.group();
	bullets.enableBody = true;
	bullets.physicsBodyType = Phaser.Physics.ARCADE;
	bullets.createMultiple(30, 'beam');
	bullets.setAll('anchor.x', 0.5);
	bullets.setAll('anchor.y', 1);
	bullets.setAll('outOfBoundsKill', true);
	bullets.setAll('checkWorldBounds', true);

	lzs.physics.enable(ray, Phaser.Physics.ARCADE);

	//controls
	cursors = lzs.input.keyboard.createCursorKeys();
	fireButton = lzs.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

	zombieWidth = lzs.cache.getImage('zombie').width;
	createZombies();

	//audio
	pew = lzs.add.audio('pew');

	scoreText = lzs.add.text(10, screenHeight - 30, scoreString + score, { font: '24px Ariel', fill: '#de57d5' });
}

function update() {
	if (ray.alive) {
		ray.body.velocity.setTo(0, 0);

		if (cursors.left.isDown) {
			if (ray.position.x > 0) {
				ray.body.velocity.x = -raySpeed;
			}
		}
		if (cursors.right.isDown) {
			if (ray.position.x < (lzs.world.width - ray.width)) {
				ray.body.velocity.x = raySpeed;
			}
		}
		if (cursors.up.isDown) {
			if (ray.position.y > (lzs.world.height / 2)) {
				ray.body.velocity.y = -raySpeed;
			}
		}
		if (cursors.down.isDown) {
			if (ray.position.y < (lzs.world.height - ray.height)) {
				ray.body.velocity.y = raySpeed;
			}
		}

		if (fireButton.isDown) {
			fireRay();
		}

		//collision detection
		lzs.physics.arcade.overlap(bullets, zombies, collisionHandler);
	}
}

function fireRay() {
	if (lzs.time.now > fireTime) {
		pew.play();

		bullet = bullets.getFirstExists(false);

		if (bullet) {
			bullet.reset(ray.x + 65, ray.y + 8);
			bullet.body.velocity.y = -bulletSpeed;
			fireTime = lzs.time.now + fireDelay;
		}
	}
}

function createZombies() {
	zombies = lzs.add.group();
	zombies.enableBody = true;
	zombies.physicsBodyType = Phaser.Physics.ARCADE;
	zombies.setAll('outOfBoundsKill', true);

	lzs.time.events.loop(2000, createZombie, this);
}

function createZombie() {
	var position = Math.min(screenWidth * Math.random(), screenWidth - zombieWidth);

	var zombie = zombies.create(position, -150, 'zombie');

	zombie.body.velocity.y = zombieSpeed;
	zombie.hits = 0;
	zombie.alive = false;
}

function collisionHandler(bullet, zombie) {
	if (!zombie.alive) {
		bullet.kill();
		zombie.hits++;

		if (zombie.hits == zombieHitPoints) {
			zombie.alive = true;
			zombie.body.velocity.y = 0;

			if (zombie.position.x > (lzs.world.width * 0.5)) {
				zombie.body.velocity.x = zombieSpeed;
			}
			else {
				zombie.body.velocity.x = -zombieSpeed;
			}

			score += 20;
			scoreText.text = scoreString + score;
		}
	}
}

function render() {
	// debug
}