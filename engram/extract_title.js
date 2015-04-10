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

			data: [ ],

			status: {
				errored: true,
				code:    res.statusCode
			}

		}) )

	} else {

		var extractTitles = function (tag) {

			var $tag = $(body).find(tag)

			if ($tag.length === 0) {
				return [ ]
			} else if ($tag.length === 1) {
				return [$tag.text( ).trim( )]
			} else {

				return $tag.map(function (ith, elem) {
					return $(elem).text( ).trim( )
				}).get( )

			}

		}

		process.stdout.write( JSON.stringify({

			data: Array.prototype.concat.apply([ ], ['title', 'h1'].map(extractTitles)),

			status: {
				errored: false,
				code:    NaN
			}

		}) )

	}


})
