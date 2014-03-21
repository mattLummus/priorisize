'use strict';

var request = require('request');
var fs = require('fs');
var jade = require('jade');

exports.sendWelcome = function(data, fn){
  send({from:'noreply@fakesite.com', to:data.to, subject:'Welcome to Find My Fans', template:'welcome'}, fn);
};

function send(data, fn){
  if(data.to.match(/@nomail.com/g)){fn(); return;}

  var key = process.env.MAILGUN;
  if (key === undefined){
    throw new Error('The MAILGUN variable has not been defined in the shell. Please edit your bash profile or define MAILGUN at runtime as equal to your Mailgun API key.');
  }
  var url = 'https://api:' + key + '@api.mailgun.net/v2/dukar.co/messages';//note: this is Max's site, make sure to change this if you are using someone else's API key
  var post = request.post(url, function(err, response, body){
    fn(err, body);
  });

  var form = post.form();
  form.append('from', data.from);
  form.append('to', data.to);
  form.append('subject', data.subject);
  form.append('html', compileJade(data));
}

function compileJade(data){
  var template = __dirname + '/../views/email/' + data.template + '.jade';
  var original = fs.readFileSync(template, 'utf8');
  var partial = jade.compile(original);
  var output = partial(data);

  return output;
}
