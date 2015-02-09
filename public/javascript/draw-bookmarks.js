

const maxID = function () {
	return parseInt($('.viewgroup:first').attr('id'), 10)
}

/*
	nextID
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

		if (!is.object(chunk)) {
			throw TypeError('viewgroup: chunk must be an object')
		}

		if (!is.number(chunk.maxID)) {
			throw TypeError('viewgroup: chunk.maxID must be a number')
		}

		if (!is.number(chunk.nextID)) {
			throw TypeError('viewgroup: chunk.nextID must be a number')
		}

		if (!is.function(renderer)) {
			throw TypeError('viewgroup: renderer must be an object.')
		}





		return $('<div></div>', {
			'id':          chunk.maxID,
			'data-nextID': chunk.nextID,
			'class':       'viewgroup'
		})
		.append(chunk.data.map(renderer).join(''))

	}





	return function (method, cache, maxID, template) {

		if (!is.object(cache)) {
			throw TypeError('attachChunk: cache must be an object.')
		}

		if (!is.number(maxID)) {
			throw TypeError('attachChunk: maxID must be a number.')
		}

		if (!is.string(template)) {
			throw TypeError('attachChunk: template must be a string.')
		}




		// TODO STRING FLAGS ARE NOT GREAT.
		const chunk = method === 'append'
			? cache.fetchNextChunk(maxID, ENGRAM.PERSCROLL)
			: cache.fetchPrevChunk(maxID, ENGRAM.PERSCROLL)

		console.log(chunk)

		if (maxID > 0 && (chunk.data.length) > 0) {
			return $('#content')[method]( viewgroup(chunk, function (bookmark) {
				return Mustache.render(template, bookmark)
			}) )
		} else {
			return $('#content')
		}


	}

} )()










const appendChunk  = attachChunk.bind({}, 'append')
const prependChunk = attachChunk.bind({}, 'prepend')





/*
	loadScroll :: Cache x string


*/

const loadScroll = ( function () {

	/*
		loadUp :: Cache x string

		unload an old chunk, load a new one.

	*/

	const loadUp = function (cache, template) {

		prependChunk(cache, maxID(), template)

		if ($('.viewgroup').length >= 5) {

			$('.viewgroup:last').remove()
			$(document).scrollTop($('.viewgroup:first').offset().bottom)

		}

	}

	/*
		loadDown :: Cache x string

		unload an old chunk, load a new one.

	*/

	const loadDown = function (cache, template) {

		appendChunk(cache, nextID(), template)

		if ($('.viewgroup').length >= 5) {
			$('.viewgroup:first').remove()
		}

		$(document).scrollTop($('.viewgroup:last').offset().top)

	}





	// -- TODO scroll jack each time chunks are loaded.

	return function (cache, template) {

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
					loadDown(cache, template)
				}

				if ($(window).scrollTop() < 50) {
					loadUp(cache, template)
				}

			})
		})

	}

} )()
