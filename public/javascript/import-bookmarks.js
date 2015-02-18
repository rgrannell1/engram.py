
const readDataURL = function (reader, callback) {

	const dataURL      = reader.result
	const contentType  = "data:text/html;base64,"

	if (!dataURL.startsWith(contentType)) {
		alert('invalid data uri.')
	} else {

		const htmlBase64 = dataURL.slice(contentType.length)
		const html       = atob(htmlBase64)

		// -- watch out for code-execution here.
		const $bookmarks   = $($.parseHTML(html))
		const bookmarkData = $bookmarks.find('a').map(function (ith, link) {
			return {
				url: $(link).attr('href')
			}
		})

		callback(bookmarkData)

	}

}





const uploadFile = function (retries, callback) {

	const $uploader = $('#uploader')
	const files     = $uploader.prop('files')

	if ( is.undefined(files[0]) ) {

		setTimeout(uploadFile.bind({}, retries - 1, callback), 100)

	} else if (retries === 0) {
		throw Error('expired.')
	} else {

		const reader  = new FileReader()
		reader.onload = readDataURL.bind({}, reader, callback)
		reader.readAsDataURL(files[0])

	}
}





const host = function (path) {
	return location.protocol + '//' + location.hostname + ':' + location.port + '/' + path
}




const sendBookmarks = function (bookmarks) {

	$(bookmarks).each(function (ith, bookmark) {

		$.ajax({
			url: host(bookmark.url),
			headers: {
				'Connection': 'keep-alive'
			}
		})

	})

}





$(function () {

	$('#uploader').on('click', uploadFile.bind({}, 1000, sendBookmarks))

})
