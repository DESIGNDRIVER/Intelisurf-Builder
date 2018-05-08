/**
 * @author mrdoob / http://mrdoob.com/
 */

Sidebar.Animation = function ( editor ) {

	console.log("Sidebar.Animation.js: Sidebar.Animation start");
	
	var signals = editor.signals;
	var options = {};
	var possibleAnimations = {};
	var currAnimationType = "Transform";
	var container = new UI.Panel();
	var recordingMode = "None";
	
	// name
	var animationNameRow = new UI.Row();
	var animationName = new UI.Input().setWidth( '150px' ).setFontSize( '12px' );

	animationNameRow.add( new UI.Text( 'Name' ).setWidth( '90px' ) );
	animationNameRow.add( animationName );

	container.add( animationNameRow );

	
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

// FIXME: Temporarily removed order row to simplify, parentAnimations is uncommented because it is used later
	
	// order row

//	var orderRow = new UI.Row();
//	var order = new UI.Select().setOptions( {
//
//		'with': 'With',
//		'follows': 'Follows'
//
//	} ).setWidth( '70px' ).setFontSize( '12px' );
//
//	orderRow.add( new UI.Text( 'Order' ).setWidth( '50px' ) );
//	orderRow.add( order );
//
	var parentAnimations = new UI.Select().setWidth( '130px' ).setMarginLeft( '4px' ).setFontSize( '12px' );
//
//	orderRow.add( order );
//	orderRow.add( parentAnimations );

//	container.add( orderRow );

//	console.log("Sidebar.Animation.js: Sidebar.Animation order: " + order);
//	console.log(order);

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
	var duration = new UI.Number().setWidth( '50px' )
	
	startAndEndTimeRow.add( new UI.Text( 'Duration' ).setWidth( '70px' ) );
	startAndEndTimeRow.add( duration );

	container.add( startAndEndTimeRow );
	
	container.add(new UI.HorizontalRule());
	
	console.log("Sidebar.Animation.js: Sidebar.Animation start parameters");

	/**
	 * start
	 */
	
	var startPositionRow = new UI.Row();
	var startPositionX = new UI.Number().setWidth( '50px' ).onClick( updateStartPosition ).onChange(updateStartPosition);
	var startPositionY = new UI.Number().setWidth( '50px' ).onClick( updateStartPosition ).onChange(updateStartPosition);
	var startPositionZ = new UI.Number().setWidth( '50px' ).onClick( updateStartPosition ).onChange(updateStartPosition);

	startPositionRow.add( new UI.Text( 'Start Position' ).setWidth( '90px' ) );
	startPositionRow.add( startPositionX, startPositionY, startPositionZ );

	container.add( startPositionRow );
	
	var rotationFromRow = new UI.Row();
	var rotationFromX = new UI.Number().setStep( 10 ).setUnit( '°' ).setWidth( '50px' ).onClick( updateStartRotation ).onChange( updateStartRotation );
	var rotationFromY = new UI.Number().setStep( 10 ).setUnit( '°' ).setWidth( '50px' ).onClick( updateStartRotation ).onChange( updateStartRotation );
	var rotationFromZ = new UI.Number().setStep( 10 ).setUnit( '°' ).setWidth( '50px' ).onClick( updateStartRotation ).onChange( updateStartRotation );

	rotationFromRow.add( new UI.Text( 'Rotation From' ).setWidth( '90px' ) );
	rotationFromRow.add( rotationFromX, rotationFromY, rotationFromZ );

	container.add( rotationFromRow );
	
	var scaleFromRow = new UI.Row();
	var scaleFromLock = new UI.Checkbox( true ).setPosition( 'absolute' ).setLeft( '75px' );
	var scaleFromX = new UI.Number( 1 ).setRange( 0.01, Infinity ).setWidth( '50px' ).setId("fromX").onClick( updateStartScale).onChange( updateStartScale );
	var scaleFromY = new UI.Number( 1 ).setRange( 0.01, Infinity ).setWidth( '50px' ).setId("fromY").onClick( updateStartScale).onChange( updateStartScale );
	var scaleFromZ = new UI.Number( 1 ).setRange( 0.01, Infinity ).setWidth( '50px' ).setId("fromZ").onClick( updateStartScale).onChange( updateStartScale );

	scaleFromRow.add( new UI.Text( 'Scale From' ).setWidth( '90px' ) );
	scaleFromRow.add( scaleFromLock );
	scaleFromRow.add( scaleFromX, scaleFromY, scaleFromZ );

	container.add( scaleFromRow );
	
	container.add(new UI.HorizontalRule());
	
	console.log("Sidebar.Animation.js: Sidebar.Animation end parameters");
	

	var endPositionRow = new UI.Row();
	var endPositionX = new UI.Number().setWidth( '50px' ).onClick( updateEndPosition ).onChange( updateEndPosition );
	var endPositionY = new UI.Number().setWidth( '50px' ).onClick( updateEndPosition ).onChange( updateEndPosition );
	var endPositionZ = new UI.Number().setWidth( '50px' ).onClick( updateEndPosition ).onChange( updateEndPosition );

	endPositionRow.add( new UI.Text( 'End Position' ).setWidth( '90px' ) );
	endPositionRow.add( endPositionX, endPositionY, endPositionZ );

	container.add( endPositionRow );

	// rotation

	

	var rotationToRow = new UI.Row();
	var rotationToX = new UI.Number().setStep( 10 ).setUnit( '°' ).setWidth( '50px' ).onClick( updateEndRotation ).onChange( updateEndRotation );
	var rotationToY = new UI.Number().setStep( 10 ).setUnit( '°' ).setWidth( '50px' ).onClick( updateEndRotation ).onChange( updateEndRotation );
	var rotationToZ = new UI.Number().setStep( 10 ).setUnit( '°' ).setWidth( '50px' ).onClick( updateEndRotation ).onChange( updateEndRotation );

	rotationToRow.add( new UI.Text( 'Rotation To' ).setWidth( '90px' ) );
	rotationToRow.add( rotationToX, rotationToY, rotationToZ );

	container.add( rotationToRow );

	// scale

	
	
	var scaleToRow = new UI.Row();
	var scaleToLock = new UI.Checkbox( true ).setPosition( 'absolute' ).setLeft( '75px' );
	var scaleToX = new UI.Number( 1 ).setRange( 0.01, Infinity ).setWidth( '50px' ).setId("toX").onClick( updateEndScale ).onChange( updateEndScale );
	var scaleToY = new UI.Number( 1 ).setRange( 0.01, Infinity ).setWidth( '50px' ).setId("toY").onClick( updateEndScale ).onChange( updateEndScale );
	var scaleToZ = new UI.Number( 1 ).setRange( 0.01, Infinity ).setWidth( '50px' ).setId("toZ").onClick( updateEndScale ).onChange( updateEndScale );

	scaleToRow.add( new UI.Text( 'Scale To' ).setWidth( '90px' ) );
	scaleToRow.add( scaleToLock );
	scaleToRow.add( scaleToX, scaleToY, scaleToZ );

	container.add( scaleToRow );
	
	container.add(new UI.HorizontalRule());
	
	//management row
	var manageRow = new UI.Row();

	//play
	manageRow.add( new UI.Button( 'PLAY' ).onClick( function () {
		play();
	} ) );
	
	manageRow.add( new UI.Button( 'REC START' ).onClick( function () {
		//play();
	} ) );
	
	manageRow.add( new UI.Button( 'REC END' ).onClick( function () {
		//play();
	} ) );

	//confirm
	manageRow.add( new UI.Button( 'SAVE' ).setMarginLeft( '4px' ).onClick( storeAnimation ));
	container.add( manageRow );
	
	container.add(new UI.HorizontalRule());

	console.log("Sidebar.Animation.js: Sidebar.Animation added UI");

	// Position update handler
	function updateStartPosition() {
		var object = editor.selected;
		if ( object !== null ) {
			var newPosition = new THREE.Vector3( startPositionX.getValue(), startPositionY.getValue(), startPositionZ.getValue() );
			if ( object.position.distanceTo( newPosition ) >= 0.01 ) {
				object.position.copy( newPosition );
				object.updateMatrixWorld( true );
				signals.objectChanged.dispatch(object );
			}
		}
	}

	function updateEndPosition() {
		var object = editor.selected;
		if ( object !== null ) {
			var newPosition = new THREE.Vector3( endPositionX.getValue(), endPositionY.getValue(), endPositionZ.getValue() );
			if ( object.position.distanceTo( newPosition ) >= 0.01 ) {
				object.position.copy( newPosition );
				object.updateMatrixWorld( true );
				signals.objectChanged.dispatch(object );
			}
		}	
	}

	// Rotation update handler 
	function updateStartRotation() {
		var object = editor.selected;
		if ( object !== null ) {
			var newRotation = new THREE.Euler( rotationFromX.getValue() * THREE.Math.DEG2RAD, rotationFromY.getValue() * THREE.Math.DEG2RAD, rotationFromZ.getValue() * THREE.Math.DEG2RAD );
			if ( object.rotation.toVector3().distanceTo( newRotation.toVector3() ) >= 0.01 ) {
				object.rotation.copy( newRotation );
				object.updateMatrixWorld( true );
				signals.objectChanged.dispatch( object );
			}
		}
	}

	function updateEndRotation() {
		var object = editor.selected;
		if ( object !== null ) {
			var newRotation = new THREE.Euler( rotationToX.getValue() * THREE.Math.DEG2RAD, rotationToY.getValue() * THREE.Math.DEG2RAD, rotationToZ.getValue() * THREE.Math.DEG2RAD );
			if ( object.rotation.toVector3().distanceTo( newRotation.toVector3() ) >= 0.01 ) {
				object.rotation.copy( newRotation );
				object.updateMatrixWorld( true );
				signals.objectChanged.dispatch( object );

			}
		}
	}

	// Scale update handler
	function updateStartScale(evt) {
	
		var object = editor.selected;
		if ( object == null )  return;
		var newScale = null;
		var elId = evt.target.id;
		if( scaleFromLock.getValue() == true ) {
			if( elId == "fromX" ){	
				newScale = new THREE.Vector3( scaleFromX.getValue(), scaleFromX.getValue(), scaleFromX.getValue() );
				scaleFromY.setValue( scaleFromX.getValue() );
				scaleFromZ.setValue( scaleFromX.getValue() );
			}

			else if( elId == "fromY" ) {
				newScale = new THREE.Vector3( scaleFromY.getValue(), scaleFromY.getValue(), scaleFromY.getValue() );
				scaleFromX.setValue( scaleFromY.getValue() );
				scaleFromZ.setValue( scaleFromY.getValue() );
			}
			else { 
				newScale = new THREE.Vector3( scaleFromZ.getValue(), scaleFromZ.getValue(), scaleFromZ.getValue() );
				scaleFromX.setValue( scaleFromZ.getValue() );
				scaleFromY.setValue( scaleFromZ.getValue() );
			}
		}else{
			newScale = new THREE.Vector3( scaleFromX.getValue(), scaleFromY.getValue(), scaleFromZ.getValue() );
		}

		if ( object.scale.distanceTo( newScale ) >= 0.01 ) {
			object.scale.copy( newScale );
			object.updateMatrixWorld( true );
			signals.objectChanged.dispatch( object );
		}
	}

	function updateEndScale(evt) {
		var object = editor.selected;
		if ( object == null )  return;
		var newScale = null;
		var elId = evt.target.id;
		
		if( scaleToLock.getValue() == true ) {
			if( elId == "toX" ){	
				newScale = new THREE.Vector3( scaleToX.getValue(), scaleToX.getValue(), scaleToX.getValue() );
				scaleToY.setValue( scaleToX.getValue() );
				scaleToZ.setValue( scaleToX.getValue() );
			}

			else if( elId == "toY" ) {
				newScale = new THREE.Vector3( scaleToY.getValue(), scaleToY.getValue(), scaleToY.getValue() );
				scaleToX.setValue( scaleToY.getValue() );
				scaleToZ.setValue( scaleToY.getValue() );
			}
			else { 
				newScale = new THREE.Vector3( scaleToZ.getValue(), scaleToZ.getValue(), scaleToZ.getValue() );
				scaleToX.setValue( scaleToZ.getValue() );
				scaleToY.setValue( scaleToZ.getValue() );
			}
		}else{
			newScale = new THREE.Vector3( scaleToX.getValue(), scaleToY.getValue(), scaleToZ.getValue() );
		}

		if ( object.scale.distanceTo( newScale ) >= 0.01 ) {
			object.scale.copy( newScale );
			object.updateMatrixWorld( true );
			signals.objectChanged.dispatch( object );
		}
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
			var newPosition = { x: startPositionX.getValue(), y: startPositionY.getValue(), z:startPositionZ.getValue()};
			var startPosition = { x: startPositionX.getValue(), y: startPositionY.getValue(), z:startPositionZ.getValue()};
			var endPosition = {x: endPositionX.getValue(), y: endPositionY.getValue(), z:endPositionZ.getValue() };
			var tweenTransform = new TWEEN.Tween(newPosition)
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
			var startRotation = new THREE.Euler( rotationFromX.getValue() * THREE.Math.DEG2RAD, rotationFromY.getValue() * THREE.Math.DEG2RAD, rotationFromZ.getValue() * THREE.Math.DEG2RAD );
			var newRotation = new THREE.Euler( rotationFromX.getValue() * THREE.Math.DEG2RAD, rotationFromY.getValue() * THREE.Math.DEG2RAD, rotationFromZ.getValue() * THREE.Math.DEG2RAD );
			var toRotation = new THREE.Euler( rotationToX.getValue() * THREE.Math.DEG2RAD, rotationToY.getValue() * THREE.Math.DEG2RAD, rotationToZ.getValue() * THREE.Math.DEG2RAD );
			var tweenRotate = new TWEEN.Tween(newRotation)
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
			var startScale = new THREE.Vector3( scaleFromX.getValue(), scaleFromY.getValue(), scaleFromZ.getValue() );
			var newScale = new THREE.Vector3( scaleFromX.getValue(), scaleFromY.getValue(), scaleFromZ.getValue() );
			var toScale = new THREE.Vector3( scaleToX.getValue(), scaleToY.getValue(), scaleToZ.getValue() );
			var tweenScale = new TWEEN.Tween(newScale)
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
			fromPos = new THREE.Vector3( startPositionX.getValue(), startPositionY.getValue(), startPositionZ.getValue() );
			toPos = new THREE.Vector3( endPositionX.getValue(), endPositionY.getValue(), endPositionZ.getValue() );
			fromRot = new THREE.Euler( rotationFromX.getValue() * THREE.Math.DEG2RAD, rotationFromY.getValue() * THREE.Math.DEG2RAD, rotationFromZ.getValue() * THREE.Math.DEG2RAD );
			toRot = new THREE.Euler( rotationToX.getValue() * THREE.Math.DEG2RAD, rotationToY.getValue() * THREE.Math.DEG2RAD, rotationToZ.getValue() * THREE.Math.DEG2RAD );
			fromSca = new THREE.Vector3( scaleFromX.getValue(), scaleFromY.getValue(), scaleFromZ.getValue() );
			toSca = new THREE.Vector3( scaleToX.getValue(), scaleToY.getValue(), scaleToZ.getValue() );
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
	
	console.log("Sidebar.Animation.js: Sidebar.Animation complete");
	
	return container;
};
