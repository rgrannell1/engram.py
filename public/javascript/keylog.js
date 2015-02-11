
const keylog = ( function () {

	const codes = {
		'escape':    27,
		'backspace': 8
	}

	return function (callback, event) {

		is.always.object(event)
		is.always.function(callback)

		if (event.keyCode === codes.escape) {
			callback(true, false, undefined)
		} else if (event.keyCode === codes.backspace) {
			callback(false, true, undefined)
		} else if ((event.keyCode > 34 && event.keyCode < 127) && !event.ctrlKey && !event.altKey) {
			callback(false, false, event.key)
		}

	}

} )()

