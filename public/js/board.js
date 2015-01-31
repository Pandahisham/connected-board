var socket = io.connect();
var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
var uniqueId = randLetter + Date.now();
var path;

function emitStartPath(point){
  socket.emit('startDrawing', {uid: uniqueId, point: point});
}

function emitPoint(point){
  socket.emit('drawing', {uid: uniqueId, point: point});
}

function emitEndPath(){
  socket.emit('stopDrawing', {uid: uniqueId});
}

socket.on('startDrawing', function(data){
  if(uniqueId != data.uid){
    console.log("Remote drawing started");
    createPath(new Point(data.point[1], data.point[2]));
  }
});

socket.on('drawing', function(data){
  if(uniqueId != data.uid){
    console.log(data.point);
    addPoint(new Point(data.point[1], data.point[2]));
  }
});

socket.on('stopDrawing', function(data){
  if(uniqueId != data.uid){
    console.log("Remote drawing stopped");
    endPath(data.point);
  }
});

function createPath(point) {
  path = new Path({
    segments: [point],
    strokeColor: 'black',
  });
}

function addPoint(point) {
  path.add(point);
}

function endPath(event) {
  var segmentCount = path.segments.length;
  path.simplify(10);
}

function onMouseDown(event) {
  console.log("Local drawing started");
  createPath(event.point);
  emitStartPath(event.point);
}

function onMouseDrag(event) {
  addPoint(event.point);
  emitPoint(event.point);
}

function onMouseUp(event) {
  console.log("Local drawing stopped");
  endPath(event);
  emitEndPath();
}
