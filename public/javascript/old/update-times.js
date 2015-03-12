
const constants = {
	months: [
		"Jan", "Feb", "Mar", "Apr", "May", "Jun",
		"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
	],
	second: 1,
	minute: 60,
	hour:   3600,
	day:    24 * 3600
}





/*
	formatInterval :: number -> string

	given a number of seconds a human-readable time interval representation.

	For example,

	13    => 13s
	120   => 2m
	10000 => June 18

*/

const formatInterval = function (sec) {

	if (sec < constants.minute) {

		return sec + 's'

	} else if (sec < constants.hour) {

		return Math.round(sec / constants.minute) + 'm'

	} else if (sec < constants.day) {

		return Math.round(sec / constants.hour) + 'h'

	} else {

		const ctime = new Date(new Date - (1000 * sec))

		return constants.months[ctime.getMonth( )] + " " + ctime.getDate( )

	}

}





/*
	extractTime :: element -> Date

	get a javascript date from a <time> tag's data-ctime attribute.

*/
const extractTime = function (time) {
	return new Date(parseInt($(time).attr('data-ctime'), 10) * 1000)
}





/*
	secondsBetween :: Date x Date -> number

	get the time interval between two dates to the nearest second.

*/

const secondsBetween = function (recent, old) {
	return Math.floor((recent.getTime( ) - old.getTime( ) ) / 1000)
}






/*
	elapsedTime :: TimeTag -> message: string

	given a time element, give the difference in that time from
	the present.
*/

const elapsedTime = function (elem) {

	if (is.undefined(elem)) {
		throw "elapsedTime: elem was undefined."
	}

	return formatInterval( secondsBetween(new Date, extractTime(elem)) )
}





/*
	showTime :: time -> undefined

	update the text of a time element to show
	the current time or time difference in a human-readable format.

*/

const showTime = function ($time) {

	if (is.undefined($time)) {
		throw "showTime: $time was undefined."
	}

	$time.text(elapsedTime($time))

}






ENGRAM.updateTimes = ( ) => {

	$('.viewgroup time').each(function () {
		showTime($(this))
	})

}
