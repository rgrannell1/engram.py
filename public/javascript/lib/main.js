"use strict";

var _defineProperty = function (obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); };

{
	(function () {

		var eventCode = {
			escape: 27,
			backspace: 8
		};

		var isTypeable = function (event) {

			return (event.keyCode >= 41 && event.keyCode < 122 || (event.keyCode == 32 || event.keyCode > 186)) && event.key.length === 1;
		};

		// -- publish keystrokes.

		$(window).keydown(function (event) {

			var keyCode = event.keyCode;

			if (event.keyCode === eventCode.escape) {
				ENGRAM.eventBus.publish(":press-escape");
			} else if (event.keyCode === eventCode.backspace) {
				ENGRAM.eventBus.publish(":press-backspace");
			} else {

				if (isTypeable(event) && !event.ctrlKey && !event.altKey) {

					ENGRAM.eventBus.publish(":press-typeable", {
						key: event.key
					});
				}
			}
		});
	})();
}

// -- trigger a delete event on delete-button click.

$(document).on("click", ".delete-bookmark", function () {

	var $button = $(this);

	var $article = $button.closest("article");
	var id = parseInt($article.attr("id"), 10);

	ENGRAM.eventBus.publish(":delete-bookmark", { id: id, $button: $button });
});

// -- publish data about scroll position.

$(window).on("scroll", function () {

	var $window = $(window);
	var windowTop = $window.scrollTop();

	ENGRAM.eventBus.publish(":scroll", {

		windowTop: windowTop,
		scrollHeight: $(document).height(),
		scrollPosition: $window.height() + windowTop

	});
});

// -- test if we are at the boundaries of the page.

ENGRAM.eventBus.subscribe(":scroll", function detectEdge(_ref) {
	var windowTop = _ref.windowTop;
	var scrollHeight = _ref.scrollHeight;
	var scrollPosition = _ref.scrollPosition;

	if (scrollHeight - scrollPosition < ENGRAM.LOADOFFSET) {
		// what data should these publish ?

		ENGRAM.eventBus.publish(":atBottom", { windowTop: windowTop, scrollHeight: scrollHeight, scrollPosition: scrollPosition });
	} else if (windowTop < ENGRAM.LOADOFFSET) {
		// what data should these publish ?

		ENGRAM.eventBus.publish(":atTop", { windowTop: windowTop, scrollHeight: scrollHeight, scrollPosition: scrollPosition });
	}
});

ENGRAM.eventBus.subscribe(":atBottom", function (_ref) {
	var windowTop = _ref.windowTop;
	var scrollHeight = _ref.scrollHeight;
	var scrollPosition = _ref.scrollPosition;

	if (getQuery() === "") {

		ENGRAM.eventBus.publish(":scrolldown-bookmarks", {
			from: $("#bookmarks article:last").attr("id"),
			isDecreasing: true
		});
	}
}).subscribe(":update-query", function (_ref) {
	var query = _ref.query;

	ENGRAM.searchState.setQuery(query);
}).subscribe(":update-query", scoreBookmarks).subscribe(":load-bookmark", function (bookmark) {

	var query = getQuery();

	is.always.object(bookmark);
	is.always.number(bookmark.bookmark_id);

	ENGRAM.cache.set(bookmark.bookmark_id, {
		bookmark: bookmark,
		metadata: {
			scores: query.length === 0 ? {} : _defineProperty({}, query, scoreTextMatch(query, isSplitSubstring(query), bookmark.title))
		}
	});

	ENGRAM.eventBus.publish(":rescore");
});

var listBookmarks = function (from, isDecreasing) {

	listBookmarks.precond(from, isDecreasing);

	console.log(Object.keys(ENGRAM.cache));

	return Object.keys(ENGRAM.cache).map(function (key) {
		return parseInt(key, 10);
	}).filter(function (id) {
		return isDecreasing ? key < from : key > from;
	}).sort(function (num0, num1) {
		return num1 - num0;
	}) // -- this is slow if object imp. isn't ordered.
	.slice(0, ENGRAM.PERSCROLL).map(function (key) {
		return ENGRAM.cache[key];
	});
};

listBookmarks.precond = function (from, isDecreasing) {

	is.always.number(from);
	is.always.boolean(isDecreasing);
};

var loadDownwards = function (_ref) {
	var from = _ref.from;
	var isDecreasing = _ref.isDecreasing;

	// -- set the current focus to the current [more-bookmarks] + focus,
	// -- or focus + [more-bookmarks]. Then truncate, and redraw.

	var loaded = listBookmarks(from, isDecreasing);

	ENGRAM.inFocus.setFocus(isDecreasing ? {
		value: ENGRAM.inFocus.value.concat(loaded).slice(0, +ENGRAM.MAXLOADED),
		currentQuery: ""
	} : {
		value: loaded.concat(ENGRAM.inFocus.value).slice(-ENGRAM.MAXLOADED),
		currentQuery: ""
	});
};

$(function () {

	var loaded = listBookmarks(ENGRAM.BIGINT, true);
});

$(function () {

	loadDownwards({
		from: ENGRAM.BIGINT,
		isDecreasing: true
	});
});

ENGRAM.eventBus.subscribe(":scrolldown-bookmarks", loadDownwards);

ENGRAM.syncBookmarks();
