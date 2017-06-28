var mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var userSchema = new mongoose.Schema({
    Email:{
        type:String,
        required:true,
        trim:true,
        minlength:1,
        unique:true,
        validate:{
            validator:(value)=>{
              return validator.isEmail(value);
        },
        message: '{value} is not a valid email'
        }        
     },
     password:{
          type:String,
        required:true,
        trim:true,
        minlength:6
     },
     tokens:[{
         access:{
             type:String,
             required:true
         },
         token:{
              type:String,
             required:true
         }
     }]
});

//limiting what to return to user when mongoose model is converted into a json value
userSchema.methods.toJSON = function(){
    var user =this;
    var userObject = user.toObject(); //converting to object to pick properties

    return _.pick(userObject,['_id','Email']); //pick require lodash
}

userSchema.methods.generateAuthToken = function() {
    //accessing individual documents under schema
    var user = this; //bocz arrow function does not authorise this keyword thus we are using regular function
     var access = 'auth';
     var token = jwt.sign({_id:user._id.toHexString(),access},'abc123').toString();

     user.tokens.push({access,token});

     return user.save().then(()=>{
         return token;
     });
};


//userSchema.statics is an object kind method, any method created on it turnsout to be a model method unlike userSchema.methods at which we created instance methods 
userSchema.statics.findByToken = function(token){
    var User = this ; //binding model as this
    var decoded;

    try{
      decoded = jwt.verify(token,'abc123');
    }catch (e){
       return Promise.reject();//equivalent to new Promise((resolve,reject)=>{ reject();}) //we can even pass argument to return in reject(arg)
    }

    return User.findOne({
        _id:decoded._id,
        'tokens.token':token, //  ''  is used bcoz of nested access to token
        'tokens.access':'auth'
    });
};


userSchema.pre('save',function(next){
   var user =this;
    if(user.isModified('password')){
        bcrypt.genSalt(10,(err,salt)=>{
           bcrypt.hash(user.password,salt,(err,hash)=>{
            user.password= hash;
             next();
              }) ;
         });
      }else{
           next();
      };
});

userSchema.statics.findByCredential = function(email,password){
    var User = this;

  return  User.findOne({Email:email}).then((user)=>{
        if(!user){
            return Promise.reject();
        }

       return new Promise((resolve,reject)=>{
               bcrypt.compare(password,user.password,(err,res)=>{
                    if(res){
                        resolve(user);
                      
                       } else{
                            reject();
                       }              
                 });
           });
     });
 };

 userSchema.methods.removeToken = function(token){
     var user = this;

   return  User.update({
         $pull:{
             tokens:{
                 token:token
             }
         }
     });
 };

var User = mongoose.model('User',userSchema);

module.exports = {User};