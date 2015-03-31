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

function publish(topic, data) {

	publish.precond(topic, data);

	if (topic.length > 0 && !is.undefined(this.topics[topic])) {

		var data = data || {};

		this.topics[topic].forEach(function (listener) {
			listener(data);
		});
	}

	return this;
}

publish.precond = function (topic, data) {

	is.always.string(topic, "topic must be a string.");
};

var await = (function (_await) {
	var _awaitWrapper = function await(_x, _x2) {
		return _await.apply(this, arguments);
	};

	_awaitWrapper.toString = function () {
		return _await.toString();
	};

	return _awaitWrapper;
})(function (topic, listener) {

	await.precond(topic, listener);

	if (is.undefined(this.topics[topic])) {
		this.topics[topic] = [];
	}

	var decorated = function () {
		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		if (decorated.active) {

			decorated.active = false;
			listener.apply(undefined, args);
		}
	};

	// -- could also use decorated.call(decorated, )
	decorated.active = true;

	this.topics[topic].push(decorated);

	return this;
});

await.precond = function (topic, listener) {};

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
		await: await,
		publish: publish,
		subscribe: subscribe
	};
});
