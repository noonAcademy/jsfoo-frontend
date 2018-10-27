
let lines = [];
let lineObject;
function setup(){
	createCanvas(700, 500);
	background(0);
	stroke(255);
	document.getElementById('replay').setAttribute('disabled', 'disabled');
	lineObject = new Line();
}

function draw(){
	if (mouseIsPressed === true) {
		lineObject.drawLine(mouseX, mouseY, pmouseX, pmouseY);
	}
	const totalLines = lines.length;
	const totalLength = (totalLines > 0) ? lines.map(l => l.length).reduce((ac, l) => ac + l, 0) : 0;
	document.getElementById('totalLineDrawn').innerHTML = `Total lines: ${totalLines}<br>Total length: ${totalLength} meter`;
	if(totalLines > 0){
		document.getElementById('replay').removeAttribute('disabled');
	}
}

function mouseReleased() {
	if(lineObject.isInCanvas(mouseX, mouseY, pmouseX, pmouseY)){
		lineObject.stopDrawing(mouseX, mouseY, pmouseX, pmouseY);
		lines.push(lineObject.drawPoints);
		lineObject = new Line();
	}
}

function Line(){
	this.startX = 0;
	this.startY = 0;
	this.endX = 0;
	this.endY = 0;
	this.event = 'down';
	this.drawPoints = [];
	this.timestamp;

	this.render = function(){
		line(this.startX, this.startY, this.endX, this.endY);
	}

	this.isInCanvas = function(x, y){
		const xInCanvas = x >= 0 && x <= width;
		const yInCanvas = y >= 0 && y <= height;
		return xInCanvas && yInCanvas;
	}

	this.isMouseMoved = function(x, y){
		return (this.startX !== x || this.startY !== y);
	}

	this.drawLine = function(startX, startY, endX, endY) {
		if(this.isInCanvas(startX, startY) && this.isMouseMoved(startX, startY)){
			const now = new Date().getTime();
			if(!this.timestamp){
				this.timestamp = now;
			}
			this.drawPoints.push({
				startX:startX,
				startY:startY,
				endX:endX,
				endY:endY,
				event: this.event,
				delay: (now - this.timestamp) / 100
			});
			this.event = 'drag';
			this.startX = startX;
			this.startY = startY;
			this.endX = endX;
			this.endY = endY;
			this.render();
		}
	}

	this.stopDrawing = function(startX, startY, endX, endY){
		this.event = 'up';
		if(this.drawPoints.length > 0 && !this.isInCanvas(startX, startY)){
			const lastDrawPoint = this.drawPoints[this.drawPoints.length - 1];
			this.drawLine(lastDrawPoint.startX, lastDrawPoint.startY, lastDrawPoint.startX, lastDrawPoint.startY);
			return;
		}
		this.drawLine(startX, startY, endX, endY);
	}

}

document.getElementById('clear').addEventListener('click', function(){
	lines = [];
	clear();
	setup();
});

document.getElementById('replay').addEventListener('click', function(){
	clear();
	setup();
// 	setTimeout(function(){
// 		lines.forEach(line => {
// 			line.forEach(coordinate => {
// 				lineObject.drawLine(coordinate.startX, coordinate.startY, coordinate.endX, coordinate.endY);
// 			});
// 		});
// }, 2000);
	replayLines(0);
});

function replayLines(i){
	if(i < lines.length){
		const line = lines[i];
		replayLine(line, i, 0);
	}
}

function replayLine(line, i, j){
	if(j < line.length){
		const coordinate = line[j];
		lineObject.drawLine(coordinate.startX, coordinate.startY, coordinate.endX, coordinate.endY);
		j = j + 1;
		setTimeout(() => {
			replayLine(line, i, j);
		}, coordinate.delay);
	}else{
		i = i + 1;
		replayLines(i);
	}
}
