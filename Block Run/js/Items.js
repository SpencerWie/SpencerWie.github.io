/*
How timeframes work: For animations via frame-by-frame

[ <frame1>, <frame2> , <frame3>, ... ]

[ [time when to start animation, frameX, frameY] , [time when to move to next frame, frameX, frameY] , ... ]

timer resets when animation is done.
*/

var items = [];
var MouseX = 0;
var MouseY = 0;

function Block(x, y, img="") {
    this.x = x; 
    this.y = y;
    this.image = img ? images[img] : images['block'];
    this.width = 30; this.height = 30;
    
    this.draw = function() {
        ctx.drawImage(this.image, this.x - 0.5, this.y - 0.5, this.width+2.5, this.height+2.5);
    }
 }

function Lock(x, y, type) {
    Block.call(this, x, y);
    var lockType = "lock";
    if(type == "l") lockType = "lock_silver";
    this.image = images[lockType];
}

function Key(x, y, type) {
    Block.call(this, x, y);
    var keyType = "key";
    if(type == "k") keyType = "key_silver";
    this.image = images[keyType];
 }
 
 function Platform(x, y) {
    Block.call(this, x, y);
    this.image = images['platform'];
    this.height = 5;
 }

function FallingPlatform(x, y) {
   Block.call(this, x, y);
   this.image = images['falling_platform'];
   this.width = 64
   this.height = 5;
   this.alpha = 1;
   this.respawnTimer = 100;
   this.falling = false;
   this.startY = y;

   this.startFalling = function() {
      this.falling = true;
      this.respawnTimer = this.alpha*50 + 50;
   }

   this.draw = function() {
      // If the player is jumping or falling down, or the player is not in the range of the x location of the platform, then restore platform
      if(Math.abs(player.dy) > 1 || player.x > this.x+this.width+10 || player.x < this.x-10) this.falling = false;
      var oldAlpha = ctx.globalAlpha;
      if(this.falling && this.alpha > 0.01) {
         this.alpha -= 0.02;
      } 
      if (this.alpha <= 0.1 || !this.falling) {
         this.respawnTimer--;
      }
      if(this.respawnTimer < 1 && this.alpha < 1) {
         this.alpha += 0.01;
      }
      if(this.alpha < 0.05) this.falling = false;
      ctx.globalAlpha = this.alpha;
      ctx.drawImage(this.image, this.x - 0.5, this.y + 2.5 - (this.alpha*3), this.width+2.5, this.height+2.5);
      ctx.globalAlpha = oldAlpha;
  }
}
 
 function GhostBlock(x, y) {
    Block.call(this, x, y);
    this.draw = function() {
        ctx.globalAlpha = Math.pow(2/distance(this, player), 3)*(ALPHA_INTENSITY*1000);
        ctx.drawImage(this.image, this.x, this.y, this.width+2, this.height+2);
        ctx.globalAlpha = 1.0;
    }
 }
 /*
 function MovingBlock(x, y) {
     Block.call(this, x, y);
     this.speed = 5;
     this.height = 10;
     this.image = images['moving_block'];
     
    this.draw = function() {
         ctx.drawImage(this.image, this.x, this.y);
       for(item in items) {
             if( this != items[item] && (isItem(items[item],'block')) && collide(this,items[item])) {   
                 if(this.speed > 0) this.x = items[item].x - this.width;
                 else this.x = items[item].x + items[item].width + 1;
                 this.speed *= -1;
                 break;
             }
       }
       this.x += this.speed;      
    }
 }*/
 
function Heart(x, y) {
    this.x = x + 10; 
    this.y = y + 10;
    this.image = images['heart'];
    this.width = 15; this.height = 15;
    
    this.draw = function() {
       ctx.drawImage(this.image, this.x - 10, this.y - 10);
    }
}

function Diamond(x, y, index) {
   this.x = x + 10; 
   this.y = y + 10;
   this.index = index;
   this.image = images['diamond'];
   this.width = 15; this.height = 15;
   this.collected = DiamondsCollected[index] == true;
   
   this.draw = function() {
      if(this.collected) ctx.globalAlpha = 0.20;
      ctx.drawImage(this.image, this.x - 10, this.y - 10);
      if(this.collected) ctx.globalAlpha = 1;
   }
}
 
function Spikes(x, y, type) {
    this.x = x; 
    this.y = y;
    this.image = images['spikes'];
    this.size = 32;   
    this.type = type;
 
    this.init = function(fx, fy, w, h, offX, offY) {
       this.frameX = fx; this.frameY = fy; 
       this.width = w; this.height = h;
       this.offsetX = offX; this.offsetY = offY;
       this.x -= offX; this.y -= offY;
    }   
    
    if( this.type == "bottom" ) this.init(0, 0, 30, 10, 0, -20);
    else if( this.type == "top" ) this.init(0, 1, 30, 10, 0, 0);
    else if( this.type == "left" ) this.init(1, 0, 10, 30, 0, 0);
    else if( this.type == "right" ) this.init(1, 1, 10, 30, -20, 0);
    
    this.draw = function() {
         ctx.drawImage(this.image, this.frameX*this.size, this.frameY*this.size, this.size-1, this.size, this.x + this.offsetX, this.y + this.offsetY, this.size, this.size);
    }
 }
 
var coin_timeframe = [[5, 1, 0], [10, 2, 0], [15, 1, 0], [20, 0, 0]];
function Coin(x, y) {
    this.timer = 0;
    this.x = x + 9;
    this.y = y + 9;
    this.image = images["coin"];
    this.frameX = 0;
    this.step = 0;
    this.width = 14; this.height = 14;
    
    this.draw = function() {
       this.timer++;
       for(var i = 0; i < coin_timeframe.length; i++ ) {
          if(this.step == i && this.timer > coin_timeframe[i][0]) {
             this.frameX = coin_timeframe[i][1];
             this.step = i + 1;
          }
          if( this.step == coin_timeframe.length ){
             this.step = 0;
             this.timer = 0;
          }
       }
       ctx.drawImage(this.image, this.frameX*32, 0, 32, 32, this.x - 9, this.y - 9, 32, 32);
    }
 }
 
 function Portal(x, y, map) 
 {
    this.x = x - 32; // Reposition (since bigger than 32x32)
    this.y = y - 64;
    this.width = 96;
    this.height = 100;
    this.map = map;
    this.image = images["portal"];
    this.active = false;
    this.unlocked = this.map == 'P' || UnlockedLevels[Number.parseInt(this.map)] == true;

    if(this.map == 5) this.image = images["boss_portal"];
    
    this.draw = function() {
        if(this.unlocked) {
            ctx.drawImage(this.image, this.active ? this.width : 0, 0, this.width, this.height, this.x, this.y, this.width, this.height);
        } else {
            ctx.globalAlpha = 0.5;
            ctx.drawImage(this.image, 0, 0, this.width, this.height, this.x, this.y, this.width, this.height);
            ctx.globalAlpha = 1.0
        }
    }
 }

 // Check on what an item is based on it's image.
function isItem(check, item) {  
   return check.image == images[item];
}