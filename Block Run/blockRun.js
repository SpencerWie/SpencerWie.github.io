var delay = 27;
loadGame();
createMap(currentMapIdx);

// Game loop
timer = setInterval(function()
{
   ctx.drawImage(images["background"],-scrollX, scrollY, canvas.width, canvas.height);
   ctx.fillStyle = player.color;
   //player.update();
   handleYscroll();
   for(item in items)
      items[item].draw();
   player.update();
   player.draw();   
   drawUI();
}, delay);

function drawUI() {
   ctx.fillStyle = "red";
   ctx.globalAlpha = 0.7;
   ctx.fillText("Beta: V 0.64", 10-scrollX, 10+scrollY);
   ctx.drawImage(images["coin"], 0,0, 32, 32, canvas.width-65-scrollX, scrollY, 32, 32);
   ctx.fillText(" x "+COINS, canvas.width-40-scrollX,20+scrollY);
   ctx.drawImage(images["heart"], 0,0, 32, 32, canvas.width-110-scrollX, scrollY, 32, 32);
   ctx.fillText(" x "+HEARTS, canvas.width-85-scrollX,20+scrollY);
   if(ARMOR) ctx.drawImage(images["armor"], 0,0, 32, 32, canvas.width-155-scrollX, scrollY, 32, 32);
   ctx.globalAlpha = 1;
}