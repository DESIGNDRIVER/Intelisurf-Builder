var PublishPlayer = function (scene, animationsJSON) {
    this.animationsList = new Animations();
    this.animationsList.fromJSON(animationsJSON);
    this.animations = this.animationsList.animations;
    this.scene = scene;
    this.isStop = true;
}

PublishPlayer.prototype = {

    playAllAnimations: function() {
    	console.log("PulishPlayer.js playAllAnimations start");
        var scope = this;
        this.isStop = false;
        var root = undefined;
        var animationDict = {};
        var animationDictSingleKeys = {};
        var tweenCount = 0;
        var roots = [];
        var paramDict = {};
        //console.log(this.animations)
        
        for ( var key in this.animations ) {
    
        	console.log("PublishPlayer.js playAllAnimations got key: " + key);
        	
            if(!this.animations.hasOwnProperty(key)) continue;
    
            var currAni = this.animations[key];
            var object = this.getObjectByUuid( currAni.objectID );
            
            if ( currAni.type == "Transform")
        	{
            	console.log("PublishPlayer.js playAllAnimations transform anim");
            	// 1. Translate
                paramDict[tweenCount] = currAni.fromPos.clone();
                translateTween = new TWEEN.Tween(paramDict[tweenCount])
                .delay(currAni.delay * 1000)
                .repeat(currAni.repeat)
                .to(currAni.toPos, currAni.duration * 1000) 
                .onUpdate(function() { 
                     object.position.copy( this );
                     object.updateMatrixWorld( true );
                });
                
                tweenCount += 1;
                
                // 2. Rotate
                paramDict[tweenCount] = currAni.fromRot.clone();
                rotateTween =  new TWEEN.Tween(paramDict[tweenCount])
                .delay(currAni.delay * 1000)
                .repeat(currAni.repeat)
                .to(currAni.toRot, currAni.duration * 1000)
                .onUpdate(function() { 
                    object.rotation.copy(new THREE.Euler(this.x,this.y,this.z) );
                    object.updateMatrixWorld( true );
                });
                
                tweenCount += 1;
                
                // 3. Scale
                paramDict[tweenCount] = currAni.fromSca.clone();
                scaleTween =  new TWEEN.Tween(paramDict[tweenCount])
                .delay(currAni.delay * 1000)
                .repeat(currAni.repeat)
                .to(currAni.toSca, currAni.duration * 1000)
                .onUpdate(function() { 
                    object.scale.copy( this );
                    object.updateMatrixWorld( true );	
                });
                
                tweenCount += 1;
                
                // 4. Store each tween
                translateTween.onComplete(animationCompleted);
                rotateTween.onComplete(animationCompleted);
                scaleTween.onComplete(animationCompleted);
                animationDict[key+"_t"] = translateTween; 
                animationDict[key+"_r"] = rotateTween; 
                animationDict[key+"_s"] = scaleTween; 
                animationDictSingleKeys[key] = key;
                console.log("PublishPlayer.js playAllAnimations added key: " + key);
        	}
        }
    
        for ( var key in animationDictSingleKeys) {
        	console.log("PublishPlayer.js playAllAnimations seeking animation: " + key);
        	
            var animation = this.animations[key];
            if ( animation.parent == '') {
            	console.log("PublishPlayer.js playAllAnimations adding roots");
                roots.push(key + "_t");
                roots.push(key + "_r");
                roots.push(key + "_s");
                console.log("PublishPlayer.js playAllAnimations added roots");
                continue;
            }
    
            console.log("PublishPlayer.js playAllAnimations adding parent");
            var parentAnimation = animationDictSingleKeys[animation.parent];
            parentAnimation.chainPush(animationDict[key + "_t"]);
            parentAnimation.chainPush(animationDict[key + "_r"]);
            parentAnimation.chainPush(animationDict[key + "_s"]);
            console.log("PublishPlayer.js playAllAnimations added parent");
        }

        function animationCompleted() {
            tweenCount -= 1;
      
            if (tweenCount == 0) {
                scope.isStop = true;
                //console.log("stoped");
                controlPanel.setAttribute('src','images/INSTALL PLAY CIRCLE.png');
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
