
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






ENGRAM.eventBus.subscribe(':rescore', _ => {

	ENGRAM.inFocus = selectBookmarks(ENGRAM.QUERY)

	ENGRAM.eventBus.publish(':change-focus', {
		focus: ENGRAM.inFocus
	})

})





$.get('/public/html/bookmark-template.html', function (template) {

	var renderBookmark = bookmark => Mustache.render(template, bookmark)

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

})
