"use strict"

$(document).on('click', '.delete-bookmark', function ( ) {

	var $button  = $(this)

	var $article = $button.closest('article')
	var id       = parseInt($article.attr('id'), 10)

	ENGRAM.eventBus.publish(':delete-bookmark', {id, $button})

})






ENGRAM.eventBus.subscribe(':delete-bookmark', ({id, $button}) => {

	var $article = $button.closest('article')

	$article.hide(ENGRAM.DELETEFADE)

	var publishDeletion = topic => {
		ENGRAM.eventBus.publish(topic, {id, $article})
	}

	$.ajax({
		url: `/bookmarks/${id}`,
		type: 'DELETE',
		success: publishDeletion(':successful-delete'),
		failure: publishDeletion(':failed-delete')
	})

})



ENGRAM.eventBus.subscribe(':successful-delete', ({id, _}) => {
	// -- delete from the cache.
})

ENGRAM.eventBus.subscribe(':successful-delete', ({_, $article}) => {
	$article.remove( )
})

ENGRAM.eventBus.subscribe(':failed-delete', ({id, $article}) => {

	alert(`failed to remove bookmark #${id}`)
	$article.show( )

})
