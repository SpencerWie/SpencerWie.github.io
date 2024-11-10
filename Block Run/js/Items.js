/*
How timeframes work: For animations via frame-by-frame

[ <frame1>, <frame2> , <frame3>, ... ]

[ [time when to start animation, frameX, frameY] , [time when to move to next frame, frameX, frameY] , ... ]

timer resets when animation is done.
*/

var items = [];

function Block(x, y) {
    this.x = x; 
    this.y = y;
    this.image = images['block'];
    this.width = 30; this.height = 30;
    
    this.draw = function() {
       ctx.drawImage(this.image, this.x, this.y, this.width+2, this.height+2);
    }
 }
 
 function Platform(x, y) {
    Block.call(this, x, y);
    this.image = images['platform'];
     this.height = 5;
 }
 
 function GhostBlock(x, y) {
     Block.call(this, x, y);
    this.draw = function() {
         ctx.globalAlpha = Math.pow(2/distance(this, player), 3)*(ALPHA_INTENSITY*1000);
       ctx.drawImage(this.image, this.x, this.y, this.width+2, this.height+2);
         ctx.globalAlpha = 1.0;
    }
 }
 
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
 }
 
 function Heart(x, y) {
    this.x = x + 10; 
    this.y = y + 10;
    this.image = images['heart'];
    this.width = 15; this.height = 15;
    
    this.draw = function() {
       ctx.drawImage(this.image, this.x - 10, this.y - 10);
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
         ctx.drawImage(this.image, this.frameX*this.size, this.frameY*this.size, this.size, this.size, this.x + this.offsetX, this.y + this.offsetY, this.size, this.size);
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
       for(var i = 0; i <coin_timeframe.length; i++ ) {
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
 
 function Portal(x, y, map, text) 
 {
    this.x = x - 32; // Reposition (since bigger than 32x32)
    this.y = y - 64;
    this.width = 64;
    this.height = 100;
    this.map = map;
    this.text = text;
    this.image = images["portal"];
    
    this.draw = function() {
       ctx.drawImage(this.image, this.x, this.y);
    }
 }

 // Check on what an item is based on it's image.
function isItem(check, item) {
    return check.image == images[item];
 }