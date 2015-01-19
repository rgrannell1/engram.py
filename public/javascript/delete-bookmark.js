

$('.delete-bookmark').click(function () {

	const id = $(this).closest('article').attr('id')

	$.ajax({
		url: '/bookmarks/' + id,
		type: 'DELETE',
		success: function () {
			alert('sent.')
		},
		failure: function () {
			alert('failed.')
		}
	})

})
