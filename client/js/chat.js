         var name = '';
         var url = 'http://192.168.0.115:8000';
         var socket = io.connect(url);
         function init_list_user(){
        	 $("#list-user li a").each(function(e, i) {
     			$(this).click(function(event) {
     				$("div#curent-chating").html('You are chating with ' + $(this).html() + ' (' + $(this).attr('id') + ')');
     				$("input#to_user").val($(this).attr('id'));
    			});
    		});	
        	 //alert($(aObject).attr('id'));
         }
         function update_list_user(){
        	 $.ajax({
        		 dataType: "json",
        		 url: url+'/users',
        		 //data: data,
        		 //success: success,
        		 cache: false
        		 })
        		 .done(function( data) {
        			 //console.log(data);
        			$.each( data, function( key, val ) {
        				 $("<li><a id='" + val.name + "' href='javascript:;' >" + val.first_name + ' ' + val.last_name + "</a></li>").appendTo( "#list-user" );
        			});
        			init_list_user();
        			 //$( "#results" ).append( html );
        		 });
         }
         function send_message(message){
        	// just some simple logging
             $("p#log").html('sent message: ' + message);
          // send message on inputbox to server
             //socket.emit('chat', $("input#msg").val() );
             
             socket.emit("private", { msg:  $("input#msg").val(), to: $("input#to_user").val() });
             
             // the server will recieve the message, 
             // then maybe do some processing, then it will 
             // broadcast it again. however, it will not 
             // send it to the original sender. the sender
             // will be the browser that sends the msg. 
             // other browsers listening to the server will
             // recieve the emitted message. therefore we will
             // need to manually print this msg for the sender.
             $("p#data_recieved").append("<br />\r\n" + name + ': ' + $("input#msg").val());
             
             // then we empty the text on the input box.
             $("input#msg").val('');
         }
         // at document read (runs only ones).
         $(document).ready(function(){
        	 name = $('#from_user').val();
            // on click of the button (jquery thing)
            // the things inside this clause happen only when 
            // the button is clicked.
            $("#send-message").click(function(){
               send_message($("input#msg").val());
            });
            $("input#msg").keypress(function(e){
                        code= (e.keyCode ? e.keyCode : e.which);
                        if (code == 13){
                        	send_message($("input#msg").val());         	
                        }
            });
            
            
            // ask for the name of the user, ask again if no name.
            while (name == '') {
               name = prompt("What's your name?","");
            }
            
            // send the name to the server, and the server's 
            // register wait will recieve this.
            socket.emit('register', name );
            update_list_user();
         });
         
         // listen for chat event and recieve data
         socket.on('chat', function (data) {
         
            // print data (jquery thing)
            $("p#data_recieved").append("<br />\r\n" + data.msgr + ': ' + data.msg);
            
            // we log this event for fun :D
            $("p#log").html('got message: ' + data.msg);
            
         });
         socket.on("private", function(data) {        	 
        	 console.log(data);
        	 // print data (jquery thing)
             $("p#data_recieved").append("<br />\r\n" + data.from + ': ' + data.msg);
             
             // we log this event for fun :D
             $("p#log").html('got message: ' + data.msg);
        	  //chatLog.append('<li class="private"><em><strong>'+ data.from +' -> '+ data.to +'</strong>: '+ data.msg +'</em></li>');
         }); 
         socket.on('broadcast', function (data) {
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
        	 
        	 //console.log(data);
          });
         socket.on('disconnected', function() {
        	 alert(123);
             socket.emit('DelPlayer', person_name);
         });