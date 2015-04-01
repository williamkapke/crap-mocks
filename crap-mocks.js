
var mongo,redis;

exports = module.exports = {
  mongo: function (collection, callback) {
    if(!mongo) mongo = require('mongo-mock');

    callback = arguments[arguments.length-1];
    if(callback === collection) collection = this.config.settings.collection;

    var settings = this.config.settings || {};
    var MongoClient = mongo.MongoClient;
    var url = settings.url || 'mongodb://127.0.0.1:27017/test';

    MongoClient.connect(url, settings, function (err, db) {
      if(err) return callback(err);
      callback(null, db.collection(collection))
    });
  },
  redis: function (callback) {
    if(!redis) redis = require('redis-mock');
    var settings = this.config.settings || {};
    var host = settings.host || 'localhost';
    var port = settings.port || 6379;
    var client = redis.createClient(host, port, settings);
    callback(null, client);
  }
};
