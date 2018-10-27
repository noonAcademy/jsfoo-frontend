// This stores action and the type of event.
class Pixel extends Action {
  constructor (argX, argY, typeArg) {
    super(1, argX, argY);
    this.type = typeArg;  //0 - moveto, 1 - lineto
  }
}