
var setQuery = query => {

	ENGRAM.eventBus.publish(':update-query', {
		query: query
	})

}




ENGRAM.eventBus
.subscribe(':press-typeable', ({key}) => {
	setQuery(getQueryParam('q') + key)
})
.subscribe(':press-backspace', ({key}) => {
	setQuery(getQueryParam('q').slice(0, -1))
})
.subscribe(':press-escape', ({key}) => {
	setQuery('')
})




var getQueryParam = param => {

	var match  = RegExp('[?&]' + param + '=([^&]*)').exec(window.location.search)
	var result = match && decodeURIComponent(match[1].replace(/\+/g, ' '))

	return is.null(result) ? '' : result

}





$(( ) => {
	setQuery(getQueryParam('q'))
})
