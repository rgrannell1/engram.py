
const cache = Cache(function (bookmark) {
	return bookmark.bookmark_id
})




const cacheRoute = 'http://' + document.domain + ':' + location.port + '/bookmarks/cache'
const socket     = io.connect(cacheRoute)




console.log(cache)





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
