var Animations = function() {
    
    this.animations = {};

}

Animations.prototype = {

    add: function( id, animation ){

        this.animations[id] = animation;
        console.log(this.animations);
    },

    remove: function( animationID ){
        
        delete this.animations[animationID];

    },

    fromJSON: function ( json ) {

        for ( var i = 0; i < json.length; i ++ ) {
            var animation = json[i];
            var fromPos, toPos = null;
            var fromRot, toRot = null;
            var fromSca, toSca = null;
            
            if(animation.type == "Transform") {
            	// 1. Translate
            	fromPos = new THREE.Vector3(animation.fromPos.x,animation.fromPos.y,animation.fromPos.z );
                toPos = new THREE.Vector3(animation.toPos.x,animation.toPos.y,animation.toPos.z );
                
                // 2. Rotate
                fromRot = new THREE.Euler(animation.fromRot.x,animation.fromRot.y,animation.fromRot.z );
                toRot = new THREE.Euler(animation.toRot.x,animation.toRot.y,animation.toRot.z );
                
                // 3. Scale
                fromSca = new THREE.Vector3(animation.fromSca.x,animation.fromSca.y,animation.fromSca.z );
                toSca = new THREE.Vector3(animation.toSca.x,animation.toSca.y,animation.toSca.z );
            }
            
            this.animations[animation.id] = new Animation( animation.name, animation.objectID, animation.type, animation.parent, animation.startType, animation.delay, animation.repeat, animation.duration, fromPos, toPos, fromRot, toRot, fromSca, toSca);
        }
    },

    toJSON: function ( ) {

        var animations = [];
        for (var key in this.animations) {

            if (this.animations.hasOwnProperty(key)) {

                var animation = this.animations[key];
                animations.push(animation.toJSON(key));

            }

        }

        return animations;
    },

    clear:function(){
        this.animations = {};
    }
}