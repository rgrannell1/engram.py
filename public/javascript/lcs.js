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





const searchAlign = function (str0, str1) {

	var cache = []

	for (var ith = 0; ith <= str0.length; ++ith) {

		var row = []

		for (var jth = 0; jth <= str1.length; ++jth) {
			row[jth] = ith * jth === 0 ? (ith * -1) + (jth * -1): undefined
		}

		cache[ith] = row

	}

	for (var ith = 1; ith <= str0.length; ++ith) {
		for (var jth = 1; jth <= str1.length; ++jth) {

			cache[ith][jth] = Math.max(
				0,

				cache[ith - 1][jth - 1] + charScore(str0.charAt(ith + 1), str1.charAt(jth + 1)),
				cache[ith    ][jth - 1] + charScore.gap,
				cache[ith - 1][jth    ] + charScore.gap
			)

		}
	}

	return cache[str0.length][str1.length]

}
