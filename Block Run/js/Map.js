var GRAVITY = 1.1; // 0.25
var COINS = 0;
var HEARTS = 3;
var LEVEL = 1;
var KEYS = 0;
var SKEYS = 0;
var ALPHA_INTENSITY = 20.0; // Higher value means better vision of blocks.
var ShowShop = false;
var scrollX = 0;
var scrollY = 0;
var yLevel = 0;
var yLevelMax = document.getElementById("canvas").height - 32;
var UnlockedLevels = [true, true, false, false, false];

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var player = new Player();
var currentMapIdx = 0;
createMap(currentMapIdx);

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

function action() {
    if(LEVEL < levels.length) {
        for(i in items) {
            var item = items[i];
            if(!item) continue;
            if(isItem(item,'portal') && collide(player,item)) {
                if(!item.unlocked) return;
                var level = Number.parseInt(item.map)
                if(level) {
                    currentMapIdx = level;
                    createMap(level);
                } else {
                    createMap(0);
                }
            }
            if(isItem(item,'shop_vendor') && collide(player,item)) {      
                ShowShop = true;
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

function createMap(index) {
    console.log(index);
    // Unlock next level of current map
    UnlockedLevels[currentMapIdx+1] = true;

    var map = levels[index];
    var SIZE = 32;
    player.reset();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    
    items = [];
    
    scrollX = 0;
    scrollY = 0;
    yLevel = 0;
    
    for(var Y = 0; Y < map.length; Y++ ) {
        for(var X = 0; X < map[0].length; X++ ) {
            var char = map[Y].charAt(X);
            var x = X*SIZE;
            var y = Y*SIZE;
            if(char == ' ') continue;
            if(char == '#') items.push(new Block(x, y));
            else if(char == '_') items.push(new Platform(x, y)); 
            else if(char == 'o') items.push(new Coin(x, y));
            else if(char == 'H') items.push(new Heart(x, y));            
            else if(char == 'E') items.push(new Enemy(x, y, 40, 52, images["enemies"], 4, 5, 2, "red block"));
            else if(char == 'S') items.push(new Enemy(x, y, 30, 30, images["enemy_spike"], 4, 5, 2, "spike"));
            else if(char == 'P' || Number.parseInt(char)) items.push(new Portal(x, y, char));
            else if(char == 'T') items.push(new GhostBlock(x, y));
            else if(char.toUpperCase() == 'L') items.push(new Lock(x, y, char));
            else if(char.toUpperCase() == 'K') items.push(new Key(x, y, char));
            else if(char == 'v') items.push(new Spikes(x, y, "bottom"));     
            else if(char == '^') items.push(new Spikes(x, y, "top"));  
            else if(char == '>') items.push(new Spikes(x, y, "right"));  
            else if(char == '<') items.push(new Spikes(x, y, "left"));              
            else if(char == '$') { shop = new Shop(x, y); items.push(shop); }
       }
    }
}
