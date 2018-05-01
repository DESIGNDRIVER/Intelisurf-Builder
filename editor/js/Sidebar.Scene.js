/**
 * @author mrdoob / http://mrdoob.com/
 */

Sidebar.Scene = function ( editor ) {

    console.log("Sidebar.Scene.js: Sidebar.Scene");

	var signals = editor.signals;

	var container = new UI.Panel();
	container.setBorderTop( '0' );
	container.setPaddingTop( '20px' );
	var prevEnvMap = null;
	var preBackground = null;

	// outliner   
	function buildOption( object, draggable ) {

		var option = document.createElement( 'div' );
		option.draggable = draggable;
		option.innerHTML = buildHTML( object );
		option.value = object.id;

		return option;      
	}

	function getMaterialName( material ) {

		if ( Array.isArray( material ) ) {

			var array = [];

			for ( var i = 0; i < material.length; i ++ ) {

				array.push( material[ i ].name );

			}

			return array.join( ',' );

		}

		return material.name;

	}

	function buildHTML( object ) {

		var html = '<span class="type ' + object.type + '"></span> ' + object.name;

		if ( object instanceof THREE.Mesh ) {

			var geometry = object.geometry;
			var material = object.material;

			html += ' <span class="type ' + geometry.type + '"></span> ' + geometry.name;
			html += ' <span class="type ' + material.type + '"></span> ' + getMaterialName( material );

		}

		html += getScript( object.uuid );

		return html;

	}

	function getScript( uuid ) {

		if ( editor.scripts[ uuid ] !== undefined ) {

			return ' <span class="type Script"></span>';

		}

		return '';

	}

	var ignoreObjectSelectedSignal = false;

	var outliner = new UI.Outliner( editor );

	outliner.setId( 'outliner' );

	outliner.onChange( function () {

		ignoreObjectSelectedSignal = true;

		editor.selectById( parseInt( outliner.getValue() ) );

		ignoreObjectSelectedSignal = false;

	} );

	outliner.onDblClick( function () {   
		editor.focusById( parseInt( outliner.getValue() ) );      
	} );

	container.add( outliner );
	container.add( new UI.Break() );

	// Set Background   
	var sceneBackgroundRow = new UI.Row();
	var sceneBackgroundEnabled = new UI.Checkbox( true ).onChange( onBackgroundChanged );
	var sceneBackground = new UI.Texture( ).onChange( onBackgroundChanged );
	   
	sceneBackgroundRow.add( new UI.Text( 'Background' ).setWidth( '90px' ) );
	sceneBackgroundRow.add( sceneBackgroundEnabled );
	sceneBackgroundRow.add( sceneBackground );
   
	container.add( sceneBackgroundRow );

	function onBackgroundChanged(){

        console.log("Sidebar.Scene.js: onBackgroundChanged");

		var backgroundEnabled = sceneBackgroundEnabled.getValue() === true;

				var newBackground = backgroundEnabled ? sceneBackground.getValue() : null;

                console.log("Sidebar.Scene.js: onBackgroundChanged newBackground");
                console.log(newBackground);

				if ( preBackground != newBackground ) {
					editor.scene.background = newBackground;

                    // TODO: Create Sphere Here Instead of Editor Background

					preBackground = newBackground;
					signals.sceneGraphChanged.dispatch();

                    render();
				}            
	}

	// function onBackgroundChanged() {

	// 	signals.sceneBackgroundChanged.dispatch( backgroundColor.getHexValue() );
	// 	console.log(backgroundColor.getHexValue());

	// }

	// var backgroundRow = new UI.Row();

	// var backgroundColor = new UI.Color().setValue( '#aaaaaa' ).onChange( onBackgroundChanged );

	// backgroundRow.add( new UI.Text( 'Background' ).setWidth( '90px' ) );
	// backgroundRow.add( backgroundColor );

	// container.add( backgroundRow );


	// envMap
	var materialEnvMapRow = new UI.Row();
	var materialEnvMapEnabled = new UI.Checkbox( false ).onChange( envMapUpdate );
	var materialEnvMap = new UI.Texture( THREE.SphericalReflectionMapping ).onChange( envMapUpdate );
	var materialReflectivity = new UI.Number( 1 ).setWidth( '30px' ).onChange( envMapUpdate );

	materialEnvMapRow.add( new UI.Text( 'Env Map' ).setWidth( '90px' ) );
	materialEnvMapRow.add( materialEnvMapEnabled );
	materialEnvMapRow.add( materialEnvMap );
	materialEnvMapRow.add( materialReflectivity );

	container.add( materialEnvMapRow );

	function envMapUpdate(){

        console.log("Sidebar.Scene.js: envMapUpdate");

		var envMapEnabled = materialEnvMapEnabled.getValue() === true;

				var envMap = envMapEnabled ? materialEnvMap.getValue() : null;

				if ( prevEnvMap !== envMap ) {
					editor.scene.traverse( function ( child ) {
						if (child.type == 'Mesh') {
							console.log("Update Child");
							console.log(child);
							if (child.name != 'Intelisurf-Background')
								editor.execute( new SetMaterialMapCommand( child, 'envMap', envMap, 0 ) );
						}
			
					} );

					prevEnvMap = envMap;
					//editor.execute( new SetMaterialMapCommand( currentObject, 'envMap', envMap, currentMaterialSlot ) );

				}

	}

	// fog

	// function onFogChanged() {

	// 	signals.sceneFogChanged.dispatch(
	// 		fogType.getValue(),
	// 		fogColor.getHexValue(),
	// 		fogNear.getValue(),
	// 		fogFar.getValue(),
	// 		fogDensity.getValue()
	// 	);

	// }

	// var fogTypeRow = new UI.Row();
	// var fogType = new UI.Select().setOptions( {

	// 	'None': 'None',
	// 	'Fog': 'Linear',
	// 	'FogExp2': 'Exponential'

	// } ).setWidth( '150px' );
	// fogType.onChange( function () {

	// 	onFogChanged();
	// 	refreshFogUI();

	// } );

	// fogTypeRow.add( new UI.Text( 'Fog' ).setWidth( '90px' ) );
	// fogTypeRow.add( fogType );

	// container.add( fogTypeRow );

	// // fog color

	// var fogPropertiesRow = new UI.Row();
	// fogPropertiesRow.setDisplay( 'none' );
	// fogPropertiesRow.setMarginLeft( '90px' );
	// container.add( fogPropertiesRow );

	// var fogColor = new UI.Color().setValue( '#aaaaaa' );
	// fogColor.onChange( onFogChanged );
	// fogPropertiesRow.add( fogColor );

	// // fog near

	// var fogNear = new UI.Number( 0.1 ).setWidth( '40px' ).setRange( 0, Infinity ).onChange( onFogChanged );
	// fogPropertiesRow.add( fogNear );

	// // fog far

	// var fogFar = new UI.Number( 50 ).setWidth( '40px' ).setRange( 0, Infinity ).onChange( onFogChanged );
	// fogPropertiesRow.add( fogFar );

	// // fog density

	// var fogDensity = new UI.Number( 0.05 ).setWidth( '40px' ).setRange( 0, 0.1 ).setPrecision( 3 ).onChange( onFogChanged );
	// fogPropertiesRow.add( fogDensity );

	// //

	function refreshUI() {

		var camera = editor.camera;
		var scene = editor.scene;

		var options = [];

		options.push( buildOption( camera, false ) );
		options.push( buildOption( scene, false ) );

		( function addObjects( objects, pad ) {

			for ( var i = 0, l = objects.length; i < l; i ++ ) {

				var object = objects[ i ];

				var option = buildOption( object, true );
				option.style.paddingLeft = ( pad * 10 ) + 'px';
				options.push( option );

				addObjects( object.children, pad + 1 );

			}

		} )( scene.children, 1 );

		outliner.setOptions( options );

		if ( editor.selected !== null ) {

			outliner.setValue( editor.selected.id );

		}

        console.log("Sidebar.Scene.js: refreshUI scene.background");
		console.log(scene.background);

		// if ( scene.background ) {

		// 	backgroundColor.setHexValue( scene.background.getHex() );

		// }

		// if ( scene.fog ) {

		// 	fogColor.setHexValue( scene.fog.color.getHex() );

		// 	if ( scene.fog instanceof THREE.Fog ) {

		// 		fogType.setValue( "Fog" );
		// 		fogNear.setValue( scene.fog.near );
		// 		fogFar.setValue( scene.fog.far );

		// 	} else if ( scene.fog instanceof THREE.FogExp2 ) {

		// 		fogType.setValue( "FogExp2" );
		// 		fogDensity.setValue( scene.fog.density );

		// 	}

		// } else {

		// 	fogType.setValue( "None" );

		// }

		// refreshFogUI();

	}

	// function refreshFogUI() {

	// 	var type = fogType.getValue();

	// 	fogPropertiesRow.setDisplay( type === 'None' ? 'none' : '' );
	// 	fogNear.setDisplay( type === 'Fog' ? '' : 'none' );
	// 	fogFar.setDisplay( type === 'Fog' ? '' : 'none' );
	// 	fogDensity.setDisplay( type === 'FogExp2' ? '' : 'none' );

	// }

    console.log("Sidebar.Scene.js: call refreshUI");
	refreshUI();

	// events

	signals.editorCleared.add( refreshUI );

	signals.sceneGraphChanged.add( refreshUI );

	signals.objectChanged.add( function ( object ) {

		var options = outliner.options;

		for ( var i = 0; i < options.length; i ++ ) {

			var option = options[ i ];

			if ( option.value === object.id ) {

				option.innerHTML = buildHTML( object );
				return;

			}

		}

	} );

	signals.objectSelected.add( function ( object ) {

		if ( ignoreObjectSelectedSignal === true ) return;

		outliner.setValue( object !== null ? object.id : null );

	} );

	return container;

};
