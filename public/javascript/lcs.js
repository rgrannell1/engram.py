#!/usr/bin/env node

const charScore = function (char0, char1) {

	if (char0 === char1) {
		return charScore.matchScore
	} else if (char0.toLowerCase() === char1.toLowerCase()) {
		return charScore.caseMatchScore
	} else {
		return charScore.mismatchScore
	}

}

charScore.matchScore     = +2
charScore.caseMatchScore = +1
charScore.mismatchScore  = -Infinity
charScore.gap            = -1





const scoreAlignment = function (str0, str1) {

	var cache = []

	for (var ith = 0; ith <= str0.length; ++ith) {

		var row = []

		// gaps at the ends of the sequence aren't penalised.
		for (var jth = 0; jth <= str1.length; ++jth) {
			row[jth] = ith * jth === 0 ? 1: undefined
		}

		cache[ith] = row

	}

	for (var ith = 1; ith <= str0.length; ++ith) {
		for (var jth = 1; jth <= str1.length; ++jth) {

			cache[ith][jth] = Math.max(
				cache[ith - 1][jth - 1] + charScore(str0.charAt(ith + 1), str1.charAt(jth + 1)),
				cache[ith    ][jth - 1] + charScore.gap,
				cache[ith - 1][jth    ] + charScore.gap
			)

		}
	}

	return cache[str0.length][str1.length]

}




/*
	https://heim.ifi.uio.no/danielry/StringMetric.pdf
*/

const similarity = function (str0, str1) {
	return 1 - (scoreAlignment(str0, str1) / Math.max(str0.length, str1.length))
}


console.log(

	similarity('monk', 'monks is a string')

)