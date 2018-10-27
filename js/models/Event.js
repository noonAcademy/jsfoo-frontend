// This captures every action done by the user
class Event {
  constructor(drawingArg) {
    this.drawing = drawingArg;
    this.timeSlots = new Object(); //Map with key as time slot and value as array of Point objects

    this.buffer = new Array(); //array of Point objects
    this.timeInterval = 100; //10 miliseconds
    this.currTime = 0;
    this.started = false;
    this.intervalId = null;
    this.currTimeSlot = 0;
    this.actionsList = null;
    this.currActionSet = null;
    this.recStartTime = null;

    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.onInterval = this.onInterval.bind(this);
    this.addAction = this.addAction.bind(this);
    this.playEvent = this.playEvent.bind(this);
    this.scheduleReplay = this.scheduleReplay.bind(this);
    this.drawActions = this.drawActions.bind(this);
  }

  // on start capturing
  start() {
    this.currTime = 0;
    this.currTimeSlot = -1;
    this.actionsList = null;

    this.recStartTime = (new Date()).getTime();
    this.intervalId = window.setInterval(this.onInterval, this.timeInterval);
    this.started = true;
  }

  // on stop capturing
  stop() {
    if (this.intervalId != null) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.started = false;
  }

  // capturing events on certain intervals to optimize
  onInterval() {
    if (this.buffer.length > 0) {
      const timeSlot = (new Date()).getTime() - this.recStartTime;

      if (this.currActionSet === null) {
        this.currActionSet = new ActionLinkedList(timeSlot, this.buffer);
        this.actionsList = this.currActionSet;
      }
      else {
        const tmpActionSet = this.currActionSet;
        this.currActionSet = new ActionLinkedList(timeSlot, this.buffer);
        tmpActionSet.next = this.currActionSet;
      }

      this.buffer = new Array();
    }
    this.currTime += this.timeInterval;
  }

  // add action to the capturing object
  addAction(actionArg) {
    if (!this.started)
      return;
    this.buffer.push(actionArg);
  }

  // play the particular captured event
  playEvent(callbackFunctionArg, onPlayEnd) {
    if (this.actionsList === null) {
      if (typeof onPlayEnd != 'undefined' && onPlayEnd != null)
        onPlayEnd();
      return;
    }

    this.scheduleReplay(this.actionsList, this.actionsList.interval, callbackFunctionArg, onPlayEnd);
  }

  // draw the event with interval
  scheduleReplay(actionSetArg, interval, callbackArg, onPlayEnd) {
    window.setTimeout(() => {
      let status = '';

      let intervalDiff = -1;
      let isLast = true;
      if (actionSetArg.next != null) {
        isLast = false;
        intervalDiff = actionSetArg.next.interval - actionSetArg.interval;
      }
      if (intervalDiff >= 0) {
        this.scheduleReplay(actionSetArg.next, intervalDiff, callbackArg, onPlayEnd);
      }

      this.drawActions(actionSetArg.actions, onPlayEnd, isLast);
    }, interval);
  }

  // draw all the actions in the captured event
  drawActions(actionArray, onPlayEnd, isLast) {
    for (let i = 0; i < actionArray.length; i++) {
      this.drawing.drawAction(actionArray[i], false);
    }

    if (isLast) {
      onPlayEnd();
    }
  }
}
