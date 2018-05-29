/**
 * @author mrdoob / http://mrdoob.com/
 */

var Config = function ( name ) {

	var storage = {
		'autosave': true,
		'theme': 'css/light.css',

		'project/title': '',
		'project/editable': false,
		
		
		'project/ui/banner/enabled': false,
		'project/ui/banner/imagename':'',
		'project/ui/banner/image': '',
		'project/ui/banner/height':'50px',
		'project/ui/banner/bgcolor':'grey',

		'project/ui/logo/enabled':false,
		'project/ui/logo/image':'',
		'project/ui/logo/imagename':'',

		'project/ui/title/enabled':false,
		'project/ui/title/font':'',
		'project/ui/title/size':14,
		'project/ui/title/textcolor':'white',
		'project/ui/title/text':'',

		'project/ui/button/enabled':true,
		'project/ui/button/font':'',
		'project/ui/button/textcolor':'black',
		'project/ui/button/progresscolor':'orange',

		'project/renderer': 'WebGLRenderer',
		'project/renderer/antialias': true,
		'project/renderer/gammaInput': false,
		'project/renderer/gammaOutput': false,
		'project/renderer/shadows': true,

		'project/vr': false,
		
		

		'settings/history': false
	};

	if ( window.localStorage[ name ] === undefined ) {

		window.localStorage[ name ] = JSON.stringify( storage );

	} else {

		var data = JSON.parse( window.localStorage[ name ] );

		for ( var key in data ) {

			storage[ key ] = data[ key ];

		}

	}

	return {

		getKey: function ( key ) {

			return storage[ key ];

		},

		setKey: function () { // key, value, key, value ...

			for ( var i = 0, l = arguments.length; i < l; i += 2 ) {

				storage[ arguments[ i ] ] = arguments[ i + 1 ];

			}

			window.localStorage[ name ] = JSON.stringify( storage );

			console.log( '[' + /\d\d\:\d\d\:\d\d/.exec( new Date() )[ 0 ] + ']', 'Saved config to LocalStorage.' );

		},

		clear: function () {

			delete window.localStorage[ name ];

		}

	};

};
