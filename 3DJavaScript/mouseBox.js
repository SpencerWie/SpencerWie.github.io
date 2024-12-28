// THREEJS Test, draw the mouse while holding the left button to move the screen


var leftButton = false;
var oldMouseX, oldMouseY;

var xAxis = new THREE.Vector3(1,0,0);
var yAxis = new THREE.Vector3(0,1,0);

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth-30, window.innerHeight-30);
document.body.appendChild(renderer.domElement);

var geometry = new THREE.CubeGeometry(1,1,1);
var material = new THREE.MeshLambertMaterial({
    color: 0x0000dd,  
    shading: THREE.FlatShading
});
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 2;

// add subtle blue ambient lighting
var ambientLight = new THREE.AmbientLight(0x000020);
scene.add(ambientLight);

var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
directionalLight.position.set( 1, 1, 1 );
scene.add( directionalLight );

render = function () {
	requestAnimationFrame(render);
	renderer.render(scene, camera);
};

render();

document.addEventListener("mousemove", function(e) { 
    if(leftButton){
        rotateAroundWorldAxis(cube, yAxis, -(oldMouseX - e.clientX)/100);
        rotateAroundWorldAxis(cube, xAxis, -(oldMouseY - e.clientY)/100);
    }
    oldMouseX = e.clientX 
    oldMouseY = e.clientY;
});

document.addEventListener("mousedown", function(e) {
    leftButton = true;
});

document.addEventListener("mouseup", function(e) {
    leftButton = false;
});

// Source: http://stackoverflow.com/questions/11060734/how-to-rotate-a-3d-object-on-axis-three-js
function rotateAroundWorldAxis(object, axis, radians) {
    rotWorldMatrix = new THREE.Matrix4();
    rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);
    rotWorldMatrix.multiplySelf(object.matrix);              
    object.matrix = rotWorldMatrix;
    object.rotation.setEulerFromRotationMatrix(object.matrix);
}
