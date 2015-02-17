
const readDataURL = function (reader) {

	const dataURL      = reader.result
	const contentType  = "data:text/html;base64,"

	if (!dataURL.startsWith(contentType)) {
		alert('invalid data uri.')
	} else {

		const htmlBase64 = dataURL.slice(contentType.length)
		const html       = atob(htmlBase64)

	}

}





const uploadFile = function () {

	const $uploader = $('#uploader')
	const files     = $uploader.prop('files')

	if ( is.undefined(files[0]) ) {
		setTimeout(uploadFile, 100)
	} else {

		const reader  = new FileReader()
		reader.onload = function () {

		}
		reader.readAsDataURL(files[0])

	}
}





$(function () {

	$('#uploader').on('click', uploadFile)
	$('#uploader').click()

})
