"use strict"

ENGRAM.eventBus
.subscribe(':delete-bookmark', ({id, $button}) => {

	var $article = $button.closest('article')

	$article.hide(ENGRAM.DELETEFADE)

	$.ajax({
		url: `/bookmarks/${id}`,
		type: 'DELETE',
		success: data => {
			ENGRAM.eventBus.publish(':successful-delete', {id, $article})
		},
		error: () => {
			ENGRAM.eventBus.publish(':failed-delete', {id, $article})
		}
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
