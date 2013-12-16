'use strict';

/* Controllers */
app.controller('NavCtrl', [ '$rootScope', '$scope', '$location', 'Auth',
		function($rootScope, $scope, $location, Auth) {
			$scope.user = Auth.user;
			$scope.userRoles = Auth.userRoles;
			$scope.accessLevels = Auth.accessLevels;

			$scope.logout = function() {
				Auth.logout(function() {
					$location.path('/login');
				}, function() {
					$rootScope.error = "Failed to logout";
				});
			};
		} ]);

app.controller('LoginCtrl', [ '$rootScope', '$scope', '$location', '$window',
		'Auth', function($rootScope, $scope, $location, $window, Auth) {

			$scope.rememberme = true;
			$scope.login = function() {
				Auth.login({
					username : $scope.username,
					password : $('#lgpassword').val(),//$scope.password
					rememberme : $scope.rememberme
				}, function(res) {
					$location.path('/');
				}, function(err) {
					$rootScope.error = "Failed to login";
				});
			};

			$scope.loginOauth = function(provider) {
				$window.location.href = '/auth/' + provider;
			};
		} ]);

app.controller('HomeCtrl', [ '$rootScope', function($rootScope) {

} ]);

app.controller('RegisterCtrl', [ '$rootScope', '$scope', '$location', 'Auth',
		function($rootScope, $scope, $location, Auth) {
			$scope.role = Auth.userRoles.user;
			$scope.userRoles = Auth.userRoles;

			$scope.register = function() {
				Auth.register({
					username : $scope.username,
					password : $scope.password,
					role : $scope.role
				}, function() {
					$location.path('/');
				}, function(err) {
					$rootScope.error = err;
				});
			};
		} ]);

app.controller('PrivateCtrl', [ '$rootScope', function($rootScope) {
	
} ]);
app.controller('ChatCtrl',[ '$rootScope', '$scope', 'Users', 'Auth','Messages',
    function($rootScope, $scope, Users, Auth,Messages) {
	console.log(Auth.user);
		$scope.loading = true;
		$scope.userRoles = Auth.userRoles;
		$scope.messages = [];
		$scope.message = '';
		$scope.addClass = function(uid){
			if(uid == Auth.user.uid)
				return 'mymessage';
			return 'yourmessage';
		};
		$scope.cuser = Auth.user;
		$scope.connecting = 'Please waiting...';
		Users.getAll(function(res) {
			$scope.users = res;
			$scope.loading = false;
		}, function(err) {
			$rootScope.error = "Failed to fetch users.";
			$scope.loading = false;
		});
		$scope.chatFriend = function(user) {
			$scope.selection = 'chatting';
			$scope.friend = {uid:user.uid, username:user.username,fullname: (user.first_name?user.first_name + ' ' + user.last_name:user.username)};
			console.log('Clicked friend');
			
			Messages.loadMessage({
				from: Auth.user.uid,
				to : user.uid,
			}, function(res) {
				/* angular.forEach(res, function(todo) {
					 if (!todo.done) $scope.todos.push(todo);
				});*/
				 
				$scope.messages = res;
				$scope.$apply();
			}, function(err) {
				alert(err);
			});
		};
		
		$scope.sendMessage = function() {
			socket.emit("private", {msg:  this.message , to: {uid:$scope.friend.uid,username: $scope.friend.username }});
			$("div#messageContent").append("<div><label class='my_content'>" + Auth.user.username + "</label><p class='msg-content'>" + this.message + '<p></div>');
             // then we empty the text on the input box.
			jQuery('#messageWrapper').animate({ scrollTop: jQuery('div#messageContent').height()}, 'fast','swing');
			
			/*$('#messageWrapper').animate({
		          scrollTop: $('#messageContent').offset().height
		        }, 'fast','swing');*/
			this.message = '';
		};
		$scope.messageEvent = function(event){
			if(event.keyCode == 13 && !event.ctrlKey){
				this.sendMessage();
				event.cancelBubble = true;
                //event.returnValue = false;
				//ev.cancelBubble=true;
				event.preventDefault();
				return false;
			}
			
		};
		$scope.typingMessage = function() {
			console.log('Typing...');
		};
		$scope.selection = 'welcome';
		
		//var url = 'http://192.168.0.115:8000/';
        var socket = io.connect('/');
        
        
        socket.on('chat', function (data) {
        	console.log(data);
        });
        
        socket.on("private", function(data) {
        	socket.emit("message_received", {mid: data.msg.mid});
       	 	//console.log(data);
        	$("div#messageContent").append("<div><label class='friend_content'>" + data.from + "</label><p class='msg-content'>" + data.msg.content + '<p></div>');
        }); 
        socket.on('broadcast', function (data) {
        	console.log(data);
        	if(data.tom){
				 switch(data.tom){
				 case 'welcome':
				 if(name == data.user){
					 $("p#log").html('Hi: ' + data.user);
				 }else{
					 $("p#log").html(data.user + ' joined');
						 }
						 break;
					 }
			}
        });
        socket.on('connect', function() {
        	$scope.connecting = 'Chose one friend on left frame to start';
        	$scope.$apply();
        	socket.emit('register', Auth.user);
         });
        
        socket.on('disconnect', function($scope) {
        	$scope.connecting = 'Please waiting...';
            socket.emit('DelPlayer', Auth.user.username);
        });
        socket.on('error', function (e) {
            console.log('System', e ? e : 'A unknown error occurred');
        });
} ]);
app.controller('AdminCtrl', [ '$rootScope', '$scope', 'Users', 'Auth',
		function($rootScope, $scope, Users, Auth) {
			$scope.loading = true;
			$scope.userRoles = Auth.userRoles;

			Users.getAll(function(res) {
				$scope.users = res;
				$scope.loading = false;
			}, function(err) {
				$rootScope.error = "Failed to fetch users.";
				$scope.loading = false;
			});

} ]);
