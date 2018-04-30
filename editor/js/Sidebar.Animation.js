/**
 * @author mrdoob / http://mrdoob.com/
 */

Sidebar.Animation = function ( editor ) {

	var signals = editor.signals;

	var options = {};
	var possibleAnimations = {};
	var currAnimationType = null;
	var container = new UI.Panel();
	

	// name
	var animationNameRow = new UI.Row();
	var animationName = new UI.Input().setWidth( '150px' ).setFontSize( '12px' );

	animationNameRow.add( new UI.Text( 'Name' ).setWidth( '90px' ) );
	animationNameRow.add( animationName );

	container.add( animationNameRow );

	// type


	var animationClassRow = new UI.Row();
	var animationClass = new UI.Select().setOptions( {

		'Translation': 'Translation',
		'Rotation': 'Rotation',
		'Scale': 'Scale',
		
	} ).setWidth( '150px' ).setFontSize( '12px' ).onChange( update );

	animationClassRow.add( new UI.Text( 'Animation Type' ).setWidth( '100px' ) );
	animationClassRow.add( animationClass );

	container.add( animationClassRow );

	// order row



	var orderRow = new UI.Row();
	var order = new UI.Select().setOptions( {

		'with': 'With',
		'follows': 'Follows'

	} ).setWidth( '70px' ).setFontSize( '12px' );

	orderRow.add( new UI.Text( 'Order' ).setWidth( '50px' ) );
	orderRow.add( order );

	var parentAnimations = new UI.Select().setWidth( '130px' ).setMarginLeft( '4px' ).setFontSize( '12px' );

	orderRow.add( order );
	orderRow.add( parentAnimations );

	container.add( orderRow );

	
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

	

	/**
	 * translation
	 */
	// start/end position

	var startPositionRow = new UI.Row();
	var startPositionX = new UI.Number().setWidth( '50px' ).onClick( updateStartPosition ).onChange(updateStartPosition);
	var startPositionY = new UI.Number().setWidth( '50px' ).onClick( updateStartPosition ).onChange(updateStartPosition);
	var startPositionZ = new UI.Number().setWidth( '50px' ).onClick( updateStartPosition ).onChange(updateStartPosition);


	startPositionRow.add( new UI.Text( 'Start Position' ).setWidth( '90px' ) );
	startPositionRow.add( startPositionX, startPositionY, startPositionZ );

	container.add( startPositionRow );

	var endPositionRow = new UI.Row();
	var endPositionX = new UI.Number().setWidth( '50px' ).onClick( updateEndPosition ).onChange( updateEndPosition );
	var endPositionY = new UI.Number().setWidth( '50px' ).onClick( updateEndPosition ).onChange( updateEndPosition );
	var endPositionZ = new UI.Number().setWidth( '50px' ).onClick( updateEndPosition ).onChange( updateEndPosition );

	endPositionRow.add( new UI.Text( 'End Position' ).setWidth( '90px' ) );
	endPositionRow.add( endPositionX, endPositionY, endPositionZ );

	container.add( endPositionRow );

	// rotation

	var rotationFromRow = new UI.Row();
	var rotationFromX = new UI.Number().setStep( 10 ).setUnit( '°' ).setWidth( '50px' ).onClick( updateStartRotation ).onChange( updateStartRotation );
	var rotationFromY = new UI.Number().setStep( 10 ).setUnit( '°' ).setWidth( '50px' ).onClick( updateStartRotation ).onChange( updateStartRotation );
	var rotationFromZ = new UI.Number().setStep( 10 ).setUnit( '°' ).setWidth( '50px' ).onClick( updateStartRotation ).onChange( updateStartRotation );

	rotationFromRow.add( new UI.Text( 'Rotation From' ).setWidth( '90px' ) );
	rotationFromRow.add( rotationFromX, rotationFromY, rotationFromZ );

	container.add( rotationFromRow );


	var rotationToRow = new UI.Row();
	var rotationToX = new UI.Number().setStep( 10 ).setUnit( '°' ).setWidth( '50px' ).onClick( updateEndRotation ).onChange( updateEndRotation );
	var rotationToY = new UI.Number().setStep( 10 ).setUnit( '°' ).setWidth( '50px' ).onClick( updateEndRotation ).onChange( updateEndRotation );
	var rotationToZ = new UI.Number().setStep( 10 ).setUnit( '°' ).setWidth( '50px' ).onClick( updateEndRotation ).onChange( updateEndRotation );

	rotationToRow.add( new UI.Text( 'Rotation To' ).setWidth( '90px' ) );
	rotationToRow.add( rotationToX, rotationToY, rotationToZ );

	container.add( rotationToRow );

	// scale

	var scaleFromRow = new UI.Row();
	var scaleFromLock = new UI.Checkbox( true ).setPosition( 'absolute' ).setLeft( '75px' );
	var scaleFromX = new UI.Number( 1 ).setRange( 0.01, Infinity ).setWidth( '50px' ).setId("fromX").onClick( updateStartScale).onChange( updateStartScale );
	var scaleFromY = new UI.Number( 1 ).setRange( 0.01, Infinity ).setWidth( '50px' ).setId("fromY").onClick( updateStartScale).onChange( updateStartScale );
	var scaleFromZ = new UI.Number( 1 ).setRange( 0.01, Infinity ).setWidth( '50px' ).setId("fromZ").onClick( updateStartScale).onChange( updateStartScale );

	scaleFromRow.add( new UI.Text( 'Scale From' ).setWidth( '90px' ) );
	scaleFromRow.add( scaleFromLock );
	scaleFromRow.add( scaleFromX, scaleFromY, scaleFromZ );

	container.add( scaleFromRow );
	
	var scaleToRow = new UI.Row();
	var scaleToLock = new UI.Checkbox( true ).setPosition( 'absolute' ).setLeft( '75px' );
	var scaleToX = new UI.Number( 1 ).setRange( 0.01, Infinity ).setWidth( '50px' ).setId("toX").onClick( updateEndScale ).onChange( updateEndScale );
	var scaleToY = new UI.Number( 1 ).setRange( 0.01, Infinity ).setWidth( '50px' ).setId("toY").onClick( updateEndScale ).onChange( updateEndScale );
	var scaleToZ = new UI.Number( 1 ).setRange( 0.01, Infinity ).setWidth( '50px' ).setId("toZ").onClick( updateEndScale ).onChange( updateEndScale );

	scaleToRow.add( new UI.Text( 'Scale To' ).setWidth( '90px' ) );
	scaleToRow.add( scaleToLock );
	scaleToRow.add( scaleToX, scaleToY, scaleToZ );

	container.add( scaleToRow );
	//management row
	var manageRow = new UI.Row();

	//play
	manageRow.add( new UI.Button( 'PLAY' ).onClick( function () {
		play();
	} ) );

	//confirm
	manageRow.add( new UI.Button( 'CONFIRM' ).setMarginLeft( '4px' ).onClick( storeAnimation ));

	container.add( manageRow );




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
		var preAnimationType = currAnimationType;
		currAnimationType = animationClass.getValue();
		
		if(currAnimationType != preAnimationType){
			console.log(currAnimationType);
			//refreshUI()
		}
		//console.log(animationClass.selectedOptions.index);
		//if ( currentMaterialSlot !== previousSelectedSlot ) refreshUI( true );

	}

	// Play Animation 
	function play(){
		var object = editor.selected;
		console.log(object);
		if( currAnimationType == null ||  object == null  ) { alert( "please choose an animation type" ); return; }
		var durationTime = duration.getValue();
		var repeatTime = repeat.getValue();
		var delayTime = delay.getValue(); 

		if( currAnimationType == "Translation" ) {
			var newPosition = { x: startPositionX.getValue(), y: startPositionY.getValue(), z:startPositionZ.getValue()};
			var startPosition = { x: startPositionX.getValue(), y: startPositionY.getValue(), z:startPositionZ.getValue()};
			var endPosition = {x: endPositionX.getValue(), y: endPositionY.getValue(), z:endPositionZ.getValue() };
			var tween = new TWEEN.Tween(newPosition)
			.to(endPosition, durationTime) 
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

		}else if( currAnimationType == "Rotation" ) {
			var startRotation = new THREE.Euler( rotationFromX.getValue() * THREE.Math.DEG2RAD, rotationFromY.getValue() * THREE.Math.DEG2RAD, rotationFromZ.getValue() * THREE.Math.DEG2RAD );
			var newRotation = new THREE.Euler( rotationFromX.getValue() * THREE.Math.DEG2RAD, rotationFromY.getValue() * THREE.Math.DEG2RAD, rotationFromZ.getValue() * THREE.Math.DEG2RAD );
			var toRotation = new THREE.Euler( rotationToX.getValue() * THREE.Math.DEG2RAD, rotationToY.getValue() * THREE.Math.DEG2RAD, rotationToZ.getValue() * THREE.Math.DEG2RAD );
			var tween = new TWEEN.Tween(newRotation)
			.to(toRotation, durationTime)
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
		}else {
			var startScale = new THREE.Vector3( scaleFromX.getValue(), scaleFromY.getValue(), scaleFromZ.getValue() );
			var newScale = new THREE.Vector3( scaleFromX.getValue(), scaleFromY.getValue(), scaleFromZ.getValue() );
			var toScale = new THREE.Vector3( scaleToX.getValue(), scaleToY.getValue(), scaleToZ.getValue() );
			var tween = new TWEEN.Tween(newScale)
			.to(toScale, durationTime)
			.onUpdate(function() { 
				object.scale.copy( newScale );
				object.updateMatrixWorld( true );
			//	signals.objectChanged.dispatch( object );
		
			}).onComplete(function(){
				signals.stopAnimation.dispatch();
				object.scale.copy( startScale );
				object.updateMatrixWorld( true );
			//	signals.objectChanged.dispatch( object );
		
			})
			.start();
			signals.startAnimation.dispatch( );
		}


	}


	function storeAnimation(){
		var object = editor.selected;
		if( currAnimationType == null ||  object == null  ) { alert( "please choose an animation type" ); return; }
		var parentAnimation = parentAnimations.getValue();
		var startType = order.getValue();
		console.log(parentAnimation);
		if(startType == 'with' && parentAnimation != '') {
			parentAnimation = editor.animations.animations[parentAnimation].parent;
			console.log('parent id', parentAnimation);
		}
		var durationTime = duration.getValue();
		var from = null;
		var to = null;
		var name = animationName.getValue();
		var repeatTime = repeat.getValue();
		var delayTime = delay.getValue(); 
		if( currAnimationType == "Translation" ) {
			from = new THREE.Vector3( startPositionX.getValue(), startPositionY.getValue(), startPositionZ.getValue() );
			to = new THREE.Vector3( endPositionX.getValue(), endPositionY.getValue(), endPositionZ.getValue() );
		}else if( currAnimationType == "Rotation" ) {
			from = new THREE.Euler( rotationFromX.getValue() * THREE.Math.DEG2RAD, rotationFromY.getValue() * THREE.Math.DEG2RAD, rotationFromZ.getValue() * THREE.Math.DEG2RAD );
			to = new THREE.Euler( rotationToX.getValue() * THREE.Math.DEG2RAD, rotationToY.getValue() * THREE.Math.DEG2RAD, rotationToZ.getValue() * THREE.Math.DEG2RAD );
		}else {
			from = new THREE.Vector3( scaleFromX.getValue(), scaleFromY.getValue(), scaleFromZ.getValue() );
			to = new THREE.Vector3( scaleToX.getValue(), scaleToY.getValue(), scaleToZ.getValue() );
		}
		editor.execute( new AddAnimationCommand( new Animation( name, object.uuid, currAnimationType, parentAnimation, startType, delayTime, repeatTime, durationTime, from, to ) ) );

	}

	function refreshUI(){
		var animations = editor.animations.animations;
		var options = {};
		for ( var key in animations) {
			if (animations.hasOwnProperty(key)) {

				options[key] = animations[key].name;
			}

		}
		console.log(options);
		parentAnimations.setOptions(options);
	}
	
	//refreshUI();
	signals.animationChanged.add( refreshUI );

	signals.editorCleared.add( refreshUI );

	signals.sceneGraphChanged.add( refreshUI );
	return container;
};
