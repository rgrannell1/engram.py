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




/*
	todo make local sequence alignment.
*/

const scoreAlignment = function (str0, str1) {

	const score = function (entry) {
		return entry.matches - (0.125 * entry.gaps)
	}

	var cache = {}

	// -- set the -1st row to {0, 0},
	// -- so the recurrence works properly.

	for (var ith = 0; ith <= str0.length; ++ith) {

		var row = {}

		for (var jth = 0; jth <= str1.length; ++jth) {
			if (ith * jth === 0) {
				row[(jth - 1) + ''] = {matches: 0, gaps: 0}
			}
		}

		cache[(ith - 1) + ''] = row

	}

	for (var ith = 0; ith < str0.length; ++ith) {
		for (var jth = 0; jth < str1.length; ++jth) {

			var chars = [
				str0.charAt(ith).toLowerCase(),
				str1.charAt(jth).toLowerCase()
			]

			var topPath  = cache[(ith)     + ''][(jth - 1) + '']
			var leftPath = cache[(ith - 1) + ''][(jth    ) + '']
			var diagPath = cache[(ith - 1) + ''][(jth - 1) + '']

			var ranks    = [
				[0, {
					matches: 0,
					gaps:    0
				}],

				[score(topPath), {
					matches: topPath.matches,
					gaps:    topPath.gaps + 1
				}],

				[score(leftPath), {
					matches: leftPath.matches,
					gaps:    leftPath.gaps + 1
				}],
			]

			if (chars[0] === chars[1]) {

				ranks = ranks.concat(
					[[score(diagPath) + 1, {
						matches: diagPath.matches + 1,
						gaps:    diagPath.gaps
					}]] )

			}

			cache[ith + ''][jth + ''] = ranks.reduce(function (best, current) {
				return current[0] > best[0] ? current: best
			})[1]

		}
	}

	// ignore gaps at the end of the match.

	const finalRow = cache[(str0.length - 1) + '']

	return Object.keys(finalRow)
		.map(function (key) {
			return finalRow[key]
		})
		.reduce(function (best, current) {
			return current.gaps < best.gaps ? current: best
		})

}

console.log( scoreAlignment('monk', 'monk is a string') )
