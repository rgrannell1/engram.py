
/*
	viewingBottom :: undefined -> number

	is the user scrolled to the bottom of the page?
*/

ENGRAM.viewingBottom = function (offset) {

	if (is.undefined(offset)) {
		offset = 0
	}

	return document.documentElement.clientHeight + $(document).scrollTop() - offset >= document.body.offsetHeight

}





$.get('/public/html/bookmark-template.html', function (template) {

	/*
		renderBookmark :: Bookmark -> string

		render the bookmark template with Mustache.
	*/

	const renderBookmark = function (bookmark) {
		return Mustache.render(template, bookmark)
	}





	/*
		appendBookmarks :: number -> undefined

		add bookmarks to the DOM.

		what is cache.maxID === -1 (no update) ?

	*/

	const appendBookmarks = function (maxID) {

		if (ENGRAM.viewingBottom(ENGRAM.LOADOFFSET)) {

			const chunk = ENGRAM.cache.fetchChunk(maxID, ENGRAM.PERSCROLL)
			chunk.data.map(function (bookmark) {

				const elem = $('<div></div>', {
					'id':    maxID,
					'class': 'viewgroup'
				})

				elem.append(renderBookmark(bookmark))

				$('#content').append(elem)

				// rebind scroll handler.
				$(document).off('scroll')
				$(document).on('scroll', appendBookmarks.bind(null, chunk.nextID))
				$(document).on('scroll', ENGRAM.updateTimers)

				$(window).scrollTop($(window).scrollTop() + 1); // this sucks.

			})
		}
	}



	appendBookmarks(ENGRAM.cache.maxID)

})
