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

.subscribe(':atTop', ({windowTop, scrollHeight, scrollPosition}) => {

	if (!isRoomLeft( )) {

	}

	console.log('getting top')

})
.subscribe(':atBottom', ({windowTop, scrollHeight, scrollPosition}) => {

	if (!isRoomLeft( )) {

	}

	console.log('getting end')

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





ENGRAM.syncBookmarks( )

