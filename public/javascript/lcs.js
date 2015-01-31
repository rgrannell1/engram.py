#!/usr/bin/env node





/*

*/

const memoise = function (fn) {
	return function () {

		var args = Array.prototype.slice.call(arguments)
		var hash = ""
		var ith  = args.length

		while (ith--) {

			var arg     = args[ith]
			var argHash = (arg === Object(arg)) ?
				JSON.stringify(args) : arg

			hash += argHash

		}

		if (hash in fn.memoise) {
			return fn.memoise[hash]
		} else {
			return fn.memoise[hash] = fn.apply(this, args)
		}

	}

}









/*
	alignmentFit :: string x string x {charScore: function, gapPenalty: number} -> number

*/

const alignmentFit = function (str0, str1, score) {

	const _rec = function (ith, jth) {

		if (ith < 0 || jth < 0) {
			return (ith * score.gapPenalty) + (jth * score.gapPenalty)
		} else {
			return Math.max(
				_rec(ith - 1, jth - 1) + score.charScore(str0.charAt(ith), str1.charAt(jth)),
				_rec(ith,     jth - 1) + score.gapPenalty,
				_rec(ith - 1, jth    ) + score.gapPenalty
			)
		}

	}

	return _rec(str0.length - 1, str1.length - 1)

}





console.log(

	alignmentFit('abcabc', 'cabcabcabc', {
		'charScore':  function (char0, char1) {

			if (char0 === char1) {
				return +1
			} else if (char0.toLowerCase() === char1.toLowerCase()) {
				return +(1 / 2)
			} else {
				return -1
			}
		},
		'gapPenalty': -1,
	})

)
