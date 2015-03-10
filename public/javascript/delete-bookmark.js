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

	var publishDeletion = function (topic) {
		ENGRAM.eventBus.publish(topic, { id: id, $article: $article });
	};

	$.ajax({
		url: "/bookmarks/" + id,
		type: "DELETE",
		success: publishDeletion(":successful-delete"),
		failure: publishDeletion(":failed-delete")
	});
});

ENGRAM.eventBus.subscribe(":successful-delete", function (_ref) {
	var id = _ref.id;
	var _ = _ref._;

	console.log(id);
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
