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
		Users.getChatlist(function(res) {
			$scope.users = res;
			$scope.loading = false;
		}, function(err) {
			$rootScope.error = "Failed to fetch users.";
			$scope.loading = false;
		});
		$scope.scrollBottom = function(){
			$('#messageWrapper').animate({ scrollTop: jQuery('div#messageContent').height()}, 'fast','swing');
			/*$('#messageWrapper').animate({
	          scrollTop: $('#messageContent').offset().height
	        }, 'fast','swing');*/
		};
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
				var temp = $('#listUser #' + user.username).text();
				temp = temp.replace(/\(\d+\)/g,'');
				$('#listUser #' + user.username).text(temp);
				$scope.messages = res;
				$scope.$apply();
				$scope.scrollBottom();
			}, function(err) {
				alert(err);
			});
		};
		
		$scope.sendMessage = function() {
			socket.emit("private", {msg:  this.message , to: {uid:$scope.friend.uid,username: $scope.friend.username }});
			$scope.messages.push({"mid": 0,
			    "from_uid": Auth.user.uid,
			    "to_uid": $scope.friend.uid,
			    "message": this.message,
			    "created": 0,
			    "received": 0});
			//$("div#messageContent").append("<div data-ng-repeat='msg in messages'><label class='my_content'>" + Auth.user.username + "</label><p class='msg-content'>" + this.message + '<p></div>');
             // then we empty the text on the input box.
			this.scrollBottom();
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
        	if(data.from != $scope.friend.username){
        		var temp = $('#listUser #' + data.from).text();
        		if (temp.match(/\(\d+\)/g)) {
        			var total_msg = temp.replace(/^.*\((\d+)\)$/g, '$1'); 
        			temp = temp.replace(/\((\d+)\)$/g, '(' + (++total_msg) + ')'); 
        		}else{
        			temp = temp + ' (1)';
        		}
        		$('#listUser #' + data.from).text(temp);
        	}
        	else{
	        	$scope.messages.push({"mid": data.msg.mid,
				    "from_uid": data.from_id,
				    "to_uid": Auth.user.uid,
				    "message": data.msg.content,
				    "created": 0,
				    "received": 0});
	        	$scope.$apply();
	        	this.scrollBottom();
        	}
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
app.controller('UserCtrl', [ '$rootScope', '$scope', 'Users', 'Auth',
        function($rootScope, $scope, Users, Auth) {
			$scope.userRoles = Auth.userRoles;
			
			
			
			
			Users.getUserById(Auth.user.uid,function(res) {
				$scope.user = res;
				switch(res.role.title){
					case 'admin':
						$scope.role = Auth.userRoles.admin;
						break;
					default:
						$scope.role = Auth.userRoles.user;		
				}
			}, function(err) {
				$rootScope.error = "Failed to fetch users.";
			});
			$scope.setDefault = function(role, str){
				if(role.title == str)
					return 'checked';
				return '';
			};
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
