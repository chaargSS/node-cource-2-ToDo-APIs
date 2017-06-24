const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{ //url(horoku/amagon-webservices/localhost)
             if(err){
                return  console.log('unable to connect to mongodb server');
             }
             console.log('connected to mongodb');
/*//adding  collection in ToDos database
       db.collection('TodoApp').insertOne({
            text:'Something To Do',
            Completed:false
        },(err,result)=> {
            if(err){
                return  console.log('unable to insert',err);
             }
             console.log(JSON.stringify(result.ops,undefined,2)); //ops attribute will store all of the doc inserted
        });
  */
  //adding another collection in ToDos database
          db.collection('Users').insertOne({
            Name:'john',
            Age:25,
            Location:'201201 UP'
        },(err,result)=> {
            if(err){
                return  console.log('unable to insert',err);
             }
             //console.log(JSON.stringify(result.ops,undefined,2));
             console.log(result.ops[0]._id.getTimestamp()) ;  //2017-06-23T17:56:02.000Z
        });

             db.close(); 
});