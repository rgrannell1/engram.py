

ENGRAM.eventBus.subscribe(':press-typeable', ({key}) => {

	ENGRAM.QUERY += key

	ENGRAM.eventBus.publish(':update-query', {
		query: ENGRAM.QUERY
	})

})

ENGRAM.eventBus.subscribe(':press-backspace', ({key}) => {

	ENGRAM.QUERY = ENGRAM.QUERY.slice(0, -1)

	ENGRAM.eventBus.publish(':update-query', {
		query: ENGRAM.QUERY
	})

})

ENGRAM.eventBus.subscribe(':press-escape', ({key}) => {

	ENGRAM.QUERY = ''

	ENGRAM.eventBus.publish(':update-query', {
		query: ENGRAM.QUERY
	})

})
