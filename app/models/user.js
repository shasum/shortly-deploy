var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
// var Link = require('./link.js');
var urlSchema = require('./link.js').urlSchema;

  // initialize: function(){
  //   this.on('creating', this.hashPassword);
// console.log('Mongoose connection = ', Mongoose);
// Mongoose.on('error', console.error.bind(console, 'connection error:'));
// Mongoose.once('open', function (callback) {
//   console.log('Inside User.js');
//console.log('Link in User.js = ', Link);
// var urlSchema = mongoose.model('Link').schema;

var userSchema = mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  // changed from schema to Array - unknown consequences
  links: [urlSchema]
  // timestamps
});

userSchema.methods.comparePassword = function(attemptedPassword, callback) {
  bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
    callback(isMatch);
  });
};

userSchema.methods.hashPassword = function(done){
  // bcrypt.hash(this.get('password'), null, null, function(err, hash){
  //   if (err) throw err;
  //   this.set('password', hash);
  //   done();
  // });
  var cipher = Promise.promisify(bcrypt.hash);
  return cipher(this.get('password'), null, null).bind(this)
  .then(function(hash) {
    this.set('password', hash);
    done();
  });
};

userSchema.pre('save', true, function(next, done){
  next();
  this.hashPassword(done);
});

var User = mongoose.model('User', userSchema);

module.exports = User;

// });



// var userSchema = mongoose.userSchema;

// if (userSchema.methods === undefined){
//   userSchema.methods.comparePassword = function(attemptedPassword, callback) {
//     bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
//       callback(isMatch);
//     });
//   };

//   userSchema.methods.hashPassword = function(done){
//     bcrypt.hash(this.get('password'), null, null, function(err, hash){
//       if (err) throw err;
//       this.set('password', hash);
//       done();
//     });
//   };
// }

//   tableName: 'users',
//   hasTimestamps: true,
