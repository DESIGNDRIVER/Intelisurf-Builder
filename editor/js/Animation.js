var Animation = function( name, objectID, type, parent, startType, delay, repeat, duration, from, to) {
    this.name = name;
    this.objectID = objectID;
    this.type = type;
    this.parent = parent;
    this.startType = startType;
    this.delay = delay;
    this.repeat = repeat;
    this.duration = duration;
    this.from = from;
    this.to = to;
    console.log(to);
}

Animation.prototype = {


    fromJSON: function ( json ) {
        console.log(json);
        this.name = json.name;
        this.type = json.type;
        this.parent = json.parent;
        this.startType = json.startType;
        this.objectID = json.objectID;
        this.delay = json.delay;
        this.repeat = json.repeat;
        this.duration = json.duration;
        this.from = json.from;
        this.to = json.to;

    },


    toJSON: function ( id ) {
  
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
        output.from = {x:this.from.x, y:this.from.y, z:this.from.z};
        output.to = {x:this.to.x, y:this.to.y, z:this.to.z};
        console.log('toJson',output);
        return output;

    }
}