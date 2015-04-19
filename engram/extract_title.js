#!/usr/bin/env node

var request = require('request')
var $       = require('cheerio')
var docopt  = require('docopt').docopt
var juice   = require('juice')




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




var addHeaders = function (url) {

	return {
		url: url,
		headers: {
			'Use-Agent': 'Mozilla/5.0 (Windows NT 6.0) AppleWebKit/537.31 (KHTML, like Gecko) Chrome/26.0.1410.43 Safari/537.31'
		}
	}

}






var extractTitleTags = function (html) {

	var extractTitles = function (tag) {

		var $tag = $(html).find(tag)

		if ($tag.length === 0) {

			return [ ]

		} else if ($tag.length === 1) {

			return [{
				'text':      $tag.text( ).trim( ),
				'font-size': $tag.css('font-size') || -1
			}]

		} else {

			return $tag.map(function (ith, elem) {

				return {
					'text':      $(elem).text( ).trim( ),
					'font-size': $(elem).css('font-size') || -1
				}

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





var extractPDFTitle = function (content) {
	return ""
}






var mimetype = ( function ( ) {

	var isMimetype = function (mimetypes, contentType) {

		for (var ith = 0; ith < mimetypes.length; ++ith) {
			if (contentType.indexOf(mimetypes[ith]) == 0) {
				return true
			}
		}

		return false

	}





	return {
		isHTML: isMimetype.bind({ }, [
			'text/html', 'application/xhtml+xml']),

		isPDF:  isMimetype.bind({ }, [
			'application/pdf', 'application/x-pdf'])
	}

} )()





var collect = function (jobs, callback) {

	var errors  = [ ]
	var results = [ ]

	jobs.forEach(function (fn) {

		fn(function (err, data) {
			err ? errors.push(err) : results.push(data)
		})

	})





	var pid = setInterval(function ( ) {

		if (errors.length + results.length === jobs.length) {
			clearInterval(pid)
			callback(errors, results)
		}

	}, 250)

}




var extractCSS = function ($html, callback) {

	var urls =
		$html
		.find('link')
		.filter(function (ith, elem) {
			return $(elem).attr('rel') === 'stylesheet'
		})
		.map(function (ith, elem) {
			return $(elem).attr('href')
		})
		.get( )





	var urlJobs = urls.map(function (url) {

		return function (callback) {
			request(addHeaders(url), function (err, res, body) {

				callback(err, {res: res, body: body})

			})
		}

	})





	collect(urlJobs, function (errors, results) {

		callback(errors, results.reduce(function (html, result) {

			try {
				return juice.inlineContent(html, result.body)
			} catch (err) {
				process.stderr.write('error!\n')
				return html
			}


		}, $html))

	})

}





request(addHeaders(args['<uri>']), function (err, res, body) {

	if (err || res.statusCode >= 400) {

		process.stdout.write( JSON.stringify({

			data: [ ],

			status: {
				errored: true,
				code:    res.statusCode
			}

		}) )

	} else {

		var contentType = res.headers['content-type']

		if (mimetype.isHTML(contentType)) {

			extractCSS($(body), function (errors, html) {

				if (errors) {
					process.stderr.write('errors occurred.')
				}

				extractTitleTags(html)
			})

		}

		if (mimetype.isPDF(contentType)) {
			extractPDFTitle(body)
		}

	}

})
