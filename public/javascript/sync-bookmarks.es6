"use strict"

{

	// -- request all bookmarks below a given id number.

	let requestBookmarks = (maxID, call) => {

		requestBookmarks.precond(maxID)

		$.ajax({
			url:      `/api/bookmarks?max_id=${maxID}&amount=${ENGRAM.PERREQUEST}`,
			dataType: 'json',
			success: ({data, next_id}) => {

				data.forEach(bookmark => {
					ENGRAM.eventBus.publish(':load-bookmark', bookmark)
				})

				callback({data, next_id})

			},
			failure: res => {
				console.log('internal failure: bookmark chunk failed to load.')
			}

		})

	}

	requestBookmarks.precond = maxID => {

		is.always.number(maxID, maxID => {
			`requestBookmarks: maxID was not a number (actual value: ${ JSON.stringify(maxID) })`
		})

	}





	ENGRAM.syncBookmarks = requestBookmarks.bind({ }, ENGRAM.BIGINT, ({data, next_id}) => {

		next_id > 0
			? setTimeout(requestBookmarks, ENGRAM.loadInterval, next_id)
			: console.log('loaded all bookmarks.')

	})

}
