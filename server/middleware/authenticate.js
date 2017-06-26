const {User} = require('./../models/Users');

var authenticate = ((req,res,next)=>{
    var token = req.header('x-auth'); //1-
 //2-
    User.findByToken(token).then((user)=>{
        if(!user){
            return Promise.reject();
        }
        req.user=user;
        req.token=token;
        next();
    }).catch((e)=>{
         res.status(401).send(); //401 is for unauthorised access error
      });
});

module.exports = {authenticate};