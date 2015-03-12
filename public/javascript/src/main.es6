"use strict"

{

	let eventCode = {
		'escape':    27,
		'backspace': 8
	}

	let isTypeable = event => {
		return (
			(event.keyCode >= 41 && event.keyCode < 122) ||
			(event.keyCode == 32 || event.keyCode > 186)) &&
			event.key.length === 1
	}



	// -- publish keystrokes.

	$(window).keydown(event => {

		var keyCode = event.keyCode

		if (event.keyCode === eventCode.escape) {
			ENGRAM.eventBus.publish(':press-escape')
		} else if (event.keyCode === eventCode.backspace) {
			ENGRAM.eventBus.publish(':press-backspace')
		} else {

			if (isTypeable(event) && !event.ctrlKey && !event.altKey) {

				ENGRAM.eventBus.publish(':press-typeable', {
					key: event.key
				})

			}

		}

	})

}





// -- trigger a delete event on delete-button click.

$(document).on('click', '.delete-bookmark', function ( ) {

	var $button  = $(this)

	var $article = $button.closest('article')
	var id       = parseInt($article.attr('id'), 10)

	ENGRAM.eventBus.publish(':delete-bookmark', {id, $button})

})




// -- publish data about scroll position.

$(window).on('scroll', ( ) => {

	var $window   = $(window)
	var windowTop = $window.scrollTop( )

	ENGRAM.eventBus.publish(':scroll', {

		windowTop:      windowTop,
		scrollHeight:   $(document).height( ),
		scrollPosition: $window.height( ) + windowTop

	})

})



// -- test if we are at the boundaries of the page.

ENGRAM.eventBus.subscribe(':scroll', function detectEdge ({windowTop, scrollHeight, scrollPosition}) {

	if (scrollHeight - scrollPosition < ENGRAM.LOADOFFSET) {
		// what data should these publish ?

		ENGRAM.eventBus.publish(':atBottom', {windowTop, scrollHeight, scrollPosition})

	} else if (windowTop < ENGRAM.LOADOFFSET) {
		// what data should these publish ?

		ENGRAM.eventBus.publish(':atTop', {windowTop, scrollHeight, scrollPosition})

	}

})





var isRoomLeft = ( ) => {
	return $('#bookmarks article').length < 5 * ENGRAM.PERSCROLL
}




ENGRAM.eventBus

.subscribe(':atBottom', ({windowTop, scrollHeight, scrollPosition}) => {

	if (getQuery( ) === '') {

		ENGRAM.eventBus.publish(':scrolldown-bookmarks', {
			from:         $('#bookmarks article:last').attr('id') ,
			isDecreasing: true
		})

	}


})

.subscribe(':update-query', ({query}) => {
	ENGRAM.searchState.setQuery(query)
})
.subscribe(':update-query', scoreBookmarks)
.subscribe(':load-bookmark', bookmark => {

	var query = getQuery( )

	is.always.object(bookmark)
	is.always.number(bookmark.bookmark_id)

	ENGRAM.cache.set(bookmark.bookmark_id, {
		bookmark,
		metadata: {
			scores: query.length === 0
				? { }
				: {
					[query]: scoreTextMatch(query, isSplitSubstring(query), bookmark.title)
				}
		}
	})

	ENGRAM.eventBus.publish(':rescore')

})





var listBookmarks = (from, cache, isDecreasing) => {

	listBookmarks.precond(from, cache, isDecreasing)

	return Object.keys(cache)
		.map(
			key => parseInt(key, 10))
		.filter(
			key => isDecreasing ? key < from : key > from)
		.sort(
			(num0, num1) => num1 - num0) // -- this is slow if object imp. isn't ordered.
		.slice(
			0, ENGRAM.PERSCROLL)
		.map(
			key => cache[key])

}

listBookmarks.precond = (from, cache, isDecreasing) => {

	is.always.string(from)
	is.always.object(cache)
	is.always.boolean(isDecreasing)

}





var loadDownwards = ({from,  isDecreasing})  => {

	// -- set the current focus to the current [more-bookmarks] + focus,
	// -- or focus + [more-bookmarks]. Then truncate, and redraw.

	var loaded = listBookmarks(from, ENGRAM.cache, isDecreasing)

	ENGRAM.inFocus.setFocus(isDecreasing
		? {
			value:        ENGRAM.inFocus.value.concat(loaded).slice(0, +ENGRAM.MAXLOADED),
			currentQuery: ''
		}
		: {
			value:        loaded.concat(ENGRAM.inFocus.value).slice(-ENGRAM.MAXLOADED),
			currentQuery: ''
		}
	)

}





$(( ) => {

	loadDownwards({
		from:         ENGRAM.BIGNUM + "",
		isDecreasing: true
	})

})





ENGRAM.eventBus.subscribe(':scrolldown-bookmarks', loadDownwards)

ENGRAM.syncBookmarks( )
