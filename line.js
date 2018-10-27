import { fromEvent, merge, concat, interval, from } from "rxjs";
import {
  switchMap,
  takeUntil,
  map,
  share,
  scan,
  first,
  last,
  timeInterval,
  mapTo,
  takeLast,
  take
} from "rxjs/operators";

const lineCanvas = document.getElementById("lineDraw");
const distanceDisplay = document.getElementById("distance");

const mouseMoveStream = fromEvent(lineCanvas, "mousemove");
const mouseUpStream = fromEvent(lineCanvas, "mouseup");
const mouseDownStream = fromEvent(lineCanvas, "mousedown");

const context = lineCanvas.getContext("2d");

function getMousePos(canvas) {
  const { left, top } = canvas.getBoundingClientRect();
  return function(event) {
    return {
      x: event.clientX - left,
      y: event.clientY - top
    };
  };
}

function getDistance(start, end) {
  const { x: startX, y: startY } = start;
  const { x: endX, y: endY } = end;
  const offsetX = endX - startX;
  const offsetY = endY - startY;
  return Math.sqrt(Math.pow(offsetX, 2) + Math.pow(offsetY, 2));
}

let globalStart = { x: 0, y: 0 };
let distance = 0;

mouseDownStream
  .pipe(map(getMousePos(lineCanvas)), share())
  .subscribe(startPos => {
    const { width, height } = lineCanvas.getBoundingClientRect();
    const { x, y } = startPos;
    distance = 0;
    globalStart = startPos;
    distanceDisplay.innerHTML = "0";
    context.beginPath();
    context.arc(x, y, 2, 0, 2 * Math.PI);
    context.fillStyle = "black";
    context.fill();
    context.moveTo(startPos.x, startPos.y);
  });

const dragStream = mouseDownStream.pipe(
  switchMap(event =>
    mouseMoveStream.pipe(map(getMousePos(lineCanvas)), takeUntil(mouseUpStream))
  )
);

const firstAndLastStream = merge(
  dragStream.pipe(first()),
  dragStream.pipe(takeLast(1))
);

dragStream.pipe(first()).subscribe(val => console.log(val, "first"));
dragStream.pipe(last()).subscribe(val => console.log(val, "last"));

firstAndLastStream.subscribe(val => {
  console.log(val, "first and last");
});

mouseUpStream.pipe(map(getMousePos(lineCanvas)), share()).subscribe(endPos => {
  const { x, y } = endPos;
  distance = distance + getDistance(globalStart, endPos);
  distanceDisplay.innerHTML = distance.toFixed(2);
  context.arc(x, y, 2, 0, 2 * Math.PI);
  context.fillStyle = "black";
  context.fill();
  context.fillRect(x, y, 1, 1);
  context.lineTo(x, y);
  context.stroke();
});
