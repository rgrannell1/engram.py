
{
	let locate = (char, string, from) => {

		for (var ith = from; ith < string.length; ++ith) {
			if (char === string.charAt(ith)) {
				return ith
			}
		}

		return -1
	}

	var align = (query, text) => {

		var query = query.toLowerCase( )
		var text  = text. toLowerCase( )

		var alignResult = {
			gaps: 0,
			text,
			query
		}

		var from = locate(query.charAt(0), text, 0)
		var nextFrom;

		for (var ith = 0; ith < query.length; ++ith) {
			// assume 'from' never over- or under-runs, as query should always be a substring of text.

			nextFrom          = locate(query.charAt(ith), text, from) + 1
			alignResult.gaps += (nextFrom - from - 1)
			from              = nextFrom

		}

		return alignResult

	}
}




var alignQuality = alignment => {
	return 1 - Math.pow(alignment.gaps / alignment.text.length, 0.15)
}





var isSplitSubstring = pattern => {

	var regexp = new RegExp(pattern.split('').join('.*?'), 'i')

	return string => regexp.test(string)
}





var scoreTextMatch = (query, matchesPattern, text) => {

	return matchesPattern(text)
		? query.length / text.length * alignQuality(align(query, text))
		: 0

}





var scoreBookmarks = ({query}) => {

	var cacheRef = ENGRAM.cache

	Object.keys(cacheRef).forEach(key => {

		var scoresRef = cacheRef[key].metadata.scores

		scoresRef[query] = is.number(scoresRef[query])
			? scoresRef[query]
			: scoreTextMatch(query, isSplitSubstring(query), cacheRef[key].bookmark.title)

	})

	ENGRAM.eventBus.publish(':rescore', {})

}
