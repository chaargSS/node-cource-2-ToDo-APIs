var express = require('express');
var bodyParser = require('body-parser');

var {mongoose}= require('./db/mongoose.js');  //.. since both server.js and mongoose.js in other folders than root
var {Todo} = require('./models/Todo');
var {user} = require('./models/Users.js');

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
    })
});

app.get('/todos',(req,res)=>{
    Todo.find().then((todos)=>{
        res.send(todos);
    },(e) =>{
         res.status(400).send(e);
    });
})

app.listen(3000,(res)=>{
    console.log('listening to port 3000');
});

module.exports = {app};


