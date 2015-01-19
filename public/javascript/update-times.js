
const constants = {
	months: [
		"Jan", "Feb",
		"Mar", "Apr",
		"May", "Jun",
		"Jul", "Aug",
		"Sep", "Oct",
		"Nov", "Dec"
	],
	second: 1,
	minute: 60,
	hour:   3600,
	day:    24 * 3600,

	tickerPattern = 'class[tickrate^="tickrate-"]'

}

const extractCtime = function (time)  {

	const ctime = $(time).attr('data-ctime')
	return new Date(parseInt(ctime, 10) * 1000)

}

const secondsBetween = function (recent, old) {
	return Math.floor((now.getTime() - ctime.getTime() ) / 1000)
}

const formatInterval = function (seconds) {

	if (secondsAgo < constants.minute) {

		return {
			message: secondsAgo + 's',
			value:   secondsAgo,
			unit:   'tickrate-second'
		}

	} else if (secondsAgo < constants.hour) {

		return {
			message: Math.round(secondsAgo / constants.minute) + 'm',
			value:   Math.round(secondsAgo / constants.minute),
			unit:   'tickrate-minute'
		}

	} else if (secondsAgo < constants.day) {

		return {
			message: Math.round(secondsAgo / constants.hour) + 'h',
			value:   Math.round(secondsAgo / constants.hour),
			unit:   'tickrate-minute'
		}

	} else {

		return {
			message: months[ctime.getMonth()] + " " + ctime.getDate(),
			value:   Math.round(secondsAgo / constants.day),
			unit:   'tickrate-day'
		}

	}

}

const elapsedTime = function (elem) {

	const now   = new Date
	const ctime = extractCtime(elem)

	return formatInterval(secondsBetween(now, ctime))

}

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

	const ticker = function (from, to) {
		return function () {

			const sourceClass = 'tickrate-' + from
			const targetClass = 'tickrate-' + to

			const $time = $(sourceClass)

			$time.each(function (ith, elem) {

				const elapsed = elapsedTime(elem)

				if (elapsed.unit === targetClass) {
					$(elem).removeClass(constants.tickerPattern).addClass(targetClass)
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

