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

function Npc(x, y, type, index, beatBoss= false) {
    console.log(type, x, y);
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
    var townMayor = this.type == "Mayor" && this.index == 0;
    if(this.type == "Fisher") {
        this.width = 64; 
        this.text1 = "Fish just aint catching ever since that monster showed up.\n We are barely getting by these days...";
        if(beatBoss) this.text1 = "Thanks so much for beating that monster! I've never\nseen so much fish, we can feed everyone now!";
        this.text2 = "Be warned challenging that beast. The water is denser\n and harder to breath even if have no trouble normally.";
    }
    
    if(this.type == "Miner" && this.index == 0) this.text2 = "Normal levels have secret paths and often require Double\n Jump for their diamond. Defeating a boss gives you one too!"
    if(this.type == "Miner" && this.index == 1) this.text1 = "If you had Double Jump and Armor you might be able to get \n to the diamond up there somehow.";
    if(this.type == "Miner" && this.index == 2) this.text1 = "Maybe there is another way to get over there. \n Looks like there is a path from underground.";
    if(this.type == "Miner" && this.index == 3) this.text1 = "Looks like there is another underground path. \n There must be some way to get down there.";
    if(this.type == "Miner" && this.index == 4) this.text1 = "There must be a silver key around somewhere. Such a \n shinny diamond so close to us!";
    if(this.type == "Miner" && this.index == 5) this.text1 = "Congratulations on beating Big Red and he had a diamond! \nThat may allow you to find more them in pervious levels.";
    if(this.type == "Miner" && this.index == 6) this.text1 = "Not sure how to get that one down there. But something \n tells me you need to be able to Dash and Swim to get it.";
    if(this.type == "Miner" && this.index == 8) this.text1 = "Keep swiming left for the diamond. You'll need to be able\n breath under water and have a sheild!";
    if(this.type == "Miner" && this.index == 9) this.text1 = "You win! Thank you so much for playing this lil game :)\n Look out for more updates in the future!";
    if(this.type == "Miner" && this.index == 0 && this.y > 800) {
        this.text1 = "Amazing you unlocked every ability! We are still\n currently working On some cool secret stuff.";
        this.text2 = "Thank you so much for playing and collecting everything!\n Look out for more games to play on my main site too.";
    }
    if(townMayor && !beatBoss) this.text1 = "That Big Red has blocked the way to to rest of our town! \n If someone could defeat him maybe the way will open up.";
    if(townMayor && beatBoss) this.text1 = "Amazing you beat Big Red! The rest of the town is open. \n Pervious levels has challenges for diamonds!";
    if(townMayor && this.index == 0) this.text2 = "If you have extra lives you can donate them for coins.\nBeating a boss for the first time gives a bigger reward."
    if(this.type == "Mayor" && this.index == 2) this.text1 = "Seems like Big Red's older brother Dark Red has been \n locked away down here. Be carefull!";
    if(this.type == "Mayor" && this.index == 8) this.text1 = "Looks like Big Red became Reverse-Red after you beat him.\n Careful it's alot faster!";
    if(this.type == "Mayor" && this.index == 9) this.text1 = "With Big Jelly defeated the town can finally be at peace!\n Thank you so much for saving our town!";
    this.text = this.text1;

    this.draw = function() { 
        this.active = false;
        if(distance(this, player) < 60 && !chat.active) {
            this.active = true;
            ctx.drawImage(this.talk, 0, 0, this.width, this.height/2, this.x, this.y - 32, this.width, this.height/2);
        }
        if(player.x < this.x && this.type != "Fisher") this.frameX = 1;
        else this.frameX = 0;
        ctx.drawImage(this.image, this.frameX*this.width, 0, this.width, this.height, this.x, this.y, this.width, this.height);
    }
}