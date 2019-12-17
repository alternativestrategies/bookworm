var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
      },
      name: {
        type: String,
        required: true,
        trim: true
      },
      favoriteBook: {
        type: String,
        required: true,
        trim: true
      },
      password: {
        type: String,
        required: true
    }
})
//authenticate input against database documents
UserSchema.statics.authenticate = function(email, password, callback){
  User.findOne({email: email})
      .exec(function(error, user){
        if(error){
          return callback(error);
        } else if (!user){
          var err = new Error('User not found');
          err.status = 401;
          return callback(err);
        }
        bcrypt.compare(password, user.password, function(error, hash){
          if(hash === true){
            return callback(null, user);
          } else {
            return callback();
          }
        })
      })
}

//hash password before saving o db
UserSchema.pre('save', function(next) {
    //refers to the obj we created containing info user entered into sign up
    var user = this;
    //the text, the number of times to encrypt and a callback
    bcrypt.hash(user.password, 10, function(err, hash) {
        if (err){
            return next(err);
        } 
        user.password = hash;
        next();
    })
})

var User = mongoose.model('User', UserSchema);
module.exports = User;