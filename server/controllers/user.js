var _ =           require('underscore')
    , User =      require('../models/User.js')
    , userRoles = require('../../client/js/routingConfig').userRoles;

module.exports = {
    index: function(req, res) {
    	var users = User.findAll();
        _.each(users, function(user, index) {
        	if(typeof user.role == 'string'){
        		user.role = JSON.parse(user.role);
        	}
            delete user.pass;
        });
        res.json(users);
    },
    chatlist: function(req, res) {
   		var users = User.findAllExcept(req.user.uid);
        _.each(users, function(user, index) {
        	if(typeof user.role == 'string'){
        		user.role = JSON.parse(user.role);
        	}
            delete user.pass;
        });
        res.json(users);
    },
    profile: function(req, res) {
    	var user = User.findById(parseInt(req.params['uid']));
    	if(typeof user.role == 'string'){
    		user.role = JSON.parse(user.role);
    	}
    	res.json(user);
    }
};