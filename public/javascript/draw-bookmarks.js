





const viewingBottom = function () {
	return document.documentElement.clientHeight + $(document).scrollTop() >= document.body.offsetHeight
}



$.get('/public/html/bookmark-template.html', function (template) {

	const renderBookmark = function (bookmark) {
		return Mustache.render(template, bookmark)
	}

	// what is cache.maxID === -1 (no update) ?
	const appendBookmarks = function (maxID) {

		if (viewingBottom()) {

			const chunk = cache.fetchChunk(maxID, 100)
			chunk.data.map(function (bookmark) {

				$('#content').append(renderBookmark(bookmark))
				$(document).off('scroll')
				$(document).on('scroll', appendBookmarks.bind(null, chunk.nextID))

			})

		}

	}





	appendBookmarks(cache.maxID)
	$(document).on('scroll', appendBookmarks.bind(null, cache.maxID))

})
