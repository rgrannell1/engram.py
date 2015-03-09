"use strict";

var deleteBookmark = function (_ref) {
	var id = _ref.id;

	var $article = $(button).find(id).closest("article");

	$article.hide(ENGRAM.DELETEFADE);

	$.ajax({
		url: "/bookmarks/" + id,
		type: "DELETE",
		success: $article.remove,
		failure: function () {

			alert("failed to remove bookmark #" + id);
			$article.show();
		}
	});
};
