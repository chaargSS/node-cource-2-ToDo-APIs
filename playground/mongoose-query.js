const {ObjectID} = require('mongodb');

var {mongoose} = require('./../server/db/mongoose');
var {Todo} = require('./../server/models/Todo');

/*
var id= '594ec7b656fdcf0830353c74';

if(!ObjectID.isValid(id)){
    console.log('Id is not Valid')
}; 

//find()

Todo.find({
    _id:id
}).then((todos)=>{
    console.log(" Todos ",todos);
});

//findOne()
Todo.findOne({
    _id:id
}).then((todo)=>{
    console.log(" Todo ",todo);
});

//findById
Todo.findById(id).then((todo)=>{
    if(!todo){
        return console.log('Id not found'); 
    }
    console.log(" Todo by Id ",todo);
}).catch((e)=>console.log(e));

//if we change the  character of id then we get  Id not found

//if add one more character in end of id  // we get Id is not Valid n catch error
*/
const {user} = require('./../server/models/Users');

var id= '594e4a1e978eb41970fa38a4';
 
 user.findById(id).then((user)=>{
     if(!user){
        return console.log('User not found');
     }
     console.log('user :',user);
 }).catch((e)=>console.log(e));