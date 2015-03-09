"use strict";

var getQueryParam = function (param) {

	var match = RegExp("[?&]" + param + "=([^&]*)").exec(window.location.search);
	var result = match && decodeURIComponent(match[1].replace(/\+/g, " "));

	return is["null"](result) ? "" : result;
};

var loadSearchURL = function () {

	ENGRAM.eventBus.publish(":update-query", {
		query: ENGRAM.QUERY = getQueryParam("q")
	});
};
