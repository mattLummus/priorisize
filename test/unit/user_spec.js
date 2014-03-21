/* jshint expr:true */

'use strict';

process.env.DBNAME = 'prioTest';
var expect = require('chai').expect;
var User;
//var fs = require('fs');
//var exec = require('child_process').exec;
var Mongo = require('mongodb');
var u1, u2;

describe('User', function(){
  this.timeout(20000);
  //email testing takes a while to execute, especially from Travis, so I'm giving all tests ten seconds to run

  before(function(done){
    var initMongo = require('../../app/lib/init-mongo');
    initMongo.db(function(){
      User = require('../../app/models/user');
      done();
    });
  });

  beforeEach(function(done){
    global.nss.db.dropDatabase(function(err, result){
      u1 = new User({name: 'Bob', email:'nomail@hotmail.com', password:'678utf'});
      u1.register(function(err, body){
        done();
      });
    });
  });

  describe('new', function(){
    it('should create a new User object', function(){
      u1 = new User({name: 'Sam', email:'sam@aol.com', password:'1234'});
      expect(u1).to.be.instanceof(User);
      expect(u1.name).to.equal('Sam');
      expect(u1.email).to.equal('sam@aol.com');
      expect(u1.password).to.equal('1234');
    });
  });

  describe('register', function(){
    it('should register a new user and put it in the DB', function(done){
      u1 = new User({name:'Matt', email: 'mattlummus_2009@hotmail.com', password:'1234', });
      u1.register(function(err, body){
        expect(err).to.equal(null);
        expect(u1.password).to.not.equal('1234');
        expect(u1.password).to.have.length(60); //this checks for a hashed password
        expect(u1._id).to.be.instanceof(Mongo.ObjectID);
        //body = JSON.parse(body);
        //if (body.id === undefined){
        //  console.log('THIS TEST IS FAILING BECAUSE OF A MAILGUN ISSUE. Check app/lib/send-email.js and the MAILGUN environment variable to make sure the Mailgun URL and API key are correct.');
        //}
        //expect(typeof body.id).to.equal('string');
        done();
      });
    });

    it('should not register a duplicate user based on email', function(done){
      u1 = new User({name:'Not Matt', email: 'mattlummus_2009.com', password:'abcd'});
      u1.register(function(err, body){
        expect(typeof err).to.equal('string');
        done();
      });
    });

    it('should not register a duplicate user based on name', function(done){
      u1 = new User({name:'Matt', email: 'nomail@hotmail.com', password:'1234'});
      u1.register(function(err, body){
        expect(typeof err).to.equal('string');
        done();
      });
    });
  });

  describe('.findById', function(){
    it('should find user by its id', function(done){
      u2 = new User({name: 'Matt', email:'mattlummus_2009@hotmail.com', password:'678utf'});
      u2.register(function(err, ret){
        User.findByEmail('mattlummus_2009@hotmail.com', function(ret){
          var testId = ret._id;
          User.findById(testId.toString(), function(ret1){
            expect(ret1.name).to.equal('Matt');
            done();
          });
        });
      });
    });
  });

  /*
  describe('.findByName', function(){
    it('should find a user by his name', function(done){
      u1 = new User({name: 'Sam', email:'max.vance+FINDMYFANS_UNIT_TEST_FINDBYNAME@gmail.com', password:'678utf', description:'my name is sam', teams:['Nashville Predators'], home:'Nashville, TN'});
      u1.register(function(){
        User.findByName('Sam', function(ret){
          expect(ret.name).to.equal('Sam');
          expect(ret.email).to.equal('max.vance+FINDMYFANS_UNIT_TEST_FINDBYNAME@gmail.com');
          done();
        });
      });
    });
  });
  */

  describe('findByEmailAndPassword', function(){
    it('should return a user by email and password', function(done){
      User.findByEmailAndPassword('nomail@hotmail.com', '678utf', function(record){
        expect(record._id).to.deep.equal(u1._id);
        done();
      });
    });
    it('should not return a user unless email is registered', function(done){
      User.findByEmailAndPassword('bad@aol.com', '678utf', function(record){
        expect(record).to.be.false;
        done();
      });
    });
    it('should not return a user with wrong password', function(done){
      User.findByEmailAndPassword('nomail@hotmail.com', '402fij', function(record){
        expect(record).to.be.false;
        done();
      });
    });
  });

  describe('findByEmail', function(){
    it('should return a user by email', function(done){
      u2 = new User({name: 'Matt', email:'mattlummus_2009@hotmail.com', password:'678utf'});
      u2.register(function(err, ret){
        User.findByEmail('mattlummus_2009@hotmail.com', function(record){
          //we can't run the following test based on ID since user.register doesn't return the registered user
          expect(record.name).to.equal('matt');
          done();
        });
      });
    });
  });

  describe('#update', function(){
    beforeEach(function(done){
      u2 = new User({name: 'Matt', email:'mattlummus_2009@hotmail.com', password:'678utf'});
      u2.register(function(){
        done();
      });
    });
    it('should update an existing user', function(done){
      User.findByEmail('mattlummus_2009@hotmail.com', function(record){
        record = new User(record);
        record.email = 'mattlummus_2009@hotmail.com';
        record.update(function(updatedUser){
          expect(updatedUser.email).to.equal('mattlummus_209@hotmail.com');
          expect(updatedUser._id).to.deep.equal(record._id);
          expect(updatedUser.password).to.have.length(60);
          done();
        });
      });
    });
  });

  /*
  describe('addTask', function(){
    it('should add a task to the user tasks', function(done){
      u2 = new User({name: 'Matt', email:'mattlummus_2009@hotmail.com', password:'678utf'});
      u2.register(function(){
        u2.addTeam('Tennessee Titans', function(){
          User.findById(u2._id.toString(), function(record){
            expect(record.teams).to.have.length(2);
            expect(record.teams[0]).to.equal('Nashville Predators');
            expect(record.teams[1]).to.equal('Tennessee Titans');
            done();
          });
        });
      });
    });
  });

  describe('removeTeam', function(){
    it('should remove a team from the user\'s teams', function(done){
      u2 = new User({name: 'Sam', email:'max.vance+FINDMYFANS_UNIT_TEST_REMOVETEAM@gmail.com', password:'678utf', description:'my name is sam', teams:['Nashville Predators'], home:'Nashville, TN'});
      u2.register(function(){
        u2.removeTeam('Nashville Predators', function(){
          User.findById(u2._id.toString(), function(record){
            expect(record.teams).to.have.length(0);
            done();
          });
        });
      });
    });
  });
*/

  //end of document
});

