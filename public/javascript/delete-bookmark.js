

/*
	deleteBookmark :: undefined -> undefined

	delete the bookmark holding the delete button bound to 'this'.

*/

ENGRAM.deleteBookmark = function () {

	const $article = $(this).closest('article')
	const id       = $(this).closest('article').attr('id')

	$article.hide(ENGRAM.DELETEFADE)

	$.ajax({
		url: '/bookmarks/' + id,
		type: 'DELETE',
		success: function () {
			$article.remove()
		},
		failure: function () {

			alert('attempt to delete ' + id + ' failed!')
			$article.show()

		}
	})

}



$(document).on('click', '.delete-bookmark', ENGRAM.deleteBookmark)
