"use strict";

ENGRAM.eventBus.on(":delete-bookmark", function (_ref) {
	var id = _ref.id;
	var $button = _ref.$button;

	var $article = $button.closest("article");

	$article.hide(ENGRAM.DELETEFADE);

	$.ajax({
		url: "/bookmarks/" + id,
		type: "DELETE",
		success: function (data) {
			ENGRAM.eventBus.fire(":successful-delete", { id: id, $article: $article });
		},
		error: function () {
			ENGRAM.eventBus.fire(":failed-delete", { id: id, $article: $article });
		}
	});
}).on(":successful-delete", function (_ref) {
	var id = _ref.id;
	var _ = _ref._;

	cache.remove(id);
}).on(":successful-delete", function (_ref) {
	var _ = _ref._;
	var $article = _ref.$article;

	$article.remove();
}).on(":failed-delete", function (_ref) {
	var id = _ref.id;
	var $article = _ref.$article;

	alert("failed to remove bookmark #" + id);
	$article.show();
});
