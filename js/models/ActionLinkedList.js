// This is a chain of actions during capturing
class ActionLinkedList {
 constructor (internalArg, actionsArrayArg) {
   this.actions = actionsArrayArg;
   this.interval = internalArg;
   this.next = null;
 }
};