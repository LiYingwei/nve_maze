
if (!Detector.webgl) Detector.addGetWebGLMessage();
/*
var EventUtil = {

	addHandler: function(element, type, handler) {
		if (element.addEventListener) {
			element.addEventListener(type, handler, false);
		} else if (element.attachEvent) {
			element.attachEvent("on" + type, handler);
		} else {
			element["on" + type] = handler;
		}
	},
	
	getEvent: function(event) {
		return event ? event : window.event;
	},
	
	getTarget: function(event) {
		return event.target || event.srcElement;
	}

};
*/
var container, stats;

var camera, scene, renderer, objects;
var particleLight;
var mesh;
var controls;

var mouseX = 0, mouseY = 0;
var halfWidth = window.innerWidth / 2, 
	halfHeight = window.innerHeight / 2;

//var myX = 0, myY = 0, myZ = 0;
var theta = 0;

var clock = new THREE.Clock();

init();
animate();

function init() {
	
	container = document.createElement('div');
	document.body.appendChild(container);
	
	//myX = 0;
	//myY = 0.75;
	//myZ = 2.00;
	
	camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
	camera.position.set(myX, myY, myZ);
	//camera.lookAt({x:myX+Math.cos(theta),y:myY+Math.sin(theta),z:myZ});
	scene = new THREE.Scene();
	
	//controls
	control = new THREE.FirstPersonControl(camera);
	
	//render
	 
	renderer = new THREE.WebGLRenderer({antialias : true});
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.sortObjects = true;
	
	container.appendChild(renderer.domElement);
	//Materials
//////////////////////////////////////////////////////////////////////////////////
	renderer.setClearColor(0x000000);

	var texture = THREE.ImageUtils.loadTexture('img/mu1.jpg', {}, function() {
		renderer.render(scene, camera);
	});

	var texture2 = THREE.ImageUtils.loadTexture('img/image4.jpg ', {}, function() {
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
	
	var planeGeo = new THREE.PlaneGeometry(MaxX*2, MaxY*2);
	//planeGeo.normal = new THREE.Vector3(1,1,1);

	var plane = new THREE.Mesh(planeGeo, planematerial);
	plane.position.set(MaxX/2,0,MaxY/2);

	plane.rotation.x -= Math.PI/2;
	scene.add(plane);

//////////////////////////////////////////////////////////////////////////////////

	//Background
	var materials = [

		new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'img/px.jpg' ) } ), // right
		new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'img/nx.jpg' ) } ), // left
		new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'img/py.jpg' ) } ), // top
		new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'img/ny.jpg' ) } ), // bottom
		new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'img/pz.jpg' ) } ), // back
		new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'img/nz.jpg' ) } )  // front

	];

	mesh = new THREE.Mesh( new THREE.BoxGeometry( 1000, 1000, 1000, 7, 7, 7 ), new THREE.MeshFaceMaterial( materials ) );
	mesh.scale.x = - 1;
	scene.add(mesh);
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
	var cube = new THREE.Mesh(new THREE.CubeGeometry(1, 3, 1),material);
	cube.position.set( x , 0 , y );
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

	control.update(clock.getDelta());
	renderer.render(scene, camera);

}

function onDocumentMouseMove(event) {
	event = EventUtil.getEvent(event);
	mouseX = event.clientX;
}

/*

首先是javascript,webgl,threejs的基本知识
然后我们要有一个迷宫（迷宫如何生成，最好是能每次都不一样的，随机dfs，生成树）
要有一个能移动的camera（第一人称控制怎么实现，三维坐标系->球坐标系）
然后我们要有一个背景

碰撞检测
设定迷宫起点
迷宫材质
自动生成迷宫
迷宫通道宽度
视野
天空背景 get
第一人称控制 get
*/
