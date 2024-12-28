//jsthree box test, arrow keys to move.
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth-30, window.innerHeight-30);
document.body.appendChild(renderer.domElement);

var geometry = new THREE.CubeGeometry(1,1,1);
var material = new THREE.MeshBasicMaterial({
    color: 0x0000dd, 
    shading:  THREE.FlatShading, 
    vertexColors: THREE.FaceColors 
});
var cube = new THREE.Mesh(geometry, material);
cube.geometry.faces[0].color.setRGB(1,0.5,0.5);
cube.geometry.faces[1].color.setRGB(1,0.5,0.5);
cube.geometry.faces[4].color.setRGB(1,0.8,0.8);
cube.geometry.faces[5].color.setRGB(1,0.8,0.8);
scene.add(cube);

camera.position.z = 2;

render = function () {
	requestAnimationFrame(render);
	renderer.render(scene, camera);
};

render();

document.addEventListener("keydown", function(e) { 
    if(e.keyCode == 37) cube.rotation.y -= 0.1;
    else if(e.keyCode == 38) cube.rotation.x -= 0.1;
    else if(e.keyCode == 39) cube.rotation.y += 0.1;
    else if(e.keyCode == 40) cube.rotation.x += 0.1;
});
