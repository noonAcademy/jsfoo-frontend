class Action {
  constructor() {
    this.actionType; // 1 - Point, 0 - Line
    this.x = 0;
    this.y = 0;

    if (arguments.length > 0) {
      this.actionType = arguments[0];
    }
    if (arguments.length > 2) {
      this.x = arguments[1];
      this.y = arguments[2];
    }
  }
}