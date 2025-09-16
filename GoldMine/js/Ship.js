
function Ship(){
	//Load Ships images. (Left, Right, Up, Down)
	this.imgShipL = new Image();
	this.imgShipL.src = "imgs/ShipL.png";
	this.imgShipR = new Image();
	this.imgShipR.src = "imgs/ShipR.png";
	this.imgShipU = new Image();
	this.imgShipU.src = "imgs/ShipU.png";
	this.imgShipD = new Image();
	this.imgShipD.src = "imgs/ShipD.png";
	//booleans to show what way the ship faces.
	this.Left = true;
	this.Right = true;
	this.Up = true;
	this.Down = true;
	this.x = 270; //The X and Y pos.
	this.y = 105; 
	this.acc=0.97; // The higher the faster the Ship accelerates
	this.xSpeed = 0.0;
	this.ySpeed = 0.0;
	this.armor = 1.0; //The higher the lass damage taken when falling.
	this.power = 1.0; //The higher the faster the Ship can dig.
	this.backPack = 10; //The larger the more the Ship can carry.
	this.fullNotice = false;
	this.textAlpha = 1;

	this.Event = function() {
		this.xSpeed*=this.acc;//friction
		this.ySpeed*=this.acc;//friction
		MapX+=this.xSpeed;
		MapY+=this.ySpeed;
		if(this.ySpeed>-15) this.ySpeed-=GRAVITY;//gravity
		if(intersect(this, Gas,80)) {//If player is next to GasStation and presses Space, re-fill fuel.
			Gas.image = gasStation_fill;
			if(SPACE){Fuel+=5;}
		} else {
			Gas.image = gasStation;
		}
		if(intersect(this, Trade,80)) {//If player is next to TradeStation and presses Space, sell items and empty inv.
			Trade.image = tradeStation_sell;
			if(SPACE) {
				Cash+= 10*COPPER + 30*IRON + 80*SILVER + 200*GOLD; 
				STORAGE=0; 
				COPPER=0;IRON=0;SILVER=0;GOLD=0;
				localStorage.setItem('goldmine_save', JSON.stringify({
					"Cash": Cash,
					"UpgradeArray": UpgradeArray
				}))
			}
		} else {
			Trade.image = tradeStation;
		}
		if(intersect(this, Shop,80)) {//If player is next to TradeStation and presses Space, sell items and empty inv.
			Shop.image = shopStation_shop;
			if(SPACE) Menu.active = true;
		} else {
			Shop.image = shopStation;
		}

		//If user pressed LEFT then move left and make the image left.
		if(LEFT && MapX<270) {
			DigCountR, DigCountD = 0;
			if(this.xSpeed < 11 && this.xSpeed > -11) this.xSpeed++;//Move Left
			this.Left=true
			if(this.xSpeed>0 && !UP) canvas.drawImage(this.imgShipL, this.x, this.y);
		}
		//If user pressed RIGHT, we don't want to be drawing left and right at the same time.
		else if(RIGHT && MapX> -(SIZE*COLS-220)){
			DigCountL, DigCountD = 0;
			if(this.xSpeed<11 && this.xSpeed>-11) this.xSpeed--;//Move Right
			this.Right=true;
			if(this.xSpeed<0 && !UP) canvas.drawImage(this.imgShipR, this.x, this.y);
		}
		
		//If the user pressed UP
		if(UP){
			DigCountL, DigCountR, DigCountD = 0;
			if(this.ySpeed<FanPower) this.ySpeed+=2;
			canvas.drawImage(this.imgShipU, this.x, this.y);
			this.Up = true;
		}

		//If the user pressed DOWN
		if(DOWN) {
			this.xSpeed*=0.5; //Slow down xSpeed;
			DigCountL, DigCountR = 0;
			if(this.ySpeed<4 && this.ySpeed>-4) this.ySpeed--; //Move Down
			canvas.drawImage(this.imgShipD, this.x, this.y);
			this.Down = true;
		} else {
			if(this.xSpeed>=0) canvas.drawImage(this.imgShipL, this.x, this.y); 
			else if(this.xSpeed<0) canvas.drawImage(this.imgShipR, this.x, this.y); 
		}
		if(MapX>270) this.xSpeed=-1; 
		if(MapX<-(SIZE*COLS-310)) this.xSpeed=1;
		if(this.fullNotice) {
			this.textAlpha -= 0.025
			canvas.font = "14px Arial";
			canvas.fillStyle = "rgba(255, 0, 0, "+this.textAlpha+")";
			canvas.fillText("Storage Full", ship.x - 18, ship.y - 10);
			if(this.textAlpha < 0) {
				this.textAlpha = 1;
				this.fullNotice = false;
			}
		}
	}
}

var ship = new Ship();

function addToPack(item){
	if(STORAGE<UpgradePowers[1]){
		if(item.image==copperOre_Hit3){
			if(STORAGE<UpgradePowers[1]){
				STORAGE++;
				COPPER++;
				}
		}
		if(item.image==ironOre_Hit3){
			if(STORAGE<UpgradePowers[1]){
				STORAGE++;
				IRON++;
			}
		}
		if(item.image==silverOre_Hit3){
			if(STORAGE<UpgradePowers[1]){
				STORAGE++;
				SILVER++;
			}
		}
		if(item.image==goldOre_Hit3){
			if(STORAGE<UpgradePowers[1]){
				STORAGE++;
				GOLD++;
			}
		}
		if(STORAGE == UpgradePowers[1]) ship.fullNotice = true;
	//If item dug was an ore and storage is full say that storage is full.
	} else if(item.image==copperOre_Hit3 || item.image==ironOre_Hit3 || item.image==silverOre_Hit3 || item.image==goldOre_Hit3){
		ship.fullNotice = true;
	}
}

//Dig Paths on map based on the WHITE space. Intensity will be a float determining how much ground is dug. the float needs to be a number between 0 and 1.
function DigPaths(intensity){// This is OK to be seperate since it only happens once.
	//If the user enters a number higher or lower than conditions adjust.
	if(intensity>1){intensity=1;}
	if(intensity<0){intensity=0;}
	//anything over 0.25 does not make sense, adujust the input by /4.
	intensity = intensity/4;
	for(var i=0;i<ROWS;i++){
		for(var j=0;j<COLS;j++){
			if(tileMap[i][j]==0){//tile to check needs to be blank
				if(i>0 && j>0 && i<ROWS-1 && j<COLS-1){//tile must NOT be an edge tile, otherwise neighboors will not exsit
					if(tileMap[i+1][j]!=0 || tileMap[i-1][j]!=0 || tileMap[i][j+1]!=0 || tileMap[i][j-1]!=0){//If one of it's neighboors isn't blank, make one of them blank.
						//Randomly choose a neighboor and make it's cell blank.
						choice = Math.random();
						if(choice<=intensity){tileMap[i+1][j]=0}// based on intensity% change per cell. Change the cell to blank.
						else if(choice<=intensity*2){tileMap[i-1][j]=0}
						else if(choice<=intensity*3){tileMap[i][j+1]=0}
						else if(choice<=intensity*4){tileMap[i][j-1]=0}
					}
				}
			}
		}
	}
}