/**
 * @author mrdoob / http://mrdoob.com/
 */

Sidebar.Properties = function ( editor ) {

//	var isAnimationMode = false;

	var signals = editor.signals;

	var container = new UI.Span();

	var objectTab = new UI.Text( 'OBJECT' ).onClick( onClick );
	//var geometryTab = new UI.Text( 'GEOMETRY' ).onClick( onClick );
	var textureTab = new UI.Text( 'TEXTURE' ).onClick( onClick );
	var materialTab = new UI.Text( 'MATERIAL' ).onClick( onClick );

	var tabs = new UI.Div();
	tabs.setId( 'tabs' );
	//tabs.add( objectTab, geometryTab, materialTab );
	tabs.add( objectTab, textureTab, materialTab );
	container.add( tabs );

	function onClick( event ) {

		select( event.target.textContent );

	}

	//

	var object = new UI.Span().add(
		new Sidebar.Object( editor )
	);
	container.add( object );

	// var geometry = new UI.Span().add(
	// 	new Sidebar.Geometry( editor )
	// );
	//container.add( geometry );
	
	var texture = new UI.Span().add(
		new Sidebar.Texture( editor )
	);
	container.add( texture );

	var material = new UI.Span().add(
		new Sidebar.Material( editor )
	);
	container.add( material );

	//

	function select( section ) {

		objectTab.setClass( '' );
		//geometryTab.setClass( '' );
		textureTab.setClass( '' );
		materialTab.setClass( '' );

		object.setDisplay( 'none' );
		//geometry.setDisplay( 'none' );
		texture.setDisplay( 'none' );
		material.setDisplay( 'none' );

		switch ( section ) {
			case 'OBJECT':
				objectTab.setClass( 'selected' );
				object.setDisplay( '' );
				break;
			case 'GEOMETRY':
				geometryTab.setClass( 'selected' );
				geometry.setDisplay( '' );
				break;
			case 'TEXTURE':
				textureTab.setClass( 'selected' );
				texture.setDisplay( '' );
				console.log("afafds");
				break;
			case 'MATERIAL':
				materialTab.setClass( 'selected' );
				material.setDisplay( '' );
				break;
		}

	}

	select( 'OBJECT' );

	return container;

};
