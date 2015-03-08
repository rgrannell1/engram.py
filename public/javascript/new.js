"use strict";

ENGRAM.eventBus = EventBus();

// -- publish detailed position data on scroll.

$(window).on("scroll", function () {

	$window = $(window);

	ENGRAM.eventBus.publish(":scroll", {
		windowTop: $window.scrollTop(),
		scrollHeight: $(document).height(),
		scrollPosition: $window.height() + windowTop
	});
});

// -- publish all keystrokes on the DOM.

$(window).keydown(function (event) {

	var keyCode = event.keyCode;

	if (event.keyCode === 27) {
		ENGRAM.eventBus.publish(":press-escape");
	} else if (event.keyCode === 8) {
		ENGRAM.eventBus.publish(":press-backspace");
	} else {

		var isTypeable = (keyCode >= 41 && keyCode < 122 || (keyCode == 32 || keyCode > 186)) && event.key.length === 1;

		if (isTypeable && !event.ctrlKey && !event.altKey) {

			ENGRAM.eventBus.publish(":press-typeable", {
				key: event.key
			});
		}
	}
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

var getQueryParam = function (param) {

	var match = RegExp("[?&]" + param + "=([^&]*)").exec(window.location.search);
	var result = match && decodeURIComponent(match[1].replace(/\+/g, " "));

	return is["null"](result) ? "" : result;
};

var loadSearchURL = function () {

	ENGRAM.eventBus.publish(":update-query", {
		query: ENGRAM.QUERY += getQueryParam("q")
	});
};

$(loadSearchURL);

ENGRAM.eventBus.subscribe(":load-bookmark", function (bookmark) {});

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
				failure: function (res) {}

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