// Shop Buy and exit buttons
function Button(x, y, w, h, cost, callback, diamondCost = 0) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.cost = cost;
    this.diamondCost = diamondCost;
    this.condition = true;

    this.click = function() {
        console.log("Clicked:" + this.canBuy());
        if(this.canBuy()) {
            callback();
            COINS -= this.cost;
            DIAMONDS -= this.diamondCost;
            //if(this.cost == 100) DIAMONDS--; // Double Jump cost a diamond.
            saveGame();
        }
    }

    this.mouseOver = function() {
        if(!this.canBuy()) return false;
        return MouseX > this.x && MouseY > this.y && MouseX < this.x + this.w && MouseY < this.y + this.h;
    }

    this.canBuy = function() { return this.condition && COINS >= this.cost && DIAMONDS >= this.diamondCost; }

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
var doubleJumpBtn = new Button(390, 108+btnYOffset*3, 17, 20, 100, () => { player.canDoubleJump = true }, 1);
var buttons = [exitBtn, heartBtn, armorBtn, colorBtn, doubleJumpBtn];

function Shop(e) {
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
    this.buttons = buttons;

    this.setPosition = function(x, y) {
        this.x = x;
        this.y = y;
    }

    this.drawDialog = function(type = 'shop_dialogs') {
        // Determine which button our mouse is over and determine the frame to draw based on it.
        for (let i = 0; i < this.buttons.length; i++) {
            if(this.buttons[i].mouseOver()) {
                this.frameX = this.onButton = i;
                break;
            }
        }
        // Draw Shop
        var x = canvas.width - scrollX - canvas.width/2 - this.shopW/2;
        var y = this.y - this.shopH + 16 + scrollY;
        ctx.drawImage(images[type], (this.onButton + 1)*this.shopW, this.frameY*this.shopH, this.shopW, this.shopH, x, y, this.shopW, this.shopH);

        // Determine what the player cannot buy and show those items as disabled.
        for (let i = 0; i < buttons.length; i++) {
            this.buttons[i].drawDisabled();
        }
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

            this.drawDialog();
        }
    }
}

// Diamond Shop buttons
var btnYOffset = 34;
var exitDiamondBtn = new Button(435, 84, 20, 16, 0, () => { ShowDiamondShop = false; });
var airDashBtn = new Button(410, 108, 17, 20, 500, () => { player.canDash = true; }, 2);
var swimBtn = new Button(410, 108+btnYOffset, 17, 20, 400, () => { player.canSwim = true; }, 2);
var gillsBtn = new Button(410, 108+btnYOffset*2, 17, 20, 400, () => { player.canBreatheUnderwater = true; }, 2);
var shootBtn = new Button(410, 108+btnYOffset*3, 17, 20, 3000, () => { player.canShoot = true }, 2);
var diamondButtons = [exitDiamondBtn, airDashBtn, swimBtn, gillsBtn, shootBtn];

function DiamondShop() {
    Shop.call(this); 
    this.image = images["diamond_shop"];
    this.buttons = diamondButtons;

    this.draw = function() {
        // Display Space to shop or close shop when player leaves
        if(this.active) {
            this.frameX = 1;
        } else {
            this.frameX = 0;
            ShowDiamondShop = false;
        }

        // Draw Vendor
        ctx.drawImage(this.image, this.frameX*this.width, 0, this.width, this.height, this.x, this.y, this.width, this.height);

        if(ShowDiamondShop) {
            // All buttons are prerequisites of the previous button along with the diamond cost. Once you buy it once you cannot get it again.
            this.onButton = -1;
            airDashBtn.condition = !player.canDash && DIAMONDS > 1;
            swimBtn.condition = !player.canSwim && player.canDash && DIAMONDS > 1;
            gillsBtn.condition = !player.canBreatheUnderwater && player.canSwim && DIAMONDS > 1;
            shootBtn.condition = !player.shootBtn && player.canBreatheUnderwater && DIAMONDS > 1;

            this.drawDialog('diamond_dialogs');
        }
    }
}


document.onmousemove = function(e){
    MouseX = e.clientX - canvas.offsetLeft;
    MouseY = e.clientY - canvas.offsetTop;
};

var shop = new Shop();
var diamondShop = new DiamondShop();

document.onmouseup = function(e) {
    if(ShowShop) {
        var btn = shop.buttons[shop.frameX];
        if(shop.onButton > -1) btn.click();
    } else if (ShowDiamondShop) {
        var btn = diamondShop.buttons[diamondShop.frameX];
        if(diamondShop.onButton > -1) btn.click();
    }
};