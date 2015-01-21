
const cache = Cache(function (bookmark) {
	return bookmark.bookmark_id
})





/*
	fetchChunk :: number -> [object]

	load a set number of bookmarks into the cache.

*/

const fetchChunk = function (maxID, cache, callback) {

	console.log('fetchChunk:' + maxID)

	const chunkSize = 20
	const url       = '/api/bookmarks?maxID=' + maxID + '&amount=' + chunkSize

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
				nextId:     response.nextID
			})

		},
		failure: function (response) {
			throw "chunk didn't load."
		}
	})

}





const syncCache = function (cache, callback) {

	const biggestInteger = 9007199254740992

	const pollUntilEmpty = function (cacheData) {

		if (cacheData.dataLength === 0 || cacheData.nextID <= 0) {
			callback(cacheData.cache)
		} else {

			console.log('cacheData.nextId', cacheData)

			setTimeout(function () {
				fetchChunk(cacheData.nextId, cache, pollUntilEmpty)
			}, 500)

		}

	}

	fetchChunk(biggestInteger, cache, pollUntilEmpty)

}





syncCache(cache, function () {

	console.log('done!')

})
