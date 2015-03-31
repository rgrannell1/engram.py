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

	if (scrollHeight - scrollPosition === 0) {
		ENGRAM.eventBus.publish(":atBottom", { windowTop: windowTop, scrollHeight: scrollHeight, scrollPosition: scrollPosition });
	} else if (windowTop === 0) {
		ENGRAM.eventBus.publish(":atTop", { windowTop: windowTop, scrollHeight: scrollHeight, scrollPosition: scrollPosition });
	}
});

ENGRAM.eventBus.subscribe(":atBottom", function (_ref) {
	var windowTop = _ref.windowTop;
	var scrollHeight = _ref.scrollHeight;
	var scrollPosition = _ref.scrollPosition;

	if (getQuery() === "") {
		// -- load by ID.

		ENGRAM.eventBus.publish(":scrolldown-bookmarks", parseInt($("#bookmarks article:last").attr("id"), 10) - 1);
	} else {}
}).subscribe(":atTop", function (_ref) {
	var windowTop = _ref.windowTop;
	var scrollHeight = _ref.scrollHeight;
	var scrollPosition = _ref.scrollPosition;

	if (getQuery() === "") {
		// -- load by ID.

		ENGRAM.eventBus.publish(":scrollup-bookmarks", parseInt($("#bookmarks article:first").attr("id"), 10) + 1);
	} else {}
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

var listNext = function (downwards, from, amount) {

	listNext.precond(downwards, from, amount);

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

listNext.precond = function (downwards, from, amount) {

	is.always.boolean(downwards);
	is.always.number(from);
	is.always.number(amount);
};

var listDown = listNext.bind({}, true);
var listUp = listNext.bind({}, false);

var getOffsetBottom = function ($article) {
	return $article.offset().top + $article.height();
};

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

		ENGRAM.eventBus.publish(":loaded-bookmarks", { originalOffset: originalOffset, id: id });
	};

	var loadListDown = loadList.bind({}, true);
	var loadListUp = loadList.bind({}, false);
}

var loader = function () {

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

setImmediateInterval(ENGRAM.updateTimes, 250);
setImmediateInterval(loader, 250);

ENGRAM.eventBus.subscribe(":scrollup-bookmarks", loadListUp);
ENGRAM.eventBus.subscribe(":scrolldown-bookmarks", loadListDown);

// -- since bookmarks are being unloaded, need to scroll further back.
ENGRAM.eventBus.subscribe(":loaded-bookmarks", function (_ref) {
	var originalOffset = _ref.originalOffset;
	var id = _ref.id;

	ENGRAM.eventBus.await(":redraw", function () {
		$(window).scrollTop($("#" + id).offset().top - originalOffset);
	});
});

ENGRAM.syncBookmarks();

// -- load by query.

// -- load by query.
