#!/usr/bin/env python3

import sql
import utils

from result          import Success, Failure, Result

import mimetype
from request_url     import request_url

from bookmark        import bookmark, getID

import logging
import pdfkit
import signal

logging.basicConfig(level =  logging.INFO)
logger = logging.getLogger(__name__)





def timeout_handler(time):
	raise TimeoutError('page timed out.')

def download_pdf(url):
	return pdfkit.from_url(url, False)





def archive_content(db, response, url):
	"""save a copy of a resource to the database, given a url and a response
	containing the resource that url points to.
	"""

	raw_content_type    = response.headers['content-type']
	content_type_result = mimetype.parse(raw_content_type)

	if content_type_result.is_failure( ):
		return content_type_result
	else:

		id_result = (
			Result.of(lambda: sql.select_max_bookmark(db))
			.then(lambda rows: rows[0][0])
		)

		content_type = content_type_result.from_success( )
		mime         = content_type['type'] + '/' + content_type['subtype']

		if mimetype.is_html(mime):

			# -- this isn't working amazingly well; very slow, additional requests.
			# -- seems to cause memory leaks, code is nastly.
			# -- doesn't time out for bad resources.

			signal.signal(signal.SIGALRM, timeout_handler)
			signal.alarm(30)

			try:
				content = download_pdf(url)
			except TimeoutError as err:
				content = ""






			return (
				id_result
				.then( lambda id: sql.insert_archive(db, id, content, 'application/pdf', utils.now( )) )
			)

		else:

			return (
				Result.of(lambda: request_url(url))
				.cross([id_result])
				.then( lambda pair: sql.insert_archive(
					db,
					pair[1], pair[0].content,
					raw_content_type,
					utils.now( ))
				)
			)
