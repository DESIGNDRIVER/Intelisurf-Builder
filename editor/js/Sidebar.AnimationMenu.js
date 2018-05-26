Sidebar.AnimationMenu = function ( editor ) {

	console.log("Sidebar.AnimatonMenu.js: Begin");
	
	var signals = editor.signals;
    var animation = editor.animations;
	var container = new UI.Span();
    container.setDisplay( 'none' );

	var newAnimationTab = new UI.Text( 'EDITOR' ).onClick( onClick );
	var createdAnimationsTab = new UI.Text( 'ANIMATIONS' ).onClick( onClick );
	var tabs = new UI.Div();
	tabs.setId( 'tabs' );
	tabs.add( createdAnimationsTab,  newAnimationTab);
    container.add(tabs);
    
    editor.signals.newAnimation.add(newAnimation);
    
    function newAnimation()
    {
    	select('EDITOR');
    }
    
    function onClick( event ) {

		select( event.target.textContent );

    }
    
    var newAnimation = new UI.Span().add(
		new Sidebar.Animation( editor )
    );
    container.add( newAnimation );

    
    var createdAnimations = new UI.Span().add(
		new Sidebar.CreatedAnimations( editor )
	);
    container.add( createdAnimations );

	function select( section ) {

		newAnimationTab.setClass( '' );
        createdAnimationsTab.setClass( '' );
  
		newAnimation.setDisplay( 'none' );;
        createdAnimations.setDisplay( 'none' );;

		switch ( section ) {

            case 'EDITOR':
            	newAnimationTab.setClass( 'selected' );
				newAnimation.setDisplay( '' );
				break;
            case 'ANIMATIONS':
                createdAnimationsTab.setClass( 'selected' );
                createdAnimations.setDisplay( '' );
				break;
		}

	}


    select('ANIMATIONS');
    
    console.log("Sidebar.AnimationMenu.js: End");
    return container;
}