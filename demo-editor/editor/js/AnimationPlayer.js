var AnimationPlayer = function (editor) {
    this.editor = editor;
    this.signals = editor.signals;
    this.animations = editor.animations.animations;




}
AnimationPlayer.prototype = {

    playAllAnimations: function() {
        var editor = this.editor;
        var root = undefined;
        var animationDict = {};
        var tweenCount = 0;
        var signals = this.signals;
       // var originalState = editor.sceneBackup;
        var roots = [];
        editor.deselect();
        var paramDict = {};
        for ( var key in this.animations) {

            var currAni = this.animations[key];
            var object = editor.getObjectByUuid( currAni.objectID );
            var currTween = null;
            console.log(object);
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
                console.log("got wrong");
            }

            tweenCount += 1;
            
            console.log(tweenCount);
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



        for ( var i = 0 ; i <roots.length ; i+=1 ) {
            
            animationDict[roots[i]].start();
        }

        function animationCompleted() {
            tweenCount -= 1;
            console.log("animations completed")
            if (tweenCount == 0) {

               // console.log(originalState);
               // editor.scene = originalState.clone();
                signals.stopAnimation.dispatch();
                signals.sceneGraphChanged.dispatch();

            }


        }
        signals.startAnimation.dispatch( );



        var stopAllTween = function(){
            var activeTween = TWEEN.getAll();
            console.log('force stop all');
            for ( var j = 0 ; j< activeTween.length ; j+=1 ) {
                activeTween[j].stop();

            }

            signals.stopAnimation.dispatch();
            signals.sceneGraphChanged.dispatch();
            signals.stopAnimations.remove(stopAllTween);
        }
        signals.stopAnimations.add(stopAllTween);


    }

        


}
