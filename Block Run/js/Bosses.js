function BigRedAttack(x, y) 
{
	this.x = x;
	this.y = y;
	this.width = 755;
	this.height = 145;
	this.image = currentMapIdx == 8 ? images['BigRed_Attack_inv']: images['BigRed_Attack'];
}

function BigJellyAttack(x, y) 
{
	this.x = x;
	this.y = y;
	this.width = 145;
	this.height = 755;
	this.image = images['BigJelly_Attack'];
}

function BigJelly(x, y, index) 
{
	this.x = x;
	this.y = y;
	this.index = index;
	this.frameX = 0; // X frame on tilemap sprite
	this.frameY = 0; // Y frame on tilemap sprite
	this.width = 120; this.padWidth = 10;
	this.height = 110; this.padHeight = 10;
	this.image = images['BigJelly'];
	this.atk = new BigRedAttack(this.x, this.y);
	this.speedX = 2;
	this.speedY = 2;
	this.stop = false;
	this.hit = false;
	this.hp = 10; // If on Level 2 this is the diamond unlock BigJelly so more hp.
	this.maxHp = this.hp;
	this.attackDelay = 0;     // Timer to wait before attacking
	this.attackTimer = 0;     // Timer it takes to do an attack
	this.vulnerableTimer = 0; // Timer for how long boss is exposed to damage
	this.deathTimer = 0;      // On death how long before boss is removed for death animation.
	this.energy = 2;
	this.MaxFrames = 20; // Animation frame loops
	this.frameTicks = 5; // Amount of frames before animation tick
	this.ticks = 0;
	this.animationCycle = 0;
	this.vulnerable = false;

	this.draw = function() {
		this.animate();
		this.update();

		// When vulnerable add transparency to draw
		var vulnerable = this.hit || this.deathTimer > 0
		if(vulnerable) ctx.globalAlpha = 0.5;
		else ctx.globalAlpha = 0.8;

		// Adjust hitbox size so hitbox is smaller than sprite size to adjust for the sprite shape
		var drawHeight = this.height+this.padHeight;
		var drawWidth = this.width+this.padWidth;
		ctx.drawImage(
			this.image, 
			this.frameX*drawWidth, this.frameY*drawHeight, 
			drawWidth, 
			drawHeight - this.deathTimer, 
			this.x - (this.padWidth/2), 
			this.y + this.deathTimer + (this.vulnerableTimer/10) - (this.padHeight/2), 
			drawWidth, 
			drawHeight - this.deathTimer
		);

		if(this.attackTimer) {
			// Do Big Jelly attacks. The boss goes between a few seperate attaks. A whole area attack that hits the entire map and homing ligning strikes from above.
		}
		ctx.globalAlpha = 1;
	}

	this.animate = function() {
		this.ticks++;
		if(this.ticks >= this.frameTicks) {
			this.ticks = 0;
			this.frameX++;
			if(this.frameX >= this.MaxFrames) { 
				this.frameX = 0; 
				this.animationCycle++;
			}
		}
		if(this.animationCycle > 3 && this.y > 180) {
			this.frameX = 0; 
			this.vulnerableTimer = 230;
			this.animationCycle = 0;
		}
	}

	this.update = function() {

		var foundBoss = Enemies.find(item => isItem(item, "BigJelly"));
		// On death remove from item list
		if(this.hp <= 0) {
			this.frameY = 0; 
			if(this.deathTimer > 128) {
				if(foundBoss) {
					KEYS++;
					COINS+=200;
					if(!beatBigJelly()) COINS+=500;
					Enemies = Enemies.filter(item => !isItem(item, "BigJelly"));
					boss = false;
					delete this;
				}
			}
			this.deathTimer++;
			return;
		}

		this.handleMovementAndCollisions();
		this.handleAttacks();
	}

	this.handleMovementAndCollisions = function() {
		// The lower the boss hp the faster it moves
		if(this.vulnerableTimer > 0) return;
		var hpScaling = ((this.maxHp - this.hp)/2);

		// Flip between fast horizontal and verticle movement 
		if (this.hp % 2 === 0) {
			if (this.speedX > 0) this.speedX = 3 + hpScaling;
			else this.speedX = -3 - hpScaling;
			if (this.speedY > 0) this.speedY = 2 + (hpScaling/2);
			else this.speedY = -2 - (hpScaling/2);
		} else {
			if (this.speedY > 0) this.speedY = 3 + hpScaling;
			else this.speedY = -3 - hpScaling;
			if (this.speedX > 0) this.speedX = 2 + (hpScaling/2);
			else this.speedX = -2 - (hpScaling/2);
		}

		var blocks = getBlocksNearItem(this, 5);
		for(var Y = blocks.above; Y < blocks.below; Y++ ) {
			 for(var X = blocks.left; X < blocks.right; X++ ) {
				var item = MapItems[Y][X];
				if(!item) continue;
				var isSolidBlock = (isItem(item,'block') || isItem(item,'lock'));  
				if (isSolidBlock && collide(item, this)) {
					if(this.speedX > 0 && item.x == 32*23) {
						this.x = item.x - this.width - 1; // Turn around and be a pixel away from the wall to the right
						this.speedX *= -1;
						break;
					} else if (item.x == 0) {
						this.x = item.x + 33; // Turn around and be a pixel away from the block to the left
						this.speedX *= -1;
						break;
					}
					if (item.y == 32*10) {
						this.y = item.y - this.height - 1; 
						this.speedY *= -1;
					} else if (item.y == 0) { 
						this.y = item.y + 33;
						this.speedY *= -1;
					}
				}
			}
		}
		if(!this.stop) this.x += this.speedX;
		if(!this.stop) this.y += this.speedY;
	}

	this.handleAttacks = function() {
		// If we are active to attack wait until the delay ends and then trigger attack animation
		if(this.attackDelay > 0) {
			this.attackDelay--;
			if(this.attackDelay <= 0) this.startAttack();
		}

		// If we are currently attacking draw attack animation
		if(this.attackTimer > 0) {
			this.attackTimer--;
			// If close to death charge up part of the attack is twice as fast
			if(this.hp <= 2 && this.attackTimer > 70) this.attackTimer--; 
			if(this.attackTimer <= 0) {
				this.stop = false;
				this.frameX = 0;
				this.energy--;
				if(this.energy == 0) this.vulnerableTimer = 100 + (this.hp*5); // Invulnerablity last slightly less as hp lowers
			}
		}

		// If out of energy after doing an attack boss is vulnerable to taking damage
		if(this.vulnerableTimer > 0) {
			this.hit = true;
			this.vulnerableTimer--;
			this.stop = true;
			this.frameX = 0;
			if(this.vulnerableTimer == 0) {
				this.stop = this.hit = false;
				this.frameX = 0;
				this.frameY = 0; 
				this.energy =  1 + Math.ceil(Math.random() * 2);
			}
		}
	}

	this.startAttack = function() {
		this.frameX = 1;
		this.stop = true;
		this.attackTimer = 110;
	}

	this.takeDamage = function() {
		this.frameY = 1; 
		this.hp--;
		this.vulnerableTimer = 200;
		this.hit = true;
	}
}

function BigRed(x, y, index) 
{
	this.x = x;
	this.y = y;
	this.index = index;
	this.frameX = 0; // X frame on tilemap sprite
	this.frameY = 0; // Y frame on tilemap sprite
	this.width = 128;
	this.height = 127;
	this.image = images['BigRed'];
	this.atk = new BigRedAttack(this.x, this.y);
	this.speed = -4;
	this.stop = false;
	this.hit = false;
	this.hp = currentMapIdx == 2 ? 10 : 6; // If on Level 2 this is the diamond unlock BigRed so more hp.
	this.maxHp = this.hp;
	this.attackDelay = 0;     // Timer to wait before attacking
	this.attackTimer = 0;     // Timer it takes to do an attack
	this.vulnerableTimer = 0; // Timer for how long boss is exposed to damage
	this.deathTimer = 0;      // On death how long before boss is removed for death animation.
	this.energy = 2;
	this.isReverseRed = currentMapIdx == 8;
	this.isDarkRed = currentMapIdx == 2;

	this.draw = function() {
		this.update();
		this.frameY = this.speed > 0 ? 1 : 0; // Face left or right depending on what direction we are moving

		// When vulnerable add transparency to draw
		var vulnerable = this.hit || this.deathTimer > 0
		if(this.isDarkRed) ctx.globalCompositeOperation="multiply"; // Challenge BigRed is darker in color
		if(vulnerable) ctx.globalAlpha = 0.5;
		ctx.drawImage(this.image, this.frameX*this.width, this.frameY*this.height, this.width, this.height + 1 - this.deathTimer, this.x, this.y + this.deathTimer, this.width, this.height + 1 - this.deathTimer);
		if(vulnerable) ctx.globalAlpha = 1;

		if(this.isReverseRed) {
			ctx.globalCompositeOperation="difference";
			ctx.fillStyle="white";
			vulnerableHeight = 0;
			if(vulnerable) vulnerableHeight = 6;
			ctx.fillRect(this.x + 2, this.y + 2 + vulnerableHeight, this.width - 4, this.height - 2 - vulnerableHeight);
		}

		if(this.isDarkRed|| this.isReverseRed) ctx.globalCompositeOperation="source-over";

		if(this.attackTimer) {
			var attackFrame = Math.floor((110 - this.attackTimer)/10);
			this.atk.x = this.frameY ? this.x + this.width : this.x - this.atk.width;
			this.atk.y = this.y + 20;
			if( this.attackTimer > 35 && this.attackTimer < 50) ctx.globalAlpha = 1;
			else ctx.globalAlpha = 0.8;
			ctx.drawImage(
				this.atk.image, 
				this.atk.width*this.frameY, 
				attackFrame*this.atk.height, 
				this.atk.width, 
				this.atk.height, 
				this.atk.x, 
				this.y, this.atk.width, this.atk.height
			);
			ctx.globalAlpha = 1;
		}
		
	}

	this.update = function() {

		var foundBoss = Enemies.find(item => isItem(item, "BigRed"));
		// On death remove from item list
		if(this.hp <= 0) {
			if(this.deathTimer > 128) {
				if(foundBoss) {
					if(currentMapIdx == 2) SKEYS++;
					else KEYS++;
					COINS+=50;
					if(!beatBigRed()) COINS+=200;
					Enemies = Enemies.filter(item => !isItem(item, "BigRed"));
					boss = false;
					delete this;
				}
			}
			this.deathTimer++;
			this.frameX = 3;
			return;
		}

		this.handleMovementAndCollisions();
		this.handleAttacks();
	}

	this.handleMovementAndCollisions = function() {
		// The lower the boss hp the faster it moves
		if(this.speed > 0) this.speed = 3 + ((this.maxHp - this.hp)/2);
		else this.speed = -3 - ((this.maxHp - this.hp)/2);
		
		// Inverse red moves much faster
		if(this.isReverseRed) this.speed *= 2;

		var blocks = getBlocksNearItem(this, 5);
		for(var Y = blocks.above; Y < blocks.below; Y++ ) {
			 for(var X = blocks.left; X < blocks.right; X++ ) {
				var item = MapItems[Y][X];
				if(!item) continue;
				var isSolidBlock = (isItem(item,'block') || isItem(item,'lock'));  
				if (isSolidBlock && collide(item, this)) {
					if(this.speed > 0) 
						this.x = item.x - this.width - 1; // Turn around and be a pixel away from the wall to the right
					else 
						this.x = item.x + 33; // Turn around and be a pixel away from the block to the left
					this.speed *= -1;
					// Soon after turning around get ready to attack with some degree of randomness, attacks are faster the higher the speed is.
					this.attackDelay =  Math.abs(this.speed) + Math.round(Math.random() * (100/Math.abs(this.speed)));
					if(this.isReverseRed) this.attackDelay /= 2; // Reverse Red has half the delay to make up for the double speed.
					break;
				}
			}
		}
		if(!this.stop) this.x += this.speed;
	}

	this.handleAttacks = function() {
		// If we are active to attack wait until the delay ends and then trigger attack animation
		if(this.attackDelay > 0) {
			this.attackDelay--;
			if(this.attackDelay <= 0) this.startAttack();
		}

		// If we are currently attacking draw attack animation
		if(this.attackTimer > 0) {
			this.attackTimer--;
			// If close to death charge up part of the attack is twice as fast
			if(this.hp <= 2 && this.attackTimer > 70) this.attackTimer--; 
			if(this.attackTimer <= 0) {
				this.stop = false;
				this.frameX = 0;
				this.energy--;
				if(this.energy == 0) this.vulnerableTimer = 100 + (this.hp*5); // Invulnerablity last slightly less as hp lowers
			}
		}

		// If out of energy after doing an attack boss is vulnerable to taking damage
		if(this.vulnerableTimer > 0) {
			this.vulnerableTimer--;
			this.stop = true;
			this.frameX = this.hit ? 3 : 2;
			if(this.vulnerableTimer == 0) {
				this.stop = this.hit = false;
				this.frameX = 0;
				this.energy =  1 + Math.ceil(Math.random() * 2);
			}
		}
	}

	this.startAttack = function() {
		this.frameX = 1;
		this.stop = true;
		this.attackTimer = 110;
	}

	this.takeDamage = function() {
		this.hp--;
		this.vulnerableTimer = 200;
		this.hit = true;
	}
}

