

$('.delete-bookmark').click(function () {

	const $article = $(this).closest('article')
	const id       = $(this).closest('article').attr('id')

	$.ajax({
		url: '/bookmarks/' + id,
		type: 'DELETE',
		success: function () {
			$article.remove()
		},
		failure: function () {
			alert('failed.')
		}
	})

})
