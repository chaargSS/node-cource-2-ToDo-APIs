const {ObjectID} = require('mongodb');
const {Todo}= require('./../../models/Todo.js');
const {User}= require('./../../models/Users.js');
const jwt = require('jsonwebtoken');

var userOneId = new ObjectID();
var userTwoId = new ObjectID();

var todos = [{
    _id:new ObjectID(),
    text:'abc',
    _creator:userOneId
   },{
       _id:new ObjectID(),
       text:'xyz',
       completed:true,
       completedAt:333,
       _creator:userTwoId
    }
];


var users = [{
    _id:userOneId,
    Email:"abc@gmail.com",
    password:'userOnePass',
    tokens:[{
        access:'auth',
        token:jwt.sign({_id:userOneId,access:'auth'},process.env.JWT_SECRET).toString()
         }]
    },{
        _id:userTwoId,
        Email:'123@gmail.com',
        password:'usertwoPass',
        tokens:[{
        access:'auth',
        token:jwt.sign({_id:userTwoId,access:'auth'},process.env.JWT_SECRET).toString()
         }]
    }];
  

var populateTodos = (done)=>{
    
   Todo.remove({}).then(()=> {
        return Todo.insertMany(todos);
    }).then(()=> done());
};

var populateUsers = (done)=>{
    User.remove({}).then(()=>{
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();

//Promise.all() takes array of promises
        return Promise.all([userOne,userTwo])}).then(()=>{
            done();
    });
};

module.exports = {todos,populateTodos,users,populateUsers};
