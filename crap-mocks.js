
var mongo,redis;

exports = module.exports = {
  mongo: function (collection, callback) {
    if(!mongo) mongo = require('mongo-mock');
    var MongoClient = mongodb.MongoClient;
    MongoClient.connect(this.config.settings, function (err, db) {
      if(err) return callback(err);
      callback(null, db.collection(collection||this.config.settings.collection))
    });
  },
  redis: function (callback) {
    if(!redis) redis = require('redis-mock');
    callback(null, redis.createClient(this.config.settings));
  }
};
