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
            var from, to = null;
            if(animation.type == "Rotation") {

                from = new THREE.Euler(animation.from.x,animation.from.y,animation.from.z );
                to = new THREE.Euler(animation.to.x,animation.to.y,animation.to.z );
                console.log(animation.to.x,animation.to.y,animation.to.z );
            }else {

                from = new THREE.Vector3(animation.from.x,animation.from.y,animation.from.z );
               
                to = new THREE.Vector3(animation.to.x,animation.to.y,animation.to.z );
            }
            
            this.animations[animation.id] = new Animation( animation.name, animation.objectID, animation.type, animation.parent, animation.startType, animation.delay, animation.repeat, animation.duration, from, to );

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