
const cache = Cache(function (bookmark) {
	return bookmark.bookmark_id
})













/*
	fetchChunk :: number -> [object]

	load a set number of bookmarks into the cache.

*/

const fetchChunk = function (min_id) {

	const chunkSize = 50
	const url       = '/api/bookmarks?min_id=' + id + '&amount=' + chunkSize

	$.ajax({
		url: url,
		dataType: 'json',
		success: function (data) {

			data.map(function (entry) {
				cache.add(entry)
			})

		},
		failure: function (data) {
			throw "chunk didn't load."
		}
	})

}
