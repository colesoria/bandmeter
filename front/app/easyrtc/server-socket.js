// Load required modules
var http = require("http"); // http server core module
var express = require("express"); // web framework external module
var io = require("socket.io"); // web socket external module
var easyrtc = require("easyrtc"); // EasyRTC external module
// Setup and configure Express http server. Expect a subfolder called "static" to be the web root.
var httpApp = express();
httpApp.use(express.static(__dirname + "/static/"));
// Start Express http server on port 8080
var webServer = http.createServer(httpApp).listen(3030);
// Start Socket.io so it attaches itself to Express server
var socketServer = io.listen(webServer, {"log level":1});

var BandUsers = [];
var Bands = [];
var mapa = [];
var loggedUsers = [];

socketServer.sockets.on('connection', function (socket) {
  console.log('se ha conectado un usuario');

  socket.on('newJamroom', function(data){
    socket.emit('newJamroom', data);
  });

  socket.on('newUserJamroom', function(data){
    socket.username = data.username;
    socket.room = data.room;
	if(!socket.in(data.room)){
		socket.join(data.room);
	}
    var resp = {user:'SERVER',message:"you have connected to "+data.room};
    socket.emit('updatechat', resp);
	console.log("Envio mensaje");
    socket.broadcast.to(data.room).emit('updatechat', 'SERVER', data.username + ' has connected to this room');
  });
  
  socket.on('leaveChat', function(data){
	socket.leave(socket.room);
	socket.broadcast.to(data.room).emit('updatechat', 'SERVER', data.username + ' has left this room');
  });
  
  socket.on('newUserMap', function(data){
    if(socket.mapUser){
      socketServer.sockets.emit('map',mapa);
      socket.broadcast.emit('map', mapa);
      return;
    }
    if(data !== null){
      if(data.nickname == "Guest"){
        guest++;
        data.nickname = "Guest_"+guest;
        data.id = "Guest_"+guest;
      }
      socket.mapUser = data;
      BandUsers.push(socket);
      mapa.push(data);
      socketServer.sockets.emit('map',mapa);
      socket.broadcast.emit('map', mapa);
    }else{
      console.log('se ha conectado con datos vacíos');
    }
  });
  
  socket.on('chatMessage', function(data){
	var resp = {user:'YOU',message:data.message};
    socket.emit('updatechat', resp);
	console.log("Envio mensaje");
    socket.broadcast.to(data.room).emit('updatechat', data);
  });
  
  socket.on('message', function(data){
    socket.broadcast.emit(data);
  });

  socket.on('logged', function(data){
    if(socket.loggedUser){
      socket.broadcast.emit('loggedUser', loggedUsers);
      return;
    }
    if(data !== null){
      socket.loggedUser = data;
      loggedUsers.push(data);
      socket.broadcast.emit('loggedUser', loggedUsers);
    }else{
      console.log('se ha conectado con datos vacíos');
    }
  });

  socket.on('disconnect', function () {
    socket.leave(socket.room);
    if (mapa.indexOf(socket.mapUser) > -1) {
      mapa.splice(mapa.indexOf(socket.mapUser), 1);
    }
    if (loggedUsers.indexOf(socket.loggedUser) > -1) {
      loggedUsers.splice(loggedUsers.indexOf(socket.loggedUser), 1);
    }
    socket.broadcast.emit('map', mapa);
    socket.broadcast.emit('loggedUser', loggedUsers);
  });
});