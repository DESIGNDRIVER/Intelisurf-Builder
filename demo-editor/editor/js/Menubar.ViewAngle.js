/**
 * @author mrdoob / http://mrdoob.com/
 */

Menubar.ViewAngle = function ( editor ) {

	//var camera = editor.camera;
	var config = editor.config;
	var signals = editor.signals;

	var container = new UI.Panel();
	container.setClass( 'menu' );

	var title = new UI.Panel();
	title.setClass( 'title' );
	title.setTextContent( 'View Angle' );
	container.add( title );

	var options = new UI.Panel();
	options.setClass( 'options' );
	container.add( options );

	var changeEvent = { type: 'change' };

	// Top View

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( "Top" );
	option.onClick( function () {
		editor.camera.position.set( 0, 10, 0 );
		editor.camera.lookAt( new THREE.Vector3(0, 0, 0) );
		signals.cameraChanged.dispatch( 'change' );

	} );
	options.add( option );


	// Bottom View

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( "Bottom" );
	option.onClick( function () {
		editor.camera.position.set( 0, -10, 0 );
		editor.camera.lookAt( new THREE.Vector3(0, 0, 0) );
		signals.cameraChanged.dispatch( 'change' );
	} );
	options.add( option );


	// Left View

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( "Left" );
	option.onClick( function () {
		editor.camera.position.set( -10, 0, 0 );
		editor.camera.lookAt( new THREE.Vector3(0, 0, 0) );
		signals.cameraChanged.dispatch( 'change' );
	} );
	options.add( option );


	// Right View

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( "Right" );
	option.onClick( function () {
		editor.camera.position.set( 10, 0, 0 );
		editor.camera.lookAt( new THREE.Vector3(0, 0, 0) );
		signals.cameraChanged.dispatch( 'change' );
	} );
	options.add( option );


	// Front View

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( "Front" );
	option.onClick( function () {
		editor.camera.position.set( 0, 0, -10 );
		editor.camera.lookAt( new THREE.Vector3(0, 0, 0) );
		signals.cameraChanged.dispatch( 'change' );
	} );
	options.add( option );


	// Back View

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( "Back" );
	option.onClick( function () {
		editor.camera.position.set( 0, 0, 10 );
		editor.camera.lookAt( new THREE.Vector3(0, 0, 0) );
		signals.cameraChanged.dispatch( 'change' );
	} );
	options.add( option );
	return container;
}