var delay = 27;
loadGame();
createMap(currentMapIdx);

// Game loop
timer = setInterval(function()
{
   ctx.drawImage(images["background"],-scrollX, scrollY, canvas.width, canvas.height);
   ctx.fillStyle = player.color;
   //player.update();
   handleYscroll(false);
   for(item in items)
      items[item].draw();
   player.update();
   player.draw();   
   drawUI();
}, delay);

function drawUI() {
   if(yLevel < 2) ctx.fillStyle = "darkgrey";
   else ctx.fillStyle = "#666666";
   ctx.globalAlpha = 0.7;
   ctx.font = "bold 10px sans-serif";
   ctx.fillText("Beta: V 0.76", 5-scrollX, canvas.height+scrollY-5);
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