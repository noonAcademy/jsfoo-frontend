class ReplayEvents {
  constructor (myCanvas, distanceEle) {
    this.canvas = null;
    this.width = this.height = 0;
    this.actions = new Array();
    this.ctx = null;
    this.distance = 0;
    this.mouseDown = false;
    this.currentEvent = null; //instance of Event
    this.events = new Array(); //array of captured events
    this.lastMouseX = this.lastMouseY = -1;
    this.bgColor = backgroundColor;
    this.distanceEle = distanceEle;
    this.strokeColor = strokeColor;

    this.canvas = myCanvas;
    if (this.canvas.length === 0) {
      return;
    }
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.ctx = this.canvas.getContext('2d');

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.startRecording = this.startRecording.bind(this);
    this.stopRecording = this.stopRecording.bind(this);
    this.playEvents = this.playEvents.bind(this);
    this.clearCanvas = this.clearCanvas.bind(this);
    this.drawAction = this.drawAction.bind(this);

    this.canvas.addEventListener('mousedown', this.onMouseDown);
    this.canvas.addEventListener('mouseup', this.onMouseUp);
    this.canvas.addEventListener('mousemove', this.onMouseMove);
    this.clearCanvas();
  }

  calculateDistance (lastMouseX, lastMouseY, x, y) {
    const distance = Math.round(Math.sqrt(Math.pow((y-lastMouseY), 2) + Math.pow((x-lastMouseX), 2)));
    return distance;
  }

  onMouseDown(event) {
    const canvasX = this.canvas.offsetLeft;
    const canvasY = this.canvas.offsetTop;

    this.mouseDown = true;
    const x = Math.floor(event.pageX - canvasX);
    const y = Math.floor(event.pageY - canvasY);

    const	currAction = new Pixel(x, y, eventType.moveTo);
    this.distanceEle.innerHTML = this.distance = 0;   //initializing distance
    this.drawAction(currAction, true);
    if (this.currentEvent != null) {
      this.currentEvent.addAction(currAction);
    }
    this.lastMouseX = x;
    this.lastMouseY = y;
    event.preventDefault();
    return false;
  }

  onMouseMove(event) {
    if (this.mouseDown) {
      const canvasX = this.canvas.offsetLeft;
      const canvasY = this.canvas.offsetTop;

      const x = Math.floor(event.pageX - canvasX);
      const y = Math.floor(event.pageY - canvasY);

      this.distance += this.calculateDistance(this.lastMouseX, this.lastMouseY, x, y); //calculating distance
      this.distanceEle.innerHTML = this.distance;
      const action = new Pixel(x, y, eventType.lineTo);
      if (this.currentEvent != null) {
        this.currentEvent.addAction(action);
      }
      this.drawAction(action, true);

      event.preventDefault();
      this.lastMouseX = x;
      this.lastMouseY = y;
      return false;
    }
  }

  onMouseUp(event) {
    this.mouseDown = false;
    this.lastMouseX = -1;
    this.lastMouseY = -1;
  }

  startRecording() {
    this.currentEvent = new Event(this);
    this.events = new Array();
    this.events.push(this.currentEvent);
    this.currentEvent.start();
  }

  stopRecording() {
    if (this.currentEvent != null) {
      this.currentEvent.stop();
    }
    this.currentEvent = null;
  };

  playEvents(onPlayStart, onPlayEnd) {
    if (this.events.length === 0) {
      alert('No recording loaded to replay');
      onPlayEnd();
      return;
    }

    this.clearCanvas();

    onPlayStart();

    for (let rec = 0; rec < this.events.length; rec++) {
      this.events[rec].playEvent(this.drawActions, onPlayEnd);
    }
  }

  clearCanvas() {
    this.distanceEle.innerHTML = this.distance = 0;
    this.ctx.fillStyle = this.bgColor;
    this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
  }

  drawAction(actionArg, addToArray) {
    const x = actionArg.x;
    const y = actionArg.y;

    switch (actionArg.type) {
      case eventType.moveTo:
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.strokeStyle = this.drawingColor;
        break;
      case eventType.lineTo:
        this.ctx.lineTo(x, y);
        this.ctx.stroke();
        break;
    }
    if (addToArray) {
      this.actions.push(actionArg);
    }
  }
}
