/**
 * @author mrdoob / http://mrdoob.com/
 */

var Sidebar = function ( editor ) {

	var container = new UI.Panel();
	var signals = editor.signals;
	container.setId( 'sidebar' );

	//

	var sceneTab = new UI.Text( 'SCENE' ).onClick( onClick );
	var projectTab = new UI.Text( 'PROJECT' ).onClick( onClick );
	var settingsTab = new UI.Text( 'SETTINGS' ).onClick( onClick );

	var tabs = new UI.Div();
	tabs.setId( 'tabs' );
	tabs.add( sceneTab, projectTab, settingsTab );
	container.add( tabs );

	function onClick( event ) {

		select( event.target.textContent );

	}

	//
	var properties = new Sidebar.Properties( editor );
	var animationMenu = new Sidebar.AnimationMenu( editor );

	var scene = new UI.Span().add(
		new Sidebar.Scene( editor ),
		properties,
		animationMenu,
		//new Sidebar.Script( editor )
	);
	container.add( scene );


	signals.animationMode.add( function (bool) {

		if ( bool ) { 
			properties.setDisplay( 'none' ); 
			animationMenu.setDisplay('');
		}
		else { 
			properties.setDisplay('');
			animationMenu.setDisplay( 'none' ); 
		}
	} );
	var project = new UI.Span().add(
		new Sidebar.Project( editor )
	);
	container.add( project );

	var settings = new UI.Span().add(
		new Sidebar.Settings( editor ),
		new Sidebar.History( editor )
	);
	container.add( settings );

	//

	function select( section ) {

		sceneTab.setClass( '' );
		projectTab.setClass( '' );
		settingsTab.setClass( '' );

		scene.setDisplay( 'none' );
		project.setDisplay( 'none' );
		settings.setDisplay( 'none' );

		switch ( section ) {
			case 'SCENE':
				sceneTab.setClass( 'selected' );
				scene.setDisplay( '' );
				break;
			case 'PROJECT':
				projectTab.setClass( 'selected' );
				project.setDisplay( '' );
				break;
			case 'SETTINGS':
				settingsTab.setClass( 'selected' );
				settings.setDisplay( '' );
				break;
		}

	}

	select( 'SCENE' );

	return container;

};
