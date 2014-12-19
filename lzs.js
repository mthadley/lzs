var screenWidth = 1024;
var screenHeight = 768;

var lzs = new Phaser.Game(screenWidth, screenHeight, Phaser.AUTO, 'lzs', { preload: preload, create: create, update: update, render: render });

function preload() {
	// Load sounds and sprites

	lzs.load.image('ray', 'assets/sprites/player.png');
	lzs.load.image('background', 'assets/sprites/grass-dirt-mix-pixeled.png');

}

// Game vars

var ray;

function create() {

	lzs.add.tileSprite(0, 0, screenWidth, screenHeight, 'background');

	lzs.physics.startSystem(Phaser.Physics.ARCADE);

	ray = lzs.add.sprite(screenWidth * 0.5, screenHeight * 0.8, 'ray');
}

function update() {

}

function render() {

}