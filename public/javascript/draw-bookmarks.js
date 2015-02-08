
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
	createViewGroup

	create a viewgroup <div> element and
	add a maxID giving the id of the largest element
	contained within it upon creation.

*/





const createViewGroup = function (chunk, renderer) {

	const $viewgroup = $('<div></div>', {
		'id':    chunk.maxID,
		'class': 'viewgroup'
	})

	return $viewgroup.append(chunk.data.map(renderer).join(''))

}




/*
	attachFirstChunk

	load some initial bookmarks.

*/

const appendFirstChunk = function (template) {

	const chunk = ENGRAM.cache.fetchChunk(ENGRAM.BIGINT, 100)

	$viewgroup = createViewGroup(chunk, function (bookmark) {
		return Mustache.render(template, bookmark)
	})

	$('#content').append($viewgroup)

}





$.get('/public/html/bookmark-template.html', appendFirstChunk)
