/**
 * @author mrdoob / http://mrdoob.com/
 */

Menubar.StartAnimation = function ( editor ) {

	var config = editor.config;

	var container = new UI.Panel();
	container.setClass( 'menu' );

	var title = new UI.Button( 'Start Animation' );
	container.add( title );

	title.onClick( function () {

	console.log("aaaaaaaaaaaaaaaa");

	} );
return container;
};
