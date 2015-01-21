
/*
	viewingBottom :: undefined -> number

	is the user scrolled to the bottom of the page?
*/

const viewingBottom = function () {
	return document.documentElement.clientHeight + $(document).scrollTop() >= document.body.offsetHeight
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

		if (viewingBottom()) {

			const chunk = cache.fetchChunk(maxID, ENGRAM.PERSCROLL)
			chunk.data.map(function (bookmark) {

				$('#content').append(renderBookmark(bookmark))

				// rebind scroll handler.
				$(document).off('scroll')
				$(document).on('scroll', appendBookmarks.bind(null, chunk.nextID))

			})

		}

	}





	appendBookmarks(cache.maxID)

})
