/**
 * @author dforrer / https://github.com/dforrer
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 */

/**
 * @param object THREE.Object3D
 * @constructor
 */

var DisplayObjectCommand = function ( object ) {

	Command.call( this );

	this.type = 'DisplayObjectCommand';

	this.object = object;
	if ( object !== undefined ) {

		this.name = 'Display Object: ' + object.name;

	}

};

DisplayObjectCommand.prototype = {

	execute: function () {

		this.editor.displayObject( this.object );
	

	},

	undo: function () {

		this.editor.hideObject( this.object );


	},

	toJSON: function () {

		var output = Command.prototype.toJSON.call( this );
		output.object = this.object.toJSON();

		return output;

	},

	fromJSON: function ( json ) {

		Command.prototype.fromJSON.call( this, json );

		this.object = this.editor.objectByUuid( json.object.object.uuid );

		if ( this.object === undefined ) {

			var loader = new THREE.ObjectLoader();
			this.object = loader.parse( json.object );

		}

	}

};
