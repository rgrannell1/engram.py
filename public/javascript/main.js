
{

	let eventCode = {
		'escape':    27,
		'backspace': 8
	}

	let isTypeable = event => {
		return (
			(event.keyCode >= 41 && event.keyCode < 122) ||
			(event.keyCode == 32 || event.keyCode > 186)) &&
			event.key.length === 1
	}





	$(window).keydown(event => {

		var keyCode = event.keyCode

		if (event.keyCode === eventCode.escape) {
			ENGRAM.eventBus.publish(':press-escape')
		} else if (event.keyCode === eventCode.backspace) {
			ENGRAM.eventBus.publish(':press-backspace')
		} else {

			if (isTypeable(event) && !event.ctrlKey && !event.altKey) {

				ENGRAM.eventBus.publish(':press-typeable', {
					key: event.key
				})

			}

		}

	})

}










$(document).on('click', '.delete-bookmark', function ( ) {

	var $button  = this

	var $article = $(button).closest('article')
	var id       = parseInt($article.attr('id'), 10)

	ENGRAM.eventBus.publish(':delete-bookmark', {id})

})






ENGRAM.eventBus.subscribe(':delete-bookmark', deleteBookmark)
ENGRAM.eventBus.subscribe(':update-query', scoreBookmarks)
