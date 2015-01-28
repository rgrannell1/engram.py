#!/usr/bin/env python3

import re
import utils

import http
import urllib

import lxml
import lxml.html as lh

import httplib2

import subprocess


from normalise_uri import normalise_uri

from result import Success, Failure

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





def extract_resourcename(uri):
	"""get the resource name from a uri.
	"""

	return (
		Success(uri)
		.then(urllib.parse.urlparse)
		.then(lambda parts: parts[2].rpartition('/')[2])
	)





def remove_scheme(uri):

	return (
		Success(uri)
		.then(urllib.parse.urlparse)
		.then(lambda parts: parts.netloc)
	)





def find_title_tag(page):
	"""get the contents of the page's title tag.
	"""

	title = page['parsed'].find('.//title')

	if title is None:

		title_regexp = '<title[^>]*>([^<]+)</title>'
		has_title    = re.search(title_regexp, page['content'])

		if has_title:
			return re.search(title_regexp, has_title).group()
		else:
			return remove_scheme(page['url'])

	else:
		return Success(title.text)





def parse_html(response):

	return {
		'url':     response.url,
		'parsed':  lh.fromstring(response.content),
		'content': response.content.decode('utf-8')
	}





def request_uri(uri):
	"""
	get the resource associated with a uri.
	"""

	try:
		# -- todo; eliminate pesky assignment so can be put into chain of Success then's.

		response = requests.get(uri, headers = {
			'User-agent': 'Mozilla/5.0 (Windows NT 6.0) AppleWebKit/537.31 (KHTML, like Gecko) Chrome/26.0.1410.43 Safari/537.31'
		})

		return response

	except http.client.BadStatusLine as err:

		return Failure({
			'message': "%s returned an unrecognised status." % (uri, ),
			'code':    404
		})

	except requests.exceptions.ConnectionError as err:

		return Failure({
			'message': "%s refused the connection." % (uri, ),
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
				.then(extract_resourcename)
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

