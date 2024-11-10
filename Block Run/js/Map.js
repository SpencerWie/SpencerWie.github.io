GRAVITY = 1.1; // 0.25
COINS = 0;
HEARTS = 3;
LEVEL = 1;
KEYS = 0;
ALPHA_INTENSITY = 20.0; // Higher value means better vision of blocks.
var scrollX = 0;
var scrollY = 0;
var yLevel = 0;
var yLevelMax = document.getElementById("canvas").height - 32;

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
images = loadImages();
createMap(level_1);

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