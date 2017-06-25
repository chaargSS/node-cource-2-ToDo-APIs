const expect =require('expect');
const request = require('supertest');

const {Todo}= require('./../models/todo');
const {app}= require('./../server');

console.log(Todo);
var todos = [{
    text:'abc'
   },{
       text:'xyz'
   }
];


beforeEach((done)=>{
    
   Todo.remove({}).then((todos)=> {
        return Todo.insertMany(todos);
    }).then(()=> done());
}); 

describe('POST /todos',()=>{

    it('should create a new todo',(done)=>{
        var test= 'Test todo text';

        request(app)
        .post('/todos')
         .send({text})
         .expect(200)
         .expect((res)=>{
            expect(res.body.text).toBe(text);
    })
    .end((err,res)=>{
        if(err){
            return done(err);
        }

       Todo.find({text}).then((todos)=>{
            expect(todos.length).toBe(1);
            expect(todos[0].text.toBe(text));
            done();
        }).catch((e)=> done(e));
    });

}); 

    it('should not create  Todo with invalid body data',(done)=>{

        request(app)
        .post('/todos')
         .send({})
         .expect(400)
         .end((err,res)=>{

        if(err){
            return done(err);
        }

       Todo.find().then((todos)=>{
            expect(todos.length).toBe(0);
              done();
        }).catch((e)=> done(e));
         });
    });

}) 

describe('GET /todos',()=>{

    it('should get all Todo data',(done)=>{
        request(app)
        .get('/todos')
        .expect(200)
        .expect((res)=>{
            expect(res.body.text.length).toBe(2);
        })
        .end(done);
    });
});