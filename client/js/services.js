'use strict';

app.factory('Auth', function($http, $cookieStore){
    var accessLevels = routingConfig.accessLevels
        , userRoles = routingConfig.userRoles
        , currentUser = $cookieStore.get('user') || {uid: 0,  username: '', fullname: 'Anonymous',role: userRoles.public };
        
    $cookieStore.remove('user');

    function changeUser(user) {
        _.extend(currentUser, user);
    };

    return {
        authorize: function(accessLevel, role) {
            if(role === undefined)
                role = currentUser.role;

            return accessLevel.bitMask & role.bitMask;
        },
        isLoggedIn: function(user) {
            if(user === undefined)
                user = currentUser;
            return user.role.title == userRoles.user.title || user.role.title == userRoles.admin.title;
        },
        register: function(user, success, error) {
            $http.post('/register', user).success(function(res) {
                changeUser(res);
                success();
            }).error(error);
        },
        login: function(user, success, error) {
            $http.post('/login', user).success(function(user){
                changeUser(user);
                success(user);
            }).error(error);
        },
        logout: function(success, error) {
            $http.post('/logout').success(function(){
                changeUser({
                    uid: '',
                	username: '',
                    role: userRoles.public
                });
                success();
            }).error(error);
        },
        accessLevels: accessLevels,
        userRoles: userRoles,
        user: currentUser
    };
});

app.factory('Users', function($http) {
    return {
        getAll: function(success, error) {
            $http.get('/users').success(success).error(error);
        },
        getUserById: function(uid, success, error) {
            $http.get('/user/'+uid).success(success).error(error);
        },
        getChatlist: function(success, error) {
        	$http.get('/chatlist').success(success).error(error);
        }
    };
});

app.factory('Messages',function($http) {
    return {
    	loadMessage: function(data, success, error) {
            $http.post('/messages',data).success(success).error(error);
        }
    };
});