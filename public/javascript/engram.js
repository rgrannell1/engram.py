
// add 'use strict'?

ENGRAM = { }




// how many bookmarks to append on scroll?
ENGRAM.PERSCROLL    = 10
ENGRAM.BIGINT       = 1000000

// how many bookmarks to retrieve per request?
ENGRAM.PERREQUEST   = 1000

// how many milliseconds to wait between requests?
ENGRAM.LOADINTERVAL = 100

// how many milliseconds to transition delete within?
ENGRAM.DELETEFADE   = 250

// how many pixels do you have to be from the botton of the
// page to load some more bookmarks?
ENGRAM.LOADOFFSET   = 60






ENGRAM.eventBus    = EventBus( )
ENGRAM.loadedIndex = 0





// -- a collection of data used to speed-up searches, as search is
// -- slow and caching helps.

ENGRAM.searchState = {
	previous: '',
	current:  ''
}

ENGRAM.searchState.setQuery = query => {

	this.previous = this.current
	this.current  = query

}
