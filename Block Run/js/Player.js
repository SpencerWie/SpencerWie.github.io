var player;
LEFT = RIGHT = UP = DOWN = SHIFT = false;
DEAD = false;
var groundPoint = { x: 0, y: 0 , color: 'red', height: 4, width: 28};

function Player() {
    this.width = 28;
    this.height = 28;
    this.size = 32;
    this.startX = (canvas.width/2) - (this.size/2);   
    this.startY = (canvas.height/2) - (this.size/2);
    this.x = this.startX;   
    this.y = this.startY;
    this.dx = 0; this.dy = 0;
    this.ddx = 0; this.ddy = 0;
    this.minSpeed = 2; this.walk = 7; this.run = 10;
    this.accelerateRun = 0; // Speed modifier for acceleration when runnning
    this.accelerateWalk = 0; // Speed modifier for acceleration when walking
    this.accelerateBump = 0.3; // Speed bump per frame until run speed is hit
    this.speed = 7;
    this.minYSpeed = -15; this.maxYSpeed = 12;
    this.jumpPower = 17; // 10
    this.frameX = 0; // X frame on tilemap sprite
    this.frameY = 0; // Y frame on tilemap sprite
    this.image = images['player_blink'];
    this.jump = false;
    this.doubleJump = false;
    this.canDoubleJump = false;
    this.ducked = false;
    this.timer = 0; // For animation
    this.step = 0; // For frame movement (animation)
    this.lastPositions = [];    // Keeps track of the last `lastPositionsMax` player positions, used for movement animation
    this.lastPositionsMax = 10; // Maximum number of positions being kept track of
    this.selectedColor = 0; // Color of running animation
    this.unlockedColors = 0; // Unlocked color indexes
    this.colors = [{r: 0, g: 0, b: 0}, {r: 255, g: 249, b: 128}, {r: 255, g: 255, b: 255}];

    var duckLeft =  { x: 2, y: 2 };
    var duckRight = { x: 1, y: 2 };

    var armorBreak = false;
    var armorTimer = 1;
    
    this.draw = function() {
        ctx.drawImage(this.image, this.frameX*this.size, this.frameY*this.size, this.size, this.size, this.x, this.y, this.size, this.size);
        if(this.unlockedColors > 0) {
            // Draw a gold alpha around the player
            if(this.selectedColor == 1) {
                ctx.fillStyle = '#fff980';
                ctx.globalAlpha = 0.5;
                if(this.ducked) ctx.fillRect(this.x + 4, this.y + 20, this.size - 8, this.size - 24);
                else ctx.fillRect(this.x + 4, this.y + 4, this.size - 8, this.size - 8);
                ctx.globalAlpha = 1;
            }
            // Draw the player in an inverse color
            else if (this.selectedColor == 2) {
                ctx.globalCompositeOperation="difference";
                ctx.fillStyle="white";
                if(this.ducked) ctx.fillRect(this.x + 1, this.y + 15, this.size - 2, this.size - 16);
                else ctx.fillRect(this.x + 1, this.y + 1, this.size - 2, this.size - 2);
                ctx.globalCompositeOperation="source-over";
            }
        }
        if(armorBreak && ARMOR) {
            ctx.globalAlpha = armorTimer;
            ctx.drawImage(images["armor"], this.x, this.y - 40, 32, 32);
            armorTimer -= 0.01;
            if(armorTimer < 0) {
                ARMOR = armorBreak = false;
                armorTimer = 1;
            }
        }
    }
    
    this.update = function() 
    {
       this.BlinkAnimation();
       this.verticalMovement();
       this.horizontalMovement();
       this.handleCollisions();
       this.recordPosition(this.x, this.y);
       if(DEAD) { this.frameX = 0; this.frameY = 2; }
    }
    
    this.recordPosition = function(x, y) 
    {   // Push to positions array, new items are the first and old are the last.
         this.lastPositions.unshift({'x': x, 'y': y});
         if(this.lastPositions.length > this.lastPositionsMax) this.lastPositions.length = this.lastPositionsMax;
         if(!SHIFT || this.ducked ) {this.lastPositions.pop(); this.lastPositions.pop()}
         this.RunAnimation();
    }
    
    this.RunAnimation = function(){
         if(this.ducked) return;
         var length = this.lastPositionsMax;
         for(var i=0; i < this.lastPositions.length; i++)
         {
             var pos = this.lastPositions[i];
             var alphaEffect = 5.0; // The larger the more light the effect is
             var factor = (((i*length)+1)*alphaEffect);
             var aplha = length/factor;
             var c = this.colors[this.selectedColor];
             ctx.fillStyle = "rgba("+c.r+","+c.g+","+c.b+","+aplha+")";
             ctx.fillRect(pos.x + 1, pos.y, this.size - 2, this.size);
         }
    }
    
    this.BlinkAnimation = function() 
    {
        if(this.ducked) {
            this.step = 0;
            this.timer = 200;
            return;
        } 

        var blink_timeframe = [[220 ,1 ,0] , [223 ,2 ,0] , [226, 1, 0] , [229 ,0 ,0]];
        this.timer++;
 
        for(var i = 0; i < blink_timeframe.length; i++ ) {
            if(this.step == i && this.timer > blink_timeframe[i][0]) {
                this.frameX = blink_timeframe[i][1];
                this.step = i + 1;
            }
            if( this.step == blink_timeframe.length ){
                this.step = 0;
                this.timer = 0;
            }
        }   
    }
    
    this.verticalMovement = function()
    {
       if(DEAD) return;

       // Arrow Key detection, if we jumped from the ground.
       if(UP && this.jump && !DOWN){  
          this.dy = -this.jumpPower; 
          this.ddy = -1;
          this.jump = false;
       }
       // If unlocked you can do a second jump once you start falling
       else if(UP && !this.jump && this.canDoubleJump && this.doubleJump && this.dy > 9) {
          this.dy = -this.jumpPower/1.7; 
          this.ddy = -1;
          this.doubleJump = false;
       }
       
       if(this.dy < 10 && !this.jump) this.ddy = GRAVITY; // Apply Gravity
       
       this.dy += this.ddy; // Update variables
       this.y += this.dy;
         
        //TODO: We need to be able to drop from a plateform by just using DOWN instead of jump+DOWN
       
        // Vertical Block collisions. (needs to be seperate from horizonal for proper collisions)
        for(i in items) {
            var item = items[i];
            // If we touched the plateform and are not ducking.
            var isPlatform = isItem(item,'platform') || (isItem(item,'falling_platform') && item.alpha > 0.1)
            var platformCollision = !DOWN && isPlatform && this.y+(this.height/2) <= item.y;
            // For upwards collision check if we are moving up and hit a block, if so place player at the bottom of block and halt verticle motion.
            if(this.dy < 0 && collide(this,item) && isItem(item,'block')) {
                this.dy = 0;
                this.ddy = 0;
                this.y = item.y + this.size;
            }// For downwards collision check if we are moving down and hit a block, if so place player at the top of block and halt verticle motion.
            else if(this.dy > 0 && collide(this,item) && (isItem(item,'block') || platformCollision)) {
                this.dy = 0;
                this.ddy = 0;
                this.y = item.y - this.size + 1;
                this.jump = this.doubleJump = true;
                // If we are on a falling platform start falling and disappearing
                if(isItem(item,'falling_platform') && item.alpha > 0) {
                    this.y = item.y - this.size + 3;
                    item.startFalling();
                    this.dy = 0.04;
                }
            }
        }
       
        //Speed limits
        if(this.dy > this.maxYSpeed) this.dy = this.maxYSpeed;          
        if(this.dy < this.minYSpeed) this.dy = this.minYSpeed;   
    }

    this.bounceOffEnemy = function(enemy) {
        this.dy = -this.jumpPower/1.3;
        this.ddy = -1;
        this.jump = true; 
        this.y = enemy.y - 25;
    }
    
    this.horizontalMovement = function()
    {
       if(DEAD) return;
 
       if(!SHIFT && (LEFT || RIGHT)) {
          this.accelerateWalk += this.accelerateBump*5;
          if(this.accelerateWalk > this.walk) this.accelerateWalk = this.walk;
          this.speed = this.accelerateWalk;
       } else {
          this.accelerateWalk -= this.accelerateBump*5;
          if(this.accelerateWalk < 0) this.accelerateWalk = 0;
          this.speed = this.accelerateWalk;
       } 
 
       // Handle Running (Shift)
       var speedDiff = this.run - this.walk;
       if(SHIFT) {
          this.accelerateRun += this.accelerateBump;
          if(this.accelerateRun > speedDiff) this.accelerateRun = speedDiff;
          this.speed = this.walk + this.accelerateRun;
       } else {
          this.accelerateRun -= this.accelerateBump;
          if(this.accelerateRun < 0) this.accelerateRun = 0;
          this.speed = this.walk + this.accelerateRun;
       } 
       
       if(LEFT){ 
          this.dx = this.speed; // Move Left
          this.frameY = 1; // Face Left
       }
       if(RIGHT){ 
          this.dx = -this.speed; // Move Right
          this.frameY = 0; // Face Right
       }
       if(!LEFT && !RIGHT) {// If no arrow keys no movement if accelerating slow depending on the direction.
            if(this.frameY == 1) {
                this.dx = 0 + this.accelerateWalk;
            } else if (this.frameY == 0) {
                this.dx = 0 - this.accelerateWalk;
            } else if(this.frameX == duckLeft.x && this.frameY == duckLeft.y) {
                this.dx = 0 + this.accelerateWalk;
            } else if(this.frameX == duckRight.x && this.frameY == duckRight.y) {
                this.dx = 0 - this.accelerateWalk;
            }
       } 
       this.handleDucking();
       // Update position and move camra.
       player.x -= this.dx;
       scrollX += this.dx;
       ctx.translate(this.dx, 0);   
    }
    
    this.handleDucking = function()
    {  // Duck only when holding the down arrow and player isn't jumping
       if(!DOWN && this.ducked) 
       {
           this.ducked = false;
           if( this.frameX == duckLeft.x && this.frameY == duckLeft.y ) {
             this.frameX = 0; this.frameY = 1;
           }
           else if( this.frameX == duckRight.x && this.frameY == duckRight.y ) {
             this.frameX = 0; this.frameY = 0;
           }
       }      
       if(DOWN && this.jump)
       {
           if(this.frameY == 1) { 
             this.frameX = duckLeft.x; 
             this.frameY = duckLeft.y; 
           }
           if(this.frameY == 0) { 
             this.frameX = duckRight.x; 
             this.frameY = duckRight.y; 
           }          
           this.ducked = true;
       }
    }
    
    this.handleCollisions = function() 
    {
        for(i in items) {
            var item = items[i]; 
            var isSolidBlock = isItem(item,'block') || isItem(item,'lock') || isItem(item,'lock_silver');
            var movingRight = this.dx <= 0; 
            var movingLeft = this.dx > 0;
            
            if( isItem(item,'key') && collide(this,item) ) {
                items.splice(i, 1);
                KEYS++;
            }                         
            // Locks [ breaks lock if you have a key, otherwise it's treated as a normal block ]
            if( isItem(item,'lock') && collide(this,item) && KEYS > 0 ) {
                items.splice(i, 1);
                KEYS--;
            }
            if( isItem(item,'key_silver') && collide(this,item) ) {
                items.splice(i, 1);
                SKEYS++;
            }                         
            // Locks [ breaks lock if you have a key, otherwise it's treated as a normal block ]
            if( isItem(item,'lock_silver') && collide(this,item) && SKEYS > 0 ) {
                items.splice(i, 1);
                SKEYS--;
            }                    
            // Blocks
            if(movingRight && collide(this,item) && (isSolidBlock)) {
                // Reposition player to be place right next to block, then get the difference and apply that to scrolling of canvas.
                var oldX = this.x;
                this.x = item.x - this.size;
                var diff = oldX - this.x
                ctx.translate(diff, 0);
                scrollX += diff;
                this.speed = this.accelerateRun = this.accelerateWalk = 0;
            }
            else if(movingLeft && collide(this,item) && (isSolidBlock)) {
                var oldX = this.x;
                this.x = item.x + this.size;
                var diff = oldX - this.x
                ctx.translate(diff, 0);
                scrollX += diff;
                this.speed = this.accelerateRun = this.accelerateWalk = 0;
            }
            // Coins
            if( isItem(item,'coin') && collide(this,item) ) {
                items.splice(i, 1);
                COINS++;
            }
            // Hearts
            if( isItem(item,'heart') && collide(this,item) ) {
                items.splice(i, 1);
                HEARTS++;
            }
            // Hearts
            if( isItem(item,'diamond') && collide(this,item) && item.collected == false ) {
                items.splice(i, 1);
                DIAMONDS++;
                DiamondsCollected[item.index] = true;
            }       
            // Spikes
            if( isItem(item,'spikes') && collide(this,item) ) {
                this.die();
            }         
            // Monsters
            if( (isItem(item,'enemies') || isItem(item,'BigRed')) && collide(item, this) ) {
                var hitBigRed = isItem(item,'BigRed');
                //Red Block Enemy:Player land on head, enemey is damaged (shift XFrame or die if out of hp)
                if( this.y + this.height < item.y + this.dy + 5  && this.dy > 0 ) {
                    if(item.type == "red block") {
                        this.bounceOffEnemy(item);
                        item.hp--;
                        if(item.hp == 1){ 
                            item.y += 20;
                            item.height -= 20; 
                        }
                        if( item.hp > 0 ) item.frameX++;
                        else { items.splice(i, 1); items.push(new Coin(item.x, item.y + 5)) }
                    }
                    // Boss takes damage if currently vulnerable and not already hit
                    if(hitBigRed && item.vulnerableTimer > 0 && item.frameX != 3) { 
                        item.takeDamage();
                        this.bounceOffEnemy(item);
                    }
                } else { 
                    if(item.type == "red block") this.die(); 
                    if(hitBigRed && item.vulnerableTimer <= 0) this.die(true); 
                } 
            }
            // If hit by big red laser attack and the boss exist
            if( boss && boss.attackTimer > 35 && boss.attackTimer < 50) {
                if(collide(boss.atk, player)) {
                    this.die(true);
                }
            }
            // Spike Enemy: Player dies on hit
            if( isItem(item,'enemy_spike') && collide(item, this) ) this.die();
            // Shop: Toggle space to open text
            if( isItem(item, 'shop_vendor') ) {
                if (collide(item, this)) item.active = true;
                else item.active = false;
            }
            // Portal: Toggle space to use text
            if( isItem(item, 'portal') || isItem(item, 'boss_portal') ) {
                if (collide(item, this)) item.active = true;
                else item.active = false;
            }
       }     
       groundPoint.x = this.x;
       groundPoint.y = this.y + this.size + 1;  
       
       // Handle Jump (only jump when player is on the ground)      
       for(item in items) {
          var isSolidBlock = (isItem(items[item],'block') || isItem(items[item],'lock') || isItem(items[item],'platform') || isItem(items[item],'falling_platform'));  
          if(collide(groundPoint, items[item]) && isSolidBlock && this.dy >= 0) { 
             this.jump = true; // When we found a collision we stop looking
             break;
          } else {
             this.jump = false; // Otherwise we keep looking   
          }
             //Moving Block (only handle top collisions)
             if( collide(groundPoint,items[item]) &&  isItem(items[item],'moving_block') && this.dy >= 0) {
             this.jump = true; // When we found a collision move the player with the item
             var diff = -items[item].speed;
             this.x -= diff;
             ctx.translate(diff, 0);
             scrollX += diff;
             break;
          } else {
             this.jump = false; // Otherwise we keep looking   
          }
       }
    }
    // When the player dies, subtract a life and place back to start point. Translate camera back as well.
    this.die = function(boss=false) {
       var self = this
        if(ARMOR) {
            armorBreak = true;
        } else if(!DEAD){
            DEAD = true;
            setTimeout(function(){
                // Death on normal resets to start, death on boss resets to town
                if(!boss) self.reset();
                else {
                    createMap(0);
                    saveGame();
                }
                // If the player has hearts subtract, if the player is out of lives restart.
                if( HEARTS > 1 ) HEARTS--;
                else location.reload();
         }, 3000);
       }
    }

    this.reset = function() {
        DEAD = false;
        this.frameX = this.frameY = 0;
        // Reset Camera
        ctx.translate( this.x - this.startX, 0  );
        scrollX = 0; 
        
        // Reset Player position.
        this.x = this.startX;
        this.y = this.startY;
        this.dy = 0; this.dx = 0;
        handleYscroll(true); // Handle yScroll based on new position.
    }
 }

 document.addEventListener("keydown", function(e) { 
    if( e.keyCode == 37 || e.code == "KeyA" ) LEFT = true;
    if( e.keyCode == 38 || e.code == "KeyW" ) UP = true;
    if( e.keyCode == 39 || e.code == "KeyD" ) RIGHT = true;
    if( e.keyCode == 40 || e.code == "KeyS" ) DOWN = true;
    if( e.keyCode == 16 || e.code == "ShiftLeft" ) SHIFT = true;
});
                          
document.addEventListener("keyup", function(e) { 
    if( e.keyCode == 37 || e.code == "KeyA" ) LEFT = false;
    if( e.keyCode == 38 || e.code == "KeyW" ) UP = false;
    if( e.keyCode == 39 || e.code == "KeyD" ) RIGHT = false;
    if( e.keyCode == 40 || e.code == "KeyS" ) DOWN = false;  
    if( e.keyCode == 16 || e.code == "ShiftLeft" ) SHIFT = false;
    if( e.keyCode == 67 || e.code == "KeysC") { // C For Color Change
        if(player.unlockedColors > player.selectedColor) player.selectedColor++;
        else player.selectedColor = 0;
    } 
    if( e.keyCode == 32|| e.code == "Space" ) action(); // SPACE
});