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
		//signals.thereWasAChangeThatWeWouldLikeToSave.dispatch();
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
	
	// UI BANNER
	console.log("Sidebar.Project.js: adding uibanner UI uibanner.getEnabled()=" + uibanner.getEnabled());
	console.log(uibanner);
	var uibannerRow = new UI.Row();
	{
		var uibannerEnabled = new UI.Checkbox( uibanner.getEnabled()).onChange( uibannerUpdate );
		var uibannerTexture = new UI.Texture( THREE.SphericalReflectionMapping ).onChange( uibannerUpdate );
		console.log("Sidebar.Project.js: setting uibannerdomhidden: " + !uibannerEnabled.getValue());
		uibanner.dom.hidden = !uibannerEnabled.getValue();
		uibannerRow.add( new UI.Text( 'UI Banner' ).setWidth( '90px' ) );
		uibannerRow.add( uibannerEnabled );
		uibannerRow.add( uibannerTexture );
	}
	container.add( uibannerRow );
	var uibannerRow2 = new UI.Row();
	{
		var uibannerHeight = new UI.Input( editor.config.getKey(UIBuilder_Keys_Banner_Height)).setWidth( '50px' ).onChange( uibannerUpdate );
		uibannerRow2.add( new UI.Text( 'Height' ).setWidth( '50px' ) );
		uibannerRow2.add( uibannerHeight );
		var uibannerColor = new UI.Color( editor.config.getKey(UIBuilder_Keys_Banner_BGColor)).onChange( uibannerUpdate );
		uibannerRow2.add( new UI.Text( '' ).setWidth( '10px' ) ); // spacer
		uibannerRow2.add( new UI.Text( 'BGColor' ).setWidth( '50px' ) );
		uibannerRow2.add( new UI.Text( '' ).setWidth( '10px' ) ); // spacer
		uibannerRow2.add( uibannerColor );
	}
	container.add( uibannerRow2 );
	
	signals.editorCleared.add(updateFromConfig);
	signals.editorStorageGet.add(updateFromConfig);
	
	function uibannerUpdate(){
		// Update UI Banner based on what is happening in the UI
		
        console.log("Sidebar.Project.js: uibannerUpdate Begin: uibanner.getEnabled=" + uibanner.getEnabled());
        //console.log(uibannerTexture);
        console.log(uibanner);
        
        // Get Enabled, Texture & TextureName Values From UI Controls
        var uibanner_enabled = uibannerEnabled.getValue();
        var uibanner_texture = uibannerTexture.texture.image.src;
        var uibanner_texturename = uibannerTexture.texture.sourceFile;
        var uibanner_height = uibannerHeight.getValue();
        var uibanner_color = uibannerColor.getValue();
        
        // Save Enabled, Texture & Texture Name Values in Config
        config.setKey(UIBuilder_Keys_Banner_Enabled, uibanner_enabled);
        config.setKey(UIBuilder_Keys_Banner_Image, uibanner_texture);
        config.setKey(UIBuilder_Keys_Banner_ImageName, uibanner_texturename);
        config.setKey(UIBuilder_Keys_Banner_Height, uibanner_height);
        config.setKey(UIBuilder_Keys_Banner_BGColor, uibanner_color);
        
        // Set Value of Image Preview In Viewport
        if (uibannerTexture.texture.image != undefined)
        {
        	uibannerTexture.texture.image.src.sourceFile = uibanner_texturename;
        	console.log("Sidebar.Project.js: uibannerUpdate: imageSrc=" + uibanner_texture + " imageName=" + uibanner_texturename);
        	uibanner.setValue(uibannerTexture.texture.image.src);
        	uibanner.setHeight(uibanner_height);
        	uibanner.dom.style.backgroundColor = uibanner_color;
		}
       
        // Set UI Control Hidden
        uibanner.dom.hidden = !uibanner_enabled;
        
        console.log("Sidebar.Project.js: uibannerUpdate End: uibanner.getEnabled=" + uibanner.getEnabled());
        
		signals.thereWasAChangeThatWeWouldLikeToSave.dispatch();
		
		updateRenderer();
	}
	
	function updateFromConfig()
	{
		// Read Config and update the user interface and viewport based on what is in the config store
		console.log("Sidebar.Project.js: updateFromConfig: Begin: uibanner.getEnabled()="+uibanner.getEnabled());
		
		uibannerEnabled.setValue(editor.config.getKey(UIBuilder_Keys_Banner_Enabled));
	
		var image = document.createElement( 'img' );
		image.src = editor.config.getKey(UIBuilder_Keys_Banner_Image);
		var texture = new Object();
		texture.image = image;
		uibannerTexture.setValue(texture);
		uibannerTexture.setName(editor.config.getKey(UIBuilder_Keys_Banner_ImageName));
		var uibt = uibannerTexture.texture.image.src;
		
		if (uibannerTexture.texture.image != undefined)
        	uibanner.setValue(uibt);
		
		uibanner.dom.hidden = !uibanner.getEnabled();
		
		console.log("Sidebar.Project.js: updateFromConfig: End: uibannerHidden=" + uibanner.dom.hidden + " imageName=" + editor.config.getKey(UIBuilder_Keys_Banner_ImageName));
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
