"use strict"

var selectBookmarks = query => {

	selectBookmarks.precond(query)

	var cacheArray = Object.keys(ENGRAM.cache).map(key => ENGRAM.cache[key])

	return query === ''
		? cacheArray
		: cacheArray
			.filter(
				bookmark => bookmark.metadata.scores[query] > 0.05)
			.sort((bookmark0, bookmark1) => {
				bookmark0.metadata.scores[query] - bookmark1.metadata.scores[query]
			})

}

selectBookmarks.precond = query => {
	is.always.string(query)
}





ENGRAM.eventBus.subscribe(':rescore', _ => {

	ENGRAM.inFocus.setFocus({
		value:        selectBookmarks(getQuery( )),
		currentQuery: getQuery( )
	})

	ENGRAM.eventBus.publish(':update-focus', ENGRAM.inFocus)

})





// -- to break out of the callback.
// -- this will be update to draw.

ENGRAM.drawFocus = function ( ) {
	setTimeout(ENGRAM.drawFocus, 50)
}

$.get('/public/html/bookmark-template.html', function (template) {

	var renderBookmark = bookmark => Mustache.render(template, bookmark)

	ENGRAM.drawFocus = focus => {

		ENGRAM.drawFocus.precond(focus)

		$('#bookmark-container').html(
			focus.value
			.slice(ENGRAM.loadedIndex, ENGRAM.PERSCROLL)
			.map(
				({bookmark, _}) => renderBookmark(bookmark))
			.reduce(
				(html0, html1) => html0 + html1, '')
		)

	}

	ENGRAM.drawFocus.precond = focus => {

		is.always.object(focus)
		is.always.array(focus.value)
		is.always.string(focus.currentQuery)

	}





	ENGRAM.eventBus.subscribe(':update-focus', ENGRAM.drawFocus)

})
