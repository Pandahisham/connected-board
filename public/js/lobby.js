function handleMessage(message){
  console.log('message: '+message);

}

$(function() {
  var RenderEngine = new FadeEngine(10);

  var submitBtn = $('#submitBtn'),
    idLobby = submitBtn.attr("lobbyId");

  var socket = io.connect('http://localhost:3001', {query: 'lobbyId='+idLobby});

  socket.on('connect',function(){;
    RenderEngine.handleConnect();
  });

  socket.on('disconnect',function(){
    RenderEngine.handleDisconnect();
  });

  socket.on('message', function(data){
    RenderEngine.handleMessage(data.message);
  });

  submitBtn.click(function(){
    socket.emit('post', {message: $("#messageIn").val()});
    RenderEngine.handleMessage($("#messageIn").val());
  });
});
