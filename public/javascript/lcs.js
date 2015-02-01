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

		// -- gaps at the ends of the sequence aren't penalised.
		for (var jth = 0; jth <= str1.length; ++jth) {
			if (ith * jth === 0) {
				row[jth] = {
					matches: 1,
					gaps:    0
				}
			} else {
				row[jth] = undefined
			}
		}

		cache[ith] = row
	}

	for (var ith = 1; ith <= str0.length; ++ith) {
		for (var jth = 1; jth <= str1.length; ++jth) {

			// -- the current best match is either the
			// -- last

			var char0 = str0.charAt(ith - 1)
			var char1 = str1.charAt(jth - 1)

			if (char0.toLowerCase() === char1.toLowerCase()) {
				// -- the characters are aligned. No new gaps, increase the score.

				cache[ith][jth] = {
					matches: cache[ith - 1][jth - 1].matches + 1,
					gaps:    cache[ith - 1][jth - 1].gaps
				}

			} else {
				// -- have to insert a gap. Use -1/2 as a gap-penalty
				// -- and choose the best subsequence with respects to
				// -- matches + (gapPenalty x gaps)

				var topPath  = cache[ith    ][jth - 1]
				var leftPath = cache[ith - 1][jth    ]

				if (topPath.matches - (0.5 * topPath.gaps) > leftPath.matches - (0.5 * leftPath.gaps)) {

					cache[ith][jth] = {
						matches: topPath.matches,
						gaps:    topPath.gaps + 1
					}

				} else {

					cache[ith][jth] = {
						matches: leftPath.matches,
						gaps:    leftPath.gaps + 1
					}

				}

			}

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

	scoreAlignment('monk', 'monk is a string')

)
