var GRAVITY = 1.1; // 0.25
var COINS = 0;
var HEARTS = 3;
var LEVEL = 1;
var KEYS = 0;
var SKEYS = 0;
var ALPHA_INTENSITY = 20.0; // Higher value means better vision of blocks.
var scrollX = 0;
var scrollY = 0;
var yLevel = 0;
var yLevelMax = document.getElementById("canvas").height - 32;

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;
images = loadImages();
createMap(level_1);

function loadImages() 
{
    var playerBlink = new Image(); playerBlink.src = "imgs/player_blink.png";
    var Block = new Image(); Block.src = "imgs/block.png";
    // var MovingBlock = new Image(); MovingBlock.src = "imgs/moving_block.png"
    var Coin = new Image(); Coin.src = "imgs/coin.png"
    var Heart = new Image(); Heart.src = "imgs/heart.png"
    var Background = new Image(); Background.src = "imgs/clouds.jpg";
    var Enemies = new Image(); Enemies.src = "imgs/enemies.png";
    var Portal = new Image(); Portal.src = "imgs/portal.png";
    var Lock = new Image(); Lock.src = "imgs/lock.png";
    var LockSilver = new Image(); LockSilver.src = "imgs/lock_silver.png";
    var Key = new Image(); Key.src = "imgs/key.png";
    var KeySilver = new Image(); KeySilver.src = "imgs/key_silver.png";
    var Spikes = new Image(); Spikes.src = "imgs/spikes.png";
    var Platform = new Image(); Platform.src = "imgs/platform.png";
	var Enemy_Spike = new Image(); Enemy_Spike.src = "imgs/enemy_spike.png"
   
    images = {
        player_blink: playerBlink,
        block: Block,
        coin: Coin,
        heart: Heart,
        background: Background,
        enemies: Enemies,
        portal: Portal,
        lock: Lock,
        lock_silver: LockSilver,
        key: Key,
        key_silver: KeySilver,
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
    var SIZE = 32;
    
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    
    player = new Player();
    items = [];
    
    scrollX = 0;
    scrollY = 0;
    yLevel = 0;
    
    for(var Y = 0; Y < map.length; Y++ ) {
        for(var X = 0; X < map[0].length; X++ ) {
            var char = map[Y].charAt(X);
            if(char == ' ') continue;
            if(char == '#') items.push(new Block(X*SIZE, Y*SIZE));
            else if(char == '_') items.push(new Platform(X*SIZE, Y*SIZE)); 
            else if(char == 'o') items.push(new Coin(X*SIZE, Y*SIZE));
            else if(char == 'H') items.push(new Heart(X*SIZE, Y*SIZE));            
            else if(char == 'E') items.push(new Enemy(X*SIZE, Y*SIZE, 40, 52, images["enemies"], 4, 5, 2, "red block"));
            else if(char == 'S') items.push(new Enemy(X*SIZE, Y*SIZE, 30, 30, images["enemy_spike"], 4, 5, 2, "spike"));
            else if(char == 'P') items.push(new Portal(X*SIZE, Y*SIZE, "", ""));
            else if(char == 'T') items.push(new GhostBlock(X*SIZE, Y*SIZE));
            else if(char.toUpperCase() == 'L') items.push(new Lock(X*SIZE, Y*SIZE, char));
            else if(char.toUpperCase() == 'K') items.push(new Key(X*SIZE, Y*SIZE, char));
            else if(map[Y].charAt(X) == 'v') items.push(new Spikes(X*SIZE, Y*SIZE, "bottom"));     
            else if(map[Y].charAt(X) == '^') items.push(new Spikes(X*SIZE, Y*SIZE, "top"));  
            else if(map[Y].charAt(X) == '>') items.push(new Spikes(X*SIZE, Y*SIZE, "right"));  
            else if(map[Y].charAt(X) == '<') items.push(new Spikes(X*SIZE, Y*SIZE, "left"));              
       }
    }
 }