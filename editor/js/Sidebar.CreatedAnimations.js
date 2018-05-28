/**
 * @author mrdoob / http://mrdoob.com/
 */

Sidebar.CreatedAnimations = function ( editor ) {

	console.log("Sidebar.CreatedAnimations.js: Begin");
	
	var signals = editor.signals;
	var animationPlayer = editor.animationPlayer;

	var container = new UI.Panel();
	container.setBorderTop( '0' );
	container.setPaddingTop( '20px' );

	// outliner

	function buildOption( key, animation, draggable ) {

		var option = document.createElement( 'div' );
		option.draggable = draggable;
		option.innerHTML = buildHTML( animation );
		option.value = key;

		return option;

	}


	function buildHTML( animation ) {

		var html = '<span class="type ' + animation.type + '"></span> ' +animation.name;

		return html;

	}

	var createRow = new UI.Row();

	//play
	createRow.add( new UI.Button( 'CREATE ANIMATION' ).onClick( function () {
		if( editor.selected == null  ) { alert( "Please select an object to animate" ); return; }
		
		console.log("Sidebar.CreatedAnimations.js: CREATE ANIMATION");
		console.log(this);
		
		editor.signals.newAnimation.dispatch();
	} ) );
	
	container.add( createRow );

	var outliner = new UI.Outliner( editor );
	outliner.setId( 'outliner' );
	outliner.onChange( function () {
		console.log( editor.animations.animations[outliner.getValue() ]);
	} );
	outliner.onDblClick( function () {
		//editor.focusById( parseInt( outliner.getValue() ) );
		clickedEditAnimation();
 	} );
	
	container.add( outliner );
	container.add( new UI.Break() );

	var manageRow = new UI.Row();

	manageRow.add( new UI.Button( 'PREVIEW' ).onClick( function () {
		console.log("play start");
		animationPlayer.playAllAnimations();
	} ) );
	
	manageRow.add( new UI.Button( 'EDIT' ).onClick( function () {
		clickedEditAnimation();
	} ) );

	manageRow.add( new UI.Button( 'DELETE' ).setMarginLeft( '4px' ).onClick( function () {
		deleteAnimation();
	} ) );
	
	container.add( manageRow );

	function deleteAnimation ( ) {
		var key = outliner.getValue();
		editor.execute( new RemoveAnimationCommand( key ) );

	}
	
	function clickedEditAnimation() {
		console.log("Sidebar.CreatedAnimations.js: EDIT ANIMATION: " + outliner.getValue());
		
		if (outliner.getValue() === undefined)
		{
			alert( "Please select an animtion to edit" );
			return;
		}
		
		var animation_to_edit = editor.animations.animations[outliner.getValue()];
		
		console.log(animation_to_edit);
		
		if ((animation_to_edit === null)||(animation_to_edit === undefined))
		{
			alert( "Invalid animation selected" );
			console.log('Invalid Animation');
			console.log(animation_to_edit);
			return;
		}	
		
		console.log("Sidebar.CreatedAnimations.js: EDIT ANIMATION: dispatch editAnimation");

		editor.signals.editAnimation.dispatch(outliner.getValue(), animation_to_edit);
	}
	
	
	// refreshUI

	function refreshUI() {

		var options = [];
		var pad = 0;
		var animations = editor.animations.animations;
		for ( var key in animations) {
			if (animations.hasOwnProperty(key)) {
				var animation = animations[ key ];
				var option = buildOption(key, animation, false );
				option.style.paddingLeft = ( pad * 10 ) + 'px';
				options.push( option );
			}

		}

		outliner.setOptions( options );



	}


	signals.animationChanged.add( refreshUI );
	signals.editorCleared.add( refreshUI );

	signals.sceneGraphChanged.add( refreshUI );

	// signals.objectChanged.add( function ( object ) {

	// 	var options = outliner.options;

	// 	for ( var i = 0; i < options.length; i ++ ) {

	// 		var option = options[ i ];

	// 		if ( option.value === object.id ) {

	// 			option.innerHTML = buildHTML( object );
	// 			return;

	// 		}

	// 	}

	// } );

	// signals.objectSelected.add( function ( object ) {

	// 	if ( ignoreObjectSelectedSignal === true ) return;

	// 	outliner.setValue( object !== null ? object.id : null );

	// } );
	
	console.log("Sidebar.CreatedAnimations.js: End");

	return container;

};
