#!/usr/bin/env python

import utils

import urllib2
import lxml.html as lh

import subprocess

from result import Success, Failure





def is_html(type):
	""""determine whether a mimetype says a resource is a html
	file.
	"""

	return type in set(['text/html', 'application/xhtml+xml'])





def extract_title(url, response, mimetype):

	if is_html(mimetype['type']):
		# -- extract the title tag.

		return (
			Success(response)
			.then(lh.parse)
			.then(lambda page: page.find('.//title').text)
		)

	else:
		# -- extract the resource name from the url.

		return (
				Success(url)
				.then(urllib2.urlparse.urlparse)
				.then(lambda parts: parts[2].rpartition('/')[2])
			)






def extract_metadata(url):

	# -- fails for non-html resources.

	response_result = (
		Success(url)
		.then(urllib2.urlopen)
	)

	content_type_result = (
		response_result
		.then(lambda response: {
			'type':     response.info().type,
			'maintype': response.info().maintype,
			'subtype':  response.info().subtype
		})
	)

	return (
		response_result
		.cross([content_type_result])
		.then( lambda data: extract_title(url, data[0], data[1]) )
	)
