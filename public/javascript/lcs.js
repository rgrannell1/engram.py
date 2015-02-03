
const align = function (query, text) {

	// todo rewrite with indexOf and a while loop.

	const alignHeads = function (query, text) {

		if ((query.length * text.length) === 0 || query.charAt(0) === text.charAt(0)) {
			return text
		} else {
			return alignHeads(query, text.slice(1))
		}
	}

	const alignResult = query.split('').reduce(function (state, char) {

		if (state.toMatch.length === 0) {
			return state
		} else {

			const index = state.toMatch.indexOf(char)

			return {
				gaps:       state.gaps +        index === -1 ? 0: index,
				toMatch:    state.toMatch.slice(index === -1 ? Infinity: index + 1)
			}
		}

	}, {
		gaps:    0,
		toMatch: alignHeads(query, text)
	})

	return {
		isMatch: alignResult.toMatch.length === 0,
		gaps:    alignResult.gaps,
		query:   query,
		text:    text
	}

}

const alignmentQuality = function (alignment) {

	console.log(alignment)

	return 1 - (alignment.gaps / alignment.text.length)
}





console.log(
	alignmentQuality(align('monk', 'monkies'))
)