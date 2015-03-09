

/*
	deleteBookmark :: undefined -> undefined

	delete the bookmark holding the delete button passed in.

*/

ENGRAM.deleteBookmark = function (button) {

	const $article = $(button).closest('article')
	const id       = parseInt($article.attr('id'), 10)

	if (!is.number(id) || id < 0) {
		throw TypeError('deleteBookmark: article did not contain a valid id (' + id + ')')
	}

	$article.hide(ENGRAM.DELETEFADE)

	$.ajax({
		url: '/bookmarks/' + id,
		type: 'DELETE',
		success: function () {
			$article.remove()
		},
		failure: function () {

			alert('failed to remove bookmark #' + id + '!')
			$article.show()

		}
	})

}



$(document).on('click', '.delete-bookmark', function () {
	ENGRAM.deleteBookmark(this)
})
