"use strict"

{
	let locate = (char, string, from) => {

		for (let ith = from; ith < string.length; ++ith) {
			if (char === string.charAt(ith)) {
				return ith
			}
		}

		return -1
	}

	var align = (query, text) => {

		align.precond(query, text)

		var query = query.toLowerCase( )
		var text  = text. toLowerCase( )

		var alignResult = {
			gaps: 0,
			text,
			query
		}

		var from = locate(query.charAt(0), text, 0)
		var nextFrom;

		for (let ith = 0; ith < query.length; ++ith) {
			// assume 'from' never over- or under-runs, as query should always be a substring of text.

			nextFrom          = locate(query.charAt(ith), text, from) + 1
			alignResult.gaps += (nextFrom - from - 1)
			from              = nextFrom

		}

		return alignResult

	}

	align.precond = (query, text) => {

		is.always.string(query)
		is.always.string(text)

	}

}




var alignQuality = ({gaps, text}) => {

	alignQuality.precond(gaps, text)

	return 1 - Math.pow(gaps / text.length, 0.15)

}

alignQuality.precond = (gaps, text) => {
	is.always.number(gaps)
	is.always.string(text)
}





{

	let escapeRegexChar = char => {

		return ['[',']', '\\', '^', '-'].indexOf(char) === -1
			? char
			: '\\' + char

	}

	var isSplitSubstring = pattern => {

		isSplitSubstring.precond(pattern)

		var regexp = new RegExp(pattern.split('').map(escapeRegexChar).join('.*?'), 'i')

		return string => regexp.test(string)
	}

	isSplitSubstring.precond = pattern => {
		is.always.string(pattern)
	}

}





var scoreTextMatch = (query, matchesPattern, text) => {

	scoreTextMatch.precond(query, matchesPattern, text)

	return matchesPattern(text)
		? query.length / text.length * alignQuality(align(query, text))
		: 0

}

scoreTextMatch.precond = (query, matchesPattern, text) => {

	is.always.string(query)
	is.always.function(matchesPattern)
	is.always.string(text)

}





var scoreBookmarks = ({query}) => {

	scoreBookmarks.precond(query)

	var cacheRef = ENGRAM.cache

	Object.keys(cacheRef).forEach(key => {

		var scoresRef = cacheRef[key].metadata.scores

		scoresRef[query] = is.number(scoresRef[query])
			? scoresRef[query]
			: scoreTextMatch(query, isSplitSubstring(query), cacheRef[key].bookmark.title)

	})

	ENGRAM.eventBus.fire(':rescore', {})

}

scoreBookmarks.precond = pattern => {
	is.always.string(pattern)
}
