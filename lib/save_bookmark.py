#!/usr/bin/env python

import html
import sql
import utils

from result           import Success, Failure
from extract_metadata import extract_metadata

from urlparse         import urlparse



def save_bookmark(db_result, path):
	"""save a bookmark to a database.

	save_bookmark :: Result Database x string -> string, number

	this is triggered by a GET request, so it has perverse
	behaviour. It returns a 304 when the save succeeds so the
	browser doesn't leave the current page.

	This is bad when you are already on the page generated upon
	failure, and then you get the result right it doesn't update.
	"""

	insert_result = (
		Success(path)
		.tap(urlparse)
		.then(extract_metadata)
		.then( lambda title: sql.insert_bookmark(db_result, title, path, utils.now()) )
	)

	if insert_result.is_failure():

		message = "failed to add %s: '%s'" % (path, insert_result.from_failure())
		return message, 500

	else:
		return '', 304
