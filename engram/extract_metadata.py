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
import mimetype





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





def get_netloc(uri):
	"""get_netloc
	"""
	return (
		Success(uri)
		.then(urllib.parse.urlparse)
		.then(lambda parts: parts.netloc)
	)





def charset(mime):
	"""get the character set from a page's content-type."""

	return mimetype.parse(mime)['params'].get('charset', 'utf-8')





def request_uri(uri):
	"""
	get the resource associated with a uri.
	"""

	try:
		# -- todo; eliminate pesky assignment so can be put into chain of Success then's.

		user_agent = 'Mozilla/5.0 (Windows NT 6.0) AppleWebKit/537.31 (KHTML, like Gecko) Chrome/26.0.1410.43 Safari/537.31'

		response = requests.get(uri, headers = {
			'User-agent': user_agent,
			'Connection': 'close'
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





def extract_utf8_title(uri, response):
	"""extract a page title from a utf-8 html page.
	"""

	parsed = lh.fromstring(response.content)
	title  = parsed.find('.//title')

	if not (title is None) and not (title.text is None):
		return Success(title.text)
	else:
		# -- most likely caused by lxml's problems with UTF;
		# -- use a regular expression fallback.

		content_result = (
			Success(response.content)
			.then(lambda content: content.decode('utf-8'))
		)

		if content_result.is_success():
			# -- decoding as utf-8 worked.

			content      = content_result.from_success()

			title_regexp = re.compile('<title[^>]*>([^<]+)</title>')
			title_match  = title_regexp.search(content)

			if title_match:
				# -- the title exists; extract it.
				return Success(title_match.group())
			else:
				# -- no title; just use network location.
				return Success(get_netloc(uri))

		else:
			# -- the content-type header most likely lied.
			# -- Damned content-type header.

			return Success(get_netloc(uri))










def extract_title(uri, response):
	"""given a uri, response obtained from looking up that uri, pick a title for
	the bookmark uri.

	If the resource is a html page, use the contents of the <title> tag. Otherwise
	just use the resource basename.
	"""

	mime = mimetype.parse(response.headers['content-type'])

	if is_html(mime['type'] + '/' + mime['subtype']):
		# -- extract the title tag.
		# -- default to utf-8, a superset of iso-8859 encoding.

		charset = mime['params'].get('charset', 'utf-8')

		if charset in {'iso-8859-1', 'utf-8'}:
			return(extract_utf8_title(uri, response))
		else:
			# -- add iso8859-1 support
			return(get_netloc(uri))

	else:
		# -- extract the resource name from the url.

		return (
			Success(uri)
			.then(normalise_uri)
			.then(extract_resourcename)
		)





def extract_metadata(uri):
	"""
	extract additional data about a uri from the resource itself.
	"""

	response_result = (
		Success(uri)
		.then(normalise_uri)
		.then(request_uri)
	)

	return (
		response_result
		.then(lambda response: extract_title(uri, response))
	)

