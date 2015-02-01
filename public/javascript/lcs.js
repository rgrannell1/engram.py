#!/usr/bin/env node

const searchAlign = ( function () {

	var align = function (score, str0, str1) {

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

					cache[ith - 1][jth - 1] + score.charPair(str0.charAt(ith + 1), str1.charAt(jth + 1)),
					cache[ith    ][jth - 1] + score.gap,
					cache[ith - 1][jth    ] + score.gap
				)

			}
		}

		return cache[str0.length][str1.length]
	}




	return align.bind(null, {
		charPair: function (char0, char1) {

			if (char0 === char1) {
				return +2
			} else if (char0.toLowerCase() === char1.toLowerCase()) {
				return +1
			} else {
				return -1
			}

		}
		gap: -1,
	})

} )()
