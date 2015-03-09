
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



// -- publish all keystrokes on the DOM.

$(window).keydown((event) => {

	var keyCode = event.keyCode

	if (event.keyCode === 27) {
		ENGRAM.eventBus.publish(':press-escape')
	} else if (event.keyCode === 8) {
		ENGRAM.eventBus.publish(':press-backspace')
	} else {

		var isTypeable = (
			(keyCode >= 41 && keyCode < 122) ||
			(keyCode == 32 || keyCode > 186)) &&
			event.key.length === 1

		if (isTypeable && !event.ctrlKey && !event.altKey) {

			ENGRAM.eventBus.publish(':press-typeable', {
				key: event.key
			})

		}

	}

})





$(document).on('click', '.delete-bookmark', ( ) => {

	var $button  = this

	var $article = $(button).closest('article')
	var id       = parseInt($article.attr('id'), 10)

	ENGRAM.eventBus.publish(':delete-bookmark', {
		id: id
	})

})






var deleteBookmark = ({id}) => {

	const $article = $(button).find(id).closest('article')

	$article.hide(ENGRAM.DELETEFADE)

	$.ajax({
		url: `/bookmarks/${id}`,
		type: 'DELETE',
		success: $article.remove,
		failure: ( ) => {

			alert(`failed to remove bookmark #${id}`)
			$article.show( )

		}
	})

}





ENGRAM.eventBus.subscribe(':delete-bookmark', deleteBookmark)








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












/*
	align

	efficiently align two strings locally, and calculate the gaps required to make the match
	fit.

*/

{
	let locate = (char, string, from) => {

		for (var ith = from; ith < string.length; ++ith) {
			if (char === string.charAt(ith)) {
				return ith
			}
		}

		return -1
	}

	var align = (query, text) => {

		var query = query.toLowerCase( )
		var text  = text. toLowerCase( )

		var alignResult = {
			gaps: 0,
			text,
			query
		}

		var from = locate(query.charAt(0), text, 0)
		var nextFrom;

		for (var ith = 0; ith < query.length; ++ith) {
			// assume 'from' never over- or under-runs, as query should always be a substring of text.

			nextFrom          = locate(query.charAt(ith), text, from) + 1
			alignResult.gaps += (nextFrom - from - 1)
			from              = nextFrom

		}

		return alignResult

	}
}







/*
	alignQuality

	how well aligned is a string to another?

*/

var alignQuality = alignment => {
	return 1 - Math.pow(alignment.gaps / alignment.text.length, 1 / 5)
}







/*

	findSplitSubstring :: string -> string -> boolean

	detect whether a string is contained within another, allowing
	for gaps but not mismatches.

*/

var isSplitSubstring = pattern => {

	var regexp = new RegExp(pattern.split('').join('.*?'), 'i')

	return string => regexp.test(string)
}





/*
	scoreQueryMatch :: string  xstring -> number

	given a query and a text string, calculate how well the query matches the string
	in the interval [0, 1)

*/

var scoreTextMatch = (query, matchesPattern, text) => {

	return matchesPattern(text)
		? query.length / text.length * alignQuality(align(query, text))
		: 0

}





/*
	scoreBookmarks :: {string} -> undefined

	add the scores for the current query to the bookmark cache.
*/

var scoreBookmarks = ({query}) => {

	var cacheRef = ENGRAM.cache

	Object.keys(cacheRef).forEach(key => {

		var scoresRef = cacheRef[key].metadata.scores

		scoresRef[query] = is.number(scoresRef[query])
			? scoresRef[query]
			: scoreTextMatch(query, isSplitSubstring(query), cacheRef[key].bookmark.title)

	})

	ENGRAM.eventBus.publish(':rescore', {})

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





ENGRAM.eventBus.subscribe(':update-query', scoreBookmarks)






ENGRAM.eventBus.subscribe(':rescore', _ => {

	ENGRAM.inFocus = selectBookmarks(ENGRAM.QUERY)

	ENGRAM.eventBus.publish(':change-focus', {
		focus: ENGRAM.inFocus
	})

})





// -- todo fix loading!!
var renderBookmark = ( ) => {  }

$.get('/public/html/bookmark-template.html', function (template) {

	renderBookmark = bookmark => Mustache.render(template, bookmark)

})





// -- todo only redraw when needed.

var drawFocus = ({focus}) => {

	$('#bookmark-container').html(
		focus
		.slice(ENGRAM.loadedIndex, ENGRAM.PERSCROLL)
		.map(
			({bookmark, _}) => renderBookmark(bookmark))
		.reduce(
			(html0, html1) => html0 + html1, '')
	)

}


ENGRAM.eventBus.subscribe(':change-focus', drawFocus)





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





{

	let requestChunk = (maxID) => {

		requestChunk.precond(maxID)

		$.ajax({
			url: `/api/bookmarks?max_id=${maxID}&amount=${ENGRAM.PERREQUEST}`,
			dataType: 'json',
			success: ({data, next_id}) => {

				data.forEach(bookmark => {
					ENGRAM.eventBus.publish(':load-bookmark', bookmark)
				})

				next_id >= 0
					? console.log('loaded all bookmarks.')
					: setTimeout(requestChunk, ENGRAM.loadInterval, next_id)

			},
			failure: res => {
				console.log('internal failure: bookmark chunk failed to load.')
			}

		})

	}

	requestChunk.precond = maxID => {

		is.always.number(maxID, maxID => {
			`requestChunk: maxID was not a number (actual value: ${ JSON.stringify(maxID) })`
		})

	}





	ENGRAM.syncBookmarks = ( ) => {

		console.log('loading.')

		requestChunk(ENGRAM.BIGINT)
	}

}








ENGRAM.syncBookmarks( )
