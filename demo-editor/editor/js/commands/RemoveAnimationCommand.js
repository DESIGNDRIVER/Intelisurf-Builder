/**
 * @author dforrer / https://github.com/dforrer
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 */

/**
 * @param animation tween animation
 * @constructor
 */

var RemoveAnimationCommand = function ( key ) {

	Command.call( this );

	this.type = 'RemoveAnimationCommand';
	this.key = key;
	this.animation = editor.animations.animations[key];
	if ( this.animation !== undefined ) {

		this.name = 'Delete Animation: '+ this.animation.name;

	}

};

RemoveAnimationCommand.prototype = {

	execute: function () {

		this.editor.removeAnimation( this.key );


	},

	undo: function () {

		this.editor.addAnimation( this.key, this.animation );

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
