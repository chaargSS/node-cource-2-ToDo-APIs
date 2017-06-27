const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = 'abc123';
/*
//bcrypt.genSalt(no. of rounds to generate salt,callback) //generate salt value then using that we gerated hashed value
bcrypt.genSalt(10,(err,salt)=>{
    bcrypt.hash(password,salt,(err,hash)=>{
        console.log(hash);  //hasdedPass
    });
}); */

var hasdedPass = '$2a$10$GLl.waNwhDUBXJnmMljxTO946yB3WIz9Kjp8yO/UKXo97GDygQNGS';
bcrypt.compare(password,hasdedPass,(err,res)=>{
    console.log(res);  //true
});

/*
var data = {
    id:10
};

var token =jwt.sign(data,'123abc');
console.log(token);//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsImlhdCI6MTQ5ODQ3MjMzM30.mApvkBZtg3AuBwYRvZHYfvV0g1C0AabQ3U1hX9NuGC0
//their are three parts 1-HEADER:ALGORITHM & TOKEN TYPE 2-PAYLOAD:DATA 3-VERIFY SIGNATURE
//check out at   https://jwt.io/

var decoded = jwt.verify(token,'123abc');
console.log('decode : ',decoded);  //decode :  { id: 10, iat: 1498472333 } //iat is completedAt


var message = ' hey how are u';
var hash= SHA256(message).toString(); //as SHA256 returns object

console.log(message);  //hey haow are u
console.log(hash);    //6285c6d3784fcac3a73980c76184bb22c6352c4e3d33740f4d6335c02075eb06

var data = {
    id:4
}

//token that passed to user
var token = {
    data,
    hash: SHA256(JSON.stringify(data)+'somesecret').toString()
}
 //some body changed the data in b/w user token  and resultHash send back by user
token.data.id=5;
token.hash=SHA256(JSON.stringify(token.data)).toString(); //but the person doesn't know the secret so they cant logged in  for id 4

var resultHash = SHA256(JSON.stringify(token.data)+'somesecret').toString();

if(resultHash === token.hash){
    console.log('data was not changed');
}else {
    console.log('data was changed .Do not trust');
} */