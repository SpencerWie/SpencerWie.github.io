var delay = 27;
loadGame();
createMap(currentMapIdx);

// Game loop
timer = setInterval(function()
{
   ctx.drawImage(images["background"],-scrollX, scrollY, canvas.width, canvas.height);
   ctx.fillStyle = player.color;
   handleYscroll();
   DrawBlocksAroundPlayer();
   for(e in Enemies) if(Enemies[e]) Enemies[e].draw();
   player.update();
   player.draw();   
   drawUI();
}, delay);

function drawUI() {
   if(yLevel < 2) ctx.fillStyle = "darkgrey";
   else ctx.fillStyle = "#666666";
   ctx.globalAlpha = 0.7;
   ctx.font = "bold 10px sans-serif";
   ctx.fillText("V 1.02", 5-scrollX, canvas.height+scrollY-5);
   ctx.drawImage(images["coin"], 0,0, 32, 32, canvas.width-65-scrollX, scrollY, 32, 32);
   ctx.fillText(" x "+COINS, canvas.width-40-scrollX,20+scrollY);
   ctx.drawImage(images["heart"], 0,0, 32, 32, canvas.width-110-scrollX, scrollY, 32, 32);
   ctx.fillText(" x "+HEARTS, canvas.width-85-scrollX,20+scrollY);
   if(ARMOR) ctx.drawImage(images["armor"], 0,0, 32, 32, canvas.width-155-scrollX, scrollY, 32, 32);
   if(DIAMONDS > 0) {
      ctx.drawImage(images["diamond"], 0,0, 32, 32, 5-scrollX, scrollY+5, 24, 24);
      ctx.fillText(" x "+DIAMONDS, 25-scrollX,20+scrollY);
   }
   chat.draw();
   ctx.globalAlpha = 1;
}

function DrawBlocksAroundPlayer(spaceX = 15, SpaceY = 12) {
   var playerX = Math.floor(player.x/32);
   var RangeY = Math.floor(scrollY/32);
   var PlayersLeft = playerX - spaceX;
   var PlayersRight = playerX + spaceX;
   if(PlayersLeft < 0) PlayersLeft = 0;
   if(PlayersRight > MapItems[0].length) PlayersRight = MapItems[0].length;
   if(RangeY + SpaceY > MapItems.length) RangeY = MapItems.length - SpaceY;
   for(var Y = RangeY; Y < RangeY + SpaceY; Y++ ) 
      for(var X = PlayersLeft; X < PlayersRight; X++ ) 
         if(MapItems[Y][X]) MapItems[Y][X].draw();
}