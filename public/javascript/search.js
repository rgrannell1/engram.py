

/*
	http://math.stackexchange.com/questions/64716/approximating-the-logarithm-of-the-binomial-coefficient
*/

const lnChoose = function (n, m) {
	return n * Math.log(n) - m * Math.log(m) - (n - m) * Math.log(n - m)
}

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
	rarity :: string -> number

	what is the likelyhood of this string being created by random chance?

*/

const rarity = ( function () {

	const frequency = {0:.0274381,1:.0435053,2:.0312312,3:.024333900000000002,4:.0194265,5:.018857699999999998,6:.0175647,7:.01621,8:.0166225,9:.0179558,a:.0752766,e:.070925,o:.051699999999999996,r:.0496032,i:.04697320000000001,s:.0461079,n:.045689900000000006,t:.038738800000000004,l:.0377728,m:.029991300000000002,d:.027640099999999997,c:.025727600000000003,p:.024557799999999998,h:.0241319,b:.0229145,u:.021019100000000002,k:.0196828,g:.0185331,y:.0152483,f:.012476000000000001,w:.0124492,j:.00836677,v:.00833626,z:.00632558,x:.00573305,q:.0034611900000000003,A:.00130466,S:.00108132,E:970865e-9,R:8476e-7,B:806715e-9,T:.0008012229999999999,M:782306e-9,L:775594e-9,N:748134e-9,P:73715e-8,O:.0007292170000000001,I:70908e-8,D:698096e-9,C:660872e-9,H:544319e-9,G:497332e-9,K:460719e-9,F:417393e-9,J:363083e-9,U:350268e-9,W:320367e-9,".":316706e-9,"!":306942e-9,Y:255073e-9,"*":.00024164800000000001,"@":238597e-9,V:235546e-9,"-":.00019771199999999998,Z:170252e-9,Q:147064e-9,X:142182e-9,_:122655e-9,$:9702550000000001e-20,"#":854313e-10,",":323418e-10,"/":31121399999999996e-21,"+":231885e-10,"?":207476e-10,";":207476e-10,"^":195272e-10," ":189169e-10,"%":170863e-10,"~":152556e-10,"=":14035099999999999e-21,"&":134249e-10,"`":115942e-10,"\\":115942e-10,")":115942e-10,"]":10984e-9,"[":10984e-9,":":549201e-11,"<":427156e-11,"(":427156e-11,">":183067e-11,'"':183067e-11,"|":122045e-11,"{":122045e-11,"'":122045e-11,"}":6.10223e-7}

	return function (query) {

		if (!is.string(query)) {
			throw TypeError('rarity: query was not a string (' + JSON.stringify(query) + ')')
		}

		return query
			.split('')
			.map(function (char) {
				return char in frequency? frequency[char] : 0.00000409165 // a high estimate on probabilty; 1 - sum(frequency).
			})
			.reduce(function (x, y) {
				return x * y
			}, 1)

	}

} )()







/*

	likelihood :: string x string -> number

	let A be the character string

		a_0 a_1 ... a_n,

	B be the character string

		 b_0 b_1 ... b_m

	where n, m elem N. Assuming a and b are random uniform ascii
	characters, the probability of A being a substring (with or without gaps)
	of B is given as

	p(A subsets B) = (95^-n)(m choose n)

	so the probability of a given ascii string of length n times the number of
	of substrings of length n in B gives the probability that A is found in B.

	The term (95^-n) is a lousy estimation of the likelihood of a given query;
	"~~~" is a less likely query than "eee".

	Instead the 'unlikelyness' of a query is calculated as 1 / freq(a_0) x freq(a_1)
	... x freq(a_n), where freq maps characters to frequency proportions. To keep
	things simple only the ascii printable characters are included in the frequency
	table; any other character is optimistically given
	the probability 1 - sum(domain of freq).

	product rule: log(rarity) + log(|pattern| choose |query|) = log(rarity * (|pattern| choose |query|))

	then e^ln(x * y) = x * y

	ultimately computes rarity x (|pattern| choose |query|) without the right term overflowing;
	the left term (rarity) is very small and the right term is too large to compute, but the
	product of the two is in floating point range.

	The unlikelyness of the pattern is ignored.

*/

const likelihood = function (query, pattern) {
	return Math.exp( (Math.log(rarity(query)) + lnChoose(pattern.length, query.length)) );
}





/*
	scoreAlignment :: string  xstring -> number

	given a query and a text string, calculate how well the query matches the string
	in the interval [0, 1)

*/

const scoreAlignment = function (query, text) {


	const ratio       = query.length / text.length
	const lengthScore = ratio
	const alignScore  = alignQuality( align(query.toLowerCase(), text.toLowerCase()) )

	return lengthScore * alignScore
}




/*
	scoreBookmarks :: string x string x string

	find all bookmarks in the cache matching a query string.

*/

const scoreBookmarks = function (getText, query, cache) {

	const isFullMatch = isSplitSubstring(query)

	return cache.contents.map(function (bookmark) {

		return isFullMatch(getText(bookmark))
		? [ bookmark.bookmark_id, scoreAlignment(query, getText(bookmark)) ]
		: [ bookmark.bookmark_id, 0]

	})

}





/*
	updateAddressBar :: string -> undefined

	set the user URI, to keep the current state synced in the location
	for future use.

*/

const updateAddressBar = function (query) {

	if (query.length === 0) {
		history.pushState(null, '', '/bookmarks')
	} else {
		history.pushState(null, '', '/bookmarks?q=' + query)
	}

}





ENGRAM.searchState = {
	previous:    '',
	current:     '',
	searchCache: undefined,
}





/*
	updateSearchState :: {
		'previous': string, 'current': string
	} x string -> {
		'previous': string, 'current': string
	}

	given the current search state object and a text query,
	update the current state and previous state.

*/

const updateSearchState = function (state, query) {

	state.previous = state.current
	state.current  = query

	return state
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

	const isMatch = isSplitSubstring(query)

	cache.contents = cache.contents.map(function (bookmark) {

		bookmark.metadata = bookmark.metadata  || {queryScores: {}}

		bookmark.metadata.queryScores[query] = isMatch(bookmark.title)
		? bookmark.metadata.queryScores[query] || scoreAlignment(query, bookmark.title)
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
			return bookmark.metadata.queryScores[query] > 0.10
		})
		.sort(function (bookmark0, bookmark1) {
			return bookmark1.metadata.queryScores[query] - bookmark0.metadata.queryScores[query]
		})

}










$.get('/public/html/bookmark-template.html', function (template) {

	loadBookmarks(ENGRAM.cache, template)

	$('#search').keyup(function (event) {

		const query        = $(this).val()
		ENGRAM.searchState = updateSearchState(ENGRAM.searchState, query)

		updateAddressBar(query)

		if (query.length < 2) {
			loadBookmarks(ENGRAM.cache, template)
		} else {

			ENGRAM.cache      = saveQueryScores(query, ENGRAM.cache)
			const searchCache =
				ENGRAM
				.Cache(function (bookmark) {
					return bookmark.bookmark_id
				})
				.addAll(searchBookmarks(query, ENGRAM.cache))

			loadBookmarks(searchCache, template)

			ENGRAM.searchState.searchCache = searchCache

		}

	})

})
