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
            saveGame();
        }
    }

    this.mouseOver = function() {
        if(!this.canBuy()) return false;
        return MouseX > this.x && MouseY > this.y && MouseX < this.x + this.w && MouseY < this.y + this.h;
    }

    this.canBuy = function() { return this.condition && COINS > this.cost; }

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
            doubleJumpBtn.condition = player.canDoubleJump == false;

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