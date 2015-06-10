
if (!Detector.webgl) Detector.addGetWebGLMessage();

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

var container, stats;

var camera, scene, renderer, objects;
var particleLight;
var mesh;

var mouseX = 0, mouseY = 0;
var halfWidth = window.innerWidth / 2, halfHeight = window.innerHeight / 2;

//var myX = 0, myY = 0, myZ = 0;
var theta = 0, speed = 0.3;

var moveSpeed;
var	moveForward = false,
	moveBackward = false,
	moveLeft = false,
	moveRight = false,
	moveUp = false,
	moveDown = false;
	lookLeft = false;
	lookRight = false;
	lookUp = false;
	lookDown = false;
	
var clock = new THREE.Clock();

init();
animate();

function init() {
	
	container = document.createElement('div');
	document.body.appendChild(container);
	
	//myX = 0;
	//myY = 0.75;
	//myZ = 1.00;
	
	moveSpeed = 2;
	
	camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
	camera.position.set(myX, myY, myZ);
	//camera.lookAt({x:1,y:2,z:1.0});
	//camera.lookAt({x:myX+Math.cos(theta),y:myY+Math.sin(theta),z:myZ});
	scene = new THREE.Scene();
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

	var texture2 = THREE.ImageUtils.loadTexture('img/image4.jpg', {}, function() {
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
	planeGeo.normal = new THREE.Vector3(1,1,1);

	var plane = new THREE.Mesh(planeGeo, planematerial);
	plane.position.set(MaxX/2,0,MaxY/2);

	plane.rotation.x -= Math.PI/2;
	scene.add(plane);

	var sphereGeometry = new THREE.SphereGeometry( 0.3);
	var sphereMaterial = new THREE.MeshNormalMaterial( { overdraw: 0.5 } );
	var sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
	sphereMesh.position.set(endX,endY,endZ);
	scene.add(sphereMesh);
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
	
	//
	EventUtil.addHandler(window, "mousemove", onDocumentMouseMove);
	
	EventUtil.addHandler(window, "keydown", onKeyDown);

	EventUtil.addHandler(window, "keyup", onKeyUp);
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
	update(clock.getDelta());
	renderer.render(scene, camera);

}

function onDocumentMouseMove(event) {
	event = EventUtil.getEvent(event);
	mouseX = event.clientX;
}
/*
function moveForward() {
	myX += speed * Math.cos(theta);
	myY += speed * Math.sin(theta);
}
function moveBackward() {
	myX -= speed * Math.cos(theta);
	myY -= speed * Math.sin(theta);
}
function moveLeft() {
	myX += speed * Math.cos(theta+Math.PI/2);
	myY += speed * Math.sin(theta+Math.PI/2);
}
function moveRight() {
	myX += speed * Math.cos(theta-Math.PI/2);
	myY += speed * Math.sin(theta-Math.PI/2);
}
*/
/*
function onDocumentKeyDown(event) {
	event = EventUtil.getEvent(event);
	
	switch (event.keyCode) {
		case 87 : moveForward();break;//W
		case 65 : moveLeft();break;//A
		case 68 : moveRight();break;//D
		case 83 : moveBackward();break;//S
	}
}
*/
function onKeyDown ( event ) {
	event = EventUtil.getEvent(event);
	//event.preventDefault();
	switch ( event.keyCode ) {

		case 38: /*up*/ lookUp = true; break;
		case 87: /*W*/  moveForward = true; break;

		case 37: /*left*/ lookLeft = true; break;
		case 65: /*A*/  moveLeft = true; break;

		case 40: /*down*/ lookDown = true; break;
		case 83: /*S*/  moveBackward = true; break;

		case 39: /*right*/ lookRight = true; break;
		case 68: /*D*/  moveRight = true; break;

		case 82: /*R*/  moveUp = true; break;
		case 70: /*F*/  moveDown = true; break;

	}

}

function onKeyUp( event ) {
	event = EventUtil.getEvent(event);
	switch ( event.keyCode ) {

		case 38: /*up*/ lookUp = false; break;
		case 87: /*W*/ moveForward = false; break;

		case 37: /*left*/ lookLeft = false;
		case 65: /*A*/ moveLeft = false; break;

		case 40: /*down*/ lookDown = false; break;
		case 83: /*S*/ moveBackward = false; break;

		case 39: /*right*/ lookRight = false; break;
		case 68: /*D*/  moveRight = false; break;

		case 82: /*R*/  moveUp = false; break;
		case 70: /*F*/  moveDown = false; break;

	}
}

function update(delta) {
		
		var actualMoveSpeed = delta *  moveSpeed;

		myX = camera.position.x;
		myZ = camera.position.z;
		
		var tx = Math.round(myX+0.1*Math.cos(theta)),
			ty = Math.round(myZ-0.1*Math.sin(theta));
		if (!(0 <= tx && tx < MaxX && 0 <= ty && ty < MaxY) || Map[tx][ty] === 0) {

			if (  moveForward )  camera.translateZ( - ( actualMoveSpeed ) );
		}
			
			tx = Math.round(myX-0.1*Math.cos(theta)),
			ty = Math.round(myZ+0.1*Math.sin(theta));
		if (!(0 <= tx && tx < MaxX && 0 <= ty && ty < MaxY) || Map[tx][ty] === 0) {
			if (  moveBackward )  camera.translateZ( actualMoveSpeed );
		}	
		
		//	tx = Math.round(myX+0.1*Math.cos(theta-Math.PI/2)),
		//	ty = Math.round(myZ-0.1*Math.sin(theta-Math.PI/2));
		//if (!(0 <= tx && tx < MaxX && 0 <= ty && ty < MaxY) || Map[tx][ty] === 0) {
			if (  moveLeft )  camera.translateX( - actualMoveSpeed );
		//}
		//	tx = Math.round(myX+0.1*Math.sin(theta+Math.PI/2)),
		//	ty = Math.round(myZ-0.1*Math.cos(theta+Math.PI/2));
		//if (!(0 <= tx && tx < MaxX && 0 <= ty && ty < MaxY) || Map[tx][ty] === 0) {
			if (  moveRight )  camera.translateX( actualMoveSpeed );
		//}
		
		if (  moveUp )  camera.translateY( actualMoveSpeed );
		if (  moveDown )  camera.translateY( - actualMoveSpeed );

		if (lookLeft) theta += 0.1;
		if (lookRight) theta -= 0.1;

		//tmp = (mouseX - halfWidth)/1200.0;
		//theta -= tmp*tmp*tmp;

		
		targetPosition = {x:myX+100*Math.cos(theta),y:myY,z:myZ-100*Math.sin(theta)};
		
		camera.lookAt(targetPosition);

}

/*
碰撞检测
设定迷宫起点
迷宫材质
自动生成迷宫
迷宫通道宽度
视野
天空背景
*/
