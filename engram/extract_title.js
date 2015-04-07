#!/usr/bin/env node

var request = require('request')
var $       = require('cheerio')
var docopt  = require('docopt').docopt





var docs = [
	"Usage:",
	"    script <uri>",
	"    script (-h | --help | --version)"
]
.join('')



var args = docopt(docs)
var opts = {
	url:     args['<uri>'],
	headers: {
		'Use-Agent': 'Mozilla/5.0 (Windows NT 6.0) AppleWebKit/537.31 (KHTML, like Gecko) Chrome/26.0.1410.43 Safari/537.31'
	}
}





request(opts, function (err, res, body) {

	if (err || res.statusCode >= 400) {

		process.stdout.write( JSON.stringify({

			data: { },

			status: {
				errored: true,
				code:    res.statusCode
			}

		}) )

	} else {

		$body      = $(body)
		var h1     = $body.find('h1')
		var title  = $body.find('title')

		var h1Text = h1.length === 0
			? ''
			:  h1.first( ).text( ).trim( )

		var titleText = title.length === 0
			? ''
			: title.first( ).text( ).trim( )





		process.stdout.write( JSON.stringify({

			data: {
				h1:    h1Text,
				title: titleText
			},

			status: {
				errored: false,
				code:    NaN
			}

		}) )

	}


})
