"use strict";

":use strict";

// -- remove this if I find an objective reason
// -- this is bad.

ENGRAM.drawFocus = function () {

	setTimeout(function () {
		return ENGRAM.drawFocus(ENGRAM.inFocus);
	}, 100);
};

var prettifyDate = function (date) {

	var dateString = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
	var timeString = date.getHours() + ":" + date.getMinutes();

	return dateString + " " + timeString;
};

$.get("/public/html/bookmark-template.html", function (template) {

	var renderBookmark = function (bookmark) {

		bookmark.date = prettifyDate(new Date(1000 * bookmark.ctime));

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

		ENGRAM.eventBus.fire(":redraw", {});
	};

	ENGRAM.drawFocus.precond = function (focus) {

		is.always.object(focus);
		is.always.array(focus.value);
		is.always.string(focus.currentQuery);
	};
});

ENGRAM.eventBus.on(":update-focus", ENGRAM.drawFocus);
