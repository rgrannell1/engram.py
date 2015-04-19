#!/usr/bin/env python3

import sql
import utils

from result           import Ok, Err, Result
from extract_metadata import extract_metadata

import normalise_uri

import urllib
from bookmark         import bookmark, getID
from display_result   import display_result
from request_url      import request_url

from archive_content  import archive_content
from db               import Database, WriteJob, ReadJob






def save_bookmark(database_in, database_out, url, time):
	"""save a bookmark to a database.

	this is triggered by a GET request, so it has perverse
	behaviour. It returns a 204 when the save succeeds so the
	browser doesn't leave the current page.

	This is bad when you are already on the page generated upon
	failure, and then you get the result right it doesn't update.
	"""

	url_result     = Result.of(lambda: normalise_uri.normalise_uri(url))
	content_result = url_result.then(request_url)

	title_result   = (
		url_result
		.cross([content_result])
		.then(lambda pair: extract_metadata(*pair))
	)

	if title_result.is_ok( ):

		job = WriteJob(
			"INSERT INTO bookmarks VALUES (NULL, ?, ?, ?);",
			(normalise_uri.add_default_scheme(url), title_result.from_ok( ), time)
		)

		database_in.put(job)

		insert_result = (

			Result.of( lambda: database_out[id(job)] )
			.then( lambda _: {
				'message': '',
				'code':    204
			})

		)

	else:
		insert_result = title_result

	# -- TODO account for failed archiving.
	#archive_result = (
	#	content_result
	#	.cross([url_result])
	#	.tap( lambda pair: archive_content(db, pair[0], pair[1]) )
	#)

	return display_result(insert_result)
