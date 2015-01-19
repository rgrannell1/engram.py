

$('.delete-bookmark').click(function () {

	const $article = $(this).closest('article')
	const id       = $(this).closest('article').attr('id')

	$article.hide()

	$.ajax({
		url: '/bookmarks/' + id,
		type: 'DELETE',
		success: function () {

			$article.remove()

		},
		failure: function () {

			alert('oh dear. delete failed.')
			$article.show()

		}
	})

})
