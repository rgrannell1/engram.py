"use strict";

var subscribe = (function (_subscribe) {
	var _subscribeWrapper = function subscribe(_x, _x2) {
		return _subscribe.apply(this, arguments);
	};

	_subscribeWrapper.toString = function () {
		return _subscribe.toString();
	};

	return _subscribeWrapper;
})(function (topic, listener) {

	subscribe.precond(topic, listener);

	if (is.undefined(this.topics[topic])) {
		this.topics[topic] = [];
	}

	this.topics[topic].push(listener);

	return this;
});

subscribe.precond = function (topic, listener) {

	is.always.string(topic, "topic must be a string.");
	is.always["function"](listener, "listener must be a function.");
};

var publish = (function (_publish) {
	var _publishWrapper = function publish(_x, _x2) {
		return _publish.apply(this, arguments);
	};

	_publishWrapper.toString = function () {
		return _publish.toString();
	};

	return _publishWrapper;
})(function (topic, data) {

	publish.precond(topic, data);

	if (topic.length === 0 || is.undefined(this.topics[topic])) {
		return;
	} else {
		this.topics[topic].forEach(function (listener) {
			listener(data || {});
		});
	}

	return this;
});

publish.precond = function (topic, data) {

	is.always.string(topic, "topic must be a string.");
};

var EventBus = (function (_EventBus) {
	var _EventBusWrapper = function EventBus() {
		return _EventBus.apply(this, arguments);
	};

	_EventBusWrapper.toString = function () {
		return _EventBus.toString();
	};

	return _EventBusWrapper;
})(function () {

	if (!this instanceof EventBus) {
		return new EventBus();
	}

	return {
		topics: {},
		publish: publish,
		subscribe: subscribe
	};
});
