var _ =           require('underscore')
    , User =      require('../models/User.js')
    , userRoles = require('../../client/js/routingConfig').userRoles;

module.exports = {
    index: function(req, res) {
        var users = User.findAll();
        _.each(users, function(user) {
        	if(user.role){
        		user.role = JSON.parse(user.role);
        	}
            delete user.pass;
            delete user.twitter;
            delete user.facebook;
            delete user.google;
            delete user.linkedin;
        });
        res.json(users);
    }
};