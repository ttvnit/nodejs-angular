var User
	, db = 				require('../../server/models/db')
    , _ =               require('underscore')
    , passport =        require('passport')
    , LocalStrategy =   require('passport-local').Strategy
    , check =           require('validator').check
    , userRoles =       require('../../client/js/routingConfig').userRoles
	, crypto = 			require('crypto');

//db.update('users',{role:userRoles.user},['uid = ?',[2]]);    
module.exports = {
	getListUser: function(){
		db.client.query("select * from users where uid <>?",[0],
				function selectCb(err, results, fields) {
					if (err) throw err;
					/*callback();*/
					//callback(results,fields);
					users = results;
				});
		
		/*return [
	    {
	        id:         1,
	        username:   "user",
	        password:   "123",
	        role:   userRoles.user
	    },
	    {
	        id:         2,
	        username:   "admin",
	        password:   "123",
	        role:   userRoles.admin
	    }
	];*/
	},
    addUser: function(username, password, role, callback) {
        if(this.findByUsername(username) !== undefined)  return callback("UserAlreadyExists");

        // Clean up when 500 users reached
        if(users.length > 500) {
            users = users.slice(0, 2);
        }

        var user = {
            uid:         _.max(users, function(user) { return user.uid; }).uid + 1,
            username:   username,
            pass:   password,
            role:       role
        };
        users.push(user);
        
        data = {
        		uid : null,
        		name : username,
        		pass : crypto.createHash('md5').update(password).digest('hex'),
        		created: new Date().getTime(),
        		status: 1,
        		role:  role
        		};
        db.insert('users',data);
        callback(null, user);
    },

    findOrCreateOauthUser: function(provider, providerId) {
        var user = module.exports.findByProviderId(provider, providerId);
        if(!user) {
            user = {
                uid: _.max(users, function(user) { return user.uid; }).uid + 1,
                username: provider + '_user', // Should keep Oauth users anonymous on demo site
                role: userRoles.user,
                provider: provider
            };
            user[provider] = providerId;
            users.push(user);
        }

        return user;
    },

    findAll: function() {
        return _.map(users, function(user) {
        	return _.clone(user); 
        });
    },

    findById: function(id) {
        return _.clone(_.find(users, function(user) { return user.uid === id; }));
    },

    findByUsername: function(username) {
        return _.clone(_.find(users, function(user) { return user.username === username; }));
    },

    findByProviderId: function(provider, id) {
        return _.find(users, function(user) { return user[provider] === id; });
    },

    validate: function(user) {
        check(user.username, 'Username must be 1-20 characters long').len(1, 20);
        check(user.password, 'Password must be 5-60 characters long').len(5, 60);
        check(user.username, 'Invalid username').not(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/);

        // TODO: Seems node-validator's isIn function doesn't handle Number arrays very well...
        // Till this is rectified Number arrays must be converted to string arrays
        // https://github.com/chriso/node-validator/issues/185
        var stringArr = _.map(_.values(userRoles), function(val) { return val.toString(); });
        check(user.role, 'Invalid user role given').isIn(stringArr);
    },

    localStrategy: new LocalStrategy(
        function(username, password, done) {

            var user = module.exports.findByUsername(username);
            user.role = JSON.parse(user.role);
            
            if(!user) {
                done(null, false, { message: 'Incorrect username.' });
            }
            else if(user.pass != crypto.createHash('md5').update(password).digest('hex')) {
                done(null, false, { message: 'Incorrect username.' });
            }
            else {
                return done(null, user);
            }

        }
    ),
    serializeUser: function(user, done) {
        done(null, user.uid);
    },

    deserializeUser: function(id, done) {
        var user = module.exports.findById(id);

        if(user)    { 
        	user.role = JSON.parse(user.role);
        	done(null, user); 
        }
        else        { done(null, false); }
    }
};
module.exports.getListUser();
//var users = module.exports.getListUser();
//console.log(users);