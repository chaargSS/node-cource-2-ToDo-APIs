const {MongoClient,ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{ 
             if(err){
                return  console.log('unable to connect to mongodb server');
             }
             console.log('connected to mongodb');
    
  /* //deleteOne
    db.collection('Todos').deleteOne({ text:'eat lunch'}).then((result)=>{
             console.log(result);   //CommandResult {  result: { n: 1, ok: 1 },....
    }); 
    //deleteMany
    db.collection('Todos').deleteMany({ text:'eat lunch'}).then((result)=>{
             console.log(result);   //CommandResult {  result: { n: 2, ok: 1 },....
    }) */
    //findOneAndDelete
    db.collection('Todos').findOneAndDelete({ completed:false}).then((result)=>{
             console.log(result);  
    })
                   //       db.close(); 
});