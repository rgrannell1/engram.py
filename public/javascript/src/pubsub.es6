"use strict"






var subscribe = function (topic, listener) {

	subscribe.precond(topic, listener)

	if (is.undefined(this.topics[topic])) {
		this.topics[topic] = [ ]
	}

	this.topics[topic].push(listener)

	return this

}

subscribe.precond = (topic, listener) => {

	is.always.string  (topic,    'topic must be a string.')
	is.always.function(listener, 'listener must be a function.')

}




// declaration this way is faster when compiled.
function publish (topic, data) {

	publish.precond(topic, data)

	if ( topic.length > 0 && !is.undefined(this.topics[topic]) ) {

		var data = data || { }

		var topicListeners = this.topics[topic]

		for (let ith = 0; ith < topicListeners.length; ++ith) {
			topicListeners[ith](data)
		}

	}

	return this

}

publish.precond = (topic, data) => {

	is.always.string(topic, 'topic must be a string.')

}




var await = function (topic, listener) {

	await.precond(topic, listener)

	if (is.undefined(this.topics[topic])) {
		this.topics[topic] = [ ]
	}



	var decorated = (...args) => {

		if (decorated.active) {

			decorated.active = false
			listener(...args)
		}

	}

	// -- could also use decorated.call(decorated, )
	decorated.active = true



	this.topics[topic].push(decorated)

	return this


}

await.precond = (topic, listener) => {

}





var EventBus = function ( ) {

	if (!this instanceof EventBus) {
		return new EventBus( )
	}

	return {
		topics: { },
		await,
		publish,
		subscribe
	}

}
