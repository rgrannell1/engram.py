#!/usr/bin/env python3

import sql
import utils

from result          import Success, Failure, Result
import mimetype

from display_result   import display_result

import logging
logging.basicConfig(level =  logging.INFO)
logger = logging.getLogger(__name__)





def render_response(archive_id, content, mimetype, ctime):

	return content, 200, {
		'Content-Type': mimetype
	}






def serve_archive(db, id):
	"""
	given a bookmark id, return an archived copy of the URI's resource.
	"""

	fetch_result = (
		Result.of(lambda: sql.select_archive(db, id))
		.then(lambda rows: rows[0])
	)

	if fetch_result.is_failure( ):

		failure = fetch_result.from_failure( )

		try:

			raise failure

		except IndexError as err:

			return display_result( Success({
				'message': 'nothing to see here yet.',
				'code':    '404'

			}) )

		except Exception as err:

			return display_result( Failure({
				'message': 'failed to load resource: %s' % ( str(failure) ),
				'code':    '500'
			}) )

	else:
		return render_response(*fetch_result.from_success( ))
