
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

ENGRAM.searchState = {
	previous:   '',
	current:    '',
	setQuery: function (query) {

		this.previous = this.current
		this.current  = query

	}

}


ENGRAM.inFocus = {
	value: {},
	currentQuery: "",
	setFocus: function setFocus({value, currentQuery}) {

		this.value        = value
		this.currentQuery = currentQuery

		ENGRAM.eventBus.publish(':update-focus', this)

	}
}
