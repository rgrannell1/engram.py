
const cache = Cache(function (bookmark) {
	return bookmark.bookmark_id
})





/*
	fetchChunk :: number -> [object]

	load a set number of bookmarks into the cache.

*/

const fetchChunk = function (maxID, cache, callback) {

	const url = '/api/bookmarks?maxID=' + maxID + '&amount=' + ENGRAM.PERREQUEST

	$.ajax({
		url: url,
		dataType: 'json',
		success: function (response) {

			response.data.map(function (entry) {
				cache.add(entry)
			})

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

	const loadInterval   = 500

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
