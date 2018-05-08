var Animation = function( name, objectID, type, parent, startType, delay, repeat, duration, fromPos, toPos, fromRot, toRot, fromSca, toSca) {
    this.name = name;
    this.objectID = objectID;
    this.type = type;
    this.parent = parent;
    this.startType = startType;
    this.delay = delay;
    this.repeat = repeat;
    this.duration = duration;
    this.fromPos = fromPos;
    this.toPos = toPos;
    this.fromRot = fromRot;
    this.toRot = toRot;
    this.fromSca = fromSca;
    this.toSca = toSca;
    console.log("Animation.js Creating Animation");
    console.log(this);
}

Animation.prototype = {

    fromJSON: function ( json ) {
    	console.log('Animation.js: fromJson begin');
        console.log(json);
        this.name = json.name;
        this.type = json.type;
        this.parent = json.parent;
        this.startType = json.startType;
        this.objectID = json.objectID;
        this.delay = json.delay;
        this.repeat = json.repeat;
        this.duration = json.duration;
        this.fromSca = json.fromSca;
        this.toSca = json.toSca;
        this.fromRot = json.fromRot;
        this.toRot = json.toRot;
        this.fromPos = json.fromPos;
        this.toPos = json.toPos;
        console.log('Animation.js: fromJson end');
    },


    toJSON: function ( id ) {
    	console.log('Animation.js: toJson begin');
        var output = {};
        output.id = id;
        output.name = this.name;
        output.type = this.type;
        output.parent = this.parent;
        output.startType = this.startType ;
        output.delay = this.delay;
        output.repeat = this.repeat;
        output.objectID = this.objectID;
        output.duration = this.duration;
        output.fromPos = {x:this.fromPos.x, y:this.fromPos.y, z:this.fromPos.z};
        output.toPos = {x:this.toPos.x, y:this.toPos.y, z:this.toPos.z};
        output.fromRot = {x:this.fromRot.x, y:this.fromRot.y, z:this.fromRot.z};
        output.toRot = {x:this.toRot.x, y:this.toRot.y, z:this.toRot.z};
        output.fromSca = {x:this.fromSca.x, y:this.fromSca.y, z:this.fromSca.z};
        output.toSca = {x:this.toSca.x, y:this.toSca.y, z:this.toSca.z};
        console.log('Animation.js: toJson output');
        console.log(output);
        console.log('Animation.js: toJson end');
        return output;

    }
}