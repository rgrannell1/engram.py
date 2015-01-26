
/*
	viewingBottom :: undefined -> number

	is the user scrolled to the bottom of the page?
*/

ENGRAM.viewingBottom = function (offset) {

	if (is.undefined(offset)) {
		offset = 0
	} else if (!is.number(offset)) {
		throw TypeError('viewingBottom:' + JSON.stringify(offset) + ' was not a number.')
	}

	return document.documentElement.clientHeight + $(document).scrollTop() - offset >= document.body.offsetHeight

}





$.get('/public/html/bookmark-template.html', function (template) {

	if (!is.string(template)) {
		throw TypeError('template loading failed (loaded a non-string value)')
	}





	const nudge = function () {
		$(window).scrollTop($(window).scrollTop() + 1)
	}

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

		THIS IS TERRIBLE, TERRIBLE CODE.
	*/

	const appendBookmarks = function (maxID) {

		if (!is.number(maxID)) {
			throw TypeError('appendBookmarks: ' + maxID + ' was not a number.')
		}

		if (ENGRAM.viewingBottom(ENGRAM.LOADOFFSET)) {

			const chunk     = ENGRAM.cache.fetchChunk(maxID, ENGRAM.PERSCROLL)

			const viewgroup = $('<div></div>', {
				'id':    maxID,
				'class': 'viewgroup'
			})

			const innerHTML = chunk.data
				.map(function (bookmark) {
					return renderBookmark(bookmark)
				})
				.reduce(function (text, current) {
					return text + current
				}, '')

			$(viewgroup).append(innerHTML)
			$('#content').append(viewgroup)

			// rebind scroll handler.
			$(document).off('scroll')
			$(document).on( 'scroll', appendBookmarks.bind(null, chunk.nextID) )
			$(document).on( 'scroll', ENGRAM.updateTimers.bind(null, $('.viewgroup')) )

			nudge() // this sucks; an awful way of triggering this code.








		}
	}



	appendBookmarks(ENGRAM.cache.maxID)

})
