var screenWidth = 1024;
var screenHeight = 768;

var lzs = new Phaser.Game(screenWidth, screenHeight, Phaser.AUTO, 'lzs', { preload: preload, create: create, update: update, render: render });

var cursors;
var fireButton;
var ray;
var raySpeed = 1000;

function preload() {
	// Load sounds and sprites

	lzs.load.image('ray', 'assets/sprites/player.png');

}

// Game vars

var ray;

function create() {

	lzs.physics.startSystem(Phaser.Physics.ARCADE);

	ray = lzs.add.sprite(screenWidth * 0.5, screenHeight * 0.8, 'ray');

	lzs.physics.enable(ray, Phaser.Physics.ARCADE);

	//controls
	cursors = lzs.input.keyboard.createCursorKeys();
	fireButton = lzs.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
}

function update() {

	if (ray.alive) {
		ray.body.velocity.setTo(0, 0);

		if (cursors.left.isDown) {
			if (ray.position.x > 0) {
				ray.body.velocity.x = -raySpeed;
			}
		}
		else if (cursors.right.isDown) {
			if (ray.position.x < (lzs.world.width - ray.width)) {
				ray.body.velocity.x = raySpeed;
			}
		}
		else if (cursors.up.isDown) {
			if (ray.position.y > (lzs.world.height / 2)) {
				ray.body.velocity.y = -raySpeed;
			}
		}
		else if (cursors.down.isDown) {
			if (ray.position.y < (lzs.world.height - ray.height)) {
				ray.body.velocity.y = raySpeed;
			}
		}
	}
}

function render() {

}