"use strict";

var _defineProperty = function (obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); };

{
	var listDown;
	var listUp;

	(function () {

		var listNextById = function (downwards, from, amount) {

			listNextById.precond(downwards, from, amount);

			var filtered = Object.keys(ENGRAM.cache).map(function (key) {
				return parseInt(key, 10);
			}).filter(function (id) {
				return downwards ? id < from : id > from;
			}).sort(function (num0, num1) {
				return num1 - num0;
			}); // -- this is slow if object imp. isn't ordered.

			var sliced = downwards ? filtered.slice(0, amount) : filtered.slice(-amount);

			return sliced.map(function (key) {
				return ENGRAM.cache[key];
			});
		};

		listNextById.precond = function (downwards, from, amount) {

			is.always.boolean(downwards);
			is.always.number(from);
			is.always.number(amount);
		};

		listDown = listNextById.bind({}, true);
		listUp = listNextById.bind({}, false);
	})();
}

{

	var loadState = [new Date(0), new Date(0)];

	var loadList = function (downwards, from) {

		var lastLoadIth = downwards ? 0 : 1;

		var now = new Date();

		if (now - loadState[lastLoadIth] < 150) {
			return;
		} else {
			loadState[lastLoadIth] = now;
		}

		var loaded = (downwards ? listDown : listUp)(from, ENGRAM.PERSCROLL);

		ENGRAM.inFocus.setFocus({

			value: downwards ? ENGRAM.inFocus.value.concat(loaded).slice(-ENGRAM.MAXLOADED) : loaded.concat(ENGRAM.inFocus.value).slice(0, +ENGRAM.MAXLOADED),

			currentQuery: ""
		});

		var bookmark = downwards ? $("#bookmarks article").slice(-1)[0] : $("#bookmarks article").slice(0, 1)[0];

		var originalOffset = bookmark.getBoundingClientRect().top;
		var id = $(bookmark).attr("id");

		ENGRAM.eventBus.fire(":loaded-bookmarks", { originalOffset: originalOffset, id: id });
	};

	var loadListDown = loadList.bind({}, true);
	var loadListUp = loadList.bind({}, false);
}

var fillBookmarks = function () {

	var currentAmount = ENGRAM.inFocus.value.length;
	var stillUnloaded = getQuery() === "" && currentAmount !== ENGRAM.MAXLOADED;

	if (!stillUnloaded) {
		return;
	}

	var from = $("#bookmark-container article").length === 0 ? ENGRAM.BIGINT : parseInt($("#bookmark-container article:last").attr("id"), 10);

	var loaded = listDown(from, ENGRAM.MAXLOADED - currentAmount);

	if (loaded.length > 0) {

		ENGRAM.inFocus.setFocus({
			value: ENGRAM.inFocus.value.concat(loaded),
			currentQuery: ""
		});
	}
};

var triggerLoad = function (downwards) {

	var nextId = parseInt($("#bookmarks article")[downwards ? "last" : "first"]().attr("id")) + (downwards ? -1 : +1);

	if (getQuery() === "") {
		// -- load linearly by id up or down.

		var topic = ":scroll" + (downwards ? "down" : "up") + "-bookmarks";

		ENGRAM.eventBus.fire(topic, nextId);
	} else {}
};

ENGRAM.eventBus.on(":scroll", function detectEdge(_ref) {
	var windowTop = _ref.windowTop;
	var scrollHeight = _ref.scrollHeight;
	var scrollPosition = _ref.scrollPosition;

	if (scrollHeight - scrollPosition === 0) {
		ENGRAM.eventBus.fire(":atBottom", { windowTop: windowTop, scrollHeight: scrollHeight, scrollPosition: scrollPosition });
	} else if (windowTop === 0) {
		ENGRAM.eventBus.fire(":atTop", { windowTop: windowTop, scrollHeight: scrollHeight, scrollPosition: scrollPosition });
	}
}).on(":atBottom", function (_ref) {
	var windowTop = _ref.windowTop;
	var scrollHeight = _ref.scrollHeight;
	var scrollPosition = _ref.scrollPosition;

	triggerLoad(true);
}).on(":atTop", function (_ref) {
	var windowTop = _ref.windowTop;
	var scrollHeight = _ref.scrollHeight;
	var scrollPosition = _ref.scrollPosition;

	triggerLoad(false);
}).on(":update-query", function (_ref) {
	var query = _ref.query;

	ENGRAM.searchState.setQuery(query);
}).on(":update-query", scoreBookmarks).on(":load-bookmark", function (bookmark) {

	var query = getQuery();

	is.always.object(bookmark);
	is.always.number(bookmark.bookmark_id);

	ENGRAM.cache.set(bookmark.bookmark_id, {
		bookmark: bookmark,
		metadata: {
			scores: query.length === 0 ? {} : _defineProperty({}, query, scoreTextMatch(query, isSplitSubstring(query), bookmark.title))
		}
	});

	ENGRAM.eventBus.fire(":rescore");
}).on(":scrollup-bookmarks", loadListUp).on(":scrolldown-bookmarks", loadListDown).on(":loaded-bookmarks", function (_ref) {
	var originalOffset = _ref.originalOffset;
	var id = _ref.id;

	ENGRAM.eventBus.await(":redraw", function () {
		$(window).scrollTop($("#" + id).offset().top - originalOffset);
	});
});

setImmediateInterval(ENGRAM.updateTimes, 250);
setImmediateInterval(fillBookmarks, 250);

listeners.rebroadcastKeyEvents();
listeners.deleteBookmark();
listeners.onScroll();

ENGRAM.syncBookmarks();

// -- load upwards or downwards by search score.
