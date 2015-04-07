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
			ENGRAM.eventBus.fire(':press-escape')
		} else if (event.keyCode === eventCode.backspace) {
			ENGRAM.eventBus.fire(':press-backspace')
		} else {

			if (isTypeable(event) && !event.ctrlKey && !event.altKey) {

				ENGRAM.eventBus.fire(':press-typeable', {
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

	ENGRAM.eventBus.fire(':delete-bookmark', {id, $button})

})




// -- publish data about scroll position.

$(window).on('scroll', ( ) => {

	var $window   = $(window)
	var windowTop = $window.scrollTop( )

	ENGRAM.eventBus.fire(':scroll', {

		windowTop:      windowTop,
		scrollHeight:   $(document).height( ),
		scrollPosition: $window.height( ) + windowTop

	})

})



// -- test if we are at the boundaries of the page.

var listNext = (downwards, from, amount) => {

	listNext.precond(downwards, from, amount)





	var filtered = Object.keys(ENGRAM.cache)
		.map(
			key => parseInt(key, 10))
		.filter(
			id  => downwards ? id < from : id > from)
		.sort(
			(num0, num1) => num1 - num0) // -- this is slow if object imp. isn't ordered.





	var sliced = downwards ? filtered.slice(0, amount) : filtered.slice(-amount)

	return sliced.map(key => ENGRAM.cache[key])

}

listNext.precond = (downwards, from, amount) => {

	is.always.boolean(downwards)
	is.always.number(from)
	is.always.number(amount)

}





var listDown = listNext.bind({ }, true)
var listUp   = listNext.bind({ }, false)





{

	var loadState = [new Date(0), new Date(0)]

	let loadList = (downwards, from) => {

		var lastLoadIth = downwards ? 0 : 1

		var now = new Date( )

		if (now - loadState[lastLoadIth] < 150) {
			return
		} else {
			loadState[lastLoadIth] = now
		}

		var loaded = (downwards ? listDown : listUp)(from, ENGRAM.PERSCROLL)

		ENGRAM.inFocus.setFocus({

			value: downwards
				? ENGRAM.inFocus.value.concat(loaded).slice(-ENGRAM.MAXLOADED)
				: loaded.concat(ENGRAM.inFocus.value).slice(0, +ENGRAM.MAXLOADED),

			currentQuery: ''
		})





		var bookmark = downwards
			? $('#bookmarks article').slice(-1)[0]
			: $('#bookmarks article').slice(0, 1)[0]

		var originalOffset = bookmark.getBoundingClientRect( ).top
		var id             = $(bookmark).attr('id')





		ENGRAM.eventBus.fire(':loaded-bookmarks', {originalOffset, id})

	}





	var loadListDown = loadList.bind({ }, true)
	var loadListUp   = loadList.bind({ }, false)

}





var fillBookmarks = ( ) => {

	var currentAmount = ENGRAM.inFocus.value.length
	var stillUnloaded = getQuery( ) === '' && currentAmount !== ENGRAM.MAXLOADED

	if (!stillUnloaded) {
		return
	}

	var from   = $('#bookmark-container article').length === 0
		? ENGRAM.BIGINT
		: parseInt($('#bookmark-container article:last').attr('id'), 10)

	var loaded = listDown(from, ENGRAM.MAXLOADED - currentAmount)

	if (loaded.length > 0) {

		ENGRAM.inFocus.setFocus({
			value:        ENGRAM.inFocus.value.concat(loaded),
			currentQuery: ''
		})

	}

}





setImmediateInterval(ENGRAM.updateTimes, 250)
setImmediateInterval(fillBookmarks,      250)






var triggerLoad = (downwards) => {

	var nextId =
		parseInt(
			$('#bookmarks article')
			[downwards ? 'last': 'first']( )
			.attr('id')) + (downwards ? -1 : +1)





	if (getQuery( ) === '') {
		// -- load linearly by id up or down.

		var topic = ':scroll' + (downwards ? 'down' : 'up')  + '-bookmarks'

		ENGRAM.eventBus.fire(topic, nextId)

	} else {
		// -- load upwards or downwards by search score.


	}


}





ENGRAM.eventBus
.on(':scroll', function detectEdge ({windowTop, scrollHeight, scrollPosition}) {

	if (scrollHeight - scrollPosition === 0) {
		ENGRAM.eventBus.fire(':atBottom', {windowTop, scrollHeight, scrollPosition})
	} else if (windowTop === 0) {
		ENGRAM.eventBus.fire(':atTop', {windowTop, scrollHeight, scrollPosition})
	}

})

.on(':atBottom', ({windowTop, scrollHeight, scrollPosition}) => {
	triggerLoad(true)
})
.on(':atTop', ({windowTop, scrollHeight, scrollPosition}) => {
	triggerLoad(false)

})

.on(':update-query', ({query}) => {
	ENGRAM.searchState.setQuery(query)
})
.on(':update-query', scoreBookmarks)
.on(':load-bookmark', bookmark => {

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

	ENGRAM.eventBus.fire(':rescore')

})

.on(':scrollup-bookmarks',   loadListUp)
.on(':scrolldown-bookmarks', loadListDown)

.on(':loaded-bookmarks', ({originalOffset, id}) => {

	ENGRAM.eventBus.await(':redraw', ( ) => {
		$(window).scrollTop($('#' + id).offset( ).top - originalOffset)
	})

})





ENGRAM.syncBookmarks( )
