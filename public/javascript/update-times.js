
const constants = {
	months: [
		"Jan", "Feb", "Mar", "Apr", "May", "Jun",
		"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
	],
	second: 1,
	minute: 60,
	hour:   3600,
	day:    24 * 3600,

	tickerPattern: 'class[tickrate^="tickrate-"]'

}





/*
	extractTime :: element -> Date

	get a javascript date from a <time> tag's data-ctime attribute.

*/

const extractTime = function (time)  {

	const ctime = $(time).attr('data-ctime')
	return new Date(parseInt(ctime, 10) * 1000)

}





/*
	secondsBetween :: Date x Date -> number

	get the time interval between two dates to the nearest second.

*/

const secondsBetween = function (recent, old) {
	return Math.floor((recent.getTime() - old.getTime() ) / 1000)
}





/*
	formatInterval :: number -> {
		message: string,
		value:   number,
		unit:    string
	}

*/

const formatInterval = function (sec) {

	if (sec < constants.minute) {

		return {
			message: sec + 's',
			value:   sec,
			unit:   'tickrate-second'
		}

	} else if (sec < constants.hour) {

		const magnitude = Math.round(sec / constants.minute)

		return {
			message: magnitude + 'm',
			value:   magnitude,
			unit:   'tickrate-minute'
		}

	} else if (sec < constants.day) {

		const magnitude = Math.round(sec / constants.minute)

		return {
			message: magnitude + 'h',
			value:   magnitude,
			unit:   'tickrate-hour'
		}

	} else {

		const ctime = new Date((new Date).getTime() - (sec * 1000))

		return {
			message: constants.months[ctime.getMonth()] + " " + ctime.getDate(),
			value:   Math.round(sec / constants.day),
			unit:   'tickrate-day'
		}

	}

}

/*
	elapsedTime

	given a time element, give the difference in that time from
	the present.
*/

const elapsedTime = function (elem) {

	const now   = new Date
	const ctime = extractTime(elem)

	return formatInterval(secondsBetween(now, ctime))

}

/*
	assignRates

	give each time tag a rate class, to determine how
	often it should be updated.
*/

const assignRates = function () {

	const $time = $('time')
	$time.each(function (ith, elem) {

		$(elem)
		.removeClass(constants.tickerPattern)
		.addClass(elapsedTime(elem).unit)

	})

}





const tick = ( function () {

	var self = {}

	const ticker = function (source, target) {
		return function () {

			const $time = $('.' + 'tickrate-' + source)

			$time.each(function (ith, elem) {

				const targetClass = 'tickrate-' + target
				const elapsed     = elapsedTime(elem)

				if (elapsed.unit === targetClass) {

					$(elem)
					.removeClass(constants.tickerPattern)
					.addClass(targetClass)

					self[target]()

				} else {

					$(elem).text(elapsed.message)

				}

			})

		}
	}

	self.second = ticker('second', 'minute')
	self.minute = ticker('minute', 'hour')
	self.hour   = ticker('hour',   'day')
	self.day    = ticker('day',    'year')

	return self

} )()










assignRates()

tick.second()
tick.minute()
tick.hour()
tick.day()





const tickerPids = {
	second: setInterval(tick.second, 1000),
	minute: setInterval(tick.minute, constants.minute * 1000),
	hour:   setInterval(tick.hour,   constants.hour   * 1000),
	day:    setInterval(tick.day,    constants.day    * 1000)
}
