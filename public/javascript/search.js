
/*
	align

	align two strings locally, and calculate the gaps required to make the match
	fit.

*/

const align = function (query, text) {

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
		query:   query,
		text:    text,

		isMatch: alignResult.toMatch.length === 0,
		gaps:    alignResult.gaps
	}

}





/*
	alignQuality

	how well aligned is a string to another?

*/

const alignQuality = function (alignment) {
	return 1 - (alignment.gaps / alignment.text.length)
}






/*

	findSplitSubstring :: string -> string -> boolean

	detect whether a string is contained within another, allowing
	for gaps but not mismatches.

*/

const isSplitSubstring = function (pattern) {

	const regexp = new RegExp(pattern.split('').join('.*?'), 'i')

	return function (string) {
		return regexp.test(string)
	}

}





/*
	scoreQueryMatch :: string  xstring -> number

	given a query and a text string, calculate how well the query matches the string
	in the interval [0, 1)

*/

const scoreQueryMatch = function (query, text) {

	const ratio       = query.length / text.length
	const lengthScore = ratio
	const alignScore  = alignQuality( align(query.toLowerCase(), text.toLowerCase()) )

	return lengthScore * alignScore
}





/*
	updateAddressBar :: string -> undefined

	set the user URI, to keep the current state synced in the location
	for future use.

*/

const updateAddressBar = function (query) {

	is.always.string(query)

	if (query.length === 0) {
		history.pushState(null, '', '/bookmarks')
	} else {
		history.pushState(null, '', '/bookmarks?q=' + query)
	}

}





ENGRAM.searchState = {
	previous:   '',
	current:    '',
	searchCache: undefined,

	escape: function () {
		this.previous = this.current
		this.current  = ''
	},
	backspace: function () {
		this.previous = this.current
		this.current  = this.current.slice(0, -1)
	},

	addKey: function (char) {

		is.always.string(char)

		this.previous = this.current
		this.current += char
	},

	setCurrent: function (query) {

		is.always.string(query)

		this.current = query

	},
	setCache: function (cache) {

		is.always.object(cache)

		this.searchCache = cache

	}

}





/*
	isPrefixOf

	is a string a prefix of another?

*/

const isPrefixOf = function (str1, str2) {
	return str2.slice(0, str1.length) === str1
}





/*
	saveQueryScores :: string x Cache -> Cache

	given a text query and a source of bookmarks, score each bookmark
	for the query and save that value.

*/

const saveQueryScores = function (query, cache) {

	is.always.string(query)
	is.always.object(cache)

	const isMatch  = isSplitSubstring(query)
	cache.contents = cache.contents.map(function (bookmark) {

		bookmark.metadata = bookmark.metadata  || {queryScores: {}}

		bookmark.metadata.queryScores[query] = isMatch(bookmark.title)
		? bookmark.metadata.queryScores[query] || scoreQueryMatch(query, bookmark.title)
		: bookmark.metadata.queryScores[query] || 0

		return bookmark

	})

	return cache

}





/*
	loadBookmarks :: Cache x string -> undefined

	given a source of bookmarks and the rendering template,
	set up the bookmarks to load on scroll.
*/

const loadBookmarks = function (cache, template) {

	$('#content article').remove()
	attachChunk.append(cache, ENGRAM.BIGINT, template)
	loadScroll(cache,  template)

}





/*

	searchBookmarks :: string x Cache -> [bookmark]

	given a cache full of bookmarks with scored queries and a search query,
	find and sort matching bookmarks.

*/

const searchBookmarks = function (query, cache) {

	return cache
		.contents
		.filter(function (bookmark) {
			return bookmark.metadata.queryScores[query] > 0.05
		})
		.sort(function (bookmark0, bookmark1) {
			return bookmark1.metadata.queryScores[query] - bookmark0.metadata.queryScores[query]
		})

}















$.get('/public/html/bookmark-template.html', function (template) {

	/*

		loadAddressBar :: string -> string

		get the value of a parametre in the location bar's URI query string.

	*/

	const loadAddressBar = function (param) {

		const match  = RegExp('[?&]' + param + '=([^&]*)').exec(window.location.search)
		const result = match && decodeURIComponent(match[1].replace(/\+/g, ' '))

		return is.null(result) ? '': result

	}





	/*

		startSearch :: string -> undefined

		given a query, score each bookmark if appropriate and display
		the search results.

	*/

	const startSearch = function (query) {

		is.always.string(query)

		updateAddressBar(query)
		var searchCache = ENGRAM.cache

		if (query.length >= 2) {

			ENGRAM.cache = saveQueryScores(query, ENGRAM.cache)

			searchCache = ENGRAM.Cache(function (bookmark) {
				return bookmark.bookmark_id
			})
			.addAll(searchBookmarks(query, ENGRAM.cache))

		}

		ENGRAM.searchState.setCache(searchCache)
		loadBookmarks(searchCache, template)

	}





	/*

		loadSearchURI :: -> undefined

		load and start a search with the contents of the address bar.

	*/

	const loadSearchURI = function () {

		ENGRAM.searchState.setCurrent(loadAddressBar('q'))
		startSearch(ENGRAM.searchState.current)

	}





	/*
		liveSearch :: event -> undefined

		takes a key event. If it is 'escape' clears the current search,
		if 'backspace' if removes the last character, and if any other key
		appends that to the current query. Runs the search for the updated query.

	*/

	const liveSearch = keylog.bind({}, function (isEscape, isBackspace, key) {

		is.always.boolean(isEscape)
		is.always.boolean(isBackspace)

		if (isEscape) {
			ENGRAM.searchState.escape()
		} else if (isBackspace) {
			ENGRAM.searchState.backspace()
		} else {
			ENGRAM.searchState.addKey(key)
		}

		startSearch(ENGRAM.searchState.current)

	})





	$(loadSearchURI)
	$(window).keydown(liveSearch)

})
