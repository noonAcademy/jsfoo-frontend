import {
  empty,
  fromEvent,
  merge,
  concat,
  interval,
  from,
  combineLatest,
  zip
} from "rxjs";
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
const replayButton = document.getElementById("replay");

const mouseMoveStream = fromEvent(lineCanvas, "mousemove");
const mouseUpStream = fromEvent(lineCanvas, "mouseup");
const mouseDownStream = fromEvent(lineCanvas, "mousedown");
const replayClickStream = fromEvent(replayButton, "click");

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

function clearCanvas(canvas, context) {
  const { width, height } = canvas.getBoundingClientRect();
  context.clearRect(0, 0, width, height);
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
let startTime;
let endTime;
let firstInterval;

function drawDot({ x, y }) {
  context.beginPath();
  context.arc(x, y, 2, 0, 2 * Math.PI);
  context.fillStyle = "black";
  context.fill();
}

const dragStream = mouseDownStream.pipe(
  map(getMousePos(lineCanvas)),
  tap(startPos => {
    const { width, height } = lineCanvas.getBoundingClientRect();
    // context.clearRect(0, 0, width, height);
    context.moveTo(startPos.x, startPos.y);
  }),
  switchMap(event => {
    return mouseMoveStream.pipe(
      map(getMousePos(lineCanvas)),
      takeUntil(mouseUpStream)
    );
  }),
  share()
);

dragStream
  .pipe(
    scan((acc, curr) => {
      return acc + 1;
    }, 0)
  )
  .subscribe(distance => {
    distanceDisplay.innerHTML = distance;
  });

dragStream.pipe(take(1), timeInterval()).subscribe(time => {
  firstInterval = time.interval;
});

dragStream.subscribe(endCoord => {
  context.lineTo(endCoord.x, endCoord.y);
  context.stroke();
});

dragStream.pipe(buffer(replayClickStream)).subscribe(coords => {
  coordinates = coords;
});

const replayStream = replayClickStream.pipe(
  switchMap(e => {
    if (!firstInterval || coordinates.length === 0) return empty();
    return zip(from(coordinates), interval(firstInterval), point => point);
  })
);

replayStream.pipe(first()).subscribe(start => {
  clearCanvas(lineCanvas, context);
  context.moveTo(start.x, start.y);
  context.beginPath();
});

replayStream.pipe(skip(1)).subscribe(replayCoord => {
  const { x, y } = replayCoord;
  context.lineTo(x, y);
  context.stroke();
});
