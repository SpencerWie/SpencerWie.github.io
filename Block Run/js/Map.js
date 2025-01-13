var GRAVITY = 1.1;
var COINS = 0;
var HEARTS = 3;
var DIAMONDS = 0;
var ARMOR = false;
var LEVEL = 1;
var KEYS = 0;
var SKEYS = 0;
var ALPHA_INTENSITY = 20.0; // Higher value means better vision of blocks.
var ShowShop = false;
var scrollX = 0;
var scrollY = 0;
var yLevel = 0;
var yLevelMax = document.getElementById("canvas").height - 32 + 1;
var UnlockedLevels = [true, true, false, false, false, false];
var DiamondsCollected = [false, false, false, false, false, false];

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var player = new Player();
var boss = false;
var currentMapIdx = 0;

// A More efficient items as a2D Array called MapItems which will base the position of the player to determine what to draw and check for collisions instead of everything every time.
var MapItems = [];
var Enemies = [];

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
    if(chat.active) {
        chat.active = false;
        return;
    }
    if(LEVEL < levels.length) {
        for(i in items) {
            var item = items[i];
            if(!item) continue;
            if((isItem(item,'portal') || isItem(item,'boss_portal')) && collide(player,item)) {
                if(!item.unlocked) return;
                var level = Number.parseInt(item.map)
                if(level) {
                    currentMapIdx = level;
                    createMap(level);
                } else {
                    createMap(0);
                    saveGame();
                }
            }
            if(isItem(item,'shop_vendor') && collide(player,item)) {      
                ShowShop = true;
            }
            if((isItem(item,'Miner') || isItem(item,'Mayor'))  && item.active && chat.active == false) {
                // Determine what the npc says if they have other text items
                chat.text = item.text2 != "" && chat.text == item.text1 ? item.text2 : item.text1;
                chat.active = true; 
            }
        }
    }
}

function saveGame(){
    let gameData = {"COINS": COINS, "HEARTS": HEARTS, "ARMOR": ARMOR, "DIAMONDS": DIAMONDS, "UnlockedLevels": UnlockedLevels, "DiamondsCollected": DiamondsCollected, "UnlockedColors": player.unlockedColors, "DoubleJump": player.canDoubleJump};
    localStorage.setItem("BlockRunData", JSON.stringify(gameData));
    console.log("Game Saved");
}

function loadGame(){
    let gameData = JSON.parse(localStorage.getItem("BlockRunData"));
    if(gameData) {
        COINS = gameData.COINS;
        HEARTS = gameData.HEARTS;
        ARMOR = gameData.ARMOR || ARMOR;
        DIAMONDS = gameData.DIAMONDS || DIAMONDS;
        UnlockedLevels = gameData.UnlockedLevels;
        DiamondsCollected = gameData.DiamondsCollected || DiamondsCollected;
        player.unlockedColors = gameData.UnlockedColors;
        player.canDoubleJump = gameData.DoubleJump ? true : false;
        console.log("Game Loaded");
    }
}

function handleYscroll(reset) {
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
   else if((player.y <= yLevelMax && yLevel == 1)){
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
   if(reset) images["background"].src = "imgs/clouds.jpg";
}

function createMap(index) {
    // Unlock next level of current map if we beat that level and returned to town not (not from boss death)
    if(index == 0) {
        UnlockedLevels[currentMapIdx+1] = true;
        if(UnlockedLevels.length <= currentMapIdx) UnlockedLevels.push(true);
    } else if(index == -1) {
        // Happens on boss death loads town as normal just doesn't unlock the next leve via the code above.
        index = 0;
    }

    var map = levels[index];
    var SIZE = 32;
    player.reset();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    
    items = [];
    Enemies = [];
    MapItems = new Array(map.length);
    for (var i = 0; i < MapItems.length; i++) MapItems[i] = new Array(map[0].length);

    boss = false;
    scrollX = 0;
    scrollY = 0;
    yLevel = 0;
    KEYS = 0;
    SKEYS = 0;

    let bigReadBeaten = false;
    if(UnlockedLevels.length >= 7 && UnlockedLevels[6] == true) bigReadBeaten = true;
    
    for(var Y = 0; Y < map.length; Y++ ) {
        for(var X = 0; X < map[0].length; X++ ) {
            var char = map[Y].charAt(X);
            var x = X*SIZE;
            var y = Y*SIZE;
            if(char == ' ') continue;
            if(char == '#') addToMap(new Block(x, y), X, Y);
            if(char == 'W') addToMap(new Water(x, y), X, Y);
            else if(char == '_') addToMap(new Platform(x, y), X, Y); 
            else if(char == '~') addToMap(new FallingPlatform(x, y), X, Y); 
            else if(char == 'o') addToMap(new Coin(x, y), X, Y);
            else if(char == 'H') addToMap(new Heart(x, y), X, Y);
            else if(char == 'D') addToMap(new Diamond(x, y, index), X, Y); 
            else if(char == 'E') addToMap(new Enemy(x, y, 40, 52, images["enemies"], 4, 5, 2, "red block"), X, Y);
            else if(char == 'S') addToMap(new Enemy(x, y, 30, 30, images["enemy_spike"], 4, 5, 2, "spike"), X, Y);
            else if(char == 'P' || Number.parseInt(char)) addToMap(new Portal(x, y, char), X, Y);
            else if(char == 'T') addToMap(new GhostBlock(x, y), X, Y);
            else if(char.toUpperCase() == 'L') addToMap(new Lock(x, y, char), X, Y);
            else if(char.toUpperCase() == 'K') addToMap(new Key(x, y, char), X, Y);
            else if(char == 'v') addToMap(new Spikes(x, y, "bottom"), X, Y);     
            else if(char == '^') addToMap(new Spikes(x, y, "top"), X, Y);  
            else if(char == '>') addToMap(new Spikes(x, y, "right"), X, Y);  
            else if(char == '<') addToMap(new Spikes(x, y, "left"), X, Y);              
            else if(char == '$') { addToMap(shop, X, Y); shop.setPosition(x, y); }
            else if(char == 'R') { boss = new BigRed(x, y, items.length); addToMap(boss, X, Y); }
            else if(char == 'r' && !bigReadBeaten) addToMap(new Block(x, y, "block_bigred"), X, Y);
            else if(char == 'M') addToMap(new Npc(x, y, "Miner", index), X, Y);
            else if(char == 'Y') addToMap(new Npc(x, y, "Mayor", index, bigReadBeaten), X, Y);
       }
    }
}

function addToMap(item, X, Y) {
    if (item instanceof Enemy) {
        Enemies.push(item);
    } else {
        items.push(item);
        MapItems[Y][X] = item;
    }
}
