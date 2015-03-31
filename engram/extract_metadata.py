
#!/usr/bin/env python3

import re
import utils

import urllib

import lxml
import lxml.html as lh

import subprocess


from normalise_uri import normalise_uri
from result import Success, Failure, Result

import mimetype
from pdfminer import pdfparser

import io
import signal

import logging
logging.basicConfig(level =  logging.INFO)
logger = logging.getLogger(__name__)






def extract_resource_name(uri):
	"""get the resource name from a uri.
	"""

	return (
		Result.of(lambda: normalise_uri(uri))
		.then(urllib.parse.urlparse)
		.then(lambda parts: parts[2].rpartition('/')[2])
	)





def get_netloc(uri):
	"""get_netloc
	"""
	return (
		Result.of(lambda: urllib.parse.urlparse(uri))
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

		content_result = Result.of(lambda: response.content.decode('utf-8'))

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
			# -- Damned content-type header!

			return Success(get_netloc(uri))










def extract_html_title(content_type, url, response):
	# -- extract the title tag.
	# -- default to utf-8, a superset of iso-8859 encoding.

	charset = content_type['params'].get('charset', 'utf-8').lower( )

	if charset in {'iso-8859-1', 'utf-8', 'utf8'}:
		return extract_utf8_title(url, response)
	else:
		# -- add iso8859-1 support
		return get_netloc(url)





def extract_pdf_title(content_type, url, response):
	"""
	extract a title from a pdf file.
	"""

	try:

		stream = io.BytesIO(response.content)

		# -- such a beautiful api; wtf is this crap even doing? do not trust this stuff for a second.

		parser = pdfparser.PDFParser(stream)

		doc    = pdfparser.PDFDocument( )
		parser.set_document(doc)
		doc.set_parser(parser)

		doc.initialize( )

		info = doc.info[0]

		if not 'Title' in info:
			return extract_resource_name(url)
		else:

			title = doc.info[0]['Title']

			if title == "" or not isinstance(title, str):
				return extract_resource_name(url)
			else:
				return title

	except Exception as err:
		# -- in the extraordinarily unlikely case the solid code above doesn't work \s,
		# -- fall back to extracting the resource name.

		logger.warning('pdf title extraction failed; falling back to URI: %s', str(err))

		return extract_resource_name(uri)






def extract_title(response, uri):
	"""given a uri, response obtained from looking up that uri, pick a title for
	the bookmark uri.

	If the resource is a html page, use the contents of the <title> tag. Otherwise
	just use the resource basename.
	"""

	if 'content-type' in response.headers:
		content_type_result = mimetype.parse(response.headers['content-type'])
	else:
		content_type_result = Failure({
			'message': "%s content type not declared." % (uri, ),
			'code':    '404'
		})





	if content_type_result.is_failure( ):

		return content_type_result

	else:

		content_type = content_type_result.from_success( )
		mime         = content_type['type'] + '/' + content_type['subtype']

		if mimetype.is_html(mime):

			return extract_html_title(content_type_result.from_success( ), uri, response)

		elif mimetype.is_pdf(mime):

			return extract_pdf_title(content_type_result.from_success( ), uri, response)

		else:
			return extract_resource_name(uri)





def extract_metadata(content_response, uri):
	"""
	extract additional data about a uri from the resource itself.
	"""

	return Result.of(lambda: extract_title(uri, content_response))
