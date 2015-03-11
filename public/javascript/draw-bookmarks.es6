"use strict"

var selectBookmarks = query => {

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






ENGRAM.eventBus.subscribe(':rescore', _ => {

	ENGRAM.inFocus = selectBookmarks(getQuery( ))

	ENGRAM.eventBus.publish(':change-focus', {
		focus: ENGRAM.inFocus
	})

})


// start of reference as a no-op.
ENGRAM.drawFocus = function ( ) { }

$.get('/public/html/bookmark-template.html', function (template) {

	var renderBookmark = bookmark => Mustache.render(template, bookmark)

	ENGRAM.drawFocus = ({focus}) => {

		$('#bookmark-container').html(
			focus
			.slice(ENGRAM.loadedIndex, ENGRAM.PERSCROLL)
			.map(
				({bookmark, _}) => renderBookmark(bookmark))
			.reduce(
				(html0, html1) => html0 + html1, '')
		)

		ENGRAM.updateTimes( )

	}





	ENGRAM.eventBus.subscribe(':change-focus', ENGRAM.drawFocus)

})
