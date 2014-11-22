var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use('/public', express.static(__dirname + '/client'));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/client/index.html');
});

io.on('connection', function(socket){
	console.log('a user connected');
});

http.listen(3000, function(){
	console.log('listening on *:3000');
});