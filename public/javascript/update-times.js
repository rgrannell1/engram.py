
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
		unit:    string
	}

	given a number of seconds return an object containing a
	unit (second, minute, hour, day), and a message.

	For example,

	13    => 13s,     'tickrate-second'
	120   => 2m,      'tickrate-minute'
	10000 => June 18, 'tickrate-day'

*/

const formatInterval = function (sec) {

	if (sec < constants.minute) {

		return {
			message: sec + 's',
			unit:   'tickrate-second'
		}

	} else if (sec < constants.hour) {

		return {
			message: Math.round(sec / constants.minute) + 'm',
			unit:   'tickrate-minute'
		}

	} else if (sec < constants.day) {

		return {
			message: Math.round(sec / constants.hour) + 'h',
			unit:   'tickrate-hour'
		}

	} else {

		const ctime = new Date(new Date - (1000 * sec))

		return {
			message: constants.months[ctime.getMonth()] + " " + ctime.getDate(),
			unit:   'tickrate-day'
		}

	}

}





/*
	elapsedTime :: TimeTag -> {
		message: string,
		unit:    string
	}

	given a time element, give the difference in that time from
	the present.
*/

const elapsedTime = function (elem) {
	return formatInterval( secondsBetween(new Date, extractTime(elem)) )
}





/*
	assignRates

	give each time tag a rate class, to determine how
	often it should be updated.

*/

const assignRates = function () {

	const $time = $('time')
	$time.each(function (ith, elem) {
		$(elem).addClass(elapsedTime(elem).unit)
	})

}





const tick = ( function () {

	var self = {}

	const ticker = function (source, target) {
		return function () {

			const $time = $('.' + source)

			$time.each(function (ith, elem) {

				const elapsed = elapsedTime(elem)

				if (elapsed.unit === target) {

					$(elem).removeClass('.' + source).addClass(target)
					self[target]()

				} else {

					$(elem).text(elapsed.message)

				}

			})

		}
	}

	self['tickrate-second'] = self.second = ticker('tickrate-second', 'tickrate-minute')
	self['tickrate-minute'] = self.minute = ticker('tickrate-minute', 'tickrate-hour')
	self['tickrate-hour']   = self.hour   = ticker('tickrate-hour',   'tickrate-day')
	self['tickrate-day']    = self.day    = ticker('tickrate-day',    'tickrate-year')

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
