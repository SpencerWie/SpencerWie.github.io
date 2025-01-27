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
			var blocks = getBlocksNearItem(this);
			for(var Y = blocks.above; Y < blocks.below; Y++ ) {
				 for(var X = blocks.left; X < blocks.right; X++ ) {
					var item = MapItems[Y][X];
					if(!item) continue;
					var isSolidBlock = (isItem(item,'block') || isItem(item,'lock'));  
					if (isSolidBlock && collide(item, this)) {
						if(this.speed > 0)
							this.x = item.x - this.width;
						else 
							this.x = item.x + this.width;
						this.speed *= -1;
						break;
					}
				}
			}
			this.x += this.speed;
   	}
	}
}

function JellyFish(x, y, size) {
	Enemy.call(this, x, y, size - 4, size - 4, images["jellyfish"], 5, 0, 1, "jellyfish");
	this.MaxFrames = 8;
	this.frameTicks = 8;
	this.frame = 0;
	this.ticks = 0;
	this.size = size;
	this.movementSpeed = 1;
	this.speed = this.movementSpeed;

	this.draw = function(){
		this.update();
		var oldAlpha = ctx.globalAlpha;
		ctx.globalAlpha = 0.8;
		ctx.drawImage(this.image, this.frame*this.size, 0, this.size, this.size, this.x + 2, this.y + 2, this.size, this.size);
		ctx.globalAlpha = oldAlpha;
	}

	this.update = function() {
		this.animate();
		var blocks = getBlocksNearItem(this, 1);
		var aboveBlock = MapItems[blocks.above]?.[blocks.left+1];
		var belowBlock = MapItems[blocks.below-1]?.[blocks.left+1];
		if(!aboveBlock || aboveBlock.image != 'water' || this.y <= 0) this.speed = this.movementSpeed;
		else if(!belowBlock || belowBlock.image != 'water') this.speed = -this.movementSpeed;
	 	this.y += this.speed;
	}

	this.animate = function() {
		this.ticks++;
		if(this.ticks >= this.frameTicks) {
			this.ticks = 0;
			this.frame++;
			if(this.frame >= this.MaxFrames) this.frame = 0;
		}
	}
}
