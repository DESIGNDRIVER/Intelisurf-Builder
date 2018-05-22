/**
 * @author mrdoob / http://mrdoob.com/
 */

Sidebar.Project = function ( editor ) {

	var config = editor.config;
	var signals = editor.signals;

	var rendererTypes = {

		'WebGLRenderer': THREE.WebGLRenderer,
		'CanvasRenderer': THREE.CanvasRenderer,
		'SVGRenderer': THREE.SVGRenderer,
		'SoftwareRenderer': THREE.SoftwareRenderer,
		'RaytracingRenderer': THREE.RaytracingRenderer

	};

	var container = new UI.Panel();
	container.setBorderTop( '0' );
	container.setPaddingTop( '20px' );

	// Title

	var titleRow = new UI.Row();
	var title = new UI.Input( config.getKey( 'project/title' ) ).setLeft( '100px' ).onChange( function () {

		config.setKey( 'project/title', this.getValue() );
		signals.thereWasAChangeThatWeWouldLikeToSave.dispatch();

	} );

	titleRow.add( new UI.Text( 'Title' ).setWidth( '90px' ) );
	titleRow.add( title );

	container.add( titleRow );

	// Editable

	var editableRow = new UI.Row();
	var editable = new UI.Checkbox( config.getKey( 'project/editable' ) ).setLeft( '100px' ).onChange( function () {

		config.setKey( 'project/editable', this.getValue() );
		signals.thereWasAChangeThatWeWouldLikeToSave.dispatch();

	} );

	editableRow.add( new UI.Text( 'Editable' ).setWidth( '90px' ) );
	editableRow.add( editable );

	container.add( editableRow );

	// VR

	var vrRow = new UI.Row();
	var vr = new UI.Checkbox( config.getKey( 'project/vr' ) ).setLeft( '100px' ).onChange( function () {

		config.setKey( 'project/vr', this.getValue() );
		signals.thereWasAChangeThatWeWouldLikeToSave.dispatch();

	} );

	vrRow.add( new UI.Text( 'VR' ).setWidth( '90px' ) );
	vrRow.add( vr );

	container.add( vrRow );

	// Renderer

	var options = {};

	for ( var key in rendererTypes ) {

		if ( key.indexOf( 'WebGL' ) >= 0 && System.support.webgl === false ) continue;

		options[ key ] = key;

	}

	var rendererTypeRow = new UI.Row();
	var rendererType = new UI.Select().setOptions( options ).setWidth( '150px' ).onChange( function () {

		var value = this.getValue();

		config.setKey( 'project/renderer', value );

		updateRenderer();

	} );

	//rendererTypeRow.add( new UI.Text( 'Renderer' ).setWidth( '90px' ) );
	//rendererTypeRow.add( rendererType );

	//container.add( rendererTypeRow );

	if ( config.getKey( 'project/renderer' ) !== undefined ) {

		rendererType.setValue( config.getKey( 'project/renderer' ) );

	}

	// Renderer / Antialias

	var rendererPropertiesRow = new UI.Row().setMarginLeft( '0px' );

	var rendererAntialias = new UI.THREE.Boolean( config.getKey( 'project/renderer/antialias' ), 'antialias' ).onChange( function () {

		config.setKey( 'project/renderer/antialias', this.getValue() );
		updateRenderer();

	} );
	//rendererPropertiesRow.add( rendererAntialias );

	// Renderer / Shadows
	
	rendererPropertiesRow.add( new UI.Text( 'Shadows' ).setWidth( '90px' ) );

	var rendererShadows = new UI.THREE.Boolean( config.getKey( 'project/renderer/shadows' )).onChange( function () {

		config.setKey( 'project/renderer/shadows', this.getValue() );
		signals.thereWasAChangeThatWeWouldLikeToSave.dispatch();
		updateRenderer();

	} );
	rendererPropertiesRow.add( rendererShadows );

	//rendererPropertiesRow.add( new UI.Break() );

	// Renderer / Gamma input

	var rendererGammaInput = new UI.THREE.Boolean( config.getKey( 'project/renderer/gammaInput' ), 'γ input' ).onChange( function () {

		config.setKey( 'project/renderer/gammaInput', this.getValue() );
		updateRenderer();

	} );
	//rendererPropertiesRow.add( rendererGammaInput );

	// Renderer / Gamma output

	var rendererGammaOutput = new UI.THREE.Boolean( config.getKey( 'project/renderer/gammaOutput' ), 'γ output' ).onChange( function () {

		config.setKey( 'project/renderer/gammaOutput', this.getValue() );
		updateRenderer();

	} );
	//rendererPropertiesRow.add( rendererGammaOutput );

	container.add( rendererPropertiesRow );
	
	var rule = new UI.HorizontalRule();
	container.add(rule);
	
	//
	var uibannerEnvMapRow = new UI.Row();
	var uibannerEnvMapEnabled = new UI.Checkbox( config.getKey(UIBuilder_Keys_Banner_Enabled) ).onChange( envMapUpdate );
	var uibannerEnvMap = new UI.Texture( THREE.SphericalReflectionMapping ).onChange( envMapUpdate );
	
	console.log("Sidebar.Project.js: setting uibannerdomhidden: " + !uibannerEnvMapEnabled.getValue());
	uibanner.dom.hidden = !uibannerEnvMapEnabled.getValue();

	uibannerEnvMapRow.add( new UI.Text( 'UI Banner' ).setWidth( '90px' ) );
	uibannerEnvMapRow.add( uibannerEnvMapEnabled );
	uibannerEnvMapRow.add( uibannerEnvMap );

	container.add( uibannerEnvMapRow );

	signals.editorStorageGet.add(updateFromConfig);
	
	function envMapUpdate(){

        console.log("Sidebar.Project.js: envMapUpdate Begin: " + config.getKey(UIBuilder_Keys_Banner_Enabled));
        console.log(uibannerEnvMap);
        console.log(uibanner);
        
        var uibanner_enabled = uibannerEnvMapEnabled.getValue();
        
        if (uibannerEnvMap.texture.image != undefined)
        	uibanner.setValue(uibannerEnvMap.texture.image.src);
        
        config.setKey( UIBuilder_Keys_Banner_Enabled, uibanner_enabled);
        
        if (uibannerEnvMap.texture.image != undefined)
        	config.setKey( UIBuilder_Keys_Banner_Image, uibannerEnvMap.texture.image.src);
        
        uibanner.dom.hidden = !uibanner_enabled;
        
		signals.thereWasAChangeThatWeWouldLikeToSave.dispatch();
		
		console.log("Sidebar.Project.js: envMapUpdate End: " + config.getKey( UIBuilder_Keys_Banner_Enabled));

		updateRenderer();
	}
	
	function updateFromConfig()
	{
		console.log("Sidebar.Project.js: updateFromConfig: " + config.getKey( 'project/ui/banner/enabled'));
		//console.log(config.getKey( 'project/ui/banner/image'));
		uibannerEnvMapEnabled.setValue(config.getKey( 'project/ui/banner/enabled'));
	
		var image = document.createElement( 'img' );
		image.src = config.getKey( 'project/ui/banner/image');
		var texture = new Object();
		texture.image = image;
		
		console.log("Sidebar.Project.js: updateFromConfig: Mid" );
		console.log(texture);
		
		uibannerEnvMap.setValue(texture);
		
		if (uibannerEnvMap.texture.image != undefined)
        	uibanner.setValue(uibannerEnvMap.texture.image.src);
		
		console.log("Sidebar.Project.js: updateFromConfig: End: " + config.getKey( 'project/ui/banner/enabled'));
	}

	function updateRenderer() {

		createRenderer( rendererType.getValue(), rendererAntialias.getValue(), rendererShadows.getValue(), rendererGammaInput.getValue(), rendererGammaOutput.getValue() );

	}

	function createRenderer( type, antialias, shadows, gammaIn, gammaOut ) {

		if ( type === 'WebGLRenderer' && System.support.webgl === false ) {

			type = 'CanvasRenderer';

		}

		//rendererPropertiesRow.setDisplay( type === 'WebGLRenderer' ? '' : 'none' );

		var renderer = new rendererTypes[ type ]( { antialias: antialias} );
		renderer.gammaInput = gammaIn;
		renderer.gammaOutput = gammaOut;
		if ( shadows && renderer.shadowMap ) {

			console.log("Sidebar.Project.js: Shadows Enabled begin");
			renderer.shadowMapEnabled = true;
			renderer.shadowMapType = THREE.PCFSoftShadowMap;
			console.log("Sidebar.Project.js: Shadows Enabled end");
		}
		else
			console.log("Sidebar.Project.js: Shadows Disabled");

		signals.rendererChanged.dispatch( renderer );
	}

	createRenderer( config.getKey( 'project/renderer' ), config.getKey( 'project/renderer/antialias' ), config.getKey( 'project/renderer/shadows' ), config.getKey( 'project/renderer/gammaInput' ), config.getKey( 'project/renderer/gammaOutput' ) );
	
	return container;

};
