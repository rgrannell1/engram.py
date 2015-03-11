"use strict"

ENGRAM.eventBus
.subscribe(':delete-bookmark', ({id, $button}) => {

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
.subscribe(':successful-delete', ({id, _}) => {
	// -- delete from the cache.
})
.subscribe(':successful-delete', ({_, $article}) => {
	$article.remove( )
})
.subscribe(':failed-delete', ({id, $article}) => {

	alert(`failed to remove bookmark #${id}`)
	$article.show( )

})
