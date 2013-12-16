var _ =           require('underscore')
    , Message =      require('../models/Message.js');

module.exports = {
    index: function(req, res, next) {
        Message.getMessages(req,function(messages){
        	/*_.each(messages, function(message) {
        	
            });*/
            res.json(messages);
        });
    }
};