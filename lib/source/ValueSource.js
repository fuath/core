/** @license MIT License (c) copyright 2010-2014 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

var fatal = require('../fatalError');
var scheduler = require('../Scheduler');

module.exports = ValueSource;

function ValueSource(emit, x) {
	this.emit = emit;
	this.value = x;
}

ValueSource.prototype.run = function(sink) {
	return new ValueProducer(this.emit, this.value, sink);
};

function ValueProducer(emit, x, sink) {
	this.value = x;
	this.sink = sink;
	this.active = true;

	scheduler.asap(emit, error, this);
}

ValueProducer.prototype.dispose = function() {
	this.active = false;
};

function error(e) {
	var producer = this._x;
	if(!producer.active) {
		return fatal(e);
	}
	producer.sink.error(0, e);
}