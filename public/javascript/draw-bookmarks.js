

/*
	maxID

	get the largest ID (ignoring deletions) of any viewgroup.
*/

const maxID = function () {
	return parseInt($('.viewgroup:first').attr('id'), 10)
}





/*
	nextID

	get the next ID to load from.
*/

const nextID = function () {
	return parseInt($('.viewgroup:last').attr('data-nextID'), 10)
}





/*
	attachChunk

	load some initial bookmarks.

*/

const attachChunk = ( function () {

	/*
		viewgroup

		create a viewgroup <div> element and
		add a maxID giving the id of the largest element
		contained within it upon creation.

	*/

	const viewgroup = function (chunk, renderer) {

		is.always.object(chunk)
		is.always.number(chunk.maxID)
		is.always.number(chunk.nextID)
		is.always.function(renderer)

		return $('<div></div>', {
			'id':          chunk.maxID,
			'data-nextID': chunk.nextID,
			'class':       'viewgroup'
		})
		.append(chunk.data.map(renderer).join(''))

	}





	const append = function (cache, maxID, template) {

		is.always.object(cache)
		is.always.number(maxID)
		is.always.string(template)

		const chunk = cache.fetchNextChunk(maxID, ENGRAM.PERSCROLL)

		if (maxID > 0 && (chunk.data.length) > 0) {
			return $('#content').append( viewgroup(chunk, function (bookmark) {
				return Mustache.render(template, bookmark)
			}) )
		} else {
			return $('#content')
		}

	}





	const prepend = function (cache, minID, template) {

		is.always.object(cache)
		is.always.number(minID)
		is.always.string(template)

		const chunk = cache.fetchPrevChunk(minID, ENGRAM.PERSCROLL)

		if (minID > 0 && (chunk.data.length) > 0) {
			return $('#content').prepend( viewgroup(chunk, function (bookmark) {
				return Mustache.render(template, bookmark)
			}) )
		} else {
			return $('#content')
		}

	}






	return {
		prepend: prepend,
		append:  append
	}

} )()




/*
	loadScroll :: Cache x string


*/

const loadScroll = ( function () {

	/*
		loadUp :: Cache x string

		unload an old chunk at the bottom, load a new one at the top.

	*/

	const loadUp = function (cache, template) {

		attachChunk.prepend(cache, maxID(), template)

		if ($('.viewgroup').length >= 5) {
			$('.viewgroup:last').remove()
		}

		$(document).scrollTop($('.viewgroup:first').offset().bottom)

	}





	/*
		loadDown :: Cache x string

		unload an old chunk at the top, load a new one at the bottom.

	*/

	const loadDown = function (cache, template) {

		attachChunk.append(cache, nextID(), template)

		if ($('.viewgroup').length >= 5) {
			$('.viewgroup:first').remove()
		}

		$(document).scrollTop($('.viewgroup:last').offset().top)

	}





	return function (cache, template) {

		is.always.object(cache)
		is.always.string(template)

		$(window).on('scroll', function () {
			window.requestAnimationFrame(function () {

				const windowTop      = $(window).scrollTop()
				const scrollHeight   = $(document).height()
				const scrollPosition = $(window).height() + windowTop

				if ((scrollHeight - scrollPosition) < ENGRAM.LOADOFFSET) {
					loadDown(cache, template)
				} else if (windowTop < 50) {
					loadUp(cache, template)
				}

			})
		})

	}

} )()
