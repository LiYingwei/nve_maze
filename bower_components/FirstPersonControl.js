
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


THREE.FirstPersonControl = function (object, domElement) {

	this.object = object;
	this.domElement = (domElement !== undefined) ? domElement : document;

	this.target = new THREE.Vector3( 0, 0, 0 );
	
	this.moveSpeed = 2;
	this.lookSpeed = 0.125;
	
	this.moveForward = false;
	this.moveBackward = false;
	this.moveLeft = false;
	this.moveRight = false;

	this.lat = 0;
	this.lon = 0;
	this.phi = 0;
	this.theta = 0;

	this.viewHalfX = 0;
	this.viewHalfY = 0;

	this.mouseX = 0;
	this.mouseY = 0;

	this.onKeyDown = function ( event ) {
		event = EventUtil.getEvent(event);
		//event.preventDefault();
		switch ( event.keyCode ) {

			case 38: /*up*/
			case 87: /*W*/ this.moveForward = true; break;

			case 37: /*left*/
			case 65: /*A*/ this.moveLeft = true; break;

			case 40: /*down*/
			case 83: /*S*/ this.moveBackward = true; break;

			case 39: /*right*/
			case 68: /*D*/ this.moveRight = true; break;

			case 82: /*R*/ this.moveUp = true; break;
			case 70: /*F*/ this.moveDown = true; break;

		}

	};

	this.onKeyUp = function ( event ) {
		event = EventUtil.getEvent(event);
		switch ( event.keyCode ) {

			case 38: /*up*/
			case 87: /*W*/ this.moveForward = false; break;

			case 37: /*left*/
			case 65: /*A*/ this.moveLeft = false; break;

			case 40: /*down*/
			case 83: /*S*/ this.moveBackward = false; break;

			case 39: /*right*/
			case 68: /*D*/ this.moveRight = false; break;

			case 82: /*R*/ this.moveUp = false; break;
			case 70: /*F*/ this.moveDown = false; break;

		}

	};

	this.onMouseMove = function ( event ) {
		event = EventUtil.getEvent(event);

		if ( this.domElement === document ) {
			this.mouseX = event.pageX - this.viewHalfX;
			this.mouseY = event.pageY - this.viewHalfY;
		} else {
			this.mouseX = event.pageX - this.domElement.offsetLeft - this.viewHalfX;
			this.mouseY = event.pageY - this.domElement.offsetTop - this.viewHalfY;
		}
	};
	
	//
	this.handleResize = function () {

		if ( this.domElement === document ) {

			this.viewHalfX = window.innerWidth / 2;
			this.viewHalfY = window.innerHeight / 2;

		} else {

			this.viewHalfX = this.domElement.offsetWidth / 2;
			this.viewHalfY = this.domElement.offsetHeight / 2;

		}
	};
	//

	this.update = function(delta) {

		var actualMoveSpeed = delta * this.moveSpeed;

		if ( this.moveForward ) this.object.translateZ( - ( actualMoveSpeed ) );
		if ( this.moveBackward ) this.object.translateZ( actualMoveSpeed );

		if ( this.moveLeft ) this.object.translateX( - actualMoveSpeed );
		if ( this.moveRight ) this.object.translateX( actualMoveSpeed );

		if ( this.moveUp ) this.object.translateY( actualMoveSpeed );
		if ( this.moveDown ) this.object.translateY( - actualMoveSpeed );
		////

		var actualLookSpeed = delta * this.lookSpeed;

		this.lon += this.mouseX * actualLookSpeed;
		this.lat -= this.mouseY * actualLookSpeed;

		this.lat = Math.max( - 85, Math.min( 85, this.lat ) );
		this.phi = THREE.Math.degToRad( 90 - this.lat );

		this.theta = THREE.Math.degToRad( this.lon );

		var targetPosition = this.target,
			position = this.object.position;

		targetPosition.x = position.x + 100 * Math.sin( this.phi ) * Math.cos( this.theta );
		targetPosition.y = position.y + 100 * Math.cos( this.phi );
		targetPosition.z = position.z + 100 * Math.sin( this.phi ) * Math.sin( this.theta );

		this.object.lookAt( targetPosition );
	};

	EventUtil.addHandler(window, "keydown", bind(this, this.onKeyDown));
	EventUtil.addHandler(window, "keyup", bind(this, this.onKeyUp));
	EventUtil.addHandler(this.domElement, "mousemove", bind(this, this.onMouseMove));
	
	function bind( scope, fn ) {

		return function () {

			fn.apply( scope, arguments );

		};

	};
	this.handleResize();
};


