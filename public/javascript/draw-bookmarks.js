
/*
	getMaxID

	get the largest bookmark id currently loaded on the DOM.
*/

const getMaxID = function () {

	const maxID = $('#content article:last').attr('id')

	if (is.undefined(maxID) ) {
		return ENGRAM.BIGINT
	} else {
		return parseInt(maxID, 10)
	}

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
			'id':    chunk.maxID,
			'class': 'viewgroup'
		})
		.append(chunk.data.map(renderer).join(''))

	}





	return function (maxID, template) {

		const chunk = ENGRAM.cache.fetchChunk(maxID, ENGRAM.PERSCROLL)

		return $('#content').append( viewgroup(chunk, function (bookmark) {
			return Mustache.render(template, bookmark)
		}) )

	}

} )()





$.get('/public/html/bookmark-template.html', function (template) {

	appendChunk(ENGRAM.BIGINT, template)

	$(window).on('scroll', function () {

		window.requestAnimationFrame(function () {

			const scrollHeight   = $(document).height()
			const scrollPosition = $(window).height() + $(window).scrollTop()

			if ((scrollHeight - scrollPosition) < ENGRAM.LOADOFFSET) {
				appendChunk(getMaxID(), template)
			}

		})

	})

})





