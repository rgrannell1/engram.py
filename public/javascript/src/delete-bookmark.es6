"use strict"





ENGRAM.eventBus
.on(':delete-bookmark', ({id, $button}) => {

	var $article = $button.closest('article')

	$article.hide(ENGRAM.DELETEFADE)

	$.ajax({
		url: `/bookmarks/${id}`,
		type: 'DELETE',
		success: data => {
			ENGRAM.eventBus.fire(':successful-delete', {id, $article})
		},
		error: () => {
			ENGRAM.eventBus.fire(':failed-delete', {id, $article})
		}
	})

})
.on(':successful-delete', ({id, _}) => {
	cache.remove(id)
})
.on(':successful-delete', ({_, $article}) => {
	$article.remove( )
})
.on(':failed-delete', ({id, $article}) => {

	alert(`failed to remove bookmark #${id}`)
	$article.show( )

})
