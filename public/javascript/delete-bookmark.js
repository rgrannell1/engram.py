"use strict";

ENGRAM.eventBus.subscribe(":delete-bookmark", function (_ref) {
	var id = _ref.id;
	var $button = _ref.$button;

	var $article = $button.closest("article");

	$article.hide(ENGRAM.DELETEFADE);

	var publishDeletion = function (topic) {
		ENGRAM.eventBus.publish(topic, { id: id, $article: $article });
	};

	$.ajax({
		url: "/bookmarks/" + id,
		type: "DELETE",
		success: publishDeletion(":successful-delete"),
		failure: publishDeletion(":failed-delete")
	});
}).subscribe(":successful-delete", function (_ref) {
	var id = _ref.id;
	var _ = _ref._;
}).subscribe(":successful-delete", function (_ref) {
	var _ = _ref._;
	var $article = _ref.$article;

	$article.remove();
}).subscribe(":failed-delete", function (_ref) {
	var id = _ref.id;
	var $article = _ref.$article;

	alert("failed to remove bookmark #" + id);
	$article.show();
});

// -- delete from the cache.
