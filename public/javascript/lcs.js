
const align = function (str0, str1) {

	const alignHeads = function (str0, str1) {

		if ((str0.length * str1.length) === 0 || str0.charAt(0) === str1.charAt(0)) {
			return str1
		} else {
			return alignHeads(str0, str1.slice(1))
		}
	}

	const matchResult = str0.split('').reduce(function (state, char) {

		if (state.toMatch.length === 0) {
			return state
		} else {

			const index = state.toMatch.indexOf(char)

			if (index === -1) {

				return {
					gaps:    state.gaps,
					matched: state.matched.slice(1),
					toMatch: ''
				}

			} else {

				return {
					gaps:       state.gaps    + index,
					matched:    state.matched + char,
					toMatch:    state.toMatch.slice(index + 1)
				}

			}

		}

	}, {
		gaps:    0,
		matched: '',
		toMatch: alignHeads(str0, str1)
	})

	return {
		isMatch: matchResult.toMatch.length === 0,
		gaps:    matchResult.gaps,
		query:   str0
	}

}


console.log( align('monkeys are not cats', 'monkeys are not cats') )
