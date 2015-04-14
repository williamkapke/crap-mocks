
var mongo,redis;
var path = require('path');
var cache = {};

exports = module.exports = {
  mongo: function (collection, callback) {
    if(!mongo) mongo = require('mongo-mock');

    var config = this.config;
    callback = arguments[arguments.length-1];
    if(callback === collection) collection = config.settings.collection;

    var settings = config.settings || {};
    var MongoClient = mongo.MongoClient;
    var url = settings.url || 'mongodb://127.0.0.1:27017/test';

    function finisher(db) {
      callback(null, collection? db.collection(collection) : db);
    }
    var cached = cache[url];
    if(cached) return cached.push(finisher);
    cached = cache[url] = [finisher];

    if(typeof settings.persist === 'string')
      MongoClient.persist = path.resolve(this.config.root, settings.persist);

    if(typeof settings.max_delay === 'number')
      mongo.max_delay = settings.max_delay;

    MongoClient.connect(url, settings, function (err, db) {
      if(err) return callback(err);

      function setup_complete(err) {
        if(err) return callback(err);

        function connected(callback) {
          callback(db);
        }
        cache[url] = { push: connected };
        cached.forEach(connected);
      }

      if(typeof settings.setup === 'string')
        require(path.resolve(config.root, settings.setup))(db, setup_complete);
      else
        setup_complete();
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
