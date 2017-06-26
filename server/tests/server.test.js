const expect =require('expect');
const request = require('supertest');
const {ObjectID}=require('mongodb');

const {apps}= require('./../server');
const {Todo}= require('./../models/todo');



var todos = [{
    _id:new ObjectID(),
    text:'abc'
   },{
       _id:new ObjectID(),
       text:'xyz',
       completed:true,
       completedAt:333}
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
            //expect(todos.length).toBe(1);
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

describe('GET /todos/:id',()=>{

    it('should get individual ID Todo data',(done)=>{
        request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .expect(200)
        .expect((res)=>{
            expect(res.body.text).toBe(todos[0].text);
        })
        .end(done);
    });

     it('should get 404 if Todo not found',(done)=>{
         var id=new ObjectID();
        request(app)
        .get(`/todos/${id.toHexString()}`)
        .expect(404)
        .end(done);
    });

     it('should get 404 for non object',(done)=>{
        request(app)
        .get('/todos/123abc')
        .expect(404)
        .end(done);
    });

});

describe('DELETE /todos/:id',()=>{

    it('should remove Todo',(done)=>{
        var hexId = todos[0]._id.toHexString();
        request(app)
        .delete(`/todos/${hexId}`)
        .expect(200)
        .expect((res)=>{
            expect(res.body._id).toBe(hexId);
        })
        .end((err,res)=>{
          if(err){
             return  done();
          }

          Todo.findById(hexId).then((todos)=>{
            expect(todos).toNotExist();
              done();
              }).catch((e)=> done(e));
           });
     });

     it('should get 404 if Todo not found',(done)=>{
         var id=new ObjectID();
        request(app)
        .delete(`/todos/${id.toHexString()}`)
        .expect(404)
        .end(done);
    });

     it('should get 404 for invalid object',(done)=>{
        request(app)
        .delete('/todos/123abc')
        .expect(404)
        .end(done);
    });
});
 
 describe("PATCH /todos/:id",()=>{
     
     it("should update TODO",(done)=>{
         var hexID= todos[0]._id.toHexString();
         request(app)
         .patch(`/todos/${hexID}`)
         .expect(200)
         .expect((res)=>{
             expect(res.body.text).toBe(hexID.text);
         },(e)=>done(e))
         .end((err,res)=>{
          if(err){
             return  done();
          }

          Todo.findById(hexID).then((todos)=>{
            expect(todos.text).toBe(hexID.text);
              done();
              }).catch((e)=> done(e));
           });
     })

 });
 