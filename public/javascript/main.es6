
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





$(document).on('click', '.delete-bookmark', function ( ) {

	var $button  = $(this)

	var $article = $button.closest('article')
	var id       = parseInt($article.attr('id'), 10)

	ENGRAM.eventBus.publish(':delete-bookmark', {id, $button})

})






ENGRAM.eventBus.subscribe(':update-query', ({query}) => {

	query.length === 0
		? history.pushState(null, '', '/bookmarks')
		: history.pushState(null, '', `/bookmarks?q=${query}`)

})





// -- update the search state.

ENGRAM.eventBus.subscribe(':update-query', ({query}) => {

	searchState.previous = searchState.current
	searchState.current  = query

})




ENGRAM.eventBus.subscribe(':delete-bookmark', deleteBookmark)
ENGRAM.eventBus.subscribe(':update-query',    scoreBookmarks)





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
