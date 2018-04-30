var Player = function(){
    


}
player.prototype = {
    load: function(scene){





    },

    handleJSON: function ( data ) {

	
        var loader = new THREE.ObjectLoader();

        var scene = loader.parse( data );

    	if ( scene !== undefined ) {

            this.cmdArray.push( new SetUuidCommand( this.editor.scene, scene.uuid ) );
            this.cmdArray.push( new SetValueCommand( this.editor.scene, 'name', scene.name ) );
            this.cmdArray.push( new SetValueCommand( this.editor.scene, 'userData', JSON.parse( JSON.stringify( scene.userData ) ) ) );
    
            while ( scene.children.length > 0 ) {
    
                var child = scene.children.pop();
                this.cmdArray.push( new AddObjectCommand( child ) );
    
            }
    
        }


			

		

	}

    

}
