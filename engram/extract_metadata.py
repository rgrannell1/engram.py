#!/usr/bin/env python3

import utils

import http
import urllib

import lxml
import lxml.html as lh

import httplib2

import subprocess

from normalise_uri import normalise_uri

from result import Success, Failure

import re
import requests




def mimetype(content_type):
	return {
		'maintype': content_type.split('/')[0],
		'subtype':  content_type.split('/')[1].split(';')[0],
		'type':     content_type.split(';')[0]
	}





def is_html(type):
	""""determine whether a mimetype says a resource is a html
	file.
	"""

	return type in set(['text/html', 'application/xhtml+xml'])





def find_title_tag(page):
	"""get the contents of the page's title tag.
	"""

	title = page['parsed'].find('.//title')

	if title is None:

		title_regexp ='<title[^>]*>([^<]+)</title>'
		return Success(page['content'])

	else:
		return Success(title.text)





def parse_html(response):

	return {
		'parsed':  lh.fromstring(response.content),
		'content': response.content
	}





def request_uri(uri):
	"""
	get the resource associated with a uri.
	"""

	try:
		# -- todo; eliminate pesky assignment so can be put into chain of Success then's.

		response = requests.get(uri, headers = {
			'User-agent': 'Mozilla/5.0'
		})

		return response

	except http.client.BadStatusLine as err:

		return Failure({
			'message': "%s returned an unrecognised status." % (uri, ),
			'code':    404
		})

	except Exception as err:
		return Failure(err)





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
			.then(parse_html)
			.then(find_title_tag)
		)

	else:
		# -- extract the resource name from the url.

		return (
				Success(uri)
				.then(normalise_uri)
				.then(urllib.parse.urlparse)
				.then(lambda parts: parts[2].rpartition('/')[2])
		)





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
			'type':     mimetype(response.headers['content-type'])['type'],
			'maintype': mimetype(response.headers['content-type'])['maintype'],
			'subtype':  mimetype(response.headers['content-type'])['subtype']
		})
	)

	return (
		response_result
		.cross([content_type_result])
		.then( lambda data: extract_title(url, data[0], data[1]) )
	)
