
"use strict"

var getQuery  => {

	var match  = RegExp('[?&]q=([^&]*)').exec(window.location.search)
	var result = match && decodeURIComponent(match[1].replace(/\+/g, ' '))

	return is.null(result) ? '' : result

}

var setQuery = query => {

	query.length === 0
		? history.pushState(null, '', '/bookmarks')
		: history.pushState(null, '', `/bookmarks?q=${query}`)

}

var publishQuery = query => {

	setQuery({query})

	ENGRAM.eventBus.publish(':update-query', {
		query: query
	})

}





ENGRAM.eventBus
.subscribe(':press-typeable', ({key}) => {
	publishQuery(getQuery() + key)
})
.subscribe(':press-backspace', ({key}) => {
	publishQuery(getQuery().slice(0, -1))
})
.subscribe(':press-escape', ({key}) => {
	publishQuery('')
})





$(( ) => {
	publishQuery(getQuery())
})
