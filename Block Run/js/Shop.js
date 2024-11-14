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
    this.active = false;

    var mouseBetween = function(x1, y1, x2, y2) {
        return MouseX > x1 && MouseY > y1 && MouseX < x2 && MouseY < y2;
    }

    this.setPosition = function(x, y) {
        this.x = x - 96;
        this.y = y - 32;
    }

    this.draw = function() {
        if(this.active) {
            this.frameX = 1;
        } else {
            this.frameX = 0;
            ShowShop = false;
        }
        ctx.drawImage(this.image, this.frameX*this.width, 0, this.width, this.height, this.x, this.y, this.width, this.height);

        if(ShowShop) {
            var btnYOffset = 34;
            // Mouse if over Exit Button
            if(mouseBetween(435, 84, 455, 100)) this.frameX = 1;
            else if(mouseBetween(390, 108, 407, 128) && COINS >= 20) this.frameX = 2
            else if(mouseBetween(390, 108+btnYOffset, 407, 128+btnYOffset) && COINS >= 30) this.frameX = 3
            else if(mouseBetween(390, 108+btnYOffset*2, 407, 128+btnYOffset*2) && COINS >= 50 && player.colors.length - 1 > player.unlockedColors) this.frameX = 4
            else if(mouseBetween(390, 108+btnYOffset*3, 407, 128+btnYOffset*3) && COINS >= 100) this.frameX = 5
            else this.frameX = 0;

            ctx.drawImage(images['shop_dialogs'], this.frameX*this.shopW, this.frameY*this.shopH, this.shopW, this.shopH, canvas.width - scrollX - canvas.width/2 - this.shopW/2, this.y - this.shopH + 16 + scrollY, this.shopW, this.shopH);
        }
    }
 }

 document.onmousemove = function(e){
    MouseX = e.clientX - canvas.offsetLeft;
    MouseY = e.clientY - canvas.offsetTop;
};

document.onmouseup = function(e) {
    if(!ShowShop) return;
    if(shop) {
        switch(shop.frameX) {
            case 1:
                ShowShop = false;
                break;
            case 2:
                HEARTS++;
                COINS -= 20;
                break
            case 3:
                // TODO: Armor functionalitiy
                // COINS -= 304
                break
            case 4:
                if(player.colors.length - 1 > player.unlockedColors) player.unlockedColors++;
                player.selectedColor = player.unlockedColors;
                COINS -= 50;
                shop.frameY = 1;
                break
          }
    }
};

var shop = new Shop();