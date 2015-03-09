"use strict";

var _defineProperty = function (obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); };

ENGRAM.eventBus = EventBus();
ENGRAM.cache = {};
ENGRAM.loadedIndex = 0;

// -- publish detailed position data on scroll.

$(window).on("scroll", function () {

	var $window = $(window);

	ENGRAM.eventBus.publish(":scroll", {
		windowTop: $window.scrollTop(),
		scrollHeight: $(document).height(),
		scrollPosition: $window.height() + windowTop
	});
});

// -- publish when the top or bottom of the document is reached.

ENGRAM.eventBus.subscribe(":scroll", function detectEdge(_ref) {
	var windowTop = _ref.windowTop;
	var scrollHeight = _ref.scrollHeight;
	var scrollPosition = _ref.scrollPosition;

	if (scrollHeight - scrollPosition < ENGRAM.LOADOFFSET) {
		// what data should these publish ?

		ENGRAM.eventBus.publish(":atTop", {});
	} else if (windowTop < 50) {
		// what data should these publish ?

		ENGRAM.eventBus.publish(":atBottom", {});
	}
});

// -- update the query on search.

ENGRAM.QUERY = "";

ENGRAM.eventBus.subscribe(":press-typeable", function (_ref) {
	var key = _ref.key;

	ENGRAM.QUERY += key;

	ENGRAM.eventBus.publish(":update-query", {
		query: ENGRAM.QUERY
	});
});

ENGRAM.eventBus.subscribe(":press-backspace", function (_ref) {
	var key = _ref.key;

	ENGRAM.QUERY = ENGRAM.QUERY.slice(0, -1);

	ENGRAM.eventBus.publish(":update-query", {
		query: ENGRAM.QUERY
	});
});

ENGRAM.eventBus.subscribe(":press-escape", function (_ref) {
	var key = _ref.key;

	ENGRAM.QUERY = "";

	ENGRAM.eventBus.publish(":update-query", {
		query: ENGRAM.QUERY
	});
});

ENGRAM.eventBus.subscribe(":update-query", function (_ref) {
	var query = _ref.query;

	query.length === 0 ? history.pushState(null, "", "/bookmarks") : history.pushState(null, "", "/bookmarks?q=" + query);
});

// -- a collection of data used to speed-up searches, as search is
// -- slow and caching helps.

var searchState = {
	previous: "",
	current: ""
};

// -- update the search state.

ENGRAM.eventBus.subscribe(":update-query", function (_ref) {
	var query = _ref.query;

	searchState.previous = searchState.current;
	searchState.current = query;
});

/*
	getQueryParam

	get a query parametre from the address bar.
*/

var getQueryParam = function (param) {

	var match = RegExp("[?&]" + param + "=([^&]*)").exec(window.location.search);
	var result = match && decodeURIComponent(match[1].replace(/\+/g, " "));

	return is["null"](result) ? "" : result;
};

/*
	loadSearchURL

	get the current location from the address bar and
	set it to the current query.
*/

var loadSearchURL = function () {

	ENGRAM.eventBus.publish(":update-query", {
		query: ENGRAM.QUERY = getQueryParam("q")
	});
};

/*
	scoreBookmarks :: {string} -> undefined

	add the scores for the current query to the bookmark cache.
*/

var scoreBookmarks = function (_ref) {
	var query = _ref.query;

	var cacheRef = ENGRAM.cache;

	Object.keys(cacheRef).forEach(function (key) {

		var scoresRef = cacheRef[key].metadata.scores;

		scoresRef[query] = is.number(scoresRef[query]) ? scoresRef[query] : scoreTextMatch(query, isSplitSubstring(query), cacheRef[key].bookmark.title);
	});

	ENGRAM.eventBus.publish(":rescore", {});
};

var selectBookmarks = function (query) {

	var cacheArray = Object.keys(ENGRAM.cache).map(function (key) {
		return ENGRAM.cache[key];
	});

	return query === "" ? cacheArray : cacheArray.filter(function (bookmark) {
		return bookmark.metadata.scores[query] > 0;
	}).sort(function (bookmark0, bookmark1) {
		bookmark0.metadata.scores[query] - bookmark1.metadata.scores[query];
	});
};

ENGRAM.eventBus.subscribe(":update-query", scoreBookmarks);

ENGRAM.eventBus.subscribe(":rescore", function (_) {

	ENGRAM.inFocus = selectBookmarks(ENGRAM.QUERY);

	ENGRAM.eventBus.publish(":change-focus", {
		focus: ENGRAM.inFocus
	});
});

// -- todo fix loading!!
var renderBookmark = function () {};

$.get("/public/html/bookmark-template.html", function (template) {

	renderBookmark = function (bookmark) {
		return Mustache.render(template, bookmark);
	};
});

// -- todo only redraw when needed.

var drawFocus = function (_ref) {
	var focus = _ref.focus;

	$("#bookmark-container").html(focus.slice(ENGRAM.loadedIndex, ENGRAM.PERSCROLL).map(function (_ref2) {
		var bookmark = _ref2.bookmark;
		var _ = _ref2._;
		return renderBookmark(bookmark);
	}).reduce(function (html0, html1) {
		return html0 + html1;
	}, ""));
};

ENGRAM.eventBus.subscribe(":change-focus", drawFocus);

// -- populate the cache with all loaded bookmarks.

ENGRAM.eventBus.subscribe(":load-bookmark", function (bookmark) {

	var query = ENGRAM.QUERY;

	is.always.object(bookmark);
	is.always.number(bookmark.bookmark_id);

	ENGRAM.cache[bookmark.bookmark_id] = {
		bookmark: bookmark,
		metadata: {
			scores: query.length === 0 ? {} : _defineProperty({}, query, scoreTextMatch(query, isSplitSubstring(query), bookmark.title))
		}
	};

	ENGRAM.eventBus.publish(":rescore");
});

{
	(function () {

		var requestChunk = function (maxID) {

			requestChunk.precond(maxID);

			$.ajax({
				url: "/api/bookmarks?max_id=" + maxID + "&amount=" + ENGRAM.PERREQUEST,
				dataType: "json",
				success: function (_ref) {
					var data = _ref.data;
					var next_id = _ref.next_id;

					data.forEach(function (bookmark) {
						ENGRAM.eventBus.publish(":load-bookmark", bookmark);
					});

					next_id >= 0 ? console.log("loaded all bookmarks.") : setTimeout(requestChunk, ENGRAM.loadInterval, next_id);
				},
				failure: function (res) {
					console.log("internal failure: bookmark chunk failed to load.");
				}

			});
		};

		requestChunk.precond = function (maxID) {

			is.always.number(maxID, function (maxID) {
				"requestChunk: maxID was not a number (actual value: " + JSON.stringify(maxID) + ")";
			});
		};

		ENGRAM.syncBookmarks = function () {

			console.log("loading.");

			requestChunk(ENGRAM.BIGINT);
		};
	})();
}

ENGRAM.syncBookmarks();
