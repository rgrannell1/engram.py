#!/usr/bin/env python3

import sql
import utils

from result          import Success, Failure
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

	fetch_result = (
		Success(db)
		.then(lambda db:  sql.select_archive(db, id))
	)

	return render_response( *fetch_result.from_success( ) )
