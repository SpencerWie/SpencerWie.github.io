function Enemy(x, y, width, height, image, speed ,walkSteps, hp, type) 
{
	this.x = x;
	this.y = y;
	this.frameX = 0; // X frame on tilemap sprite
	this.frameY = 0; // Y frame on tilemap sprite
	this.width = width;
	this.height = height;
	this.sWidth = width; this.sHeight = height;
	this.image = image;
	this.speed = speed;
	this.startWalk = this.x;
	this.endWalk = this.x + (walkSteps * 32) - (this.width - 32);
	this.hp = hp;
	this.type = type
	
	if(type == "red block") this.y -= 20;
	if(type == "spike") { this.sWidth = 35; this.sHeight = 35; }
   
	this.draw = function(){
    	this.update();
    	ctx.drawImage(this.image, this.frameX*this.sWidth, this.frameY*this.sHeight, this.sWidth, this.sHeight, this.x, this.y, this.sWidth, this.sHeight);
   	}
   
   this.update = function() 
   {
    	if(DEAD) return;
		if(type == "red block")
		{
			if(this.x >= this.endWalk && this.speed > 0){
				this.x = this.endWalk;
				this.speed *= -1;
				this.frameY = 1;
			}
			else if(this.x <= this.startWalk && this.speed < 0){
				this.x = this.startWalk;
				this.speed *= -1;
				this.frameY = 0;
			}
			this.x += this.speed;
		}
		else if(type == "spike")
		{
			for(item in items) {
				var isSolidBlock = (isItem(items[item],'block') || isItem(items[item],'lock'));  
				if (isSolidBlock && collide(items[item], this)) {
					if(this.speed > 0)
						this.x = items[item].x - this.width;
					else 
						this.x = items[item].x + this.width;
					this.speed *= -1;
					break;
				}
			}
			this.x += this.speed;
		}
   }
}

function BigRedAttack(x, y) 
{
	this.x = x;
	this.y = y;
	this.width = 755;
	this.height = 145;
	this.image = images['BigRed_Attack'];
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
	this.hp = 6;
	this.attackDelay = 0;     // Timer to wait before attacking
	this.attackTimer = 0;     // Timer it takes to do an attack
	this.vulnerableTimer = 0; // Timer for how long boss is exposed to damage
	this.deathTimer = 0;      // On death how long before boss is removed for death animation.
	this.energy = 2;

	this.draw = function() {
		this.update();
		this.frameY = this.speed > 0 ? 1 : 0; // Face left or right depending on what direction we are moving

		// When vulnerable add transparency to draw
		var vulnerable = this.hit || this.deathTimer > 0
		if(vulnerable) ctx.globalAlpha = 0.5;
		ctx.drawImage(this.image, this.frameX*this.width, this.frameY*this.height, this.width, this.height + 1 - this.deathTimer, this.x, this.y + this.deathTimer, this.width, this.height + 1 - this.deathTimer);
		if(vulnerable) ctx.globalAlpha = 1;

		if(this.attackTimer) {
			var attackFrame = Math.floor((110 - this.attackTimer)/10);
			this.atk.x = this.frameY ? this.x + this.width : this.x - this.atk.width;
			this.atk.y = this.y + 20;
			ctx.drawImage(
				this.atk.image, 
				this.atk.width*this.frameY, 
				attackFrame*this.atk.height, 
				this.atk.width, 
				this.atk.height, 
				this.atk.x, 
				this.y, this.atk.width, this.atk.height
			);
		}
	}

	this.update = function() {

		// On death remove from item list
		if(this.hp <= 0) {
			if(this.deathTimer > 128) {
				items.splice(this.index, 1);
				KEYS++;
				COINS+=40;
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
		if(this.speed > 0) this.speed = 4 + (4 - this.hp);
		else this.speed = -4 - (4 - this.hp);

		for(item in items) {
			var isSolidBlock = (isItem(items[item],'block') || isItem(items[item],'lock'));  
			if (isSolidBlock && collide(items[item], this)) {
				if(this.speed > 0) 
					this.x = items[item].x - this.width - 1; // Turn around and be a pixel away from the wall to the right
				else 
					this.x = items[item].x + 33; // Turn around and be a pixel away from the block to the left
				this.speed *= -1;
				// Soon after turning around get ready to attack with some degree of randomness, attacks are faster the higher the speed is.
				this.attackDelay =  Math.abs(this.speed) + Math.round(Math.random() * (100/Math.abs(this.speed)));
				break;
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
			if(this.attackTimer == 0) {
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