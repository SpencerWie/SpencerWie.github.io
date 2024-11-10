var player;
LEFT = RIGHT = UP = DOWN = SHIFT = false;
DEAD = false;
var groundPoint = { x: 0, y: 0 , color: 'red', height: 4, width: 28};

function Player() {
    this.width = 28;
    this.height = 28;
    this.size = 32;
    this.x = (canvas.width/2) - (this.size/2);   
    this.y = (canvas.height/2) - (this.size/2);
    this.startX = this.x;
    this.startY = this.y;
    this.dx = 0; this.dy = 0;
    this.ddx = 0; this.ddy = 0;
    this.minSpeed = 2; this.walk = 7; this.run = 10;
    this.accelerateRun = 0; // Speed modifier for acceleration when runnning
    this.accelerateWalk = 0; // Speed modifier for acceleration when walking
    this.accelerateBump = 0.2; // Speed bump per frame until run speed is hit
    this.speed = 7;
    this.minYSpeed = -15; this.maxYSpeed = 12;
    this.jumpPower = 17; // 10
    this.frameX = 0; // X frame on tilemap sprite
    this.frameY = 0; // Y frame on tilemap sprite
    this.image = images['player_blink'];
    this.jump = false;
    this.ducked = false;
    this.timer = 0; // For animation
    this.step = 0; // For frame movement (animation)
    this.lastPositions = [];    // Keeps track of the last `lastPositionsMax` player positions, used for movement animation
    this.lastPositionsMax = 10; // Maximum number of positions being kept track of
    this.runColors = {r: 0, g: 0, b: 0}; // Color of running animation
    
    this.draw = function() {
       ctx.drawImage(this.image, this.frameX*this.size, this.frameY*this.size, this.size, this.size, this.x, this.y, this.size, this.size);
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
             var c = this.runColors;
             ctx.fillStyle = "rgba("+c.r+","+c.g+","+c.b+","+aplha+")";
             ctx.fillRect(pos.x, pos.y, this.size, this.size);
         }
    }
    
    this.BlinkAnimation = function() 
    {
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
       
       if(this.dy < 10 && !this.jump) this.ddy = GRAVITY; // Apply Gravity
       
       this.dy += this.ddy; // Update variables
       this.y += this.dy;
         
         //TODO: We need to be able to drop from a plateform by just using DOWN instead of jump+DOWN
       
       // Vertical Block collisions. (needs to be seperate from horizonal for proper collisions)
       for(item in items) {
             // If we touched the plateform and are not ducking.
             var platformCollision = !DOWN && isItem(items[item],'platform') && this.y+this.height <= items[item].y+this.maxYSpeed;
             // For upwards collision check if we are moving up and hit a block, if so place player at the bottom of block and halt verticle motion.
          if(this.dy < 0 && collide(this,items[item]) && isItem(items[item],'block')) {
             this.dy = 0;
             this.ddy = 0;
             this.y = items[item].y + this.size;
          }// For downwards collision check if we are moving down and hit a block, if so place player at the top of block and halt verticle motion.
          else if(this.dy > 0 && collide(this,items[item]) && (isItem(items[item],'block') || platformCollision)) {
             this.dy = 0;
             this.ddy = 0;
             this.y = items[item].y - this.size;
             this.jump = true;
          }
          if(this.dy > 0 && collide(this,items[item]) && isItem(items[item],'moving_block') && this.y < items[item].y - this.maxYSpeed) {
             this.dy = 0;
             this.ddy = 0;
             this.y = items[item].y - this.size;
                 this.jump = true;
          }
       }
       
       //Speed limits
       if(this.dy > this.maxYSpeed) this.dy = this.maxYSpeed;          
       if(this.dy < this.minYSpeed) this.dy = this.minYSpeed;   
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
       var duckLeft =  { x: 2, y: 2 };
       var duckRight = { x: 1, y: 2 };
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
       for(item in items) {
          var isSolidBlock = isItem(items[item],'block') || isItem(items[item],'lock') || isItem(items[item],'lock_silver');
          var movingRight = this.dx <= 0; 
          var movingLeft = this.dx > 0; 
         
          if( isItem(items[item],'key') && collide(this,items[item]) ) {
             items.splice(item, 1);
             KEYS++;
          }                         
          // Locks [ breaks lock if you have a key, otherwise it's treated as a normal block ]
          if( isItem(items[item],'lock') && collide(this,items[item]) && KEYS > 0 ) {
             items.splice(item, 1);
             KEYS--;
          }
          if( isItem(items[item],'key_silver') && collide(this,items[item]) ) {
             items.splice(item, 1);
             SKEYS++;
          }                         
          // Locks [ breaks lock if you have a key, otherwise it's treated as a normal block ]
          if( isItem(items[item],'lock_silver') && collide(this,items[item]) && SKEYS > 0 ) {
             items.splice(item, 1);
             SKEYS--;
          }                    
          // Blocks
          if(movingRight && collide(this,items[item]) && (isSolidBlock)) {
             // Reposition player to be place right next to block, then get the difference and apply that to scrolling of canvas.
             var oldX = this.x;
             this.x = items[item].x - this.size;
             var diff = oldX - this.x
             ctx.translate(diff, 0);
             scrollX += diff;
             this.speed = this.accelerateRun = this.accelerateWalk = 0;
          }
          else if(movingLeft && collide(this,items[item]) && (isSolidBlock)) {
             var oldX = this.x;
             this.x = items[item].x + this.size;
             var diff = oldX - this.x
             ctx.translate(diff, 0);
             scrollX += diff;
             this.speed = this.accelerateRun = this.accelerateWalk = 0;
          }
          // Coins
          if( isItem(items[item],'coin') && collide(this,items[item]) ) {
             items.splice(item, 1);
             COINS++;
          }
          // Hearts
          if( isItem(items[item],'heart') && collide(this,items[item]) ) {
             items.splice(item, 1);
             HEARTS++;
          }         
          // Spikes
          if( isItem(items[item],'spikes') && collide(this,items[item]) ) {
             this.die();
          }         
          // Monsters
          if( isItem(items[item],'enemies') && collide(items[item], this) ){
             //Red Block Enemy:Player land on head, enemey is damaged (shift XFrame or die if out of hp)
             if( this.y + this.height < items[item].y + this.dy + 5  && this.dy > 0 ) {
                this.dy = -this.jumpPower/1.5;
                this.ddy = -1;
                this.jump = true; 
                this.y = items[item].y - 25;
                items[item].hp--;
                if(items[item].type == "red block" && items[item].hp == 1){ 
                   items[item].y += 20;
                   items[item].height -= 20; 
                }
                if( items[item].hp > 0 ) items[item].frameX++;
                else items.splice(item, 1);
             } else { this.die(); } 
          }
             // Spike Enemy: Player dies on hit
             if( isItem(items[item],'enemy_spike') && collide(items[item], this) ) this.die();
       }     
       groundPoint.x = this.x;
       groundPoint.y = this.y + this.size + 1;  
       
       // Handle Jump (only jump when player is on the ground)      
       for(item in items) {
          var isSolidBlock = (isItem(items[item],'block') || isItem(items[item],'lock') || isItem(items[item],'platform'));  
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
    this.die = function() {
       var self = this
       if(!DEAD)
       {
         setTimeout(function(){
           // Change Sprite to normal 
           DEAD = false;
           self.frameX = self.frameY = 0;
           // Reset Camera
           ctx.translate( self.x - self.startX, 0  );
           scrollX = 0; 
           
           // Reset Player position.
           self.x = self.startX;   
           self.y = self.startY;
           
           handleYscroll(); // Handle yScroll based on new position.
           
           // If the player has hearts subtract, if the player is out of lives restart.
           if( HEARTS > 1 ) HEARTS--;
           else location.reload();
         }, 3000);
       }
       DEAD = true;
    }
 }

 document.addEventListener("keydown", function(e) { 
    if( e.keyCode == 37 ) LEFT = true;
    if( e.keyCode == 38 ) UP = true;
    if( e.keyCode == 39 ) RIGHT = true;
    if( e.keyCode == 40 ) DOWN = true;
    if( e.keyCode == 16 ) SHIFT = true;
});
                          
document.addEventListener("keyup", function(e) { 
    if( e.keyCode == 37 ) LEFT = false;
    if( e.keyCode == 38 ) UP = false;
    if( e.keyCode == 39 ) RIGHT = false;
    if( e.keyCode == 40 ) DOWN = false;  
    if( e.keyCode == 16 ) SHIFT = false;    
    if( e.keyCode == 32 ) nextLevel(); // SPACE
});