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




request(args['<uri>'], function (err, res, body) {

	if (err || res.statuscode) {

		process.stdout.write( JSON.stringify({

			data: { },

			status: {
				errored: true,
				code:    res.statuscode
			}

		}) )

	} else {

		$body     = $(body)

		var h1    = $body.find('h1')
		var title = $body.find('title')




		process.stdout.write( JSON.stringify({

			data: {
				h1: h1.length    > 0
					? h1.first( ).text( )
					: '',

				title: title.length > 0
					? title.first( ).text( )
					: ''
			},

			status: {
				errored: false,
				code:    NaN
			}

		}) )

	}


})
