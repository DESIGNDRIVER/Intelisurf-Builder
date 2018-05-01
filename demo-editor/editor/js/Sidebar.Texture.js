/**
 * @author mrdoob / http://mrdoob.com/
 */

Sidebar.Texture = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.Panel();
	container.setBorderTop( '0' );
	container.setPaddingTop( '20px' );
	container.setDisplay('none');	

	var form = document.createElement( 'form' );
	form.style.display = 'none';
	document.body.appendChild( form );

	// import texture

	// signals.startAnimation.add( function (bool) {

	// 	if ( bool ) { 
	// 		container.setDisplay( 'none' ); 
	// 	}
	// 	else { 
	// 		container.setDisplay("");
	// 	}
	// } );

	// map

	// var materialMapRow = new UI.Row();
	// var materialMapEnabled = new UI.Checkbox( false );
	// var materialMap = new UI.Texture();

	// materialMapRow.add( new UI.Text( 'Import' ).setWidth( '90px' ) );
	// // materialMapRow.add( materialMapEnabled );
	// materialMapRow.add( materialMap ).onChange(fa);

	// container.add( materialMapRow );
	
	// function fa(){


	// };

	var fileInput = document.createElement( 'input' );
	fileInput.type = 'file';
	fileInput.addEventListener( 'change', function ( event ) {


		var reader = new FileReader();

		reader.onload = function (e) {
				var texture = new THREE.TextureLoader().load(e.target.result, function(){
				var material = editor.selected.material;
				texture.wrapS = THREE.RepeatWrapping;
				texture.wrapT = THREE.RepeatWrapping;
			// 	texture.repeat.set( 4, 4 );
				console.log(texture);
				material.map = texture;
				importTexture.setValue( editor.selected.material.map );
				
				material.needsUpdate = true;
				editor.signals.materialChanged.dispatch( editor.selected.material );
				
			});


		};
		reader.readAsDataURL(fileInput.files[0]);
		form.reset();

	} );
	form.appendChild( fileInput );

	var importTextureRow = new UI.Row();
	var importTexture = new UI.Input().setWidth( '150px' ).setFontSize( '12px' ).onClick( function () {

		fileInput.click();

	} );
	importTextureRow.add( new UI.Text( 'Import' ).setWidth( '90px' ) );
	importTextureRow.add( importTexture );

	container.add( importTextureRow );



	

	function build() {

		var object = editor.selected;

		if ( object && object.geometry ) {

			// var geometry = object.geometry;
			container.setDisplay( '' );
			console.log(object);
			// container.setDisplay( 'block' );

			// geometryType.setValue( geometry.type );

			// geometryUUID.setValue( geometry.uuid );
			// geometryName.setValue( geometry.name );

			// //

			// parameters.clear();

			// if ( geometry.type === 'BufferGeometry' || geometry.type === 'Geometry' ) {

			// 	parameters.add( new Sidebar.Geometry.Modifiers( editor, object ) );

			// } else if ( Sidebar.Geometry[ geometry.type ] !== undefined ) {

			// 	parameters.add( new Sidebar.Geometry[ geometry.type ]( editor, object ) );

			// }

		} else {

			container.setDisplay( 'none' );

		}

	}



	signals.objectSelected.add( build );
	signals.geometryChanged.add( build );



	return container;

};




