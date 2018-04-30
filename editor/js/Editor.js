/**
 * @author mrdoob / http://mrdoob.com/
 */

var Editor = function () {

	this.DEFAULT_CAMERA = new THREE.PerspectiveCamera( 50, 1, 0.1, 10000 );
	this.DEFAULT_CAMERA.name = 'Camera';
	this.DEFAULT_CAMERA.position.set( 20, 10, 20 );
	this.DEFAULT_CAMERA.lookAt( new THREE.Vector3() );


	this.animationCamera = new THREE.PerspectiveCamera( 50, 1, 0.1, 1000 );
	this.animationCamera.name = 'animationCamera';
	this.animationCamera.position.set( 0, 10, 10 );
	this.animationCamera.lookAt( new THREE.Vector3() );
	// this.animationCamera.uuid =  THREE.Math.generateUUID();
	// this.animationCamera.display = false;
	var Signal = signals.Signal;
	this.sceneBackup = null;

	this.signals = {

		// script

		editScript: new Signal(),

		// player

		startPlayer: new Signal(),
		stopPlayer: new Signal(),

		// actions

		showModal: new Signal(),

		// notifications

		editorCleared: new Signal(),

		savingStarted: new Signal(),
		savingFinished: new Signal(),

		themeChanged: new Signal(),

		transformModeChanged: new Signal(),
		snapChanged: new Signal(),
		spaceChanged: new Signal(),
		rendererChanged: new Signal(),

		sceneBackgroundChanged: new Signal(),
		sceneFogChanged: new Signal(),
		sceneGraphChanged: new Signal(),

		cameraChanged: new Signal(),

		geometryChanged: new Signal(),
		animationChanged: new Signal(),
		objectSelected: new Signal(),
		objectFocused: new Signal(),

		objectAdded: new Signal(),
		objectChanged: new Signal(),
		objectRemoved: new Signal(),
		objectHiddened: new Signal(),
		objectDisplayed: new Signal(),


		helperAdded: new Signal(),
		helperRemoved: new Signal(),

		materialChanged: new Signal(),

		scriptAdded: new Signal(),
		scriptChanged: new Signal(),
		scriptRemoved: new Signal(),

		windowResize: new Signal(),

		showGridChanged: new Signal(),
		refreshSidebarObject3D: new Signal(),
		historyChanged: new Signal(),
		startAnimation: new Signal(),
		startAllAnimations : new Signal(),
		animationMode: new Signal(),
		stopAnimation: new Signal(),
		stopAnimations: new Signal(),
		pauseAnimations: new Signal(),
		enterAnimationCamera: new Signal(),
		defaultLightSetting: new Signal(),


	};

	this.config = new Config( 'threejs-editor' );
	this.history = new History( this );
	this.storage = new Storage();
	this.loader = new Loader( this );
	this.animations = new Animations();
	//this.camera = this.DEFAULT_CAMERA.clone();
	this.camera = new THREE.PerspectiveCamera( 50, 1, 0.1, 10000 );
	this.camera.name = 'Camera';
	this.camera.position.set( 20, 10, 20 );
	this.camera.lookAt( new THREE.Vector3() );
	
	this.scene = new THREE.Scene();
	this.scene.name = 'Scene';
	//this.scene.background = new THREE.Color( 0xaaaaaa );

	this.sceneHelpers = new THREE.Scene();

	this.object = {};
	this.geometries = {};
	this.materials = {};
	this.textures = {};
	this.scripts = {};

	this.selected = null;
	this.helpers = {};
	this.animationPlayer = new AnimationPlayer( this );

};

Editor.prototype = {

	setTheme: function ( value ) {

		document.getElementById( 'theme' ).href = value;

		this.signals.themeChanged.dispatch( value );

	},

	//

	setScene: function ( scene, background) {

		this.scene.uuid = scene.uuid;
		this.scene.name = scene.name;
		console.log(scene);
		if ( background != null ) {
			
			this.scene.background = THREE.ImageUtils.loadTexture( background );
			this.signals.sceneGraphChanged.dispatch();
		}
		else{this.setDefaultBackground();}
		if ( scene.fog !== null ) this.scene.fog = scene.fog.clone();

		this.scene.userData = JSON.parse( JSON.stringify( scene.userData ) );

		// avoid render per object

		this.signals.sceneGraphChanged.active = false;

		while ( scene.children.length > 0 ) {

			this.addObject( scene.children[ 0 ] );

		}

		this.signals.sceneGraphChanged.active = true;
		this.signals.sceneGraphChanged.dispatch();

	},
	copyScene : function(){

		this.sceneBackup = editor.scene.clone();

	},
	//
	setDefaultBackground : function(){

		var scope = this;
		var loader = new THREE.TextureLoader();
		loader.load( "images/background/default.jpg",function( texture ){
			scope.scene.background = texture;
			scope.signals.sceneGraphChanged.dispatch();
			
		});
	},
	addObject: function ( object ) {

		var scope = this;
		object.traverse( function ( child ) {

			if ( child.geometry !== undefined ) scope.addGeometry( child.geometry );
			if ( child.material !== undefined ) scope.addMaterial( child.material );

			scope.addHelper( child );

		} );

		this.scene.add( object );
		this.signals.objectAdded.dispatch( object );
		this.signals.sceneGraphChanged.dispatch();

	},

	addAnimation: function( key, animation ){ 

		this.animations.add( key, animation );
		this.signals.animationChanged.dispatch();

	},

	removeAnimation: function( key ) {

		// for( var prop in this.animations.animations ) {
		// 	console.log(prop);
		// 	if( this.animations.hasOwnProperty( prop ) ) {
		// 			if( this.animations[ prop ] === animation )
		// 				return prop;
		// 	}
		// }
		delete this.animations.animations[key];

		this.signals.animationChanged.dispatch();
		


	},

	hideObject: function(object){

		object.traverse ( function (child) {
			if (child instanceof THREE.Mesh) {
				child.visible = false;
			}
		});
		this.signals.sceneGraphChanged.dispatch();

	},

	displayObject: function(object){

		object.traverse ( function (child) {
			if (child instanceof THREE.Mesh) {
				child.visible = true;
			}
		});
		this.signals.sceneGraphChanged.dispatch();

	},

	moveObject: function ( object, parent, before ) {

		if ( parent === undefined ) {

			parent = this.scene;

		}

		parent.add( object );

		// sort children array

		if ( before !== undefined ) {

			var index = parent.children.indexOf( before );
			parent.children.splice( index, 0, object );
			parent.children.pop();

		}

		this.signals.sceneGraphChanged.dispatch();

	},

	nameObject: function ( object, name ) {

		object.name = name;
		this.signals.sceneGraphChanged.dispatch();

	},

	removeObject: function ( object ) {

		if ( object.parent === null ) return; // avoid deleting the camera or scene

		var scope = this;

		object.traverse( function ( child ) {

			scope.removeHelper( child );

		} );

		object.parent.remove( object );

		this.signals.objectRemoved.dispatch( object );
		this.signals.sceneGraphChanged.dispatch();

	},
	defaultLightSetting : function () {
		var lightCount = 0;
		var cameraCount = 0;
		this.scene.traverse( function ( child ) {
			if( child.isLight ){
				lightCount += 1;
			};
			if( child.isCamera ){
				cameraCount += 1;
				console.log('camera',child);
			}

		} );

		if( lightCount == 0 ) {
			var color = 0xffffff;
			var intensity = 0.5;
			var light = new THREE.DirectionalLight( color, intensity );
			light.name = 'DirectionalLight ' + ( ++ lightCount );
			light.target.name = 'DirectionalLight ' + ( lightCount ) + ' Target';
			light.position.set( 0, 5000, 5000 );
			this.execute( new AddObjectCommand( light ) );

			var light = new THREE.DirectionalLight( color, intensity );
			light.name = 'DirectionalLight ' + ( ++ lightCount );
			light.target.name = 'DirectionalLight ' + ( lightCount ) + ' Target';
			light.position.set( 0, 5000, -5000 );
			this.execute( new AddObjectCommand( light ) );


			var light = new THREE.AmbientLight( color, intensity );
			light.name = 'AmbientLight ' + ( ++ lightCount );
			light.position.set( 0, 5000, 0 );

			this.execute( new AddObjectCommand( light ) );

		}
		if( cameraCount == 0 ) {
			this.execute( new AddObjectCommand(this.animationCamera) );
			
		}
		
	},
	addGeometry: function ( geometry ) {

		this.geometries[ geometry.uuid ] = geometry;

	},

	setGeometryName: function ( geometry, name ) {

		geometry.name = name;
		this.signals.sceneGraphChanged.dispatch();

	},

	addMaterial: function ( material ) {

		this.materials[ material.uuid ] = material;

	},

	setMaterialName: function ( material, name ) {

		material.name = name;
		this.signals.sceneGraphChanged.dispatch();

	},

	addTexture: function ( texture ) {

		this.textures[ texture.uuid ] = texture;

	},

	//

	addHelper: function () {

		var geometry = new THREE.SphereBufferGeometry( 2, 4, 2 );
		var material = new THREE.MeshBasicMaterial( { color: 0xff0000, visible: false } );

		return function ( object ) {

			var helper;

			if ( object instanceof THREE.Camera ) {

				helper = new THREE.CameraHelper( object, 1 );

			} else if ( object instanceof THREE.PointLight ) {

				helper = new THREE.PointLightHelper( object, 1 );

			} else if ( object instanceof THREE.DirectionalLight ) {

				helper = new THREE.DirectionalLightHelper( object, 1 );

			} else if ( object instanceof THREE.SpotLight ) {

				helper = new THREE.SpotLightHelper( object, 1 );

			} else if ( object instanceof THREE.HemisphereLight ) {

				helper = new THREE.HemisphereLightHelper( object, 1 );

			} else if ( object instanceof THREE.SkinnedMesh ) {

				helper = new THREE.SkeletonHelper( object );

			} else {

				// no helper for this object type
				return;

			}

			var picker = new THREE.Mesh( geometry, material );
			picker.name = 'picker';
			picker.userData.object = object;
			helper.add( picker );

			this.sceneHelpers.add( helper );
			this.helpers[ object.id ] = helper;

			this.signals.helperAdded.dispatch( helper );

		};

	}(),

	removeHelper: function ( object ) {

		if ( this.helpers[ object.id ] !== undefined ) {
			console.log("helpRemoved");
			var helper = this.helpers[ object.id ];
			helper.parent.remove( helper );

			delete this.helpers[ object.id ];

			this.signals.helperRemoved.dispatch( helper );

		}

	},

	//

	addScript: function ( object, script ) {
		if ( this.scripts[ object.uuid ] === undefined ) {

			this.scripts[ object.uuid ] = [];
	

		}

		this.scripts[ object.uuid ].push( script );

		this.signals.scriptAdded.dispatch( script );

	},

	removeScript: function ( object, script ) {

		if ( this.scripts[ object.uuid ] === undefined ) return;

		var index = this.scripts[ object.uuid ].indexOf( script );

		if ( index !== - 1 ) {

			this.scripts[ object.uuid ].splice( index, 1 );

		}

		this.signals.scriptRemoved.dispatch( script );

	},

	getObjectMaterial: function ( object, slot ) {

		var material = object.material;
		//console.log("slot",slot);
		if ( Array.isArray( material ) ) {

			material = material[ slot ];
			console.log("Material is an array");

		}

		return material;

	},

	setObjectMaterial: function ( object, slot, newMaterial ) {

		if ( Array.isArray( object.material ) ) {

			object.material[ slot ] = newMaterial;

		} else {

			object.material = newMaterial;

		}

	},

	//

	select: function ( object ) {

		if ( this.selected === object ) return;

		var uuid = null;

		if ( object !== null ) {

			uuid = object.uuid;

		}

		this.selected = object;

		this.config.setKey( 'selected', uuid );
		this.signals.objectSelected.dispatch( object );

	},

	selectById: function ( id ) {

		if ( id === this.camera.id ) {

			this.select( this.camera );
			return;

		}

		this.select( this.scene.getObjectById( id, true ) );

	},

	selectByUuid: function ( uuid ) {

		var scope = this;

		this.scene.traverse( function ( child ) {
			//console.log(uuid);
			if ( child.uuid === uuid ) {

				scope.select( child );

			}

		} );

	},
	getObjectByUuid: function ( uuid ) {

		var scope = this;
		var curr = null;
		this.scene.traverse( function ( child ) {
			//console.log(uuid);
			if ( child.uuid === uuid ) {

				curr =  child;

			}

		} );
		return curr;

	},
	deselect: function () {

		this.select( null );

	},

	focus: function ( object ) {

		this.signals.objectFocused.dispatch( object );

	},

	focusById: function ( id ) {

		this.focus( this.scene.getObjectById( id, true ) );

	},

	clear: function () {

		this.history.clear();
		this.storage.clear();
		this.animations.clear();
		console.log(this.animations);
		this.camera.copy( this.DEFAULT_CAMERA );
		//this.scene.background.setHex( 0xaaaaaa );
		this.setDefaultBackground();
		this.scene.fog = null;

		var objects = this.scene.children;

		while ( objects.length > 0 ) {

			this.removeObject( objects[ 0 ] );

		}

		this.geometries = {};
		this.materials = {};
		this.textures = {};
		this.scripts = {};
		

		this.deselect();
		this.defaultLightSetting();

		this.signals.editorCleared.dispatch();

	},

	//

	fromJSON: function ( json ) {

		var loader = new THREE.ObjectLoader();
		console.log(json);
		// backwards

		if ( json.scene === undefined ) {

			this.setScene( loader.parse( json ), json.background );
			return;

		}

		var camera = loader.parse( json.camera );

		this.camera.copy( camera );
		this.camera.aspect = this.DEFAULT_CAMERA.aspect;
		this.camera.updateProjectionMatrix();

		this.history.fromJSON( json.history );
		this.scripts = json.scripts;
		this.animations.fromJSON(json.animations);
		console.log(json.animations);
		console.log( json.scene);
		this.setScene( loader.parse( json.scene ), json.background);
		this.defaultLightSetting();
		
		//console.log(this.animations);

	},

	toJSON: function () {

		// scripts clean up

		var scene = this.scene;
		var scripts = this.scripts;
		for ( var key in scripts ) {

			var script = scripts[ key ];

			if ( script.length === 0 || scene.getObjectByProperty( 'uuid', key ) === undefined ) {

				delete scripts[ key ];

			}

		}

		//

		return {

			metadata: {},
			project: {
				gammaInput: this.config.getKey( 'project/renderer/gammaInput' ),
				gammaOutput: this.config.getKey( 'project/renderer/gammaOutput' ),
				shadows: this.config.getKey( 'project/renderer/shadows' ),
				vr: this.config.getKey( 'project/vr' )
			},
			camera: this.camera.toJSON(),
			scene: this.scene.toJSON(),
			scripts: this.scripts,
			animations: this.animations.toJSON(),
			history: this.history.toJSON(),
			background: getDataURL(scene.background.image),

		};

	},

	objectByUuid: function ( uuid ) {

		return this.scene.getObjectByProperty( 'uuid', uuid, true );

	},

	execute: function ( cmd, optionalName ) {

		this.history.execute( cmd, optionalName );

	},

	undo: function () {

		this.history.undo();

	},

	redo: function () {

		this.history.redo();

	}


	

};
function getDataURL( image ) {

	var canvas;

	if ( image instanceof HTMLCanvasElement ) {

		canvas = image;

	} else {

		canvas = document.createElementNS( 'http://www.w3.org/1999/xhtml', 'canvas' );
		canvas.width = image.width;
		canvas.height = image.height;

		var context = canvas.getContext( '2d' );

		if ( image instanceof ImageData ) {

			context.putImageData( image, 0, 0 );

		} else {

			context.drawImage( image, 0, 0, image.width, image.height );

		}

	}

	if ( canvas.width > 2048 || canvas.height > 2048 ) {

		return canvas.toDataURL( 'image/jpeg', 0.6 );

	} else {

		return canvas.toDataURL( 'image/png' );

	}

}