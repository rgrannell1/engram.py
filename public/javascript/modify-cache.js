
ENGRAM.cache = ENGRAM.Cache(function (bookmark) {

	const id = bookmark.bookmark_id

	if (!is.number(id)) {
		throw TypeError("id was not a number: " + JSON.stringify(bookmark))
	}
	if (id <= 0) {
		throw RangeError("invalid size for a bookmark id: " + id)
	}

	return bookmark.bookmark_id

})















/*
	syncCache :: Cache x function -> undefined

	given an empty cache object and a function,
	load all the entries stored in the cache on the server into
	the empty cache side-effectually, and execute a thunk
	on completion.

*/

ENGRAM.syncCache = ( function () {





	const bookmarkRequest = function (maxID, amount) {

		if (maxID <= 0) {
			throw RangeError("attempted to use " + maxID + " as a maxID (too small)")
		}

		if (amount <= 0) {
			throw RangeError("attempted to use " + maxID + " as an amount (too small)")
		}

		return '/api/bookmarks?maxID=' + maxID + '&amount=' + ENGRAM.PERREQUEST
	}





	/*
		requestChunk :: number -> [object]

		load a set number of bookmarks into the cache.

	*/

	const requestChunk = function (maxID, cache, callback) {

		if (!is.number(maxID)) {
			throw TypeError('requestChunk: maxID was not a number (actual value: ' + JSON.stringify(maxID) + ')')
		}

		$.ajax({
			url: bookmarkRequest(maxID, ENGRAM.PERREQUEST),
			dataType: 'json',
			success: function (response) {

				response.data.map(cache.add)

				callback({
					cache:      cache,
					dataLength: response.data.length,
					nextID:     response.nextID
				})

			},
			failure: function (response) {
				throw "internal error: chunk didn't load."
			}
		})

	}





	return function (cache, callback) {

		const loadAllChunks = function (cacheData) {

			if (cacheData.dataLength === 0 || cacheData.nextID <= 0) {
				callback(cacheData.cache)
			} else {

				setTimeout(function () {
					requestChunk(cacheData.nextID, cache, loadAllChunks)
				}, ENGRAM.LOADINTERVAL)

			}

		}

		requestChunk(ENGRAM.BIGINT, cache, loadAllChunks)

	}

} )()







ENGRAM.syncCache(ENGRAM.cache, function (cache) {
	console.log('loaded all ' + cache.contents.length + ' chunks.')
})
