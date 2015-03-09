"use strict";

{
	var align;

	(function () {
		var locate = function (char, string, from) {

			for (var ith = from; ith < string.length; ++ith) {
				if (char === string.charAt(ith)) {
					return ith;
				}
			}

			return -1;
		};

		align = function (query, text) {

			var query = query.toLowerCase();
			var text = text.toLowerCase();

			var alignResult = {
				gaps: 0,
				text: text,
				query: query
			};

			var from = locate(query.charAt(0), text, 0);
			var nextFrom;

			for (var ith = 0; ith < query.length; ++ith) {
				// assume 'from' never over- or under-runs, as query should always be a substring of text.

				nextFrom = locate(query.charAt(ith), text, from) + 1;
				alignResult.gaps += nextFrom - from - 1;
				from = nextFrom;
			}

			return alignResult;
		};
	})();
}

var alignQuality = function (alignment) {
	return 1 - Math.pow(alignment.gaps / alignment.text.length, 0.15);
};

var isSplitSubstring = function (pattern) {

	var regexp = new RegExp(pattern.split("").join(".*?"), "i");

	return function (string) {
		return regexp.test(string);
	};
};

var scoreTextMatch = function (query, matchesPattern, text) {

	return matchesPattern(text) ? query.length / text.length * alignQuality(align(query, text)) : 0;
};

var scoreBookmarks = function (_ref) {
	var query = _ref.query;

	var cacheRef = ENGRAM.cache;

	Object.keys(cacheRef).forEach(function (key) {

		var scoresRef = cacheRef[key].metadata.scores;

		scoresRef[query] = is.number(scoresRef[query]) ? scoresRef[query] : scoreTextMatch(query, isSplitSubstring(query), cacheRef[key].bookmark.title);
	});

	ENGRAM.eventBus.publish(":rescore", {});
};
