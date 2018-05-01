class FraxGEM{
    
    static jsonOBJEncoder(jsonObj){
        console.log(jsonObj);
        //console.log("asfasdfafafadsfda");
        var geometries = JSON.parse(JSON.stringify(jsonObj.geometries));
        var size = geometries.length;
        console.log(size);
        if (size < 2) return;
        for(var i = 0 ; i< size ; i++){
            if(FraxGEM.isCompressed(jsonObj.geometries[i])) continue;
            for(var j = i + 1 ; j<size ; j++){
               // console.log(i+" + "+j);
                if(FraxGEM.isCompressed(jsonObj.geometries[j])) continue;
                var result = FraxGEM.compressGeometry(geometries[i],geometries[j])
                jsonObj.geometries[j].data.attributes = result;
            }
        }
        

    }


    static isCompressed(geo){
        if (!geo.hasOwnProperty("data")) return true;
        return geo.data.attributes.hasOwnProperty("normalIndex") || 
        geo.data.attributes.hasOwnProperty("positionIndex") || 
        geo.data.attributes.hasOwnProperty("uvIndex");

    }


    static compressGeometry(geometry1, geometry2){

        var result = new Object();
        var geo1 = geometry1.data.attributes;
        var geo2 = geometry2.data.attributes;



        if(geo1.hasOwnProperty("position") && geo2.hasOwnProperty("position")){
            if(JSON.stringify(geo1.position) == JSON.stringify(geo2.position)){
                console.log("position same");
                result.positionIndex = geometry1.uuid;
            }else{
                result.position = geo2.position;
            } 
        }

        if(geo1.hasOwnProperty("normal") && geo2.hasOwnProperty("normal")){
            if(JSON.stringify(geo1.normal) == JSON.stringify(geo2.normal)){
                console.log("normal same");
                result.normalIndex = geometry1.uuid;
            }else{
                result.normal = geo2.normal;
            }
        }
        if(geo1.hasOwnProperty("uv") && geo2.hasOwnProperty("uv")){
            if(JSON.stringify(geo1.uv) == JSON.stringify(geo2.uv)){
                console.log("uv same");
                result.uvIndex = geometry1.uuid;
            }else{
                result.uv = geo2.uv; 
            } 
        }

        return result;
   
    }

    static jsonOBJDecoder(jsonObj){
        

                var geometries = jsonObj.geometries;
               // var geometries = JSON.parse(JSON.stringify(jsonObj.geometries));
                var size = geometries.length;
                var tempAttributes = [];
                if(size < 2) return;
                for(var i = 0 ; i< size ; i++){
                    if (geometries[i].hasOwnProperty("data"))
                        tempAttributes[geometries[i].uuid] = geometries[i].data.attributes;
                }
                console.log(tempAttributes);
                for(var i = 0 ; i < size ; i++){
                    if (! geometries[i].hasOwnProperty("data")) continue;
                    if(geometries[i].data.attributes.hasOwnProperty("positionIndex")){
                        geometries[i].data.attributes.position = tempAttributes[geometries[i].data.attributes.positionIndex].position;
                        delete geometries[i].data.attributes.positionIndex;
                    }

                    if(geometries[i].data.attributes.hasOwnProperty("normalIndex")){
                        geometries[i].data.attributes.normal = tempAttributes[geometries[i].data.attributes.normalIndex].normal;
                        delete geometries[i].data.attributes.normalIndex;
                    }

                    if(geometries[i].data.attributes.hasOwnProperty("uvIndex")){
                        geometries[i].data.attributes.uv = tempAttributes[geometries[i].data.attributes.uvIndex].uv;
                        delete geometries[i].data.attributes.uvIndex;
                    }
                    
                }
                
                //console.log(jsonObj);
            }


}