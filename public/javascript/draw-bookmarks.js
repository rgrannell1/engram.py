

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





	const concat = function (fetchMethod, attachMethod) {
		return function (cache, id, template) {

			is.always.object(cache)
			is.always.number(id)
			is.always.string(template)

			const $container = $('#bookmark-container')
			const chunk      = cache[fetchMethod](id, ENGRAM.PERSCROLL)

			if (id > 0 && (chunk.data.length) > 0) {

				$container[attachMethod]( viewgroup(chunk, function (bookmark) {
					return Mustache.render(template, bookmark)
				}) )

				$container.find('time').each(function () {
					showTime($(this))
				})

			}

			return $container

		}
	}

	const append  = concat('fetchNextChunk', 'append')
	const prepend = concat('fetchPrevChunk', 'prepend')

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

		$viewgroup = $('.viewgroup')

		if ($viewgroup.length >= 5) {

			$viewgroup.last().remove()
			$elem = $viewgroup.find('article').first()

			if ($elem.length > 0) {
				$(document).scrollTop($elem.position().top + $elem.height())
			}

		}

	}





	/*
		loadDown :: Cache x string

		unload an old chunk at the top, load a new one at the bottom.

	*/

	const loadDown = function (cache, template) {

		attachChunk.append(cache, nextID(), template)

		$viewgroup = $('.viewgroup')

		if ($viewgroup.length >= 5) {
			$viewgroup.first().remove()
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
