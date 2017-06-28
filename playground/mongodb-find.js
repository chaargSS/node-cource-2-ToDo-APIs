const {MongoClient,ObjectID} = require('mongodb');
const {User}= require('./../server/models/Users');
const {app}= require('./../server/server.js');
/*
MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{ 
             if(err){
                return  console.log('unable to connect to mongodb server');
             }
             console.log('connected to mongodb');
    
   //find() return the cursor
    db.findOne({ Email:'test2@gmail.com'}).then((user)=>{
             console.log('ToDos user',user);  //ToDos count 2
    },(err)=>{
        console.log('unable to fetch',err);
    })
                   //       db.close(); 
});*/
var token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1OTUzYjZhOTFkODA0YjE1ZGMxMWZjNWMiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNDk4NjU4NDc0fQ.4FWUBnky73pQbLfubW70wHcF5tos9FTSwKI4V0tqTgU";
User.findByToken(token).then((user)=>{
             console.log('ToDos user',user);  //ToDos count 2
    },(err)=>{
        console.log('unable to fetch',err);
    })