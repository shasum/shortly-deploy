var mongoose = require('mongoose');
var crypto = require('crypto');

// Mongoose.on('error', console.error.bind(console, 'connection error:'));
// Mongoose.once('open', function (callback) {
//   console.log('inside Link creation');

var urlSchema = mongoose.Schema({
  url: String,
  base_url: String,
  code: String,
  title: String,
  visits: { type: Number, default: 0 }
  // timestamps
});

urlSchema.methods.shasum = function(){
  var shasum = crypto.createHash('sha1');
  shasum.update(this.get('url'));
  this.set('code', shasum.digest('hex').slice(0, 5));
};

urlSchema.pre('save', function(next){
  this.shasum();
  next();
});

var Link = mongoose.model('Url', urlSchema);
//console.log('Link in link.js = ', Link);

module.exports = Link;
module.exports.urlSchema = urlSchema;

// if (urlSchema.methods === undefined){
//   urlSchema.methods.shasum = function(){
//     var shasum = crypto.createHash('sha1');
//     shasum.update(model.get('url'));
//     model.set('code', shasum.digest('hex').slice(0, 5));
//   };
// }

// urlSchema.pre('save', function(next){
//   this.shasum();
//   next();
// });

// var Link = mongoose.Model('Url', urlSchema);

/*
var Link = db.Model.extend({
  tableName: 'urls',
  hasTimestamps: true,
});
*/

// module.exports = Link;
