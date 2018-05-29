/**
 * @author mrdoob / http://mrdoob.com/
 */

Menubar.File = function ( editor ) {

	var NUMBER_PRECISION = 6;

	function parseNumber( key, value ) {

		return typeof value === 'number' ? parseFloat( value.toFixed( NUMBER_PRECISION ) ) : value;

	}

	//

	var config = editor.config;

	var container = new UI.Panel();
	container.setClass( 'menu' );

	var title = new UI.Panel();
	title.setClass( 'title' );
	title.setTextContent( 'File' );
	container.add( title );

	var options = new UI.Panel();
	options.setClass( 'options' );
	container.add( options );

	// New

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'New' );
	option.onClick( function () {

		if ( confirm( 'Any unsaved data will be lost. Are you sure?' ) ) {

			editor.clear();

		}

	} );
	options.add( option );

	//

	options.add( new UI.HorizontalRule() );

	// Import

	var form = document.createElement( 'form' );
	form.style.display = 'none';
	document.body.appendChild( form );

	var fileInput = document.createElement( 'input' );
	fileInput.type = 'file';
	fileInput.addEventListener( 'change', function ( event ) {

		editor.loader.loadFile( fileInput.files[ 0 ] );
		form.reset();

	} );
	
	form.appendChild( fileInput );

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Import' );
	option.onClick( function () {

		fileInput.click();

	} );
	options.add( option );

	//


	options.add( new UI.HorizontalRule() );

	// Export Geometry

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Export Geometry' );
	option.onClick( function () {

		var object = editor.selected;

		if ( object === null ) {

			alert( 'No object selected.' );
			return;

		}

		var geometry = object.geometry;

		if ( geometry === undefined ) {

			alert( 'The selected object doesn\'t have geometry.' );
			return;

		}

		var output = geometry.toJSON();

		try {

			output = JSON.stringify( output, parseNumber, '\t' );
			output = output.replace( /[\n\t]+([\d\.e\-\[\]]+)/g, '$1' );

		} catch ( e ) {

			output = JSON.stringify( output );

		}

		saveString( output, 'geometry.json' );

	} );
	options.add( option );

	// Export Object

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Export Object' );
	option.onClick( function () {

		var object = editor.selected;

		if ( object === null ) {

			alert( 'No object selected' );
			return;

		}

		var output = object.toJSON();

		try {

			output = JSON.stringify( output, parseNumber, '\t' );
			output = output.replace( /[\n\t]+([\d\.e\-\[\]]+)/g, '$1' );

		} catch ( e ) {

			output = JSON.stringify( output );

		}

		saveString( output, 'model.json' );

	} );
	options.add( option );

	// Export Scene

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Export Scene' );
	option.onClick( function () {

		var output = editor.scene.toJSON();
		console.log(output);
		try {

			output = JSON.stringify( output, parseNumber, '\t' );
			output = output.replace( /[\n\t]+([\d\.e\-\[\]]+)/g, '$1' );

		} catch ( e ) {

			output = JSON.stringify( output );

		}

		saveString( output, 'scene.json' );

	} );
	options.add( option );

	//
	// Export JSONC

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Export JSONC' );
	option.onClick( function () {

		var output = editor.scene.toJSON();
		console.log(output);
		FraxGEM.jsonOBJEncoder(output); 
		try {

			output = JSON.stringify( output, parseNumber, '\t' );
			output = output.replace( /[\n\t]+([\d\.e\-\[\]]+)/g, '$1' );
			//compress and save

			compress(output);

		} catch ( e ) {
			console.log(e);
			output = JSON.stringify( output );
			//compress and save
			compress(output);


		}
		

	} );
	options.add( option );

	//
	options.add( new UI.HorizontalRule() );

	// Export GLTF

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Export GLTF' );
	option.onClick( function () {

		var exporter = new THREE.GLTFExporter();

		exporter.parse( editor.scene, function ( result ) {

			saveString( JSON.stringify( result, null, 2 ), 'scene.gltf' );

		} );


	} );
	options.add( option );

	// Export OBJ

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Export OBJ' );
	option.onClick( function () {

		var object = editor.selected;

		if ( object === null ) {

			alert( 'No object selected.' );
			return;

		}

		var exporter = new THREE.OBJExporter();

		saveString( exporter.parse( object ), 'model.obj' );

	} );
	options.add( option );

	// Export STL

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Export STL' );
	option.onClick( function () {

		var exporter = new THREE.STLExporter();

		saveString( exporter.parse( editor.scene ), 'model.stl' );

	} );
	options.add( option );

	// Export Draco
	// var option = new UI.Row();
	// option.setClass( 'option' );
	// option.setTextContent( 'Export Draco' );
	// option.onClick( function () {

	// 	var object = editor.selected;

	// 	if ( object === null ) {

	// 		alert( 'No object selected.' );
	// 		return;

	// 	}

	// 	var exporter = new THREE.DracoExporter();

	// 	saveString( exporter.parse( object ), 'model.drc' );
	

	// } );
	// options.add( option );

	//


	options.add( new UI.HorizontalRule() );

	// Publish

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Publish' );
	option.onClick( function () {

		var zip = new JSZip();

		function compressPicture(path, zip){
			JSZipUtils.getBinaryContent(path, function (err, data) {
				if(err) {
					throw err; 
				}
				zip.file(path, data, {binary:true});
			});
		}
		
		console.log(Sidebar.Project);

		compressPicture("images/safetyline_logo.png", zip);
		compressPicture("images/help_mouse_2.png", zip);
		compressPicture("images/help2.png", zip);
		compressPicture("images/download2.png", zip);
		compressPicture("images/fullscreen2.png", zip);
		compressPicture("images/LEFT ARROW.png", zip);
		compressPicture("images/RIGHT ARROW.png", zip);
		compressPicture("images/INSTALL PAUSE CIRCLE.png", zip);
		compressPicture("images/INSTALL PLAY CIRCLE.png", zip);
		compressPicture("images/CLOSE LOUVRE.png", zip);
		compressPicture("images/endInstall.png", zip);
		//
		//console.log(editor.scene);
		var output  = {}
		
		output = editor.toJSON();
		
		delete output['history'];
		
		//output.config = config.toJSON();
		
		//output.animations = editor.animations.toJSON();
		// var output = editor.toJSON();

		// output.metadata.type = 'App';
		// delete output.history;

		var vr = config.getKey('project/vr');	

		output = JSON.stringify( output, parseNumber, '\t' );
		output = output.replace( /[\n\t]+([\d\.e\-\[\]]+)/g, '$1' );

		output = "var data = " + output;
		
		var title = config.getKey( 'project/title' );

		var manager = new THREE.LoadingManager( function () {

			zip.generateAsync({type:"blob",compression: "DEFLATE"})
			.then(function(content) {
				saveAs(content, "publishedFile.zip");
			});

			//save( zip.generate( { type: 'blob' } ), ( title !== '' ? title : 'untitled' ) + '.zip' );

		} );


		

		var loader = new THREE.FileLoader( manager );

		//var imageLoader = new THREE.ImageLoader(manager);


		loader.load( 'publish.html', function ( content ) {
			if ( true ) {
				content = content.replace('<!-- <script src="js/WebVR.js"></script> -->', '<script src="js/WebVR.js"></script>');
			}
			content = content.replace( '//var data', output );
			console.log("2");
			zip.file( 'published.html', content );

		} );


		loader.load( 'js/libs/OrbitControls.js', function ( content ) {
			zip.file( 'js/OrbitControls.js', content );
			
		} );

		loader.load( '../build/three.js', function ( content ) {
			zip.file( 'js/three.js', content );
		} );

		loader.load( 'js/Animation.js', function ( content ) {
			zip.file( 'js/Animation.js', content );
		} );

		loader.load( 'js/Animations.js', function ( content ) {
			zip.file( 'js/Animations.js', content );
		} );

		loader.load( 'js/libs/Tween.js', function ( content ) {
			zip.file( 'js/Tween.js', content );
		} );
		
		loader.load( 'js/libs/progressbar/progressbar.js', function ( content ) {
			zip.file( 'js/progressbar.js', content );
		} );
		
		loader.load( 'js/PublishPlayer.js', function ( content ) {
			zip.file( 'js/PublishPlayer.js', content );
		} );

		loader.load( 'css/style.css', function ( content ) {
			zip.file( 'css/style.css', content );
		} );

		// imageLoader.load( 'images/safetyline_logo.png', function ( content ) {
		// 	console.log("1");
		// 	zip.file('images/safetyline_logo.png', content, {binary:true});

		// } );

		// imageLoader.load( 'images/help_mouse_2.png', function ( content ) {
		// 	console.log("1");
		// 	zip.file('images/help_mouse_2.png', content, {binary:true});

		// } );

		// imageLoader.load( 'images/help2.png', function ( content ) {
		// 	console.log("1");
		// 	zip.file('images/help2.png', content, {binary:true});

		// } );


	


		if ( true ) {
			loader.load( '../examples/js/vr/WebVR.js', function ( content ) {
				zip.file( 'js/WebVR.js', content );
			} );

		}

	} );
	options.add( option );

	/*
	// Publish (Dropbox)

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Publish (Dropbox)' );
	option.onClick( function () {

		var parameters = {
			files: [
				{ 'url': 'data:text/plain;base64,' + window.btoa( "Hello, World" ), 'filename': 'app/test.txt' }
			]
		};

		Dropbox.save( parameters );

	} );
	options.add( option );
	*/


	//

	var link = document.createElement( 'a' );
	link.style.display = 'none';
	document.body.appendChild( link ); // Firefox workaround, see #6594

	function save( blob, filename ) {

		link.href = URL.createObjectURL( blob );
		link.download = filename || 'data.json';
		link.click();

		// URL.revokeObjectURL( url ); breaks Firefox...

	}

	function saveString( text, filename ) {

		save( new Blob( [ text ], { type: 'text/plain' } ), filename );

	}

	return container;

	function compress(content){
		var zip = new JSZip();
		zip.file("scene.json",content);
		zip.generateAsync({type:"blob",compression: "DEFLATE"})
		.then(function(content) {
			// see FileSaver.js
			console.log("fafaf");
			saveAs(content, "scene.jsonc");
		});
	}

};
