"use strict";

var selectBookmarks = function (query) {

	selectBookmarks.precond(query);

	var cacheArray = Object.keys(ENGRAM.cache).map(function (key) {
		return ENGRAM.cache[key];
	});

	return query === "" ? cacheArray : cacheArray.filter(function (bookmark) {
		return bookmark.metadata.scores[query] > 0.05;
	}).sort(function (bookmark0, bookmark1) {
		bookmark0.metadata.scores[query] - bookmark1.metadata.scores[query];
	});
};

selectBookmarks.precond = function (query) {
	is.always.string(query);
};

ENGRAM.eventBus.subscribe(":rescore", function (_) {

	ENGRAM.inFocus.setFocus({
		value: selectBookmarks(getQuery()),
		currentQuery: getQuery()
	});

	ENGRAM.eventBus.publish(":update-focus", ENGRAM.inFocus);
});

// -- to break out of the callback.
// -- this will be update to draw.

ENGRAM.drawFocus = function () {
	setTimeout(ENGRAM.drawFocus, 50);
};

$.get("/public/html/bookmark-template.html", function (template) {

	var renderBookmark = function (bookmark) {
		return Mustache.render(template, bookmark);
	};

	ENGRAM.drawFocus = function (focus) {

		ENGRAM.drawFocus.precond(focus);

		$("#bookmark-container").html(focus.value.slice(ENGRAM.loadedIndex, ENGRAM.PERSCROLL).map(function (_ref) {
			var bookmark = _ref.bookmark;
			var _ = _ref._;
			return renderBookmark(bookmark);
		}).reduce(function (html0, html1) {
			return html0 + html1;
		}, ""));
	};

	ENGRAM.drawFocus.precond = function (focus) {

		is.always.object(focus);
		is.always.array(focus.value);
		is.always.string(focus.currentQuery);
	};

	ENGRAM.eventBus.subscribe(":update-focus", ENGRAM.drawFocus);
});
