
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

		if (!is.object(chunk)) {
			throw TypeError('chunk must be an object')
		}

		if (!is.number(chunk.maxID)) {
			throw TypeError('chunk.maxID must be a number')
		}

		if (!is.number(chunk.nextID)) {
			throw TypeError('chunk.nextID must be a number')
		}

		if (!is.function(renderer)) {
			throw TypeError('renderer must be an object.')
		}





		return $('<div></div>', {
			'id':          chunk.maxID,
			'data-nextID': chunk.nextID,
			'class':       'viewgroup'
		})
		.append(chunk.data.map(renderer).join(''))

	}





	return function (cache, maxID, template) {

		if (!is.object(cache)) {
			throw TypeError('cache must be an object.')
		}

		if (!is.number(maxID)) {
			throw TypeError('maxID must be a number.')
		}

		if (!is.string(template)) {
			throw TypeError('template must be a string.')
		}





		const chunk = cache.fetchChunk(maxID, ENGRAM.PERSCROLL)

		return $('#content').append( viewgroup(chunk, function (bookmark) {
			return Mustache.render(template, bookmark)
		}) )

	}

} )()





const loadScroll = function (cache, template) {

	if (!is.object(cache)) {
		throw TypeError('cache must be an object.')
	}

	if (!is.string(template)) {
		throw TypeError('template must be a string.')
	}





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
