"use strict";

var setQuery = function (query) {

	ENGRAM.eventBus.publish(":update-query", {
		query: query
	});
};

ENGRAM.eventBus.subscribe(":press-typeable", function (_ref) {
	var key = _ref.key;

	setQuery(getQueryParam("q") + key);
}).subscribe(":press-backspace", function (_ref) {
	var key = _ref.key;

	setQuery(getQueryParam("q").slice(0, -1));
}).subscribe(":press-escape", function (_ref) {
	var key = _ref.key;

	setQuery("");
});

var getQueryParam = function (param) {

	var match = RegExp("[?&]" + param + "=([^&]*)").exec(window.location.search);
	var result = match && decodeURIComponent(match[1].replace(/\+/g, " "));

	return is["null"](result) ? "" : result;
};

$(function () {
	setQuery(getQueryParam("q"));
});
