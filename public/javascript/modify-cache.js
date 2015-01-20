
const cache = Cache(function (bookmark) {
	return bookmark.bookmark_id
})














const requestBookmarks = function (min_id) {

	const chunkSize = 50
	const url       = 'bookmarks?min_id=' + id + '&number=' + chunkSize

	$.ajax({
		url: url,
		dataType: 'json',
		success: function (data) {
			console.log('data.')
		},
		failure: function (data) {
			console.log('failed.')
		}
	})

}



















const requestBookmarks = function (socket, min_id) {

	const chunkSize = 50

	socket.emit('request-bookmarks', {
		min_id: min_id,
		amount: chunkSize
	})

}

const recieveBookmarks = function (socket) {
	socket.on('request-bookmarks', function (data) {
		console.log(data)
	})
}

const fillCache = function (socket) {

	requestBookmarks(socket)

}
