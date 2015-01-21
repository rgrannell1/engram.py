
const cache = Cache(function (bookmark) {

	const id = bookmark.bookmark_id

	if (!is.number(id)) {
		throw TypeError("id was not a number: " + JSON.stringify(bookmark))
	}
	if (id <= 0) {
		throw RangeError("invalid size for a bookmark id: " + id)
	}

	return bookmark.bookmark_id

})





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
	fetchChunk :: number -> [object]

	load a set number of bookmarks into the cache.

*/

const fetchChunk = function (maxID, cache, callback) {

	if (!is.number(maxID)) {
		throw TypeError('fetchChunk: maxID was not a number (actual value: ' + JSON.stringify(maxID) + ')')
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
			throw "chunk didn't load."
		}
	})

}





const syncCache = function (cache, callback) {

	const pollUntilEmpty = function (cacheData) {

		if (cacheData.dataLength === 0 || cacheData.nextID <= 0) {
			callback(cacheData.cache)
		} else {

			setTimeout(function () {
				fetchChunk(cacheData.nextID, cache, pollUntilEmpty)
			}, ENGRAM.LOADINTERVAL)

		}

	}

	fetchChunk(ENGRAM.BIGINT, cache, pollUntilEmpty)

}





syncCache(cache, function (cache) {
	console.log('loaded all ' + cache.contents.length + ' chunks.')
})
