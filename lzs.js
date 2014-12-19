var screenWidth = 1024;
var screenHeight = 768;

var lzs = new Phaser.Game(screenWidth, screenHeight, Phaser.AUTO, 'lzs', { preload: preload, create: create, update: update, render: render });

function preload() {
	// Load sounds and sprites

	lzs.load.image('ray', 'assets/sprites/player.png');

}

// Game vars

var ray;

function create() {

	lzs.physics.startSystem(Phaser.Physics.ARCADE);

	ray = lzs.add.sprite(screenWidth * 0.5, screenHeight * 0.8, 'ray');
}

function update() {

}

function render() {

}