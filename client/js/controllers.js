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
app.controller('ChatCtrl',[ '$rootScope', '$scope', 'Users', 'Auth',
    function($rootScope, $scope, Users, Auth) {
		$scope.loading = true;
		$scope.userRoles = Auth.userRoles;
		$scope.message = '';
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
			$scope.friend = {username:user.username,fullname: (user.first_name?user.first_name + ' ' + user.last_name:user.username)};
			console.log('Clicked friend');
		};
		
		$scope.sendMessage = function() {
			socket.emit("private", { msg:  this.message , to: $scope.friend.username });
			$("div#messageContent").append("<br />\r\n" + Auth.user.username + ': ' + this.message);
             // then we empty the text on the input box.
			this.message = '';
			$('#messageWrapper').animate({ scrollTop: $('#messageWrapper').attr("scrollHeight") - $('#messageWrapper').height() }, 'fast','swing');
			
			/*$('#messageWrapper').animate({
		          scrollTop: $('#messageContent').offset().height
		        }, 'fast','swing');*/
			 
		};
		$scope.messageEvent = function(ev){
			if(ev.keyCode == 13 && !ev.ctrlKey){
				this.sendMessage();
				ev.returnValue=false;
				ev.cancelBubble=true;
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
       	 	//console.log(data);
        	$("div#messageContent").append("<br />\r\n" + data.from + ': ' + data.msg);
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
        	socket.emit('register', Auth.user.username);
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
