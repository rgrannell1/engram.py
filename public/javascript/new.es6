
ENGRAM.eventBus    = EventBus( )
ENGRAM.cache       = { }
ENGRAM.loadedIndex = 0




// -- publish detailed position data on scroll.

$(window).on('scroll', ( ) => {

	var $window = $(window)

	ENGRAM.eventBus.publish(':scroll', {
		windowTop:      $window.scrollTop( ),
		scrollHeight:   $(document).height( ),
		scrollPosition: $window.height( ) + windowTop
	})

})






// -- publish when the top or bottom of the document is reached.

ENGRAM.eventBus.subscribe(':scroll', function detectEdge ({windowTop, scrollHeight, scrollPosition}) {

	if (scrollHeight - scrollPosition < ENGRAM.LOADOFFSET) {
		// what data should these publish ?

		ENGRAM.eventBus.publish(':atTop', { })

	} else if (windowTop < 50) {
		// what data should these publish ?

		ENGRAM.eventBus.publish(':atBottom', { })

	}


})





// -- update the query on search.

ENGRAM.QUERY = ''

ENGRAM.eventBus.subscribe(':press-typeable', ({key}) => {

	ENGRAM.QUERY += key

	ENGRAM.eventBus.publish(':update-query', {
		query: ENGRAM.QUERY
	})

})

ENGRAM.eventBus.subscribe(':press-backspace', ({key}) => {

	ENGRAM.QUERY = ENGRAM.QUERY.slice(0, -1)

	ENGRAM.eventBus.publish(':update-query', {
		query: ENGRAM.QUERY
	})

})

ENGRAM.eventBus.subscribe(':press-escape', ({key}) => {

	ENGRAM.QUERY = ''

	ENGRAM.eventBus.publish(':update-query', {
		query: ENGRAM.QUERY
	})

})





ENGRAM.eventBus.subscribe(':update-query', ({query}) => {

	query.length === 0
		? history.pushState(null, '', '/bookmarks')
		: history.pushState(null, '', `/bookmarks?q=${query}`)

})



// -- a collection of data used to speed-up searches, as search is
// -- slow and caching helps.

var searchState = {
	previous: '',
	current:  ''
}



// -- update the search state.

ENGRAM.eventBus.subscribe(':update-query', ({query}) => {

	searchState.previous = searchState.current
	searchState.current  = query

})











/*
	getQueryParam

	get a query parametre from the address bar.
*/

var getQueryParam = param => {

	var match  = RegExp('[?&]' + param + '=([^&]*)').exec(window.location.search)
	var result = match && decodeURIComponent(match[1].replace(/\+/g, ' '))

	return is.null(result) ? '' : result

}





/*
	loadSearchURL

	get the current location from the address bar and
	set it to the current query.
*/

var loadSearchURL = ( ) => {

	ENGRAM.eventBus.publish(':update-query', {
		query: ENGRAM.QUERY = getQueryParam('q')
	})

}

var selectBookmarks = query => {

	var cacheArray = Object.keys(ENGRAM.cache).map(key => ENGRAM.cache[key])

	return query === ''
		? cacheArray
		: cacheArray
			.filter(
				bookmark => bookmark.metadata.scores[query] > 0)
			.sort((bookmark0, bookmark1) => {
				bookmark0.metadata.scores[query] - bookmark1.metadata.scores[query]
			})

}





// -- populate the cache with all loaded bookmarks.

ENGRAM.eventBus.subscribe(':load-bookmark', bookmark => {

	var query = ENGRAM.QUERY

	is.always.object(bookmark)
	is.always.number(bookmark.bookmark_id)

	ENGRAM.cache[bookmark.bookmark_id] = {
		bookmark,
		metadata: {
			scores: query.length === 0
				? { }
				: {
					[query]: scoreTextMatch(query, isSplitSubstring(query), bookmark.title)
				}
		}
	}

	ENGRAM.eventBus.publish(':rescore')

})













ENGRAM.syncBookmarks( )
