var PublishPlayer = function (scene, animationsJSON) {
    this.animationsList = new Animations();
    this.animationsList.fromJSON(animationsJSON);
    this.animations = this.animationsList.animations;
    this.scene = scene;
    this.isStop = true;


   
}
PublishPlayer.prototype = {

    playAllAnimations: function() {
        var scope = this;
        this.isStop = false;
        var root = undefined;
        var animationDict = {};
        var tweenCount = 0;
        var roots = [];
        var paramDict = {};
        //console.log(this.animations)
        
        for ( var key in this.animations ) {
    
            if(!this.animations.hasOwnProperty(key)) continue;
    
            var currAni = this.animations[key];
            var object = this.getObjectByUuid( currAni.objectID );
           // console.log(object);
            var currTween = null;
            
            if( currAni.type == "Translation" ) {
                paramDict[tweenCount] = currAni.from.clone();
                currTween = new TWEEN.Tween(paramDict[tweenCount])
                .delay(currAni.delay)
                .repeat(currAni.repeat)
                .to(currAni.to, currAni.duration) 
                .onUpdate(function() { 
                   
                     object.position.copy( this );
                     object.updateMatrixWorld( true );
    
                })
    
            }
    
            else if ( currAni.type == "Rotation" ) {
                paramDict[tweenCount] = currAni.from.clone();
                currTween =  new TWEEN.Tween(paramDict[tweenCount])
                .delay(currAni.delay)
                .repeat(currAni.repeat)
                .to(currAni.to, currAni.duration)
                .onUpdate(function() { 
    
                    object.rotation.copy(new THREE.Euler(this.x,this.y,this.z) );
                    object.updateMatrixWorld( true );
    
                })
    
    
            }
    
            else if ( currAni.type == "Scale" ) {
                paramDict[tweenCount] = currAni.from.clone();
                currTween =  new TWEEN.Tween(paramDict[tweenCount])
                .delay(currAni.delay)
                .repeat(currAni.repeat)
                .to(currAni.to, currAni.duration)
                .onUpdate(function() { 
    
                    object.scale.copy( this );
                    object.updateMatrixWorld( true );	
    
                })
            }else{
              //  console.log("got wrong");
            }
    
            tweenCount += 1;
            
   
            currTween.onComplete(animationCompleted);
            animationDict[key] = currTween; 
        }
    
    
        for ( var key in animationDict) {
            
            var animation = this.animations[key];
            if ( animation.parent == '') {
                roots.push(key);
                continue;
            }
    
            var parentAnimation = animationDict[animation.parent];
        
            parentAnimation.chainPush(animationDict[key]);
    
    
        }
    
    
    
    
    
        function animationCompleted() {
            tweenCount -= 1;
      
            if (tweenCount == 0) {
                scope.isStop = true;
                //console.log("stoped");
                controlPanel.setAttribute('src','images/INSTALL PLAY CIRCLE.png');
                
                scene.traverse(function(child){
                    var newPos = child.initialData.position.clone();
                    var newScale = child.initialData.scale.clone();
                    var newRotation = child.initialData.rotation.clone();
                    child.position.set(newPos.x, newPos.y, newPos.z);
                    child.scale.set(newScale.x, newScale.y, newScale.z);
                    child.rotation.set(newRotation.x, newRotation.y, newRotation.z);

                })

    
            }
    
    
        }


        for ( var i = 0 ; i <roots.length ; i += 1 ) {
        
            animationDict[roots[i]].start();
        }






    },
  
	getObjectByUuid: function ( uuid ) {

		var scope = this;
		var curr = null;
		scope.scene.traverse( function ( child ) {
		
			if ( child.uuid === uuid ) {

				curr =  child;

			}

		} );
		return curr;

	},
}
