






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
