
{

	let months = [
		"Jan", "Feb", "Mar", "Apr", "May", "Jun",
		"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
	]

	let oneSecond = 1
	let oneMinute = 60
	let oneHour   = 3600
	let oneDay    = 24 * 3600





	var formatInterval = seconds => {

		var ctime = new Date(new Date - (1000 * seconds))

		if (seconds < oneMinute) {
			return `{seconds}s`
		} else if (seconds < oneHour) {
			return `${Math.round(seconds / oneMinute)}m`
		} else if (seconds < oneDay) {
			return `${Math.round(seconds / oneHour)}h`
		} else {
			return `${ months[ctime.getMonth( )] } ${ctime.getDate( )}`
		}

	}

	var extractTime = time => {
		return new Date(parseInt($(time).attr('data-ctime'), 10) * 1000)
	}

	var secondsBetween = (recent, old) => {
		return Math.floor((recent.getTime( ) - old.getTime( ) ) / 1000)
	}

	var renderTime = $time => {

		var elapsed = secondsBetween(new Date, extractTime($time))
		$time.text(formatInterval(elapsed))

	}





	ENGRAM.updateTimes = ( ) => {

		$('.bookmark time').each(function () {
			renderTime($(this))
		})

	}





	setInterval(ENGRAM.updateTimes, 1000)

}