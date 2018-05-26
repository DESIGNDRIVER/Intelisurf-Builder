/**
 * @author dforrer / https://github.com/dforrer
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 */

/**
 * @param animation tween animation
 * @constructor
 */

var AddAnimationCommand = function ( key, animation ) {

	Command.call( this );

	this.type = 'AddAnimationCommand';
	this.key = key;
	this.animation = animation;
	if ( this.animation !== undefined ) {

		this.name = 'Add Animation: '+ this.animation.name;

	}

};

AddAnimationCommand.prototype = {

	execute: function () {
		
		this.editor.removeAnimation( this.key );
		this.editor.addAnimation( this.key, this.animation );
	},

	undo: function () {

		this.editor.removeAnimation( this.key );

	},

	toJSON: function () {

		var output = Command.prototype.toJSON.call( this );

		return output;

	},

	fromJSON: function ( json ) {
		// Command.prototype.fromJSON.call( this, json );
	 	// this.animation = this.editor.animationByUuid( json.animation.animation.uuid );
	}
};
