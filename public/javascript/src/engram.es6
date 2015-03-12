
"use strict"

window.ENGRAM = {};

// how many bookmarks to append on scroll?
ENGRAM.PERSCROLL = 10;
ENGRAM.MAXLOADED = 50;
ENGRAM.BIGINT = 1000000;

// how many bookmarks to retrieve per request?
ENGRAM.PERREQUEST = 1000;

// how many milliseconds to wait between requests?
ENGRAM.LOADINTERVAL = 100;

// how many milliseconds to transition delete within?
ENGRAM.DELETEFADE = 250;

// how many pixels do you have to be from the botton of the
// page to load some more bookmarks?
ENGRAM.LOADOFFSET = 60;
ENGRAM.eventBus = EventBus( )





{
	let setQuery = function (query) {

		setQuery.precond(query)

		this.previous = this.current
		this.current  = query

	}

	setQuery.precond = query => {
		is.always.string(query)
	}





	var ENGRAM.searchState = {
		previous:   '',
		current:    '',
		setQuery

	}

}





{
	let setFocus = function ({value, currentQuery}) {

		setFocus.precond({value, currentQuery})

		this.value        = value
		this.currentQuery = currentQuery

		ENGRAM.eventBus.publish(':update-focus', this)

	}

	setFocus.precond = ({value, currentQuery}) => {

		is.always.array(value)
		is.always.strict(currentQuery)

	}





	var ENGRAM.inFocus = {
		value:        { },
		currentQuery: "",
		setFocus
	}
}
