
"use strict"





var getQuery = ( ) => {

	var match  = RegExp('[?&]q=([^&]*)').exec(window.location.search)
	var result = match && decodeURIComponent(match[1].replace(/\+/g, ' '))

	return is.null(result) ? '' : result

}

var setQuery = query => {

	setQuery.precond(query)

	query.length === 0
		? history.pushState(null, '', '/bookmarks')
		: history.pushState(null, '', `/bookmarks?q=${encodeURIComponent(query)}`)

}

setQuery.precond = query => {
	is.always.string(query)
}






var publishQuery = query => {

	publishQuery.precond(query)

	setQuery(query)

	ENGRAM.eventBus.fire(':update-query', {query: query})

}

publishQuery.precond = query => {
	is.always.string(query)
}





ENGRAM.eventBus
.on(':press-typeable', ({key}) => {
	publishQuery(getQuery( ) + key)
})
.on(':press-backspace', ({key}) => {
	publishQuery(getQuery( ).slice(0, -1))
})
.on(':press-escape', ({key}) => {
	publishQuery('')
})





$( ( ) => publishQuery(getQuery( )) )
