/*
var level_1 = [
   '#################################################################################                ',
   '#             #                   #               #                             #                ',
   '#             #                   # o           o #                             #                ',
   '#             # o                 ###     o     ###     o       o               #                ',
   '#              #                     ##       ##                                #                ',
   '#               ######                                  ##  o  ##               #                ',
   '#  o                      E             #####                                   #                ',
   '#           #             ######       ## o ##            E              o o    #                ',
   '#  #       ##            ## o  #      ### o ###        ############      o o    #                ',
   '# ###     ###E          ### o        ###     ###       #         H#             #                ',
   '########################################  ___###########          ###########   #                ',
   '#                                      #                       ##############   #                ',
   '#                                      #                  #######               #                ',
   '#      o                    o          ##   ##############                  #####                ',
   '#                           o                          o                   #    #   #######      ',
   '#    #####       oo                      E                      o         #     #  #       #     ',
   '#o     ####o             o     o       ##########                        #      ###         ###  ',
   '###    #####     ##     ###   ###                    E         ###    ###       ###           #  ',
   '#   o  ######    ##     ##     ##          o         ######                      #            #  ',
   '#      ######vvvv##vvvvv##vvvvv##     ############                           o   L     P      #  ',   
   '###   #########################################################################################  ',
   '#     #####################                                                              ######  ',
   '#     ###############                                                                    ######  ',
   '#   ###########                                                                          ######  ', 
   '#                                                                                        ######  ',
   '#                                                o                                       ######  ',   
   '###                                            E            oo                           ######  ',   
   '####       o         o                         ######      ####          o  o      K     ######  ',   
   '#####                       ####        ####              ########                       ######  ',   
   '######                     #####E     ######            ##########E     ######           ######  ',   
   '###############################################################################################  ', 
   '###############################################################################################  ',    
];

var level_2 = [
   '######################################################################################################',
   '#                                                                                  #                 #',
   '#           o                                       ooo                            #                 #',
   '#                    o                           #########                         #               K #',
   '#         #####                        o        #        #            #            #               ###',
   '#     o     #      #####     ###       o      ##         #        #########        #          ##     #',
   '#   #####   #        #        #       ###     #    o     #            #            ##                #',
   '#     #     #        #        #vvvvvvvvvvvvvvv#   ooo    #            #        #####     ##vvvvvvvvvv#',
   '#     #     #####    #       ##################    o     ######       #    ####    #    ##############',
   '##    #    ##vvvvvvvv#vvvvvvv#                                L       #            ###               #',
   '############################## ################################################    #                 #',
   '#                              ################################################    #                 #',
   '# H    o      o       o    o   #                                            ##     ######       ######',   
   '################################K                                           #     #        o         #', 
   '#                              ##                           o     o     o   #    #        ###        #', 
   '#                              #     E                #   E      E          #   ##    ########       #', 
   '#    P                         #     ######          ## #####################    #      L            #', 
   '###########                    #                    ###                     ##   ###    ##           #', 
   '############                   ###                 ######                   #           #   KK       #', 
   '#############                  L         #E       #####o   E                L  E     ####vvv##vvvvvvv#',    
   '######################################################################################################',   
];

var level_3 = [
   '####################################################################################################################################################################',
   '#                                                                                                    #                                                       #     #',
   '#                                                                            oooo                    #                                                       #     #',
   '#            o                                   E              E            ####                    #                                                       #     #',
   '#            o      o       o       o           #######   o    #######                               #                                                       #     #',
   '#          ###     ##      ##       ##     o   o   #      #       #           vv            o        #           o     o     o                               #     #',
   '#         ####                             #####   #vvvvvvvvvvvvvv#oo##  vv   ##           ooo       #    ##<   >#<    o    >#<   ##         o               #     #',
   '#        #####                                     ##################    ##   ##     K      o        #   ###<   >#<   >#<   >#<   ###        v               #     #',
   '#       ######vvvvvvvvvvvvvvvvvvvvv vvvvvvvvvvvvvvv#             #   L   ##         ###              L  ####vvvvv#vvvvv#vvvvv#vvvv####E     >#<E             L  P  #',
   '################################### ##############################  ###################################################################################o  ##########', 
   '###################################  K o o o o o o o o o o o o o H  ###################################                                               #   #        #',
   '######################################################################################################                                                ##  #        #',   
   '#                                                                                                    #                                                #   #        #',
   '#               K                                                                                oooo#                o    vv    o                    #  o#        #',   
   '#                                                       o    oo     o                  o   o     #####               #### >##< ####                   #  ##        #',   
   '#  ooo       #######                                  >##<  >##<  >##<               #########       #         oo         >##<         oo                          #',
   '#  oHo      #########          #     #    #            ^^    ^^    ^^               #         #               ####         ^^         ####              o          #', 
   '#  ooo     ###########        ##vvvvv#vvvv#E     #vvvvvvvvvvvvvvvvvvvvvvvv#        #           #   E             #vvvvvvvvvvvvvvvvvvvv#              #######       #',  
   '####################################################################################################################################################################',    
];

var level_end = [
   '#                                                                                                                                                                  #',
   '#                                                                                                                                                                  #',
   '#                                                                                                                                                                  #',
   '#                                                                                                                                                                  #',
   '#                                                                                                                                                                  #',
   '#               ooo o  o oo                                                                                                                                        #',
   '#               o   oo o o o                                                                                                                                       #',
   '#               ooo oo o o o                                                                                                                                       #',
   '#               o   o oo o o                                                                                                                                       #',
   '################ooo o  o oo#########################################################################################################################################', 
   '####################################################################################################################################################################',    
];

var level_4 = [
   'T                ooooooo                                          H                                         T        >TH  S    o o        TTTTTTTTTT            T',
   'T                TTTTTTT                                          TT                 TTT        To         oT      v>TT_      _____       TTTTTT                T',
   'T                                                                 T                            TToT         To     TTTT               _   TTTTTT                T',
   'T                             T                                   T                           TTToT        _T__     oTT                   TTTTTT                T',
   'T                                                        TT       TTT      TTT               TTTTo          T<     __TT           _       TTTTTT                T',
   'T   oo                    oo                           v          T                         TTTTTTT      oooTT      oTT                   TTTTTT                T',
   'T   TT                    TT                   TE     >T<vvvvvvvT T            o       o                 TTTTH      _TTTTTTTTTTTTTTTTTTTT TTTTTT                T',
   'T                                             TTTTTTTTTTTTTTTTTTT T                                         T__    S                      TTTTTT        K       T',                    
   'T                                          TTTTooooo                   TTTTTTTTTTTTTTTTTTTTTTTT             TvvvvvvTTTTT  TTTTTTTTTTT  TTTTTTTTT       TTT      T',
   'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTH o o o o             TTvvvvvvvvvvvvTTTTTTTTTTTTTTT  L   o o o o o o o L    TTTTTTTTTT  T', 
   'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT  TTTTTTTTTTTTTTTTTTTTTTTTTTTTT  TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT_ T',  
   'T                                                                                                                           T                                   T',  	
   'T                                                                                          oooo                             T                                   T',   	
   'T                                                                     TTTTTTTTTTTTTT      _TTTT_                            T           _                      _T',  
   'T                                                     ____                                                      S TTTTTTTTTT                   _                T',  
   'T P                      ___          >#<                                                                        TTSK                    ooS         oo         T',  
   'TTTTTTTTTTTTTTTTTTTS           ____    ^    ____           ____           E                                     TTT _________      _     __          __      ___T',  
   'T                                                                    TTTTTTTTTTTTTTTTS    ______      __       TTTT          _                                  T',  
   'TvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvTTTTTTvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvT', 
   'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',   	
];

var level_test = [
   '#                                                                                                                                                                  #',
   '#                                                                                                                                                                  #',
   '#                                                                                                                                                                  #',
   '#                                                                                                                                                                  #',
   '#                                                                                                                                                                  #',
   '#                                                                                                                                                                  #',
   '#                                                                                                                                                                  #',
   '#   M    #   M      #                                                                                                                                              #',
   '#        #          #                                                                                                                                              #',
   '####################################################################################################################################################################', 
   '####################################################################################################################################################################',    
];
*/
var delay = 27;
var items = [];
var player;
var yLevel = 0;
var yLevelMax = document.getElementById("canvas").height - 32;
//var levels = [level_1, level_2, level_3, level_4];

LEFT = RIGHT = UP = DOWN = SHIFT = false;

GRAVITY = 1.1; // 0.25
COINS = 0;
HEARTS = 3;
LEVEL = 1;
KEYS = 0;
DEAD = false;
ALPHA_INTENSITY = 20.0; // Higher value means better vision of blocks.

var groundPoint = { x: 0, y: 0 , color: 'red', height: 4, width: 28};
var portalIndex = 0; // index of the portal in the items

var scrollX = 0;
var scrollY = 0;

/*
How timeframes work: For animations via frame-by-frame

[ <frame1>, <frame2> , <frame3>, ... ]

[ [time when to start animation, frameX, frameY] , [time when to move to next frame, frameX, frameY] , ... ]

timer resets when animation is done.
*/

var coin_timeframe = [[5, 1, 0], [10, 2, 0], [15, 1, 0], [20, 0, 0]];

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
      // Walking
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

function loadImages() 
{
   var playerBlink = new Image(); playerBlink.src = "imgs/player_blink.png";
   var Block = new Image(); Block.src = "imgs/block.png";
	var MovingBlock = new Image(); MovingBlock.src = "imgs/moving_block.png"
   var Coin = new Image(); Coin.src = "imgs/coin.png"
   var Heart = new Image(); Heart.src = "imgs/heart.png"
   var Background = new Image(); Background.src = "imgs/clouds.jpg";
   var Enemies = new Image(); Enemies.src = "imgs/enemies.png";
   var Portal = new Image(); Portal.src = "imgs/portal.png";
   var Lock = new Image(); Lock.src = "imgs/lock.png";
   var Key = new Image(); Key.src = "imgs/key.png";
   var Spikes = new Image(); Spikes.src = "imgs/spikes.png";
   var Platform = new Image(); Platform.src = "imgs/platform.png";
	var Enemy_Spike = new Image(); Enemy_Spike.src = "imgs/enemy_spike.png"
   
   images = {
      player_blink: playerBlink,
      block: Block,
		moving_block: MovingBlock,
      coin: Coin,
      heart: Heart,
      background: Background,
      enemies: Enemies,
      portal: Portal,
      lock: Lock,
      key: Key,
      spikes: Spikes,
      platform: Platform,
		enemy_spike: Enemy_Spike
   }
   
   return images;
}

function createMap(map) {
   var X = 0;
   var Y = 0;
   var SIZE = 32;
   
   ctx.setTransform(1, 0, 0, 1, 0, 0);
   
   player = new Player();
   items = [];
   
   scrollX = 0;
   scrollY = 0;
   yLevel = 0;
   
   for( Y = 0; Y < map.length; Y++ ) {
      for( X = 0; X < map[0].length; X++ ) {
         if(map[Y].charAt(X) == '#') 
            items.push(new Block(X*SIZE, Y*SIZE));
         else if(map[Y].charAt(X) == '_') 
            items.push(new Platform(X*SIZE, Y*SIZE)); 
         else if(map[Y].charAt(X) == 'o') 
            items.push(new Coin(X*SIZE, Y*SIZE));
         else if(map[Y].charAt(X) == 'H') 
            items.push(new Heart(X*SIZE, Y*SIZE));            
         else if(map[Y].charAt(X) == 'E') 
            items.push(new Enemy(X*SIZE, Y*SIZE, 40, 52, images["enemies"], 4, 5, 2, "red block"));
         else if(map[Y].charAt(X) == 'S') 
            items.push(new Enemy(X*SIZE, Y*SIZE, 30, 30, images["enemy_spike"], 4, 5, 2, "spike"));
         else if(map[Y].charAt(X) == 'P')   
				items.push(new Portal(X*SIZE, Y*SIZE, "", ""));
         else if(map[Y].charAt(X) == 'M')
				items.push(new MovingBlock(X*SIZE, Y*SIZE));
		   else if(map[Y].charAt(X) == 'T')
				items.push(new GhostBlock(X*SIZE, Y*SIZE));
         else if(map[Y].charAt(X) == 'L') {  
              var lock = new Block(X*SIZE, Y*SIZE);
              lock.image = images["lock"];
              items.push(lock);  
         }  
         else if(map[Y].charAt(X) == 'K') {  
              var key = new Block(X*SIZE, Y*SIZE);
              key.image = images["key"];
              items.push(key);  
         }    
         else if(map[Y].charAt(X) == 'v') 
            items.push(new Spikes(X*SIZE, Y*SIZE, "bottom"));     
         else if(map[Y].charAt(X) == '^') 
            items.push(new Spikes(X*SIZE, Y*SIZE, "top"));  
         else if(map[Y].charAt(X) == '>') 
            items.push(new Spikes(X*SIZE, Y*SIZE, "right"));  
         else if(map[Y].charAt(X) == '<') 
            items.push(new Spikes(X*SIZE, Y*SIZE, "left"));              
      }
   }
}

function collide(a, b) {
    return (
        ((a.y + a.height) >= (b.y)) &&
        (a.y <= (b.y + b.height)) &&
        ((a.x + a.width) >= b.x) &&
        (a.x <= (b.x + b.width)) 
    );
}

function distance(a, b) {
	return Math.sqrt((a.x-b.x)*(a.x-b.x) + (a.y-b.y)*(a.y-b.y));
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

function nextLevel() {
    if(LEVEL < levels.length) {
        for(item in items) {
           if(isItem(items[item],'portal') && collide(player,items[item])) {      
              LEVEL++;
              createMap(levels[LEVEL-1]);
            }
        }
    }
}

// Check on what an item is based on it's image.
function isItem(check, item) {
   return check.image == images[item];
}

function handleYscroll() {
   if(player.y > yLevelMax*2 && yLevel == 1){
      scrollY+= yLevelMax;
      ctx.translate(0, -yLevelMax);
      yLevel = 2;
      images["background"].src = "imgs/ground_deep.jpg";
   }
   else if(player.y > yLevelMax && yLevel == 0){
      scrollY+= yLevelMax;
      ctx.translate(0, -yLevelMax);
      yLevel = 1;
      images["background"].src = "imgs/ground.jpg";
   }
   else if(player.y <= yLevelMax && yLevel == 1){
      scrollY-= yLevelMax;
      ctx.translate(0, yLevelMax);
      yLevel = 0;
      images["background"].src = "imgs/clouds.jpg";
   }   
   else if(player.y <= yLevelMax*2 && yLevel == 2){
      scrollY-= yLevelMax;
      ctx.translate(0, yLevelMax);
      yLevel = 1;
      images["background"].src = "imgs/ground.jpg";
   }      
}

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
images = loadImages();
createMap(level_1);

// main
timer = setInterval(function()
{
   ctx.drawImage(images["background"],-scrollX, scrollY, canvas.width, canvas.height);
   ctx.fillStyle = player.color;
   player.update();
   handleYscroll();
   for(item in items)
      items[item].draw();
   player.draw();   
   ctx.fillStyle = "red";
   ctx.fillText("Beta: V 0.51", 10-scrollX, 10+scrollY);
   ctx.drawImage(images["coin"], 0,0, 32, 32, canvas.width-65-scrollX, scrollY, 32, 32);
   ctx.fillText(" x "+COINS, canvas.width-40-scrollX,20+scrollY);
   ctx.drawImage(images["heart"], 0,0, 32, 32, canvas.width-110-scrollX, scrollY, 32, 32);
   ctx.fillText(" x "+HEARTS, canvas.width-85-scrollX,20+scrollY);   
}, delay);
