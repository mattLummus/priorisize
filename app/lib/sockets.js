'use strict';

exports.connection = function(socket){
  socket.emit('online', {date: new Date()});
};
