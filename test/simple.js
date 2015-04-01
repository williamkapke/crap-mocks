var mocks = require('../.');
var fake_crap = { config:{} };
var should = require('should');

describe('monngo', function () {
  it('should load mongo-mock', function (done) {
    mocks.mongo.call(fake_crap, 'users', function (err, collection) {
      should.not.exist(err);
      should.exist(collection);
      collection.should.have.property('find');
      collection.should.have.property('findOne');
      done();
    });
  });
  it('should load redis-mock', function (done) {
    mocks.redis.call(fake_crap, function (err, instance) {
      should.not.exist(err);
      should.exist(instance);
      instance.should.have.property('setex');
      instance.should.have.property('hgetall');
      done();
    });
  });
});
