#!/usr/bin/env python3

import re
import utils

import urllib

import lxml
import lxml.html as lh

import subprocess


from normalise_uri import normalise_uri
from result import Success, Failure

import mimetype

from request_url import request_url
from pdfminer import pdfparser

import io




def is_html(type):
	""""determine whether a mimetype says a resource is a html
	file.
	"""

	return type in set(['text/html', 'application/xhtml+xml'])




def is_pdf(type):
	return type in set(['application/pdf', 'application/x-pdf'])




def extract_resource_name(uri):
	"""get the resource name from a uri.
	"""

	return (
		Success(uri)
		.then(normalise_uri)
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

		if content_result.is_success( ):
			# -- decoding as utf-8 worked.

			content      = content_result.from_success( )

			title_regexp = re.compile('<title[^>]*>([^<]+)</title>')
			title_match  = title_regexp.search(content)

			if title_match:
				# -- the title exists; extract it.
				return Success(title_match.group( ))
			else:
				# -- no title; just use network location.
				return Success(get_netloc(uri))

		else:
			# -- the content-type header most likely lied.
			# -- Damned content-type header.

			return Success(get_netloc(uri))





def extract_html_title(content_type, uri, response):
	# -- extract the title tag.
	# -- default to utf-8, a superset of iso-8859 encoding.

	charset = content_type['params'].get('charset', 'utf-8').lower( )

	if charset in {'iso-8859-1', 'utf-8', 'utf8'}:
		return(extract_utf8_title(uri, response))
	else:
		# -- add iso8859-1 support
		return(get_netloc(uri))





def extract_pdf_title(content_type, uri, response):
	"""
	extract a title from a pdf file.
	"""

	try:

		stream = io.BytesIO(response.content)

		# -- such a beautiful api; wtf is this crap even doing?

		parser = pdfparser.PDFParser(stream)

		doc    = pdfparser.PDFDocument( )
		parser.set_document(doc)
		doc.set_parser(parser)

		doc.initialize( )

		return Success(doc.info[0]['Title'])

	except Exception as err:
		# -- in the extraordinarily unlikely case the solid code above doesn't work \s,
		# -- fall back to extracting the resource name.

		return extract_resource_name(uri)






def extract_title(uri, response):
	"""given a uri, response obtained from looking up that uri, pick a title for
	the bookmark uri.

	If the resource is a html page, use the contents of the <title> tag. Otherwise
	just use the resource basename.
	"""

	content_type_result = mimetype.parse(response.headers['content-type'])






	if content_type_result.is_failure( ):

		return content_type_result

	else:

		content_type = content_type_result.from_success( )
		mime         = content_type['type'] + '/' + content_type['subtype']

		if is_html(mime):

			return extract_html_title(content_type_result.from_success( ), uri, response)

		elif is_pdf(mime):

			return extract_pdf_title(content_type_result.from_success( ), uri, response)

		else:
			return extract_resource_name(uri)





def extract_metadata(uri):
	"""
	extract additional data about a uri from the resource itself.
	"""

	response_result = (
		Success(uri)
		.then(normalise_uri)
		.then(request_url)
	)

	return (
		response_result
		.then(lambda response: extract_title(uri, response))
	)
