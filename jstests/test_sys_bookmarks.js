
const page = require('webpage').create()
page.open('http://localhost:5000/bookmarks', function (status) {

	page.render('example.png')
	phantom.exit()

})
