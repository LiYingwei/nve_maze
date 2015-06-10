
if (!Detector.webgl) Detector.addGetWebGLMessage();

var container, stats, control;

var camera, scene, renderer, objects;
var particleLight;
var mesh;

var mouseX = 0, mouseY = 0;
var halfWidth = window.innerWidth, halfHeight = window.innerHeight;

var myX = 0, myY = 0, myZ = 0, theta = 0, speed = 0.3;

var clock = new THREE.Clock();

init();
animate();

function init() {

	container = document.createElement('div');
	document.body.appendChild(container);
	
	myX = 0;
	myY = 2;
	myZ = 0.75;
	
	camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 2000);
	camera.position.set(myX, myY, myZ);
	camera.lookAt({x:1,y:2,z:0.75});
	camera.lookAt({x:myX+Math.cos(theta),y:myY+Math.sin(theta),z:myZ});
	camera.up.x = 0;
	camera.up.y = 0;
	camera.up.z = 1;
	scene = new THREE.Scene();
	
	//control

	control = new THREE.FirstPersonControl(camera);
	
	
	//render
	 
	renderer = new THREE.WebGLRenderer({antialias : true});
	renderer.setClearColor(0x000000);
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.sortObjects = true;
	
	container.appendChild(renderer.domElement);
	//Materials
//////////////////////////////////////////////////////////////////////////////////
	var MaxX=22,MaxY=22;

	var texture = THREE.ImageUtils.loadTexture('img/mu1.jpg', {}, function() {
		renderer.render(scene, camera);
	});

	var texture2 = THREE.ImageUtils.loadTexture('img/grass.png', {}, function() {
		renderer.render(scene, camera);
	});
	var material = new THREE.MeshLambertMaterial({map: texture2});
	
	for(var i=0;i<MaxX;i++){
		for(var j=0;j<MaxY;j++)if(Map[i][j])
		draw(scene,material,i,j);
	}

	var planematerial=new THREE.MeshLambertMaterial({
		//emissive: 0xffffaa00,
		map:texture
	});
	var plane = new THREE.Mesh(new THREE.PlaneGeometry(MaxX*2, MaxY*2), planematerial);
	plane.position.set(MaxX/2,MaxY/2,0);
	scene.add(plane);

//////////////////////////////////////////////////////////////////////////////////
	//Geometry

	//Lights

	//particleLight = new THREE.Mesh(new THREE.SphereGeometry(4, 8, 8), new THREE.MeshBasicMaterial({color : 0xffffff}));

	scene.add(new THREE.AmbientLight(0xffffff));

//	var directionalLight = new THREE.DirectionalLight(0xffffff, 3);
//	directionalLight.position.set(100, 100, -100);
//	scene.add(directionalLight);
	
	//var pointLight = new THREE.PointLight(0xffffff, 2, 2000);
	//particleLight.add(pointLight);

	//stats
 
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	
	container.appendChild(stats.domElement);
	
	//WindowResize

	EventUtil.addHandler(window, "resize", onWindowResize);
	
}

function draw(scene, material, x , y) {
	var cube = new THREE.Mesh(new THREE.CubeGeometry(1, 1, 3),material);
	cube.position.set( x , y , 0 );
	scene.add(cube);
}

function onWindowResize(event) {
	event = EventUtil.getEvent(event);
	
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	
	renderer.setSize(window.innerWidth, window.innerHeight);
	
	control.handleResize();
}

function animate() {
	
	requestAnimationFrame(animate);
	
	render();
	stats.update();

}

function render() {
/*
	camera.position.set(myX, myY, myZ);
	camera.up.x = 0;
	camera.up.y = 0;
	camera.up.z = 1;
	camera.lookAt({x:myX+Math.cos(theta),y:myY+Math.sin(theta),z:myZ});
*/
	control.update(clock.getDelta());
	renderer.render(scene, camera);

}

