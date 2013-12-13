var io = require('socket.io').listen(module.parent.exports.server);
var users = {};
// open the socket connection
io.sockets.on('connection', function (socket) {
   
	socket.on("private", function(data) {   
		if(users[data.to])
		users[data.to].emit("private", { from: socket.nickname, to: data.to, msg: data.msg });
		console.log(data.to + ' not connected');
        //socket.emit("private", { from: socket.nickname, to: data.to, msg: data.msg });
	});
	
   // listen for the chat even. and will recieve
   // data from the sender.
   socket.on('chat', function (data) {
   
      // default value of the name of the sender.
      var sender = 'unregistered';
      
      // get the name of the sender
      socket.get('nickname', function (err, name) {
         console.log('Chat message by ', name);
         console.log('error ', err);
         sender = name;
      });   

      // broadcast data recieved from the sender
      // to others who are connected, but not 
      // from the original sender.
      socket.broadcast.emit('chat', {
         msg : data, 
         msgr : sender
      });
   });
   
   // listen for user registrations
   // then set the socket nickname to 
   socket.on('register', function (name) {
      // make a nickname paramater for this socket
      // and then set its value to the name recieved
      // from the register even above. and then run
      // the function that follows inside it.
	   socket.nickname = name;
	   users[name] = socket;
	// this kind of emit will send to all! :D
       io.sockets.emit('broadcast', {
          msg : '', 
          msgr : "mr. server",
          tom	: "welcome",
          user	: name,
       });
      //socket.set('nickname', name, function () {});
   });
   socket.on('disconnect', function (data) {
	  if(!socket.nickname) return;
	  delete users[socket.nickname];
   });
});