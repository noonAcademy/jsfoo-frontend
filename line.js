import { fromEvent, merge, concat, interval, from, combineLatest } from "rxjs";
import {
  switchMap,
  takeUntil,
  map,
  filter,
  share,
  scan,
  first,
  last,
  timeInterval,
  mapTo,
  takeLast,
  startWith,
  take,
  skipUntil,
  repeat,
  buffer,
  tap,
  skip
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
      y: event.clientY - top,
      eventType: event.type
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

const dragStartStream = mouseDownStream.pipe(map(getMousePos(lineCanvas)));
const dragEndStream = mouseUpStream.pipe(map(getMousePos(lineCanvas)));

let globalStart = { x: 0, y: 0 };
let distance = 0;
let coordinates = [];

function drawDot({ x, y }) {
  context.beginPath();
  context.arc(x, y, 2, 0, 2 * Math.PI);
  context.fillStyle = "black";
  context.fill();
}

const dragStream = mouseDownStream.pipe(
  map(getMousePos(lineCanvas)),
  tap(startPos => {
    console.log({ startPos });
    coordinates.push(startPos);
    distanceDisplay.innerHTML = "0";
    globalStart = startPos;
    context.moveTo(startPos.x, startPos.y);
    // drawDot(startPos);
  }),
  switchMap(event => {
    return mouseMoveStream.pipe(
      map(getMousePos(lineCanvas)),
      takeUntil(
        mouseUpStream.pipe(
          map(getMousePos(lineCanvas)),
          tap(endPos => {
            console.log({ endPos });
            const { x, y } = endPos;
            distance = distance + getDistance(globalStart, endPos);
            coordinates.push(endPos);
            distanceDisplay.innerHTML = distance.toFixed(2);
            context.lineTo(x, y);
            context.stroke();
          })
        )
      )
    );
  }),
  share()
);

dragStream.subscribe();
