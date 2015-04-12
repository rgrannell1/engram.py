"use strict";

var getQuery = function () {

	var match = RegExp("[?&]q=([^&]*)").exec(window.location.search);
	var result = match && decodeURIComponent(match[1].replace(/\+/g, " "));

	return is["null"](result) ? "" : result;
};

var setQuery = function (query) {

	setQuery.precond(query);

	query.length === 0 ? history.pushState(null, "", "/bookmarks") : history.pushState(null, "", "/bookmarks?q=" + encodeURIComponent(query));
};

setQuery.precond = function (query) {
	is.always.string(query);
};

var publishQuery = function (query) {

	publishQuery.precond(query);

	setQuery(query);

	ENGRAM.eventBus.fire(":update-query", { query: query });
};

publishQuery.precond = function (query) {
	is.always.string(query);
};

ENGRAM.eventBus.on(":press-typeable", function (_ref) {
	var key = _ref.key;

	publishQuery(getQuery() + key);
}).on(":press-backspace", function (_ref) {
	var key = _ref.key;

	publishQuery(getQuery().slice(0, -1));
}).on(":press-escape", function (_ref) {
	var key = _ref.key;

	publishQuery("");
});

$(function () {
	return publishQuery(getQuery());
});
