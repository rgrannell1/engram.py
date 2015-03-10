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

ENGRAM.eventBus.subscribe(":update-query", function (_ref) {
	var query = _ref.query;

	query.length === 0 ? history.pushState(null, "", "/bookmarks") : history.pushState(null, "", "/bookmarks?q=" + query);
});

// -- update the search state.

ENGRAM.eventBus.subscribe(":update-query", function (_ref) {
	var query = _ref.query;

	searchState.previous = searchState.current;
	searchState.current = query;
});

ENGRAM.eventBus.subscribe(":update-query", scoreBookmarks);

// -- populate the cache with all loaded bookmarks.

ENGRAM.eventBus.subscribe(":load-bookmark", function (bookmark) {

	var query = getQueryParam("q");

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
