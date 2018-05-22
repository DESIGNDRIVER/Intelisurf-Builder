/**
 * @author mrdoob / http://mrdoob.com/
 */

Sidebar.Settings = function ( editor ) {

	console.log("Sidebar.Settings.js: Sidebar.Settings Begin");
	
	var config = editor.config;
	var signals = editor.signals;

	var container = new UI.Panel();
	container.setBorderTop( '0' );
	container.setPaddingTop( '20px' );

	var options = {
		'css/light.css': 'light',
		'css/dark.css': 'dark'
	};

	var themeRow = new UI.Row();
	var theme = new UI.Select().setWidth( '150px' );
	theme.setOptions( options );

	editor.setTheme( 'css/dark.css' );
	editor.config.setKey( 'theme', 'css/dark.css' );
	
	console.log("Sidebar.Settings.js: Sidebar.Settings End");

	return container;
};
