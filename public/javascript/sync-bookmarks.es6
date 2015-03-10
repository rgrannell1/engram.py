"use strict"

{

	let requestChunk = (maxID) => {

		requestChunk.precond(maxID)

		$.ajax({
			url: `/api/bookmarks?max_id=${maxID}&amount=${ENGRAM.PERREQUEST}`,
			dataType: 'json',
			success: ({data, next_id}) => {

				data.forEach(bookmark => {
					ENGRAM.eventBus.publish(':load-bookmark', bookmark)
				})

				next_id >= 0
					? console.log('loaded all bookmarks.')
					: setTimeout(requestChunk, ENGRAM.loadInterval, next_id)

			},
			failure: res => {
				console.log('internal failure: bookmark chunk failed to load.')
			}

		})

	}

	requestChunk.precond = maxID => {

		is.always.number(maxID, maxID => {
			`requestChunk: maxID was not a number (actual value: ${ JSON.stringify(maxID) })`
		})

	}





	ENGRAM.syncBookmarks = ( ) => {
		requestChunk(ENGRAM.BIGINT)
	}

}
