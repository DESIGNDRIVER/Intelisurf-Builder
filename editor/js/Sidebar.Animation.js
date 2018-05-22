/**
 * @author mrdoob / http://mrdoob.com/
 */

Sidebar.Animation = function ( editor ) {

	console.log("Sidebar.Animation.js: Sidebar.Animation start");
	
	var signals = editor.signals;
	var options = {};
	var possibleAnimations = {};
	var currAnimationType = "Transform";
	var currFrame = "Start";
	var container = new UI.Panel();
	var recordingMode = "None";
	var selectedObject = 'undefined';
	
	var scales = [new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,0)];
	var rotations = [new THREE.Euler(0,0,0), new THREE.Euler(0,0,0)];
	var positions = [ new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,0)];
	
	container.add(new UI.HorizontalRule());
	
	// name
	var animationNameRow = new UI.Row();
	var animationName = new UI.Input().setWidth( '150px' ).setFontSize( '12px' );

	animationNameRow.add( new UI.Text( 'Name' ).setWidth( '90px' ) );
	animationNameRow.add( animationName );

	container.add( animationNameRow );
	
	var animationSelectedRow = new UI.Row();
	var animationSelected = new UI.Text( editor.selected ).setWidth( '150px' ).setFontSize( '12px' );

	animationSelectedRow.add( new UI.Text( 'Selected' ).setWidth( '90px' ) );
	
	var selected_object_button = new UI.Button( 'Select' ).onClick( function () {
		selectedObject = editor.selected;
		animationSelected.setValue(editor.selected.name);
	} ) ;
	
	signals.objectSelected.add(function(object) { 
		if (selectedObject === undefined) { 
			selectedObject = object; animationSelected.setValue(editor.selected);
		}
	});
	
	animationSelectedRow.add( animationSelected );
	animationSelectedRow.add( selected_object_button );
	
	container.add( animationSelectedRow );

	// frame
	
	var animationFrameRow = new UI.Row();
	var animationFrame = new UI.Select().setOptions( {

		0: 'Start',
		1: 'End'
		
	} ).setWidth( '150px' ).setFontSize( '12px' ).onChange( updateFrame );

	animationFrameRow.add( new UI.Text( 'Frame' ).setWidth( '100px' ) );
	animationFrameRow.add( animationFrame );

	container.add( animationFrameRow );
	
	// type

	var animationClassRow = new UI.Row();
	var animationClass = new UI.Select().setOptions( {

		'Transform': 'Transform',
		
	} ).setWidth( '150px' ).setFontSize( '12px' ).onChange( update );

	animationClassRow.add( new UI.Text( 'Animation Type' ).setWidth( '100px' ) );
	animationClassRow.add( animationClass );

	container.add( animationClassRow );
	
	console.log("Sidebar.Animation.js: Sidebar.Animation aniamtionClass: " + animationClass);
	console.log(animationClass);

	var parentAnimations = new UI.Select().setWidth( '130px' ).setMarginLeft( '4px' ).setFontSize( '12px' );

	// delay repeat row
	var repeatAndDelayRow = new UI.Row();
	var delay = new UI.Number().setWidth( '50px' )
	var repeat = new UI.Integer().setWidth( '50px' )

	repeatAndDelayRow.add( new UI.Text( 'Repeat' ).setWidth( '70px' ) );
	repeatAndDelayRow.add( repeat );
	repeatAndDelayRow.add( new UI.Text( 'Delay' ).setWidth( '70px' ) );
	repeatAndDelayRow.add( delay );
	container.add( repeatAndDelayRow );
	
	//start/end at
	var startAndEndTimeRow = new UI.Row();
	var duration = new UI.Number().setWidth( '50px' ).setValue(1);
	
	startAndEndTimeRow.add( new UI.Text( 'Duration' ).setWidth( '70px' ) );
	startAndEndTimeRow.add( duration );

	container.add( startAndEndTimeRow );
	
	container.add(new UI.HorizontalRule());
	
	var recordingRow = new UI.Row();
	
	recordingRow.add( new UI.Text( 'Recording' ).setWidth( '90px' ) );
	
	var rec_start_button = new UI.Button( 'START' ).onClick( function () {
		if (recordingMode == "Start")
			recordingMode = "None";
		else
			recordingMode = "Start";
		console.log("Sidebar.Animation.js: RecordingMode: " + recordingMode);
		signals.recordingModeChanged.dispatch( recordingMode );
	} ) ;
	
	recordingRow.add(rec_start_button);
	
//	var rec_end_button = new UI.Button( 'END' ).onClick( function () {
//		if (recordingMode == "End")
//			recordingMode = "None";
//		else
//			recordingMode = "End";
//		console.log("Sidebar.Animation.js: RecordingMode: " + recordingMode);
//		signals.recordingModeChanged.dispatch( 'End' );
//	} ) ;
//	
//	recordingRow.add(rec_end_button);
//	
//	var rec_none_button = new UI.Button( 'UI ONLY' ).onClick( function () {
//		recordingMode = "None";
//		console.log("Sidebar.Animation.js: RecordingMode: " + recordingMode);
//		signals.recordingModeChanged.dispatch( 'None' );
//	} );
//	
//	rec_none_button.dom.classList.add( 'selected' );
//	
//	recordingRow.add(rec_none_button);
	
	signals.recordingModeChanged.add( function ( mode ) {
		console.log("Sidebar.Animation.js: recordingModeChanged: " + mode);
		rec_start_button.dom.classList.remove( 'selectedred' );
//		rec_end_button.dom.classList.remove( 'selectedred' );
//		rec_none_button.dom.classList.remove( 'selected' );

		switch ( mode ) {
			case 'Start': rec_start_button.dom.classList.add( 'selectedred' ); break;
		}
	} );
	
	container.add( recordingRow );
	
	container.add(new UI.HorizontalRule());
	
	// EDIT POSITIONS
	
	var PositionRow = new UI.Row();
	var PositionX = new UI.Number().setWidth( '50px' ).onClick( updatePosition ).onChange(updatePosition);
	var PositionY = new UI.Number().setWidth( '50px' ).onClick( updatePosition ).onChange(updatePosition);
	var PositionZ = new UI.Number().setWidth( '50px' ).onClick( updatePosition ).onChange(updatePosition);

	PositionRow.add( new UI.Text( 'Position' ).setWidth( '90px' ) );
	PositionRow.add( PositionX, PositionY, PositionZ );

	container.add( PositionRow );
	
	// EDIT ROTATIONS
	
	var rotationRow = new UI.Row();
	var rotationX = new UI.Number().setStep( 10 ).setUnit( '°' ).setWidth( '50px' ).onClick( updateRotation ).onChange( updateRotation );
	var rotationY = new UI.Number().setStep( 10 ).setUnit( '°' ).setWidth( '50px' ).onClick( updateRotation ).onChange( updateRotation );
	var rotationZ = new UI.Number().setStep( 10 ).setUnit( '°' ).setWidth( '50px' ).onClick( updateRotation ).onChange( updateRotation );

	rotationRow.add( new UI.Text( 'Rotation' ).setWidth( '90px' ) );
	rotationRow.add( rotationX, rotationY, rotationZ );

	container.add( rotationRow );
	
	// EDIT SCALE
	
	var scaleRow = new UI.Row();
	var scaleLock = new UI.Checkbox( true ).setPosition( 'absolute' ).setLeft( '84px' );
	var scaleX = new UI.Number( 1 ).setRange( 0.01, Infinity ).setWidth( '50px' ).setId("scaleX").onClick( updateScale).onChange( updateScale );
	var scaleY = new UI.Number( 1 ).setRange( 0.01, Infinity ).setWidth( '50px' ).setId("scaleY").onClick( updateScale).onChange( updateScale );
	var scaleZ = new UI.Number( 1 ).setRange( 0.01, Infinity ).setWidth( '50px' ).setId("scaleZ").onClick( updateScale).onChange( updateScale );

	scaleRow.add( new UI.Text( 'Scale' ).setWidth( '90px' ) );
	scaleRow.add( scaleLock );
	scaleRow.add( scaleX, scaleY, scaleZ );

	container.add( scaleRow );
	
	container.add(new UI.HorizontalRule());
	
	console.log("Sidebar.Animation.js: Sidebar.Animation start parameters");
	
	//management row
	var manageRow = new UI.Row();

	//play
	manageRow.add( new UI.Button( 'PLAY' ).onClick( function () {
		play();
	} ) );
	
	//confirm
	manageRow.add( new UI.Button( 'SAVE' ).setMarginLeft( '4px' ).onClick( storeAnimation ));
	container.add( manageRow );
	
	container.add(new UI.HorizontalRule());

	console.log("Sidebar.Animation.js: Sidebar.Animation added UI");

	// Position update handler
	
	function updatePosition() {
		console.log("Sidebar.Animation.js: Update Position");

		var object = editor.selected;
		if ( object !== null ) {
			var newPosition = new THREE.Vector3( PositionX.getValue(), PositionY.getValue(), PositionZ.getValue() );
			
			positions[animationFrame.getValue()] = newPosition;
			
			if ( object.position.distanceTo( newPosition ) >= 0.01 ) {
				object.position.copy( newPosition );
				object.updateMatrixWorld( true );
				signals.objectChanged.dispatch(object );
			}
		}
		
		console.log("Sidebar.Animation.js: updatePosition: " + animationFrame.getValue());
	}
	
	// Rotation update handler 
	function updateRotation() {
		var object = editor.selected;
		if ( object !== null ) {
			var newRotation = new THREE.Euler( rotationX.getValue() * THREE.Math.DEG2RAD, rotationY.getValue() * THREE.Math.DEG2RAD, rotationZ.getValue() * THREE.Math.DEG2RAD );
			rotations[animationFrame.getValue()] = newRotation;
			if ( object.rotation.toVector3().distanceTo( newRotation.toVector3() ) >= 0.01 ) {
				object.rotation.copy( newRotation );
				object.updateMatrixWorld( true );
				signals.objectChanged.dispatch( object );
			}
		}
		
		console.log("Sidebar.Animation.js: updatePosition: " + animationFrame.getValue());
	}
	
	// Scale update handler
	function updateScale(evt) {
	
		console.log("update scale: " + scaleLock.getValue());
		console.log(evt);
		
		var object = editor.selected;
		if ( object == null )  return;
		var newScale = null;
		
		var elId = null;
		
		if (evt != null)
			elId = evt.target.id;
		else
			elId = "editor";
		
		if( scaleLock.getValue() == true ) {
			if( elId == "scaleX" ){	
				newScale = new THREE.Vector3( scaleX.getValue(), scaleX.getValue(), scaleX.getValue() );
				scaleY.setValue( scaleX.getValue() );
				scaleZ.setValue( scaleX.getValue() );
			}
			else if( elId == "scaleY" ) {
				newScale = new THREE.Vector3( scaleY.getValue(), scaleY.getValue(), scaleY.getValue() );
				scaleX.setValue( scaleY.getValue() );
				scaleZ.setValue( scaleY.getValue() );
			}
			else if (elId == "scaleZ"){ 
				newScale = new THREE.Vector3( scaleZ.getValue(), scaleZ.getValue(), scaleZ.getValue() );
				scaleX.setValue( scaleZ.getValue() );
				scaleY.setValue( scaleZ.getValue() );
			}
			else if( elId == "editor" )
			{
				newScale = new THREE.Vector3( scaleX.getValue(), scaleY.getValue(), scaleZ.getValue() );
			}
		}else{
			newScale = new THREE.Vector3( scaleX.getValue(), scaleY.getValue(), scaleZ.getValue() );
		}
		
		scales[animationFrame.getValue()] = newScale;

		if ( object.scale.distanceTo( newScale ) >= 0.01 ) {
			object.scale.copy( newScale );
			object.updateMatrixWorld( true );
			signals.objectChanged.dispatch( object );
		}
	}

	function updateFrame() {
		console.log("Sidebar.Animation.js: Sidebar.Animation updateFrame begin");
		
		var i = animationFrame.getValue();
		
		PositionX.setValue(positions[i].x);
		PositionY.setValue(positions[i].y);
		PositionZ.setValue(positions[i].z);
		
		rotationX.setValue(rotations[i].x);
		rotationY.setValue(rotations[i].y);
		rotationZ.setValue(rotations[i].z);
		
		scaleX.setValue(scales[i].x);
		scaleY.setValue(scales[i].y);
		scaleZ.setValue(scales[i].z);
	
		console.log("Sidebar.Animation.js: Sidebar.Animation updateFrame end");
	}
	
	function update() {
		// FIXME: Hardcoding animationtype
		console.log("Sidebar.Animation.js: Sidebar.Animation update begin");
		currAnimationType = "Transform";
		var preAnimationType = currAnimationType;
		//currAnimationType = animationClass.getValue();
		
		if(currAnimationType != preAnimationType){
			console.log(currAnimationType);
			//refreshUI()
		}
		//console.log(animationClass.selectedOptions.index);
		//if ( currentMaterialSlot !== previousSelectedSlot ) refreshUI( true );
		console.log("Sidebar.Animation.js: Sidebar.Animation update end");
	}

	// Play Animation 
	function play(){
		console.log("Sidebar.Animation.js: Sidebar.Animation play start");
		
		var object = editor.selected;
		console.log(object);
		if( currAnimationType == null) { alert( "please choose an animation type" ); return; }
		if( object == null  ) { alert( "please choose an object" ); return; }

		var durationTime = duration.getValue();
		var repeatTime = repeat.getValue();
		var delayTime = delay.getValue() * 1000; 

		if( currAnimationType == "Transform" ) {
			// 1. Translate
			var newPosition = { x: positions[0].x, y: positions[0].y, z:positions[0].z};
			var startPosition = {  x: positions[0].x, y: positions[0].y, z:positions[0].z};
			var endPosition = { x: positions[1].x, y: positions[1].y, z:positions[1].z};
			var tweenTransform = new TWEEN.Tween(newPosition)
			.delay(delayTime)
			.to(endPosition, durationTime * 1000) 
			//.easing(TWEEN.Easing.Quadratic.Out) 
			.onUpdate(function() { 
				//console.log(newPosition);
				object.position.copy( newPosition );
				object.updateMatrixWorld( true );
				//signals.objectChanged.dispatch(object );

			}).onComplete(function(){

				signals.stopAnimation.dispatch();
				object.position.copy( startPosition );
				object.updateMatrixWorld( true );
				//signals.objectChanged.dispatch(object );
			})
			.start();
			signals.startAnimation.dispatch( );

			// 2. Rotate
			var startRotation = new THREE.Euler( rotations[0].x * THREE.Math.DEG2RAD, rotations[0].y * THREE.Math.DEG2RAD, rotations[0].z * THREE.Math.DEG2RAD );
			var newRotation = new THREE.Euler( rotations[0].x * THREE.Math.DEG2RAD, rotations[0].y * THREE.Math.DEG2RAD, rotations[0].z * THREE.Math.DEG2RAD );
			var toRotation = new THREE.Euler(  rotations[1].x * THREE.Math.DEG2RAD, rotations[1].y * THREE.Math.DEG2RAD, rotations[1].z * THREE.Math.DEG2RAD  );
			var tweenRotate = new TWEEN.Tween(newRotation)
			.delay(delayTime)
			.to(toRotation, durationTime * 1000)
			.onUpdate(function() { 
				object.rotation.copy(new THREE.Euler( newRotation.x, newRotation.y, newRotation.z ) );
				object.updateMatrixWorld( true );
				//signals.objectChanged.dispatch( object );
			}).onComplete(function(){
				signals.stopAnimation.dispatch();
				object.rotation.copy( startRotation );
				object.updateMatrixWorld( true );
				//signals.objectChanged.dispatch( object );
			})
			.start();
			editor.deselect();
			signals.startAnimation.dispatch( );
			
			// 3. Scale
			var startScale = new THREE.Vector3( scales[0].x, scales[0].y, scales[0].z);
			var newScale = new THREE.Vector3( scales[0].x, scales[0].y, scales[0].z);
			var toScale = new THREE.Vector3( scales[1].x, scales[1].y, scales[1].z);
			var tweenScale = new TWEEN.Tween(newScale)
			.delay(delayTime)
			.to(toScale, durationTime * 1000)
			.onUpdate(function() { 
				object.scale.copy( newScale );
				object.updateMatrixWorld( true );
			}).onComplete(function(){
				signals.stopAnimation.dispatch();
				object.scale.copy( startScale );
				object.updateMatrixWorld( true );
			})
			.start();
			signals.startAnimation.dispatch( );
		}
		
		console.log("Sidebar.Animation.js: Sidebar.Animation play end");
	}

	function storeAnimation(){
		
		console.log("Sidebar.Animation.js: Sidebar.Animation storeAnimation begin");
		
		var object = editor.selected;
		
		if( currAnimationType == null ) { alert( "please choose an animation type" ); return; }
		if( object == null  ) { alert( "please choose an object" ); return; }

		// FIXME: Animation details removed for now
		//var parentAnimation = parentAnimations.getValue();
		//var startType = order.getValue();
		var startType = 'with';
		var parentAnimation = '';
		//console.log(parentAnimation);
		
		if(startType == 'with' && parentAnimation != '') {
			parentAnimation = editor.animations.animations[parentAnimation].parent;
			console.log('parent id', parentAnimation);
		}
		
		console.log("Sidebar.Animation.js: Sidebar.Animation storeAnimation getting parameters");
		
		var durationTime = duration.getValue();
		var fromPos = null;
		var toPos = null;
		var fromRot = null;
		var toRot = null;
		var fromSca = null;
		var toSca = null;
		var name = animationName.getValue();
		var repeatTime = repeat.getValue();
		var delayTime = delay.getValue(); 
		
		if( currAnimationType == "Transform" ) {
			fromPos = new THREE.Vector3( positions[0].x, positions[0].y, positions[0].z );
			toPos = new THREE.Vector3( positions[1].x, positions[1].y, positions[1].z );
			fromRot = new THREE.Euler( rotations[0].x * THREE.Math.DEG2RAD, rotations[0].y * THREE.Math.DEG2RAD, rotations[0].z * THREE.Math.DEG2RAD );
			toRot = new THREE.Euler( rotations[1].x * THREE.Math.DEG2RAD, rotations[1].y * THREE.Math.DEG2RAD, rotations[1].z * THREE.Math.DEG2RAD );
			fromSca = new THREE.Vector3(  scales[0].x, scales[0].y, scales[0].z );
			toSca = new THREE.Vector3(  scales[1].x, scales[1].y, scales[1].z);
		}
		
		console.log("Sidebar.Animation.js: Sidebar.Animation storeAnimation execute add animation");
		
		editor.execute( new AddAnimationCommand( new Animation( name, object.uuid, currAnimationType, parentAnimation, startType, delayTime, repeatTime, durationTime, fromPos, toPos, fromRot, toRot, fromSca, toSca ) ) );
	
		console.log("Sidebar.Animation.js: Sidebar.Animation storeAnimation end");
	}

	function refreshUI(){
		
		console.log("Sidebar.Animation.js: Sidebar.Animation refreshUI begin");
		
		var animations = editor.animations.animations;
		var options = {};
		
		for ( var key in animations) {
			if (animations.hasOwnProperty(key)) {
				console.log("Sidebar.Animation.js: Sidebar.Animation refreshUI animation key: " + key);
				options[key] = animations[key].name;
			}
		}
		
		console.log(options);
		parentAnimations.setOptions(options);
		console.log("Sidebar.Animation.js: Sidebar.Animation refreshUI end");
	}
	
	signals.animationChanged.add( refreshUI );
	signals.editorCleared.add( refreshUI );
	signals.sceneGraphChanged.add( refreshUI );
	
	signals.refreshSidebarObject3D.add( function ( object ) {
		if (recordingMode == "Start")
		{
			console.log("Sidebar.Animation.js: Sidebar.Animation Start refreshSidebarObject3D begin");
			console.log(object);
			
			PositionX.setValue( object.position.x );
			PositionY.setValue( object.position.y );
			PositionZ.setValue( object.position.z );
			rotationX.setValue( object.rotation.x );
			rotationY.setValue( object.rotation.y );
			rotationZ.setValue( object.rotation.z );
			scaleX.setValue( object.scale.x );
			scaleY.setValue( object.scale.y );
			scaleZ.setValue( object.scale.z );
			
			refreshUI();
			
			console.log("Sidebar.Animation.js: Sidebar.Animation Start refreshSidebarObject3D end");
		}
	} );
	
	console.log("Sidebar.Animation.js: Sidebar.Animation complete");
	
	return container;
};
