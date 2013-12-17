module.exports = function(app) {
	var io = require('socket.io').listen(app);
    var Messages =      require(root.settings.ROOT_DIR + '/server/models/Message.js');
	var users = {};
	// open the socket connection
	io.sockets.on('connection', function (socket) {
	   
		socket.on("message_received", function(data) {
			Messages.updateMessage(data);
		});
		
		socket.on("private", function(data) {
			data.from_uid =  socket.user.uid;
			data.to_uid =  data.to.uid;
			Messages.addMessage(data,function(result){
				console.log(result);
				if(users[data.to.uid]){
					users[data.to.uid].emit("private", {from_id: socket.user.uid, from: socket.user.username, to: data.to.username, msg: {mid: result.insertId, content:data.msg} });
				}
			});
	        //socket.emit("private", { from: socket.nickname, to: data.to, msg: data.msg });
		});
		
	   // listen for the chat even. and will recieve
	   // data from the sender.
	   socket.on('chat', function (data) {
	   
	      // default value of the name of the sender.
	      var sender = 'unregistered';
	      
	      // get the name of the sender
	     /* socket.get('nickname', function (err, name) {
	         console.log('Chat message by ', name);
	         console.log('error ', err);
	         sender = name;
	      }); */  

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
	   socket.on('register', function (user) {
	      // make a nickname paramater for this socket
	      // and then set its value to the name recieved
	      // from the register even above. and then run
	      // the function that follows inside it.
		   socket.user = user;
		   users[user.uid] = socket;
		// this kind of emit will send to all! :D
	       io.sockets.emit('broadcast', {
	          msg : '', 
	          msgr : "mr. server",
	          tom	: "welcome",
	          user	: user.username,
	       });
	      //socket.set('nickname', name, function () {});
	   });
	   socket.on('disconnect', function (data) {
		  if(!socket.user.uid) return;
		  delete users[socket.user.uid];
	   });
	});
};
