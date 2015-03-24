
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
			.map((ith, link) => {

				return {
					url:   $(link).attr('href'),
					ctime: $(link).attr('time_added')
				}

			})
			.sort((bookmark0, bookmark1) => {
				return bookmark0.ctime - bookmark1.ctime
			})

		callback(bookmarkData)

	}

}





var uploadFile = (retries, callback) => {

	var $uploader = $('#uploader')
	var files     = $uploader.prop('files')

	if ( is.undefined(files[0]) ) {

		setTimeout(uploadFile.bind({ }, retries - 1, callback), 100)

	} else if (retries === 0) {
		throw Error('expired.')
	} else {

		var reader    = new FileReader( )
		reader.readAsDataURL(files[0])

		reader.onload = readDataURL.bind({ }, reader, callback)

	}
}





var host = path => {
	return location.protocol + '//' + location.hostname + ':' + location.port + '/' + path
}





var sendBookmarks = function (bookmarks) {

	var entityBody = bookmarks
		.map((ith, bookmark) => {
			return {
				url:   encodeURIComponent(bookmark.url),
				ctime: bookmark.ctime
			}
		})
		.sort((bookmark0, bookmark1) => {
			return bookmark0.ctime - bookmark1.ctime
		})

	$.ajax({
		type: "POST",
		url:  '/api/resave',

		dataType : "json",
		data: JSON.stringify({data: entityBody}),
		headers: {
			'Content-Type': 'application/json'
		}
	})

}





$(( ) => {
	$('#uploader').on('click', uploadFile.bind({ }, 1000, sendBookmarks))
})
