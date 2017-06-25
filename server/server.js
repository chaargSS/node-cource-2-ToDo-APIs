
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const {ObjectID} = require('mongodb');

var {mongoose}= require('./db/mongoose.js');  //.. since both server.js and mongoose.js in other folders than root
var {Todo} = require('./models/Todo');
var {user} = require('./models/Users.js');


const port = process.env.PORT || 3000;
var app = express();

app.use(bodyParser.json());

app.post('/todos',(req,res)=>{
  
    var todo = new Todo( {
        text : req.body.text
    });

    todo.save().then((doc)=>{
        res.send(doc);
    },(e)=>{
        res.status(400).send(e);
    });
});

app.get('/todos',(req,res)=>{
    Todo.find().then((todos)=>{
        res.send(todos);
    },(e) =>{
         res.status(400).send(e);
    });
});


//GET /todos:ID
app.get('/todos/:id',(req,res)=> {
     var id = req.params.id;
    if(!ObjectID.isValid(id)){
        return  res.status(404).send();  //id= 123 will get empty with 404 status code
    }
    Todo.findById(id).then((doc)=>{
        if(!doc){
            return  res.status(404).send();  
        }
        res.send(doc);
    },(e)=>{
         res.status(400).send(); //will get bad request /400 error
    });
});

app.delete('/todos/:id',(req,res)=> {
     var id = req.params.id;
    if(!ObjectID.isValid(id)){
        return  res.status(404).send();  //id= 123 will get empty with 404 status code
    }
    Todo.findByIdAndRemove(id).then((doc)=>{
        if(!doc){      //we need this even if no doc is present findByIdAndRemove() still runs successful with null return
            return  res.status(404).send();   
        }
        res.send({doc});
    },(e)=>{
         res.status(400).send(); //will get bad request /400 error
    });
});

app.patch('/todos/:id',(req,res)=> {
    var id = req.params.id;
    //describing the properties which can be updated
    var body= _.pick(req.body,['text','completed']);
    //checking the Id validity
    if(!ObjectID.isValid(id)){
        return  res.status(404).send();  //id= 123 will get empty with 404 status code
    }
    //checking if completed is true or not ,if true then set value of completedAt to time stamp
    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date().getTime;
    }else {
        body.completedAt = null;
        body.completed = false;
    };

    Todo.findByIdAndUpdate(id,{$set:body},{new:true}).then((todo)=>{
        if(!todo){
           return res.status(404).send();
        }

        res.send({todo});
    }).catch((e)=>{
        res.status(400).send();
    });
});

app.listen(port,(res)=>{
    console.log(`starting at : ${port}`);
});

module.exports = {app};


