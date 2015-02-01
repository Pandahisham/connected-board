var socket = io.connect();
var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
var uniqueId = randLetter + Date.now();
var colors = colors = [ "aliceblue", "antiquewhite", "aqua",
  "aquamarine", "azure", "beige", "bisque", "black", "blanchedalmond",
  "blue", "blueviolet", "brown", "burlywood", "cadetblue", "chartreuse",
  "chocolate", "coral", "cornflowerblue", "cornsilk", "crimson",
  "cyan", "darkblue", "darkcyan", "darkgoldenrod", "darkgray",
  "darkgreen", "darkkhaki", "darkmagenta", "darkolivegreen", "darkorange",
  "darkorchid", "darkred", "darksalmon", "darkseagreen", "darkslateblue",
  "darkslategray", "darkturquoise", "darkviolet", "deeppink", "deepskyblue",
  "dimgray", "dodgerblue", "firebrick", "forestgreen", "ivory",
  "fuchsia", "gainsboro", "gold", "goldenrod", "gray", "green",
  "greenyellow", "honeydew", "hotpink", "indianred", "indigo",
  "khaki", "lavender", "lavenderblush", "lawngreen", "lemonchiffon",
  "lightblue", "lightcoral", "lightcyan", "lightgoldenrodyellow", "lightgreen",
  "lightpink", "lightsalmon", "lightseagreen", "lightskyblue", "lightslategray",
  "lightsteelblue", "lightyellow", "lime", "limegreen", "linen", "magenta",
  "maroon", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple",
  "mediumseagreen", "mediumslateblue", "mediumspringgreen", "mediumturquoise",
  "mediumvioletred", "midnightblue", "mintcream", "mistyrose", "moccasin",
  "navy", "oldlace", "olive", "olivedrab", "orange", "orangered", "orchid",
  "palegoldenrod", "palegreen", "paleturquoise", "yellow", "yellowgreen",
  "palevioletred", "papayawhip", "peachpuff", "peru", "pink", "plum",
  "powderblue", "purple", "red", "rosybrown", "royalblue", "saddlebrown",
  "salmon", "sandybrown", "seagreen", "seashell", "sienna", "silver",
  "skyblue", "slateblue", "slategray", "snow", "springgreen", "steelblue",
  "tan", "teal", "thistle", "tomato", "turquoise", "violet", "wheat",];
var alivePath = {};
var donePath = [];
var sessionColor = colors[Math.floor(Math.random()*colors.length)];

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
    createPath(data.uid, new Point(data.point[1], data.point[2]), data.color);
    paper.view.update();
  }
});

socket.on('drawing', function(data){
  if(uniqueId != data.uid){
    console.log(data.point);
    addPoint(data.uid, new Point(data.point[1], data.point[2]));
    paper.view.update();
  }
});

socket.on('stopDrawing', function(data){
  if(uniqueId != data.uid){
    console.log("Remote drawing stopped");
    endPath(data.uid, data.point);
    paper.view.update();
  }
});

function createPath(uid, point, color) {
  alivePath[uid] = new Path({
    segments: [point],
    strokeColor: sessionColor,
  });
}

function addPoint(uid, point) {
  alivePath[uid].add(point);
}

function endPath(uid, event) {
  var segmentCount = alivePath[uid].segments.length;
  alivePath[uid].simplify(10);
  donePath.push(alivePath[uid]);
  delete alivePath[uid];
  paper.view.update();
}

function onMouseDown(event) {
  console.log("Local drawing started");
  createPath(uniqueId, event.point, sessionColor);
  emitStartPath(event.point);
}

function onMouseDrag(event) {
  addPoint(uniqueId, event.point);
  emitPoint(event.point);
}

function onMouseUp(event) {
  console.log("Local drawing stopped");
  endPath(uniqueId, event);
  emitEndPath();
}
