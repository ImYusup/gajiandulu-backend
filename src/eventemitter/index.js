const EventEmitter = require('events').EventEmitter;
const UserRegistered = require('./UserRegistered');

let observe = new EventEmitter();

const events = { UserRegistered: new UserRegistered(observe) };

module.exports = { observe, events };
