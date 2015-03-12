"use strict";

// -- remove this if I find an objective reason
// -- this is bad.

ENGRAM.drawFocus = function () {

	setTimeout(function () {
		return ENGRAM.drawFocus(ENGRAM.inFocus);
	}, 100);
};

$.get("/public/html/bookmark-template.html", function (template) {

	var renderBookmark = function (bookmark) {
		return Mustache.render(template, bookmark);
	};

	ENGRAM.drawFocus = function (focus) {

		ENGRAM.drawFocus.precond(focus);

		$("#bookmark-container").html(focus.value.map(function (_ref) {
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
});

ENGRAM.eventBus.subscribe(":update-focus", ENGRAM.drawFocus);
