
ENGRAM.cache = ENGRAM.Cache(function (bookmark) {
	// this callback takes a bookmark and gives you its id.

	const id = bookmark.bookmark_id

	if (!is.number(id)) {
		throw TypeError("id was not a number: " + JSON.stringify(bookmark))
	}
	if (id <= 0) {
		throw RangeError("invalid size for a bookmark id: " + id)
	}

	return bookmark.bookmark_id

})

ENGRAM.cache.isSynced = false













/*
	syncCache :: Cache x function -> undefined

	given an empty cache object and a function,
	load all the entries stored in the cache on the server into
	the empty cache side-effectually, and execute a thunk
	on completion.

*/

ENGRAM.syncCache = ( function () {

	/*
		bookmarkRequest :: number x number -> string

		create a URL to request a certain amount of bookmarks with IDs smaller than an upper limit.
	*/

	const bookmarkRequest = function (maxID, amount) {

		if (maxID <= 0) {
			throw RangeError("attempted to use " + maxID + " as a maxID (too small)")
		}

		if (amount <= 0) {
			throw RangeError("attempted to use " + maxID + " as an amount (too small)")
		}

		return '/api/bookmarks?max_id=' + maxID + '&amount=' + ENGRAM.PERREQUEST
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

				if (!is.number(response.next_id)) {
					throw TypeError("response.next_id is not a number.")
				}

				if (!is.array(response.data)) {
					throw TypeError("response.data is not a array.")
				}

				response.data.forEach(function (bookmark) {

					bookmark.metadata = {
						queryScores: {}
					}

					cache.add(bookmark)

				})

				callback({
					cache:      cache,
					dataLength: response.data.length,
					nextID:     response.next_id
				})

			},
			failure: function (response) {
				throw "internal error: chunk didn't load."
			}
		})

	}





	return function (cache, callback) {

		const startTime = new Date

		const loadAllChunks = function (cacheData) {

			if (cacheData.dataLength === 0 || cacheData.nextID <= 0) {
				callback(startTime, cacheData.cache)
			} else {

				setTimeout(function () {
					requestChunk(cacheData.nextID, cache, loadAllChunks)
				}, ENGRAM.LOADINTERVAL)

			}

		}

		requestChunk(ENGRAM.BIGINT, cache, loadAllChunks)

	}

} )()







ENGRAM.syncCache(ENGRAM.cache, function (startTime, cache) {

	console.log('loaded all ' + cache.contents.length + ' bookmarks in ' + (new Date - startTime) + ' milliseconds.')
	ENGRAM.cache.isSynced = true

})
