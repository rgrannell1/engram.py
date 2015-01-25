
const frequency={0:.0274381,1:.0435053,2:.0312312,3:.024333900000000002,4:.0194265,5:.018857699999999998,6:.0175647,7:.01621,8:.0166225,9:.0179558,a:.0752766,e:.070925,o:.051699999999999996,r:.0496032,i:.04697320000000001,s:.0461079,n:.045689900000000006,t:.038738800000000004,l:.0377728,m:.029991300000000002,d:.027640099999999997,c:.025727600000000003,p:.024557799999999998,h:.0241319,b:.0229145,u:.021019100000000002,k:.0196828,g:.0185331,y:.0152483,f:.012476000000000001,w:.0124492,j:.00836677,v:.00833626,z:.00632558,x:.00573305,q:.0034611900000000003,A:.00130466,S:.00108132,E:970865e-9,R:8476e-7,B:806715e-9,T:.0008012229999999999,M:782306e-9,L:775594e-9,N:748134e-9,P:73715e-8,O:.0007292170000000001,I:70908e-8,D:698096e-9,C:660872e-9,H:544319e-9,G:497332e-9,K:460719e-9,F:417393e-9,J:363083e-9,U:350268e-9,W:320367e-9,".":316706e-9,"!":306942e-9,Y:255073e-9,"*":.00024164800000000001,"@":238597e-9,V:235546e-9,"-":.00019771199999999998,Z:170252e-9,Q:147064e-9,X:142182e-9,_:122655e-9,$:9702550000000001e-20,"#":854313e-10,",":323418e-10,"/":31121399999999996e-21,"+":231885e-10,"?":207476e-10,";":207476e-10,"^":195272e-10," ":189169e-10,"%":170863e-10,"~":152556e-10,"=":14035099999999999e-21,"&":134249e-10,"`":115942e-10,"\\":115942e-10,")":115942e-10,"]":10984e-9,"[":10984e-9,":":549201e-11,"<":427156e-11,"(":427156e-11,">":183067e-11,'"':183067e-11,"|":122045e-11,"{":122045e-11,"'":122045e-11,"}":6.10223e-7}





const sortBy = function (pred, coll) {

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

	countGaps :: string x string -> number

	count the gap score between two patterns. Low scores
	are better.

*/

const countGaps = function (pattern, string) {
	return Math.abs(pattern.length, string.length)
}




const rarity = function (query) {

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





/*

	isSignificantMatch :: string x string -> number

	let A be the character string

		a_0 a_1 ... a_n,

	B be the character string

		 b_0 b_1 ... b_m

	where n, m e N. Assuming a and b are random uniform ascii
	characters, the probability of A being a substring (with or without gaps)
	of B is given as

	p(A < B) = (95^-n)(m choose n)

	so the probability of a given ascii string of length n times the number of
	of substrings of length n in B gives the probability that A is found in B.

	The term (95^-n) is a lousy estimation of the likelyhood of a given query;
	"~~~" is a less likely query than "eee".


*/

const likelyhood = function (query, pattern) {
	return (rarity(query) * achoose(pattern.length, query.length))
}

/*

*/

const searchMatches = function (query, key, cache) {

	const pred = isSplitSubstring(query)

	return cache.contents
		.filter(function (bookmark) {
			return pred(bookmark[key])
		})
		.map(function (bookmark) {
			return {
				bookmark:   bookmark,
				likelyhood: likelyhood(query, bookmark.title)
			}
		})
		.filter(function (data) {
			return data.likelyhood < 1 / 100
		})

}



ENGRAM.searchState = {
	previous: '',
	current:  ''
}





$('#search').keyup(function (e) {

	ENGRAM.searchState.previous = ENGRAM.searchState.current
	ENGRAM.searchState.current  = $(this).val()

	const current = ENGRAM.searchState.current

	if (current.length > 1) {
		const m = searchMatches(current, 'title', ENGRAM.cache)
	}

	console.log(m)


})

