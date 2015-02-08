
const nextID = function () {
	return parseInt($('.viewgroup:last').attr('data-nextID'), 10)
}





/*
	appendChunk

	load some initial bookmarks.

*/

const appendChunk = ( function () {

	/*
		viewgroup

		create a viewgroup <div> element and
		add a maxID giving the id of the largest element
		contained within it upon creation.

	*/

	const viewgroup = function (chunk, renderer) {

		return $('<div></div>', {
			'id':          chunk.maxID,
			'data-nextID': chunk.nextID,
			'class':       'viewgroup'
		})
		.append(chunk.data.map(renderer).join(''))

	}





	return function (maxID, template) {

		const chunk = ENGRAM.cache.fetchChunk(maxID, ENGRAM.PERSCROLL)

		return $('#content').append( viewgroup(chunk, function (bookmark) {
			return Mustache.render(template, bookmark)

			// todo add unloading of old viewgroup dom elements.

		}) )

	}

} )()





const loadScroll = function (template) {

	$(window).on('scroll', function () {

		window.requestAnimationFrame(function () {

			const scrollHeight   = $(document).height()
			const scrollPosition = $(window).height() + $(window).scrollTop()

			if ((scrollHeight - scrollPosition) < ENGRAM.LOADOFFSET) {
				appendChunk(nextID(), template)
			}

		})

	})

}





$.get('/public/html/bookmark-template.html', function (template) {

	appendChunk(ENGRAM.BIGINT, template)

	loadScroll(template)

})






$('#search').keyup(function (event) {

	const current      = $(this).val()
	ENGRAM.searchState = updateSearchState(ENGRAM.searchState, current)

	setURI(current)

	if (current.length > 1) {

		const isMatch = isSplitSubstring(current)

		const matches = ENGRAM.cache
			.fetchChunk(ENGRAM.BIGINT, ENGRAM.BIGINT, function (bookmark) {
				return isMatch(bookmark.title)
			})

		const scored = matches.data.map(function (bookmark) {

			bookmark.metadata                      = bookmark.metadata                      || {queryScores: {}}
			bookmark.metadata.queryScores[current] = bookmark.metadata.queryScores[current] || scoreAlignment(current, bookmark.title)

			return bookmark

		})

		console.log( scored )

	}

	// if current search is substring of previous search
	// current elements are a pruning of previous elements.

})
