//Buildings
function GasStation(x,y,image){
	this.x = x;
	this.y = y;
	this.image = image;
this.Draw = function(){
	canvas = getCanvas();
	this.x = MapX+190;
	this.y = MapY+40;
	canvas.drawImage(this.image, this.x, this.y);		
	}
}

function TradeStation(x,y,image){
	this.x = x;
	this.y = y;
	this.image = image;
this.Draw = function(){
	canvas = getCanvas();
	this.x = MapX+450;
	this.y = MapY+40;
	canvas.drawImage(this.image, this.x, this.y);		
	}
}

function ShopStation(x,y,image){
	this.x = x;
	this.y = y;
	this.image = image;
this.Draw = function(){
	canvas = getCanvas();
	this.x = MapX+650;
	this.y = MapY+40;
	canvas.drawImage(this.image, this.x, this.y);		
	}
}

function ShopMenu(x,y,image){
	this.x = 190;
	this.y = -200;
	this.active = false;
	this.image = image;
    var PRICE = new Array(100,150,200,300,500,800,1500,"MAX");
    var TextPos = [[270,80],[287,130],[270,175]];

    this.Draw = function() {
        var canvas = getCanvas();
        canvas.drawImage(this.image, this.x, this.y);		
    }
    this.Event = function() {
        if(Key==88 && this.active){//If space or clicked on "X". Hide this an make it in-active
            this.active=false;
        }
        if(this.active){
            this.y=50;
            Fuel+=dropRate;
            ship.xSpeed=0;ship.ySpeed=0;
        }
        if(!this.active){
            this.y=-200;
        }
        if(this.active){
            //If mouse is over the X, change the image to shopMenu_X
            if(MouseX>382 && MouseX<410 && MouseY<72 && MouseY>52){
                this.image = shopMenu_X;
            }//IF mouse is over the first + than change the image to shopMenu_1..etc...
            else if(MouseX>372 && MouseX<397 && MouseY<102 && MouseY>82){
                this.image = shopMenuArray[0];
            }
            else if(MouseX>372 && MouseX<397 && MouseY<152 && MouseY>132){
                this.image = shopMenuArray[1];
            }
            else if(MouseX>372 && MouseX<397 && MouseY<202 && MouseY>172){
                this.image = shopMenuArray[2];
            }else{
                this.image = shopMenu;
            }
            //Based on the users upgrades. Draw a red square over the current item the user has.
            //Drill
            tempCanvas.beginPath();
            tempCanvas.rect(197+UpgradeArray[0]*20,82,20,20);
            tempCanvas.lineWidth = 1;
            tempCanvas.strokeStyle = "#FF0000";
            tempCanvas.stroke();
            tempCanvas.beginPath();
            //Storage
            tempCanvas.rect(197+UpgradeArray[1]*20,132,20,20);
            tempCanvas.lineWidth = 1;
            tempCanvas.strokeStyle = "#FF0000";
            tempCanvas.stroke();
            //Fuel
            tempCanvas.rect(197+UpgradeArray[2]*20,177,20,20);
            tempCanvas.lineWidth = 1;
            tempCanvas.strokeStyle = "#FF0000";
            tempCanvas.stroke();
            //Based on the users upgrades. Show how much it cost for the next upgrade.
            tempCanvas.font="10px Arial";
            for(var i=0;i<3;i++){
                for(var j=0;j<PRICE.length;j++){
                    if(UpgradeArray[i]==j){
                        tempCanvas.fillText("Cost: "+PRICE[j],TextPos[i][0],TextPos[i][1]);
                        break;
                    }
                }
            }
        }
    }
}

//For the Shop Menu.
document.onmouseup = function(e){
	if(Menu.image == shopMenu_X){
		Menu.active=false;
	}
	if(InfoMenu.image == infoMenu_X){
		InfoMenu.active=false;
		document.addEventListener('click', musicPlay);
	}
	if(infoIcon.image == info_icon_X){
		if(InfoMenu.active==true){InfoMenu.active=false;}
		else if(InfoMenu.active==false){InfoMenu.active=true;}
	}
	//Since these are IF/ELSE IF statements it can't be looped singely. All IF statements will keep buying until the you run out of money on a single click.
	for(var i=0; i<UpgradeArray.length;i++){
		if(Menu.image == shopMenuArray[i]){//console.log("1")//if hit Upgrade Drill
			for(var j=0;j<PRICE.length;j++){
				if(UpgradeArray[i]==j && Cash>=PRICE[j]){
					UpgradeArray[i]++;Cash-=PRICE[j];UpgradeStats();break;
				}
			}
		}
	}
}

function Information(x,y,image){
	this.x = 185;//90
	this.y = -200;//-200
	this.image = image;
	this.active = true;
	this.Draw = function(){
		canvas = getCanvas();		

		if(this.active){
			this.y=50;
			Fuel+=dropRate;
			ship.xSpeed=0;ship.ySpeed=0;
		}
		if(!this.active){
			this.y=-200;
		}
		if(this.active){
			if(MouseX>380 && MouseX<405 && MouseY<72 && MouseY>52){
				this.image = infoMenu_X;
			}else{
				this.image = infoMenu;
			}
		}
		canvas.drawImage(this.image, this.x, this.y);
	}
}

function InfoIcon(x,y,image){
	this.x = 378;
	this.y = 2;
	this.image = image;
	this.Draw = function() {
		canvas = getCanvas();
		var canvasWidth = document.getElementById("Canvas").width;
		this.x = canvasWidth - 25;
		if(MouseX>canvasWidth - 25 && MouseX< canvasWidth-2 && MouseY<22 && MouseY>2) {
			this.image = info_icon_X;
		} else {
			this.image = info_icon;
		}
		canvas.drawImage(this.image, this.x, this.y);
	}
}

function generateBuildings(){
	Gas = new GasStation(MapX,MapY,gasStation);
	Trade = new TradeStation(MapX,MapY,tradeStation);
	Shop = new ShopStation(MapX,MapY,shopStation);
	Menu = new ShopMenu(50,-200,shopMenu);
	InfoMenu = new Information(50,-200,infoMenu);
	infoIcon = new  InfoIcon(50,-200,info_icon);
}

function UpgradeStats(){
	//The arrays within the UpgradeArray have double the elements plus an extra, so thats why *2+1.
	for(var i=0;i<UpgradeArray.length;i++){
		for(var j=0;j<UpgradeArray.length*2+1;j++){
			if(UpgradeArray[i]==j+1){UpgradePowers[i]=UpgradeIncrements[i][j];}
		}
	}
}