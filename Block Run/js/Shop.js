// Shop Buy and exit buttons
function Button(x, y, w, h, cost, callback) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.cost = cost;
    this.condition = true;

    this.click = function() {
        if(this.canBuy()) {
            callback();
            COINS -= this.cost;
            if(this.cost == 100) DIAMONDS--; // Double Jump cost a diamond.
            saveGame();
        }
    }

    this.mouseOver = function() {
        if(!this.canBuy()) return false;
        return MouseX > this.x && MouseY > this.y && MouseX < this.x + this.w && MouseY < this.y + this.h;
    }

    this.canBuy = function() { return this.condition && COINS >= this.cost; }

    this.drawDisabled = function() {
        if(!this.canBuy()) {
            ctx.fillStyle = ctx.fillStyle = "rgba(232,232,232,0.5)";
            ctx.fillRect(this.x - scrollX - 5, this.y - 5, this.w + 10, this.h + 5);
        }
    }
}

// Create Shop buttons
var btnYOffset = 34;
var exitBtn = new Button(435, 84, 20, 16, 0, () => { ShowShop = false; });
var heartBtn = new Button(390, 108, 17, 20, 20, () => { HEARTS++; });
var armorBtn = new Button(390, 108+btnYOffset, 17, 20, 30, () => { ARMOR = true; });
var colorBtn = new Button(390, 108+btnYOffset*2, 17, 20, 50, () => { 
    player.unlockedColors++;
    player.selectedColor = player.unlockedColors;
    shop.frameY = 1;
});
var doubleJumpBtn = new Button(390, 108+btnYOffset*3, 17, 20, 100, () => { player.canDoubleJump = true });
var buttons = [exitBtn, heartBtn, armorBtn, colorBtn, doubleJumpBtn];

function Shop() {
    this.x = 0;
    this.y = 0;
    this.width = 96;
    this.height = 64;
    this.shopW = 220;
    this.shopH = 160;
    this.image = images["shop_vendor"];
    this.frameX = 0;
    this.frameY = 0;
    this.onButton = -1;
    this.active = false;

    this.setPosition = function(x, y) {
        this.x = x - 96;
        this.y = y - 32;
    }

    this.draw = function() {
        // Display Space to shop or close shop when player leaves
        if(this.active) {
            this.frameX = 1;
        } else {
            this.frameX = 0;
            ShowShop = false;
        }

        // Draw Vendor
        ctx.drawImage(this.image, this.frameX*this.width, 0, this.width, this.height, this.x, this.y, this.width, this.height);

        // When player opened the shop draw shop dialog
        if(ShowShop) {
            this.onButton = -1;
            armorBtn.condition = !ARMOR;
            colorBtn.condition = player.colors.length - 1 > player.unlockedColors;
            doubleJumpBtn.condition = player.canDoubleJump == false && DIAMONDS > 0;

            // Determine which button our mouse is over and determine the frame to draw based on it.
            for (let i = 0; i < buttons.length; i++) {
                if(buttons[i].mouseOver()) {
                    this.frameX = this.onButton = i;
                    break;
                }
            }
            // Draw Shop
            ctx.drawImage(images['shop_dialogs'], (this.onButton + 1)*this.shopW, this.frameY*this.shopH, this.shopW, this.shopH, canvas.width - scrollX - canvas.width/2 - this.shopW/2, this.y - this.shopH + 16 + scrollY, this.shopW, this.shopH);
            
            // Determine what the player cannot buy and show those items as disabled.
            for (let i = 0; i < buttons.length; i++) {
                buttons[i].drawDisabled();
            }
        }
    }
}

var isMac = navigator.platform.indexOf('Mac') > -1;
function Chat(){
    this.x = 50;
    this.y = 50;
    this.width = 600;
    this.height = 64;
    this.image = images["chat"];
    this.text = "";
    this.active = false;
    this.draw = function() { 
        if(!this.active) return;
        ctx.globalAlpha = 0.8;
        ctx.font = isMac ? "bold 16px monospace" : "bold 18px monospace"; // Macs seem to draw text a bit bigger so making it smaller to fit
        ctx.drawImage(this.image, 0, 0, this.width, this.height, 58-scrollX, canvas.height-this.height+scrollY, this.width, this.height);
        ctx.fillStyle = "#222222";
        ctx.globalAlpha = 1;
        // If we have a new line draw split the text and draw the rest on the second line. (The chat box only supports room for a second line)
        if(this.text && this.text.includes("\n")) {
            var lines = this.text.split("\n");
            ctx.fillText(lines[0], 70-scrollX, canvas.height-this.height+24+scrollY);
            ctx.fillText(lines[1].trim(), 70-scrollX, canvas.height-this.height+46+scrollY);
        } else {
            ctx.fillText(this.text, 70-scrollX, canvas.height-this.height+24+scrollY);
        }
        ctx.font = "bold 10px monospace";
        ctx.fillText("Hit Space to close", this.width-60-scrollX, canvas.height-this.height+58+scrollY);
    }
}

function Npc(x, y, type, index) {
    this.x = x;
    this.y = y;
    this.width = 32;
    this.height = 32;
    this.type = type;
    this.image = images[type];
    this.talk = images["talk"];
    this.frameX = 0;
    this.active = false;
    this.active2 = false;
    this.index = index;
    this.text1 = "I'm a diamond miner. Collecting diamonds lets you purchase \n rare items and abilities!";
    this.text2 = "";
    
    if(this.type == "Miner" && this.index == 0) this.text2 = "Normal levels have secret paths and often require Double\n Jump for their diamond. Defeating a boss gives you one too!"
    if(this.type == "Miner" && this.index == 1) this.text1 = "If you had Double Jump and Armor you might be able to get \n to the diamond up there somehow.";
    if(this.type == "Miner" && this.index == 2) this.text1 = "Maybe there is another way to get over there. \n Looks like there is a path from underground.";
    if(this.type == "Miner" && this.index == 3) this.text1 = "Looks like there is another underground path. \n There must be some way to get down there.";
    if(this.type == "Miner" && this.index == 4) this.text1 = "There must be a silver key around somewhere. Such a \n shinny diamond so close to us!";
    if(this.type == "Miner" && this.index == 5) this.text1 = "Congratulations on beating Big Red and he had a diamond! \nThat may allow you to find more them in pervious levels.";
    if(this.type == "Mayor" && this.index == 0) this.text1 = "That Big Red has blocked the way to to rest of our town! \n If someone could defeat him maybe the way will open up.";
    if(this.type == "Mayor" && this.index == 2) this.text1 = "Seems like Big Red's older brother Dark Red has been \n locked away down here. Be carefull!";
    this.text = this.text1;

    this.draw = function() { 
        this.active = false;
        if(distance(this, player) < 60 && !chat.active) {
            this.active = true;
            ctx.drawImage(this.talk, 0, 0, this.width, this.height/2, this.x, this.y - 32, this.width, this.height/2);
        }
        if(player.x < this.x) this.frameX = 1;
        else this.frameX = 0;
        ctx.drawImage(this.image, this.frameX*this.width, 0, this.width, this.height, this.x, this.y, this.width, this.height);
    }
}

document.onmousemove = function(e){
    MouseX = e.clientX - canvas.offsetLeft;
    MouseY = e.clientY - canvas.offsetTop;
};

document.onmouseup = function(e) {
    if(!ShowShop) return;
    var btn = buttons[shop.frameX];
    if(shop.onButton > -1) btn.click();
};

var shop = new Shop();
var chat = new Chat();