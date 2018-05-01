/**
 * @author mrdoob / http://mrdoob.com/
 */

Sidebar.Settings = function ( editor ) {

	console.log("Sidebar.Settings.js: Sidebar.Settings");
	
	var config = editor.config;
	var signals = editor.signals;

	var container = new UI.Panel();
	container.setBorderTop( '0' );
	container.setPaddingTop( '20px' );

	// class

	var options = {
		'css/light.css': 'light',
		'css/dark.css': 'dark'
	};

	var themeRow = new UI.Row();
	var theme = new UI.Select().setWidth( '150px' );
	theme.setOptions( options );

	editor.setTheme( 'css/dark.css' );
	editor.config.setKey( 'theme', 'css/dark.css' );

//  This code allowed the theme to be picked from either dark or light
//
//	if ( config.getKey( 'theme' ) !== undefined ) {
//
//		console.log("Sidebar.Settings.js: Sidebar.Settings themeFound: " +  config.getKey( 'theme' ));
//		theme.setValue( config.getKey( 'theme' ) );
//	}
//
//	theme.onChange( function () 
//	{
//		var value = this.getValue();
//		
//		console.log("Sidebar.Settings.js: Sidebar.Settings theme.onChange: " + value);
//
//		editor.setTheme( 'css/dark.css' );
//		editor.config.setKey( 'theme', value );
//	} );
//
//	themeRow.add( new UI.Text( 'Theme' ).setWidth( '90px' ) );
//	themeRow.add( theme );
//
//	container.add( themeRow );

	return container;

};
