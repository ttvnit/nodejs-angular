var db  = 				require('../../server/models/db');
module.exports = {
		addMessage: function(data, callback) {
	        //socket.nickname, to: data.to, msg: data.msg
	        fields = {
	        		mid : null,
	        		from_uid : data.from_uid,
	        		to_uid : data.to_uid,
	        		message : data.msg,
	        		created: new Date().getTime(),
	        		received: 0
	        		};
	        db.insert('user_messages',fields,callback);
	    },
	    updateMessage: function(data){
	    	console.log(data);
	    	fields = {received: 1};
	    	db.update('user_messages',fields,['mid=?',[data.mid]]);
	    },
	    getMessages: function(req, callback){
	    	db.query('select * from user_messages where from_uid in (?,?) and to_uid in (?,?)',[req.body.from,req.body.to,req.body.from,req.body.to],function(result){
	    		console.log(result);
	    		callback(result);	
	    	});
	    	//return [{mid: 1,msg: 'tuan',created: 234},{mid: 1,msg: 'thanh',created: 123}];
	    }
};