

function onMouseDown(event) {
  createPath(event);
  emitStartPath(event.point);
}

function onMouseDrag(event) {
  addPoint(event);
  emitPoint(event.point);
}

function onMouseUp(event) {
  endPath(event);
  emitEndPath();
}
