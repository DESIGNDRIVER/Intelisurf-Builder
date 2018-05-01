/**
 * @author mrdoob / http://mrdoob.com/
 */

Menubar.CameraType = function ( editor ) {

	var fov = this.fov = 0;
	var aspect = this.aspect = 0;
	var config = editor.config;
	var signals = editor.signals;

	var container = new UI.Panel();
	container.setClass( 'menu' );

	var title = new UI.Panel();
	title.setClass( 'title' );
	title.setTextContent( 'Camera Type' );
	container.add( title );

	var options = new UI.Panel();
	options.setClass( 'options' );
	container.add( options );

	var changeEvent = { type: 'change' };

	//perspective camera

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( "Perspective camera" );
	option.onClick( function () {
		if (editor.camera instanceof THREE.OrthographicCamera) {

			var near = editor.camera.near;
			var far = editor.camera.far;

			var position = editor.camera.position.clone();
			var rotation = editor.camera.rotation.clone();

			editor.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
			editor.camera.position.set(position.x,position.y,position.z);
			editor.camera.rotation.set(rotation.x,rotation.y,rotation.z);
			signals.cameraChanged.dispatch();

		}
	} );
	options.add( option );


	// Bottom View

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( "Orthographic Camera" );
	option.onClick( function () {
		if (editor.camera instanceof THREE.PerspectiveCamera) {
			console.log(editor.camera);
			fov = editor.camera.fov;
			aspect = editor.camera.aspect;
			var near = editor.camera.near;
			var far = editor.camera.far;
			var zoom = editor.camera.zoom;




			var position = editor.camera.position.clone();
			var rotation = editor.camera.rotation.clone();

			// var hyperfocus = ( near + far ) / 2;

			// var halfHeight = Math.tan( fov / 2 ) * hyperfocus;
			// var planeHeight = 2 * halfHeight;
			// var planeWidth = planeHeight * aspect;
			// var halfWidth = planeWidth / 2;

			// halfHeight /= 1;
			// halfWidth /= 1

			var hyperfocus = ( near + far ) / 2;
			var halfHeight = Math.tan( fov * Math.PI / 180 / 2 ) * hyperfocus;
			var planeHeight = 2 * halfHeight;
			var planeWidth = planeHeight * aspect;
			var halfWidth = planeWidth / 2;
			
			halfHeight /= ((far/25)*zoom);
			halfWidth /= ((far/25)*zoom);
			
			//console.log(hyperfocus,halfHeight,planeHeight,planeWidth,halfWidth);
			// this.cameraO.left = -halfWidth;
			// this.cameraO.right = halfWidth;
			// this.cameraO.top = halfHeight;
			// this.cameraO.bottom = -halfHeight;
			newfar = far+((far/25)*zoom)-0.5;
			editor.camera = new THREE.OrthographicCamera(-halfWidth, halfWidth,halfHeight,-halfHeight, near, far );
			editor.camera.position.set(position.x,position.y,position.z);
			editor.camera.rotation.set(rotation.x,rotation.y,rotation.z);
			//editor.camera = camera.clone();
			signals.cameraChanged.dispatch();
			console.log(editor.camera);
			//console.log(camera);
			
			// camera.lookAt(scene.position);
		 }

	} );
	options.add( option );



	return container;
}