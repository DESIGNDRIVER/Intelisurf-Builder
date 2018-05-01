Sidebar.AnimationMenu = function ( editor ) {

	var signals = editor.signals;
    var animation = editor.animations;
	var container = new UI.Span();
    container.setDisplay( 'none' );

	var newAnimationTab = new UI.Text( 'NEW ANIMATION' ).onClick( onClick );
	var createdAnimationsTab = new UI.Text( 'VIEW ANIMATIONS' ).onClick( onClick );
	var tabs = new UI.Div();
	tabs.setId( 'tabs' );
	tabs.add( newAnimationTab, createdAnimationsTab );
    container.add(tabs);
    
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

            case 'NEW ANIMATION':
            	newAnimationTab.setClass( 'selected' );
				newAnimation.setDisplay( '' );
				break;
            case 'VIEW ANIMATIONS':
                createdAnimationsTab.setClass( 'selected' );
                createdAnimations.setDisplay( '' );
				break;
		}

	}


    select('NEW ANIMATION');
    return container;
}