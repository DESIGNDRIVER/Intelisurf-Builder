/**
 * @author mrdoob / http://mrdoob.com/
 */

var Toolbar = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.Panel();
	container.setId( 'toolbar' );

	var buttons = new UI.Panel();
	container.add( buttons );
	
	// translate / rotate / scale

	var translate = new UI.Button( 'translate' );
	translate.dom.title = 'W';
	translate.dom.className = 'Button selected';
	translate.onClick( function () {

		signals.transformModeChanged.dispatch( 'translate' );

	} );
	buttons.add( translate );

	var rotate = new UI.Button( 'rotate' );
	rotate.dom.title = 'E';
	rotate.onClick( function () {

		signals.transformModeChanged.dispatch( 'rotate' );

	} );
	buttons.add( rotate );

	var scale = new UI.Button( 'scale' );
	scale.dom.title = 'R';
	scale.onClick( function () {

		signals.transformModeChanged.dispatch( 'scale' );

	} );
	buttons.add( scale );

	signals.transformModeChanged.add( function ( mode ) {

		translate.dom.classList.remove( 'selected' );
		rotate.dom.classList.remove( 'selected' );
		scale.dom.classList.remove( 'selected' );

		switch ( mode ) {

			case 'translate': translate.dom.classList.add( 'selected' ); break;
			case 'rotate': rotate.dom.classList.add( 'selected' ); break;
			case 'scale': scale.dom.classList.add( 'selected' ); break;

		}

	} );

	// grid

	var grid = new UI.Number( 1000 ).setWidth( '40px' ).onChange( update );
	buttons.add( new UI.Text( 'grid: ' ) );
	buttons.add( grid );

	var snap = new UI.THREE.Boolean( false, 'snap' ).onChange( update );
	buttons.add( snap );

	var local = new UI.THREE.Boolean( false, 'local' ).onChange( update );
	buttons.add( local );

	var showGrid = new UI.THREE.Boolean( true, 'show' ).onChange( update );
	buttons.add( showGrid );

	var animationMode = new UI.Button( 'Animation Editor' ).onClick(animationUpdate);
	animationMode.dom.title = 'S';
	buttons.add( animationMode );
	
	//editor.addObject(editor.animationCamera);
	
	//change the GUI and camera when go in to animation Editor
	function animationUpdate(){

		if ( animationMode.dom.classList.contains('selected')){
			animationMode.dom.classList.remove( 'selected' );
			//signals.enterAnimationCamera.dispatch(false);
			//editor.scene = editor.sceneBackup;
			
			signals.animationMode.dispatch(false);
		} else{
			//editor.execute( new DisplayObjectCommand( editor.animationCamera ) );
			//if(editor.scene.getObjectByName( "animationCamera") == undefined) editor.execute( new AddObjectCommand( editor.animationCamera ) );
			//editor.copyScene();
			animationMode.dom.classList.add( 'selected' );

			//signals.enterAnimationCamera.dispatch(true);
			signals.animationMode.dispatch(true);
		}

	}
	function update() {

		signals.snapChanged.dispatch( snap.getValue() === true ? grid.getValue() : null );
		signals.spaceChanged.dispatch( local.getValue() === true ? "local" : "world" );
		signals.showGridChanged.dispatch( showGrid.getValue() );

	}

	return container;

};
