
const getMaxID = function () {

	const maxID = $('#content article:last').attr('id')

	if (is.undefined(maxID) ) {
		return ENGRAM.BIGINT
	} else {
		return parseInt(maxID, 10)
	}

}

const createViewGroup = function (maxID) {

	return $('<div></div>', {
		'id':    maxID,
		'class': 'viewgroup'
	})

}

const attachHiddenBookmarks = function (template) {

	const renderBookmark = function (bookmark) {
		return Mustache.render(template, bookmark)
	}

	const fillViewgroup = function(viewgroup, bookmarks) {

		$viewgroup = $(viewgroup).append(bookmarks.map(renderBookmark).join(''))

		$viewgroup.find('article').css('display', 'none')

		return $viewgroup

	}

	const appendChunk = function (maxID, amount) {

		if (maxID <= 0) {
			console.log('finished appending bookmarks.')
		} else {

			console.log('appending [' + maxID + ',' + (Math.max(maxID - amount, 0)) + ']')

			const chunk = ENGRAM.cache.fetchChunk(maxID, amount)

			$('#content').append( fillViewgroup(createViewGroup(chunk.maxID), chunk.data) )

			setTimeout(appendChunk.bind(null, chunk.nextID, amount), 75)
		}

	}

	appendChunk(getMaxID(), 125)

}

$.get('/public/html/bookmark-template.html', attachHiddenBookmarks)
