
var deleteBookmark = ({id}) => {

	const $article = $(button).find(id).closest('article')

	$article.hide(ENGRAM.DELETEFADE)

	$.ajax({
		url: `/bookmarks/${id}`,
		type: 'DELETE',
		success: $article.remove,
		failure: ( ) => {

			alert(`failed to remove bookmark #${id}`)
			$article.show( )

		}
	})

}
