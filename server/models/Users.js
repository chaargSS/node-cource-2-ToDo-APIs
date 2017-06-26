var mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

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

var User = mongoose.model('User',userSchema);

module.exports = {User};