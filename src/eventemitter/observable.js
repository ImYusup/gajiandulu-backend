const EventEmitter = require('events').EventEmitter;

function Observable() {
  if (!(this instanceof Observable)) return new Observable();

  EventEmitter.call(this);
}

Observable.prototype = Object.create(EventEmitter.prototype);

module.exports = Observable;
