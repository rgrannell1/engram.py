
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
		} else {

			const isTypeable = (
				(event.keyCode >= 41 && event.keyCode < 122) ||
				(event.keyCode == 32 || event.keyCode > 186)) &&
			event.key.length === 1

			if (isTypeable && !event.ctrlKey && !event.altKey) {
				callback(false, false, event.key)
			}
		}

	}

} )()
