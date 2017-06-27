const expect =require('expect');
const request = require('supertest');
const {ObjectID}=require('mongodb');
const jwt = require('jsonwebtoken');

const {app}= require('./../server.js'); //. for  relative path i.e under test folder  .. for going back one directory in server
const {Todo}= require('./../models/Todo.js');
const {User} =require('./../models/Users.js');
const {todos,populateTodos,users,populateUsers} = require('./seed/seed.js');

beforeEach(populateUsers);
beforeEach(populateTodos);  
 

describe('POST /todos',()=>{

    it('should create a new todo',(done)=>{
        var text= 'Test todo text';

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
            expect(todos[0].text).toBe(text);
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
            expect(todos.length).toBe(2);
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
            expect(res.body.length).toBe(2);
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
             expect(res.body.text).toBe(todos[0].text);
         },(e)=>done(e))
         .end((err,res)=>{
          if(err){
             return  done();
          }

          Todo.findById(hexID).then((todos)=>{
            expect(todos.text).toBe(hetodos[0].text);
              done();
              }).catch((e)=> done(e));
           });
     })

 });

describe('GET /users/me',()=>{

     it('should return user if authenticated',(done)=>{

         request(app)
         .get('/users/me')
         .set('x-auth',users[0].tokens[0].token) //setting header (x-auth and token)
          .expect(200)
          .expect((res)=>{
              expect(res.body.Email).toBe(users[0].Email);
              expect(res.body._id).toBe(users[0]._id.toHexString());
          })
          .end(done)
     });

       
       it('should return 401 if not authenticated',(done)=>{
           request(app)
         .get('/users/me')
          .expect(401)
          .expect((res)=>{
              expect(res.body).toEqual({});  //compairing empty object with another object via toEqual()
          })
          .end(done)

     });

})

describe('POST /users',()=>{

     it('should create user ',(done)=>{
        var email ={
               Email:'a123@gmail.com',
               password:'qwerty'
           };
        request(app)
        .post('/users')
        .send(email)
        .expect(200)
        .expect((res)=>{
            expect(res.body.Email).toBe(email.Email);
            expect(res.headers['x-auth']).toExist();
            expect(res.body._id).toExist();
        })
        .end((e)=>{
           if(e){
               return  done(e);
           } 

           User.findOne({Email:email.Email}).then((user)=>{
               expect(user).toExist();
               expect(user.password).toNotBe(email.password);
               done();
           })
        })

     });

       
       it('should return validation error   if request invalid ',(done)=>{
           var email ={
               Email:'12345ab@gmail.com',
               password:'12546'
           };
          request(app)
        .post('/users')
        .send(email)
        .expect(400)
          .end(done)
        });
     

       it('should not create user if email in use ',(done)=>{
         var email ={
               Email:users[0].Email,
               password:'1252346'
           };
         
          request(app)
        .post('/users')
        .send(email)
        .expect(400)
        .end(done)
        
     });
});

describe('POST /users/login',()=>{
       
        it('should login user and return auth token',(done)=>{
               
                request(app)
                .post('/users/login')
                .send({Email:users[1].Email,password:users[1].password})
                .expect(200)
                .expect((res)=>{
                    expect(res.headers['x-auth']).toExist();
                    expect(res.body).toNotEqual({});
                    expect(res.body._id).toExist();
                })
                .end((err,res)=>{
                    if(err){  return done(err)  }

                    User.findById(users[1]._id).then((user)=>{
                        expect(user.tokens[0]).toInclude({
                            access:'auth',
                            token:res.headers['x-auth']
                        });
                            done();
                        }).catch((e)=>done(e));
                });

        });

        it('should reject invalid user',(done)=>{

                 request(app)
                .post('/users/login')
                .send({Email:'abc@gmail',password:'abc123'})
                .expect(400)
                .expect((res)=>{
                     expect(res.body).toEqual({});
                       expect(res.headers['x-auth']).toNotExist();
                })
                .end((err,res)=>{
                    if(err){  return done(err)  }

                    User.findById(users[1]._id).then((user)=>{
                        expect(user.tokens.length).toBe(0) 
                            done();
                        }).catch((e)=>done(e));
                     });

                }); 

});