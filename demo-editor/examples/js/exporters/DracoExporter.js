/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.DracoExporter = function () {};

THREE.DracoExporter.prototype = {

	constructor: THREE.DracoExporter,

	parse: function ( object ) {

		var output = '';
		var output2 = '';
		var indexVertex = 0;
		var indexVertexUvs = 0;
		var indexNormals = 0;

		var vertex = new THREE.Vector3();
		var normal = new THREE.Vector3();
		var uv = new THREE.Vector2();

		var i, j, k, l, m, face = [];

		var parseMesh = function ( mesh ) {

			var nbVertex = 0;
			var nbNormals = 0;
			var nbVertexUvs = 0;

			var geometry = mesh.geometry;

			var normalMatrixWorld = new THREE.Matrix3();

			if ( geometry instanceof THREE.Geometry ) {

				geometry = new THREE.BufferGeometry().setFromObject( mesh );

			}

			if ( geometry instanceof THREE.BufferGeometry ) {

				// shortcuts
				var vertices = geometry.getAttribute( 'position' );
				var normals = geometry.getAttribute( 'normal' );
				var uvs = geometry.getAttribute( 'uv' );
				var indices = geometry.getIndex();
                var dracoIndices = [];
                var dracoVertices = [];
                var dracoNormals = [];
				// name of the mesh object
				output += 'o ' + mesh.name + '\n';

				// name of the mesh material
				if ( mesh.material && mesh.material.name ) {

					output += 'usemtl ' + mesh.material.name + '\n';

				}

				// vertices

				if ( vertices !== undefined ) {

					for ( i = 0, l = vertices.count; i < l; i ++, nbVertex ++ ) {

						vertex.x = vertices.getX( i );
						vertex.y = vertices.getY( i );
						vertex.z = vertices.getZ( i );

						// transfrom the vertex to world space
                        vertex.applyMatrix4( mesh.matrixWorld );
                        
                        dracoVertices.push(vertex.x,vertex.y,vertex.z);


					}

				}

				// uvs

				if ( uvs !== undefined ) {

					for ( i = 0, l = uvs.count; i < l; i ++, nbVertexUvs ++ ) {

						uv.x = uvs.getX( i );
						uv.y = uvs.getY( i );

						// transform the uv to export format
						output += 'vt ' + uv.x + ' ' + uv.y + '\n';

					}

				}

				// normals

				if ( normals !== undefined ) {

					normalMatrixWorld.getNormalMatrix( mesh.matrixWorld );

					for ( i = 0, l = normals.count; i < l; i ++, nbNormals ++ ) {

						normal.x = normals.getX( i );
						normal.y = normals.getY( i );
						normal.z = normals.getZ( i );

						// transfrom the normal to world space
						normal.applyMatrix3( normalMatrixWorld );

                        dracoNormals.push(normal.x,normal.y,normal.z);
					}

				}

				// faces

				if ( indices !== null ) {

					for ( i = 0, l = indices.count; i < l; i += 3 ) {

						for ( m = 0; m < 3; m ++ ) {

							j = indices.getX( i + m ) + 1;

							face[ m ] = ( indexVertex + j ) + '/' + ( uvs ? ( indexVertexUvs + j ) : '' ) + '/' + ( indexNormals + j );
                            dracoIndices.push(parseInt(indexVertex + j));
						}

						// transform the face to export format
                        // output += 'f ' + face.join( ' ' );
                        // //f 1/1/1 2/2/2 3/3/3
                        // const faceRegex = /^f\s+(-?\d+)\/-?\d+\/(-?\d+)\s+(-?\d+)\/-?\d+\/(-?\d+)\s+(-?\d+)\/-?\d+\/(-?\d+)(?:\s+(-?\d+)\/-?\d+\/(-?\d+))?/;
                        // const result = faceRegex.exec(output);
                        // dracoIndices.push(parseInt(result[1]), parseInt(result[3]),
                        //     parseInt(result[5]));

					}

				} else {

					for ( i = 0, l = vertices.count; i < l; i += 3 ) {

						for ( m = 0; m < 3; m ++ ) {

							j = i + m + 1;

							face[ m ] = ( indexVertex + j ) + '/' + ( uvs ? ( indexVertexUvs + j ) : '' ) + '/' + ( indexNormals + j );
                            dracoIndices.push(parseInt(indexVertex + j));
						}
						// transform the face to export format
                      //  output += 'f ' + face.join( ' ' );
                        // console.log(output)
                        // //var faceRegex = /^f\s+(\d+)\/(\d+)\/(\d+)\s+(\d+)\/(\d+)\/(\d+)\s+(\d+)\/(\d+)\/(\d+)/;
                        // var faceRegex = /^f\s+1\/1\/(\d+)\s+2\/2\/(\d+)\s+3\/3\/(\d+)/;
                        // //const faceRegex = /^f\s+(-?\d+)\/-?\d+\/(-?\d+)\s+(-?\d+)\/-?\d+\/(-?\d+)\s+(-?\d+)\/-?\d+\/(-?\d+)(?:\s+(-?\d+)\/-?\d+\/(-?\d+))?/;
                       
                        // var result = faceRegex.exec(output);
                        // console.log(result);
                        // dracoIndices.push(parseInt(result[1]), parseInt(result[2]),
                        //     parseInt(result[5]));

					}

				}

			} else {

				console.warn( 'THREE.DracoExporter.parseMesh(): geometry type unsupported', geometry );

			}

			// update index
			indexVertex += nbVertex;
			indexVertexUvs += nbVertexUvs;
            indexNormals += nbNormals;
            var mesh = {
                indices : new Uint32Array(dracoIndices),
                vertices : new Float32Array(dracoVertices),
                normals : new Float32Array(dracoNormals)
            };
            console.log(mesh)
            var encoderModule = DracoEncoderModule();
            var encoder = new encoderModule.Encoder();
            var meshBuilder = new encoderModule.MeshBuilder();
            var dracoMesh = new encoderModule.Mesh();
            
            var numFaces = mesh.indices.length / 3;
            var numPoints = mesh.vertices.length;
            meshBuilder.AddFacesToMesh(dracoMesh, numFaces, mesh.indices);
            
            meshBuilder.AddFloatAttributeToMesh(dracoMesh, encoderModule.POSITION,
              numPoints, 3, mesh.vertices);
            if (mesh.hasOwnProperty('normals')) {
              meshBuilder.AddFloatAttributeToMesh(
                dracoMesh, encoderModule.NORMAL, numPoints, 3, mesh.normals);
            }
            if (mesh.hasOwnProperty('colors')) {
              meshBuilder.AddFloatAttributeToMesh(
                dracoMesh, encoderModule.COLOR, numPoints, 3, mesh.colors);
            }
            if (mesh.hasOwnProperty('texcoords')) {
              meshBuilder.AddFloatAttributeToMesh(
                dracoMesh, encoderModule.TEX_COORD, numPoints, 3, mesh.texcoords);
            }
        
            let encodedData = new encoderModule.DracoInt8Array();
            encoder.SetSpeedOptions(5, 5);
            encoder.SetAttributeQuantization(encoderModule.POSITION, 10);
            encoder.SetEncodingMethod(encoderModule.MESH_EDGEBREAKER_ENCODING);
    
            console.log("Encoding...");
            const encodedLen = encoder.EncodeMeshToDracoBuffer(dracoMesh, encodedData);
            encoderModule.destroy(dracoMesh);
    
            if (encodedLen > 0) {
                console.log("Encoded size is " + encodedLen);
            } else {
                console.log("Error: Encoding failed.");
            }
    
            // Copy encoded data to buffer.
            var outputBuffer = new ArrayBuffer(encodedLen);
            var outputData = new Int8Array(outputBuffer);
            for (let i = 0; i < encodedLen; ++i) {
                outputData[i] = encodedData.GetValue(i);
            }
            encoderModule.destroy(encodedData);
            encoderModule.destroy(encoder);
            encoderModule.destroy(meshBuilder);
    
            console.log("DRACO ENCODED////////////////////////////");
            console.log(outputBuffer);
            output2 += Uint16Array(utputData).toString();
            // fs.writeFile("test.drc", Buffer(outputBuffer), "binary", function(err) {
            //     if (err) {
            //         console.log(err);
            //     } else {
            //         console.log("The file was saved!");
            //     }
            // });
           // writeToFile(outputBuffer)

            //saveString( , 'model.drc' );
		};


		object.traverse( function ( child ) {

			if ( child instanceof THREE.Mesh ) {

                parseMesh( child );

			}

		} );

		return output2;

	}

};