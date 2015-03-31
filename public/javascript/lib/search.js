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

			align.precond(query, text);

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

		align.precond = function (query, text) {

			is.always.string(query);
			is.always.string(text);
		};
	})();
}

var alignQuality = function (_ref) {
	var gaps = _ref.gaps;
	var text = _ref.text;

	alignQuality.precond(gaps, text);

	return 1 - Math.pow(gaps / text.length, 0.15);
};

alignQuality.precond = function (gaps, text) {
	is.always.number(gaps);
	is.always.string(text);
};

{
	var isSplitSubstring;

	(function () {

		var escapeRegexChar = function (char) {

			return ["[", "]", "\\", "^", "-"].indexOf(char) === -1 ? char : "\\" + char;
		};

		isSplitSubstring = function (pattern) {

			isSplitSubstring.precond(pattern);

			var regexp = new RegExp(pattern.split("").map(escapeRegexChar).join(".*?"), "i");

			return function (string) {
				return regexp.test(string);
			};
		};

		isSplitSubstring.precond = function (pattern) {
			is.always.string(pattern);
		};
	})();
}

var scoreTextMatch = function (query, matchesPattern, text) {

	scoreTextMatch.precond(query, matchesPattern, text);

	return matchesPattern(text) ? query.length / text.length * alignQuality(align(query, text)) : 0;
};

scoreTextMatch.precond = function (query, matchesPattern, text) {

	is.always.string(query);
	is.always["function"](matchesPattern);
	is.always.string(text);
};

var scoreBookmarks = function (_ref) {
	var query = _ref.query;

	scoreBookmarks.precond(query);

	var cacheRef = ENGRAM.cache;

	Object.keys(cacheRef).forEach(function (key) {

		var scoresRef = cacheRef[key].metadata.scores;

		scoresRef[query] = is.number(scoresRef[query]) ? scoresRef[query] : scoreTextMatch(query, isSplitSubstring(query), cacheRef[key].bookmark.title);
	});

	ENGRAM.eventBus.fire(":rescore", {});
};

scoreBookmarks.precond = function (pattern) {
	is.always.string(pattern);
};
