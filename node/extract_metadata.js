#!/usr/bin/env node

var request = require('request')
var $       = require('cheerio')
var docopt  = request('docopt')





var docs = [
	"Usage:",
	"    script <uri>",
	"    script (-h | --help | --version)"
]




var args = docopt(docs)





request('http://en.wikipedia.org/wiki/Dendrocnide_moroides?', function (err, res, body) {

	if (err || res.statuscode) {

		process.stderr.write()

	} else {

		$body     = $(body)

		var h1    = $body.find('h1').text( )
		var title = $body.find('title').text( )




		process.stdout.write(
			JSON.stringify({h1: h1, title: title})
		)

	}


})
