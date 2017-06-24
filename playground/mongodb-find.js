const {MongoClient,ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{ 
             if(err){
                return  console.log('unable to connect to mongodb server');
             }
             console.log('connected to mongodb');
    
   //find() return the cursor
    db.collection('Users').find({ Name:'john'}).then((count)=>{
             console.log('ToDos count',count);  //ToDos count 2
    },(err)=>{
        console.log('unable to fetch',err);
    })
                   //       db.close(); 
});