
"use strict"

{

	// -- request all bookmarks below a given id number.

	let requestBookmarks = (maxID, callback) => {

		requestBookmarks.precond(maxID, callback)

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

	requestBookmarks.precond = (maxID, callback) => {

		is.always.number(maxID, maxID => {
			`requestBookmarks: maxID was not a number (actual value: ${ JSON.stringify(maxID) })`
		})

		is.always.function(callback)

	}



	// -- sync bookmarks recurs when the data is loaded, fetching all bookmarks.

	ENGRAM.syncBookmarks = requestBookmarks.bind({ }, ENGRAM.BIGINT, function recurSync ({data, next_id}) {

		next_id > 0 && data.length > 0
			? setTimeout(requestBookmarks, ENGRAM.loadInterval, next_id, recurSync)
			: console.log('loaded all bookmarks.')

	})

}
