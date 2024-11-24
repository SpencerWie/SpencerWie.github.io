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
	this.attack_image = images['BigRed_Attack'];
	this.attack_w = 755;
	this.attack_h = 145;
	this.speed = -4;
	this.stop = false;
	this.hit = false;
	this.hp = 5;
	this.attackDelay = 0;     // Timer to wait before attacking
	this.attackTimer = 0;     // Timer it takes to do an attack
	this.vulnerableTimer = 0; // Timer for how long boss is exposed to damage
	this.deathTimer = 0;      // On death how long before boss is removed for death animation.
	this.energy = 2;

	this.draw = function() {
		this.update();
		this.frameY = this.speed > 0 ? 1 : 0;
		if(this.hit || this.deathTimer > 0) ctx.globalAlpha = 0.5;
		ctx.drawImage(this.image, this.frameX*this.width, this.frameY*this.height, this.width, this.height + 1 - this.deathTimer, this.x, this.y + this.deathTimer, this.width, this.height + 1 - this.deathTimer);
		if(this.hit || this.deathTimer > 0) ctx.globalAlpha = 1;
		if(this.attackTimer) {
			var attackFrame = Math.floor((110 - this.attackTimer)/10);
			ctx.drawImage(this.attack_image, this.attack_w*this.frameY, attackFrame*this.attack_h, this.attack_w, this.attack_h, this.frameY ? this.x + this.width : this.x - this.attack_w, this.y, this.attack_w, this.attack_h);
		}
	}

	this.update = function() {

		// On death remove from item list
		if(this.hp <= 0) {
			if(this.deathTimer > 128) {
				items.splice(this.index, 1);
				return;
			}
			this.deathTimer++;
			this.frameX = 3;
			return;
		}

		// The lower the boss hp the faster it moves
		if(this.speed > 0) this.speed = 4 + (4 - this.hp);
		else this.speed = -4 - (4 - this.hp);

		for(item in items) {
			var isSolidBlock = (isItem(items[item],'block') || isItem(items[item],'lock'));  
			if (isSolidBlock && collide(items[item], this)) {
				if(this.speed > 0)
					this.x = items[item].x - this.width - 1;
				else 
					this.x = items[item].x + 33;
				this.speed *= -1;
				this.attackDelay =  Math.abs(this.speed) + Math.round(Math.random() * (100/Math.abs(this.speed)));
				break;
			}
		}
		if(!this.stop) this.x += this.speed;

		// If we are active to attack wait until the delay ends and then trigger attack animation
		if(this.attackDelay > 0) {
			this.attackDelay--;
			if(this.attackDelay <= 0) this.startAttack();
		}

		// If we are currently attacking draw attack animation
		if(this.attackTimer > 0) {
			this.attackTimer--;
			if(this.hp <= 2 && this.attackTimer > 1) this.attackTimer--; // If close to death attacks are twice as fast
			if(this.attackTimer == 0) {
				this.stop = false;
				this.frameX = 0;
				this.energy--;
				if(this.energy == 0) this.vulnerableTimer = 75 + (this.hp*5); // Invulnerablity last slightly less as hp lowers
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