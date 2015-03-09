




ENGRAM.eventBus.subscribe(':rescore', _ => {

	ENGRAM.inFocus = selectBookmarks(ENGRAM.QUERY)

	ENGRAM.eventBus.publish(':change-focus', {
		focus: ENGRAM.inFocus
	})

})





$.get('/public/html/bookmark-template.html', function (template) {

	renderBookmark = bookmark => Mustache.render(template, bookmark)

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
