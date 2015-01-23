
ENGRAM.timerJob = []





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
const extractTime = function (time) {
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
	loadTimer :: undefined -> undefined

	apply a function to each time element currently
	in the viewport.

*/

const forEachActiveTime = function (callback) {

	$('.viewgroup:in-viewport', function () {
		$('time').each(callback)
	})

}





/*
	showTime :: time -> undefined

	update the text of a time element to show
	the current time or time difference in a human-readable format.

*/

const showTime = function ($time) {

	const elapsed = elapsedTime($time)
	$time.text(elapsed.message)

}





/*
	updateJobs :: number -> [{viewgroup_id: number, pid: number}]

	update the data structure keeping track of which time elements
	are currently being updated via setIntervals.
*/

const updateJobs = function (viewgroup_id, $time) {

	showTime($time)

	return ENGRAM.timerJob
		.map(function (job) {
			// remove timer intervals not on screen.

			if (job.viewgroup_id !== viewgroup_id) {
				clearInterval(job.pid)
			}

			return job

		})
		.filter(function (job){
			// delete corresponding element in timerJob

			return job.viewgroup_id === viewgroup_id

		})
		.concat({
			viewgroup_id: viewgroup_id,
			pid:          setInterval(showTime.bind(null, $time), 1000)
		})

}




/*
	updateTimers :: undefined -> undefined

	update each time in the viewport.

*/

const updateTimers = function () {

	forEachActiveTime(function () {

		const viewgroup_id = $(this).parent().attr('id')
		ENGRAM.timerJob    = updateJobs(viewgroup_id, $(this))

	})

}




/*
	viewingBottom :: undefined -> number

	is the user scrolled to the bottom of the page?
*/

ENGRAM.viewingBottom = function (offset) {

	if (is.undefined(offset)) {
		offset = 0
	}

	return document.documentElement.clientHeight + $(document).scrollTop() - offset >= document.body.offsetHeight

}





$.get('/public/html/bookmark-template.html', function (template) {

	/*
		renderBookmark :: Bookmark -> string

		render the bookmark template with Mustache.
	*/

	const renderBookmark = function (bookmark) {
		return Mustache.render(template, bookmark)
	}





	/*
		appendBookmarks :: number -> undefined

		add bookmarks to the DOM.

		what is cache.maxID === -1 (no update) ?

	*/

	const appendBookmarks = function (maxID) {

		if (ENGRAM.viewingBottom(ENGRAM.LOADOFFSET)) {

			const chunk = ENGRAM.cache.fetchChunk(maxID, ENGRAM.PERSCROLL)
			chunk.data.map(function (bookmark) {

				const elem = $('<div></div>', {
					'id':    maxID,
					'class': 'viewgroup'
				})

				elem.append(renderBookmark(bookmark))

				$('#content').append(elem)

				// rebind scroll handler.
				$(document).off('scroll')
				$(document).on('scroll', appendBookmarks.bind(null, chunk.nextID))
				$(document).on('scroll', updateTimers)

			})
		}
	}



	appendBookmarks(ENGRAM.cache.maxID)
})
