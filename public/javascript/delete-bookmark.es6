
$(document).on('click', '.delete-bookmark', function ( ) {

	var $button  = $(this)

	var $article = $button.closest('article')
	var id       = parseInt($article.attr('id'), 10)

	ENGRAM.eventBus.publish(':delete-bookmark', {id, $button})

})






ENGRAM.eventBus.subscribe(':delete-bookmark', ({id, $button}) => {

	var $article = $button.closest('article')

	$article.hide(ENGRAM.DELETEFADE)

	$.ajax({
		url: `/bookmarks/${id}`,
		type: 'DELETE',
		success: ( ) => {
			ENGRAM.eventBus.publish(':successful-delete', {id, $article})
		},
		failure: ( ) => {
			ENGRAM.eventBus.publish(':failed-delete', {id, $article})
		}
	})

})





ENGRAM.eventBus.subscribe(':successful-delete', ({_, $article}) => {
	$article.remove( )
})

ENGRAM.eventBus.subscribe(':failed-delete', ({id, $article}) => {

	alert(`failed to remove bookmark #${id}`)
	$article.show( )

})
