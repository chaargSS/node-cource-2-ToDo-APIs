const {ObjectID} = require('mongodb');

var {mongoose} = require('./../server/db/mongoose');
var {Todo} = require('./../server/models/Todo');
/*
//findByIdAndRemove  //will return deleted doc
Todo.findByIdAndRemove('594ecaee2dfa9e0d60bb1865').then((doc)=>{
    console.log(doc);
});

//findOneAndRemove  //will return deleted doc
Todo.findOneAndRemove({ _id:'594ec7b656fdcf0830353c74' }).then((doc)=>{
    console.log(doc);
});

*///remove()     //won't return deleted doc just the number of field deleted etc
Todo.remove({}).then((doc)=>{
    console.log(doc);
});