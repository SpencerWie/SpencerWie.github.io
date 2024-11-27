//Blocks
function Block(x,y,image){
	this.x = x;
	this.y = y;
	if(image==1){this.image = dirtBlock1;}
	else if(image==2){this.image = dirtBlock2;}
	else{this.image = dirtBlock3;}
this.Draw = function(){
	canvas = getCanvas();
	canvas.drawImage(this.image, this.x, this.y);		
	}
}

//Since it's been time consuming to make a large array size by hand this functions creates a 2D array with cols and rows as input.
function create2dArray(cols, rows) {
    var newArray = new Array(cols), i, j;
    for(i = 0, j = rows; i < j; i++) {
        newArray[i] = new Array(cols);
    }
    return newArray;
}

var tileMap = create2dArray(COLS,ROWS);

//Load images only once.
//Load dirt blocks
dirtBlock1 = new Image();
dirtBlock1.src = "imgs/dirtTile1_x2.png";
dirtBlock2 = new Image();
dirtBlock2.src = "imgs/dirtTile2_x2.png";
dirtBlock3 = new Image();
dirtBlock3.src = "imgs/dirtTile3_x2.png";
rockBlock = new Image();
rockBlock.src = "imgs/rockTile.png";
//Load dirt blocks animimation frames
dirtBlock1_Hit1 = new Image();
dirtBlock1_Hit1.src = "imgs/dirtTile1_x2_Hit1.png";
dirtBlock1_Hit2 = new Image();
dirtBlock1_Hit2.src = "imgs/dirtTile1_x2_Hit2.png";
dirtBlock1_Hit3 = new Image();
dirtBlock1_Hit3.src = "imgs/dirtTile1_x2_Hit3.png";
dirtBlock2_Hit1 = new Image();
dirtBlock2_Hit1.src = "imgs/dirtTile2_x2_Hit1.png";
dirtBlock2_Hit2 = new Image();
dirtBlock2_Hit2.src = "imgs/dirtTile2_x2_Hit2.png";
dirtBlock2_Hit3 = new Image();
dirtBlock2_Hit3.src = "imgs/dirtTile2_x2_Hit3.png";
dirtBlock3_Hit1 = new Image();
dirtBlock3_Hit1.src = "imgs/dirtTile3_x2_Hit1.png";
dirtBlock3_Hit2 = new Image();
dirtBlock3_Hit2.src = "imgs/dirtTile3_x2_Hit2.png";
dirtBlock3_Hit3 = new Image();
dirtBlock3_Hit3.src = "imgs/dirtTile3_x2_Hit3.png";
//Load ore blocks.
copperOre = new Image();
copperOre.src = "imgs/copperOre.png"
ironOre = new Image();
ironOre.src = "imgs/ironOre.png"
silverOre = new Image();
silverOre.src = "imgs/silverOre.png"
goldOre = new Image();
goldOre.src = "imgs/goldOre.png"
//Load ground blocks
lavaBlock = new Image();
lavaBlock.src = "imgs/lavaTile.png"
//Load ore blocks animation frames.
copperOre_Hit1 = new Image();
copperOre_Hit1.src = "imgs/copperOre_Hit1.png";
copperOre_Hit2 = new Image();
copperOre_Hit2.src = "imgs/copperOre_Hit2.png";
copperOre_Hit3 = new Image();
copperOre_Hit3.src = "imgs/copperOre_Hit3.png";
ironOre_Hit1 = new Image();
ironOre_Hit1.src = "imgs/ironOre_Hit1.png";
ironOre_Hit2 = new Image();
ironOre_Hit2.src = "imgs/ironOre_Hit2.png";
ironOre_Hit3 = new Image();
ironOre_Hit3.src = "imgs/ironOre_Hit3.png";
silverOre_Hit1 = new Image();
silverOre_Hit1.src = "imgs/silverOre_Hit1.png";
silverOre_Hit2 = new Image();
silverOre_Hit2.src = "imgs/silverOre_Hit2.png";
silverOre_Hit3 = new Image();
silverOre_Hit3.src = "imgs/silverOre_Hit3.png";
goldOre_Hit1 = new Image();
goldOre_Hit1.src = "imgs/goldOre_Hit1.png";
goldOre_Hit2 = new Image();
goldOre_Hit2.src = "imgs/goldOre_Hit2.png";
goldOre_Hit3 = new Image();
goldOre_Hit3.src = "imgs/goldOre_Hit3.png";
diamondOre = new Image();
diamondOre.src = "imgs/diamondOre.png";
//Load Gas and Shop images.
gasStation = new Image();
gasStation.src = "imgs/GasStation_xHalf.png"
gasStation_fill = new Image();
gasStation_fill.src = "imgs/GasStation_xHalf_fill.png"
tradeStation = new Image();
tradeStation.src = "imgs/TradeStation.png"
tradeStation_sell = new Image();
tradeStation_sell.src = "imgs/TradeStation_sell.png"
shopStation = new Image();
shopStation.src = "imgs/ShopStation.png"
shopStation_shop = new Image();
shopStation_shop.src = "imgs/ShopStation_shop.png";
//Load Shop Menu and sub Menus
shopMenu = new Image();
shopMenu.src = "imgs/ShopMenu.png";
shopMenu_X = new Image();
shopMenu_X.src = "imgs/ShopMenu_X.png";
shopMenu_Audio = new Image();
shopMenu_Audio.src = "imgs/shopMenu_Audio.png";
shopMenu_1 = new Image();
shopMenu_1.src = "imgs/ShopMenu_1.png";
shopMenu_2 = new Image();
shopMenu_2.src = "imgs/ShopMenu_2.png";
shopMenu_3 = new Image();
shopMenu_3.src = "imgs/ShopMenu_3.png";
shopMenuArray = new Array(shopMenu_1, shopMenu_2, shopMenu_3);
infoMenu = new Image();
infoMenu.src = "imgs/Information.png";
infoMenu_X = new Image();
infoMenu_X.src = "imgs/Information_X.png";
//Load Icons.
fuel_icon = new Image();
fuel_icon.src = "imgs/fuel_icon.png"
storage_icon = new Image();
storage_icon.src = "imgs/storage_icon1.png"
info_icon = new Image();
info_icon.src = "imgs/info_icon.png"
info_icon_X = new Image();
info_icon_X.src = "imgs/info_icon_X.png"

function animate(block, digType){
	if(block.image == dirtBlock1 || block.image == dirtBlock1_Hit1 || block.image == dirtBlock1_Hit2){//If the tile is dirtBlock1, play it's break animation.
		if(digType<1){block.image = dirtBlock1;}
		if(digType>5){block.image = dirtBlock1_Hit1;}
		if(digType>10){block.image = dirtBlock1_Hit2;}
		if(digType>15){block.image = dirtBlock1_Hit3;}
	}
	if(block.image == dirtBlock2 || block.image == dirtBlock2_Hit1 || block.image == dirtBlock2_Hit2){//If the tile is dirtBlock1, play it's break animation.
		if(digType<1){block.image = dirtBlock2;}
		if(digType>5){block.image = dirtBlock2_Hit1;}
		if(digType>10){block.image = dirtBlock2_Hit2;}
		if(digType>15){block.image = dirtBlock2_Hit3;}
	}
	if(block.image == dirtBlock3 || block.image == dirtBlock3_Hit1 || block.image == dirtBlock3_Hit2){//If the tile is dirtBlock1, play it's break animation.
		if(digType<1){block.image = dirtBlock3;}
		if(digType>5){block.image = dirtBlock3_Hit1;}
		if(digType>10){block.image = dirtBlock3_Hit2;}
		if(digType>15){block.image = dirtBlock3_Hit3;}
	}
	if(block.image == copperOre || block.image == copperOre_Hit1 || block.image == copperOre_Hit2){//If the tile is copperOre, play it's break animation.
		if(digType<1){block.image = copperOre;}
		if(digType>5){block.image = copperOre_Hit1;}
		if(digType>10){block.image = copperOre_Hit2;}
		if(digType>15){block.image = copperOre_Hit3;}
	}
	if(block.image == ironOre || block.image == ironOre_Hit1 || block.image == ironOre_Hit2){//If the tile is ironOre, play it's break animation.
		if(digType<1){block.image = ironOre;}
		if(digType>5){block.image = ironOre_Hit1;}
		if(digType>10){block.image = ironOre_Hit2;}
		if(digType>15){block.image = ironOre_Hit3;}
	}
	if(block.image == silverOre || block.image == silverOre_Hit1 || block.image == silverOre_Hit2){//If the tile is silverOre, play it'sbreak animation.
		if(digType<1){block.image = silverOre;}
		if(digType>5){block.image = silverOre_Hit1;}
		if(digType>10){block.image = silverOre_Hit2;}
		if(digType>15){block.image = silverOre_Hit3;}
	}
	if(block.image == goldOre || block.image == goldOre_Hit1 || block.image == goldOre_Hit2){//If the tile is silverOre, play it's break animation.
		if(digType<1){block.image = goldOre;}
		if(digType>5){block.image = goldOre_Hit1;}
		if(digType>10){block.image = goldOre_Hit2;}
		if(digType>15){block.image = goldOre_Hit3;}
	}
	return block.image;
}

//Basic Rect collision check function. I will make it as quick as possible since it's critical. Since the ship will not be able to fall, lessen it's square by 2 per side.
function intersect(a, b, size) {
	//Since all objs are of size 40 they will all have the respected width and height for their rect.
	return (a.x <= b.x+size-2 &&
          b.x+2 <= a.x+size &&
          a.y <= b.y+size-2 &&
          b.y-2 <= a.y+size)
}

function ClearRow(row){
	for(var i=0;i<COLS;i++){
		tileMap[row][i] = 0;
	}
}

function FillRow(row){
	for(var i=0;i<COLS;i++){
		choice = parseInt(Math.random()*3)+1;//Choose a random number from 1 to 3
		tileMap[row][i] = new Block(i,row,choice);
	}
}

function generateGroundandAir(){
	//Currently this is fixed. It could easily made dynamic but I don't want the user being about to change the size of the cave and top.
	ClearRow(0);//Air
	ClearRow(1);//Air
	ClearRow(2);//Air
	FillRow(3);//Soild Ground
	FillRow(ROWS-7)//Soild End Cave
	ClearRow(ROWS-6)//End Cave
	ClearRow(ROWS-5)//End Cave
	ClearRow(ROWS-4)//End Cave
	ClearRow(ROWS-3)//End Cave
	ClearRow(ROWS-2)//End Cave
	FillRow(ROWS-1)//End Cave Ground
	//Place rock blocks below buildings
	tileMap[3][5].image = rockBlock;
	tileMap[3][11].image = rockBlock;
	tileMap[3][12].image = rockBlock;
	tileMap[3][16].image = rockBlock;
	tileMap[3][17].image = rockBlock;
	//Place a row of rocks at the very bottom of the map.
	for(var i=0;i<COLS;i++){
		tileMap[ROWS-1][i].image = rockBlock;
	}
	//Place Diamond Ore on the bottom middle
	tileMap[ROWS-2][COLS-2] = new Block(20,20,1);//Rows-2, Cols-2
	tileMap[ROWS-2][COLS-2].image = diamondOre;
}

function BlockCollision(){
	for(var i=0;i<ROWS;i++){
		for(var j=0;j<COLS;j++){
		 //We only want to check it the item in tileMap is a Block. We also don't want them to be able to dig rocks.
		 if((tileMap[i][j] instanceof Block)){
		 	if(distance(tileMap[i][j],ship)<100){ 	//If too far dont check. and exit function.
			if(intersect(tileMap[i][j],ship,SIZE)){//If Ship and a block is colliding
				//Top of Block collision. Could only count when ship is falling or not moving. Also if the ship is on the edge of the block by 10 pixels on both sides don't count it (So it will be easier for the ship to fly up in caves).
				if(ship.y+(SIZE)<tileMap[i][j].y+(SIZE/2) && ship.ySpeed<=0 && ship.x+SIZE-10>tileMap[i][j].x && ship.x+10<tileMap[i][j].x+(SIZE)){
					//console.log("TOP")
					tileMap[i][j].y = MapY;
					MapY-=ship.ySpeed;
					ship.ySpeed=0;	
					//If the user is pressed DOWN while ontop of the block, inc BlockCountD. But don't if it's a rock.
					if(tileMap[i][j].image!=rockBlock){
						if(DOWN){DigCountD+=UpgradePowers[0];}
						tileMap[i][j].image = animate(tileMap[i][j], DigCountD);
						if(DigCountD>20){//20 will be changed to a global (drill speed) variable.
							//If it was lava you die.
							if(tileMap[i][j].image == lavaBlock){Reset();}
							//If it was diamond you win.
							if(tileMap[i][j].image == diamondOre){LEFT=false;RIGHT=false;DOWN=false;UP=false;alert("You found it! Wow it's huge! Well congratulations my friend, you are now rich. Feel free to keep on digging if you want to rack in some extra dough. You Win! :D ");Cash+=2000;}
							addToPack(tileMap[i][j]);
							tileMap[i][j].x = null; tileMap[i][j].y = null; tileMap[i][j] = null;
							tileMap[i][j]=0;//change it to an empty block and hope the GC does it's job. 0
							DigCountD=0;
					
						}
					}
				}
				
				if(ship.y+20>tileMap[i][j].y+(SIZE) && ship.ySpeed>=0 && ship.x+SIZE-10>tileMap[i][j].x && ship.x+10<tileMap[i][j].x+(SIZE)){
					//console.log("BOTTOM")
					tileMap[i][j].y = MapY;
					MapY-=ship.ySpeed;
					ship.ySpeed=0;
				}
				//We don't want the user to be able to dig while air born. So the user only can dig within a ySpeed limit.
				if(ship.x+SIZE-15<tileMap[i][j].x && ship.y+(SIZE)>tileMap[i][j].y+(SIZE/4) && ship.y<tileMap[i][j].y+(SIZE-10) && ship.xSpeed<0){
					//console.log("LEFT");
					tileMap[i][j].x = MapX;
					MapX-=ship.xSpeed;
					ship.xSpeed=0;
					if(tileMap[i][j].image!=rockBlock && ship.ySpeed<2 && ship.ySpeed>-2 && UP==false){
						if(RIGHT){DigCountR+=UpgradePowers[0];}
						tileMap[i][j].image = animate(tileMap[i][j], DigCountR);
						if(DigCountR>20){//20 will be changed to a global (drill speed) variable.
							if(tileMap[i][j].image == lavaBlock){Reset();}
							//If it was diamond you win.
							if(tileMap[i][j].image == diamondOre){alert("You found it! Wow it's huge! Well congratulations my friend, you are now rich. Feel free to keep on digging if you want to rack in some extra dough. You Win! :D ");Cash+=2000;}
							addToPack(tileMap[i][j]);
							tileMap[i][j].x = null; tileMap[i][j].y = null; tileMap[i][j] = null;
							tileMap[i][j]=0;//change it to an empty block and hope the GC does it's job.
							DigCountR=0;
						}
					}
				}
				if(ship.x+15>tileMap[i][j].x+SIZE && ship.y+(SIZE)>tileMap[i][j].y+(SIZE/4) && ship.y<tileMap[i][j].y+(SIZE-10) && ship.xSpeed>0){
					//console.log("RIGHT");
					tileMap[i][j].x = MapX;
					MapX-=ship.xSpeed;
					ship.xSpeed = 0;
					if(tileMap[i][j].image!=rockBlock && ship.ySpeed<2 && ship.ySpeed>-2 && UP==false){
						if(LEFT){DigCountL+=UpgradePowers[0];}
						tileMap[i][j].image = animate(tileMap[i][j], DigCountL);
						if(DigCountL>20){//20 will be changed to a global (drill speed) variable
							if(tileMap[i][j].image == lavaBlock){Reset();}
							//If it was diamond you win.
							if(tileMap[i][j].image == diamondOre){alert("You found it! Wow it's huge! Well congratulations my friend, you are now rich. Feel free to keep on digging if you want to rack in some extra dough. You Win! :D ");Cash+=2000;}
							addToPack(tileMap[i][j]);
							tileMap[i][j].x = null; tileMap[i][j].y = null; tileMap[i][j] = null;
							tileMap[i][j]=0;//change it to an empty block and hope the GC does it's job.
							DigCountL=0;
						}
					}
				}
				
			}
		  }
		 }
		}
	}
}

//Draw Map
function DrawMap(){
	//Draws the map 25% empty and 75% full.
	tempCanvas = getCanvas();
	Gas.Draw();
	Trade.Draw();
	Shop.Draw();
	for(var i=0;i<ROWS;i++){
		for(var j=0;j<COLS;j++){
			if(tileMap[i][j]==0){/*do nothing, this is empty*/}
			else{//If far only update position
				tileMap[i][j].x = j*SIZE+MapX;
				tileMap[i][j].y = i*SIZE+MapY;
				if(distance(tileMap[i][j],ship)<400){ //If close draw block.
					tileMap[i][j].Draw();
				}
			}
		}
	}
	//Draw Bars and Icons.
	//Draw Fuel Bar
	tempCanvas.beginPath();
    tempCanvas.rect(25,10,parseInt((Fuel/2)),10);
    tempCanvas.fillStyle = "#F2A400";
    tempCanvas.fill();
	tempCanvas.rect(25,10,parseInt((UpgradePowers[2]/2)),10);
    tempCanvas.lineWidth = 1;
    tempCanvas.strokeStyle = "#333333";
    tempCanvas.stroke();
	//Draw Storage Bar
	tempCanvas.beginPath();
    tempCanvas.rect(25,30,parseInt((STORAGE*11)),10);
    tempCanvas.fillStyle = "#33338B";
    tempCanvas.fill();
	tempCanvas.rect(25,30,parseInt((UpgradePowers[1]*11)),10);
    tempCanvas.lineWidth = 1;
    tempCanvas.strokeStyle = "#333333";
    tempCanvas.stroke();
	//Draw Icons
	tempCanvas.drawImage(fuel_icon,0,5);
	tempCanvas.drawImage(storage_icon,0,25);
	infoIcon.Draw();
	tempCanvas.fillStyle = "#4AC925";
	tempCanvas.font="17px Arial";
	tempCanvas.fillText("$: "+Cash,310,18);
}

//Generate Ore Semi-randomly. The futher down on the map we are the more likley better ore is spawned.
function GenerateOre(){
	canvas = getCanvas();
	for(var i=0;i<ROWS;i++){
		for(var j=0;j<COLS;j++){
			choice = Math.random();//Choose a random number from 0 to 1
			//Only have ore spawn in dirt.
			if(tileMap[i][j]!=0){
				//Copper is generated only in the first third of the map. It is more common the futher down.
				if(choice<0.13+((i/ROWS)/3) && i<(ROWS/3)){
					tileMap[i][j].image = copperOre; 
					}
				//Iron is generated only after the first 1/6 of the map and until 3/4 of the map. It is more common futher down and more rare than copper.
				if(choice<0.08+(((i-(ROWS/6))/ROWS)/5) && i>(ROWS/6) && i<(3*ROWS/4)){
					tileMap[i][j].image = ironOre; 
					}
				//Silver is generated only after the first 1/3 of the map and until the end. It is more common futher down and more rare than iron.
				if(choice<0.06+(((i-(ROWS/3))/ROWS)/5) && i>(ROWS/3)){
					tileMap[i][j].image = silverOre; 
					}
				//Gold is generated only after the first 1/2.3 of the map and until the end. It is more common futher down and more rare than silver.
				if(choice<0.03+(((i-(ROWS/2))/ROWS)/7) && i>(ROWS/2.3)){
					tileMap[i][j].image = goldOre; 
					}
				//Rock is generated only after the first 1/2 of the map until the end. It is more common futher down and a bit more common than lava.
				if(choice<0.02+(((i-(ROWS/2))/ROWS)/10) && i>(ROWS/2.3)){
					//Since this is rare it's hard for a single random generated number to differ from small percentiles. So it will 55/45 lava or rocks.
					choice = Math.random()
					if(choice>0.45){
						tileMap[i][j].image = rockBlock; 
					}else{
						tileMap[i][j].image = lavaBlock; 
					}
				//Lava is generated only after the first 1/2 of the map until the end. It is more common futher down and very rare.
			}
		}
	}
}
}

//Generate Map Randomly.
function GenerateMap(){
	canvas = getCanvas();
	for(var i=0;i<ROWS;i++){
		for(var j=0;j<COLS;j++){
			choice = parseInt(Math.random()*4);//Choose a random number from 0 to 3
			//0 is empty, so it's it's not 0 make a block.
			if(choice!=0){
				tileMap[i][j] = new Block(i,j,choice);
			}else{
				tileMap[i][j] = 0;
			}
		}
	}
}