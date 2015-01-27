#!/usr/bin/env python3

import utils

import urllib
import lxml.html as lh
import httplib2

import subprocess

from normalise_uri import normalise_uri

from result import Success, Failure





def is_html(type):
	""""determine whether a mimetype says a resource is a html
	file.
	"""

	return type in set(['text/html', 'application/xhtml+xml'])





def extract_title(uri, response, mimetype):
	"""given a uri, response obtained from looking up that uri, and the mimetype
	of the response, pick a title for the bookmark uri.

	If the resource is a html page, use the contents of the <title> tag. Otherwise
	just use the resource basename.
	"""

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
				Success(uri)
				.then(normalise_uri)
				.then(urllib.parse.urlparse)
				.then(lambda parts: parts[2].rpartition('/')[2])
		)




def request_uri(uri):
	"""
	get the resource associated with a uri.
	"""

	# -- todo; eliminate pesky assignment so can be put into chain of Success then's.

	try:

		opener            = urllib.request.build_opener()
		opener.addheaders = [('User-agent', 'Mozilla/5.0')]

		return Success(opener.open(uri))

	except Exception as err:
		return Failure(err)






def extract_metadata(url):
	"""
	extract additional data about a uri from the resource itself.
	"""

	response_result = (
		Success(url)
		.then(normalise_uri)
		.then(request_uri)
	)

	content_type_result = (
		response_result
		.then(lambda response: {
			'type':     response.info().get_content_type(),
			'maintype': response.info().get_content_maintype(),
			'subtype':  response.info().get_content_subtype()
		})
	)

	return (
		response_result
		.cross([content_type_result])
		.then( lambda data: extract_title(url, data[0], data[1]) )
	)