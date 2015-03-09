"use strict";

var selectBookmarks = function (query) {

	var cacheArray = Object.keys(ENGRAM.cache).map(function (key) {
		return ENGRAM.cache[key];
	});

	return query === "" ? cacheArray : cacheArray.filter(function (bookmark) {
		return bookmark.metadata.scores[query] > 0.05;
	}).sort(function (bookmark0, bookmark1) {
		bookmark0.metadata.scores[query] - bookmark1.metadata.scores[query];
	});
};

ENGRAM.eventBus.subscribe(":rescore", function (_) {

	ENGRAM.inFocus = selectBookmarks(ENGRAM.QUERY);

	ENGRAM.eventBus.publish(":change-focus", {
		focus: ENGRAM.inFocus
	});
});

$.get("/public/html/bookmark-template.html", function (template) {

	var renderBookmark = function (bookmark) {
		return Mustache.render(template, bookmark);
	};

	var drawFocus = function (_ref) {
		var focus = _ref.focus;

		$("#bookmark-container").html(focus.slice(ENGRAM.loadedIndex, ENGRAM.PERSCROLL).map(function (_ref2) {
			var bookmark = _ref2.bookmark;
			var _ = _ref2._;
			return renderBookmark(bookmark);
		}).reduce(function (html0, html1) {
			return html0 + html1;
		}, ""));

		ENGRAM.updateTimes();
	};

	ENGRAM.eventBus.subscribe(":change-focus", drawFocus);
});
