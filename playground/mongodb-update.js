const {MongoClient,ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{ 
             if(err){
                return  console.log('unable to connect to mongodb server');
             }
             console.log('connected to mongodb');
    
  
    //findOneAndUpdate
    db.collection('Todos').findOneAndUpdate(
        {
        _id:new ObjectID('594e0369d457a4d999ab824e')
      },{
            $set :{
            completed:true
             }
       },{
            returnOriginal:false
        }
     ).then((result)=>{
             console.log(result);  
    })
                   //       db.close(); 
});