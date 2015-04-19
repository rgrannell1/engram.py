#!/usr/bin/env python3

import sql
import utils

from result           import Ok, Err, Result
import mimetype

from display_result   import display_result

import logging
logging.basicConfig(level =  logging.INFO)
logger = logging.getLogger(__name__)





def render_response(archive_id, content, mimetype, ctime):

	return content, 200, {
		'Content-Type': mimetype
	}






def serve_archive(database_in, database_out, id):
	"""
	given a bookmark id, return an archived copy of the URI's resource.
	"""

	job = ReadJob("""
		SELECT * FROM archives
		WHERE archive_id == (
			SELECT archive_id
			FROM bookmark_archives
			WHERE bookmark_id == ?);
		""",
		(id, )
	)

	database_in.put(job)




	fetch_result = (
		Result.of( lambda: database_out[id(job)] )
		.then(lambda rows: rows[0])
	)

	if fetch_result.is_err( ):

		failure = fetch_result.from_err( )

		try:

			raise failure

		except IndexError as err:

			return display_result( Ok({
				'message': 'nothing to see here yet.',
				'code':    '404'

			}) )

		except Exception as err:

			return display_result( Err({
				'message': 'failed to load resource: %s' % ( str(failure) ),
				'code':    '500'
			}) )

	else:
		return render_response(*fetch_result.from_ok( ))
