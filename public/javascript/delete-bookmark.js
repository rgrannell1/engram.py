"use strict";

$(document).on("click", ".delete-bookmark", function () {

	var $button = $(this);

	var $article = $button.closest("article");
	var id = parseInt($article.attr("id"), 10);

	ENGRAM.eventBus.publish(":delete-bookmark", { id: id, $button: $button });
});

ENGRAM.eventBus.subscribe(":delete-bookmark", function (_ref) {
	var id = _ref.id;
	var $button = _ref.$button;

	var $article = $button.closest("article");

	$article.hide(ENGRAM.DELETEFADE);

	$.ajax({
		url: "/bookmarks/" + id,
		type: "DELETE",
		success: function () {
			ENGRAM.eventBus.publish(":successful-delete", { id: id, $article: $article });
		},
		failure: function () {
			ENGRAM.eventBus.publish(":failed-delete", { id: id, $article: $article });
		}
	});
});

ENGRAM.eventBus.subscribe(":successful-delete", function (_ref) {
	var _ = _ref._;
	var $article = _ref.$article;

	$article.remove();
});

ENGRAM.eventBus.subscribe(":failed-delete", function (_ref) {
	var id = _ref.id;
	var $article = _ref.$article;

	alert("failed to remove bookmark #" + id);
	$article.show();
});
