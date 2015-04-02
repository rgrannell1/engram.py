
#!/usr/bin/env python3

import os
import re
import utils

import urllib

import json
import lxml
import lxml.html as lh

import subprocess


from normalise_uri import normalise_uri
from result import Success, Failure, Result

import mimetype
from pdfminer import pdfparser

import io
import signal
import subprocess

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





def extract_utf8_tag(tag, uri, response):
	"""extract a page title from a utf-8 html page.
	"""

	parsed = lh.fromstring(response.content)
	title  = parsed.find('.//' + tag)

	if not (title is None) and title.text and title.text.strip( ):

		return Success(title.text.strip( ))

	else:
		# -- most likely caused by lxml's problems with UTF;
		# -- use a regular expression fallback.

		content_result = Result.of(lambda: response.content.decode('utf-8'))

		if content_result.is_success( ):
			# -- decoding as utf-8 worked.

			content      = content_result.from_success( )

			# -- not good enough! fails for inner hags like <h1><i></i></h1>
			title_regexp = re.compile('<%s[^>]*>([^<]+)</%s>' % (tag, tag))
			title_match  = title_regexp.search(content)

			if title_match:

				group = title_match.group( )

				if group and group.strip( ):
					return Success(group.strip( ))

			return Failure('empty %s tag.' % tag)

		else:

			return Failure('unable to decode title')






def choose_best_title(url, *args):
	"""given several title results, ordered by their likelihood
	to be good titles, select the best working title.

	"""

	default   = ( Success(get_netloc(url)), )
	successes = [result for result in args + default if result and result.is_success( )]

	non_empty = [result for result in successes if len(result.from_success( )) > 0]

	return non_empty[0]






def extract_html_title(content_type, url, response):
	# -- extract the title tag.
	# -- default to utf-8, a superset of iso-8859 encoding.




	output   = subprocess.check_output(['node', '%s/engram/extract_title.js' % (os.getcwd( ), ), url])
	metadata = json.loads(output.decode('utf8'))

	if not metadata['status']['errored']:

		return choose_best_title(
			url,
			Success(metadata['data']['h1']),
			Success(metadata['data']['title'])
		)

	else:

		print(metadata)

		return Failure({
			"message": "errner",
			"code":    "404"
		})





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





def extract_metadata(uri, content_response):
	"""
	extract additional data about a uri from the resource itself.
	"""

	return Result.of( lambda: extract_title(content_response, urllib.parse.unquote(uri)) )
