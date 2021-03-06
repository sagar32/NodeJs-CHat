var express= require('express'),
app=express(),
server=require('http').createServer(app),
io =require('socket.io').listen(server);
var usernames=[];
server.listen(process.env.PORT || 3000);

app.get("/",function(req,res){
	res.sendFile(__dirname+ '/index.html');
});

io.sockets.on('connection',function(socket){
	
	socket.on('new user',function(data,callback){
		
		if(usernames.indexOf(data) != -1){
			callback(false);
		}else{
			console.log(data);
			callback(true); 
			socket.username=data;
			usernames.push(socket.username);
			io.sockets.emit('userJoin',{msg:socket.username+" Is Joined Now....."});
			updateUsernames();
		}
	});
	
	//update username
	function updateUsernames(){
		io.sockets.emit('usernames',usernames);
	}
	
	//send message
	socket.on('send message',function(data){
		io.sockets.emit('new message',{msg:data, user:socket.username});
	});


	//disconnect user
	socket.on('disconnect',function(data){
		if(!socket.username) return;
		usernames.splice(usernames.indexOf(socket.username),1);
		io.sockets.emit('userLeave',{msg:socket.username+" Is Leave Chat....."});
		updateUsernames();
	});
});