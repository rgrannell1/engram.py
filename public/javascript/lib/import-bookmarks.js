
var readDataURL = function (reader, callback) {

	var dataURL      = reader.result
	var contentType  = "data:text/html;base64,"

	if (!dataURL.startsWith(contentType)) {
		alert('invalid data uri.')
	} else {

		var htmlBase64 = dataURL.slice(contentType.length)
		var html       = atob(htmlBase64)

		// -- watch out for code-execution here.
		var $bookmarks   = $($.parseHTML(html))
		var bookmarkData = $bookmarks
			.find('a')
			.map(function (ith, link) {

				return {
					url:   $(link).attr('href'),
					ctime: $(link).attr('time_added')
				}

			})
			.sort(function (bookmark0, bookmark1) {
				return bookmark0.ctime - bookmark1.ctime
			})

		callback(bookmarkData)

	}

}





var uploadFile = function (retries, callback) {

	var $uploader = $('#uploader')
	var files     = $uploader.prop('files')

	if ( is.undefined(files[0]) ) {

		setTimeout(uploadFile.bind({}, retries - 1, callback), 100)

	} else if (retries === 0) {
		throw Error('expired.')
	} else {

		var reader  = new FileReader()
		reader.onload = readDataURL.bind({}, reader, callback)
		reader.readAsDataURL(files[0])

	}
}





var host = function (path) {
	return location.protocol + '//' + location.hostname + ':' + location.port + '/' + path
}





var sendBookmarks = function (bookmarks) {

	if (bookmarks.length === 0) {

		console.log( 'done.' )
		return

	} else {

		var url = 'api/resave/' + encodeURIComponent(bookmarks[0].url)

		$.ajax({
			type: "POST",
			url:  host(url),

			dataType : "json",
			data: JSON.stringify({
				url:   url,
				ctime: bookmarks[0].ctime
			}),
			headers: {
				'Connection':   'keep-alive',
				'Content-Type': 'application/json'
			}
		})
		.done(function () {
			setTimeout(function () { sendBookmarks(bookmarks.slice(1)) }, 50)
		})
		.fail(function () {
			setTimeout(function () { sendBookmarks(bookmarks.slice(1)) }, 50)
		})

	}
}





$(function () {

	$('#uploader').on('click', uploadFile.bind({}, 1000, sendBookmarks))

})
