var lzs = new Phaser.Game(1024, 768, screenHeight, Phaser.AUTO, 'lzs', { preload: preload, create: create, update: update, render: render });

function preload() {
	// Load sounds and sprites

	lzs.load.image('ray', 'assets/sprites/player.png');
	lzs.load.image('background', 'assets/sprites/grass-dirt-mix-pixeled.png');

	lzs.load.audio('pew', 'assets/sounds/raygun1.mp3');
}

// Game vars

var cursors;
var fireButton;
var ray;
var raySpeed = 1000;
var pew;

function create() {
	lzs.add.tileSprite(0, 0, screenWidth, screenHeight, 'background');

	lzs.physics.startSystem(Phaser.Physics.ARCADE);

	ray = lzs.add.sprite(screenWidth * 0.5, screenHeight * 0.8, 'ray');

	lzs.physics.enable(ray, Phaser.Physics.ARCADE);

	//controls
	cursors = lzs.input.keyboard.createCursorKeys();
	fireButton = lzs.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

	//audio
	pew = lzs.add.audio('pew');
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
	}
}

function fireRay() {
	pew.play();
}

function render() {

}