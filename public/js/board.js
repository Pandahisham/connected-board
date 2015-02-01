var socket = io.connect();
var alivePath = {};
var donePath = {};
var uniqueId = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + Date.now();

function createPath(uid, point, color, size) {
  alivePath[uid] = new Path({
    segments: [point],
    strokeColor: color,
    strokeWidth: size,
    strokeCap: 'round'
  });
}

function addPoint(uid, point) {
  alivePath[uid].add(point);
}

function endPath(uid, event) {
  var segmentCount = alivePath[uid].segments.length;
  alivePath[uid].simplify(5);
  if( typeof donePath[uid] == 'undefined' ){
    donePath[uid] = [];
  }

  donePath[uid].push(alivePath[uid]);
  delete alivePath[uid];
  paper.view.update();
}

function undo(uid){
  if(donePath[uid].length > 0){
    donePath[uid][donePath[uid].length-1].remove();
    donePath[uid].splice(donePath[uid].length-1, 1);
    paper.view.update();
  }
}

function onMouseDown(event) {
  createPath(uniqueId, event.point, $('#color').val(), $('#size').val());
  emitStartPath(event.point);
}

function onMouseDrag(event) {
  addPoint(uniqueId, event.point);
  emitPoint(event.point);
}

function onMouseUp(event) {
  endPath(uniqueId, event);
  emitEndPath();
}

function onKeyDown(event) {
  if(paper.Key.isDown('command') || paper.Key.isDown('control')){
    if(paper.Key.isDown('z')){
      emitUndo(uniqueId);
      undo(uniqueId);
    }
  }
}

function emitStartPath(point){
  socket.emit('startDrawing', {uid: uniqueId, point: point, color: $('#color').val(), size: $('#size').val()});
}

function emitPoint(point){
  socket.emit('drawing', {uid: uniqueId, point: point});
}

function emitEndPath(){
  socket.emit('stopDrawing', {uid: uniqueId});
}

function emitUndo(uid){
  socket.emit('undo', {uid: uid});
}

socket.on('startDrawing', function(data){
  if(uniqueId != data.uid){
    createPath(data.uid, new Point(data.point[1], data.point[2]), data.color, data.size);
    paper.view.update();
  }
});

socket.on('drawing', function(data){
  if(uniqueId != data.uid){
    addPoint(data.uid, new Point(data.point[1], data.point[2]));
    paper.view.update();
  }
});

socket.on('stopDrawing', function(data){
  if(uniqueId != data.uid){
    endPath(data.uid, data.point);
    paper.view.update();
  }
});

socket.on('undo', function(data){
  if(uniqueId != data.uid){
    undo(data.uid);
    paper.view.update();
  }
});
