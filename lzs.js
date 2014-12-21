var lzs = new Phaser.Game(1024, 768, Phaser.AUTO, 'lzs', { preload: preload, create: create, update: update, render: render });

function preload() {
	// Load sounds and sprites

	lzs.load.spritesheet('ray', 'assets/sprites/ray-sheet.png', 145, 128, 7);
	lzs.load.spritesheet('zombie', 'assets/sprites/zombie-sheet.png', 119, 128);

	lzs.load.image('beam', 'assets/sprites/beam-01.png');
	lzs.load.image('background', 'assets/sprites/grass-dirt-mix-pixeled-gray.png');
	lzs.load.image('logo', 'assets/sprites/logo.png');

	lzs.load.audio('alive', 'assets/sounds/angel1.mp3');
	lzs.load.audio('hit', 'assets/sounds/grunt1.mp3');
	lzs.load.audio('pew', 'assets/sounds/raygun1.mp3');
	lzs.load.audio('soundtrack', 'assets/sounds/soundtrack.mp3');
	lzs.load.audio('zombie', 'assets/sounds/zombie1.mp3');
}

// Game vars

var alive;
var bulletSpeed = 1500;
var cursors;
var fireButton;
var fireDelay = 200;
var fireTime = 0;
var gameLost = false;
var hit;
var level = 1;
var levelText = 'Level ';
var levelUpCounter = 0;
var levelUpReq = 20;
var logo;
var loseText = 'Game over, man! Game over!';
var pauseText = 'Paused';
var pew;
var ray;
var raySpeed = 500;
var score = 0;
var scoreString = 'Score: ';
var scoreText;
var soundtrack;
var stateText;
var tween;
var volume = 1;
var zombieHitboxScale = 0.5;
var zombieHitPoints = 3;
var zombies;
var zombieSpawn;
var zombieSpawnLoop;
var zombieSpeed = 50;
var zombieWidth = 119;

function create() {
	lzs.add.tileSprite(0, 0, lzs.world.width, lzs.world.height, 'background');

	logo = lzs.add.sprite(50, 100, 'logo');

	setTimeout(function() {
		logo.destroy();
		ray.play('walkForward');
	}, 4000);

	lzs.physics.startSystem(Phaser.Physics.ARCADE);

	ray = lzs.add.sprite(lzs.world.width * 0.5, lzs.world.height * 0.8, 'ray');

	ray.animations.add('walkForward', [1, 2], 6, false);
	ray.animations.add('walkSide', [3, 4], 6, false);
	ray.animations.add('walkBack', [0], 6, false);
	ray.animations.add('fireForward', [5], true);

	ray.anchor.setTo(0.5, 1);

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

	var pauseButton = lzs.input.keyboard.addKey(Phaser.Keyboard.P);

	pauseButton.onDown.add(togglePaused, this);

	var muteButton = lzs.input.keyboard.addKey(Phaser.Keyboard.M);

	muteButton.onDown.add(toggleMuted, this);

	createZombies();

	//audio
	alive = lzs.add.audio('alive', volume);
	hit = lzs.add.audio('hit', volume);
	pew = lzs.add.audio('pew', volume);
	zombieSpawn = lzs.add.audio('zombie', volume);
	soundtrack = lzs.add.audio('soundtrack');

	soundtrack.play('', 0, volume / 3, true);

	setTimeout(function() {
		zombieSpawn.play();
	}, 2000);

	//text
	stateText = lzs.add.text(lzs.world.centerX, lzs.world.centerY, ' ', {fill: '#E9B3F7'});
	stateText.anchor.setTo(0.5, 0.5);
	stateText.visible = false;
	stateText.font = 'badaboom';
	stateText.fontSize  = '84';

	//Score
	scoreText = lzs.add.text(20, lzs.world.height - 65, scoreString + score, {fill: '#E9B3F7' });
	scoreText.font = 'badaboom';
	scoreText.fontSize  = '48';
	scoreText.visible = false;
}

function update() {
	if (ray.alive) {
		ray.body.velocity.setTo(0, 0);

		if (cursors.left.isDown) {
			if (ray.position.x > 0) {
				ray.body.velocity.x = -raySpeed;
				ray.scale.x = 1;
				ray.play('walkSide');
			}
		}
		if (cursors.right.isDown) {
			if (ray.position.x < lzs.world.width) {
				ray.body.velocity.x = raySpeed;
				ray.scale.x = -1;
				ray.play('walkSide');
			}
		}
		if (cursors.up.isDown) {
			if (ray.position.y > (lzs.world.height / 2)) {
				ray.body.velocity.y = -raySpeed;
				ray.scale.x = 1;
				ray.play('walkForward');
			}
		}
		if (cursors.down.isDown) {
			if (ray.position.y < (lzs.world.height)) {
				ray.body.velocity.y = raySpeed;
				ray.scale.x = 1;
				ray.play('walkBack');
			}
		}

		if (fireButton.isDown) {
			fireRay();
		}

		//collision detection
		lzs.physics.arcade.overlap(bullets, zombies, zombieBulletCollisionHandler);
		lzs.physics.arcade.overlap(ray, zombies, loseGame);

		zombies.forEach(function(zombie) {
			if (zombie.position.y > (lzs.world.height - zombie.height)) {
				gameLost = true;
			}
		}, this);

		if (gameLost) {
			loseGame();
		}
		else if (levelUpCounter == levelUpReq) {
			levelUpCounter = 0;

			increaseLevel();
		}
	}
}

function fireRay() {
	if (lzs.time.now > fireTime) {
		pew.play();

		bullet = bullets.getFirstExists(false);

		if (bullet) {
			bullet.reset(ray.x + 10, ray.y - ray.height);
			bullet.body.velocity.y = -bulletSpeed;
			fireTime = lzs.time.now + fireDelay;

			ray.play('fireForward');

			setTimeout(function() {
				ray.play('walkForward');
			}, 100);
		}
	}
}

function createZombies() {
	zombies = lzs.add.group();
	zombies.enableBody = true;
	zombies.physicsBodyType = Phaser.Physics.ARCADE;
	zombies.setAll('outOfBoundsKill', true);

	zombieSpawnLoop = lzs.time.events.loop(2000, createZombie, this);
}

function createZombie() {
	var position = Math.min(lzs.world.width * Math.random(), lzs.world.width - zombieWidth);
	var zombie = zombies.create(position, -30, 'zombie');

	zombie.anchor.setTo(0.5, 1);

	zombie.animations.add('walkGreen', [0, 1, 2, 3], 3, true);
	zombie.animations.add('walkRed', [4, 5, 6, 7], 3, true);
	zombie.animations.add('leave', [9, 10, 11], 6, true);
	zombie.animations.add('transform', [8], 1, false);

	if (Math.random() > 0.5) {
		zombie.play('walkGreen');
		zombie.hits = 0;
	}
	else {
		zombie.play('walkRed');
		zombie.hits = -2;
	}

	zombie.body.velocity.y = zombieSpeed;
	zombie.alive = false;

	zombie.body.setSize(zombie.width * zombieHitboxScale, zombie.height * zombieHitboxScale, 0, -40);
}

function zombieBulletCollisionHandler(bullet, zombie) {
	if (!zombie.alive) {
		bullet.kill();
		zombie.hits++;

		if (zombie.hits < zombieHitPoints) {
			hit.play();
		}

		if (zombie.hits == zombieHitPoints) {
			zombie.alive = true;
			zombie.body.velocity.y = 0;
			levelUpCounter++;

			if (zombie.position.x > (lzs.world.width * 0.5)) {
				zombie.body.velocity.x = zombieSpeed * 3;
			}
			else {
				zombie.body.velocity.x = -zombieSpeed * 3;
				zombie.scale.x = -1;
			}

			zombie.play('transform');

			setTimeout(function() {
				zombie.play('leave');
			}, 200);

			alive.play();

			score += 20;
			scoreText.visible = true;
			scoreText.text = scoreString + score;
		}
	}
}

function increaseLevel() {
	level++;
	levelUpReq += 5;
	zombieSpawnLoop.delay -= 80;
	zombieSpeed += 8;

	stateText.text = levelText + level;
	stateText.visible = true;

	setTimeout(function() {
		stateText.visible = false;
	}, 2000);
}

function loseGame() {
	stateText.text = loseText;
	stateText.visible = true;
	zombies.destroy();
	bullets.destroy();
	ray.destroy();
}

function render() {
	// debug
}

function toggleMuted() {
	volume = 1 - volume;

	for (var audio of [alive, hit, pew, zombieSpawn]) {
		audio.volume = 1 - audio.volume;
	}

	if (!soundtrack.paused) {
		soundtrack.pause();

		document.getElementById('mute').innerHTML = 'Unmute';
	}
	else {
		soundtrack.resume();

		document.getElementById('mute').innerHTML = 'Mute';
	}
}

function togglePaused(game) {
	lzs.paused = !lzs.paused;

	if (lzs.paused) {
		stateText.text = pauseText;
		stateText.visible = true;

		document.getElementById('pause').innerHTML = 'Unpause';
	}
	else {
		stateText.visible = false;

		document.getElementById('pause').innerHTML = 'Pause';
	}
}
