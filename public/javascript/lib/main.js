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

var isRoomLeft = function () {
	return $("#bookmarks article").length < 5 * ENGRAM.PERSCROLL;
};

ENGRAM.eventBus.subscribe(":atTop", function (_ref) {
	var windowTop = _ref.windowTop;
	var scrollHeight = _ref.scrollHeight;
	var scrollPosition = _ref.scrollPosition;

	if (!isRoomLeft()) {}

	console.log("getting top");
}).subscribe(":atBottom", function (_ref) {
	var windowTop = _ref.windowTop;
	var scrollHeight = _ref.scrollHeight;
	var scrollPosition = _ref.scrollPosition;

	if (!isRoomLeft()) {}

	console.log("getting end");
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

ENGRAM.syncBookmarks();
