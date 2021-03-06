// var bcrypt =require('bcrypt')

// const saltRounds = 10;
// const plainText = "Tarun"

// bcrypt.genSalt(saltRounds,function(err,salt){
//     bcrypt.hash(plainText,salt,function(err,hash){
//         if(err)
//         console.log(err)
//         console.log(hash)
//     })
// })

const  mongoose = require('mongoose')
const mongodb = require('mongodb')

mongoose.connect('mongodb://localhost/mongoose')


var db = mongoose.connection;

db.once('open',function(){
    console.log('we are connectted')
})

var kittySchema = mongoose.Schema({
    name: String
  });

//   var Kitten = mongoose.model('Kitten', kittySchema);

//   var silence = new Kitten({ name: 'Silence' });
// console.log(silence.name); 

kittySchema.methods.speak = function () {
    var greeting = this.name
      ? "Meow name is " + this.name
      : "I don't have a name";
    console.log(greeting);
  }
  
  var Kitten = mongoose.model('Kitten', kittySchema);

  var fluffy = new Kitten({ name: 'fluffy' });
  fluffy.speak()

fluffy.save(function (err, fluffy) {
    if (err) return console.error(err);
    fluffy.speak()
  });

  Kitten.find(function (err, kittens) {
    if (err) return console.error(err);
    console.log(kittens);
  })