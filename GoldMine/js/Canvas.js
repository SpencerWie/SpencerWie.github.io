//*********************************************************************************************************************************************************************
//V 0.8 - Added Copper, Iron, Silver, Gold ores, Fuel Station, Sell Station. Mining functions added. Flying function added.
//V 0.9 - Added Shop station. Map size increased, dynamic map added. Added Lava Block, Rock Block. Added Sky and Ground gradiant background. Added Cash system.
//V 1.0 - Collision detection improved. Digging bugs fixed, lava generator fixed, sky bug fixed, boundry bug fixed. Added Into, diamond Block, Information box. Upgrade system adjusted. Added game end.
//V 1.02 - Graphics cleaned. Death glitch fixed. IE bug fixed (didn't support console.log() function and crashed)
//V 1.05 - reload now works in IE. Graphic bug fixed. Music now supported in FireFox. (added ogg file)
//V 1.06 - Many longated code blocks have been condensed. In particually the around ~140 [if-else if-else] code block has been reduced to less than 10 lines.
//V 1.1 - Blocked updated based on distance, Code is now much fasters ~2x less CPU use.
//*********************************************************************************************************************************************************************
//**Tested Browsers: IE9, FireFox 20, Chrome. BEST: Chrome , DECENT: IE (may crash), SLOW,: FireFox. Please use Chrome for best performance and display. Both FireFox and IE do not render the tile Array completely right, leaving "white-space". IE9> runs the game at a good speed. FireFox had a smaller FPS than opimized and randomly lagged.**//
//#TileMap Data 0=None, 1=dirt1, 2=dirt2, 3=dirt3.
var Key=0;//For storing the keycode on press.
var ship; // Your Ship.
//Large Amount of memory needed. An array of 8000 simple objects(Blocks) are created on a 200x40 sheet. *This was too much for my computer per update, the array changed to 180x22 so around 4000 simple objects instead, which the computer does not have a problem with.
//*Feel free to change ROWS and COLS, the game will adjust accordingly. Remember it makes at most ROWS*COLS blocks, too high of values will slow down the game.
var ROWS = 180;//180
var COLS = 24;//22
var SIZE = 40;//Don't change this. 
var WIDTH = SIZE*COLS;
var HEIGHT = SIZE*ROWS;
//Boolean Key vars for multi-key detection
var LEFT=false;
var RIGHT=false;
var UP = false;
var DOWN = false;
var SPACE = false;
var MouseX=0;
var MouseY=0;
//DigCounts are the number of times the user needs to hit a block in order to dig into it. This is so the user does not dig the second it touches a block.
var DigCountL=0
var DigCountR=0
var DigCountU=0
var DigCountD=0
//Ores
COPPER=0;
IRON=0;
SILVER=0;
GOLD=0;
//Storage.
STORAGE=0;
MAX_STORAGE=5;//5 Init storage
//This is the X and Y for the map, the map will be drawn differently based on the manipulation of these values.
var MapX = 0;
var MapY = 30;
//Ship global vars
var DrillPower = 1.5;//1.5 Init Drill
var FanPower = 10;
var Fuel = 110.0;
var Max_Fuel = 110.0; // 110.0 Init Drill
var dropRate = 0.10;// This is how slow/fast your fuel goes down. The higher the faster.
var Cash = 50;//50 Init Cash
var DrillUpgrade=0;
var StorageUpgrade=0;
var FuelUpgrade=0;
var UpgradeArray = new Array(DrillUpgrade, StorageUpgrade, FuelUpgrade);
//Drill--Storage--Fuel.
var UpgradeIncrements = [[1.75,2.0,2.25,2.5,2.75,3.0,4.0],[7.0,10.0,12.0,15.0,18.0,20.0,23.0],[130.0,150.0,200.0,250.0,300.0,400.0,505.0]];
var UpgradePowers = [DrillPower,MAX_STORAGE,Max_Fuel];
//Global Constants
var GRAVITY = 0.5;//This is the acc of gravity. Higher the stronger.
var ReLoad = false;
var ctx;

//Create Dynamic Canvas
function makeCanvas() {
	var canvas = document.createElement('canvas');
	canvas.id = "Canvas";
	canvas.width = 580;
	canvas.height = 300;
	canvas.style.background = "#443322";
	document.body.appendChild(canvas);
	document.getElementById("Canvas").innerHTML = "Loading Blocks...";
    ctx = document.getElementById("Canvas").getContext("2d");
}
makeCanvas();

//To clear the canvas
function clearCanvas(){
    var infoCanvas = document.getElementById("Canvas");
    var tempCanvas = getCanvas();
	//Fill OutofMap Background.
    tempCanvas.fillStyle = "#111111";
    tempCanvas.fillRect(0,0,infoCanvas.width,infoCanvas.height)
	//Fill Map Lighting.
	var my_gradient=tempCanvas.createLinearGradient(MapX,MapY-1600,MapX,MapY+SIZE*ROWS);
	my_gradient.addColorStop(0.07,"#111111");//Black (Space)
	my_gradient.addColorStop(0.10,"#FFFFFF");//White (Light Sky)
	my_gradient.addColorStop(0.15,"#3790E8");//Blue (Sky)
	my_gradient.addColorStop(0.26,"#443322");//Brown (UnderGround)
	my_gradient.addColorStop(0.60,"#000000");//Black (Deep UnderGround)
	my_gradient.addColorStop(0.80,"#330000");//Dark Red (Very Deep UnderGround)
	my_gradient.addColorStop(1,"#b00000");//Dark Red (Very Deep UnderGround)
	tempCanvas.fillStyle=my_gradient;
	tempCanvas.fillRect(MapX,MapY-800,COLS*SIZE,SIZE*ROWS+1000);
	//Adjust value of Fuel.
	Fuel-=dropRate;
	if(Fuel<0){Fuel=0;Reset();}
	if(Fuel>UpgradePowers[2]){Fuel=UpgradePowers[2];}
}

//To draw on Canvas.
function getCanvas(){
    if(ctx) return document.getElementById("Canvas").getContext("2d");
    ctx = document.getElementById("Canvas").getContext("2d");
    return ctx;
}

function musicPlay() {
    document.getElementById('music').play();
    document.removeEventListener('click', musicPlay);
}


//Control Keyboard input. (onkeydown for arrow, onkeypress for ASWD)
document.onkeydown = function(e){
	//On press get the key
    var char = e.charCode || e.keyCode;
    Key = char;
	if(Key==37 || Key==97){LEFT=true;}
	if(Key==39 || Key==100){RIGHT=true;}
	if(Key==38 || Key==119){UP=true;}
	if(Key==40 || Key==115){DOWN=true;}
	if(Key==32){SPACE=true;}
}

document.onkeyup = function(e){
	//On press get the key set the Key to nothing(0). Or at least one we don't check.
    var char = e.charCode || e.keyCode;
    Key = char;
	if(Key==37 || Key==97){LEFT=false;}
	if(Key==39 || Key==100){RIGHT=false;}
	if(Key==38 || Key==119){UP=false;}
	if(Key==40 || Key==115){DOWN=false;}
	if(Key==32){SPACE=false;}
	
	if(Key==73 && InfoMenu.active==false){InfoMenu.active=true;/*console.log("Information In ");*/}
	else if(Key==73 && InfoMenu.active==true){InfoMenu.active=false;/*console.log("Information Out ");*/}
}

document.onmousemove = function(e){
	//get mouse position on page then subtract canvas pos.
	canvas = document.getElementById("Canvas")
    MouseX = e.clientX - canvas.offsetLeft;
    MouseY = e.clientY - canvas.offsetTop;
}


function Reset(){
if(!ReLoad){
alert("You Died!");
location.reload("goldMine.html");
ReLoad=true;
}
}

function distance(obj1,obj2){ // Get distance as effiecent as possible.
    return Math.sqrt(((obj2.x-obj1.x)*(obj2.x-obj1.x))+((obj2.y-obj1.y)*(obj2.y-obj1.y)));
}

//Remove loader
document.getElementById("loader").innerHTML = ""