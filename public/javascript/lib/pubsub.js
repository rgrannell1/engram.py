"use strict";

var on = (function (_on) {
	var _onWrapper = function on(_x, _x2) {
		return _on.apply(this, arguments);
	};

	_onWrapper.toString = function () {
		return _on.toString();
	};

	return _onWrapper;
})(function (topic, listener) {

	on.precond(topic, listener);

	if (is.undefined(this.topics[topic])) {
		this.topics[topic] = [];
	}

	this.topics[topic].push(listener);

	return this;
});

on.precond = function (topic, listener) {

	is.always.string(topic, "topic must be a string.");
	is.always["function"](listener, "listener must be a function.");
};

// declaration this way is faster when compiled.
function fire(topic, data) {

	fire.precond(topic, data);

	if (topic.length > 0 && !is.undefined(this.topics[topic])) {

		var data = data || {};

		var topicListeners = this.topics[topic];

		for (var ith = 0; ith < topicListeners.length; ++ith) {
			topicListeners[ith](data);
		}
	}

	return this;
}

fire.precond = function (topic, data) {

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
		fire: fire,
		on: on
	};
});
